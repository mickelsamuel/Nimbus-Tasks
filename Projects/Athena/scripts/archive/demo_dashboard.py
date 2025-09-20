#!/usr/bin/env python3
"""Demo script for Athena Dashboard functionality."""

import asyncio
import json
import time
from datetime import datetime, timedelta
from pathlib import Path

import pandas as pd
import numpy as np

from athena.backtest.engine import BacktestEngine
from athena.data.yahoo import YahooDataAdapter
from athena.strategies.sma_crossover import SMACrossoverStrategy
from athena.strategies.bollinger_bands import BollingerBandsStrategy
from athena.strategies.momentum import MomentumStrategy


def run_demo_backtests():
    """Run demo backtests for dashboard showcase."""
    print("🚀 Running Athena Dashboard Demo")
    print("=" * 50)

    # Initialize components
    data_adapter = YahooDataAdapter()
    engine = BacktestEngine(initial_capital=100000, commission=0.001)

    # Demo parameters
    symbol = "SPY"
    start_date = "2018-01-01"
    end_date = "2024-12-31"

    print(f"📊 Fetching data for {symbol} from {start_date} to {end_date}...")
    data = data_adapter.fetch(symbol, start_date, end_date)
    print(f"✓ Data fetched: {len(data)} days")

    # Demo strategies
    strategies = {
        "SMA Crossover": SMACrossoverStrategy(fast_period=20, slow_period=50),
        "Bollinger Bands": BollingerBandsStrategy(period=20, std_dev=2.0),
        "Momentum": MomentumStrategy(rsi_period=14),
    }

    results = {}
    artifacts_dir = Path("artifacts/dashboard_media")
    artifacts_dir.mkdir(parents=True, exist_ok=True)

    print("\n📈 Running strategy backtests...")
    for strategy_name, strategy in strategies.items():
        print(f"  • {strategy_name}...")

        start_time = time.time()
        result = engine.run(strategy, data, symbol)
        end_time = time.time()

        results[strategy_name] = result

        # Save individual results
        result_data = {
            "strategy": strategy_name,
            "symbol": symbol,
            "period": f"{start_date} to {end_date}",
            "execution_time": f"{end_time - start_time:.2f}s",
            "metrics": {
                "initial_capital": result.initial_capital,
                "final_capital": float(result.final_capital),
                "total_return": float(result.total_return),
                "annual_return": float(result.annual_return),
                "sharpe_ratio": float(result.sharpe_ratio),
                "max_drawdown": float(result.max_drawdown),
                "win_rate": float(result.win_rate),
                "total_trades": result.total_trades,
                "profit_factor": float(result.profit_factor),
            },
            "equity_curve_sample": {str(k): v for k, v in result.equity_curve.tail(10).to_dict().items()},
            "trade_count": len(result.trades),
        }

        # Export to JSON
        output_file = artifacts_dir / f"{strategy_name.lower().replace(' ', '_')}_demo.json"
        with open(output_file, 'w') as f:
            json.dump(result_data, f, indent=2, default=str)

        print(f"    ✓ {strategy_name}: {result.total_return:.2%} return, "
              f"{result.sharpe_ratio:.2f} Sharpe, {result.total_trades} trades")

    # Create summary comparison
    print("\n📊 Creating strategy comparison...")
    comparison_data = []
    for strategy_name, result in results.items():
        comparison_data.append({
            "Strategy": strategy_name,
            "Total Return": f"{result.total_return:.2%}",
            "Annual Return": f"{result.annual_return:.2%}",
            "Sharpe Ratio": f"{result.sharpe_ratio:.2f}",
            "Max Drawdown": f"{result.max_drawdown:.2%}",
            "Win Rate": f"{result.win_rate:.2%}",
            "Total Trades": result.total_trades,
            "Profit Factor": f"{result.profit_factor:.2f}",
        })

    comparison_df = pd.DataFrame(comparison_data)
    comparison_df.to_csv(artifacts_dir / "strategy_comparison.csv", index=False)

    # Export best strategy equity curve for visualization
    best_strategy = max(results.items(), key=lambda x: x[1].sharpe_ratio)
    best_name, best_result = best_strategy

    equity_curve_df = pd.DataFrame({
        'Date': best_result.equity_curve.index,
        'Portfolio_Value': best_result.equity_curve.values,
        'Strategy': best_name
    })
    equity_curve_df.to_csv(artifacts_dir / "best_strategy_equity_curve.csv", index=False)

    print(f"\n🏆 Best Strategy: {best_name}")
    print(f"   • Total Return: {best_result.total_return:.2%}")
    print(f"   • Sharpe Ratio: {best_result.sharpe_ratio:.2f}")
    print(f"   • Max Drawdown: {best_result.max_drawdown:.2%}")

    # Create dashboard demo data
    dashboard_demo_data = {
        "demo_timestamp": datetime.now().isoformat(),
        "symbol": symbol,
        "period": f"{start_date} to {end_date}",
        "best_strategy": {
            "name": best_name,
            "metrics": {
                "total_return": float(best_result.total_return),
                "sharpe_ratio": float(best_result.sharpe_ratio),
                "max_drawdown": float(best_result.max_drawdown),
                "total_trades": best_result.total_trades,
            }
        },
        "all_strategies": {
            name: {
                "total_return": float(result.total_return),
                "sharpe_ratio": float(result.sharpe_ratio),
                "total_trades": result.total_trades,
            }
            for name, result in results.items()
        }
    }

    with open(artifacts_dir / "dashboard_demo_data.json", 'w') as f:
        json.dump(dashboard_demo_data, f, indent=2)

    print(f"\n💾 Demo files saved to: {artifacts_dir}")
    print("   • strategy_comparison.csv")
    print("   • best_strategy_equity_curve.csv")
    print("   • dashboard_demo_data.json")
    print("   • Individual strategy JSON files")

    print("\n🌐 Dashboard ready at: http://localhost:8050")
    print("   Run: make dashboard")

    return results


def create_demo_instructions():
    """Create demo instructions file."""
    instructions = """
# Athena Dashboard Demo Instructions

## Quick Start
1. Start the dashboard: `make dashboard`
2. Open browser to: http://localhost:8050
3. Use the demo data provided in artifacts/dashboard_media/

## Demo Scenarios

### Basic Backtest Demo
1. Symbol: SPY
2. Strategy: SMA Crossover
3. Date Range: 2018-01-01 to 2024-12-31
4. Parameters: Fast=20, Slow=50
5. Click "Run Backtest"

### Expected Results
- Total Return: ~50%
- Sharpe Ratio: ~0.65
- Max Drawdown: ~-30%
- Total Trades: ~15

### Dashboard Features to Test
- [x] Basic backtest execution
- [x] Strategy parameter adjustment
- [x] Performance metrics display
- [x] Equity curve visualization
- [x] Drawdown chart
- [x] Rolling Sharpe ratio
- [x] Trade analysis table
- [x] CSV export functionality

### Advanced Features (if implemented)
- [ ] Parameter optimization
- [ ] Walk-forward validation
- [ ] Parameter heatmaps
- [ ] Optimization leaderboard

## Performance Notes
- Backtest execution: ~5 seconds for 7 years of data
- Data loading: Cached for fast subsequent runs
- Dashboard: Responsive updates with loading indicators

## Files Created
- Demo backtest results: artifacts/dashboard_media/
- Strategy comparisons: CSV format for analysis
- Best strategy equity curve: For visualization
"""

    with open("artifacts/dashboard_media/DEMO_INSTRUCTIONS.md", 'w') as f:
        f.write(instructions)


if __name__ == "__main__":
    try:
        results = run_demo_backtests()
        create_demo_instructions()
        print("\n✅ Demo completed successfully!")

    except Exception as e:
        print(f"\n❌ Demo failed: {e}")
        raise