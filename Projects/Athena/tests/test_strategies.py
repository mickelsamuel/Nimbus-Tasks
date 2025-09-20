"""Tests for trading strategies."""

import numpy as np
import pandas as pd
import pytest

from athena.strategies.sma_crossover import SMACrossoverStrategy


class TestSMACrossoverStrategy:
    """Test SMA Crossover Strategy."""

    @pytest.fixture
    def sample_data(self):
        """Create sample OHLCV data."""
        dates = pd.date_range(start="2023-01-01", periods=100, freq="D")
        np.random.seed(42)

        # Generate synthetic price data with trend
        trend = np.linspace(100, 120, 100)
        noise = np.random.randn(100) * 2
        close_prices = trend + noise

        data = pd.DataFrame(
            {
                "open": close_prices + np.random.randn(100) * 0.5,
                "high": close_prices + np.abs(np.random.randn(100)) * 2,
                "low": close_prices - np.abs(np.random.randn(100)) * 2,
                "close": close_prices,
                "volume": np.random.randint(1000000, 10000000, 100),
            },
            index=dates,
        )

        return data

    def test_strategy_initialization(self):
        """Test strategy can be initialized with parameters."""
        strategy = SMACrossoverStrategy(fast_period=10, slow_period=20)
        assert strategy.fast_period == 10
        assert strategy.slow_period == 20
        assert strategy.name == "SMA_Crossover"

    def test_invalid_parameters(self):
        """Test strategy raises error for invalid parameters."""
        with pytest.raises(ValueError):
            SMACrossoverStrategy(fast_period=30, slow_period=20)

    def test_generate_signals(self, sample_data):
        """Test signal generation."""
        strategy = SMACrossoverStrategy(fast_period=5, slow_period=10)
        signals = strategy.generate_signals(sample_data)

        assert isinstance(signals, pd.Series)
        assert len(signals) == len(sample_data)
        assert signals.isin([0, 1, -1]).all()

    def test_calculate_sma(self, sample_data):
        """Test SMA calculation."""
        strategy = SMACrossoverStrategy()
        sma = strategy.calculate_sma(sample_data["close"], period=10)

        assert isinstance(sma, pd.Series)
        assert len(sma) == len(sample_data)
        # First 9 values should be NaN for period=10
        assert sma.iloc[:9].isna().all()
        assert not sma.iloc[9:].isna().any()

    def test_get_indicators(self, sample_data):
        """Test indicator calculation."""
        strategy = SMACrossoverStrategy(fast_period=5, slow_period=10)
        indicators = strategy.get_indicators(sample_data)

        assert "sma_5" in indicators.columns
        assert "sma_10" in indicators.columns
        assert "signal" in indicators.columns

    def test_validate_parameters(self):
        """Test parameter validation."""
        strategy = SMACrossoverStrategy(fast_period=20, slow_period=50)
        assert strategy.validate_parameters() is True

        strategy.fast_period = -1
        assert strategy.validate_parameters() is False

        strategy.fast_period = 60
        strategy.slow_period = 50
        assert strategy.validate_parameters() is False
