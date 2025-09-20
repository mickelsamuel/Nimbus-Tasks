"""Integration tests for the Athena trading platform."""

import numpy as np
import pandas as pd
import pytest

from athena.backtest.engine import BacktestEngine
from athena.backtest.walk_forward import WalkForwardValidator
from athena.live.broker import SimulatedBroker
from athena.optimize.optimizer import StrategyOptimizer, get_param_space
from athena.strategies.bollinger_bands import BollingerBandsStrategy
from athena.strategies.momentum import MomentumStrategy
from athena.strategies.sma_crossover import SMACrossoverStrategy


class TestStrategyIntegration:
    """Test strategy integration with backtest engine."""

    @pytest.fixture
    def sample_data(self):
        """Create sample OHLCV data for testing."""
        dates = pd.date_range(start="2023-01-01", periods=300, freq="D")
        np.random.seed(42)

        # Generate synthetic price data
        returns = np.random.randn(300) * 0.02
        prices = 100 * np.exp(np.cumsum(returns))

        data = pd.DataFrame(
            {
                "open": prices + np.random.randn(300) * 0.5,
                "high": prices + np.abs(np.random.randn(300)) * 2,
                "low": prices - np.abs(np.random.randn(300)) * 2,
                "close": prices,
                "volume": np.random.randint(1000000, 10000000, 300),
            },
            index=dates,
        )

        return data

    def test_sma_strategy_backtest(self, sample_data):
        """Test SMA strategy with backtest engine."""
        strategy = SMACrossoverStrategy(fast_period=10, slow_period=20)
        engine = BacktestEngine(initial_capital=100000, commission=0.001)

        result = engine.run(strategy, sample_data, "TEST")

        assert result.total_trades >= 0
        assert result.initial_capital == 100000
        assert result.final_capital > 0
        assert hasattr(result, "sharpe_ratio")
        assert hasattr(result, "max_drawdown")

    def test_bollinger_strategy_backtest(self, sample_data):
        """Test Bollinger Bands strategy with backtest engine."""
        strategy = BollingerBandsStrategy(period=20, std_dev=2.0)
        engine = BacktestEngine(initial_capital=100000, commission=0.001)

        result = engine.run(strategy, sample_data, "TEST")

        assert result.total_trades >= 0
        assert result.initial_capital == 100000
        assert result.final_capital > 0

    def test_momentum_strategy_backtest(self, sample_data):
        """Test Momentum strategy with backtest engine."""
        strategy = MomentumStrategy(rsi_period=14, macd_fast=12, macd_slow=26)
        engine = BacktestEngine(initial_capital=100000, commission=0.001)

        result = engine.run(strategy, sample_data, "TEST")

        assert result.total_trades >= 0
        assert result.initial_capital == 100000
        assert result.final_capital > 0


class TestOptimizationIntegration:
    """Test optimization integration."""

    @pytest.fixture
    def sample_data(self):
        """Create sample data for optimization."""
        dates = pd.date_range(start="2023-01-01", periods=200, freq="D")
        np.random.seed(42)

        returns = np.random.randn(200) * 0.015
        prices = 100 * np.exp(np.cumsum(returns))

        data = pd.DataFrame(
            {
                "open": prices,
                "high": prices * 1.01,
                "low": prices * 0.99,
                "close": prices,
                "volume": np.random.randint(1000000, 5000000, 200),
            },
            index=dates,
        )

        return data

    def test_sma_optimization(self, sample_data):
        """Test SMA strategy optimization."""
        optimizer = StrategyOptimizer()
        param_space = get_param_space("sma")

        # Run short optimization
        results = optimizer.optimize(
            strategy_class=SMACrossoverStrategy,
            data=sample_data,
            symbol="TEST",
            param_space=param_space,
            n_trials=5,  # Short run for testing
        )

        assert "best_params" in results
        assert "fast_period" in results["best_params"]
        assert "slow_period" in results["best_params"]
        assert results["best_params"]["fast_period"] < results["best_params"]["slow_period"]
        assert results["n_trials"] == 5

    def test_optimization_save_load(self, sample_data, tmp_path):
        """Test optimization results save/load."""
        optimizer = StrategyOptimizer()
        param_space = get_param_space("sma")

        # Run optimization
        results = optimizer.optimize(
            strategy_class=SMACrossoverStrategy,
            data=sample_data,
            symbol="TEST",
            param_space=param_space,
            n_trials=3,
        )

        # Save results
        output_path = optimizer.save_results(results, output_dir=tmp_path)
        assert output_path.exists()

        # Load results
        loaded_params = optimizer.load_best_params("SMACrossoverStrategy", "TEST", tmp_path)
        assert loaded_params == results["best_params"]


class TestWalkForwardIntegration:
    """Test walk-forward validation integration."""

    @pytest.fixture
    def sample_data(self):
        """Create sample data for walk-forward validation."""
        dates = pd.date_range(start="2022-01-01", periods=500, freq="D")
        np.random.seed(42)

        # Generate trending data
        trend = np.linspace(100, 120, 500)
        noise = np.random.randn(500) * 2
        prices = trend + noise

        data = pd.DataFrame(
            {
                "open": prices,
                "high": prices * 1.005,
                "low": prices * 0.995,
                "close": prices,
                "volume": np.random.randint(1000000, 5000000, 500),
            },
            index=dates,
        )

        return data

    def test_walk_forward_validation(self, sample_data):
        """Test walk-forward validation."""
        strategy = SMACrossoverStrategy(fast_period=10, slow_period=20)
        validator = WalkForwardValidator(train_period_days=100, test_period_days=30, step_days=30)

        result = validator.run(strategy=strategy, data=sample_data, symbol="TEST")

        assert len(result.windows) > 0
        assert hasattr(result, "avg_sharpe")
        assert hasattr(result, "avg_return")
        assert hasattr(result, "avg_max_dd")
        assert result.symbol == "TEST"
        assert result.strategy_name == "SMA_Crossover"

    def test_walk_forward_export(self, sample_data, tmp_path):
        """Test walk-forward results export."""
        strategy = SMACrossoverStrategy(fast_period=5, slow_period=15)
        validator = WalkForwardValidator(train_period_days=80, test_period_days=20)

        result = validator.run(strategy, sample_data, "TEST")

        # Export results
        exported_files = validator.export_results(result, tmp_path)

        assert "metrics" in exported_files
        assert "summary" in exported_files
        assert "plots" in exported_files

        # Check files exist
        for file_path in exported_files.values():
            assert file_path.exists()


class TestBrokerIntegration:
    """Test broker integration."""

    def test_simulated_broker_trading(self):
        """Test simulated broker trading flow."""
        broker = SimulatedBroker(initial_capital=10000, commission=0.001)

        # Connect
        assert broker.connect()

        # Set mock price
        broker.set_mock_price("AAPL", 150.0)

        # Create and place order
        from athena.core.types import Order, OrderSide, OrderType

        order = Order(symbol="AAPL", side=OrderSide.BUY, quantity=10, order_type=OrderType.MARKET)

        order_id = broker.place_order(order)
        assert order_id is not None

        # Check order status
        placed_order = broker.get_order_status(order_id)
        assert placed_order is not None
        assert placed_order.status.value == "filled"

        # Check positions
        positions = broker.get_positions()
        assert "AAPL" in positions
        assert positions["AAPL"].quantity == 10

        # Check portfolio
        portfolio = broker.get_portfolio()
        assert portfolio.cash < 10000  # Should be reduced by purchase
        assert len(portfolio.positions) == 1

        # Disconnect
        assert broker.disconnect()


class TestRiskManagement:
    """Test risk management integration."""

    def test_position_sizing_integration(self):
        """Test position sizing with risk management."""
        from athena.core.position import PositionSizer

        sizer = PositionSizer(
            max_position_size=0.1, max_gross_exposure=0.8, kelly_fraction_cap=0.25
        )

        # Test fixed fractional sizing
        position_size = sizer.fixed_fractional(equity=100000, risk_per_trade=0.02)
        assert 0 < position_size <= 10000  # 10% max position size

        # Test Kelly criterion
        kelly_size = sizer.kelly_criterion(
            equity=100000, win_probability=0.6, avg_win=1000, avg_loss=500
        )
        assert kelly_size >= 0

        # Test comprehensive recommendation
        historical_data = {
            "win_rate": 0.55,
            "avg_win": 1200,
            "avg_loss": 800,
            "atr": 2.5,
            "returns": pd.Series(np.random.randn(50) * 0.02),
        }

        recommendation = sizer.get_sizing_recommendation(
            equity=100000, price=150.0, historical_data=historical_data, method="kelly"
        )

        assert "recommended" in recommendation
        assert "risk_checks" in recommendation
        assert recommendation["recommended"]["position_size"] >= 0


def test_end_to_end_backtest_flow(tmp_path):
    """Test complete end-to-end backtest flow."""
    # Create synthetic data
    dates = pd.date_range(start="2023-01-01", periods=200, freq="D")
    np.random.seed(42)

    prices = 100 + np.cumsum(np.random.randn(200) * 0.5)
    data = pd.DataFrame(
        {
            "open": prices,
            "high": prices * 1.01,
            "low": prices * 0.99,
            "close": prices,
            "volume": np.random.randint(1000000, 5000000, 200),
        },
        index=dates,
    )

    # Initialize strategy
    strategy = SMACrossoverStrategy(fast_period=10, slow_period=20)

    # Run backtest
    engine = BacktestEngine(initial_capital=100000)
    result = engine.run(strategy, data, "TEST")

    # Verify results
    assert result.total_trades >= 0
    assert result.initial_capital == 100000
    assert result.final_capital > 0

    # Test metrics
    assert hasattr(result, "sharpe_ratio")
    assert hasattr(result, "max_drawdown")
    assert hasattr(result, "win_rate")

    # Test equity curve
    assert len(result.equity_curve) > 0
    assert result.equity_curve.iloc[0] == 100000  # Should start with initial capital
