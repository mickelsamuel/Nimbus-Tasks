"""Momentum strategy using RSI and MACD indicators."""

from typing import Dict, Tuple

import numpy as np
import pandas as pd

from athena.core.logging import get_logger
from athena.strategies.base import BaseStrategy

logger = get_logger(__name__)


class MomentumStrategy(BaseStrategy):
    """Momentum strategy using RSI and MACD for trend following."""

    def __init__(
        self,
        rsi_period: int = 14,
        rsi_overbought: float = 70,
        rsi_oversold: float = 30,
        macd_fast: int = 12,
        macd_slow: int = 26,
        macd_signal: int = 9,
        trend_filter: bool = True,
        name: str = "Momentum",
    ):
        """Initialize Momentum strategy.

        Args:
            rsi_period: Period for RSI calculation
            rsi_overbought: RSI overbought threshold
            rsi_oversold: RSI oversold threshold
            macd_fast: Fast EMA period for MACD
            macd_slow: Slow EMA period for MACD
            macd_signal: Signal line EMA period for MACD
            trend_filter: Whether to use trend filter
            name: Strategy name
        """
        super().__init__(name=name)

        self.rsi_period = rsi_period
        self.rsi_overbought = rsi_overbought
        self.rsi_oversold = rsi_oversold
        self.macd_fast = macd_fast
        self.macd_slow = macd_slow
        self.macd_signal = macd_signal
        self.trend_filter = trend_filter

        self.params = {
            "rsi_period": rsi_period,
            "rsi_overbought": rsi_overbought,
            "rsi_oversold": rsi_oversold,
            "macd_fast": macd_fast,
            "macd_slow": macd_slow,
            "macd_signal": macd_signal,
            "trend_filter": trend_filter,
        }

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

    def calculate_ema(self, prices: pd.Series, period: int) -> pd.Series:
        """Calculate Exponential Moving Average (EMA).

        Args:
            prices: Price series
            period: EMA period

        Returns:
            EMA series
        """
        return prices.ewm(span=period, adjust=False).mean()

    def calculate_macd(self, prices: pd.Series) -> Tuple[pd.Series, pd.Series, pd.Series]:
        """Calculate MACD (Moving Average Convergence Divergence).

        Args:
            prices: Price series

        Returns:
            Tuple of (macd_line, signal_line, histogram)
        """
        ema_fast = self.calculate_ema(prices, self.macd_fast)
        ema_slow = self.calculate_ema(prices, self.macd_slow)

        macd_line = ema_fast - ema_slow
        signal_line = self.calculate_ema(macd_line, self.macd_signal)
        histogram = macd_line - signal_line

        return macd_line, signal_line, histogram

    def calculate_trend_filter(self, prices: pd.Series, period: int = 50) -> pd.Series:
        """Calculate trend filter using simple moving average.

        Args:
            prices: Price series
            period: Period for trend filter

        Returns:
            Trend direction series (1 for uptrend, -1 for downtrend)
        """
        sma = prices.rolling(window=period, min_periods=period).mean()
        trend = pd.Series(index=prices.index, data=0)

        trend[prices > sma] = 1  # Uptrend
        trend[prices < sma] = -1  # Downtrend

        return trend

    def generate_signals(self, data: pd.DataFrame) -> pd.Series:
        """Generate trading signals based on RSI and MACD momentum.

        Strategy Logic:
        - Buy: RSI crossing above oversold AND MACD bullish crossover (AND uptrend if filter enabled)
        - Sell: RSI crossing below overbought AND MACD bearish crossover (AND downtrend if filter enabled)
        - Hold: No clear momentum signal

        Args:
            data: OHLCV data with datetime index

        Returns:
            Series with signals: 1 for buy, -1 for sell, 0 for hold
        """
        # Prepare data
        data = self.prepare_data(data)
        close_prices = data["close"]

        # Calculate indicators
        rsi = self.calculate_rsi(close_prices)
        macd_line, signal_line, histogram = self.calculate_macd(close_prices)

        # Calculate trend filter if enabled
        if self.trend_filter:
            trend = self.calculate_trend_filter(close_prices)
        else:
            trend = pd.Series(index=data.index, data=1)  # Always bullish

        # Initialize signals
        signals = pd.Series(index=data.index, data=0)

        for i in range(1, len(data)):
            current_rsi = rsi.iloc[i]
            prev_rsi = rsi.iloc[i - 1]

            current_macd = macd_line.iloc[i]
            current_signal = signal_line.iloc[i]
            prev_macd = macd_line.iloc[i - 1]
            prev_signal = signal_line.iloc[i - 1]

            current_trend = trend.iloc[i]

            # Skip if indicators not ready
            if any(pd.isna(x) for x in [current_rsi, current_macd, current_signal]):
                continue

            # RSI momentum signals
            rsi_bullish = (
                prev_rsi <= self.rsi_oversold and current_rsi > self.rsi_oversold
            )  # RSI crossing above oversold

            rsi_bearish = (
                prev_rsi >= self.rsi_overbought and current_rsi < self.rsi_overbought
            )  # RSI crossing below overbought

            # MACD momentum signals
            macd_bullish = (
                prev_macd <= prev_signal and current_macd > current_signal
            )  # MACD crossing above signal

            macd_bearish = (
                prev_macd >= prev_signal and current_macd < current_signal
            )  # MACD crossing below signal

            # Combined momentum signals
            if self.trend_filter:
                # Buy: Bullish momentum + uptrend
                if rsi_bullish and macd_bullish and current_trend > 0:
                    signals.iloc[i] = 1
                    logger.debug(
                        f"Buy signal at {data.index[i]}: "
                        f"RSI={current_rsi:.1f}, MACD={current_macd:.4f}, "
                        f"Signal={current_signal:.4f}, Trend=UP"
                    )

                # Sell: Bearish momentum + downtrend
                elif rsi_bearish and macd_bearish and current_trend < 0:
                    signals.iloc[i] = -1
                    logger.debug(
                        f"Sell signal at {data.index[i]}: "
                        f"RSI={current_rsi:.1f}, MACD={current_macd:.4f}, "
                        f"Signal={current_signal:.4f}, Trend=DOWN"
                    )
            else:
                # Buy: Bullish momentum (no trend filter)
                if rsi_bullish and macd_bullish:
                    signals.iloc[i] = 1
                    logger.debug(
                        f"Buy signal at {data.index[i]}: "
                        f"RSI={current_rsi:.1f}, MACD bullish crossover"
                    )

                # Sell: Bearish momentum (no trend filter)
                elif rsi_bearish and macd_bearish:
                    signals.iloc[i] = -1
                    logger.debug(
                        f"Sell signal at {data.index[i]}: "
                        f"RSI={current_rsi:.1f}, MACD bearish crossover"
                    )

            # Additional exit conditions based on extreme RSI levels
            if current_rsi >= 90:  # Extreme overbought
                signals.iloc[i] = -1
            elif current_rsi <= 10:  # Extreme oversold
                signals.iloc[i] = 1

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
        rsi = self.calculate_rsi(close_prices)
        macd_line, signal_line, histogram = self.calculate_macd(close_prices)

        # Add to result
        result["rsi"] = rsi
        result["macd"] = macd_line
        result["macd_signal"] = signal_line
        result["macd_histogram"] = histogram

        if self.trend_filter:
            result["trend"] = self.calculate_trend_filter(close_prices)

        # Add momentum indicators
        result["rsi_momentum"] = rsi.diff()  # Rate of change in RSI
        result["macd_momentum"] = histogram.diff()  # Rate of change in MACD histogram

        # Add signals
        result["signal"] = self.generate_signals(data)

        return result

    def validate_parameters(self) -> bool:
        """Validate strategy parameters.

        Returns:
            True if parameters are valid
        """
        if self.rsi_period <= 0:
            logger.error(f"RSI period must be positive: {self.rsi_period}")
            return False

        if not 0 < self.rsi_oversold < self.rsi_overbought < 100:
            logger.error(
                f"RSI thresholds invalid: oversold={self.rsi_oversold}, "
                f"overbought={self.rsi_overbought}"
            )
            return False

        if self.macd_fast <= 0 or self.macd_slow <= 0 or self.macd_signal <= 0:
            logger.error("MACD periods must be positive")
            return False

        if self.macd_fast >= self.macd_slow:
            logger.error(
                f"MACD fast period ({self.macd_fast}) must be less than "
                f"slow period ({self.macd_slow})"
            )
            return False

        return True

    def get_momentum_strength(self, data: pd.DataFrame) -> Dict:
        """Calculate momentum strength metrics.

        Args:
            data: OHLCV data

        Returns:
            Dictionary with momentum strength metrics
        """
        indicators = self.get_indicators(data)

        # Get recent values
        recent_rsi = indicators["rsi"].dropna().tail(10)
        recent_macd = indicators["macd_histogram"].dropna().tail(10)

        if len(recent_rsi) == 0 or len(recent_macd) == 0:
            return {"momentum_strength": "unknown"}

        # Calculate momentum metrics
        rsi_momentum = recent_rsi.diff().mean()
        macd_momentum = recent_macd.diff().mean()

        # Determine overall momentum
        if rsi_momentum > 2 and macd_momentum > 0:
            strength = "strong_bullish"
        elif rsi_momentum > 0 and macd_momentum > 0:
            strength = "moderate_bullish"
        elif rsi_momentum < -2 and macd_momentum < 0:
            strength = "strong_bearish"
        elif rsi_momentum < 0 and macd_momentum < 0:
            strength = "moderate_bearish"
        else:
            strength = "neutral"

        return {
            "momentum_strength": strength,
            "rsi_momentum": rsi_momentum,
            "macd_momentum": macd_momentum,
            "current_rsi": recent_rsi.iloc[-1],
            "current_macd_histogram": recent_macd.iloc[-1],
        }
