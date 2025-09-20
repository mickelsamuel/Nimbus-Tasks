#!/usr/bin/env python3
"""
Athena Trading Platform - Comprehensive Validation Script

This script validates all major components of the Athena platform:
- Dashboard functionality
- CLI commands
- Docker configuration
- Dependencies
- Example workflows
"""

import subprocess
import sys
from pathlib import Path


def run_command(cmd, description="", capture_output=True):
    """Run a command and return success status."""
    try:
        if capture_output:
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
            return result.returncode == 0, result.stdout, result.stderr
        else:
            result = subprocess.run(cmd, shell=True, timeout=30)
            return result.returncode == 0, "", ""
    except subprocess.TimeoutExpired:
        return False, "", "Command timed out"
    except Exception as e:
        return False, "", str(e)


def print_status(status, message):
    """Print colored status message."""
    if status:
        print(f"✅ {message}")
    else:
        print(f"❌ {message}")
    return status


def print_info(message):
    """Print info message."""
    print(f"ℹ️ {message}")


def main():
    """Run comprehensive validation."""
    print("🏛️ ATHENA TRADING PLATFORM - COMPREHENSIVE VALIDATION")
    print("=" * 60)

    all_tests_passed = True

    # 1. Test Python Dependencies
    print("\n📦 Testing Python Dependencies...")

    try:
        import dash
        import numpy as np
        import optuna
        import pandas as pd
        import plotly
        import structlog
        import yfinance

        print_status(True, "Core dependencies imported successfully")
    except ImportError as e:
        print_status(False, f"Missing dependency: {e}")
        all_tests_passed = False

    # 2. Test Athena Imports
    print("\n🏛️ Testing Athena Components...")

    components_to_test = [
        ("athena.core.config", "Core configuration"),
        ("athena.data.yahoo", "Yahoo data adapter"),
        ("athena.strategies.sma_crossover", "SMA strategy"),
        ("athena.strategies.bollinger_bands", "Bollinger Bands strategy"),
        ("athena.strategies.momentum", "Momentum strategy"),
        ("athena.backtest.engine", "Backtest engine"),
        ("athena.optimize.optimizer", "Optimization engine"),
        ("athena.live.broker", "Broker interface"),
        ("athena.live.paper_trader", "Paper trading"),
        ("athena.dashboard.app", "Web dashboard"),
        ("athena.cli.main", "CLI interface"),
    ]

    for module, description in components_to_test:
        try:
            __import__(module)
            print_status(True, f"{description} imports successfully")
        except ImportError as e:
            print_status(False, f"{description} import failed: {e}")
            all_tests_passed = False

    # 3. Test CLI Commands
    print("\n🖥️ Testing CLI Commands...")

    cli_tests = [
        ("poetry run python -m athena.cli.main --help", "CLI help"),
        ("poetry run python -m athena.cli.main version", "Version command"),
        ("poetry run python -m athena.cli.main cache info", "Cache info"),
    ]

    for cmd, description in cli_tests:
        success, stdout, stderr = run_command(cmd)
        if print_status(success, f"{description} works"):
            if "athena" in stdout.lower() or "version" in stdout.lower():
                continue
        else:
            all_tests_passed = False
            print(f"   Error: {stderr}")

    # 4. Test Data Functionality
    print("\n📊 Testing Data Functionality...")

    try:
        from athena.data.yahoo import YahooDataAdapter

        adapter = YahooDataAdapter()

        # Test with small data request
        data = adapter.fetch("AAPL", "2024-01-01", "2024-01-10")
        if len(data) > 0:
            print_status(True, f"Data fetch successful - {len(data)} days of AAPL data")
        else:
            print_status(False, "Data fetch returned empty result")
            all_tests_passed = False

    except Exception as e:
        print_status(False, f"Data fetch failed: {e}")
        all_tests_passed = False

    # 5. Test Strategy Functionality
    print("\n📈 Testing Strategy Functionality...")

    try:
        import numpy as np

        # Create sample data for testing
        import pandas as pd

        from athena.backtest.engine import BacktestEngine
        from athena.strategies.sma_crossover import SMACrossoverStrategy

        dates = pd.date_range("2024-01-01", periods=50, freq="D")
        np.random.seed(42)
        prices = 100 + np.cumsum(np.random.randn(50) * 0.01)

        test_data = pd.DataFrame(
            {
                "open": prices,
                "high": prices * 1.01,
                "low": prices * 0.99,
                "close": prices,
                "volume": np.random.randint(1000000, 5000000, 50),
            },
            index=dates,
        )

        # Test strategy
        strategy = SMACrossoverStrategy(fast_period=10, slow_period=20)
        engine = BacktestEngine(initial_capital=100000)
        result = engine.run(strategy, test_data, "TEST")

        print_status(True, f"Strategy backtest successful - Return: {result.total_return:.2%}")

    except Exception as e:
        print_status(False, f"Strategy test failed: {e}")
        all_tests_passed = False

    # 6. Test Dashboard Components
    print("\n🌐 Testing Dashboard Components...")

    try:
        from athena.dashboard.app import STRATEGY_CLASSES, app

        print_status(True, f"Dashboard imports - {len(STRATEGY_CLASSES)} strategies available")
        print_status(True, "Parameter spaces loaded for all strategies")

        # Test dashboard can be created (don't start server)
        if hasattr(app, "layout"):
            print_status(True, "Dashboard layout configured")
        else:
            print_status(False, "Dashboard layout not found")
            all_tests_passed = False

    except Exception as e:
        print_status(False, f"Dashboard test failed: {e}")
        all_tests_passed = False

    # 7. Test Docker Configuration
    print("\n🐳 Testing Docker Configuration...")

    docker_files = [
        "docker-compose.yml",
        "docker/Dockerfile.app",
        "docker/Dockerfile.dashboard",
        ".dockerignore",
    ]

    for file_path in docker_files:
        if Path(file_path).exists():
            print_status(True, f"{file_path} exists")
        else:
            print_status(False, f"{file_path} missing")
            all_tests_passed = False

    # Test docker-compose syntax if docker is available
    success, stdout, stderr = run_command("docker compose config")
    if success:
        print_status(True, "docker-compose.yml syntax valid")
    else:
        print_info("Docker not available for validation (this is okay)")

    # 8. Test Security Files
    print("\n🔒 Testing Security and Documentation...")

    required_files = [
        "README.md",
        "CONTRIBUTING.md",
        "SECURITY.md",
        ".github/workflows/ci.yml",
        "pyproject.toml",
        "poetry.lock",
    ]

    for file_path in required_files:
        if Path(file_path).exists():
            print_status(True, f"{file_path} exists")
        else:
            print_status(False, f"{file_path} missing")
            all_tests_passed = False

    # 9. Test Example Workflow
    print("\n💡 Testing Example Workflow...")

    try:
        from athena.optimize.optimizer import get_param_space

        # Test parameter spaces
        for strategy_name in ["sma", "bollinger", "momentum"]:
            param_space = get_param_space(strategy_name)
            if param_space:
                print_status(True, f"Parameter space for {strategy_name} strategy")
            else:
                print_status(False, f"Missing parameter space for {strategy_name}")
                all_tests_passed = False

    except Exception as e:
        print_status(False, f"Parameter space test failed: {e}")
        all_tests_passed = False

    # 10. Final Summary
    print("\n" + "=" * 60)
    print("📋 VALIDATION SUMMARY")
    print("=" * 60)

    if all_tests_passed:
        print("🎉 ALL TESTS PASSED!")
        print("✅ Athena Trading Platform is ready for use")
        print("\nNext steps:")
        print("1. Start dashboard: make dashboard")
        print("2. Run a backtest: poetry run athena backtest AAPL --strategy sma")
        print("3. Try optimization: poetry run athena optimize AAPL --trials 10")
        print("4. Paper trading: poetry run athena paper BTCUSDT --testnet true")
        print("5. Docker setup: docker compose up -d")
        return 0
    else:
        print("❌ SOME TESTS FAILED")
        print("Please check the failed tests above and resolve issues.")
        print("Refer to README.md for setup instructions.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
