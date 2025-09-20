"""Backtesting engine using vectorbt."""

from datetime import datetime
from typing import Dict, List

import numpy as np
import pandas as pd
import vectorbt as vbt

from athena.core.config import settings
from athena.core.logging import get_logger
from athena.core.types import BacktestResult, Trade
from athena.strategies.base import BaseStrategy

logger = get_logger(__name__)


class BacktestEngine:
    """Vectorized backtesting engine."""

    def __init__(
        self, initial_capital: float = None, commission: float = None, slippage: float = 0.001
    ):
        """Initialize backtest engine.

        Args:
            initial_capital: Starting capital
            commission: Commission rate (e.g., 0.001 for 0.1%)
            slippage: Slippage rate
        """
        self.initial_capital = initial_capital or settings.default_initial_capital
        self.commission = commission or settings.default_commission
        self.slippage = slippage

    def run(
        self, strategy: BaseStrategy, data: pd.DataFrame, symbol: str = "ASSET"
    ) -> BacktestResult:
        """Run backtest for a strategy.

        Args:
            strategy: Strategy instance
            data: OHLCV data
            symbol: Symbol being traded

        Returns:
            BacktestResult with metrics and equity curve
        """
        logger.info(
            f"Running backtest for {strategy.name} on {symbol}",
            initial_capital=self.initial_capital,
            commission=self.commission,
        )

        # Generate signals
        signals = strategy.generate_signals(data)

        # Prepare data for vectorbt
        close_prices = data["close"]

        # Convert signals to entries and exits
        entries = signals == 1
        exits = signals == -1

        # Run vectorized backtest with vectorbt
        portfolio = vbt.Portfolio.from_signals(
            close=close_prices,
            entries=entries,
            exits=exits,
            init_cash=self.initial_capital,
            fees=self.commission,
            slippage=self.slippage,
            freq="D",  # Daily frequency
        )

        # Extract metrics
        result = self._calculate_metrics(portfolio, signals, data, symbol)

        logger.info(
            "Backtest completed",
            total_return=f"{result.total_return:.2%}",
            sharpe_ratio=f"{result.sharpe_ratio:.2f}",
            max_drawdown=f"{result.max_drawdown:.2%}",
            total_trades=result.total_trades,
        )

        return result

    def _calculate_metrics(
        self, portfolio: vbt.Portfolio, signals: pd.Series, data: pd.DataFrame, symbol: str
    ) -> BacktestResult:
        """Calculate backtest metrics from portfolio.

        Args:
            portfolio: Vectorbt portfolio object
            signals: Trading signals
            data: OHLCV data
            symbol: Symbol being traded

        Returns:
            BacktestResult with calculated metrics
        """
        # Get trades
        trades_df = portfolio.trades.records_readable
        trades = self._convert_trades(trades_df, symbol)

        # Calculate returns
        total_return = portfolio.total_return()
        annual_return = portfolio.annualized_return()

        # Risk metrics
        sharpe_ratio = portfolio.sharpe_ratio() if not np.isnan(portfolio.sharpe_ratio()) else 0
        sortino_ratio = portfolio.sortino_ratio() if not np.isnan(portfolio.sortino_ratio()) else 0
        max_drawdown = portfolio.max_drawdown()

        # Trade statistics
        if len(trades) > 0:
            trade_returns = [t.pnl for t in trades if t.pnl is not None]
            winning_trades = [r for r in trade_returns if r > 0]
            losing_trades = [r for r in trade_returns if r < 0]

            win_rate = len(winning_trades) / len(trades) if len(trades) > 0 else 0
            avg_win = np.mean(winning_trades) if winning_trades else 0
            avg_loss = np.mean(losing_trades) if losing_trades else 0
            best_trade = max(trade_returns) if trade_returns else 0
            worst_trade = min(trade_returns) if trade_returns else 0

            # Profit factor
            total_wins = sum(winning_trades) if winning_trades else 0
            total_losses = abs(sum(losing_trades)) if losing_trades else 0
            profit_factor = total_wins / total_losses if total_losses > 0 else 0
        else:
            win_rate = avg_win = avg_loss = best_trade = worst_trade = profit_factor = 0
            winning_trades = []
            losing_trades = []

        # Get equity curve
        equity_curve = portfolio.value()

        # Get daily returns
        daily_returns = portfolio.returns()

        return BacktestResult(
            initial_capital=self.initial_capital,
            final_capital=portfolio.final_value(),
            total_return=total_return,
            annual_return=annual_return,
            sharpe_ratio=sharpe_ratio,
            sortino_ratio=sortino_ratio,
            max_drawdown=max_drawdown,
            win_rate=win_rate,
            profit_factor=profit_factor,
            total_trades=len(trades),
            winning_trades=len(winning_trades),
            losing_trades=len(losing_trades),
            avg_win=avg_win,
            avg_loss=avg_loss,
            best_trade=best_trade,
            worst_trade=worst_trade,
            equity_curve=equity_curve,
            trades=trades,
            daily_returns=daily_returns,
        )

    def _convert_trades(self, trades_df: pd.DataFrame, symbol: str) -> List[Trade]:
        """Convert vectorbt trades to Trade objects.

        Args:
            trades_df: Vectorbt trades dataframe
            symbol: Symbol being traded

        Returns:
            List of Trade objects
        """
        trades = []

        for _, row in trades_df.iterrows():
            trade = Trade(
                symbol=symbol,
                side=row.get("Side", "Buy"),
                quantity=row.get("Size", 0),
                price=row.get("Avg Entry Price", 0),
                timestamp=row.get("Entry Timestamp", datetime.now()),
                commission=row.get("Fees", 0),
                pnl=row.get("PnL", 0),
            )
            trades.append(trade)

        return trades

    def run_multiple(
        self, strategy: BaseStrategy, data_dict: Dict[str, pd.DataFrame]
    ) -> Dict[str, BacktestResult]:
        """Run backtest on multiple symbols.

        Args:
            strategy: Strategy instance
            data_dict: Dictionary mapping symbols to data

        Returns:
            Dictionary mapping symbols to results
        """
        results = {}

        for symbol, data in data_dict.items():
            try:
                result = self.run(strategy, data, symbol)
                results[symbol] = result
            except Exception as e:
                logger.error(f"Failed to backtest {symbol}: {e}")
                continue

        return results
