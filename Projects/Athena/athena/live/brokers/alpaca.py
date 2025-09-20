"""Alpaca broker implementation for paper and live trading."""

import asyncio
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Callable
import aiohttp
from decimal import Decimal

from athena.core.types import Order, Position, Trade, OrderSide, OrderStatus, OrderType
from athena.core.logging import get_logger
from athena.live.brokers.base import (
    BaseBroker, BrokerConfig, MarketData, AccountInfo, ConnectionState
)

logger = get_logger(__name__)


class AlpacaBroker(BaseBroker):
    """Alpaca broker implementation."""

    def __init__(self, config: BrokerConfig):
        """Initialize Alpaca broker."""
        super().__init__(config)

        # Set Alpaca-specific URLs
        if config.paper_trading:
            self.base_url = config.base_url or "https://paper-api.alpaca.markets"
            self.data_url = "https://data.alpaca.markets"
        else:
            self.base_url = config.base_url or "https://api.alpaca.markets"
            self.data_url = "https://data.alpaca.markets"

        self.ws_url = self.base_url.replace("https", "wss") + "/stream"

        # HTTP session
        self.session: Optional[aiohttp.ClientSession] = None
        self.ws_connection = None
        self._market_data_callbacks: Dict[str, List[Callable]] = {}

    async def connect(self) -> bool:
        """Connect to Alpaca."""
        try:
            self.state = ConnectionState.CONNECTING
            self.metrics.connection_attempts += 1

            # Create HTTP session
            self.session = aiohttp.ClientSession(
                headers={
                    "APCA-API-KEY-ID": self.config.api_key,
                    "APCA-API-SECRET-KEY": self.config.api_secret,
                }
            )

            # Test connection with account request
            account = await self.get_account()
            if account:
                self.state = ConnectionState.CONNECTED
                self._start_time = datetime.now()
                logger.info(f"Connected to Alpaca ({'paper' if self.config.paper_trading else 'live'})")
                return True

        except Exception as e:
            logger.error(f"Failed to connect to Alpaca: {e}")
            self.state = ConnectionState.ERROR

        return False

    async def disconnect(self) -> None:
        """Disconnect from Alpaca."""
        try:
            if self.ws_connection:
                await self.ws_connection.close()
                self.ws_connection = None

            if self.session:
                await self.session.close()
                self.session = None

            self.state = ConnectionState.DISCONNECTED
            logger.info("Disconnected from Alpaca")

        except Exception as e:
            logger.error(f"Error during disconnect: {e}")

    async def is_connected(self) -> bool:
        """Check connection status."""
        return self.state == ConnectionState.CONNECTED and self.session is not None

    async def get_account(self) -> AccountInfo:
        """Get account information."""
        try:
            async with self.session.get(f"{self.base_url}/v2/account") as response:
                if response.status == 200:
                    data = await response.json()
                    return AccountInfo(
                        account_id=data["account_number"],
                        currency="USD",
                        balance=float(data["equity"]),
                        available_balance=float(data["cash"]),
                        margin_used=float(data.get("initial_margin", 0)),
                        unrealized_pnl=float(data.get("unrealized_pl", 0)),
                        realized_pnl=float(data.get("realized_pl", 0)),
                        positions_value=float(data.get("long_market_value", 0))
                    )
                else:
                    logger.error(f"Failed to get account: {response.status}")

        except Exception as e:
            logger.error(f"Error getting account: {e}")

        return None

    async def get_positions(self) -> List[Position]:
        """Get all positions."""
        positions = []

        try:
            async with self.session.get(f"{self.base_url}/v2/positions") as response:
                if response.status == 200:
                    data = await response.json()
                    for pos_data in data:
                        positions.append(self._parse_position(pos_data))

        except Exception as e:
            logger.error(f"Error getting positions: {e}")

        return positions

    async def get_position(self, symbol: str) -> Optional[Position]:
        """Get position for specific symbol."""
        try:
            async with self.session.get(f"{self.base_url}/v2/positions/{symbol}") as response:
                if response.status == 200:
                    data = await response.json()
                    return self._parse_position(data)
                elif response.status == 404:
                    return None  # No position exists

        except Exception as e:
            logger.error(f"Error getting position for {symbol}: {e}")

        return None

    async def place_order(self, order: Order) -> Order:
        """Place an order."""
        try:
            # Measure latency
            start_time = datetime.now()

            # Prepare order data
            order_data = {
                "symbol": order.symbol,
                "qty": str(order.quantity),
                "side": order.side.value.lower(),
                "type": self._get_order_type(order.order_type),
                "time_in_force": order.time_in_force or "gtc",
            }

            if order.order_type == OrderType.LIMIT and order.price:
                order_data["limit_price"] = str(order.price)

            if order.order_type == OrderType.STOP and order.stop_price:
                order_data["stop_price"] = str(order.stop_price)

            # Send order
            async with self.session.post(
                f"{self.base_url}/v2/orders",
                json=order_data
            ) as response:

                # Record metrics
                latency = (datetime.now() - start_time).total_seconds() * 1000
                self.record_latency(latency)
                self.metrics.total_orders += 1

                if response.status in [200, 201]:
                    data = await response.json()
                    order.order_id = data["id"]
                    order.status = self._parse_order_status(data["status"])
                    order.filled_quantity = float(data.get("filled_qty", 0))
                    order.average_price = float(data.get("filled_avg_price") or 0)

                    self.metrics.successful_orders += 1
                    logger.info(f"Order placed: {order.order_id}")

                    # Trigger callback
                    self.trigger_callback("order_placed", order)

                    return order
                else:
                    error_msg = await response.text()
                    logger.error(f"Order failed: {error_msg}")
                    self.metrics.failed_orders += 1
                    order.status = OrderStatus.REJECTED

        except Exception as e:
            logger.error(f"Error placing order: {e}")
            self.metrics.failed_orders += 1
            order.status = OrderStatus.REJECTED

        return order

    async def cancel_order(self, order_id: str) -> bool:
        """Cancel an order."""
        try:
            async with self.session.delete(f"{self.base_url}/v2/orders/{order_id}") as response:
                if response.status in [200, 204]:
                    logger.info(f"Order cancelled: {order_id}")
                    self.trigger_callback("order_cancelled", order_id)
                    return True
                else:
                    logger.error(f"Failed to cancel order: {response.status}")

        except Exception as e:
            logger.error(f"Error cancelling order {order_id}: {e}")

        return False

    async def get_order(self, order_id: str) -> Optional[Order]:
        """Get order by ID."""
        try:
            async with self.session.get(f"{self.base_url}/v2/orders/{order_id}") as response:
                if response.status == 200:
                    data = await response.json()
                    return self._parse_order(data)

        except Exception as e:
            logger.error(f"Error getting order {order_id}: {e}")

        return None

    async def get_orders(self, symbol: Optional[str] = None,
                        status: Optional[OrderStatus] = None) -> List[Order]:
        """Get orders with filters."""
        orders = []
        params = {}

        if symbol:
            params["symbols"] = symbol
        if status:
            params["status"] = self._get_alpaca_status(status)

        try:
            async with self.session.get(
                f"{self.base_url}/v2/orders",
                params=params
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    for order_data in data:
                        orders.append(self._parse_order(order_data))

        except Exception as e:
            logger.error(f"Error getting orders: {e}")

        return orders

    async def get_market_data(self, symbol: str) -> MarketData:
        """Get current market data."""
        try:
            # Get latest quote
            async with self.session.get(
                f"{self.data_url}/v2/stocks/{symbol}/quotes/latest",
                headers={
                    "APCA-API-KEY-ID": self.config.api_key,
                    "APCA-API-SECRET-KEY": self.config.api_secret,
                }
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    quote = data.get("quote", {})

                    return MarketData(
                        symbol=symbol,
                        timestamp=datetime.fromisoformat(quote.get("t", datetime.now().isoformat())),
                        bid=float(quote.get("bp", 0)),
                        ask=float(quote.get("ap", 0)),
                        last=float(quote.get("p", 0)),
                        volume=float(quote.get("s", 0)),
                        bid_size=float(quote.get("bs", 0)),
                        ask_size=float(quote.get("as", 0))
                    )

        except Exception as e:
            logger.error(f"Error getting market data for {symbol}: {e}")

        return None

    async def subscribe_market_data(self, symbols: List[str],
                                   callback: Callable[[MarketData], None]) -> None:
        """Subscribe to real-time market data."""
        for symbol in symbols:
            if symbol not in self._market_data_callbacks:
                self._market_data_callbacks[symbol] = []
            self._market_data_callbacks[symbol].append(callback)

        # Connect to websocket if not already connected
        if not self.ws_connection:
            await self._connect_websocket()

        # Subscribe to symbols
        if self.ws_connection:
            await self.ws_connection.send_json({
                "action": "subscribe",
                "quotes": symbols
            })

    async def unsubscribe_market_data(self, symbols: List[str]) -> None:
        """Unsubscribe from market data."""
        for symbol in symbols:
            if symbol in self._market_data_callbacks:
                del self._market_data_callbacks[symbol]

        if self.ws_connection:
            await self.ws_connection.send_json({
                "action": "unsubscribe",
                "quotes": symbols
            })

    async def get_trades(self, symbol: Optional[str] = None,
                        start_date: Optional[datetime] = None,
                        end_date: Optional[datetime] = None) -> List[Trade]:
        """Get trade history."""
        trades = []

        # Default to last 30 days
        if not start_date:
            start_date = datetime.now() - timedelta(days=30)
        if not end_date:
            end_date = datetime.now()

        try:
            # Get closed orders (executed trades)
            params = {
                "status": "closed",
                "after": start_date.isoformat(),
                "until": end_date.isoformat()
            }

            if symbol:
                params["symbols"] = symbol

            async with self.session.get(
                f"{self.base_url}/v2/orders",
                params=params
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    for order_data in data:
                        if float(order_data.get("filled_qty", 0)) > 0:
                            trades.append(self._order_to_trade(order_data))

        except Exception as e:
            logger.error(f"Error getting trades: {e}")

        self.metrics.total_trades = len(trades)
        return trades

    # Private helper methods

    def _parse_position(self, data: Dict) -> Position:
        """Parse Alpaca position data."""
        return Position(
            symbol=data["symbol"],
            quantity=float(data["qty"]),
            side=OrderSide.BUY if float(data["qty"]) > 0 else OrderSide.SELL,
            entry_price=float(data["avg_entry_price"]),
            current_price=float(data.get("current_price", 0)),
            unrealized_pnl=float(data.get("unrealized_pl", 0)),
            realized_pnl=float(data.get("realized_pl", 0)),
            market_value=float(data.get("market_value", 0))
        )

    def _parse_order(self, data: Dict) -> Order:
        """Parse Alpaca order data."""
        order = Order(
            symbol=data["symbol"],
            side=OrderSide.BUY if data["side"] == "buy" else OrderSide.SELL,
            quantity=float(data["qty"]),
            order_type=self._parse_order_type(data["type"]),
            timestamp=datetime.fromisoformat(data["created_at"])
        )

        order.order_id = data["id"]
        order.status = self._parse_order_status(data["status"])
        order.filled_quantity = float(data.get("filled_qty", 0))
        order.average_price = float(data.get("filled_avg_price") or 0)

        if data.get("limit_price"):
            order.price = float(data["limit_price"])
        if data.get("stop_price"):
            order.stop_price = float(data["stop_price"])

        return order

    def _order_to_trade(self, order_data: Dict) -> Trade:
        """Convert order data to trade."""
        return Trade(
            symbol=order_data["symbol"],
            side=OrderSide.BUY if order_data["side"] == "buy" else OrderSide.SELL,
            quantity=float(order_data["filled_qty"]),
            price=float(order_data["filled_avg_price"]),
            timestamp=datetime.fromisoformat(order_data["filled_at"]),
            trade_id=order_data["id"],
            order_id=order_data["id"],
            commission=0  # Alpaca doesn't charge commissions
        )

    def _parse_order_type(self, alpaca_type: str) -> OrderType:
        """Parse Alpaca order type."""
        mapping = {
            "market": OrderType.MARKET,
            "limit": OrderType.LIMIT,
            "stop": OrderType.STOP,
            "stop_limit": OrderType.STOP_LIMIT,
        }
        return mapping.get(alpaca_type, OrderType.MARKET)

    def _get_order_type(self, order_type: OrderType) -> str:
        """Convert order type to Alpaca format."""
        mapping = {
            OrderType.MARKET: "market",
            OrderType.LIMIT: "limit",
            OrderType.STOP: "stop",
            OrderType.STOP_LIMIT: "stop_limit",
        }
        return mapping.get(order_type, "market")

    def _parse_order_status(self, alpaca_status: str) -> OrderStatus:
        """Parse Alpaca order status."""
        mapping = {
            "new": OrderStatus.PENDING,
            "accepted": OrderStatus.PENDING,
            "pending_new": OrderStatus.PENDING,
            "partially_filled": OrderStatus.PARTIALLY_FILLED,
            "filled": OrderStatus.FILLED,
            "done_for_day": OrderStatus.CANCELED,
            "canceled": OrderStatus.CANCELED,
            "expired": OrderStatus.EXPIRED,
            "replaced": OrderStatus.CANCELED,
            "rejected": OrderStatus.REJECTED,
            "suspended": OrderStatus.PENDING,
        }
        return mapping.get(alpaca_status, OrderStatus.PENDING)

    def _get_alpaca_status(self, status: OrderStatus) -> str:
        """Convert order status to Alpaca format."""
        mapping = {
            OrderStatus.PENDING: "open",
            OrderStatus.FILLED: "closed",
            OrderStatus.CANCELED: "canceled",
            OrderStatus.REJECTED: "rejected",
        }
        return mapping.get(status, "all")

    async def _connect_websocket(self) -> None:
        """Connect to Alpaca websocket for real-time data."""
        try:
            # This would connect to Alpaca's websocket
            # Implementation depends on specific websocket library
            logger.info("Connecting to Alpaca websocket...")
            # self.ws_connection = await connect_to_alpaca_ws(...)
        except Exception as e:
            logger.error(f"Failed to connect to websocket: {e}")