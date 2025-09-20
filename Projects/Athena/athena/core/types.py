"""Common types and dataclasses for the Athena trading platform."""

from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional

import pandas as pd


class OrderSide(Enum):
    """Order side enumeration."""

    BUY = "buy"
    SELL = "sell"


class OrderType(Enum):
    """Order type enumeration."""

    MARKET = "market"
    LIMIT = "limit"
    STOP = "stop"
    STOP_LIMIT = "stop_limit"


class OrderStatus(Enum):
    """Order status enumeration."""

    PENDING = "pending"
    FILLED = "filled"
    PARTIALLY_FILLED = "partially_filled"
    CANCELLED = "cancelled"
    REJECTED = "rejected"


@dataclass
class Order:
    """Order representation."""

    symbol: str
    side: OrderSide
    quantity: float
    order_type: OrderType
    price: Optional[float] = None
    stop_price: Optional[float] = None
    timestamp: Optional[datetime] = None
    order_id: Optional[str] = None
    status: OrderStatus = OrderStatus.PENDING
    filled_quantity: float = 0.0
    filled_price: float = 0.0
    commission: float = 0.0
    metadata: Optional[Dict] = None


@dataclass
class Trade:
    """Executed trade representation."""

    symbol: str
    side: OrderSide
    quantity: float
    price: float
    timestamp: datetime
    commission: float
    trade_id: Optional[str] = None
    order_id: Optional[str] = None
    pnl: Optional[float] = None
    metadata: Optional[Dict] = None


@dataclass
class Position:
    """Position representation."""

    symbol: str
    quantity: float
    avg_entry_price: float
    current_price: float
    unrealized_pnl: float
    realized_pnl: float = 0.0
    timestamp: Optional[datetime] = None
    metadata: Optional[Dict] = None

    @property
    def market_value(self) -> float:
        """Calculate current market value."""
        return self.quantity * self.current_price

    @property
    def pnl_percentage(self) -> float:
        """Calculate PnL percentage."""
        if self.avg_entry_price == 0:
            return 0.0
        return (self.current_price / self.avg_entry_price - 1) * 100


@dataclass
class Portfolio:
    """Portfolio representation."""

    cash: float
    positions: Dict[str, Position]
    timestamp: datetime
    total_value: float
    unrealized_pnl: float
    realized_pnl: float
    metadata: Optional[Dict] = None

    @property
    def equity(self) -> float:
        """Calculate total equity (cash + positions value)."""
        positions_value = sum(p.market_value for p in self.positions.values())
        return self.cash + positions_value

    @property
    def num_positions(self) -> int:
        """Count active positions."""
        return len(self.positions)

    @property
    def cash_percentage(self) -> float:
        """Calculate cash as percentage of total equity."""
        if self.equity == 0:
            return 0.0
        return (self.cash / self.equity) * 100


@dataclass
class BacktestResult:
    """Backtest result container."""

    initial_capital: float
    final_capital: float
    total_return: float
    annual_return: float
    sharpe_ratio: float
    sortino_ratio: float
    max_drawdown: float
    win_rate: float
    profit_factor: float
    total_trades: int
    winning_trades: int
    losing_trades: int
    avg_win: float
    avg_loss: float
    best_trade: float
    worst_trade: float
    equity_curve: pd.Series
    trades: List[Trade]
    daily_returns: pd.Series
    metadata: Optional[Dict] = None

    def to_dict(self) -> Dict:
        """Convert to dictionary for serialization."""
        return {
            "initial_capital": self.initial_capital,
            "final_capital": self.final_capital,
            "total_return": self.total_return,
            "annual_return": self.annual_return,
            "sharpe_ratio": self.sharpe_ratio,
            "sortino_ratio": self.sortino_ratio,
            "max_drawdown": self.max_drawdown,
            "win_rate": self.win_rate,
            "profit_factor": self.profit_factor,
            "total_trades": self.total_trades,
            "winning_trades": self.winning_trades,
            "losing_trades": self.losing_trades,
            "avg_win": self.avg_win,
            "avg_loss": self.avg_loss,
            "best_trade": self.best_trade,
            "worst_trade": self.worst_trade,
        }
