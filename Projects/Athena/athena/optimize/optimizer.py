"""Hyperparameter optimization using Optuna."""

import json
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional

import optuna
import pandas as pd
from optuna.pruners import MedianPruner
from optuna.samplers import TPESampler

from athena.backtest.engine import BacktestEngine
from athena.core.config import settings
from athena.core.logging import get_logger

logger = get_logger(__name__)


class StrategyOptimizer:
    """Optuna-based strategy parameter optimizer."""

    def __init__(
        self,
        initial_capital: float = None,
        commission: float = None,
        n_jobs: int = 1,
        random_state: int = 42,
    ):
        """Initialize optimizer.

        Args:
            initial_capital: Initial capital for backtests
            commission: Commission rate
            n_jobs: Number of parallel jobs
            random_state: Random seed for reproducibility
        """
        self.initial_capital = initial_capital or settings.default_initial_capital
        self.commission = commission or settings.default_commission
        self.n_jobs = n_jobs
        self.random_state = random_state

        # Initialize backtest engine
        self.engine = BacktestEngine(
            initial_capital=self.initial_capital, commission=self.commission
        )

    def optimize(
        self,
        strategy_class: type,
        data: pd.DataFrame,
        symbol: str,
        param_space: Dict[str, Dict],
        n_trials: int = 100,
        timeout: Optional[int] = None,
        objective_weights: Dict[str, float] = None,
    ) -> Dict[str, Any]:
        """Optimize strategy parameters.

        Args:
            strategy_class: Strategy class to optimize
            data: OHLCV data for optimization
            symbol: Symbol being optimized
            param_space: Parameter search space
            n_trials: Number of optimization trials
            timeout: Timeout in seconds
            objective_weights: Weights for multi-objective optimization

        Returns:
            Optimization results including best parameters
        """
        if objective_weights is None:
            objective_weights = {"sharpe": 0.7, "drawdown_penalty": 0.3}

        logger.info(
            f"Starting optimization for {strategy_class.__name__}",
            symbol=symbol,
            n_trials=n_trials,
            param_space=list(param_space.keys()),
        )

        # Create study
        study = optuna.create_study(
            direction="maximize",
            sampler=TPESampler(seed=self.random_state),
            pruner=MedianPruner(n_startup_trials=10),
        )

        # Define objective function
        def objective(trial: optuna.Trial) -> float:
            """Objective function for optimization."""
            # Sample parameters
            params = {}
            for param_name, param_config in param_space.items():
                param_type = param_config["type"]

                if param_type == "int":
                    params[param_name] = trial.suggest_int(
                        param_name,
                        param_config["low"],
                        param_config["high"],
                        step=param_config.get("step", 1),
                    )
                elif param_type == "float":
                    params[param_name] = trial.suggest_float(
                        param_name,
                        param_config["low"],
                        param_config["high"],
                        step=param_config.get("step"),
                    )
                elif param_type == "categorical":
                    params[param_name] = trial.suggest_categorical(
                        param_name, param_config["choices"]
                    )

            # Create strategy with sampled parameters
            try:
                strategy = strategy_class(**params)
            except Exception as e:
                logger.warning(f"Invalid parameters: {params}, error: {e}")
                return -999  # Penalize invalid parameters

            # Run backtest
            try:
                result = self.engine.run(strategy, data, symbol)

                # Calculate composite objective
                sharpe_component = result.sharpe_ratio * objective_weights["sharpe"]

                # Drawdown penalty (less negative drawdown is better)
                dd_penalty = (1 - result.max_drawdown) * objective_weights["drawdown_penalty"]

                objective_value = sharpe_component + dd_penalty

                # Store additional metrics for analysis
                trial.set_user_attr("total_return", result.total_return)
                trial.set_user_attr("max_drawdown", result.max_drawdown)
                trial.set_user_attr("win_rate", result.win_rate)
                trial.set_user_attr("total_trades", result.total_trades)

                return objective_value

            except Exception as e:
                logger.warning(f"Backtest failed for params {params}: {e}")
                return -999

        # Run optimization
        study.optimize(
            objective,
            n_trials=n_trials,
            timeout=timeout,
            n_jobs=self.n_jobs,
            show_progress_bar=True,
        )

        # Get best trial
        best_trial = study.best_trial
        best_params = best_trial.params

        logger.info(
            "Optimization completed",
            best_objective=f"{best_trial.value:.4f}",
            best_params=best_params,
        )

        # Compile results
        results = {
            "best_params": best_params,
            "best_objective": best_trial.value,
            "best_sharpe": best_trial.user_attrs.get("sharpe_ratio", 0),
            "best_return": best_trial.user_attrs.get("total_return", 0),
            "best_max_dd": best_trial.user_attrs.get("max_drawdown", 0),
            "best_win_rate": best_trial.user_attrs.get("win_rate", 0),
            "best_trades": best_trial.user_attrs.get("total_trades", 0),
            "n_trials": len(study.trials),
            "study": study,
            "optimization_time": datetime.now().isoformat(),
            "symbol": symbol,
            "strategy": strategy_class.__name__,
        }

        return results

    def save_results(self, results: Dict[str, Any], output_dir: Path = None) -> Path:
        """Save optimization results to file.

        Args:
            results: Optimization results
            output_dir: Output directory

        Returns:
            Path to saved file
        """
        if output_dir is None:
            output_dir = Path("artifacts/best_params")

        output_dir.mkdir(parents=True, exist_ok=True)

        # Create filename
        filename = f"{results['strategy']}_{results['symbol']}.json"
        output_path = output_dir / filename

        # Prepare serializable results
        serializable_results = {
            "best_params": results["best_params"],
            "best_objective": results["best_objective"],
            "best_sharpe": results["best_sharpe"],
            "best_return": results["best_return"],
            "best_max_dd": results["best_max_dd"],
            "best_win_rate": results["best_win_rate"],
            "best_trades": results["best_trades"],
            "n_trials": results["n_trials"],
            "optimization_time": results["optimization_time"],
            "symbol": results["symbol"],
            "strategy": results["strategy"],
        }

        # Save to file
        with open(output_path, "w") as f:
            json.dump(serializable_results, f, indent=2)

        logger.info(f"Optimization results saved to {output_path}")
        return output_path

    def load_best_params(
        self, strategy_name: str, symbol: str, params_dir: Path = None
    ) -> Optional[Dict]:
        """Load best parameters for a strategy-symbol combination.

        Args:
            strategy_name: Strategy name
            symbol: Symbol
            params_dir: Directory containing parameter files

        Returns:
            Best parameters or None if not found
        """
        if params_dir is None:
            params_dir = Path("artifacts/best_params")

        params_file = params_dir / f"{strategy_name}_{symbol}.json"

        if not params_file.exists():
            logger.warning(f"No saved parameters found: {params_file}")
            return None

        try:
            with open(params_file, "r") as f:
                results = json.load(f)
            return results["best_params"]
        except Exception as e:
            logger.error(f"Failed to load parameters: {e}")
            return None


def get_sma_param_space() -> Dict[str, Dict]:
    """Get parameter space for SMA Crossover strategy."""
    return {
        "fast_period": {"type": "int", "low": 5, "high": 50, "step": 1},
        "slow_period": {"type": "int", "low": 20, "high": 200, "step": 5},
    }


def get_bollinger_param_space() -> Dict[str, Dict]:
    """Get parameter space for Bollinger Bands strategy."""
    return {
        "period": {"type": "int", "low": 10, "high": 50, "step": 1},
        "std_dev": {"type": "float", "low": 1.0, "high": 3.0, "step": 0.1},
        "rsi_period": {"type": "int", "low": 10, "high": 30, "step": 1},
    }


def get_momentum_param_space() -> Dict[str, Dict]:
    """Get parameter space for Momentum strategy."""
    return {
        "rsi_period": {"type": "int", "low": 5, "high": 30, "step": 1},
        "rsi_overbought": {"type": "float", "low": 65, "high": 85, "step": 1},
        "rsi_oversold": {"type": "float", "low": 15, "high": 35, "step": 1},
        "macd_fast": {"type": "int", "low": 8, "high": 20, "step": 1},
        "macd_slow": {"type": "int", "low": 20, "high": 35, "step": 1},
        "macd_signal": {"type": "int", "low": 5, "high": 15, "step": 1},
    }


def get_param_space(strategy_name: str) -> Dict[str, Dict]:
    """Get parameter space for a given strategy.

    Args:
        strategy_name: Name of the strategy

    Returns:
        Parameter space dictionary
    """
    param_spaces = {
        "sma": get_sma_param_space,
        "sma_crossover": get_sma_param_space,
        "bollinger": get_bollinger_param_space,
        "momentum": get_momentum_param_space,
    }

    if strategy_name.lower() not in param_spaces:
        raise ValueError(f"Unknown strategy: {strategy_name}")

    return param_spaces[strategy_name.lower()]()
