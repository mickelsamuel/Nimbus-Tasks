"""Walk-forward validation for robust strategy testing."""

import json
from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional

import numpy as np
import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots

from athena.backtest.engine import BacktestEngine
from athena.core.logging import get_logger
from athena.core.types import BacktestResult
from athena.strategies.base import BaseStrategy

logger = get_logger(__name__)


@dataclass
class WalkForwardWindow:
    """Single walk-forward window."""

    train_start: datetime
    train_end: datetime
    test_start: datetime
    test_end: datetime
    train_result: Optional[BacktestResult] = None
    test_result: Optional[BacktestResult] = None
    best_params: Optional[Dict] = None


@dataclass
class WalkForwardResult:
    """Walk-forward validation results."""

    symbol: str
    strategy_name: str
    windows: List[WalkForwardWindow]
    avg_sharpe: float
    avg_return: float
    avg_max_dd: float
    avg_win_rate: float
    total_trades: int
    oos_equity_curve: pd.Series  # Out-of-sample combined equity
    metadata: Dict


class WalkForwardValidator:
    """Walk-forward validation engine."""

    def __init__(
        self,
        train_period_days: int = 365,
        test_period_days: int = 90,
        step_days: Optional[int] = None,
        anchored: bool = False,
    ):
        """Initialize walk-forward validator.

        Args:
            train_period_days: Training period in days
            test_period_days: Testing period in days
            step_days: Step size for rolling window (defaults to test_period_days)
            anchored: If True, training window expands; if False, it rolls
        """
        self.train_period_days = train_period_days
        self.test_period_days = test_period_days
        self.step_days = step_days or test_period_days
        self.anchored = anchored

    def create_windows(
        self,
        data: pd.DataFrame,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ) -> List[WalkForwardWindow]:
        """Create walk-forward windows.

        Args:
            data: OHLCV data with datetime index
            start_date: Start date for analysis
            end_date: End date for analysis

        Returns:
            List of walk-forward windows
        """
        # Get data date range
        data_start = data.index.min()
        data_end = data.index.max()

        # Use provided dates or data dates
        start_date = start_date or data_start
        end_date = end_date or data_end

        windows = []
        current_date = start_date

        while current_date < end_date:
            # Calculate train period
            if self.anchored:
                train_start = start_date
            else:
                train_start = current_date

            train_end = train_start + timedelta(days=self.train_period_days)

            # Calculate test period
            test_start = train_end
            test_end = test_start + timedelta(days=self.test_period_days)

            # Check if we have enough data
            if test_end > data_end:
                break

            windows.append(
                WalkForwardWindow(
                    train_start=train_start,
                    train_end=train_end,
                    test_start=test_start,
                    test_end=test_end,
                )
            )

            # Move to next window
            current_date += timedelta(days=self.step_days)

        logger.info(f"Created {len(windows)} walk-forward windows")
        return windows

    def run(
        self,
        strategy: BaseStrategy,
        data: pd.DataFrame,
        symbol: str,
        optimize_func: Optional[callable] = None,
        initial_capital: float = 100000,
        commission: float = 0.001,
    ) -> WalkForwardResult:
        """Run walk-forward validation.

        Args:
            strategy: Strategy instance
            data: OHLCV data
            symbol: Symbol being tested
            optimize_func: Optional function to optimize parameters on training data
            initial_capital: Initial capital for each window
            commission: Commission rate

        Returns:
            WalkForwardResult with aggregated metrics
        """
        logger.info(
            f"Starting walk-forward validation for {strategy.name} on {symbol}",
            train_days=self.train_period_days,
            test_days=self.test_period_days,
        )

        # Create windows
        windows = self.create_windows(data)

        if not windows:
            raise ValueError("No valid windows created from data")

        # Initialize backtest engine
        engine = BacktestEngine(initial_capital=initial_capital, commission=commission)

        # Process each window
        oos_equity_parts = []

        for i, window in enumerate(windows):
            logger.info(f"Processing window {i+1}/{len(windows)}")

            # Get train and test data
            train_data = data[(data.index >= window.train_start) & (data.index < window.train_end)]
            test_data = data[(data.index >= window.test_start) & (data.index < window.test_end)]

            # Optimize on training data if function provided
            if optimize_func:
                best_params = optimize_func(strategy, train_data)
                window.best_params = best_params
                strategy.set_parameters(**best_params)

            # Backtest on training data
            window.train_result = engine.run(strategy, train_data, symbol)

            # Backtest on test data (out-of-sample)
            window.test_result = engine.run(strategy, test_data, symbol)

            # Collect out-of-sample equity
            oos_equity_parts.append(window.test_result.equity_curve)

        # Combine out-of-sample equity curves
        oos_equity_curve = pd.concat(oos_equity_parts, axis=0)
        oos_equity_curve = oos_equity_curve.sort_index()

        # Calculate aggregate metrics
        test_results = [w.test_result for w in windows if w.test_result]

        avg_sharpe = np.mean([r.sharpe_ratio for r in test_results])
        avg_return = np.mean([r.annual_return for r in test_results])
        avg_max_dd = np.mean([r.max_drawdown for r in test_results])
        avg_win_rate = np.mean([r.win_rate for r in test_results])
        total_trades = sum([r.total_trades for r in test_results])

        result = WalkForwardResult(
            symbol=symbol,
            strategy_name=strategy.name,
            windows=windows,
            avg_sharpe=avg_sharpe,
            avg_return=avg_return,
            avg_max_dd=avg_max_dd,
            avg_win_rate=avg_win_rate,
            total_trades=total_trades,
            oos_equity_curve=oos_equity_curve,
            metadata={
                "train_period_days": self.train_period_days,
                "test_period_days": self.test_period_days,
                "step_days": self.step_days,
                "anchored": self.anchored,
                "num_windows": len(windows),
            },
        )

        logger.info(
            "Walk-forward validation complete",
            avg_sharpe=f"{avg_sharpe:.2f}",
            avg_return=f"{avg_return:.2%}",
            avg_max_dd=f"{avg_max_dd:.2%}",
        )

        return result

    def export_results(self, result: WalkForwardResult, output_dir: Path) -> Dict[str, Path]:
        """Export walk-forward results to CSV and plots.

        Args:
            result: Walk-forward validation result
            output_dir: Output directory

        Returns:
            Dictionary with paths to exported files
        """
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        prefix = f"{result.symbol}_{result.strategy_name}_{timestamp}"

        exported_files = {}

        # Export metrics to CSV
        metrics_data = []
        for i, window in enumerate(result.windows):
            if window.test_result:
                metrics_data.append(
                    {
                        "Window": i + 1,
                        "Train Start": window.train_start.strftime("%Y-%m-%d"),
                        "Train End": window.train_end.strftime("%Y-%m-%d"),
                        "Test Start": window.test_start.strftime("%Y-%m-%d"),
                        "Test End": window.test_end.strftime("%Y-%m-%d"),
                        "Train Sharpe": (
                            window.train_result.sharpe_ratio if window.train_result else None
                        ),
                        "Test Sharpe": window.test_result.sharpe_ratio,
                        "Test Return": window.test_result.total_return,
                        "Test Max DD": window.test_result.max_drawdown,
                        "Test Win Rate": window.test_result.win_rate,
                        "Test Trades": window.test_result.total_trades,
                    }
                )

        metrics_df = pd.DataFrame(metrics_data)
        metrics_path = output_dir / f"{prefix}_metrics.csv"
        metrics_df.to_csv(metrics_path, index=False)
        exported_files["metrics"] = metrics_path

        # Export summary
        summary = {
            "symbol": result.symbol,
            "strategy": result.strategy_name,
            "avg_sharpe": result.avg_sharpe,
            "avg_return": result.avg_return,
            "avg_max_dd": result.avg_max_dd,
            "avg_win_rate": result.avg_win_rate,
            "total_trades": result.total_trades,
            **result.metadata,
        }

        summary_path = output_dir / f"{prefix}_summary.json"
        with open(summary_path, "w") as f:
            json.dump(summary, f, indent=2)
        exported_files["summary"] = summary_path

        # Create plots
        plot_path = self._create_plots(result, output_dir, prefix)
        exported_files["plots"] = plot_path

        logger.info(f"Exported walk-forward results to {output_dir}")
        return exported_files

    def _create_plots(self, result: WalkForwardResult, output_dir: Path, prefix: str) -> Path:
        """Create visualization plots for walk-forward results.

        Args:
            result: Walk-forward validation result
            output_dir: Output directory
            prefix: File prefix

        Returns:
            Path to saved plot
        """
        # Create subplots
        fig = make_subplots(
            rows=3,
            cols=2,
            subplot_titles=(
                "Out-of-Sample Equity Curve",
                "Window Performance",
                "Rolling Sharpe Ratio",
                "Rolling Returns",
                "Drawdown Analysis",
                "Trade Distribution",
            ),
            specs=[
                [{"type": "scatter"}, {"type": "bar"}],
                [{"type": "scatter"}, {"type": "scatter"}],
                [{"type": "scatter"}, {"type": "histogram"}],
            ],
        )

        # 1. Out-of-sample equity curve
        fig.add_trace(
            go.Scatter(
                x=result.oos_equity_curve.index,
                y=result.oos_equity_curve.values,
                mode="lines",
                name="OOS Equity",
                line=dict(color="blue", width=2),
            ),
            row=1,
            col=1,
        )

        # 2. Window performance comparison
        windows_data = []
        for i, window in enumerate(result.windows):
            if window.test_result:
                windows_data.append(
                    {
                        "Window": i + 1,
                        "Train Return": (
                            window.train_result.total_return if window.train_result else 0
                        ),
                        "Test Return": window.test_result.total_return,
                    }
                )

        if windows_data:
            windows_df = pd.DataFrame(windows_data)
            fig.add_trace(
                go.Bar(
                    x=windows_df["Window"],
                    y=windows_df["Train Return"],
                    name="Train Return",
                    marker_color="lightblue",
                ),
                row=1,
                col=2,
            )
            fig.add_trace(
                go.Bar(
                    x=windows_df["Window"],
                    y=windows_df["Test Return"],
                    name="Test Return",
                    marker_color="darkblue",
                ),
                row=1,
                col=2,
            )

        # 3. Rolling Sharpe ratio
        sharpe_values = [w.test_result.sharpe_ratio for w in result.windows if w.test_result]
        window_indices = list(range(1, len(sharpe_values) + 1))

        fig.add_trace(
            go.Scatter(
                x=window_indices,
                y=sharpe_values,
                mode="lines+markers",
                name="Sharpe Ratio",
                line=dict(color="green"),
            ),
            row=2,
            col=1,
        )

        # 4. Rolling returns
        returns = [w.test_result.total_return for w in result.windows if w.test_result]
        fig.add_trace(
            go.Scatter(
                x=window_indices,
                y=returns,
                mode="lines+markers",
                name="Returns",
                line=dict(color="orange"),
            ),
            row=2,
            col=2,
        )

        # 5. Drawdown analysis
        dd_values = [-w.test_result.max_drawdown for w in result.windows if w.test_result]
        fig.add_trace(
            go.Scatter(
                x=window_indices,
                y=dd_values,
                mode="lines+markers",
                name="Max Drawdown",
                line=dict(color="red"),
                fill="tozeroy",
            ),
            row=3,
            col=1,
        )

        # 6. Trade distribution
        all_trades = []
        for window in result.windows:
            if window.test_result and window.test_result.trades:
                all_trades.extend([t.pnl for t in window.test_result.trades if t.pnl])

        if all_trades:
            fig.add_trace(
                go.Histogram(x=all_trades, nbinsx=30, name="Trade PnL", marker_color="purple"),
                row=3,
                col=2,
            )

        # Update layout
        fig.update_layout(
            title=f"Walk-Forward Validation: {result.symbol} - {result.strategy_name}",
            showlegend=True,
            height=900,
            template="plotly_white",
        )

        # Save plot
        plot_path = output_dir / f"{prefix}_plots.html"
        fig.write_html(str(plot_path))

        return plot_path
