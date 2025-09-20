"""Risk management and position sizing utilities."""

from typing import Dict, List

import numpy as np
import pandas as pd

from athena.core.config import settings
from athena.core.logging import get_logger
from athena.core.types import Position

logger = get_logger(__name__)


class PositionSizer:
    """Position sizing calculator with various methods."""

    def __init__(
        self, max_position_size: float = None, kelly_fraction: float = None, max_positions: int = 10
    ):
        """Initialize position sizer.

        Args:
            max_position_size: Maximum position size as fraction of portfolio
            kelly_fraction: Fraction of Kelly criterion to use
            max_positions: Maximum number of concurrent positions
        """
        self.max_position_size = max_position_size or settings.max_position_size
        self.kelly_fraction = kelly_fraction or settings.kelly_fraction
        self.max_positions = max_positions

    def fixed_fraction(self, portfolio_value: float, risk_per_trade: float = 0.02) -> float:
        """Calculate position size using fixed fraction method.

        Args:
            portfolio_value: Total portfolio value
            risk_per_trade: Risk per trade as fraction of portfolio

        Returns:
            Position size in currency units
        """
        return portfolio_value * risk_per_trade

    def kelly_criterion(
        self, win_probability: float, win_loss_ratio: float, portfolio_value: float
    ) -> float:
        """Calculate position size using Kelly Criterion.

        Args:
            win_probability: Probability of winning (0-1)
            win_loss_ratio: Average win / average loss
            portfolio_value: Total portfolio value

        Returns:
            Position size in currency units
        """
        if win_loss_ratio <= 0:
            return 0

        # Kelly formula: f = (p*b - q) / b
        # where p = win probability, q = loss probability, b = win/loss ratio
        q = 1 - win_probability
        kelly_fraction_full = (win_probability * win_loss_ratio - q) / win_loss_ratio

        # Apply fractional Kelly for safety
        kelly_fraction_adjusted = kelly_fraction_full * self.kelly_fraction

        # Cap at maximum position size
        kelly_fraction_capped = min(kelly_fraction_adjusted, self.max_position_size)

        # Ensure non-negative
        kelly_fraction_final = max(0, kelly_fraction_capped)

        return portfolio_value * kelly_fraction_final

    def volatility_based(
        self, portfolio_value: float, price: float, atr: float, risk_per_trade: float = 0.02
    ) -> int:
        """Calculate position size based on volatility (ATR).

        Args:
            portfolio_value: Total portfolio value
            price: Current price of the asset
            atr: Average True Range
            risk_per_trade: Risk per trade as fraction of portfolio

        Returns:
            Number of shares to trade
        """
        if atr <= 0 or price <= 0:
            return 0

        # Risk amount in currency
        risk_amount = portfolio_value * risk_per_trade

        # Shares based on ATR risk
        shares = risk_amount / (2 * atr)  # Using 2*ATR as stop loss distance

        # Apply maximum position size constraint
        max_value = portfolio_value * self.max_position_size
        max_shares = max_value / price

        return int(min(shares, max_shares))

    def equal_weight(self, portfolio_value: float, num_positions: int = None) -> float:
        """Calculate equal weight position size.

        Args:
            portfolio_value: Total portfolio value
            num_positions: Number of positions (uses max_positions if None)

        Returns:
            Position size in currency units
        """
        num_positions = num_positions or self.max_positions
        return portfolio_value / num_positions


class RiskManager:
    """Enhanced risk management for portfolio and positions."""

    def __init__(
        self,
        max_drawdown: float = 0.2,
        max_position_size: float = None,
        max_gross_exposure: float = 1.0,
        max_correlation: float = 0.7,
        trailing_stop_pct: float = 0.05,
        per_trade_risk_cap: float = 0.02,
        daily_loss_limit: float = 0.05,
        weekly_loss_limit: float = 0.10,
    ):
        """Initialize risk manager.

        Args:
            max_drawdown: Maximum allowed drawdown
            max_position_size: Maximum position size as fraction
            max_gross_exposure: Maximum gross exposure across all positions
            max_correlation: Maximum correlation between positions
            trailing_stop_pct: Trailing stop percentage
            per_trade_risk_cap: Maximum risk per trade as fraction of equity
            daily_loss_limit: Daily loss limit as fraction of equity
            weekly_loss_limit: Weekly loss limit as fraction of equity
        """
        self.max_drawdown = max_drawdown
        self.max_position_size = max_position_size or settings.max_position_size
        self.max_gross_exposure = max_gross_exposure
        self.max_correlation = max_correlation
        self.trailing_stop_pct = trailing_stop_pct
        self.per_trade_risk_cap = per_trade_risk_cap
        self.daily_loss_limit = daily_loss_limit
        self.weekly_loss_limit = weekly_loss_limit

        # Import here to avoid circular imports
        from athena.core.position import PositionSizer

        self.position_sizer = PositionSizer(
            max_position_size=max_position_size, max_gross_exposure=max_gross_exposure
        )

    def check_position_size(self, position_value: float, portfolio_value: float) -> bool:
        """Check if position size is within limits.

        Args:
            position_value: Value of the position
            portfolio_value: Total portfolio value

        Returns:
            True if position size is acceptable
        """
        if portfolio_value <= 0:
            return False

        position_fraction = abs(position_value) / portfolio_value
        is_valid = position_fraction <= self.max_position_size

        if not is_valid:
            logger.warning(
                "Position size exceeds limit",
                position_fraction=position_fraction,
                max_size=self.max_position_size,
            )

        return is_valid

    def check_drawdown(self, equity_curve: pd.Series, current_value: float) -> bool:
        """Check if current drawdown exceeds maximum.

        Args:
            equity_curve: Historical equity values
            current_value: Current portfolio value

        Returns:
            True if drawdown is within limits
        """
        if len(equity_curve) == 0:
            return True

        peak = equity_curve.max()
        if peak <= 0:
            return True

        current_drawdown = (peak - current_value) / peak
        is_valid = current_drawdown <= self.max_drawdown

        if not is_valid:
            logger.warning(
                "Drawdown exceeds limit",
                current_drawdown=current_drawdown,
                max_drawdown=self.max_drawdown,
            )

        return is_valid

    def calculate_var(self, returns: pd.Series, confidence_level: float = 0.95) -> float:
        """Calculate Value at Risk.

        Args:
            returns: Historical returns
            confidence_level: Confidence level (e.g., 0.95 for 95%)

        Returns:
            VaR value
        """
        if len(returns) < 2:
            return 0

        # Historical VaR
        var = np.percentile(returns, (1 - confidence_level) * 100)
        return abs(var)

    def calculate_cvar(self, returns: pd.Series, confidence_level: float = 0.95) -> float:
        """Calculate Conditional Value at Risk (Expected Shortfall).

        Args:
            returns: Historical returns
            confidence_level: Confidence level

        Returns:
            CVaR value
        """
        var = self.calculate_var(returns, confidence_level)
        # Get returns worse than VaR
        tail_returns = returns[returns <= -var]

        if len(tail_returns) == 0:
            return var

        return abs(tail_returns.mean())

    def get_stop_loss(
        self, entry_price: float, atr: float = None, fixed_pct: float = None
    ) -> float:
        """Calculate stop loss price.

        Args:
            entry_price: Entry price
            atr: Average True Range for ATR-based stop
            fixed_pct: Fixed percentage for stop loss

        Returns:
            Stop loss price
        """
        if atr is not None:
            # ATR-based stop (2 ATR below entry)
            return entry_price - (2 * atr)
        elif fixed_pct is not None:
            # Fixed percentage stop
            return entry_price * (1 - fixed_pct)
        else:
            # Default trailing stop
            return entry_price * (1 - self.trailing_stop_pct)

    def check_trade_risk(
        self, trade_size: float, equity: float, entry_price: float, stop_loss: float = None
    ) -> Dict[str, any]:
        """Check if a trade meets risk requirements.

        Args:
            trade_size: Size of the trade in currency units
            equity: Current account equity
            entry_price: Entry price
            stop_loss: Stop loss price

        Returns:
            Dictionary with risk check results
        """
        checks = {"passed": True, "warnings": [], "errors": []}

        # Check position size
        position_fraction = trade_size / equity if equity > 0 else 0
        if position_fraction > self.max_position_size:
            checks["errors"].append(
                f"Position size {position_fraction:.2%} exceeds limit {self.max_position_size:.2%}"
            )
            checks["passed"] = False

        # Check per-trade risk if stop loss provided
        if stop_loss and entry_price and entry_price != stop_loss:
            risk_per_share = abs(entry_price - stop_loss)
            shares = trade_size / entry_price if entry_price > 0 else 0
            total_risk = risk_per_share * shares
            risk_fraction = total_risk / equity if equity > 0 else 0

            if risk_fraction > self.per_trade_risk_cap:
                checks["errors"].append(
                    f"Trade risk {risk_fraction:.2%} exceeds cap {self.per_trade_risk_cap:.2%}"
                )
                checks["passed"] = False

        return checks

    def check_exposure_limits(
        self, current_positions: Dict[str, Position], new_trade_size: float = 0
    ) -> Dict[str, any]:
        """Check portfolio exposure limits.

        Args:
            current_positions: Dictionary of current positions
            new_trade_size: Size of new trade to add

        Returns:
            Dictionary with exposure check results
        """
        checks = {"passed": True, "warnings": [], "errors": []}

        # Calculate current exposure
        total_exposure = sum(abs(pos.market_value) for pos in current_positions.values())
        total_equity = sum(
            pos.market_value for pos in current_positions.values() if pos.market_value > 0
        )

        # Add new trade
        total_exposure += new_trade_size

        if total_equity > 0:
            exposure_ratio = total_exposure / total_equity

            if exposure_ratio > self.max_gross_exposure:
                checks["errors"].append(
                    f"Gross exposure {exposure_ratio:.2%} exceeds limit {self.max_gross_exposure:.2%}"
                )
                checks["passed"] = False

        return checks

    def check_daily_loss_limit(self, daily_pnl: float, equity: float) -> Dict[str, any]:
        """Check daily loss limits.

        Args:
            daily_pnl: Daily profit/loss
            equity: Current equity

        Returns:
            Dictionary with loss limit check results
        """
        checks = {"passed": True, "warnings": [], "errors": []}

        if equity > 0:
            loss_fraction = abs(daily_pnl) / equity if daily_pnl < 0 else 0

            if loss_fraction > self.daily_loss_limit:
                checks["errors"].append(
                    f"Daily loss {loss_fraction:.2%} exceeds limit {self.daily_loss_limit:.2%}"
                )
                checks["passed"] = False
            elif loss_fraction > self.daily_loss_limit * 0.8:
                checks["warnings"].append(
                    f"Daily loss {loss_fraction:.2%} approaching limit {self.daily_loss_limit:.2%}"
                )

        return checks

    def calculate_max_drawdown(self, equity_curve: pd.Series) -> float:
        """Calculate maximum drawdown from equity curve.

        Args:
            equity_curve: Series of equity values

        Returns:
            Maximum drawdown as decimal (e.g., 0.1 for 10%)
        """
        if len(equity_curve) < 2:
            return 0.0

        # Calculate running maximum
        running_max = equity_curve.expanding().max()

        # Calculate drawdown
        drawdown = (equity_curve - running_max) / running_max

        # Return maximum drawdown (as positive value)
        return abs(drawdown.min())

    def get_portfolio_health(
        self, positions: Dict[str, Position], equity_curve: pd.Series, recent_trades: List = None
    ) -> Dict[str, any]:
        """Get comprehensive portfolio health assessment.

        Args:
            positions: Current positions
            equity_curve: Historical equity curve
            recent_trades: Recent trades for analysis

        Returns:
            Dictionary with portfolio health metrics
        """
        health = {
            "overall_status": "healthy",
            "risk_score": 0,  # 0-100, higher is riskier
            "warnings": [],
            "errors": [],
        }

        # Check drawdown
        if len(equity_curve) > 1:
            current_dd = self.calculate_max_drawdown(equity_curve)
            if current_dd > self.max_drawdown:
                health["errors"].append(f"Drawdown {current_dd:.2%} exceeds limit")
                health["risk_score"] += 30
                health["overall_status"] = "critical"
            elif current_dd > self.max_drawdown * 0.8:
                health["warnings"].append(f"Drawdown {current_dd:.2%} approaching limit")
                health["risk_score"] += 15

        # Check concentration
        total_value = sum(abs(pos.market_value) for pos in positions.values())
        if total_value > 0:
            concentrations = [abs(pos.market_value) / total_value for pos in positions.values()]
            max_concentration = max(concentrations) if concentrations else 0

            if max_concentration > self.max_position_size:
                health["errors"].append(f"Position concentration {max_concentration:.2%} too high")
                health["risk_score"] += 20
            elif max_concentration > self.max_position_size * 0.8:
                health["warnings"].append("High position concentration")
                health["risk_score"] += 10

        # Check losing positions
        losing_positions = [pos for pos in positions.values() if pos.unrealized_pnl < 0]
        if len(losing_positions) > len(positions) * 0.7:  # More than 70% losing
            health["warnings"].append("High proportion of losing positions")
            health["risk_score"] += 15

        # Set overall status based on risk score
        if health["risk_score"] >= 50:
            health["overall_status"] = "critical"
        elif health["risk_score"] >= 25:
            health["overall_status"] = "warning"
        elif health["errors"]:
            health["overall_status"] = "critical"

        return health

    def get_position_health(self, position: Position) -> Dict[str, any]:
        """Get health metrics for a position.

        Args:
            position: Position to analyze

        Returns:
            Dictionary with health metrics
        """
        pnl_pct = position.pnl_percentage
        is_profitable = position.unrealized_pnl > 0

        # Determine health status
        if pnl_pct < -10:
            status = "critical"
        elif pnl_pct < -5:
            status = "warning"
        elif pnl_pct > 10:
            status = "excellent"
        elif pnl_pct > 5:
            status = "good"
        else:
            status = "normal"

        return {
            "symbol": position.symbol,
            "status": status,
            "pnl_percentage": pnl_pct,
            "unrealized_pnl": position.unrealized_pnl,
            "is_profitable": is_profitable,
            "market_value": position.market_value,
        }
