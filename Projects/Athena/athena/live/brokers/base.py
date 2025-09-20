"""Base broker interface for unified trading operations."""

import asyncio
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional, Any, Callable
import time

from athena.core.types import Order, Position, Trade, OrderSide, OrderStatus
from athena.core.logging import get_logger

logger = get_logger(__name__)


class ConnectionState(Enum):
    """Broker connection states."""
    DISCONNECTED = "disconnected"
    CONNECTING = "connecting"
    CONNECTED = "connected"
    ERROR = "error"
    SUSPENDED = "suspended"  # Temporarily halted by safety guards


@dataclass
class BrokerConfig:
    """Configuration for broker connections."""
    api_key: str = ""
    api_secret: str = ""
    base_url: Optional[str] = None
    paper_trading: bool = True
    timeout: int = 30
    max_retries: int = 3
    retry_delay: float = 1.0
    rate_limit: Optional[int] = None  # Requests per minute
    enable_telemetry: bool = True
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class MarketData:
    """Market data snapshot."""
    symbol: str
    timestamp: datetime
    bid: float
    ask: float
    last: float
    volume: float
    bid_size: Optional[float] = None
    ask_size: Optional[float] = None

    @property
    def spread(self) -> float:
        """Calculate bid-ask spread."""
        return self.ask - self.bid

    @property
    def spread_pct(self) -> float:
        """Calculate spread as percentage of mid price."""
        mid = (self.bid + self.ask) / 2
        return (self.spread / mid * 100) if mid > 0 else 0


@dataclass
class AccountInfo:
    """Account information."""
    account_id: str
    currency: str
    balance: float
    available_balance: float
    margin_used: float = 0
    unrealized_pnl: float = 0
    realized_pnl: float = 0
    positions_value: float = 0
    timestamp: datetime = field(default_factory=datetime.now)


@dataclass
class BrokerMetrics:
    """Broker performance metrics."""
    total_orders: int = 0
    successful_orders: int = 0
    failed_orders: int = 0
    total_trades: int = 0
    connection_attempts: int = 0
    reconnect_count: int = 0
    dropped_ticks: int = 0
    average_latency_ms: float = 0
    max_latency_ms: float = 0
    last_heartbeat: Optional[datetime] = None
    uptime_seconds: float = 0


class BaseBroker(ABC):
    """Abstract base class for all broker implementations."""

    def __init__(self, config: BrokerConfig):
        """Initialize broker with configuration."""
        self.config = config
        self.state = ConnectionState.DISCONNECTED
        self.metrics = BrokerMetrics()
        self._start_time = None
        self._callbacks: Dict[str, List[Callable]] = {}
        self._rate_limiter = None
        self._last_request_time = 0

        # Telemetry tracking
        self._latency_samples: List[float] = []
        self._max_latency_samples = 1000

    # Connection Management

    @abstractmethod
    async def connect(self) -> bool:
        """Establish connection to broker."""
        pass

    @abstractmethod
    async def disconnect(self) -> None:
        """Disconnect from broker."""
        pass

    @abstractmethod
    async def is_connected(self) -> bool:
        """Check if broker is connected."""
        pass

    async def reconnect(self) -> bool:
        """Reconnect to broker with retry logic."""
        self.metrics.reconnect_count += 1

        for attempt in range(self.config.max_retries):
            logger.info(f"Reconnection attempt {attempt + 1}/{self.config.max_retries}")

            try:
                await self.disconnect()
                await asyncio.sleep(self.config.retry_delay * (2 ** attempt))

                if await self.connect():
                    logger.info("Reconnection successful")
                    return True

            except Exception as e:
                logger.error(f"Reconnection failed: {e}")

        self.state = ConnectionState.ERROR
        return False

    # Account Management

    @abstractmethod
    async def get_account(self) -> AccountInfo:
        """Get account information."""
        pass

    @abstractmethod
    async def get_positions(self) -> List[Position]:
        """Get current positions."""
        pass

    @abstractmethod
    async def get_position(self, symbol: str) -> Optional[Position]:
        """Get position for specific symbol."""
        pass

    # Order Management

    @abstractmethod
    async def place_order(self, order: Order) -> Order:
        """Place an order."""
        pass

    @abstractmethod
    async def cancel_order(self, order_id: str) -> bool:
        """Cancel an order."""
        pass

    @abstractmethod
    async def get_order(self, order_id: str) -> Optional[Order]:
        """Get order by ID."""
        pass

    @abstractmethod
    async def get_orders(self, symbol: Optional[str] = None,
                        status: Optional[OrderStatus] = None) -> List[Order]:
        """Get orders with optional filters."""
        pass

    async def place_market_order(self, symbol: str, side: OrderSide,
                                 quantity: float) -> Order:
        """Place a market order."""
        order = Order(
            symbol=symbol,
            side=side,
            quantity=quantity,
            order_type="market",
            timestamp=datetime.now()
        )
        return await self.place_order(order)

    async def place_limit_order(self, symbol: str, side: OrderSide,
                                quantity: float, price: float) -> Order:
        """Place a limit order."""
        order = Order(
            symbol=symbol,
            side=side,
            quantity=quantity,
            price=price,
            order_type="limit",
            timestamp=datetime.now()
        )
        return await self.place_order(order)

    # Market Data

    @abstractmethod
    async def get_market_data(self, symbol: str) -> MarketData:
        """Get current market data for symbol."""
        pass

    @abstractmethod
    async def subscribe_market_data(self, symbols: List[str],
                                   callback: Callable[[MarketData], None]) -> None:
        """Subscribe to real-time market data."""
        pass

    @abstractmethod
    async def unsubscribe_market_data(self, symbols: List[str]) -> None:
        """Unsubscribe from market data."""
        pass

    # Trade History

    @abstractmethod
    async def get_trades(self, symbol: Optional[str] = None,
                        start_date: Optional[datetime] = None,
                        end_date: Optional[datetime] = None) -> List[Trade]:
        """Get trade history."""
        pass

    # Telemetry and Monitoring

    def record_latency(self, latency_ms: float) -> None:
        """Record operation latency."""
        self._latency_samples.append(latency_ms)

        # Keep only recent samples
        if len(self._latency_samples) > self._max_latency_samples:
            self._latency_samples = self._latency_samples[-self._max_latency_samples:]

        # Update metrics
        self.metrics.average_latency_ms = sum(self._latency_samples) / len(self._latency_samples)
        self.metrics.max_latency_ms = max(self._latency_samples)

    def record_tick_drop(self) -> None:
        """Record a dropped tick."""
        self.metrics.dropped_ticks += 1

    def update_heartbeat(self) -> None:
        """Update last heartbeat timestamp."""
        self.metrics.last_heartbeat = datetime.now()

    def get_uptime(self) -> float:
        """Get uptime in seconds."""
        if self._start_time:
            return (datetime.now() - self._start_time).total_seconds()
        return 0

    # Rate Limiting

    async def _check_rate_limit(self) -> None:
        """Check and enforce rate limiting."""
        if not self.config.rate_limit:
            return

        now = time.time()
        time_since_last = now - self._last_request_time
        min_interval = 60.0 / self.config.rate_limit

        if time_since_last < min_interval:
            await asyncio.sleep(min_interval - time_since_last)

        self._last_request_time = time.time()

    # Callback Management

    def register_callback(self, event: str, callback: Callable) -> None:
        """Register event callback."""
        if event not in self._callbacks:
            self._callbacks[event] = []
        self._callbacks[event].append(callback)

    def trigger_callback(self, event: str, *args, **kwargs) -> None:
        """Trigger event callbacks."""
        if event in self._callbacks:
            for callback in self._callbacks[event]:
                try:
                    callback(*args, **kwargs)
                except Exception as e:
                    logger.error(f"Callback error for {event}: {e}")

    # Utility Methods

    async def health_check(self) -> Dict[str, Any]:
        """Perform health check."""
        return {
            "broker": self.__class__.__name__,
            "state": self.state.value,
            "connected": await self.is_connected(),
            "uptime": self.get_uptime(),
            "metrics": {
                "total_orders": self.metrics.total_orders,
                "successful_orders": self.metrics.successful_orders,
                "failed_orders": self.metrics.failed_orders,
                "reconnect_count": self.metrics.reconnect_count,
                "dropped_ticks": self.metrics.dropped_ticks,
                "avg_latency_ms": round(self.metrics.average_latency_ms, 2),
                "max_latency_ms": round(self.metrics.max_latency_ms, 2),
            }
        }

    def __str__(self) -> str:
        """String representation."""
        return f"{self.__class__.__name__}(state={self.state.value}, paper={self.config.paper_trading})"

    def __repr__(self) -> str:
        """Detailed representation."""
        return (f"{self.__class__.__name__}("
                f"state={self.state.value}, "
                f"paper={self.config.paper_trading}, "
                f"uptime={self.get_uptime():.1f}s)")