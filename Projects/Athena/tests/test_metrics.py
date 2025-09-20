"""Tests for backtest metrics module."""

import pytest
import pandas as pd
import numpy as np
from unittest.mock import Mock

from athena.backtest.metrics import (
    calculate_sharpe_ratio,
    calculate_sortino_ratio,
    calculate_max_drawdown,
    calculate_calmar_ratio,
    calculate_win_rate,
    calculate_profit_factor,
    calculate_recovery_factor,
    format_metrics,
    create_metrics_dataframe,
)
from athena.core.types import BacktestResult, Trade


class TestSharpeRatio:
    """Test Sharpe ratio calculations."""

    def test_calculate_sharpe_ratio_normal(self):
        returns = pd.Series([0.01, 0.02, -0.01, 0.015, 0.005, -0.008, 0.012])

        sharpe = calculate_sharpe_ratio(returns, risk_free_rate=0.02, periods=252)

        assert isinstance(sharpe, float)
        assert not np.isnan(sharpe)

    def test_calculate_sharpe_ratio_empty_returns(self):
        returns = pd.Series([])

        sharpe = calculate_sharpe_ratio(returns)

        assert sharpe == 0.0

    def test_calculate_sharpe_ratio_single_return(self):
        returns = pd.Series([0.01])

        sharpe = calculate_sharpe_ratio(returns)

        assert sharpe == 0.0

    def test_calculate_sharpe_ratio_zero_volatility(self):
        # All returns are the same
        returns = pd.Series([0.01, 0.01, 0.01, 0.01])

        sharpe = calculate_sharpe_ratio(returns)

        assert sharpe == 0.0

    def test_calculate_sharpe_ratio_negative(self):
        # Returns below risk-free rate
        returns = pd.Series([-0.01, -0.02, -0.015, -0.008])

        sharpe = calculate_sharpe_ratio(returns, risk_free_rate=0.02)

        assert sharpe < 0


class TestSortinoRatio:
    """Test Sortino ratio calculations."""

    def test_calculate_sortino_ratio_normal(self):
        returns = pd.Series([0.01, 0.02, -0.01, 0.015, 0.005, -0.008, 0.012])

        sortino = calculate_sortino_ratio(returns, risk_free_rate=0.02, periods=252)

        assert isinstance(sortino, float)
        assert not np.isnan(sortino)

    def test_calculate_sortino_ratio_empty_returns(self):
        returns = pd.Series([])

        sortino = calculate_sortino_ratio(returns)

        assert sortino == 0.0

    def test_calculate_sortino_ratio_no_downside(self):
        # All returns are positive
        returns = pd.Series([0.01, 0.02, 0.015, 0.008, 0.012])

        sortino = calculate_sortino_ratio(returns, risk_free_rate=0.005)

        assert sortino == 0.0  # No downside deviation

    def test_calculate_sortino_ratio_only_downside(self):
        # All returns are negative
        returns = pd.Series([-0.01, -0.02, -0.015, -0.008])

        sortino = calculate_sortino_ratio(returns, risk_free_rate=0.02)

        assert sortino < 0


class TestMaxDrawdown:
    """Test maximum drawdown calculations."""

    def test_calculate_max_drawdown_normal(self):
        # Equity curve with a drawdown
        equity_curve = pd.Series([100, 105, 110, 95, 90, 100, 105])

        max_dd = calculate_max_drawdown(equity_curve)

        # Max drawdown should be from 110 to 90 = 20/110 ≈ 0.18
        assert max_dd > 0
        assert max_dd < 1
        assert abs(max_dd - (20/110)) < 0.01

    def test_calculate_max_drawdown_empty_series(self):
        equity_curve = pd.Series([])

        max_dd = calculate_max_drawdown(equity_curve)

        assert max_dd == 0.0

    def test_calculate_max_drawdown_single_value(self):
        equity_curve = pd.Series([100])

        max_dd = calculate_max_drawdown(equity_curve)

        assert max_dd == 0.0

    def test_calculate_max_drawdown_no_drawdown(self):
        # Always increasing
        equity_curve = pd.Series([100, 105, 110, 115, 120])

        max_dd = calculate_max_drawdown(equity_curve)

        assert max_dd == 0.0

    def test_calculate_max_drawdown_all_decline(self):
        # Always decreasing
        equity_curve = pd.Series([100, 95, 90, 85, 80])

        max_dd = calculate_max_drawdown(equity_curve)

        assert max_dd == 0.2  # 20% decline


class TestCalmarRatio:
    """Test Calmar ratio calculations."""

    def test_calculate_calmar_ratio_normal(self):
        annual_return = 0.12
        max_drawdown = 0.05

        calmar = calculate_calmar_ratio(annual_return, max_drawdown)

        assert calmar == 2.4  # 0.12 / 0.05

    def test_calculate_calmar_ratio_zero_drawdown(self):
        annual_return = 0.12
        max_drawdown = 0.0

        calmar = calculate_calmar_ratio(annual_return, max_drawdown)

        assert calmar == 0.0

    def test_calculate_calmar_ratio_negative_return(self):
        annual_return = -0.05
        max_drawdown = 0.1

        calmar = calculate_calmar_ratio(annual_return, max_drawdown)

        assert calmar == -0.5


class TestWinRate:
    """Test win rate calculations."""

    def test_calculate_win_rate_mixed_trades(self):
        trades = [
            Mock(spec=Trade, pnl=100),  # Win
            Mock(spec=Trade, pnl=-50),  # Loss
            Mock(spec=Trade, pnl=75),   # Win
            Mock(spec=Trade, pnl=-25),  # Loss
            Mock(spec=Trade, pnl=150),  # Win
        ]

        win_rate = calculate_win_rate(trades)

        assert win_rate == 0.6  # 3 wins out of 5 trades

    def test_calculate_win_rate_all_wins(self):
        trades = [
            Mock(spec=Trade, pnl=100),
            Mock(spec=Trade, pnl=75),
            Mock(spec=Trade, pnl=150),
        ]

        win_rate = calculate_win_rate(trades)

        assert win_rate == 1.0

    def test_calculate_win_rate_all_losses(self):
        trades = [
            Mock(spec=Trade, pnl=-50),
            Mock(spec=Trade, pnl=-25),
            Mock(spec=Trade, pnl=-75),
        ]

        win_rate = calculate_win_rate(trades)

        assert win_rate == 0.0

    def test_calculate_win_rate_empty_trades(self):
        trades = []

        win_rate = calculate_win_rate(trades)

        assert win_rate == 0.0

    def test_calculate_win_rate_zero_pnl_trades(self):
        trades = [
            Mock(spec=Trade, pnl=0),  # Breakeven
            Mock(spec=Trade, pnl=100),  # Win
            Mock(spec=Trade, pnl=-50),  # Loss
        ]

        win_rate = calculate_win_rate(trades)

        assert win_rate == 1/3  # Only 1 win out of 3 trades


class TestProfitFactor:
    """Test profit factor calculations."""

    def test_calculate_profit_factor_normal(self):
        trades = [
            Mock(spec=Trade, pnl=100),  # Gross profit: 100
            Mock(spec=Trade, pnl=-50),  # Gross loss: 50
            Mock(spec=Trade, pnl=75),   # Gross profit: 75
            Mock(spec=Trade, pnl=-25),  # Gross loss: 25
        ]

        profit_factor = calculate_profit_factor(trades)

        # Gross profit: 175, Gross loss: 75
        assert profit_factor == 175 / 75

    def test_calculate_profit_factor_no_losses(self):
        trades = [
            Mock(spec=Trade, pnl=100),
            Mock(spec=Trade, pnl=75),
            Mock(spec=Trade, pnl=50),
        ]

        profit_factor = calculate_profit_factor(trades)

        assert profit_factor == float('inf')

    def test_calculate_profit_factor_no_profits(self):
        trades = [
            Mock(spec=Trade, pnl=-50),
            Mock(spec=Trade, pnl=-25),
            Mock(spec=Trade, pnl=-75),
        ]

        profit_factor = calculate_profit_factor(trades)

        assert profit_factor == 0.0

    def test_calculate_profit_factor_empty_trades(self):
        trades = []

        profit_factor = calculate_profit_factor(trades)

        assert profit_factor == 0.0


class TestRecoveryFactor:
    """Test recovery factor calculations."""

    def test_calculate_recovery_factor_normal(self):
        total_return = 0.25  # 25% return
        max_drawdown = 0.1   # 10% drawdown
        initial_capital = 100000

        recovery_factor = calculate_recovery_factor(total_return, max_drawdown, initial_capital)

        # Net profit: 25000, Max DD amount: 10000
        assert recovery_factor == 25000 / 10000

    def test_calculate_recovery_factor_zero_drawdown(self):
        total_return = 0.25
        max_drawdown = 0.0
        initial_capital = 100000

        recovery_factor = calculate_recovery_factor(total_return, max_drawdown, initial_capital)

        assert recovery_factor == 0.0

    def test_calculate_recovery_factor_negative_return(self):
        total_return = -0.1
        max_drawdown = 0.15
        initial_capital = 100000

        recovery_factor = calculate_recovery_factor(total_return, max_drawdown, initial_capital)

        # Net profit: -10000, Max DD amount: 15000
        assert recovery_factor == -10000 / 15000


class TestFormatMetrics:
    """Test metrics formatting."""

    def test_format_metrics_complete(self):
        # Create a mock BacktestResult with all required attributes
        result = Mock(spec=BacktestResult)
        result.total_return = 0.25
        result.annual_return = 0.18
        result.initial_capital = 100000
        result.final_capital = 125000
        result.sharpe_ratio = 1.2
        result.sortino_ratio = 1.5
        result.max_drawdown = 0.08
        result.total_trades = 45
        result.win_rate = 0.65
        result.profit_factor = 1.8
        result.winning_trades = 29
        result.losing_trades = 16
        result.avg_win = 250
        result.avg_loss = -120
        result.best_trade = 1200
        result.worst_trade = -450

        formatted = format_metrics(result)

        assert isinstance(formatted, str)
        assert "BACKTEST RESULTS SUMMARY" in formatted
        assert "25.00%" in formatted  # Total return
        assert "$125,000.00" in formatted  # Final capital
        assert "1.20" in formatted  # Sharpe ratio


class TestCreateMetricsDataFrame:
    """Test metrics DataFrame creation."""

    def test_create_metrics_dataframe_single_result(self):
        result = Mock(spec=BacktestResult)
        result.total_return = 0.15
        result.annual_return = 0.12
        result.sharpe_ratio = 1.1
        result.max_drawdown = 0.05
        result.win_rate = 0.6
        result.total_trades = 20
        result.profit_factor = 1.5

        results = {"AAPL": result}

        df = create_metrics_dataframe(results)

        assert len(df) == 1
        assert df.iloc[0]["Symbol"] == "AAPL"
        assert "15.00%" in df.iloc[0]["Total Return"]

    def test_create_metrics_dataframe_multiple_results(self):
        result1 = Mock(spec=BacktestResult)
        result1.total_return = 0.15
        result1.annual_return = 0.12
        result1.sharpe_ratio = 1.1
        result1.max_drawdown = 0.05
        result1.win_rate = 0.6
        result1.total_trades = 20
        result1.profit_factor = 1.5

        result2 = Mock(spec=BacktestResult)
        result2.total_return = 0.08
        result2.annual_return = 0.07
        result2.sharpe_ratio = 0.9
        result2.max_drawdown = 0.03
        result2.win_rate = 0.55
        result2.total_trades = 15
        result2.profit_factor = 1.2

        results = {"AAPL": result1, "MSFT": result2}

        df = create_metrics_dataframe(results)

        assert len(df) == 2
        symbols = df["Symbol"].tolist()
        assert "AAPL" in symbols
        assert "MSFT" in symbols

    def test_create_metrics_dataframe_empty_results(self):
        results = {}

        df = create_metrics_dataframe(results)

        assert len(df) == 0
        # Empty DataFrame should have no columns
        assert len(df.columns) == 0


class TestMetricsEdgeCases:
    """Test edge cases and error conditions."""

    def test_sharpe_ratio_extreme_values(self):
        # Very large returns
        returns = pd.Series([10.0, -5.0, 15.0, -8.0])

        sharpe = calculate_sharpe_ratio(returns)

        assert isinstance(sharpe, float)
        assert not np.isnan(sharpe)

    def test_max_drawdown_extreme_decline(self):
        # 99% decline
        equity_curve = pd.Series([1000000, 10000])

        max_dd = calculate_max_drawdown(equity_curve)

        assert abs(max_dd - 0.99) < 0.01

    def test_win_rate_with_none_pnl(self):
        trades = [
            Mock(spec=Trade, pnl=100),
            Mock(spec=Trade, pnl=None),  # Trade with no PnL
            Mock(spec=Trade, pnl=-50),
        ]

        win_rate = calculate_win_rate(trades)

        # Should count all trades, None PnL is treated as 0 (not a win)
        assert win_rate == 1/3  # 1 win out of 3 trades

    def test_profit_factor_with_none_pnl(self):
        trades = [
            Mock(spec=Trade, pnl=100),
            Mock(spec=Trade, pnl=None),
            Mock(spec=Trade, pnl=-50),
        ]

        profit_factor = calculate_profit_factor(trades)

        assert profit_factor == 100 / 50  # Should ignore None values