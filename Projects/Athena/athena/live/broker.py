"""Abstract broker interface and simulator implementation."""

import uuid
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Dict, List, Optional

from athena.core.logging import get_logger
from athena.core.types import Order, OrderStatus, Portfolio, Position, Trade

logger = get_logger(__name__)


class BaseBroker(ABC):
    """Abstract base class for broker implementations."""

    @abstractmethod
    def connect(self) -> bool:
        """Connect to the broker.

        Returns:
            True if connection successful
        """
        pass

    @abstractmethod
    def disconnect(self) -> bool:
        """Disconnect from the broker.

        Returns:
            True if disconnection successful
        """
        pass

    @abstractmethod
    def place_order(self, order: Order) -> str:
        """Place an order.

        Args:
            order: Order to place

        Returns:
            Order ID
        """
        pass

    @abstractmethod
    def cancel_order(self, order_id: str) -> bool:
        """Cancel an order.

        Args:
            order_id: Order ID to cancel

        Returns:
            True if cancellation successful
        """
        pass

    @abstractmethod
    def get_order_status(self, order_id: str) -> Optional[Order]:
        """Get order status.

        Args:
            order_id: Order ID

        Returns:
            Order object or None if not found
        """
        pass

    @abstractmethod
    def get_positions(self) -> Dict[str, Position]:
        """Get current positions.

        Returns:
            Dictionary mapping symbols to positions
        """
        pass

    @abstractmethod
    def get_portfolio(self) -> Portfolio:
        """Get current portfolio status.

        Returns:
            Portfolio object
        """
        pass

    @abstractmethod
    def get_trades(self, symbol: Optional[str] = None) -> List[Trade]:
        """Get trade history.

        Args:
            symbol: Optional symbol filter

        Returns:
            List of trades
        """
        pass


class SimulatedBroker(BaseBroker):
    """Simulated broker for testing and fallback."""

    def __init__(
        self, initial_capital: float = 100000, commission: float = 0.001, slippage: float = 0.0005
    ):
        """Initialize simulated broker.

        Args:
            initial_capital: Starting capital
            commission: Commission rate
            slippage: Slippage rate
        """
        self.initial_capital = initial_capital
        self.commission = commission
        self.slippage = slippage

        # State
        self.connected = False
        self.cash = initial_capital
        self.orders: Dict[str, Order] = {}
        self.positions: Dict[str, Position] = {}
        self.trades: List[Trade] = []

        # Mock price feed
        self.mock_prices: Dict[str, float] = {}

    def connect(self) -> bool:
        """Connect to simulated broker."""
        self.connected = True
        logger.info("Connected to simulated broker")
        return True

    def disconnect(self) -> bool:
        """Disconnect from simulated broker."""
        self.connected = False
        logger.info("Disconnected from simulated broker")
        return True

    def set_mock_price(self, symbol: str, price: float) -> None:
        """Set mock price for simulation.

        Args:
            symbol: Symbol
            price: Mock price
        """
        self.mock_prices[symbol] = price

    def get_current_price(self, symbol: str) -> float:
        """Get current price for symbol.

        Args:
            symbol: Symbol

        Returns:
            Current price
        """
        return self.mock_prices.get(symbol, 100.0)  # Default to $100

    def place_order(self, order: Order) -> str:
        """Place a simulated order.

        Args:
            order: Order to place

        Returns:
            Order ID
        """
        if not self.connected:
            raise RuntimeError("Broker not connected")

        # Generate order ID
        order_id = str(uuid.uuid4())[:8]
        order.order_id = order_id
        order.timestamp = datetime.now()

        # Get current price
        current_price = self.get_current_price(order.symbol)

        # Apply slippage
        if order.side.value == "buy":
            fill_price = current_price * (1 + self.slippage)
        else:
            fill_price = current_price * (1 - self.slippage)

        # For market orders, fill immediately
        if order.order_type.value == "market":
            self._fill_order(order, fill_price)
            # Store filled order for status tracking
            self.orders[order_id] = order
        else:
            # For limit orders, store for potential future fill
            order.status = OrderStatus.PENDING
            self.orders[order_id] = order

        logger.info(f"Placed order {order_id}: {order.side.value} {order.quantity} {order.symbol}")
        return order_id

    def _fill_order(self, order: Order, fill_price: float) -> None:
        """Fill an order at given price.

        Args:
            order: Order to fill
            fill_price: Fill price
        """
        # Calculate commission
        trade_value = order.quantity * fill_price
        commission = trade_value * self.commission

        # Update order
        order.status = OrderStatus.FILLED
        order.filled_quantity = order.quantity
        order.filled_price = fill_price
        order.commission = commission

        # Create trade
        trade = Trade(
            symbol=order.symbol,
            side=order.side,
            quantity=order.quantity,
            price=fill_price,
            timestamp=datetime.now(),
            commission=commission,
            trade_id=str(uuid.uuid4())[:8],
            order_id=order.order_id,
        )
        self.trades.append(trade)

        # Update positions
        self._update_position(trade)

        # Update cash
        if order.side.value == "buy":
            self.cash -= trade_value + commission
        else:
            self.cash += trade_value - commission

        logger.info(f"Filled order {order.order_id}: {order.quantity} @ ${fill_price:.2f}")

    def _update_position(self, trade: Trade) -> None:
        """Update position based on trade.

        Args:
            trade: Executed trade
        """
        symbol = trade.symbol

        if symbol not in self.positions:
            # New position
            self.positions[symbol] = Position(
                symbol=symbol,
                quantity=trade.quantity if trade.side.value == "buy" else -trade.quantity,
                avg_entry_price=trade.price,
                current_price=trade.price,
                unrealized_pnl=0.0,
                timestamp=trade.timestamp,
            )
        else:
            # Update existing position
            pos = self.positions[symbol]

            if trade.side.value == "buy":
                new_quantity = pos.quantity + trade.quantity
                if pos.quantity >= 0:  # Adding to long
                    pos.avg_entry_price = (
                        pos.avg_entry_price * pos.quantity + trade.price * trade.quantity
                    ) / new_quantity
                pos.quantity = new_quantity
            else:  # sell
                new_quantity = pos.quantity - trade.quantity
                if pos.quantity <= 0:  # Adding to short
                    pos.avg_entry_price = (
                        pos.avg_entry_price * abs(pos.quantity) + trade.price * trade.quantity
                    ) / abs(new_quantity)
                pos.quantity = new_quantity

            # Remove position if closed
            if abs(pos.quantity) < 1e-6:
                del self.positions[symbol]

    def cancel_order(self, order_id: str) -> bool:
        """Cancel a pending order.

        Args:
            order_id: Order ID to cancel

        Returns:
            True if cancellation successful
        """
        if order_id in self.orders:
            order = self.orders[order_id]
            if order.status == OrderStatus.PENDING:
                order.status = OrderStatus.CANCELLED
                logger.info(f"Cancelled order {order_id}")
                return True

        logger.warning(f"Cannot cancel order {order_id}: not found or not pending")
        return False

    def get_order_status(self, order_id: str) -> Optional[Order]:
        """Get order status.

        Args:
            order_id: Order ID

        Returns:
            Order object or None if not found
        """
        return self.orders.get(order_id)

    def get_positions(self) -> Dict[str, Position]:
        """Get current positions.

        Returns:
            Dictionary mapping symbols to positions
        """
        # Update unrealized PnL
        for symbol, position in self.positions.items():
            current_price = self.get_current_price(symbol)
            position.current_price = current_price

            if position.quantity > 0:  # Long position
                position.unrealized_pnl = (
                    current_price - position.avg_entry_price
                ) * position.quantity
            else:  # Short position
                position.unrealized_pnl = (position.avg_entry_price - current_price) * abs(
                    position.quantity
                )

        return self.positions.copy()

    def get_portfolio(self) -> Portfolio:
        """Get current portfolio status.

        Returns:
            Portfolio object
        """
        positions = self.get_positions()

        total_value = self.cash
        unrealized_pnl = 0.0

        for position in positions.values():
            total_value += position.market_value
            unrealized_pnl += position.unrealized_pnl

        # Calculate realized PnL from trades
        realized_pnl = sum(getattr(trade, "pnl", 0) or 0 for trade in self.trades)

        return Portfolio(
            cash=self.cash,
            positions=positions,
            timestamp=datetime.now(),
            total_value=total_value,
            unrealized_pnl=unrealized_pnl,
            realized_pnl=realized_pnl,
        )

    def get_trades(self, symbol: Optional[str] = None) -> List[Trade]:
        """Get trade history.

        Args:
            symbol: Optional symbol filter

        Returns:
            List of trades
        """
        if symbol:
            return [trade for trade in self.trades if trade.symbol == symbol]
        return self.trades.copy()
