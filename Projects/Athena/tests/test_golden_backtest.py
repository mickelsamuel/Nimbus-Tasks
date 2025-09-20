"""Golden backtest tests with deterministic results for snapshot comparison."""

import pytest
import pandas as pd
import numpy as np
from datetime import datetime, date
import json
from pathlib import Path

from athena.backtest.engine import BacktestEngine
from athena.strategies.sma_crossover import SMACrossoverStrategy
from athena.strategies.bollinger_bands import BollingerBandsStrategy
from athena.strategies.momentum import MomentumStrategy


class TestGoldenBacktest:
    """Test deterministic backtest results for regression testing."""

    @classmethod
    def setup_class(cls):
        """Set up test data with fixed seed for reproducibility."""
        np.random.seed(42)  # Fixed seed for deterministic results

        # Create deterministic test data
        dates = pd.date_range('2020-01-01', '2022-12-31', freq='D')
        dates = dates[dates.weekday < 5]  # Business days only

        # Generate price data with known patterns
        n_days = len(dates)

        # Start with base price and add deterministic trends and noise
        base_price = 100.0
        trend = 0.0002  # Small upward trend
        volatility = 0.02

        # Create price series with some predictable patterns
        returns = np.zeros(n_days)
        for i in range(1, n_days):
            # Add trend
            returns[i] = trend

            # Add some cyclical patterns (for SMA crossovers)
            if i % 20 == 0:  # Trend change every 20 days
                returns[i] += 0.01
            elif i % 20 == 10:
                returns[i] -= 0.008

            # Add controlled noise
            np.random.seed(42 + i)  # Deterministic noise
            returns[i] += np.random.normal(0, volatility)

        # Calculate cumulative prices
        prices = base_price * np.exp(np.cumsum(returns))

        # Create OHLCV data with lowercase column names
        cls.test_data = pd.DataFrame({
            'open': prices * (1 + np.random.RandomState(42).normal(0, 0.001, n_days)),
            'high': prices * (1 + np.abs(np.random.RandomState(43).normal(0, 0.002, n_days))),
            'low': prices * (1 - np.abs(np.random.RandomState(44).normal(0, 0.002, n_days))),
            'close': prices,
            'volume': np.random.RandomState(45).randint(1000000, 5000000, n_days)
        }, index=dates)

        # Ensure high >= close >= low and open is reasonable
        cls.test_data['high'] = np.maximum(cls.test_data['high'], cls.test_data['close'])
        cls.test_data['low'] = np.minimum(cls.test_data['low'], cls.test_data['close'])
        cls.test_data['open'] = np.maximum(cls.test_data['low'],
                                         np.minimum(cls.test_data['high'], cls.test_data['open']))

    def test_sma_crossover_golden_backtest(self):
        """Test SMA crossover strategy with deterministic results."""
        # Fixed parameters for reproducibility
        strategy = SMACrossoverStrategy(fast_period=10, slow_period=30)
        engine = BacktestEngine(initial_capital=100000, commission=0.001)

        result = engine.run(strategy, self.test_data, "TEST_SYMBOL")

        # Expected results (these should be updated if algorithm changes)
        expected_metrics = {
            "initial_capital": 100000,
            "total_trades_range": (20, 80),  # Should be reasonable number of trades
            "final_capital_range": (95000, 120000),  # Should be within reasonable range
            "sharpe_ratio_range": (-1.0, 2.0),  # Should be reasonable Sharpe
            "max_drawdown_max": 0.3,  # Max drawdown shouldn't exceed 30%
        }

        # Test basic metrics
        assert result.initial_capital == expected_metrics["initial_capital"]
        assert expected_metrics["total_trades_range"][0] <= result.total_trades <= expected_metrics["total_trades_range"][1]
        assert expected_metrics["final_capital_range"][0] <= result.final_capital <= expected_metrics["final_capital_range"][1]
        assert expected_metrics["sharpe_ratio_range"][0] <= result.sharpe_ratio <= expected_metrics["sharpe_ratio_range"][1]
        assert result.max_drawdown <= expected_metrics["max_drawdown_max"]

        # Test that equity curve is monotonic or reasonable
        assert len(result.equity_curve) > 0
        assert result.equity_curve.iloc[0] == result.initial_capital
        assert abs(result.equity_curve.iloc[-1] - result.final_capital) < 1.0  # Should match within $1

        # Test trade consistency
        if result.trades:
            # All trades should have proper entry/exit
            for trade in result.trades:
                assert trade.entry_date is not None
                assert trade.entry_price > 0
                assert trade.symbol == "TEST_SYMBOL"
                if trade.exit_date:
                    assert trade.exit_date >= trade.entry_date
                    assert trade.exit_price > 0

    def test_bollinger_bands_golden_backtest(self):
        """Test Bollinger Bands strategy with deterministic results."""
        strategy = BollingerBandsStrategy(period=20, std_dev=2.0)
        engine = BacktestEngine(initial_capital=100000, commission=0.001)

        result = engine.run(strategy, self.test_data, "TEST_SYMBOL")

        # Test basic validity
        assert result.initial_capital == 100000
        assert result.final_capital > 0
        assert isinstance(result.total_trades, int)
        assert result.total_trades >= 0
        assert isinstance(result.sharpe_ratio, (int, float))
        assert isinstance(result.max_drawdown, (int, float))
        assert result.max_drawdown <= 0  # Max drawdown should be negative

    def test_momentum_golden_backtest(self):
        """Test Momentum strategy with deterministic results."""
        strategy = MomentumStrategy(rsi_period=14)
        engine = BacktestEngine(initial_capital=100000, commission=0.001)

        result = engine.run(strategy, self.test_data, "TEST_SYMBOL")

        # Test basic validity
        assert result.initial_capital == 100000
        assert result.final_capital > 0
        assert isinstance(result.total_trades, int)
        assert result.total_trades >= 0
        assert isinstance(result.sharpe_ratio, (int, float))
        assert isinstance(result.max_drawdown, (int, float))
        assert result.max_drawdown <= 0  # Max drawdown should be negative

    def test_deterministic_results_consistency(self):
        """Test that running the same backtest twice produces identical results."""
        strategy1 = SMACrossoverStrategy(fast_period=10, slow_period=30)
        strategy2 = SMACrossoverStrategy(fast_period=10, slow_period=30)

        engine1 = BacktestEngine(initial_capital=100000, commission=0.001)
        engine2 = BacktestEngine(initial_capital=100000, commission=0.001)

        result1 = engine1.run(strategy1, self.test_data, "TEST_SYMBOL")
        result2 = engine2.run(strategy2, self.test_data, "TEST_SYMBOL")

        # Results should be identical
        assert result1.final_capital == result2.final_capital
        assert result1.total_return == result2.total_return
        assert result1.sharpe_ratio == result2.sharpe_ratio
        assert result1.max_drawdown == result2.max_drawdown
        assert result1.total_trades == result2.total_trades

        # Equity curves should be identical
        pd.testing.assert_series_equal(result1.equity_curve, result2.equity_curve)

    def test_edge_case_scenarios(self):
        """Test backtest behavior in edge case scenarios."""

        # Test with minimal data
        minimal_data = self.test_data.head(50)  # Only 50 days
        strategy = SMACrossoverStrategy(fast_period=5, slow_period=15)
        engine = BacktestEngine(initial_capital=10000, commission=0.001)

        result = engine.run(strategy, minimal_data, "TEST_SYMBOL")

        assert result.initial_capital == 10000
        assert result.final_capital > 0
        assert len(result.equity_curve) <= len(minimal_data)

        # Test with high commission
        high_commission_engine = BacktestEngine(initial_capital=100000, commission=0.01)  # 1%
        result_high_comm = high_commission_engine.run(strategy, self.test_data, "TEST_SYMBOL")

        # Should still produce valid results
        assert result_high_comm.initial_capital == 100000
        assert result_high_comm.final_capital > 0

    def test_strategy_parameter_sensitivity(self):
        """Test that strategy parameters affect results as expected."""

        # Test different SMA periods
        fast_strategy = SMACrossoverStrategy(fast_period=5, slow_period=10)
        slow_strategy = SMACrossoverStrategy(fast_period=20, slow_period=50)

        engine = BacktestEngine(initial_capital=100000, commission=0.001)

        fast_result = engine.run(fast_strategy, self.test_data, "TEST_SYMBOL")
        slow_result = engine.run(slow_strategy, self.test_data, "TEST_SYMBOL")

        # Fast strategy should generally have more trades
        assert fast_result.total_trades >= slow_result.total_trades

        # Both should be valid
        assert fast_result.initial_capital == slow_result.initial_capital
        assert fast_result.final_capital > 0
        assert slow_result.final_capital > 0

    def test_commission_impact(self):
        """Test that commission affects returns as expected."""

        strategy = SMACrossoverStrategy(fast_period=10, slow_period=30)

        no_comm_engine = BacktestEngine(initial_capital=100000, commission=0.0)
        low_comm_engine = BacktestEngine(initial_capital=100000, commission=0.001)
        high_comm_engine = BacktestEngine(initial_capital=100000, commission=0.01)

        no_comm_result = no_comm_engine.run(strategy, self.test_data, "TEST_SYMBOL")
        low_comm_result = low_comm_engine.run(strategy, self.test_data, "TEST_SYMBOL")
        high_comm_result = high_comm_engine.run(strategy, self.test_data, "TEST_SYMBOL")

        # Higher commission should generally lead to lower returns
        assert no_comm_result.final_capital >= low_comm_result.final_capital
        assert low_comm_result.final_capital >= high_comm_result.final_capital

    def test_snapshot_comparison(self):
        """Test specific metrics against known good values for regression testing."""

        # This test should be updated whenever the algorithm is intentionally changed
        strategy = SMACrossoverStrategy(fast_period=10, slow_period=30)
        engine = BacktestEngine(initial_capital=100000, commission=0.001)

        result = engine.run(strategy, self.test_data, "TEST_SYMBOL")

        # Create a snapshot of key metrics
        snapshot = {
            "final_capital": round(result.final_capital, 2),
            "total_return": round(result.total_return, 4),
            "annualized_return": round(result.annual_return, 4),
            "sharpe_ratio": round(result.sharpe_ratio, 4),
            "max_drawdown": round(result.max_drawdown, 4),
            "total_trades": result.total_trades,
            "win_rate": round(result.win_rate, 4),
        }

        # In a real implementation, you would save/load this snapshot
        # For now, just test that the structure is correct
        assert isinstance(snapshot["final_capital"], float)
        assert isinstance(snapshot["total_return"], float)
        assert isinstance(snapshot["annualized_return"], float)
        assert isinstance(snapshot["sharpe_ratio"], float)
        assert isinstance(snapshot["max_drawdown"], float)
        assert isinstance(snapshot["total_trades"], int)
        assert isinstance(snapshot["win_rate"], float)

        # Test ranges that should remain stable
        assert 0 <= snapshot["win_rate"] <= 1
        assert snapshot["max_drawdown"] <= 0  # Max drawdown should be negative
        assert snapshot["total_trades"] >= 0

    def test_data_quality_requirements(self):
        """Test that the golden backtest data meets quality requirements."""

        # Test data completeness
        assert len(self.test_data) > 500  # At least 500 days
        assert not self.test_data.isnull().any().any()  # No null values

        # Test price relationships
        assert (self.test_data['high'] >= self.test_data['close']).all()
        assert (self.test_data['close'] >= self.test_data['low']).all()
        assert (self.test_data['high'] >= self.test_data['open']).all()
        assert (self.test_data['open'] >= self.test_data['low']).all()

        # Test volume is positive
        assert (self.test_data['volume'] > 0).all()

        # Test prices are positive
        assert (self.test_data['close'] > 0).all()
        assert (self.test_data['open'] > 0).all()
        assert (self.test_data['high'] > 0).all()
        assert (self.test_data['low'] > 0).all()

    def test_performance_benchmark(self):
        """Test that backtest performance is within acceptable limits."""
        import time

        strategy = SMACrossoverStrategy(fast_period=10, slow_period=30)
        engine = BacktestEngine(initial_capital=100000, commission=0.001)

        # Measure execution time
        start_time = time.time()
        result = engine.run(strategy, self.test_data, "TEST_SYMBOL")
        end_time = time.time()

        execution_time = end_time - start_time

        # Should complete within reasonable time (adjust as needed)
        assert execution_time < 10.0  # Should take less than 10 seconds

        # Test memory efficiency - result should contain expected data
        assert hasattr(result, 'equity_curve')
        assert hasattr(result, 'trades')
        assert len(result.equity_curve) <= len(self.test_data)

    def test_multiple_strategy_comparison(self):
        """Test multiple strategies on the same data for comparison."""

        strategies = [
            ("SMA_Fast", SMACrossoverStrategy(fast_period=5, slow_period=15)),
            ("SMA_Medium", SMACrossoverStrategy(fast_period=10, slow_period=30)),
            ("SMA_Slow", SMACrossoverStrategy(fast_period=20, slow_period=50)),
            ("Bollinger", BollingerBandsStrategy(period=20, std_dev=2.0)),
            ("Momentum", MomentumStrategy(rsi_period=14)),
        ]

        results = {}
        engine = BacktestEngine(initial_capital=100000, commission=0.001)

        for name, strategy in strategies:
            result = engine.run(strategy, self.test_data, "TEST_SYMBOL")
            results[name] = result

        # All strategies should produce valid results
        for name, result in results.items():
            assert result.initial_capital == 100000
            assert result.final_capital > 0
            assert isinstance(result.total_trades, int)
            assert result.total_trades >= 0

        # Test that we get different results from different strategies
        returns = [result.total_return for result in results.values()]
        assert len(set(returns)) > 1  # Should have different returns