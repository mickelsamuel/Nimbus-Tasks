"""Main CLI interface for Athena trading platform."""

from datetime import datetime
from pathlib import Path
from typing import Optional

import typer
from rich.console import Console
from rich.table import Table

from athena.backtest.engine import BacktestEngine
from athena.backtest.metrics import format_metrics
from athena.backtest.walk_forward import WalkForwardValidator
from athena.core.logging import get_logger
from athena.data.yahoo import YahooDataAdapter
from athena.live.paper_trader import PaperTradingEngine
from athena.optimize.optimizer import StrategyOptimizer, get_param_space
from athena.strategies.bollinger_bands import BollingerBandsStrategy
from athena.strategies.momentum import MomentumStrategy
from athena.strategies.sma_crossover import SMACrossoverStrategy

logger = get_logger(__name__)
console = Console()

app = typer.Typer(name="athena", help="Athena Trading Platform CLI", add_completion=False)


@app.command()
def backtest(
    symbol: str = typer.Argument(..., help="Stock symbol (e.g., SPY, AAPL)"),
    start: str = typer.Option("2020-01-01", help="Start date (YYYY-MM-DD)"),
    end: str = typer.Option("2023-12-31", help="End date (YYYY-MM-DD)"),
    strategy: str = typer.Option("sma", help="Strategy to use (sma, momentum, mean_reversion)"),
    fast_period: int = typer.Option(20, help="Fast SMA period"),
    slow_period: int = typer.Option(50, help="Slow SMA period"),
    initial_capital: float = typer.Option(100000, help="Initial capital"),
    commission: float = typer.Option(0.001, help="Commission rate"),
    force_refresh: bool = typer.Option(False, help="Force data refresh from Yahoo"),
):
    """Run a backtest for a given symbol and strategy."""
    console.print(f"[bold blue]🚀 Starting backtest for {symbol}[/bold blue]")

    try:
        # Initialize data adapter
        data_adapter = YahooDataAdapter()

        # Fetch data
        console.print(f"[yellow]📊 Fetching data from {start} to {end}...[/yellow]")
        data = data_adapter.fetch(symbol=symbol, start=start, end=end, force_refresh=force_refresh)
        console.print(f"[green]✓ Data fetched: {len(data)} days[/green]")

        # Initialize strategy
        if strategy.lower() in ["sma", "sma_crossover"]:
            strat = SMACrossoverStrategy(fast_period=fast_period, slow_period=slow_period)
        elif strategy.lower() == "bollinger":
            strat = BollingerBandsStrategy()
        elif strategy.lower() == "momentum":
            strat = MomentumStrategy()
        else:
            console.print(
                f"[red]Strategy '{strategy}' not implemented. Available: sma, bollinger, momentum[/red]"
            )
            raise typer.Exit(1)

        console.print(f"[yellow]📈 Running {strat.name} strategy...[/yellow]")

        # Initialize backtest engine
        engine = BacktestEngine(initial_capital=initial_capital, commission=commission)

        # Run backtest
        result = engine.run(strat, data, symbol)

        # Display results
        console.print("[green]✓ Backtest complete![/green]\n")
        console.print(format_metrics(result))

        # Save results to file
        output_dir = Path("backtest_results")
        output_dir.mkdir(exist_ok=True)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = output_dir / f"{symbol}_{strategy}_{timestamp}.txt"

        with open(output_file, "w") as f:
            f.write(format_metrics(result))

        console.print(f"[green]💾 Results saved to: {output_file}[/green]")

    except Exception as e:
        console.print(f"[red]❌ Error: {str(e)}[/red]")
        logger.error(f"Backtest failed: {e}", exc_info=True)
        raise typer.Exit(1)


@app.command()
def ingest(
    symbol: str = typer.Argument(..., help="Stock symbol(s), comma-separated"),
    start: str = typer.Option("2020-01-01", help="Start date"),
    end: str = typer.Option("2023-12-31", help="End date"),
    interval: str = typer.Option("1d", help="Data interval (1d, 1h, 5m)"),
    force_refresh: bool = typer.Option(False, help="Force refresh from Yahoo"),
):
    """Download and cache historical data."""
    console.print(f"[bold blue]📥 Ingesting data for {symbol}[/bold blue]")

    try:
        # Initialize data adapter
        data_adapter = YahooDataAdapter()

        # Parse symbols
        symbols = [s.strip().upper() for s in symbol.split(",")]

        # Create table for results
        table = Table(title="Data Ingestion Results")
        table.add_column("Symbol", style="cyan")
        table.add_column("Status", style="green")
        table.add_column("Days", justify="right")
        table.add_column("Cached", style="yellow")

        for sym in symbols:
            try:
                console.print(f"[yellow]Fetching {sym}...[/yellow]")
                data = data_adapter.fetch(
                    symbol=sym, start=start, end=end, interval=interval, force_refresh=force_refresh
                )
                table.add_row(
                    sym, "✓ Success", str(len(data)), "Yes" if not force_refresh else "Refreshed"
                )
            except Exception as e:
                table.add_row(sym, f"✗ Failed: {str(e)[:30]}", "-", "-")
                logger.error(f"Failed to ingest {sym}: {e}")

        console.print(table)

        # Show cache info
        cache_info = data_adapter.get_cache_info()
        console.print("\n[cyan]Cache Info:[/cyan]")
        console.print(f"  Location: {cache_info['cache_dir']}")
        console.print(f"  Files: {cache_info['num_files']}")
        console.print(f"  Size: {cache_info['total_size_mb']:.2f} MB")

    except Exception as e:
        console.print(f"[red]❌ Error: {str(e)}[/red]")
        raise typer.Exit(1)


@app.command()
def optimize(
    symbol: str = typer.Argument(..., help="Stock symbol"),
    start: str = typer.Option("2020-01-01", help="Start date"),
    end: str = typer.Option("2023-12-31", help="End date"),
    trials: int = typer.Option(50, help="Number of optimization trials"),
    strategy: str = typer.Option("sma", help="Strategy to optimize"),
):
    """Optimize strategy parameters using Bayesian optimization."""
    console.print(f"[bold blue]🔧 Optimizing {strategy} strategy for {symbol}[/bold blue]")

    try:
        # Initialize data adapter
        data_adapter = YahooDataAdapter()

        # Fetch data
        console.print(f"[yellow]📊 Fetching data from {start} to {end}...[/yellow]")
        data = data_adapter.fetch(symbol=symbol, start=start, end=end)
        console.print(f"[green]✓ Data fetched: {len(data)} days[/green]")

        # Get strategy class and parameter space
        strategy_classes = {
            "sma": SMACrossoverStrategy,
            "bollinger": BollingerBandsStrategy,
            "momentum": MomentumStrategy,
        }

        if strategy.lower() not in strategy_classes:
            console.print(f"[red]Strategy '{strategy}' not supported for optimization[/red]")
            raise typer.Exit(1)

        strategy_class = strategy_classes[strategy.lower()]
        param_space = get_param_space(strategy.lower())

        # Initialize optimizer
        optimizer = StrategyOptimizer()

        console.print(f"[yellow]🔍 Running {trials} optimization trials...[/yellow]")

        # Run optimization
        results = optimizer.optimize(
            strategy_class=strategy_class,
            data=data,
            symbol=symbol,
            param_space=param_space,
            n_trials=trials,
        )

        # Display results
        console.print("[green]✓ Optimization complete![/green]\n")
        console.print("[bold]Best Parameters:[/bold]")
        for param, value in results["best_params"].items():
            console.print(f"  {param}: {value}")

        console.print("\n[bold]Performance Metrics:[/bold]")
        console.print(f"  Objective Value: {results['best_objective']:.4f}")
        console.print(f"  Return: {results['best_return']:.2%}")
        console.print(f"  Max Drawdown: {results['best_max_dd']:.2%}")
        console.print(f"  Win Rate: {results['best_win_rate']:.2%}")
        console.print(f"  Total Trades: {results['best_trades']}")

        # Save results
        output_path = optimizer.save_results(results)
        console.print(f"\n[green]💾 Results saved to: {output_path}[/green]")

    except Exception as e:
        console.print(f"[red]❌ Error: {str(e)}[/red]")
        logger.error(f"Optimization failed: {e}", exc_info=True)
        raise typer.Exit(1)


@app.command()
def wfv(
    symbol: str = typer.Argument(..., help="Stock symbol"),
    start: str = typer.Option("2020-01-01", help="Start date"),
    end: str = typer.Option("2023-12-31", help="End date"),
    train: int = typer.Option(365, help="Training period in days"),
    test: int = typer.Option(90, help="Testing period in days"),
    strategy: str = typer.Option("sma", help="Strategy to validate"),
):
    """Run walk-forward validation."""
    console.print(f"[bold blue]🔄 Walk-forward validation for {strategy} on {symbol}[/bold blue]")

    try:
        # Initialize data adapter
        data_adapter = YahooDataAdapter()

        # Fetch data
        console.print(f"[yellow]📊 Fetching data from {start} to {end}...[/yellow]")
        data = data_adapter.fetch(symbol=symbol, start=start, end=end)
        console.print(f"[green]✓ Data fetched: {len(data)} days[/green]")

        # Initialize strategy
        if strategy.lower() in ["sma", "sma_crossover"]:
            strat = SMACrossoverStrategy()
        elif strategy.lower() == "bollinger":
            strat = BollingerBandsStrategy()
        elif strategy.lower() == "momentum":
            strat = MomentumStrategy()
        else:
            console.print(f"[red]Strategy '{strategy}' not supported[/red]")
            raise typer.Exit(1)

        # Initialize walk-forward validator
        validator = WalkForwardValidator(train_period_days=train, test_period_days=test)

        console.print("[yellow]🔄 Running walk-forward validation...[/yellow]")
        console.print(f"  Train: {train} days, Test: {test} days")

        # Run validation
        result = validator.run(strategy=strat, data=data, symbol=symbol)

        # Display results
        console.print("[green]✓ Walk-forward validation complete![/green]\n")
        console.print("[bold]Summary Results:[/bold]")
        console.print(f"  Average Sharpe: {result.avg_sharpe:.2f}")
        console.print(f"  Average Return: {result.avg_return:.2%}")
        console.print(f"  Average Max DD: {result.avg_max_dd:.2%}")
        console.print(f"  Average Win Rate: {result.avg_win_rate:.2%}")
        console.print(f"  Total Trades: {result.total_trades}")
        console.print(f"  Windows: {len(result.windows)}")

        # Export results
        from pathlib import Path

        output_dir = Path("wfv_results")
        exported_files = validator.export_results(result, output_dir)

        console.print("\n[green]📁 Results exported:[/green]")
        for file_type, path in exported_files.items():
            console.print(f"  {file_type}: {path}")

    except Exception as e:
        console.print(f"[red]❌ Error: {str(e)}[/red]")
        logger.error(f"Walk-forward validation failed: {e}", exc_info=True)
        raise typer.Exit(1)


@app.command()
def paper(
    symbol: str = typer.Argument(..., help="Trading pair (e.g., BTCUSDT)"),
    strategy: str = typer.Option("sma", help="Strategy to use"),
    capital: float = typer.Option(10000, help="Starting capital"),
    interval: str = typer.Option("1m", help="Trading interval"),
    testnet: bool = typer.Option(True, help="Use Binance testnet"),
):
    """Start paper trading."""
    console.print(f"[bold blue]📝 Starting paper trading for {symbol}[/bold blue]")

    try:
        # Initialize strategy
        if strategy.lower() in ["sma", "sma_crossover"]:
            strat = SMACrossoverStrategy(
                fast_period=10, slow_period=20
            )  # Shorter periods for live trading
        elif strategy.lower() == "bollinger":
            strat = BollingerBandsStrategy()
        elif strategy.lower() == "momentum":
            strat = MomentumStrategy()
        else:
            console.print(f"[red]Strategy '{strategy}' not supported[/red]")
            raise typer.Exit(1)

        # Create paper trading engine
        trader = PaperTradingEngine.create_with_auto_broker(
            strategy=strat, symbol=symbol, initial_capital=capital, use_testnet=testnet
        )

        # Add callbacks for logging
        def on_trade(side: str, quantity: float, price: float, timestamp):
            console.print(f"[green]💹 {side}: {quantity:.6f} {symbol} @ ${price:.2f}[/green]")

        def on_signal(signal: int, price: float, timestamp):
            signal_text = "BUY" if signal == 1 else "SELL" if signal == -1 else "HOLD"
            console.print(f"[yellow]📊 Signal: {signal_text} @ ${price:.2f}[/yellow]")

        trader.add_trade_callback(on_trade)
        trader.add_signal_callback(on_signal)

        console.print("[green]✓ Paper trading started[/green]")
        console.print(f"  Strategy: {strat.name}")
        console.print(f"  Capital: ${capital:,.2f}")
        console.print(f"  Testnet: {testnet}")
        console.print("[yellow]Press Ctrl+C to stop[/yellow]\n")

        # Start trading
        trader.start(interval_seconds=60)  # 1-minute intervals

        # Show final performance
        performance = trader.get_performance_summary()
        console.print("\n[bold]Final Performance:[/bold]")
        for key, value in performance.items():
            console.print(f"  {key}: {value}")

    except Exception as e:
        console.print(f"[red]❌ Error: {str(e)}[/red]")
        logger.error(f"Paper trading failed: {e}", exc_info=True)
        raise typer.Exit(1)


@app.command()
def dashboard(
    port: int = typer.Option(8050, help="Dashboard port"),
    host: str = typer.Option("0.0.0.0", help="Dashboard host"),
    debug: bool = typer.Option(False, help="Debug mode"),
):
    """Launch the web dashboard."""
    console.print(f"[bold blue]🌐 Launching dashboard at http://{host}:{port}[/bold blue]")
    console.print("[yellow]Dashboard coming soon with Dash/Plotly integration![/yellow]")
    # Placeholder for dashboard integration


@app.command()
def cache(
    action: str = typer.Argument(..., help="Action: info, clear, or clear-symbol"),
    symbol: Optional[str] = typer.Option(None, help="Symbol to clear (for clear-symbol)"),
):
    """Manage data cache."""
    data_adapter = YahooDataAdapter()

    if action == "info":
        cache_info = data_adapter.get_cache_info()
        console.print("[bold]Cache Information:[/bold]")
        console.print(f"  📁 Directory: {cache_info['cache_dir']}")
        console.print(f"  📊 Files: {cache_info['num_files']}")
        console.print(f"  💾 Size: {cache_info['total_size_mb']:.2f} MB")
        console.print(f"  🏷️  Symbols: {', '.join(cache_info['symbols'])}")

    elif action == "clear":
        data_adapter.clear_cache()
        console.print("[green]✓ Cache cleared successfully[/green]")

    elif action == "clear-symbol" and symbol:
        data_adapter.clear_cache(symbol=symbol)
        console.print(f"[green]✓ Cache cleared for {symbol}[/green]")

    else:
        console.print("[red]Invalid action. Use: info, clear, or clear-symbol[/red]")
        raise typer.Exit(1)


@app.command()
def version():
    """Show version information."""
    console.print("[bold]Athena Trading Platform[/bold]")
    console.print("Version: 0.1.0")
    console.print("Python: 3.11+")
    console.print("Author: Staff-level Quant/SWE")


def main():
    """Main entry point for the CLI."""
    app()


if __name__ == "__main__":
    main()
