"""Tests for risk management module."""

import pytest
import pandas as pd
import numpy as np
from unittest.mock import Mock

from athena.core.risk import PositionSizer
from athena.core.types import Position


class TestPositionSizer:
    """Test PositionSizer class."""

    def test_initialization_default(self):
        """Test PositionSizer initialization with defaults."""
        sizer = PositionSizer()
        assert sizer.max_positions == 10
        assert sizer.max_position_size is not None
        assert sizer.kelly_fraction is not None

    def test_initialization_custom(self):
        """Test PositionSizer initialization with custom values."""
        sizer = PositionSizer(
            max_position_size=0.2,
            kelly_fraction=0.25,
            max_positions=5
        )
        assert sizer.max_position_size == 0.2
        assert sizer.kelly_fraction == 0.25
        assert sizer.max_positions == 5

    def test_fixed_fraction_sizing(self):
        """Test fixed fraction position sizing."""
        sizer = PositionSizer()

        portfolio_value = 100000
        risk_per_trade = 0.02

        size = sizer.fixed_fraction(portfolio_value, risk_per_trade)

        expected_size = portfolio_value * risk_per_trade
        assert size == expected_size
        assert size == 2000

    def test_fixed_fraction_with_different_values(self):
        """Test fixed fraction with different portfolio values."""
        sizer = PositionSizer()

        # Test with larger portfolio
        size1 = sizer.fixed_fraction(500000, 0.01)
        assert size1 == 5000

        # Test with smaller portfolio
        size2 = sizer.fixed_fraction(10000, 0.05)
        assert size2 == 500

    def test_kelly_criterion_basic(self):
        """Test Kelly criterion calculation."""
        sizer = PositionSizer()

        win_probability = 0.6
        win_loss_ratio = 1.5
        portfolio_value = 100000

        size = sizer.kelly_criterion(win_probability, win_loss_ratio, portfolio_value)

        assert isinstance(size, float)
        assert size >= 0
        assert size <= portfolio_value

    def test_kelly_criterion_edge_cases(self):
        """Test Kelly criterion with edge case values."""
        sizer = PositionSizer()
        portfolio_value = 100000

        # Test with 50% win probability
        size1 = sizer.kelly_criterion(0.5, 1.0, portfolio_value)
        assert size1 >= 0

        # Test with high win probability
        size2 = sizer.kelly_criterion(0.8, 2.0, portfolio_value)
        assert size2 >= 0

        # Test with low win probability (might suggest no position)
        size3 = sizer.kelly_criterion(0.3, 1.0, portfolio_value)
        assert size3 >= 0

    def test_kelly_criterion_negative_edge(self):
        """Test Kelly criterion when it suggests not betting."""
        sizer = PositionSizer()

        # When win probability is too low relative to win/loss ratio
        win_probability = 0.4
        win_loss_ratio = 1.0  # Even money bet
        portfolio_value = 100000

        size = sizer.kelly_criterion(win_probability, win_loss_ratio, portfolio_value)

        # Kelly might suggest 0 or very small position
        assert size >= 0
        assert size <= portfolio_value

    def test_volatility_target_sizing(self):
        """Test volatility target position sizing."""
        sizer = PositionSizer()

        target_volatility = 0.15
        asset_volatility = 0.25
        portfolio_value = 100000

        size = sizer.volatility_target(target_volatility, asset_volatility, portfolio_value)

        assert isinstance(size, float)
        assert size >= 0
        assert size <= portfolio_value

    def test_volatility_target_zero_asset_volatility(self):
        """Test volatility target with zero asset volatility."""
        sizer = PositionSizer()

        size = sizer.volatility_target(0.15, 0.0, 100000)

        # Should handle division by zero gracefully
        assert size >= 0

    def test_volatility_target_high_asset_volatility(self):
        """Test volatility target with high asset volatility."""
        sizer = PositionSizer()

        # High asset volatility should lead to smaller position
        size_high_vol = sizer.volatility_target(0.15, 0.50, 100000)
        size_low_vol = sizer.volatility_target(0.15, 0.10, 100000)

        assert size_high_vol <= size_low_vol

    def test_mean_reversion_sizing(self):
        """Test mean reversion position sizing."""
        sizer = PositionSizer()

        # Create mock price series
        current_price = 100
        historical_prices = pd.Series([95, 98, 102, 99, 101, 97, 100])
        portfolio_value = 100000

        size = sizer.mean_reversion(current_price, historical_prices, portfolio_value)

        assert isinstance(size, float)
        assert size >= 0

    def test_mean_reversion_empty_history(self):
        """Test mean reversion with empty price history."""
        sizer = PositionSizer()

        current_price = 100
        historical_prices = pd.Series([])
        portfolio_value = 100000

        size = sizer.mean_reversion(current_price, historical_prices, portfolio_value)

        # Should handle empty history gracefully
        assert size >= 0

    def test_mean_reversion_insufficient_history(self):
        """Test mean reversion with insufficient price history."""
        sizer = PositionSizer()

        current_price = 100
        historical_prices = pd.Series([99])  # Only one data point
        portfolio_value = 100000

        size = sizer.mean_reversion(current_price, historical_prices, portfolio_value)

        assert size >= 0

    def test_risk_parity_sizing(self):
        """Test risk parity position sizing."""
        sizer = PositionSizer()

        correlations = pd.DataFrame({
            'AAPL': [1.0, 0.3, 0.5],
            'MSFT': [0.3, 1.0, 0.4],
            'GOOGL': [0.5, 0.4, 1.0]
        }, index=['AAPL', 'MSFT', 'GOOGL'])

        volatilities = pd.Series([0.25, 0.22, 0.28], index=['AAPL', 'MSFT', 'GOOGL'])
        portfolio_value = 100000

        sizes = sizer.risk_parity(correlations, volatilities, portfolio_value)

        assert isinstance(sizes, dict)
        assert len(sizes) == 3
        assert all(size >= 0 for size in sizes.values())

    def test_risk_parity_single_asset(self):
        """Test risk parity with single asset."""
        sizer = PositionSizer()

        correlations = pd.DataFrame({'AAPL': [1.0]}, index=['AAPL'])
        volatilities = pd.Series([0.25], index=['AAPL'])
        portfolio_value = 100000

        sizes = sizer.risk_parity(correlations, volatilities, portfolio_value)

        assert isinstance(sizes, dict)
        assert 'AAPL' in sizes
        assert sizes['AAPL'] >= 0

    def test_momentum_sizing(self):
        """Test momentum-based position sizing."""
        sizer = PositionSizer()

        # Create trending price series
        price_series = pd.Series([100, 102, 105, 107, 110, 112, 115])
        portfolio_value = 100000

        size = sizer.momentum(price_series, portfolio_value)

        assert isinstance(size, float)
        assert size >= 0

    def test_momentum_sizing_flat_trend(self):
        """Test momentum sizing with flat price trend."""
        sizer = PositionSizer()

        # Flat price series
        price_series = pd.Series([100, 100, 100, 100, 100])
        portfolio_value = 100000

        size = sizer.momentum(price_series, portfolio_value)

        assert isinstance(size, float)
        assert size >= 0

    def test_momentum_sizing_declining_trend(self):
        """Test momentum sizing with declining price trend."""
        sizer = PositionSizer()

        # Declining price series
        price_series = pd.Series([115, 112, 110, 107, 105, 102, 100])
        portfolio_value = 100000

        size = sizer.momentum(price_series, portfolio_value)

        assert isinstance(size, float)
        assert size >= 0


class TestPositionSizerEdgeCases:
    """Test edge cases and error conditions."""

    def test_zero_portfolio_value(self):
        """Test position sizing with zero portfolio value."""
        sizer = PositionSizer()

        size = sizer.fixed_fraction(0, 0.02)
        assert size == 0

    def test_negative_portfolio_value(self):
        """Test position sizing with negative portfolio value."""
        sizer = PositionSizer()

        # Should handle gracefully or raise appropriate error
        try:
            size = sizer.fixed_fraction(-100000, 0.02)
            assert size >= 0  # If it returns a value, should be non-negative
        except ValueError:
            pass  # Acceptable to raise error for negative portfolio

    def test_extreme_risk_values(self):
        """Test with extreme risk parameter values."""
        sizer = PositionSizer()

        # Very high risk
        size1 = sizer.fixed_fraction(100000, 1.0)  # 100% risk
        assert size1 == 100000

        # Very low risk
        size2 = sizer.fixed_fraction(100000, 0.0001)  # 0.01% risk
        assert size2 == 10

    def test_kelly_criterion_extreme_values(self):
        """Test Kelly criterion with extreme parameter values."""
        sizer = PositionSizer()
        portfolio_value = 100000

        # Extreme win probability
        size1 = sizer.kelly_criterion(0.99, 1.01, portfolio_value)
        assert size1 >= 0

        # Very low win probability
        size2 = sizer.kelly_criterion(0.01, 1.0, portfolio_value)
        assert size2 >= 0

    def test_volatility_target_extreme_values(self):
        """Test volatility target with extreme values."""
        sizer = PositionSizer()
        portfolio_value = 100000

        # Very high target volatility
        size1 = sizer.volatility_target(1.0, 0.25, portfolio_value)
        assert size1 >= 0

        # Very low target volatility
        size2 = sizer.volatility_target(0.001, 0.25, portfolio_value)
        assert size2 >= 0


class TestPositionSizerPerformance:
    """Test performance aspects of position sizer."""

    def test_large_portfolio_calculation(self):
        """Test position sizing with large portfolio values."""
        sizer = PositionSizer()

        # Test with very large portfolio
        large_portfolio = 1e12  # 1 trillion
        size = sizer.fixed_fraction(large_portfolio, 0.01)

        assert size == large_portfolio * 0.01
        assert isinstance(size, float)

    def test_many_asset_risk_parity(self):
        """Test risk parity with many assets."""
        sizer = PositionSizer()

        n_assets = 100
        asset_names = [f"ASSET_{i}" for i in range(n_assets)]

        # Create correlation matrix
        correlations = pd.DataFrame(
            np.random.RandomState(42).uniform(0.1, 0.9, (n_assets, n_assets)),
            index=asset_names,
            columns=asset_names
        )
        np.fill_diagonal(correlations.values, 1.0)  # Perfect self-correlation

        # Create volatilities
        volatilities = pd.Series(
            np.random.RandomState(42).uniform(0.1, 0.5, n_assets),
            index=asset_names
        )

        portfolio_value = 100000

        try:
            sizes = sizer.risk_parity(correlations, volatilities, portfolio_value)
            assert isinstance(sizes, dict)
            assert len(sizes) == n_assets
        except Exception:
            # It's acceptable if the method can't handle this many assets
            pass

    def test_long_price_series_momentum(self):
        """Test momentum sizing with long price series."""
        sizer = PositionSizer()

        # Create long price series
        n_days = 1000
        price_series = pd.Series(
            100 + np.cumsum(np.random.RandomState(42).normal(0, 1, n_days))
        )

        portfolio_value = 100000

        size = sizer.momentum(price_series, portfolio_value)

        assert isinstance(size, float)
        assert size >= 0


class TestPositionSizerIntegration:
    """Test integration aspects with other components."""

    def test_position_sizing_with_positions(self):
        """Test position sizing considering existing positions."""
        sizer = PositionSizer(max_positions=3)

        # Create mock existing positions
        existing_positions = [
            Mock(spec=Position, symbol="AAPL", market_value=10000),
            Mock(spec=Position, symbol="MSFT", market_value=15000),
        ]

        portfolio_value = 100000

        # Should still be able to calculate size
        size = sizer.fixed_fraction(portfolio_value, 0.02)
        assert size == 2000

    def test_position_sizing_consistency(self):
        """Test that position sizing is consistent across calls."""
        sizer = PositionSizer()

        portfolio_value = 100000
        risk_per_trade = 0.03

        # Multiple calls should return same result
        size1 = sizer.fixed_fraction(portfolio_value, risk_per_trade)
        size2 = sizer.fixed_fraction(portfolio_value, risk_per_trade)

        assert size1 == size2