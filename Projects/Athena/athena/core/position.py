"""Enhanced position sizing with multiple methods."""

from typing import Dict, Tuple

import numpy as np
import pandas as pd

from athena.core.config import settings
from athena.core.logging import get_logger

logger = get_logger(__name__)


class PositionSizer:
    """Advanced position sizing with multiple methods and risk controls."""

    def __init__(
        self,
        max_position_size: float = None,
        max_gross_exposure: float = 1.0,
        kelly_fraction_cap: float = 0.3,
        volatility_lookback: int = 20,
        min_position_value: float = 1000,
        max_leverage: float = 1.0,
    ):
        """Initialize position sizer.

        Args:
            max_position_size: Maximum position size as fraction of equity
            max_gross_exposure: Maximum gross exposure across all positions
            kelly_fraction_cap: Maximum Kelly fraction to use
            volatility_lookback: Days to look back for volatility calculation
            min_position_value: Minimum position value in currency units
            max_leverage: Maximum leverage allowed
        """
        self.max_position_size = max_position_size or settings.max_position_size
        self.max_gross_exposure = max_gross_exposure
        self.kelly_fraction_cap = kelly_fraction_cap
        self.volatility_lookback = volatility_lookback
        self.min_position_value = min_position_value
        self.max_leverage = max_leverage

    def fixed_fractional(
        self, equity: float, risk_per_trade: float = 0.02, current_exposure: float = 0.0
    ) -> float:
        """Calculate position size using fixed fractional method.

        Args:
            equity: Current account equity
            risk_per_trade: Risk per trade as fraction of equity
            current_exposure: Current total exposure

        Returns:
            Position size in currency units
        """
        # Check exposure limits
        if current_exposure >= self.max_gross_exposure * equity:
            logger.warning("Maximum gross exposure reached")
            return 0

        # Calculate base position size
        position_size = equity * risk_per_trade

        # Apply position size limit
        max_single_position = equity * self.max_position_size
        position_size = min(position_size, max_single_position)

        # Check remaining exposure capacity
        remaining_capacity = (self.max_gross_exposure * equity) - current_exposure
        position_size = min(position_size, remaining_capacity)

        # Apply minimum position size
        if position_size < self.min_position_value:
            return 0

        return max(0, position_size)

    def kelly_criterion(
        self,
        equity: float,
        win_probability: float,
        avg_win: float,
        avg_loss: float,
        current_exposure: float = 0.0,
        volatility_adjustment: float = 1.0,
    ) -> float:
        """Calculate position size using Kelly Criterion with safeguards.

        Args:
            equity: Current account equity
            win_probability: Historical win probability (0-1)
            avg_win: Average winning trade value
            avg_loss: Average losing trade value (positive number)
            current_exposure: Current total exposure
            volatility_adjustment: Adjustment factor for volatility

        Returns:
            Position size in currency units
        """
        if avg_loss <= 0 or win_probability <= 0:
            return 0

        # Check exposure limits
        if current_exposure >= self.max_gross_exposure * equity:
            return 0

        # Calculate Kelly fraction
        loss_probability = 1 - win_probability
        win_loss_ratio = avg_win / avg_loss

        # Kelly formula: f = (p*b - q) / b
        kelly_fraction = (win_probability * win_loss_ratio - loss_probability) / win_loss_ratio

        # Apply cap and volatility adjustment
        kelly_fraction = min(kelly_fraction, self.kelly_fraction_cap)
        kelly_fraction *= volatility_adjustment

        # Ensure non-negative
        kelly_fraction = max(0, kelly_fraction)

        # Calculate position size
        position_size = equity * kelly_fraction

        # Apply all standard limits
        max_single_position = equity * self.max_position_size
        position_size = min(position_size, max_single_position)

        remaining_capacity = (self.max_gross_exposure * equity) - current_exposure
        position_size = min(position_size, remaining_capacity)

        if position_size < self.min_position_value:
            return 0

        return position_size

    def volatility_adjusted(
        self,
        equity: float,
        price: float,
        returns: pd.Series,
        target_volatility: float = 0.2,
        current_exposure: float = 0.0,
    ) -> Tuple[float, int]:
        """Calculate position size based on target volatility.

        Args:
            equity: Current account equity
            price: Current asset price
            returns: Historical returns for volatility calculation
            target_volatility: Target portfolio volatility (annualized)
            current_exposure: Current total exposure

        Returns:
            Tuple of (position_value, num_shares)
        """
        if len(returns) < self.volatility_lookback:
            # Fallback to fixed fractional if insufficient data
            return self.fixed_fractional(equity, current_exposure=current_exposure), 0

        # Calculate realized volatility
        recent_returns = returns.tail(self.volatility_lookback)
        realized_vol = recent_returns.std() * np.sqrt(252)  # Annualized

        if realized_vol <= 0:
            return 0, 0

        # Check exposure limits
        if current_exposure >= self.max_gross_exposure * equity:
            return 0, 0

        # Calculate position size for target volatility
        vol_scalar = target_volatility / realized_vol
        position_size = equity * vol_scalar

        # Apply standard limits
        max_single_position = equity * self.max_position_size
        position_size = min(position_size, max_single_position)

        remaining_capacity = (self.max_gross_exposure * equity) - current_exposure
        position_size = min(position_size, remaining_capacity)

        if position_size < self.min_position_value:
            return 0, 0

        # Calculate number of shares
        num_shares = int(position_size / price) if price > 0 else 0

        return position_size, num_shares

    def atr_based(
        self,
        equity: float,
        price: float,
        atr: float,
        risk_per_trade: float = 0.02,
        stop_loss_atr_multiple: float = 2.0,
        current_exposure: float = 0.0,
    ) -> Tuple[float, int]:
        """Calculate position size based on Average True Range (ATR).

        Args:
            equity: Current account equity
            price: Current asset price
            atr: Current Average True Range
            risk_per_trade: Risk per trade as fraction of equity
            stop_loss_atr_multiple: ATR multiple for stop loss distance
            current_exposure: Current total exposure

        Returns:
            Tuple of (position_value, num_shares)
        """
        if atr <= 0 or price <= 0:
            return 0, 0

        # Check exposure limits
        if current_exposure >= self.max_gross_exposure * equity:
            return 0, 0

        # Calculate stop loss distance
        stop_distance = atr * stop_loss_atr_multiple

        # Calculate risk amount
        risk_amount = equity * risk_per_trade

        # Calculate position size based on stop loss
        num_shares = int(risk_amount / stop_distance)
        position_value = num_shares * price

        # Apply standard limits
        max_single_position = equity * self.max_position_size
        if position_value > max_single_position:
            position_value = max_single_position
            num_shares = int(position_value / price)

        remaining_capacity = (self.max_gross_exposure * equity) - current_exposure
        if position_value > remaining_capacity:
            position_value = remaining_capacity
            num_shares = int(position_value / price)

        if position_value < self.min_position_value:
            return 0, 0

        return position_value, num_shares

    def equal_weight(
        self, equity: float, num_positions: int, current_exposure: float = 0.0
    ) -> float:
        """Calculate equal weight position size.

        Args:
            equity: Current account equity
            num_positions: Number of positions to create
            current_exposure: Current total exposure

        Returns:
            Position size in currency units
        """
        if num_positions <= 0:
            return 0

        # Check exposure limits
        if current_exposure >= self.max_gross_exposure * equity:
            return 0

        # Calculate equal weight size
        target_allocation = self.max_gross_exposure / num_positions
        position_size = equity * target_allocation

        # Apply position size limit
        max_single_position = equity * self.max_position_size
        position_size = min(position_size, max_single_position)

        remaining_capacity = (self.max_gross_exposure * equity) - current_exposure
        position_size = min(position_size, remaining_capacity)

        if position_size < self.min_position_value:
            return 0

        return position_size

    def get_sizing_recommendation(
        self,
        equity: float,
        price: float,
        historical_data: Dict,
        current_exposure: float = 0.0,
        method: str = "kelly",
    ) -> Dict:
        """Get comprehensive position sizing recommendation.

        Args:
            equity: Current account equity
            price: Current asset price
            historical_data: Dictionary with historical metrics
            current_exposure: Current total exposure
            method: Primary sizing method to use

        Returns:
            Dictionary with sizing recommendations
        """
        recommendations = {
            "method": method,
            "equity": equity,
            "price": price,
            "current_exposure": current_exposure,
            "exposure_pct": current_exposure / equity if equity > 0 else 0,
        }

        # Fixed fractional
        fixed_size = self.fixed_fractional(equity, current_exposure=current_exposure)
        recommendations["fixed_fractional"] = {
            "position_size": fixed_size,
            "num_shares": int(fixed_size / price) if price > 0 else 0,
            "weight": fixed_size / equity if equity > 0 else 0,
        }

        # Kelly criterion (if we have trade history)
        if all(k in historical_data for k in ["win_rate", "avg_win", "avg_loss"]):
            kelly_size = self.kelly_criterion(
                equity=equity,
                win_probability=historical_data["win_rate"],
                avg_win=historical_data["avg_win"],
                avg_loss=historical_data["avg_loss"],
                current_exposure=current_exposure,
            )
            recommendations["kelly"] = {
                "position_size": kelly_size,
                "num_shares": int(kelly_size / price) if price > 0 else 0,
                "weight": kelly_size / equity if equity > 0 else 0,
            }

        # ATR-based (if we have ATR data)
        if "atr" in historical_data:
            atr_size, atr_shares = self.atr_based(
                equity=equity,
                price=price,
                atr=historical_data["atr"],
                current_exposure=current_exposure,
            )
            recommendations["atr_based"] = {
                "position_size": atr_size,
                "num_shares": atr_shares,
                "weight": atr_size / equity if equity > 0 else 0,
            }

        # Volatility adjusted (if we have returns)
        if "returns" in historical_data:
            vol_size, vol_shares = self.volatility_adjusted(
                equity=equity,
                price=price,
                returns=historical_data["returns"],
                current_exposure=current_exposure,
            )
            recommendations["volatility_adjusted"] = {
                "position_size": vol_size,
                "num_shares": vol_shares,
                "weight": vol_size / equity if equity > 0 else 0,
            }

        # Select primary recommendation
        if method in recommendations:
            recommendations["recommended"] = recommendations[method]
        else:
            recommendations["recommended"] = recommendations["fixed_fractional"]

        # Risk checks
        recommendations["risk_checks"] = self._perform_risk_checks(
            recommendations["recommended"], equity, current_exposure
        )

        return recommendations

    def _perform_risk_checks(
        self, position_rec: Dict, equity: float, current_exposure: float
    ) -> Dict:
        """Perform risk checks on position recommendation.

        Args:
            position_rec: Position recommendation
            equity: Current equity
            current_exposure: Current exposure

        Returns:
            Dictionary with risk check results
        """
        checks = {"passed": True, "warnings": [], "errors": []}

        position_size = position_rec["position_size"]
        position_weight = position_rec["weight"]

        # Check position size limit
        if position_weight > self.max_position_size:
            checks["errors"].append(
                f"Position exceeds max size: {position_weight:.2%} > {self.max_position_size:.2%}"
            )
            checks["passed"] = False

        # Check total exposure
        new_exposure = current_exposure + position_size
        exposure_pct = new_exposure / equity if equity > 0 else 0

        if exposure_pct > self.max_gross_exposure:
            checks["errors"].append(
                f"Total exposure exceeds limit: {exposure_pct:.2%} > {self.max_gross_exposure:.2%}"
            )
            checks["passed"] = False

        # Check minimum position size
        if 0 < position_size < self.min_position_value:
            checks["warnings"].append(
                f"Position below minimum: ${position_size:.2f} < ${self.min_position_value:.2f}"
            )

        # Check leverage
        if exposure_pct > self.max_leverage:
            checks["warnings"].append(f"High leverage: {exposure_pct:.2%}")

        return checks
