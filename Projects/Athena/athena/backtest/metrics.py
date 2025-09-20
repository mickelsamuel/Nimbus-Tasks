"""Performance metrics calculation utilities."""

from typing import Dict

import numpy as np
import pandas as pd

from athena.core.types import BacktestResult


def calculate_sharpe_ratio(
    returns: pd.Series, risk_free_rate: float = 0.02, periods: int = 252
) -> float:
    """Calculate Sharpe ratio.

    Args:
        returns: Daily returns series
        risk_free_rate: Annual risk-free rate
        periods: Number of periods per year (252 for daily)

    Returns:
        Sharpe ratio
    """
    if len(returns) < 2:
        return 0.0

    excess_returns = returns - risk_free_rate / periods

    if excess_returns.std() == 0:
        return 0.0

    return np.sqrt(periods) * excess_returns.mean() / excess_returns.std()


def calculate_sortino_ratio(
    returns: pd.Series, risk_free_rate: float = 0.02, periods: int = 252
) -> float:
    """Calculate Sortino ratio (uses downside deviation).

    Args:
        returns: Daily returns series
        risk_free_rate: Annual risk-free rate
        periods: Number of periods per year

    Returns:
        Sortino ratio
    """
    if len(returns) < 2:
        return 0.0

    excess_returns = returns - risk_free_rate / periods
    downside_returns = excess_returns[excess_returns < 0]

    if len(downside_returns) == 0 or downside_returns.std() == 0:
        return 0.0

    return np.sqrt(periods) * excess_returns.mean() / downside_returns.std()


def calculate_max_drawdown(equity_curve: pd.Series) -> float:
    """Calculate maximum drawdown.

    Args:
        equity_curve: Equity curve series

    Returns:
        Maximum drawdown as decimal (e.g., 0.20 for 20%)
    """
    if len(equity_curve) < 2:
        return 0.0

    # Calculate running maximum
    running_max = equity_curve.expanding().max()

    # Calculate drawdown series
    drawdown = (equity_curve - running_max) / running_max

    return abs(drawdown.min())


def calculate_calmar_ratio(annual_return: float, max_drawdown: float) -> float:
    """Calculate Calmar ratio (annual return / max drawdown).

    Args:
        annual_return: Annualized return
        max_drawdown: Maximum drawdown

    Returns:
        Calmar ratio
    """
    if max_drawdown == 0:
        return 0.0

    return annual_return / max_drawdown


def calculate_win_rate(trades: list) -> float:
    """Calculate win rate from trades.

    Args:
        trades: List of Trade objects

    Returns:
        Win rate as decimal (e.g., 0.60 for 60%)
    """
    if not trades:
        return 0.0

    winning_trades = sum(1 for t in trades if t.pnl and t.pnl > 0)
    return winning_trades / len(trades)


def calculate_profit_factor(trades: list) -> float:
    """Calculate profit factor (gross profit / gross loss).

    Args:
        trades: List of Trade objects

    Returns:
        Profit factor
    """
    if not trades:
        return 0.0

    gross_profit = sum(t.pnl for t in trades if t.pnl and t.pnl > 0)
    gross_loss = abs(sum(t.pnl for t in trades if t.pnl and t.pnl < 0))

    if gross_loss == 0:
        return float("inf") if gross_profit > 0 else 0.0

    return gross_profit / gross_loss


def calculate_recovery_factor(
    total_return: float, max_drawdown: float, initial_capital: float
) -> float:
    """Calculate recovery factor (net profit / max drawdown).

    Args:
        total_return: Total return as decimal
        max_drawdown: Maximum drawdown as decimal
        initial_capital: Initial capital

    Returns:
        Recovery factor
    """
    if max_drawdown == 0:
        return 0.0

    net_profit = total_return * initial_capital
    max_dd_amount = max_drawdown * initial_capital

    return net_profit / max_dd_amount


def format_metrics(result: BacktestResult) -> str:
    """Format backtest metrics for display.

    Args:
        result: BacktestResult object

    Returns:
        Formatted string with metrics
    """
    metrics = f"""
╔══════════════════════════════════════════╗
║         BACKTEST RESULTS SUMMARY         ║
╚══════════════════════════════════════════╝

📊 RETURNS
├─ Total Return:        {result.total_return:>10.2%}
├─ Annual Return:       {result.annual_return:>10.2%}
├─ Initial Capital:     ${result.initial_capital:>10,.2f}
└─ Final Capital:       ${result.final_capital:>10,.2f}

📈 RISK METRICS
├─ Sharpe Ratio:        {result.sharpe_ratio:>10.2f}
├─ Sortino Ratio:       {result.sortino_ratio:>10.2f}
└─ Max Drawdown:        {result.max_drawdown:>10.2%}

💹 TRADE STATISTICS
├─ Total Trades:        {result.total_trades:>10}
├─ Win Rate:            {result.win_rate:>10.2%}
├─ Profit Factor:       {result.profit_factor:>10.2f}
├─ Winning Trades:      {result.winning_trades:>10}
└─ Losing Trades:       {result.losing_trades:>10}

💰 TRADE PERFORMANCE
├─ Average Win:         ${result.avg_win:>10,.2f}
├─ Average Loss:        ${result.avg_loss:>10,.2f}
├─ Best Trade:          ${result.best_trade:>10,.2f}
└─ Worst Trade:         ${result.worst_trade:>10,.2f}
"""
    return metrics


def create_metrics_dataframe(results: Dict[str, BacktestResult]) -> pd.DataFrame:
    """Create a DataFrame from multiple backtest results.

    Args:
        results: Dictionary mapping symbols to BacktestResult

    Returns:
        DataFrame with metrics for comparison
    """
    data = []

    for symbol, result in results.items():
        data.append(
            {
                "Symbol": symbol,
                "Total Return": f"{result.total_return:.2%}",
                "Annual Return": f"{result.annual_return:.2%}",
                "Sharpe Ratio": f"{result.sharpe_ratio:.2f}",
                "Max Drawdown": f"{result.max_drawdown:.2%}",
                "Win Rate": f"{result.win_rate:.2%}",
                "Total Trades": result.total_trades,
                "Profit Factor": f"{result.profit_factor:.2f}",
            }
        )

    return pd.DataFrame(data)
