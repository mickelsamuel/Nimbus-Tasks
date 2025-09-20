"""Base strategy class for all trading strategies."""

from abc import ABC, abstractmethod
from typing import Dict, List

import pandas as pd

from athena.core.logging import get_logger
from athena.core.types import Order, OrderSide, OrderType

logger = get_logger(__name__)


class BaseStrategy(ABC):
    """Abstract base class for trading strategies."""

    def __init__(self, name: str = None):
        """Initialize base strategy.

        Args:
            name: Strategy name
        """
        self.name = name or self.__class__.__name__
        self.params = {}

    @abstractmethod
    def generate_signals(self, data: pd.DataFrame) -> pd.Series:
        """Generate trading signals from data.

        Args:
            data: OHLCV data with datetime index

        Returns:
            Series with signals: 1 for buy, -1 for sell, 0 for hold
        """
        pass

    def prepare_data(self, data: pd.DataFrame) -> pd.DataFrame:
        """Prepare and validate data for strategy.

        Args:
            data: Raw OHLCV data

        Returns:
            Prepared DataFrame
        """
        # Ensure required columns exist
        required_columns = ["open", "high", "low", "close", "volume"]
        missing_columns = [col for col in required_columns if col not in data.columns]

        if missing_columns:
            raise ValueError(f"Missing required columns: {missing_columns}")

        # Ensure datetime index
        if not isinstance(data.index, pd.DatetimeIndex):
            data.index = pd.to_datetime(data.index)

        # Sort by date
        data = data.sort_index()

        # Remove any NaN values
        data = data.dropna()

        return data

    def create_orders(
        self, signals: pd.Series, data: pd.DataFrame, position_size: float = 1000
    ) -> List[Order]:
        """Create orders from signals.

        Args:
            signals: Trading signals
            data: OHLCV data
            position_size: Size of each position in currency units

        Returns:
            List of orders
        """
        orders = []

        for date, signal in signals.items():
            if signal == 0:
                continue

            # Get price at signal time
            if date not in data.index:
                continue

            price = data.loc[date, "close"]

            # Create order
            order = Order(
                symbol=self.name,  # Using strategy name as symbol placeholder
                side=OrderSide.BUY if signal > 0 else OrderSide.SELL,
                quantity=position_size / price,
                order_type=OrderType.MARKET,
                price=price,
                timestamp=date,
            )
            orders.append(order)

        return orders

    def get_parameters(self) -> Dict:
        """Get strategy parameters.

        Returns:
            Dictionary of parameters
        """
        return self.params.copy()

    def set_parameters(self, **kwargs) -> None:
        """Set strategy parameters.

        Args:
            **kwargs: Parameters to set
        """
        self.params.update(kwargs)

    def validate_parameters(self) -> bool:
        """Validate strategy parameters.

        Returns:
            True if parameters are valid
        """
        return True

    def __str__(self) -> str:
        """String representation."""
        return f"{self.name}({self.params})"
