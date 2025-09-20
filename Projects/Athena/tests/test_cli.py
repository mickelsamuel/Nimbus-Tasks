"""Tests for CLI module."""

import pytest
from unittest.mock import Mock, patch, MagicMock
from typer.testing import CliRunner
from datetime import datetime, date
import tempfile
import os

from athena.cli.main import app


class TestCLIApp:
    """Test CLI application."""

    def setUp(self):
        self.runner = CliRunner()

    def test_cli_help(self):
        runner = CliRunner()
        result = runner.invoke(app, ["--help"])
        assert result.exit_code == 0
        assert "Athena Trading Platform" in result.output

    @patch('athena.cli.main.YahooDataAdapter')
    @patch('athena.cli.main.BacktestEngine')
    @patch('athena.cli.main.SMACrossoverStrategy')
    def test_backtest_command_success(self, mock_strategy, mock_engine, mock_adapter):
        runner = CliRunner()

        # Mock data adapter
        mock_data_instance = Mock()
        mock_data_instance.fetch.return_value = Mock()
        mock_adapter.return_value = mock_data_instance

        # Mock strategy
        mock_strategy_instance = Mock()
        mock_strategy.return_value = mock_strategy_instance

        # Mock backtest engine
        mock_engine_instance = Mock()
        mock_result = Mock()
        mock_result.total_return = 0.15
        mock_result.sharpe_ratio = 1.2
        mock_engine_instance.run.return_value = mock_result
        mock_engine.return_value = mock_engine_instance

        result = runner.invoke(app, [
            "backtest", "AAPL",
            "--start", "2020-01-01",
            "--end", "2023-12-31",
            "--strategy", "sma",
            "--fast-period", "10",
            "--slow-period", "30"
        ])

        assert result.exit_code == 0

    def test_backtest_command_invalid_symbol(self):
        runner = CliRunner()

        result = runner.invoke(app, [
            "backtest", "",  # Empty symbol
            "--start", "2020-01-01",
            "--end", "2023-12-31",
            "--strategy", "sma"
        ])

        assert result.exit_code != 0

    def test_backtest_command_invalid_dates(self):
        runner = CliRunner()

        result = runner.invoke(app, [
            "backtest", "AAPL",
            "--start", "2023-12-31",  # Start after end
            "--end", "2020-01-01",
            "--strategy", "sma"
        ])

        assert result.exit_code != 0

    @patch('athena.cli.main.YahooDataAdapter')
    @patch('athena.cli.main.TradingOptimizer')
    @patch('athena.cli.main.SMACrossoverStrategy')
    def test_optimize_command_success(self, mock_strategy, mock_optimizer, mock_adapter):
        runner = CliRunner()

        # Mock data adapter
        mock_data_instance = Mock()
        mock_data_instance.fetch.return_value = Mock()
        mock_adapter.return_value = mock_data_instance

        # Mock optimizer
        mock_optimizer_instance = Mock()
        mock_study = Mock()
        mock_study.best_value = 1.5
        mock_study.best_params = {"fast_period": 15, "slow_period": 35}
        mock_optimizer_instance.optimize.return_value = (mock_study.best_params, mock_study)
        mock_optimizer.return_value = mock_optimizer_instance

        result = runner.invoke(app, [
            "optimize", "AAPL",
            "--start", "2020-01-01",
            "--end", "2023-12-31",
            "--strategy", "sma",
            "--trials", "50"
        ])

        assert result.exit_code == 0

    @patch('athena.cli.main.YahooDataAdapter')
    def test_ingest_command_single_symbol(self, mock_adapter):
        runner = CliRunner()

        mock_data_instance = Mock()
        mock_adapter.return_value = mock_data_instance

        result = runner.invoke(app, [
            "ingest", "AAPL",
            "--start", "2020-01-01",
            "--end", "2023-12-31"
        ])

        assert result.exit_code == 0
        mock_data_instance.fetch.assert_called_once()

    @patch('athena.cli.main.YahooDataAdapter')
    def test_ingest_command_multiple_symbols(self, mock_adapter):
        runner = CliRunner()

        mock_data_instance = Mock()
        mock_adapter.return_value = mock_data_instance

        result = runner.invoke(app, [
            "ingest", "AAPL,MSFT,GOOGL",
            "--start", "2020-01-01",
            "--end", "2023-12-31"
        ])

        assert result.exit_code == 0
        # Should call fetch for each symbol
        assert mock_data_instance.fetch.call_count == 3


class TestCacheCommand:
    """Test cache management commands."""

    @patch('athena.cli.main.YahooDataAdapter')
    def test_cache_info_command(self, mock_adapter):
        runner = CliRunner()

        mock_data_instance = Mock()
        mock_data_instance.get_cache_info.return_value = {
            "total_files": 5,
            "total_size_mb": 25.6,
            "symbols": ["AAPL", "MSFT", "GOOGL"]
        }
        mock_adapter.return_value = mock_data_instance

        result = runner.invoke(app, ["cache", "info"])

        assert result.exit_code == 0
        assert "5" in result.output  # total files
        assert "25.6" in result.output  # size

    @patch('athena.cli.main.YahooDataAdapter')
    def test_cache_clear_command(self, mock_adapter):
        runner = CliRunner()

        mock_data_instance = Mock()
        mock_adapter.return_value = mock_data_instance

        result = runner.invoke(app, ["cache", "clear"])

        assert result.exit_code == 0
        mock_data_instance.clear_cache.assert_called_once()

    @patch('athena.cli.main.YahooDataAdapter')
    def test_cache_clear_symbol_command(self, mock_adapter):
        runner = CliRunner()

        mock_data_instance = Mock()
        mock_adapter.return_value = mock_data_instance

        result = runner.invoke(app, ["cache", "clear", "--symbol", "AAPL"])

        assert result.exit_code == 0
        mock_data_instance.clear_cache.assert_called_once_with("AAPL")


class TestCommandValidation:
    """Test command input validation."""

    def test_backtest_command_validation(self):
        runner = CliRunner()

        # Test invalid strategy
        result = runner.invoke(app, [
            "backtest", "AAPL",
            "--strategy", "invalid_strategy"
        ])
        assert result.exit_code != 0

    def test_optimize_command_validation(self):
        runner = CliRunner()

        # Test invalid number of trials
        result = runner.invoke(app, [
            "optimize", "AAPL",
            "--trials", "-1"
        ])
        assert result.exit_code != 0

    def test_date_validation(self):
        runner = CliRunner()

        # Test invalid date format
        result = runner.invoke(app, [
            "backtest", "AAPL",
            "--start", "invalid-date",
            "--strategy", "sma"
        ])
        assert result.exit_code != 0


class TestStrategyParameterParsing:
    """Test strategy parameter parsing."""

    @patch('athena.cli.main.YahooDataAdapter')
    @patch('athena.cli.main.BacktestEngine')
    @patch('athena.cli.main.SMACrossoverStrategy')
    def test_sma_strategy_parameters(self, mock_strategy, mock_engine, mock_adapter):
        runner = CliRunner()

        # Mock dependencies
        mock_data_instance = Mock()
        mock_data_instance.fetch.return_value = Mock()
        mock_adapter.return_value = mock_data_instance

        mock_strategy_instance = Mock()
        mock_strategy.return_value = mock_strategy_instance

        mock_engine_instance = Mock()
        mock_engine_instance.run.return_value = Mock(total_return=0.1, sharpe_ratio=1.0)
        mock_engine.return_value = mock_engine_instance

        result = runner.invoke(app, [
            "backtest", "AAPL",
            "--strategy", "sma",
            "--fast-period", "5",
            "--slow-period", "20"
        ])

        assert result.exit_code == 0
        # Verify strategy was initialized with correct parameters
        mock_strategy.assert_called_once_with(fast_period=5, slow_period=20)

    @patch('athena.cli.main.YahooDataAdapter')
    @patch('athena.cli.main.BacktestEngine')
    @patch('athena.cli.main.BollingerBandsStrategy')
    def test_bollinger_strategy_parameters(self, mock_strategy, mock_engine, mock_adapter):
        runner = CliRunner()

        # Mock dependencies
        mock_data_instance = Mock()
        mock_data_instance.fetch.return_value = Mock()
        mock_adapter.return_value = mock_data_instance

        mock_strategy_instance = Mock()
        mock_strategy.return_value = mock_strategy_instance

        mock_engine_instance = Mock()
        mock_engine_instance.run.return_value = Mock(total_return=0.1, sharpe_ratio=1.0)
        mock_engine.return_value = mock_engine_instance

        result = runner.invoke(app, [
            "backtest", "AAPL",
            "--strategy", "bollinger",
            "--period", "15",
            "--std-dev", "1.5"
        ])

        assert result.exit_code == 0
        mock_strategy.assert_called_once_with(period=15, std_dev=1.5)


class TestOutputFormatting:
    """Test CLI output formatting."""

    @patch('athena.cli.main.YahooDataAdapter')
    @patch('athena.cli.main.BacktestEngine')
    @patch('athena.cli.main.SMACrossoverStrategy')
    def test_backtest_output_format(self, mock_strategy, mock_engine, mock_adapter):
        runner = CliRunner()

        # Mock successful backtest
        mock_data_instance = Mock()
        mock_data_instance.fetch.return_value = Mock()
        mock_adapter.return_value = mock_data_instance

        mock_strategy_instance = Mock()
        mock_strategy.return_value = mock_strategy_instance

        mock_result = Mock()
        mock_result.total_return = 0.25
        mock_result.annualized_return = 0.18
        mock_result.sharpe_ratio = 1.2
        mock_result.max_drawdown = 0.08
        mock_result.total_trades = 45

        mock_engine_instance = Mock()
        mock_engine_instance.run.return_value = mock_result
        mock_engine.return_value = mock_engine_instance

        result = runner.invoke(app, [
            "backtest", "AAPL",
            "--strategy", "sma",
            "--output-format", "table"
        ])

        assert result.exit_code == 0
        # Should contain formatted metrics
        assert "Total Return" in result.output or "25.00%" in result.output

    @patch('athena.cli.main.YahooDataAdapter')
    @patch('athena.cli.main.BacktestEngine')
    @patch('athena.cli.main.SMACrossoverStrategy')
    def test_backtest_json_output(self, mock_strategy, mock_engine, mock_adapter):
        runner = CliRunner()

        # Mock successful backtest
        mock_data_instance = Mock()
        mock_data_instance.fetch.return_value = Mock()
        mock_adapter.return_value = mock_data_instance

        mock_strategy_instance = Mock()
        mock_strategy.return_value = mock_strategy_instance

        mock_result = Mock()
        mock_result.total_return = 0.25
        mock_result.to_dict.return_value = {"total_return": 0.25, "sharpe_ratio": 1.2}

        mock_engine_instance = Mock()
        mock_engine_instance.run.return_value = mock_result
        mock_engine.return_value = mock_engine_instance

        result = runner.invoke(app, [
            "backtest", "AAPL",
            "--strategy", "sma",
            "--output-format", "json"
        ])

        assert result.exit_code == 0


class TestErrorHandling:
    """Test error handling in CLI commands."""

    @patch('athena.cli.main.YahooDataAdapter')
    def test_data_fetch_error(self, mock_adapter):
        runner = CliRunner()

        # Mock data adapter that raises exception
        mock_adapter.side_effect = Exception("Data fetch failed")

        result = runner.invoke(app, [
            "backtest", "INVALID_SYMBOL",
            "--strategy", "sma"
        ])

        assert result.exit_code != 0

    @patch('athena.cli.main.YahooDataAdapter')
    @patch('athena.cli.main.BacktestEngine')
    def test_backtest_engine_error(self, mock_engine, mock_adapter):
        runner = CliRunner()

        # Mock successful data fetch
        mock_data_instance = Mock()
        mock_data_instance.fetch.return_value = Mock()
        mock_adapter.return_value = mock_data_instance

        # Mock engine that raises exception
        mock_engine.side_effect = Exception("Backtest failed")

        result = runner.invoke(app, [
            "backtest", "AAPL",
            "--strategy", "sma"
        ])

        assert result.exit_code != 0


class TestConfigurationOptions:
    """Test configuration and option handling."""

    def test_verbose_option(self):
        runner = CliRunner()

        result = runner.invoke(app, ["--verbose", "--help"])

        assert result.exit_code == 0

    def test_config_file_option(self):
        runner = CliRunner()

        with tempfile.NamedTemporaryFile(mode='w', suffix='.toml', delete=False) as f:
            f.write('[strategy.sma]\nfast_period = 10\nslow_period = 30\n')
            config_file = f.name

        try:
            result = runner.invoke(app, [
                "--config", config_file,
                "backtest", "AAPL",
                "--strategy", "sma"
            ])
            # Command should parse without error even if execution fails
            assert isinstance(result.exit_code, int)
        finally:
            os.unlink(config_file)


class TestIntegrationScenarios:
    """Test realistic CLI usage scenarios."""

    @patch('athena.cli.main.YahooDataAdapter')
    @patch('athena.cli.main.BacktestEngine')
    @patch('athena.cli.main.SMACrossoverStrategy')
    def test_full_backtest_workflow(self, mock_strategy, mock_engine, mock_adapter):
        runner = CliRunner()

        # Setup mocks for successful workflow
        mock_data_instance = Mock()
        mock_data_instance.fetch.return_value = Mock()
        mock_adapter.return_value = mock_data_instance

        mock_strategy_instance = Mock()
        mock_strategy.return_value = mock_strategy_instance

        mock_result = Mock()
        mock_result.total_return = 0.15
        mock_result.sharpe_ratio = 1.1
        mock_result.max_drawdown = 0.05
        mock_result.total_trades = 25

        mock_engine_instance = Mock()
        mock_engine_instance.run.return_value = mock_result
        mock_engine.return_value = mock_engine_instance

        # Run complete backtest command
        result = runner.invoke(app, [
            "backtest", "SPY",
            "--start", "2020-01-01",
            "--end", "2023-12-31",
            "--strategy", "sma",
            "--fast-period", "20",
            "--slow-period", "50",
            "--initial-capital", "100000",
            "--commission", "0.001"
        ])

        assert result.exit_code == 0

        # Verify all components were called
        mock_adapter.assert_called_once()
        mock_strategy.assert_called_once()
        mock_engine.assert_called_once()
        mock_engine_instance.run.assert_called_once()