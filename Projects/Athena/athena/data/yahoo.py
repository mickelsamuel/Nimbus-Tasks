"""Yahoo Finance data adapter with local parquet cache."""

import hashlib
from pathlib import Path
from typing import Optional

import pandas as pd
import yfinance as yf
from tenacity import retry, stop_after_attempt, wait_exponential

from athena.core.config import settings
from athena.core.logging import get_logger

logger = get_logger(__name__)


class YahooDataAdapter:
    """Yahoo Finance data adapter with caching support."""

    def __init__(self, cache_dir: Optional[Path] = None):
        """Initialize the adapter.

        Args:
            cache_dir: Directory for caching data. Uses settings default if None.
        """
        self.cache_dir = cache_dir or settings.data_dir
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.cache_enabled = settings.cache_enabled

    def _get_cache_path(self, symbol: str, start: str, end: str, interval: str = "1d") -> Path:
        """Generate cache file path based on parameters.

        Args:
            symbol: Stock symbol
            start: Start date
            end: End date
            interval: Data interval

        Returns:
            Path to cache file
        """
        # Create unique hash for the request
        params_str = f"{symbol}_{start}_{end}_{interval}"
        hash_digest = hashlib.md5(params_str.encode()).hexdigest()[:8]
        filename = f"{symbol}_{interval}_{hash_digest}.parquet"
        return self.cache_dir / filename

    def _load_from_cache(self, cache_path: Path) -> Optional[pd.DataFrame]:
        """Load data from cache if available and valid.

        Args:
            cache_path: Path to cache file

        Returns:
            Cached DataFrame or None if not available
        """
        if not self.cache_enabled or not cache_path.exists():
            return None

        try:
            df = pd.read_parquet(cache_path)
            logger.info("Data loaded from cache", path=str(cache_path))
            return df
        except Exception as e:
            logger.warning("Failed to load cache", path=str(cache_path), error=str(e))
            return None

    def _save_to_cache(self, df: pd.DataFrame, cache_path: Path) -> None:
        """Save DataFrame to cache.

        Args:
            df: DataFrame to cache
            cache_path: Path to cache file
        """
        if not self.cache_enabled:
            return

        try:
            df.to_parquet(cache_path, compression="snappy")
            logger.info("Data saved to cache", path=str(cache_path))
        except Exception as e:
            logger.warning("Failed to save cache", path=str(cache_path), error=str(e))

    @retry(
        stop=stop_after_attempt(settings.yf_max_retries),
        wait=wait_exponential(multiplier=settings.yf_retry_delay, min=1, max=10),
    )
    def _fetch_from_yahoo(
        self, symbol: str, start: str, end: str, interval: str = "1d", auto_adjust: bool = True
    ) -> pd.DataFrame:
        """Fetch data from Yahoo Finance with retry logic.

        Args:
            symbol: Stock symbol
            start: Start date
            end: End date
            interval: Data interval
            auto_adjust: Auto-adjust for splits/dividends

        Returns:
            DataFrame with OHLCV data
        """
        logger.info(
            "Fetching data from Yahoo Finance",
            symbol=symbol,
            start=start,
            end=end,
            interval=interval,
        )

        ticker = yf.Ticker(symbol)
        df = ticker.history(start=start, end=end, interval=interval, auto_adjust=auto_adjust)

        if df.empty:
            raise ValueError(f"No data available for {symbol} from {start} to {end}")

        # Standardize column names
        df.columns = [col.lower() for col in df.columns]

        # Ensure datetime index
        df.index = pd.to_datetime(df.index)
        df.index.name = "date"

        return df

    def fetch(
        self, symbol: str, start: str, end: str, interval: str = "1d", force_refresh: bool = False
    ) -> pd.DataFrame:
        """Fetch historical data with caching.

        Args:
            symbol: Stock symbol (e.g., "AAPL", "SPY")
            start: Start date (YYYY-MM-DD format)
            end: End date (YYYY-MM-DD format)
            interval: Data interval (1d, 1h, 5m, etc.)
            force_refresh: Force refresh from Yahoo, ignore cache

        Returns:
            DataFrame with OHLCV data

        Raises:
            ValueError: If no data available
        """
        # Convert dates to ensure consistent format
        start_dt = pd.to_datetime(start).strftime("%Y-%m-%d")
        end_dt = pd.to_datetime(end).strftime("%Y-%m-%d")

        # Check cache first
        cache_path = self._get_cache_path(symbol, start_dt, end_dt, interval)

        if not force_refresh:
            cached_data = self._load_from_cache(cache_path)
            if cached_data is not None:
                return cached_data

        # Fetch from Yahoo
        df = self._fetch_from_yahoo(symbol, start_dt, end_dt, interval)

        # Save to cache
        self._save_to_cache(df, cache_path)

        return df

    def fetch_multiple(
        self, symbols: list, start: str, end: str, interval: str = "1d", force_refresh: bool = False
    ) -> dict:
        """Fetch data for multiple symbols.

        Args:
            symbols: List of stock symbols
            start: Start date
            end: End date
            interval: Data interval
            force_refresh: Force refresh from Yahoo

        Returns:
            Dictionary mapping symbols to DataFrames
        """
        data = {}
        for symbol in symbols:
            try:
                data[symbol] = self.fetch(
                    symbol=symbol,
                    start=start,
                    end=end,
                    interval=interval,
                    force_refresh=force_refresh,
                )
                logger.info(f"Successfully fetched data for {symbol}")
            except Exception as e:
                logger.error(f"Failed to fetch data for {symbol}: {e}")
                continue

        return data

    def clear_cache(self, symbol: Optional[str] = None) -> None:
        """Clear cache for a specific symbol or all cached data.

        Args:
            symbol: Specific symbol to clear, or None for all
        """
        if symbol:
            pattern = f"{symbol}_*.parquet"
            files = list(self.cache_dir.glob(pattern))
            for file in files:
                file.unlink()
                logger.info(f"Removed cache file: {file}")
        else:
            files = list(self.cache_dir.glob("*.parquet"))
            for file in files:
                file.unlink()
            logger.info(f"Cleared {len(files)} cache files")

    def get_cache_info(self) -> dict:
        """Get information about cached data.

        Returns:
            Dictionary with cache statistics
        """
        cache_files = list(self.cache_dir.glob("*.parquet"))
        total_size = sum(f.stat().st_size for f in cache_files) / (1024 * 1024)  # MB

        symbols = set()
        for f in cache_files:
            parts = f.stem.split("_")
            if parts:
                symbols.add(parts[0])

        return {
            "cache_dir": str(self.cache_dir),
            "num_files": len(cache_files),
            "total_size_mb": round(total_size, 2),
            "symbols": list(symbols),
        }
