"""Bollinger Bands mean reversion strategy."""

from typing import Dict, Tuple

import numpy as np
import pandas as pd

from athena.core.logging import get_logger
from athena.strategies.base import BaseStrategy

logger = get_logger(__name__)


class BollingerBandsStrategy(BaseStrategy):
    """Bollinger Bands strategy with RSI confirmation."""

    def __init__(
        self,
        period: int = 20,
        std_dev: float = 2.0,
        rsi_period: int = 14,
        rsi_oversold: float = 30,
        rsi_overbought: float = 70,
        name: str = "Bollinger_Bands",
    ):
        """Initialize Bollinger Bands strategy.

        Args:
            period: Period for moving average and bands
            std_dev: Number of standard deviations for bands
            rsi_period: Period for RSI calculation
            rsi_oversold: RSI oversold threshold
            rsi_overbought: RSI overbought threshold
            name: Strategy name
        """
        super().__init__(name=name)

        self.period = period
        self.std_dev = std_dev
        self.rsi_period = rsi_period
        self.rsi_oversold = rsi_oversold
        self.rsi_overbought = rsi_overbought

        self.params = {
            "period": period,
            "std_dev": std_dev,
            "rsi_period": rsi_period,
            "rsi_oversold": rsi_oversold,
            "rsi_overbought": rsi_overbought,
        }

    def calculate_bollinger_bands(
        self, prices: pd.Series
    ) -> Tuple[pd.Series, pd.Series, pd.Series]:
        """Calculate Bollinger Bands.

        Args:
            prices: Price series

        Returns:
            Tuple of (upper_band, middle_band, lower_band)
        """
        middle_band = prices.rolling(window=self.period, min_periods=self.period).mean()
        std = prices.rolling(window=self.period, min_periods=self.period).std()

        upper_band = middle_band + (std * self.std_dev)
        lower_band = middle_band - (std * self.std_dev)

        return upper_band, middle_band, lower_band

    def calculate_rsi(self, prices: pd.Series) -> pd.Series:
        """Calculate Relative Strength Index (RSI).

        Args:
            prices: Price series

        Returns:
            RSI series
        """
        delta = prices.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=self.rsi_period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=self.rsi_period).mean()

        # Avoid division by zero
        rs = gain / loss.replace(0, np.nan)
        rsi = 100 - (100 / (1 + rs))

        return rsi

    def calculate_percent_b(
        self, prices: pd.Series, upper_band: pd.Series, lower_band: pd.Series
    ) -> pd.Series:
        """Calculate %B indicator (position within bands).

        Args:
            prices: Price series
            upper_band: Upper Bollinger Band
            lower_band: Lower Bollinger Band

        Returns:
            %B series
        """
        band_width = upper_band - lower_band
        percent_b = (prices - lower_band) / band_width.replace(0, np.nan)
        return percent_b

    def generate_signals(self, data: pd.DataFrame) -> pd.Series:
        """Generate trading signals based on Bollinger Bands and RSI.

        Strategy Logic:
        - Buy: Price touches lower band AND RSI < oversold threshold
        - Sell: Price touches upper band AND RSI > overbought threshold
        - Exit: Price crosses middle band (mean reversion)

        Args:
            data: OHLCV data with datetime index

        Returns:
            Series with signals: 1 for buy, -1 for sell, 0 for hold
        """
        # Prepare data
        data = self.prepare_data(data)
        close_prices = data["close"]

        # Calculate indicators
        upper_band, middle_band, lower_band = self.calculate_bollinger_bands(close_prices)
        rsi = self.calculate_rsi(close_prices)
        percent_b = self.calculate_percent_b(close_prices, upper_band, lower_band)

        # Initialize signals
        signals = pd.Series(index=data.index, data=0)

        # Track position state
        position = 0  # 0: no position, 1: long, -1: short

        for i in range(1, len(data)):
            current_price = close_prices.iloc[i]
            current_rsi = rsi.iloc[i]
            current_percent_b = percent_b.iloc[i]

            # Skip if indicators not ready
            if pd.isna(current_rsi) or pd.isna(current_percent_b):
                continue

            # Previous values for trend detection
            prev_price = close_prices.iloc[i - 1]
            prev_percent_b = percent_b.iloc[i - 1]

            # Entry signals
            if position == 0:
                # Buy signal: Price near lower band + RSI oversold
                if (
                    current_percent_b <= 0.1  # Near or below lower band
                    and current_rsi <= self.rsi_oversold
                    and current_price > prev_price
                ):  # Price starting to recover

                    signals.iloc[i] = 1
                    position = 1
                    logger.debug(
                        f"Buy signal at {data.index[i]}: "
                        f"Price={current_price:.2f}, %B={current_percent_b:.2f}, RSI={current_rsi:.1f}"
                    )

                # Sell signal: Price near upper band + RSI overbought
                elif (
                    current_percent_b >= 0.9  # Near or above upper band
                    and current_rsi >= self.rsi_overbought
                    and current_price < prev_price
                ):  # Price starting to decline

                    signals.iloc[i] = -1
                    position = -1
                    logger.debug(
                        f"Sell signal at {data.index[i]}: "
                        f"Price={current_price:.2f}, %B={current_percent_b:.2f}, RSI={current_rsi:.1f}"
                    )

            # Exit signals (mean reversion)
            elif position == 1:  # Long position
                # Exit long: Price crosses above middle band or RSI becomes overbought
                if (
                    current_percent_b >= 0.5 and prev_percent_b < 0.5
                ) or current_rsi >= self.rsi_overbought:
                    signals.iloc[i] = -1  # Close long
                    position = 0
                    logger.debug(f"Exit long at {data.index[i]}: mean reversion")

            elif position == -1:  # Short position
                # Exit short: Price crosses below middle band or RSI becomes oversold
                if (
                    current_percent_b <= 0.5 and prev_percent_b > 0.5
                ) or current_rsi <= self.rsi_oversold:
                    signals.iloc[i] = 1  # Close short
                    position = 0
                    logger.debug(f"Exit short at {data.index[i]}: mean reversion")

        return signals

    def get_indicators(self, data: pd.DataFrame) -> pd.DataFrame:
        """Calculate and return all indicators used by the strategy.

        Args:
            data: OHLCV data

        Returns:
            DataFrame with original data and indicators
        """
        data = self.prepare_data(data)
        result = data.copy()
        close_prices = data["close"]

        # Calculate all indicators
        upper_band, middle_band, lower_band = self.calculate_bollinger_bands(close_prices)
        rsi = self.calculate_rsi(close_prices)
        percent_b = self.calculate_percent_b(close_prices, upper_band, lower_band)

        # Add to result
        result["bb_upper"] = upper_band
        result["bb_middle"] = middle_band
        result["bb_lower"] = lower_band
        result["rsi"] = rsi
        result["percent_b"] = percent_b
        result["bb_width"] = (upper_band - lower_band) / middle_band  # Band width as % of middle

        # Add signals
        result["signal"] = self.generate_signals(data)

        return result

    def validate_parameters(self) -> bool:
        """Validate strategy parameters.

        Returns:
            True if parameters are valid
        """
        if self.period <= 0:
            logger.error(f"Period must be positive: {self.period}")
            return False

        if self.std_dev <= 0:
            logger.error(f"Standard deviation must be positive: {self.std_dev}")
            return False

        if self.rsi_period <= 0:
            logger.error(f"RSI period must be positive: {self.rsi_period}")
            return False

        if not 0 < self.rsi_oversold < self.rsi_overbought < 100:
            logger.error(
                f"RSI thresholds invalid: oversold={self.rsi_oversold}, "
                f"overbought={self.rsi_overbought}"
            )
            return False

        return True

    def get_risk_metrics(self, data: pd.DataFrame) -> Dict:
        """Get risk-related metrics for the strategy.

        Args:
            data: OHLCV data

        Returns:
            Dictionary with risk metrics
        """
        indicators = self.get_indicators(data)

        # Calculate volatility regime
        bb_width = indicators["bb_width"].dropna()
        volatility_regime = "normal"

        if len(bb_width) > 0:
            width_percentile = bb_width.iloc[-1] / bb_width.quantile(0.5)
            if width_percentile > 1.5:
                volatility_regime = "high"
            elif width_percentile < 0.5:
                volatility_regime = "low"

        # Count squeeze periods (low volatility)
        squeeze_periods = (bb_width < bb_width.quantile(0.2)).sum() if len(bb_width) > 0 else 0

        return {
            "volatility_regime": volatility_regime,
            "current_bb_width": bb_width.iloc[-1] if len(bb_width) > 0 else None,
            "squeeze_periods": squeeze_periods,
            "avg_bb_width": bb_width.mean() if len(bb_width) > 0 else None,
        }
