"""Paper trading engine with broker abstraction."""

import asyncio
from datetime import datetime
from typing import Callable, Dict, List

import pandas as pd

from athena.core.logging import get_logger
from athena.core.types import Order, OrderSide, OrderType
from athena.live.binance_testnet import BinanceTestnetBroker
from athena.live.broker import BaseBroker, SimulatedBroker
from athena.strategies.base import BaseStrategy

logger = get_logger(__name__)


class PaperTradingEngine:
    """Paper trading engine with strategy execution."""

    def __init__(
        self,
        broker: BaseBroker,
        strategy: BaseStrategy,
        symbol: str,
        initial_capital: float = 10000,
        position_size_pct: float = 0.1,
        use_testnet: bool = True,
    ):
        """Initialize paper trading engine.

        Args:
            broker: Broker instance
            strategy: Trading strategy
            symbol: Symbol to trade
            initial_capital: Initial capital
            position_size_pct: Position size as percentage of capital
            use_testnet: Whether to use testnet
        """
        self.broker = broker
        self.strategy = strategy
        self.symbol = symbol
        self.initial_capital = initial_capital
        self.position_size_pct = position_size_pct
        self.use_testnet = use_testnet

        # State
        self.running = False
        self.current_position = 0  # 0: flat, 1: long, -1: short
        self.last_signal = 0
        self.price_history: List[Dict] = []
        self.performance_log: List[Dict] = []

        # Callbacks
        self.on_trade_callbacks: List[Callable] = []
        self.on_signal_callbacks: List[Callable] = []

    @classmethod
    def create_with_auto_broker(
        cls,
        strategy: BaseStrategy,
        symbol: str,
        initial_capital: float = 10000,
        use_testnet: bool = True,
    ) -> "PaperTradingEngine":
        """Create paper trading engine with automatic broker selection.

        Args:
            strategy: Trading strategy
            symbol: Symbol to trade
            initial_capital: Initial capital
            use_testnet: Whether to prefer testnet

        Returns:
            Configured paper trading engine
        """
        # Try Binance testnet first if requested
        if use_testnet:
            binance_broker = BinanceTestnetBroker()
            if binance_broker.has_credentials and binance_broker.connect():
                logger.info("Using Binance testnet broker")
                return cls(binance_broker, strategy, symbol, initial_capital, use_testnet=True)
            else:
                logger.info("Binance testnet not available, falling back to simulator")

        # Fall back to simulator
        sim_broker = SimulatedBroker(initial_capital=initial_capital)
        sim_broker.connect()
        logger.info("Using simulated broker")

        return cls(sim_broker, strategy, symbol, initial_capital, use_testnet=False)

    def start(self, interval_seconds: int = 60) -> None:
        """Start paper trading.

        Args:
            interval_seconds: Interval between strategy evaluations
        """
        if self.running:
            logger.warning("Paper trading already running")
            return

        if not self.broker.connect():
            raise RuntimeError("Failed to connect to broker")

        self.running = True
        logger.info(f"Starting paper trading for {self.symbol} with {self.strategy.name}")

        try:
            asyncio.run(self._trading_loop(interval_seconds))
        except KeyboardInterrupt:
            logger.info("Paper trading stopped by user")
        except Exception as e:
            logger.error(f"Paper trading error: {e}")
        finally:
            self.stop()

    def stop(self) -> None:
        """Stop paper trading."""
        self.running = False
        self.broker.disconnect()
        logger.info("Paper trading stopped")

    async def _trading_loop(self, interval_seconds: int) -> None:
        """Main trading loop.

        Args:
            interval_seconds: Loop interval
        """
        while self.running:
            try:
                await self._evaluate_strategy()
                await asyncio.sleep(interval_seconds)
            except Exception as e:
                logger.error(f"Trading loop error: {e}")
                await asyncio.sleep(5)  # Brief pause before retry

    async def _evaluate_strategy(self) -> None:
        """Evaluate strategy and execute trades."""
        try:
            # Get current price
            current_price = await self._get_current_price()
            current_time = datetime.now()

            # Update price history
            self.price_history.append(
                {"timestamp": current_time, "price": current_price, "symbol": self.symbol}
            )

            # Keep only recent history for strategy evaluation
            if len(self.price_history) > 200:
                self.price_history = self.price_history[-200:]

            # Convert to DataFrame for strategy
            if len(self.price_history) < 50:  # Need minimum data
                logger.debug("Insufficient price history for strategy evaluation")
                return

            df = self._create_ohlcv_from_prices()

            # Generate signals
            signals = self.strategy.generate_signals(df)

            if len(signals) == 0:
                return

            current_signal = signals.iloc[-1]

            # Check if signal changed
            if current_signal != self.last_signal and current_signal != 0:
                await self._execute_signal(current_signal, current_price)
                self.last_signal = current_signal

                # Call signal callbacks
                for callback in self.on_signal_callbacks:
                    try:
                        callback(current_signal, current_price, current_time)
                    except Exception as e:
                        logger.error(f"Signal callback error: {e}")

            # Log performance
            portfolio = self.broker.get_portfolio()
            self.performance_log.append(
                {
                    "timestamp": current_time,
                    "portfolio_value": portfolio.total_value,
                    "cash": portfolio.cash,
                    "unrealized_pnl": portfolio.unrealized_pnl,
                    "num_positions": len(portfolio.positions),
                }
            )

        except Exception as e:
            logger.error(f"Strategy evaluation error: {e}")

    async def _get_current_price(self) -> float:
        """Get current price for the symbol.

        Returns:
            Current price
        """
        if isinstance(self.broker, BinanceTestnetBroker):
            return self.broker.get_current_price(self.symbol)
        elif isinstance(self.broker, SimulatedBroker):
            # For simulation, use mock price or generate random walk
            if self.symbol not in self.broker.mock_prices:
                base_price = 100.0
                if self.price_history:
                    base_price = self.price_history[-1]["price"]

                # Simple random walk
                import random

                change = random.uniform(-0.02, 0.02)  # +/- 2%
                new_price = base_price * (1 + change)
                self.broker.set_mock_price(self.symbol, new_price)

            return self.broker.get_current_price(self.symbol)
        else:
            raise NotImplementedError("Unsupported broker type")

    def _create_ohlcv_from_prices(self) -> pd.DataFrame:
        """Create OHLCV DataFrame from price history.

        Returns:
            OHLCV DataFrame
        """
        # Convert price ticks to OHLCV bars (simplified)
        df = pd.DataFrame(self.price_history)
        df["timestamp"] = pd.to_datetime(df["timestamp"])
        df.set_index("timestamp", inplace=True)

        # Resample to 1-minute bars
        ohlcv = df.resample("1T").agg({"price": ["first", "max", "min", "last", "count"]}).dropna()

        ohlcv.columns = ["open", "high", "low", "close", "volume"]

        # Forward fill missing values
        ohlcv = ohlcv.fillna(method="ffill")

        return ohlcv

    async def _execute_signal(self, signal: int, current_price: float) -> None:
        """Execute trading signal.

        Args:
            signal: Trading signal (1 for buy, -1 for sell)
            current_price: Current price
        """
        try:
            portfolio = self.broker.get_portfolio()

            # Calculate position size
            position_value = portfolio.total_value * self.position_size_pct
            quantity = position_value / current_price

            if signal == 1:  # Buy signal
                if self.current_position <= 0:  # Not long
                    order = Order(
                        symbol=self.symbol,
                        side=OrderSide.BUY,
                        quantity=quantity,
                        order_type=OrderType.MARKET,
                    )

                    self.broker.place_order(order)
                    self.current_position = 1

                    logger.info(
                        f"Executed BUY: {quantity:.6f} {self.symbol} @ ${current_price:.2f}"
                    )

                    # Call trade callbacks
                    for callback in self.on_trade_callbacks:
                        try:
                            callback("BUY", quantity, current_price, datetime.now())
                        except Exception as e:
                            logger.error(f"Trade callback error: {e}")

            elif signal == -1:  # Sell signal
                if self.current_position >= 0:  # Not short
                    order = Order(
                        symbol=self.symbol,
                        side=OrderSide.SELL,
                        quantity=quantity,
                        order_type=OrderType.MARKET,
                    )

                    self.broker.place_order(order)
                    self.current_position = -1

                    logger.info(
                        f"Executed SELL: {quantity:.6f} {self.symbol} @ ${current_price:.2f}"
                    )

                    # Call trade callbacks
                    for callback in self.on_trade_callbacks:
                        try:
                            callback("SELL", quantity, current_price, datetime.now())
                        except Exception as e:
                            logger.error(f"Trade callback error: {e}")

        except Exception as e:
            logger.error(f"Failed to execute signal: {e}")

    def add_trade_callback(self, callback: Callable) -> None:
        """Add trade execution callback.

        Args:
            callback: Function to call on trade execution
        """
        self.on_trade_callbacks.append(callback)

    def add_signal_callback(self, callback: Callable) -> None:
        """Add signal generation callback.

        Args:
            callback: Function to call on signal generation
        """
        self.on_signal_callbacks.append(callback)

    def get_performance_summary(self) -> Dict:
        """Get performance summary.

        Returns:
            Dictionary with performance metrics
        """
        if not self.performance_log:
            return {"error": "No performance data available"}

        # Calculate metrics
        initial_value = self.performance_log[0]["portfolio_value"]
        current_value = self.performance_log[-1]["portfolio_value"]
        total_return = (current_value / initial_value - 1) * 100

        # Get all trades
        trades = self.broker.get_trades(self.symbol)

        return {
            "initial_capital": initial_value,
            "current_value": current_value,
            "total_return_pct": total_return,
            "unrealized_pnl": self.performance_log[-1]["unrealized_pnl"],
            "total_trades": len(trades),
            "current_position": self.current_position,
            "runtime_minutes": len(self.performance_log),
            "strategy": self.strategy.name,
        }
