"""Simple Moving Average (SMA) Crossover Strategy."""

from typing import Dict, Tuple

import pandas as pd

from athena.core.logging import get_logger
from athena.strategies.base import BaseStrategy

logger = get_logger(__name__)


class SMACrossoverStrategy(BaseStrategy):
    """SMA Crossover Strategy using fast and slow moving averages."""

    def __init__(self, fast_period: int = 20, slow_period: int = 50, name: str = "SMA_Crossover"):
        """Initialize SMA Crossover strategy.

        Args:
            fast_period: Period for fast SMA
            slow_period: Period for slow SMA
            name: Strategy name
        """
        super().__init__(name=name)

        if fast_period >= slow_period:
            raise ValueError("Fast period must be less than slow period")

        self.fast_period = fast_period
        self.slow_period = slow_period

        self.params = {"fast_period": fast_period, "slow_period": slow_period}

    def calculate_sma(self, data: pd.Series, period: int) -> pd.Series:
        """Calculate Simple Moving Average.

        Args:
            data: Price series
            period: SMA period

        Returns:
            SMA series
        """
        return data.rolling(window=period, min_periods=period).mean()

    def generate_signals(self, data: pd.DataFrame) -> pd.Series:
        """Generate trading signals based on SMA crossover.

        Args:
            data: OHLCV data with datetime index

        Returns:
            Series with signals: 1 for buy, -1 for sell, 0 for hold
        """
        # Prepare data
        data = self.prepare_data(data)

        # Calculate SMAs
        close_prices = data["close"]
        fast_sma = self.calculate_sma(close_prices, self.fast_period)
        slow_sma = self.calculate_sma(close_prices, self.slow_period)

        # Generate raw signals
        signals = pd.Series(index=data.index, data=0)

        # Buy signal: fast SMA crosses above slow SMA
        # Sell signal: fast SMA crosses below slow SMA
        for i in range(1, len(data)):
            if pd.isna(fast_sma.iloc[i]) or pd.isna(slow_sma.iloc[i]):
                continue

            # Previous values
            prev_fast = fast_sma.iloc[i - 1]
            prev_slow = slow_sma.iloc[i - 1]

            # Current values
            curr_fast = fast_sma.iloc[i]
            curr_slow = slow_sma.iloc[i]

            # Check for crossover
            if pd.notna(prev_fast) and pd.notna(prev_slow):
                # Bullish crossover (golden cross)
                if prev_fast <= prev_slow and curr_fast > curr_slow:
                    signals.iloc[i] = 1
                    logger.debug(
                        f"Buy signal at {data.index[i]}: "
                        f"Fast SMA ({curr_fast:.2f}) crossed above Slow SMA ({curr_slow:.2f})"
                    )

                # Bearish crossover (death cross)
                elif prev_fast >= prev_slow and curr_fast < curr_slow:
                    signals.iloc[i] = -1
                    logger.debug(
                        f"Sell signal at {data.index[i]}: "
                        f"Fast SMA ({curr_fast:.2f}) crossed below Slow SMA ({curr_slow:.2f})"
                    )

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

        # Calculate SMAs
        result[f"sma_{self.fast_period}"] = self.calculate_sma(data["close"], self.fast_period)
        result[f"sma_{self.slow_period}"] = self.calculate_sma(data["close"], self.slow_period)

        # Add signals
        result["signal"] = self.generate_signals(data)

        return result

    def validate_parameters(self) -> bool:
        """Validate strategy parameters.

        Returns:
            True if parameters are valid
        """
        if self.fast_period <= 0:
            logger.error(f"Fast period must be positive: {self.fast_period}")
            return False

        if self.slow_period <= 0:
            logger.error(f"Slow period must be positive: {self.slow_period}")
            return False

        if self.fast_period >= self.slow_period:
            logger.error(
                f"Fast period ({self.fast_period}) must be less than "
                f"slow period ({self.slow_period})"
            )
            return False

        return True

    def optimize_parameters(
        self,
        data: pd.DataFrame,
        fast_range: Tuple[int, int] = (10, 30),
        slow_range: Tuple[int, int] = (40, 100),
        metric: str = "sharpe",
    ) -> Dict:
        """Optimize strategy parameters (placeholder for Optuna integration).

        Args:
            data: Historical data for optimization
            fast_range: Range for fast period
            slow_range: Range for slow period
            metric: Optimization metric

        Returns:
            Optimal parameters
        """
        # This is a placeholder - actual implementation would use Optuna
        logger.info(
            f"Parameter optimization placeholder - "
            f"would optimize {metric} over fast {fast_range}, slow {slow_range}"
        )

        return {"fast_period": self.fast_period, "slow_period": self.slow_period}
