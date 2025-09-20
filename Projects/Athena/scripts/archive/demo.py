#!/usr/bin/env python3
"""
Athena Trading Platform Demo

This script demonstrates the key capabilities of Athena:
- Data ingestion and caching
- Strategy backtesting
- Parameter optimization
- Walk-forward validation
- Risk management
- Dashboard capabilities
"""

import time

from athena.backtest.engine import BacktestEngine
from athena.backtest.walk_forward import WalkForwardValidator
from athena.data.yahoo import YahooDataAdapter
from athena.optimize.optimizer import StrategyOptimizer, get_param_space
from athena.strategies.bollinger_bands import BollingerBandsStrategy
from athena.strategies.sma_crossover import SMACrossoverStrategy


def print_header(title):
    """Print a formatted header."""
    print(f"\n{'='*60}")
    print(f"🏛️ {title}")
    print(f"{'='*60}")


def print_section(title):
    """Print a formatted section header."""
    print(f"\n🔹 {title}")
    print("-" * 50)


def demo_data_ingestion():
    """Demonstrate data ingestion and caching."""
    print_section("Data Ingestion & Caching")

    adapter = YahooDataAdapter()

    # Fetch data for multiple symbols
    symbols = ["AAPL", "SPY", "QQQ"]
    start_date = "2023-01-01"
    end_date = "2023-12-31"

    print(f"📥 Fetching data for {symbols} from {start_date} to {end_date}")

    for symbol in symbols:
        data = adapter.fetch(symbol, start_date, end_date)
        print(f"   ✅ {symbol}: {len(data)} trading days")

    # Show cache info
    cache_info = adapter.get_cache_info()
    print(
        f"💾 Cache contains {cache_info['total_files']} files, "
        f"{cache_info['total_size_mb']:.1f} MB"
    )


def demo_strategy_backtesting():
    """Demonstrate strategy backtesting."""
    print_section("Strategy Backtesting")

    # Get data
    adapter = YahooDataAdapter()
    data = adapter.fetch("SPY", "2023-01-01", "2023-12-31")

    # Test multiple strategies
    strategies = [
        ("SMA Crossover", SMACrossoverStrategy(fast_period=20, slow_period=50)),
        ("Bollinger Bands", BollingerBandsStrategy(period=20, std_dev=2.0)),
    ]

    results = []
    engine = BacktestEngine(initial_capital=100000, commission=0.001)

    for name, strategy in strategies:
        print(f"🔄 Testing {name}...")
        result = engine.run(strategy, data, "SPY")

        results.append((name, result))
        print(f"   📈 Return: {result.total_return:.2%}")
        print(f"   📊 Sharpe: {result.sharpe_ratio:.3f}")
        print(f"   📉 Max DD: {result.max_drawdown:.2%}")
        print(f"   🎯 Trades: {result.total_trades}")

    return results


def demo_optimization():
    """Demonstrate parameter optimization."""
    print_section("Parameter Optimization")

    # Get data
    adapter = YahooDataAdapter()
    data = adapter.fetch("AAPL", "2022-01-01", "2023-12-31")

    # Optimize SMA strategy
    print("🎯 Optimizing SMA Crossover strategy...")

    optimizer = StrategyOptimizer()
    param_space = get_param_space("sma")

    start_time = time.time()
    results = optimizer.optimize(
        strategy_class=SMACrossoverStrategy,
        data=data,
        symbol="AAPL",
        param_space=param_space,
        n_trials=20,  # Quick optimization for demo
        timeout=60,
    )
    end_time = time.time()

    print(f"⏱️ Optimization completed in {end_time - start_time:.1f} seconds")
    print(f"🏆 Best parameters: {results['best_params']}")
    print(f"📊 Best Sharpe ratio: {results['best_sharpe']:.3f}")
    print(f"📈 Best return: {results['best_return']:.2%}")
    print(f"🔄 Trials completed: {results['n_trials']}")

    return results


def demo_walk_forward_validation():
    """Demonstrate walk-forward validation."""
    print_section("Walk-Forward Validation")

    # Get data
    adapter = YahooDataAdapter()
    data = adapter.fetch("SPY", "2022-01-01", "2023-12-31")

    # Create strategy
    strategy = SMACrossoverStrategy(fast_period=20, slow_period=50)

    # Set up validator
    validator = WalkForwardValidator(
        train_period_days=180,  # 6 months training
        test_period_days=30,  # 1 month testing
        step_days=30,  # 1 month steps
    )

    print("🔄 Running walk-forward validation...")
    print(f"   📚 Training period: {validator.train_period_days} days")
    print(f"   🧪 Testing period: {validator.test_period_days} days")
    print(f"   👟 Step size: {validator.step_days} days")

    result = validator.run(strategy, data, "SPY")

    print("✅ Validation completed:")
    print(f"   🪟 Windows analyzed: {len(result.windows)}")
    print(f"   📊 Average Sharpe: {result.avg_sharpe:.3f}")
    print(f"   📈 Average return: {result.avg_return:.2%}")
    print(f"   📉 Average max DD: {result.avg_max_dd:.2%}")
    print(f"   🎯 Average win rate: {result.avg_win_rate:.2%}")

    return result


def demo_risk_management():
    """Demonstrate risk management capabilities."""
    print_section("Risk Management & Position Sizing")

    from athena.core.position import PositionSizer

    # Create position sizer with conservative settings
    sizer = PositionSizer(
        max_position_size=0.1,  # 10% max position
        max_gross_exposure=0.8,  # 80% max exposure
        kelly_fraction_cap=0.25,  # 25% Kelly cap
        min_position_value=1000,  # $1000 minimum
    )

    equity = 100000
    price = 150.0

    print(f"💰 Portfolio equity: ${equity:,}")
    print(f"💵 Stock price: ${price}")

    # Test different position sizing methods
    print("\n📏 Position Sizing Methods:")

    # Fixed fractional
    size_fixed = sizer.fixed_fractional(equity, risk_per_trade=0.02)
    print(f"   🔸 Fixed fractional (2% risk): {size_fixed} shares")

    # Kelly criterion (with mock data)
    size_kelly = sizer.kelly_criterion(
        equity=equity, win_probability=0.55, avg_win=1000, avg_loss=800
    )
    print(f"   🔸 Kelly criterion: {size_kelly} shares")

    # ATR-based (with mock ATR)
    size_atr = sizer.atr_based_sizing(
        equity=equity, price=price, atr=2.5, atr_multiplier=2.0, risk_per_trade=0.02
    )
    print(f"   🔸 ATR-based (2% risk): {size_atr} shares")

    print("\n🛡️ Risk Controls:")
    print(f"   📊 Max position size: {sizer.max_position_size:.1%}")
    print(f"   📈 Max gross exposure: {sizer.max_gross_exposure:.1%}")
    print(f"   🎯 Kelly fraction cap: {sizer.kelly_fraction_cap:.1%}")


def demo_dashboard_info():
    """Show dashboard information."""
    print_section("Interactive Dashboard")

    print("🌐 The Athena dashboard provides:")
    print("   📊 Real-time strategy backtesting")
    print("   📈 Interactive parameter tuning")
    print("   📉 Rich visualizations (equity curves, drawdowns)")
    print("   📋 Performance metrics and trade analysis")
    print("   💾 Result caching and export capabilities")
    print("   🔄 Support for all three strategies")

    print("\n🚀 To launch the dashboard:")
    print("   make dashboard")
    print("   # or")
    print("   poetry run python -m athena.dashboard.app")
    print("   # then visit http://localhost:8050")


def main():
    """Run the complete demo."""
    print_header("ATHENA TRADING PLATFORM DEMO")

    print("🎯 This demo showcases the key capabilities of Athena:")
    print("   • Data ingestion and caching")
    print("   • Strategy backtesting")
    print("   • Parameter optimization")
    print("   • Walk-forward validation")
    print("   • Risk management")
    print("   • Dashboard capabilities")

    try:
        # 1. Data ingestion
        demo_data_ingestion()

        # 2. Strategy backtesting
        backtest_results = demo_strategy_backtesting()

        # 3. Parameter optimization
        optimization_results = demo_optimization()

        # 4. Walk-forward validation
        wfv_results = demo_walk_forward_validation()

        # 5. Risk management
        demo_risk_management()

        # 6. Dashboard info
        demo_dashboard_info()

        # Summary
        print_header("DEMO COMPLETED SUCCESSFULLY!")

        print("🎉 All components demonstrated successfully!")
        print("\n📊 Summary of results:")

        if backtest_results:
            best_strategy = max(backtest_results, key=lambda x: x[1].total_return)
            print(f"   🏆 Best performing strategy: {best_strategy[0]}")
            print(f"   📈 Best return: {best_strategy[1].total_return:.2%}")

        if optimization_results:
            print(
                f"   🎯 Optimization improved Sharpe to: {optimization_results['best_sharpe']:.3f}"
            )

        if wfv_results:
            print(f"   🔄 Walk-forward validation: {len(wfv_results.windows)} windows analyzed")

        print("\n🚀 Next steps:")
        print("   1. Launch dashboard: make dashboard")
        print("   2. Try different strategies and parameters")
        print("   3. Run longer optimizations")
        print("   4. Test paper trading: poetry run athena paper BTCUSDT")
        print("   5. Deploy with Docker: docker compose up -d")

    except Exception as e:
        print(f"❌ Demo failed: {e}")
        print("Please ensure all dependencies are installed and try again.")
        return 1

    return 0


if __name__ == "__main__":
    import sys

    sys.exit(main())
