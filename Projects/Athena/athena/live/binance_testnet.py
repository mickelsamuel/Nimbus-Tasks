"""Binance testnet integration for paper trading."""

import asyncio
import json
import time
from datetime import datetime
from typing import Callable, Dict, List, Optional

import requests
import websockets
from tenacity import retry, stop_after_attempt, wait_exponential

from athena.core.config import settings
from athena.core.logging import get_logger
from athena.core.types import Order, OrderStatus, OrderType, Portfolio, Position, Trade
from athena.live.broker import BaseBroker

logger = get_logger(__name__)


class BinanceTestnetBroker(BaseBroker):
    """Binance testnet broker for paper trading."""

    def __init__(
        self,
        api_key: Optional[str] = None,
        secret_key: Optional[str] = None,
        testnet_url: str = None,
    ):
        """Initialize Binance testnet broker.

        Args:
            api_key: Binance testnet API key
            secret_key: Binance testnet secret key
            testnet_url: Testnet base URL
        """
        self.api_key = api_key or settings.binance_testnet_api_key
        self.secret_key = secret_key or settings.binance_testnet_secret_key
        self.testnet_url = testnet_url or settings.binance_testnet_url

        # Connection state
        self.connected = False
        self.websocket = None
        self.price_callbacks: List[Callable] = []

        # Cache
        self.account_info = {}
        self.orders: Dict[str, Order] = {}
        self.positions: Dict[str, Position] = {}
        self.price_cache: Dict[str, float] = {}

        # Websocket stream
        self.stream_url = "wss://stream.binance.com:9443/ws/"

    @property
    def has_credentials(self) -> bool:
        """Check if API credentials are available."""
        return bool(self.api_key and self.secret_key)

    def connect(self) -> bool:
        """Connect to Binance testnet.

        Returns:
            True if connection successful
        """
        if not self.has_credentials:
            logger.warning("No Binance testnet credentials provided")
            return False

        try:
            # Test connection
            response = self._make_request("GET", "/api/v3/time")
            if response.get("serverTime"):
                self.connected = True
                logger.info("Connected to Binance testnet")

                # Get initial account info
                self._update_account_info()
                return True

        except Exception as e:
            logger.error(f"Failed to connect to Binance testnet: {e}")

        return False

    def disconnect(self) -> bool:
        """Disconnect from Binance testnet.

        Returns:
            True if disconnection successful
        """
        self.connected = False

        if self.websocket:
            try:
                asyncio.run(self.websocket.close())
            except Exception as e:
                logger.warning(f"Error closing websocket: {e}")

        logger.info("Disconnected from Binance testnet")
        return True

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    def _make_request(
        self, method: str, endpoint: str, params: Dict = None, signed: bool = False
    ) -> Dict:
        """Make HTTP request to Binance API.

        Args:
            method: HTTP method
            endpoint: API endpoint
            params: Request parameters
            signed: Whether request needs signature

        Returns:
            Response JSON
        """
        if not self.connected and endpoint != "/api/v3/time":
            raise RuntimeError("Not connected to Binance testnet")

        url = f"{self.testnet_url}{endpoint}"
        headers = {}

        if self.api_key:
            headers["X-MBX-APIKEY"] = self.api_key

        if params is None:
            params = {}

        if signed:
            params["timestamp"] = int(time.time() * 1000)
            # Note: In real implementation, you'd sign the request with HMAC-SHA256
            # For testnet, simplified implementation

        response = requests.request(method, url, headers=headers, params=params, timeout=10)
        response.raise_for_status()

        return response.json()

    def _update_account_info(self) -> None:
        """Update account information."""
        try:
            self.account_info = self._make_request("GET", "/api/v3/account", signed=True)
            logger.debug("Updated account info")
        except Exception as e:
            logger.error(f"Failed to update account info: {e}")

    def place_order(self, order: Order) -> str:
        """Place an order on Binance testnet.

        Args:
            order: Order to place

        Returns:
            Order ID
        """
        if not self.connected:
            raise RuntimeError("Not connected to Binance testnet")

        # Convert order to Binance format
        params = {
            "symbol": order.symbol.replace("/", ""),  # Remove slash for Binance format
            "side": order.side.value.upper(),
            "type": order.order_type.value.upper(),
            "quantity": order.quantity,
        }

        if order.order_type == OrderType.LIMIT:
            params["price"] = order.price
            params["timeInForce"] = "GTC"

        try:
            response = self._make_request("POST", "/api/v3/order", params, signed=True)

            # Update order with response
            order.order_id = str(response.get("orderId"))
            order.timestamp = datetime.now()
            order.status = OrderStatus.PENDING

            # Store order
            self.orders[order.order_id] = order

            logger.info(
                f"Placed order {order.order_id}: {order.side.value} {order.quantity} {order.symbol}"
            )
            return order.order_id

        except Exception as e:
            logger.error(f"Failed to place order: {e}")
            raise

    def cancel_order(self, order_id: str) -> bool:
        """Cancel an order.

        Args:
            order_id: Order ID to cancel

        Returns:
            True if cancellation successful
        """
        if not self.connected:
            return False

        if order_id not in self.orders:
            logger.warning(f"Order {order_id} not found")
            return False

        order = self.orders[order_id]

        params = {"symbol": order.symbol.replace("/", ""), "orderId": order_id}

        try:
            self._make_request("DELETE", "/api/v3/order", params, signed=True)
            order.status = OrderStatus.CANCELLED
            logger.info(f"Cancelled order {order_id}")
            return True

        except Exception as e:
            logger.error(f"Failed to cancel order {order_id}: {e}")
            return False

    def get_order_status(self, order_id: str) -> Optional[Order]:
        """Get order status.

        Args:
            order_id: Order ID

        Returns:
            Order object or None if not found
        """
        if order_id not in self.orders:
            return None

        order = self.orders[order_id]

        # Update status from exchange
        try:
            params = {"symbol": order.symbol.replace("/", ""), "orderId": order_id}
            response = self._make_request("GET", "/api/v3/order", params, signed=True)

            # Update order status
            status_map = {
                "NEW": OrderStatus.PENDING,
                "PARTIALLY_FILLED": OrderStatus.PARTIALLY_FILLED,
                "FILLED": OrderStatus.FILLED,
                "CANCELED": OrderStatus.CANCELLED,
                "REJECTED": OrderStatus.REJECTED,
            }

            order.status = status_map.get(response.get("status"), OrderStatus.PENDING)
            order.filled_quantity = float(response.get("executedQty", 0))

        except Exception as e:
            logger.error(f"Failed to get order status: {e}")

        return order

    def get_positions(self) -> Dict[str, Position]:
        """Get current positions.

        Returns:
            Dictionary mapping symbols to positions
        """
        if not self.connected:
            return {}

        try:
            self._update_account_info()

            positions = {}
            for balance in self.account_info.get("balances", []):
                asset = balance["asset"]
                free = float(balance["free"])
                locked = float(balance["locked"])
                total = free + locked

                if total > 0:
                    # Create position (simplified)
                    current_price = self.get_current_price(f"{asset}/USDT")

                    position = Position(
                        symbol=f"{asset}/USDT",
                        quantity=total,
                        avg_entry_price=current_price,  # Simplified
                        current_price=current_price,
                        unrealized_pnl=0.0,  # Simplified
                        timestamp=datetime.now(),
                    )
                    positions[f"{asset}/USDT"] = position

            return positions

        except Exception as e:
            logger.error(f"Failed to get positions: {e}")
            return {}

    def get_current_price(self, symbol: str) -> float:
        """Get current price for symbol.

        Args:
            symbol: Symbol (e.g., "BTC/USDT")

        Returns:
            Current price
        """
        # Check cache first
        if symbol in self.price_cache:
            return self.price_cache[symbol]

        try:
            binance_symbol = symbol.replace("/", "")
            params = {"symbol": binance_symbol}
            response = self._make_request("GET", "/api/v3/ticker/price", params)

            price = float(response.get("price", 0))
            self.price_cache[symbol] = price
            return price

        except Exception as e:
            logger.error(f"Failed to get price for {symbol}: {e}")
            return 0.0

    def get_portfolio(self) -> Portfolio:
        """Get current portfolio status.

        Returns:
            Portfolio object
        """
        positions = self.get_positions()

        # Calculate cash (USDT balance)
        cash = 0.0
        if "USDT/USDT" in positions:
            cash = positions["USDT/USDT"].quantity
            del positions["USDT/USDT"]

        total_value = cash
        unrealized_pnl = 0.0

        for position in positions.values():
            total_value += position.market_value
            unrealized_pnl += position.unrealized_pnl

        return Portfolio(
            cash=cash,
            positions=positions,
            timestamp=datetime.now(),
            total_value=total_value,
            unrealized_pnl=unrealized_pnl,
            realized_pnl=0.0,  # Would need trade history analysis
        )

    def get_trades(self, symbol: Optional[str] = None) -> List[Trade]:
        """Get trade history.

        Args:
            symbol: Optional symbol filter

        Returns:
            List of trades
        """
        # This would require implementing trade history retrieval
        # For now, return empty list
        logger.warning("Trade history not yet implemented for Binance testnet")
        return []

    async def start_price_stream(self, symbols: List[str]) -> None:
        """Start websocket price stream.

        Args:
            symbols: List of symbols to stream
        """
        if not symbols:
            return

        # Convert symbols to Binance format
        binance_symbols = [s.replace("/", "").lower() for s in symbols]
        stream_names = [f"{s}@ticker" for s in binance_symbols]
        stream_url = f"{self.stream_url}{'/'.join(stream_names)}"

        try:
            async with websockets.connect(stream_url) as websocket:
                self.websocket = websocket
                logger.info(f"Started price stream for {symbols}")

                async for message in websocket:
                    data = json.loads(message)
                    await self._handle_price_update(data)

        except Exception as e:
            logger.error(f"Price stream error: {e}")

    async def _handle_price_update(self, data: Dict) -> None:
        """Handle price update from websocket.

        Args:
            data: Price update data
        """
        if "s" in data and "c" in data:  # Symbol and close price
            symbol = data["s"]
            price = float(data["c"])

            # Convert back to our format
            if symbol.endswith("USDT"):
                formatted_symbol = f"{symbol[:-4]}/USDT"
                self.price_cache[formatted_symbol] = price

                # Call registered callbacks
                for callback in self.price_callbacks:
                    try:
                        callback(formatted_symbol, price)
                    except Exception as e:
                        logger.error(f"Price callback error: {e}")

    def add_price_callback(self, callback: Callable[[str, float], None]) -> None:
        """Add price update callback.

        Args:
            callback: Function to call on price updates
        """
        self.price_callbacks.append(callback)
