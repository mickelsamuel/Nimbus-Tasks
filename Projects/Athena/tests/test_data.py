"""Tests for data adapters."""

from pathlib import Path
from unittest.mock import patch

import pandas as pd
import pytest

from athena.data.yahoo import YahooDataAdapter


class TestYahooDataAdapter:
    """Test Yahoo Finance data adapter."""

    @pytest.fixture
    def adapter(self, tmp_path):
        """Create adapter with temporary cache directory."""
        return YahooDataAdapter(cache_dir=tmp_path)

    def test_initialization(self, tmp_path):
        """Test adapter initialization."""
        adapter = YahooDataAdapter(cache_dir=tmp_path)
        assert adapter.cache_dir == tmp_path
        assert adapter.cache_enabled is True

    def test_cache_path_generation(self, adapter):
        """Test cache path generation."""
        path = adapter._get_cache_path("AAPL", "2023-01-01", "2023-12-31", "1d")
        assert isinstance(path, Path)
        assert "AAPL" in str(path)
        assert "1d" in str(path)

    @patch("athena.data.yahoo.yf.Ticker")
    def test_fetch_from_yahoo(self, mock_ticker, adapter):
        """Test fetching data from Yahoo Finance."""
        # Mock Yahoo Finance response
        mock_history = pd.DataFrame(
            {
                "Open": [100, 101],
                "High": [102, 103],
                "Low": [99, 100],
                "Close": [101, 102],
                "Volume": [1000000, 1100000],
            },
            index=pd.date_range("2023-01-01", periods=2),
        )

        mock_ticker.return_value.history.return_value = mock_history

        df = adapter._fetch_from_yahoo("AAPL", "2023-01-01", "2023-01-02")

        assert isinstance(df, pd.DataFrame)
        assert len(df) == 2
        assert "close" in df.columns
        mock_ticker.assert_called_once_with("AAPL")

    def test_save_and_load_cache(self, adapter):
        """Test saving and loading from cache."""
        # Create sample data
        data = pd.DataFrame(
            {"close": [100, 101, 102], "volume": [1000, 1100, 1200]},
            index=pd.date_range("2023-01-01", periods=3),
        )

        cache_path = adapter.cache_dir / "test.parquet"

        # Save to cache
        adapter._save_to_cache(data, cache_path)
        assert cache_path.exists()

        # Load from cache
        loaded = adapter._load_from_cache(cache_path)
        assert loaded is not None
        pd.testing.assert_frame_equal(data, loaded)

    def test_clear_cache(self, adapter):
        """Test cache clearing."""
        # Create some cache files
        for i in range(3):
            cache_file = adapter.cache_dir / f"AAPL_{i}.parquet"
            cache_file.touch()

        # Clear all cache
        adapter.clear_cache()
        assert len(list(adapter.cache_dir.glob("*.parquet"))) == 0

    def test_clear_cache_by_symbol(self, adapter):
        """Test clearing cache for specific symbol."""
        # Create cache files for different symbols
        (adapter.cache_dir / "AAPL_1d_abc.parquet").touch()
        (adapter.cache_dir / "AAPL_1h_def.parquet").touch()
        (adapter.cache_dir / "MSFT_1d_ghi.parquet").touch()

        # Clear AAPL cache only
        adapter.clear_cache(symbol="AAPL")

        remaining = list(adapter.cache_dir.glob("*.parquet"))
        assert len(remaining) == 1
        assert "MSFT" in str(remaining[0])

    def test_get_cache_info(self, adapter):
        """Test cache info retrieval."""
        # Create cache files
        (adapter.cache_dir / "AAPL_1d_abc.parquet").write_text("test")
        (adapter.cache_dir / "MSFT_1d_def.parquet").write_text("test")

        info = adapter.get_cache_info()

        assert info["num_files"] == 2
        assert "AAPL" in info["symbols"]
        assert "MSFT" in info["symbols"]
        assert info["total_size_mb"] > 0
