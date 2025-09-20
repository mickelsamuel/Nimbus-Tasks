"""Tests for dashboard module."""

import pytest
import json
from unittest.mock import Mock, patch, MagicMock
import pandas as pd
import numpy as np

from athena.dashboard.app import app


class TestDashboardApp:
    """Test dashboard application."""

    def test_app_initialization(self):
        """Test that the dashboard app initializes correctly."""
        assert app is not None
        assert app.title == "Athena Trading Dashboard"

    def test_strategy_classes_available(self):
        """Test that strategy classes are properly imported."""
        from athena.dashboard.app import STRATEGY_CLASSES

        assert "SMA Crossover" in STRATEGY_CLASSES
        assert "Bollinger Bands" in STRATEGY_CLASSES
        assert "Momentum" in STRATEGY_CLASSES

    def test_param_spaces_available(self):
        """Test that parameter spaces are defined."""
        from athena.dashboard.app import PARAM_SPACES

        assert "SMA Crossover" in PARAM_SPACES
        assert "Bollinger Bands" in PARAM_SPACES
        assert "Momentum" in PARAM_SPACES


class TestDashboardCallbacks:
    """Test dashboard callback functions."""

    def test_update_strategy_params_sma(self):
        """Test strategy parameter update for SMA."""
        from athena.dashboard.app import update_strategy_params

        result = update_strategy_params("SMA Crossover")

        assert isinstance(result, list)
        assert len(result) > 0  # Should return parameter inputs

    def test_update_strategy_params_invalid(self):
        """Test strategy parameter update with invalid strategy."""
        from athena.dashboard.app import update_strategy_params

        result = update_strategy_params("Invalid Strategy")

        assert result == []

    def test_update_strategy_params_none(self):
        """Test strategy parameter update with None."""
        from athena.dashboard.app import update_strategy_params

        result = update_strategy_params(None)

        assert result == []

    @patch('athena.dashboard.app.YahooDataAdapter')
    @patch('athena.dashboard.app.BacktestEngine')
    @patch('athena.dashboard.app.SMACrossoverStrategy')
    def test_run_backtest_success(self, mock_strategy, mock_engine, mock_adapter):
        """Test successful backtest execution."""
        from athena.dashboard.app import run_backtest

        # Mock data adapter
        mock_data_instance = Mock()
        mock_data = pd.DataFrame({
            'Open': [100, 101, 102],
            'High': [101, 102, 103],
            'Low': [99, 100, 101],
            'Close': [100.5, 101.5, 102.5],
            'Volume': [1000000, 1100000, 1200000]
        })
        mock_data_instance.fetch.return_value = mock_data
        mock_adapter.return_value = mock_data_instance

        # Mock strategy
        mock_strategy_instance = Mock()
        mock_strategy.return_value = mock_strategy_instance

        # Mock backtest result
        mock_result = Mock()
        mock_result.initial_capital = 100000
        mock_result.final_capital = 115000
        mock_result.total_return = 0.15
        mock_result.annualized_return = 0.12
        mock_result.sharpe_ratio = 1.2
        mock_result.max_drawdown = 0.05
        mock_result.win_rate = 0.6
        mock_result.total_trades = 25
        mock_result.avg_trade_return = 0.006
        mock_result.volatility = 0.18
        mock_result.equity_curve = pd.Series([100000, 105000, 110000, 115000])
        mock_result.trades = []
        mock_result.daily_returns = pd.Series([0.01, 0.02, -0.01, 0.015])

        # Mock backtest engine
        mock_engine_instance = Mock()
        mock_engine_instance.run.return_value = mock_result
        mock_engine.return_value = mock_engine_instance

        # Run backtest callback
        result = run_backtest(
            1,  # n_clicks
            "AAPL",  # symbol
            "SMA Crossover",  # strategy_name
            "2023-01-01",  # start_date
            "2023-12-31",  # end_date
            100000,  # capital
            10,  # commission (bps)
            "fixed_fraction",  # risk_model
            10,  # position_size
            10,  # fast_period (param value)
            30   # slow_period (param value)
        )

        # Check result structure
        assert len(result) == 6
        results_data, alert_msg, alert_color, alert_open, section_style, export_disabled = result

        assert results_data is not None
        assert alert_color == "success"
        assert alert_open is True
        assert section_style == {"display": "block"}
        assert export_disabled is False

    def test_run_backtest_no_clicks(self):
        """Test backtest callback with no clicks."""
        from athena.dashboard.app import run_backtest

        result = run_backtest(
            None,  # n_clicks
            "AAPL", "SMA Crossover", "2023-01-01", "2023-12-31",
            100000, 10, "fixed_fraction", 10, 10, 30
        )

        # Should return initial state
        assert result[0] is None  # No results data
        assert result[4] == {"display": "none"}  # Results hidden
        assert result[5] is True  # Export disabled

    def test_run_backtest_missing_fields(self):
        """Test backtest callback with missing required fields."""
        from athena.dashboard.app import run_backtest

        result = run_backtest(
            1,  # n_clicks
            "",  # empty symbol
            "SMA Crossover", "2023-01-01", "2023-12-31",
            100000, 10, "fixed_fraction", 10, 10, 30
        )

        # Should return error
        assert result[0] is None  # No results data
        assert result[2] == "warning"  # Warning color
        assert result[3] is True  # Alert open

    @patch('athena.dashboard.app.YahooDataAdapter')
    def test_run_backtest_no_data(self, mock_adapter):
        """Test backtest callback when no data is available."""
        from athena.dashboard.app import run_backtest

        # Mock empty data
        mock_data_instance = Mock()
        mock_data_instance.fetch.return_value = pd.DataFrame()  # Empty DataFrame
        mock_adapter.return_value = mock_data_instance

        result = run_backtest(
            1, "INVALID", "SMA Crossover", "2023-01-01", "2023-12-31",
            100000, 10, "fixed_fraction", 10, 10, 30
        )

        assert result[0] is None
        assert result[2] == "danger"
        assert "No data available" in result[1]

    def test_update_metrics_table_no_data(self):
        """Test metrics table update with no data."""
        from athena.dashboard.app import update_metrics_table

        result = update_metrics_table(None)

        assert result == "No results available."

    def test_update_metrics_table_with_data(self):
        """Test metrics table update with valid data."""
        from athena.dashboard.app import update_metrics_table

        results_data = {
            "metrics": {
                "initial_capital": 100000,
                "final_capital": 115000,
                "total_return": 0.15,
                "annualized_return": 0.12,
                "sharpe_ratio": 1.2,
                "max_drawdown": 0.05,
                "win_rate": 0.6,
                "total_trades": 25,
                "volatility": 0.18
            }
        }

        result = update_metrics_table(results_data)

        # Should return a DataTable
        assert hasattr(result, 'data')
        assert len(result.data) > 0

    def test_update_quick_stats_no_data(self):
        """Test quick stats update with no data."""
        from athena.dashboard.app import update_quick_stats

        result = update_quick_stats(None)

        assert result == "No results available."

    def test_update_equity_curve_no_data(self):
        """Test equity curve update with no data."""
        from athena.dashboard.app import update_equity_curve

        result = update_equity_curve(None)

        assert result == {}

    def test_update_equity_curve_with_data(self):
        """Test equity curve update with valid data."""
        from athena.dashboard.app import update_equity_curve

        results_data = {
            "equity_curve": {
                "2023-01-01": 100000,
                "2023-06-01": 105000,
                "2023-12-31": 115000
            }
        }

        result = update_equity_curve(results_data)

        assert "data" in result
        assert "layout" in result
        assert result["layout"]["title"] == "Portfolio Equity Curve"

    def test_update_drawdown_chart_with_data(self):
        """Test drawdown chart update with valid data."""
        from athena.dashboard.app import update_drawdown_chart

        results_data = {
            "equity_curve": {
                "2023-01-01": 100000,
                "2023-06-01": 105000,
                "2023-09-01": 98000,  # Drawdown
                "2023-12-31": 115000
            }
        }

        result = update_drawdown_chart(results_data)

        assert "data" in result
        assert "layout" in result
        assert result["layout"]["title"] == "Portfolio Drawdown"

    def test_update_rolling_sharpe_no_data(self):
        """Test rolling Sharpe update with no data."""
        from athena.dashboard.app import update_rolling_sharpe

        result = update_rolling_sharpe(None)

        assert result == {}

    def test_update_rolling_sharpe_with_data(self):
        """Test rolling Sharpe update with valid data."""
        from athena.dashboard.app import update_rolling_sharpe

        # Create sample daily returns data
        dates = pd.date_range('2023-01-01', periods=100, freq='D')
        returns_data = {date.strftime('%Y-%m-%d'): np.random.normal(0.001, 0.02)
                       for date in dates}

        results_data = {
            "daily_returns": returns_data
        }

        result = update_rolling_sharpe(results_data)

        assert "data" in result
        assert "layout" in result

    def test_update_returns_distribution_no_data(self):
        """Test returns distribution update with no data."""
        from athena.dashboard.app import update_returns_distribution

        result = update_returns_distribution(None)

        assert result == {}

        # Test with empty daily_returns
        result = update_returns_distribution({"daily_returns": {}})

        assert result == {}

    def test_update_trade_table_no_trades(self):
        """Test trade table update with no trades."""
        from athena.dashboard.app import update_trade_table

        results_data = {"trades": []}

        result = update_trade_table(results_data)

        assert result == "No trades executed."

    def test_update_trade_table_with_trades(self):
        """Test trade table update with valid trades."""
        from athena.dashboard.app import update_trade_table

        results_data = {
            "trades": [
                {
                    "entry_date": "2023-01-15T10:30:00",
                    "exit_date": "2023-01-20T15:45:00",
                    "symbol": "AAPL",
                    "side": "long",
                    "quantity": 100,
                    "entry_price": 150.00,
                    "exit_price": 155.00,
                    "pnl": 500.00,
                    "return_pct": 0.033
                }
            ]
        }

        result = update_trade_table(results_data)

        assert hasattr(result, 'data')
        assert len(result.data) == 1
        assert result.data[0]["Side"] == "LONG"


class TestDashboardComponentsNavigation:
    """Test dashboard component interactions."""

    def test_parameter_heatmap_no_data(self):
        """Test parameter heatmap with no optimization data."""
        from athena.dashboard.app import update_parameter_heatmap

        result = update_parameter_heatmap(None)

        assert result == {}

    def test_optimization_leaderboard_no_data(self):
        """Test optimization leaderboard with no data."""
        from athena.dashboard.app import update_optimization_leaderboard

        result = update_optimization_leaderboard(None)

        assert result == "No optimization results available."

    def test_wfv_table_no_data(self):
        """Test walk-forward validation table with no data."""
        from athena.dashboard.app import update_wfv_table

        result = update_wfv_table(None)

        assert result == "No walk-forward validation results available."

    @patch('athena.dashboard.app.StrategyOptimizer')
    @patch('athena.dashboard.app.YahooDataAdapter')
    def test_run_optimization_success(self, mock_adapter, mock_optimizer):
        """Test successful optimization execution."""
        from athena.dashboard.app import run_optimization

        # Mock data adapter
        mock_data_instance = Mock()
        mock_data = pd.DataFrame({
            'Close': [100, 101, 102, 103, 104],
            'Volume': [1000, 1100, 1200, 1300, 1400]
        })
        mock_data_instance.fetch.return_value = mock_data
        mock_adapter.return_value = mock_data_instance

        # Mock optimizer
        mock_optimizer_instance = Mock()
        mock_study = Mock()
        mock_study.best_value = 1.5
        mock_study.best_params = {"fast_period": 10, "slow_period": 30}
        mock_study.trials = [
            Mock(number=1, value=1.2, params={"fast_period": 8, "slow_period": 25}, user_attrs={}),
            Mock(number=2, value=1.5, params={"fast_period": 10, "slow_period": 30}, user_attrs={})
        ]

        mock_optimizer_instance.optimize.return_value = (mock_study.best_params, mock_study)
        mock_optimizer.return_value = mock_optimizer_instance

        result = run_optimization(
            1,  # n_clicks
            "AAPL",  # symbol
            "SMA Crossover",  # strategy
            "2023-01-01", "2023-12-31",  # dates
            100000, 10  # capital, commission
        )

        assert len(result) == 4
        opt_results, alert_msg, alert_color, alert_open = result

        assert opt_results is not None
        assert alert_color == "success"
        assert "Best Sharpe: 1.500" in alert_msg


class TestDashboardErrorHandling:
    """Test dashboard error handling."""

    @patch('athena.dashboard.app.YahooDataAdapter')
    def test_backtest_exception_handling(self, mock_adapter):
        """Test backtest error handling."""
        from athena.dashboard.app import run_backtest

        # Mock adapter that raises exception
        mock_adapter.side_effect = Exception("Network error")

        result = run_backtest(
            1, "AAPL", "SMA Crossover", "2023-01-01", "2023-12-31",
            100000, 10, "fixed_fraction", 10, 10, 30
        )

        assert result[0] is None  # No results
        assert result[2] == "danger"  # Error color
        assert "Error running backtest" in result[1]

    @patch('athena.dashboard.app.StrategyOptimizer')
    def test_optimization_exception_handling(self, mock_optimizer):
        """Test optimization error handling."""
        from athena.dashboard.app import run_optimization

        # Mock optimizer that raises exception
        mock_optimizer.side_effect = Exception("Optimization failed")

        result = run_optimization(
            1, "AAPL", "SMA Crossover", "2023-01-01", "2023-12-31", 100000, 10
        )

        assert result[0] is None  # No results
        assert result[2] == "danger"  # Error color
        assert "Optimization failed" in result[1]


class TestDashboardUtilities:
    """Test dashboard utility functions."""

    def test_cache_directory_creation(self):
        """Test that cache directories are created."""
        from athena.dashboard.app import CACHE_DIR, ARTIFACTS_DIR

        assert CACHE_DIR.exists()
        assert ARTIFACTS_DIR.exists()

    def test_risk_model_options(self):
        """Test that risk model options are defined."""
        from athena.dashboard.app import RISK_MODELS

        assert "Fixed Fraction" in RISK_MODELS
        assert "Kelly Criterion" in RISK_MODELS
        assert "Capped Kelly" in RISK_MODELS

    def test_executor_configuration(self):
        """Test that thread executor is configured."""
        from athena.dashboard.app import executor

        assert executor is not None
        assert executor._max_workers > 0


class TestDashboardLayout:
    """Test dashboard layout components."""

    def test_create_header(self):
        """Test header creation."""
        from athena.dashboard.app import create_header

        header = create_header()

        assert header is not None
        # Header should contain title and timestamp

    def test_create_controls(self):
        """Test controls creation."""
        from athena.dashboard.app import create_controls

        controls = create_controls()

        assert controls is not None
        # Controls should contain input fields and buttons

    def test_create_results_section(self):
        """Test results section creation."""
        from athena.dashboard.app import create_results_section

        results = create_results_section()

        assert results is not None
        # Results section should be initially hidden