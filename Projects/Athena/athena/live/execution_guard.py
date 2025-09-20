"""Execution guards and circuit breakers for production safety."""

import asyncio
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from typing import Dict, List, Optional, Any, Callable
from decimal import Decimal

from athena.core.types import Order, Position, Trade, OrderSide
from athena.core.logging import get_logger

logger = get_logger(__name__)


class GuardViolationType(Enum):
    """Types of guard violations."""
    MAX_DAILY_LOSS = "max_daily_loss"
    MAX_POSITION_SIZE = "max_position_size"
    CONSECUTIVE_LOSSES = "consecutive_losses"
    SLIPPAGE_THRESHOLD = "slippage_threshold"
    ORDER_RATE_LIMIT = "order_rate_limit"
    MARKET_VOLATILITY = "market_volatility"
    CONNECTIVITY_LOSS = "connectivity_loss"


class GuardAction(Enum):
    """Actions to take when guard is violated."""
    HALT_ALL = "halt_all"           # Stop all trading
    HALT_SYMBOL = "halt_symbol"     # Stop trading specific symbol
    REDUCE_SIZE = "reduce_size"     # Reduce position sizes
    ALERT_ONLY = "alert_only"       # Log alert but continue
    FLATTEN_POSITIONS = "flatten_positions"  # Close all positions


@dataclass
class GuardViolation:
    """Represents a guard violation event."""
    type: GuardViolationType
    message: str
    severity: str  # "low", "medium", "high", "critical"
    action: GuardAction
    timestamp: datetime = field(default_factory=datetime.now)
    symbol: Optional[str] = None
    value: Optional[float] = None
    threshold: Optional[float] = None


@dataclass
class ExecutionGuardConfig:
    """Configuration for execution guards."""
    # Daily loss limits
    max_daily_loss_dollars: float = 10000.0
    max_daily_loss_percent: float = 0.05  # 5% of account

    # Position size limits
    max_position_per_symbol_dollars: float = 50000.0
    max_position_per_symbol_percent: float = 0.10  # 10% of account
    max_total_gross_exposure: float = 200000.0

    # Consecutive loss protection
    max_consecutive_losses: int = 5
    consecutive_loss_lookback_hours: int = 24

    # Slippage circuit breaker
    max_slippage_bps: float = 50.0  # 0.5%
    slippage_violation_threshold: int = 3  # Number of violations before halt

    # Rate limiting
    max_orders_per_minute: int = 60
    max_orders_per_hour: int = 1000

    # Market volatility protection
    volatility_threshold_percent: float = 0.05  # 5% move
    volatility_lookback_minutes: int = 15

    # Connectivity monitoring
    max_latency_ms: float = 5000.0
    max_disconnection_seconds: int = 30

    # Guard actions
    default_halt_duration_minutes: int = 15
    auto_resume_enabled: bool = False


class ExecutionGuard:
    """Comprehensive execution guard system."""

    def __init__(self, config: ExecutionGuardConfig):
        """Initialize execution guard."""
        self.config = config
        self.is_active = True
        self.violations: List[GuardViolation] = []
        self.halted_symbols: Dict[str, datetime] = {}
        self.is_global_halt = False
        self.global_halt_time: Optional[datetime] = None

        # Tracking state
        self._daily_pnl = 0.0
        self._account_balance = 100000.0  # Will be updated from broker
        self._positions: Dict[str, Position] = {}
        self._recent_trades: List[Trade] = []
        self._order_timestamps: List[datetime] = []
        self._slippage_violations = 0
        self._last_market_prices: Dict[str, float] = {}

        # Callbacks for violations
        self._violation_callbacks: List[Callable[[GuardViolation], None]] = []

    def register_violation_callback(self, callback: Callable[[GuardViolation], None]) -> None:
        """Register callback for guard violations."""
        self._violation_callbacks.append(callback)

    def update_account_balance(self, balance: float) -> None:
        """Update current account balance."""
        self._account_balance = balance

    def update_daily_pnl(self, pnl: float) -> None:
        """Update current daily P&L."""
        self._daily_pnl = pnl

    def update_positions(self, positions: List[Position]) -> None:
        """Update current positions."""
        self._positions = {pos.symbol: pos for pos in positions}

    def add_trade(self, trade: Trade) -> None:
        """Add completed trade for tracking."""
        self._recent_trades.append(trade)

        # Keep only recent trades (24 hours)
        cutoff = datetime.now() - timedelta(hours=24)
        self._recent_trades = [t for t in self._recent_trades if t.timestamp > cutoff]

    def update_market_price(self, symbol: str, price: float) -> None:
        """Update market price for volatility monitoring."""
        self._last_market_prices[symbol] = price

    async def check_order_allowed(self, order: Order) -> tuple[bool, Optional[GuardViolation]]:
        """Check if order is allowed by all guards."""
        if not self.is_active:
            return True, None

        # Check global halt
        if self.is_global_halt:
            if await self._check_halt_expiry():
                return False, GuardViolation(
                    type=GuardViolationType.MAX_DAILY_LOSS,
                    message="Global trading halt active",
                    severity="critical",
                    action=GuardAction.HALT_ALL
                )

        # Check symbol-specific halt
        if order.symbol in self.halted_symbols:
            if await self._check_symbol_halt_expiry(order.symbol):
                return False, GuardViolation(
                    type=GuardViolationType.MAX_POSITION_SIZE,
                    message=f"Symbol {order.symbol} trading halted",
                    severity="high",
                    action=GuardAction.HALT_SYMBOL,
                    symbol=order.symbol
                )

        # Check daily loss limit
        violation = await self._check_daily_loss_limit(order)
        if violation:
            return False, violation

        # Check position size limits
        violation = await self._check_position_size_limits(order)
        if violation:
            return False, violation

        # Check consecutive losses
        violation = await self._check_consecutive_losses()
        if violation:
            return False, violation

        # Check order rate limits
        violation = await self._check_order_rate_limits()
        if violation:
            return False, violation

        return True, None

    async def check_trade_slippage(self, trade: Trade, expected_price: float) -> Optional[GuardViolation]:
        """Check trade for excessive slippage."""
        if not self.is_active or expected_price == 0:
            return None

        slippage_bps = abs(trade.price - expected_price) / expected_price * 10000

        if slippage_bps > self.config.max_slippage_bps:
            self._slippage_violations += 1

            violation = GuardViolation(
                type=GuardViolationType.SLIPPAGE_THRESHOLD,
                message=f"High slippage detected: {slippage_bps:.1f} bps",
                severity="medium" if slippage_bps < self.config.max_slippage_bps * 2 else "high",
                action=GuardAction.ALERT_ONLY if self._slippage_violations < self.config.slippage_violation_threshold else GuardAction.HALT_SYMBOL,
                symbol=trade.symbol,
                value=slippage_bps,
                threshold=self.config.max_slippage_bps
            )

            await self._handle_violation(violation)

            # Halt symbol if too many slippage violations
            if self._slippage_violations >= self.config.slippage_violation_threshold:
                await self._halt_symbol(trade.symbol, "Excessive slippage violations")

            return violation

        return None

    async def check_connectivity(self, latency_ms: float, is_connected: bool) -> Optional[GuardViolation]:
        """Check connectivity health."""
        if not self.is_active:
            return None

        # Check latency
        if latency_ms > self.config.max_latency_ms:
            violation = GuardViolation(
                type=GuardViolationType.CONNECTIVITY_LOSS,
                message=f"High latency detected: {latency_ms:.1f}ms",
                severity="high",
                action=GuardAction.ALERT_ONLY,
                value=latency_ms,
                threshold=self.config.max_latency_ms
            )
            await self._handle_violation(violation)
            return violation

        # Check disconnection
        if not is_connected:
            violation = GuardViolation(
                type=GuardViolationType.CONNECTIVITY_LOSS,
                message="Broker disconnected",
                severity="critical",
                action=GuardAction.HALT_ALL
            )
            await self._global_halt("Connectivity loss")
            await self._handle_violation(violation)
            return violation

        return None

    async def force_halt(self, reason: str, symbol: Optional[str] = None) -> None:
        """Force trading halt."""
        if symbol:
            await self._halt_symbol(symbol, reason)
        else:
            await self._global_halt(reason)

    async def resume_trading(self, symbol: Optional[str] = None) -> None:
        """Resume trading (manual override)."""
        if symbol:
            if symbol in self.halted_symbols:
                del self.halted_symbols[symbol]
                logger.info(f"Resumed trading for {symbol}")
        else:
            self.is_global_halt = False
            self.global_halt_time = None
            self.halted_symbols.clear()
            logger.info("Resumed all trading")

    def get_status(self) -> Dict[str, Any]:
        """Get current guard status."""
        return {
            "active": self.is_active,
            "global_halt": self.is_global_halt,
            "halted_symbols": list(self.halted_symbols.keys()),
            "daily_pnl": self._daily_pnl,
            "account_balance": self._account_balance,
            "recent_violations": len([v for v in self.violations if v.timestamp > datetime.now() - timedelta(hours=1)]),
            "total_violations": len(self.violations),
            "slippage_violations": self._slippage_violations,
            "recent_orders": len([t for t in self._order_timestamps if t > datetime.now() - timedelta(minutes=1)])
        }

    # Private methods

    async def _check_daily_loss_limit(self, order: Order) -> Optional[GuardViolation]:
        """Check daily loss limits."""
        # Check absolute dollar loss
        if self._daily_pnl < -self.config.max_daily_loss_dollars:
            violation = GuardViolation(
                type=GuardViolationType.MAX_DAILY_LOSS,
                message=f"Daily loss limit exceeded: ${abs(self._daily_pnl):,.2f}",
                severity="critical",
                action=GuardAction.HALT_ALL,
                value=abs(self._daily_pnl),
                threshold=self.config.max_daily_loss_dollars
            )
            await self._global_halt("Daily loss limit exceeded")
            await self._handle_violation(violation)
            return violation

        # Check percentage loss
        loss_percent = abs(self._daily_pnl) / self._account_balance
        if loss_percent > self.config.max_daily_loss_percent:
            violation = GuardViolation(
                type=GuardViolationType.MAX_DAILY_LOSS,
                message=f"Daily loss percentage exceeded: {loss_percent:.2%}",
                severity="critical",
                action=GuardAction.HALT_ALL,
                value=loss_percent,
                threshold=self.config.max_daily_loss_percent
            )
            await self._global_halt("Daily loss percentage exceeded")
            await self._handle_violation(violation)
            return violation

        return None

    async def _check_position_size_limits(self, order: Order) -> Optional[GuardViolation]:
        """Check position size limits."""
        # Calculate new position size if order fills
        current_pos = self._positions.get(order.symbol)
        current_qty = current_pos.quantity if current_pos else 0

        if order.side == OrderSide.BUY:
            new_qty = current_qty + order.quantity
        else:
            new_qty = current_qty - order.quantity

        # Estimate position value (using order price or current market price)
        price = order.price or self._last_market_prices.get(order.symbol, 100.0)
        new_position_value = abs(new_qty * price)

        # Check absolute dollar limit
        if new_position_value > self.config.max_position_per_symbol_dollars:
            violation = GuardViolation(
                type=GuardViolationType.MAX_POSITION_SIZE,
                message=f"Position size limit exceeded for {order.symbol}: ${new_position_value:,.2f}",
                severity="high",
                action=GuardAction.HALT_SYMBOL,
                symbol=order.symbol,
                value=new_position_value,
                threshold=self.config.max_position_per_symbol_dollars
            )
            await self._halt_symbol(order.symbol, "Position size limit exceeded")
            await self._handle_violation(violation)
            return violation

        # Check percentage limit
        position_percent = new_position_value / self._account_balance
        if position_percent > self.config.max_position_per_symbol_percent:
            violation = GuardViolation(
                type=GuardViolationType.MAX_POSITION_SIZE,
                message=f"Position percentage limit exceeded for {order.symbol}: {position_percent:.2%}",
                severity="high",
                action=GuardAction.HALT_SYMBOL,
                symbol=order.symbol,
                value=position_percent,
                threshold=self.config.max_position_per_symbol_percent
            )
            await self._halt_symbol(order.symbol, "Position percentage limit exceeded")
            await self._handle_violation(violation)
            return violation

        return None

    async def _check_consecutive_losses(self) -> Optional[GuardViolation]:
        """Check for consecutive losing trades."""
        cutoff = datetime.now() - timedelta(hours=self.config.consecutive_loss_lookback_hours)
        recent_trades = [t for t in self._recent_trades if t.timestamp > cutoff]

        if len(recent_trades) < self.config.max_consecutive_losses:
            return None

        # Check last N trades for consecutive losses
        last_trades = recent_trades[-self.config.max_consecutive_losses:]

        # Assume losses if commission > 0 or can be determined from trade context
        consecutive_losses = 0
        for trade in reversed(last_trades):
            # Simple heuristic: if commission charged, assume it's a loss
            # In real implementation, would need P&L calculation
            if trade.commission > 0:
                consecutive_losses += 1
            else:
                break

        if consecutive_losses >= self.config.max_consecutive_losses:
            violation = GuardViolation(
                type=GuardViolationType.CONSECUTIVE_LOSSES,
                message=f"Consecutive losses detected: {consecutive_losses}",
                severity="high",
                action=GuardAction.HALT_ALL,
                value=consecutive_losses,
                threshold=self.config.max_consecutive_losses
            )
            await self._global_halt("Consecutive losses detected")
            await self._handle_violation(violation)
            return violation

        return None

    async def _check_order_rate_limits(self) -> Optional[GuardViolation]:
        """Check order rate limits."""
        now = datetime.now()
        self._order_timestamps.append(now)

        # Clean old timestamps
        minute_ago = now - timedelta(minutes=1)
        hour_ago = now - timedelta(hours=1)

        self._order_timestamps = [t for t in self._order_timestamps if t > hour_ago]

        # Check per-minute limit
        minute_orders = len([t for t in self._order_timestamps if t > minute_ago])
        if minute_orders > self.config.max_orders_per_minute:
            violation = GuardViolation(
                type=GuardViolationType.ORDER_RATE_LIMIT,
                message=f"Order rate limit exceeded: {minute_orders} orders/minute",
                severity="medium",
                action=GuardAction.ALERT_ONLY,
                value=minute_orders,
                threshold=self.config.max_orders_per_minute
            )
            await self._handle_violation(violation)
            return violation

        # Check per-hour limit
        hour_orders = len(self._order_timestamps)
        if hour_orders > self.config.max_orders_per_hour:
            violation = GuardViolation(
                type=GuardViolationType.ORDER_RATE_LIMIT,
                message=f"Hourly order limit exceeded: {hour_orders} orders/hour",
                severity="high",
                action=GuardAction.HALT_ALL,
                value=hour_orders,
                threshold=self.config.max_orders_per_hour
            )
            await self._global_halt("Hourly order limit exceeded")
            await self._handle_violation(violation)
            return violation

        return None

    async def _global_halt(self, reason: str) -> None:
        """Implement global trading halt."""
        self.is_global_halt = True
        self.global_halt_time = datetime.now()
        logger.critical(f"GLOBAL TRADING HALT: {reason}")

    async def _halt_symbol(self, symbol: str, reason: str) -> None:
        """Implement symbol-specific halt."""
        self.halted_symbols[symbol] = datetime.now()
        logger.warning(f"SYMBOL HALT ({symbol}): {reason}")

    async def _check_halt_expiry(self) -> bool:
        """Check if global halt should expire."""
        if not self.is_global_halt or not self.global_halt_time:
            return False

        if not self.config.auto_resume_enabled:
            return True  # Manual resume required

        elapsed = datetime.now() - self.global_halt_time
        if elapsed.total_seconds() > self.config.default_halt_duration_minutes * 60:
            self.is_global_halt = False
            self.global_halt_time = None
            logger.info("Global halt auto-expired")
            return False

        return True

    async def _check_symbol_halt_expiry(self, symbol: str) -> bool:
        """Check if symbol halt should expire."""
        if symbol not in self.halted_symbols:
            return False

        if not self.config.auto_resume_enabled:
            return True  # Manual resume required

        elapsed = datetime.now() - self.halted_symbols[symbol]
        if elapsed.total_seconds() > self.config.default_halt_duration_minutes * 60:
            del self.halted_symbols[symbol]
            logger.info(f"Symbol halt auto-expired for {symbol}")
            return False

        return True

    async def _handle_violation(self, violation: GuardViolation) -> None:
        """Handle guard violation."""
        self.violations.append(violation)

        # Trigger callbacks
        for callback in self._violation_callbacks:
            try:
                callback(violation)
            except Exception as e:
                logger.error(f"Error in violation callback: {e}")

        # Log violation
        log_level = {
            "low": logger.info,
            "medium": logger.warning,
            "high": logger.error,
            "critical": logger.critical
        }.get(violation.severity, logger.warning)

        log_level(f"GUARD VIOLATION: {violation.message}")