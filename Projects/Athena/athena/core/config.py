"""Configuration management using pydantic-settings."""

from pathlib import Path
from typing import Optional

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings with validation and type hints."""

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=False
    )

    # Environment
    env: str = Field(
        default="development", description="Environment (development/staging/production)"
    )
    log_level: str = Field(default="INFO", description="Logging level")

    # Data settings
    data_dir: Path = Field(default=Path("./data_cache"), description="Directory for data cache")
    cache_enabled: bool = Field(default=True, description="Enable data caching")

    # Yahoo Finance settings
    yf_max_retries: int = Field(default=3, description="Max retries for Yahoo Finance API")
    yf_retry_delay: float = Field(default=1.0, description="Delay between retries (seconds)")

    # Backtest settings
    default_initial_capital: float = Field(
        default=100000, description="Default initial capital for backtests"
    )
    default_commission: float = Field(default=0.001, description="Default commission rate")

    # Risk management
    max_position_size: float = Field(
        default=0.2, description="Maximum position size as fraction of portfolio"
    )
    kelly_fraction: float = Field(default=0.25, description="Fraction of Kelly criterion to use")

    # Dashboard
    dashboard_host: str = Field(default="0.0.0.0", description="Dashboard host")
    dashboard_port: int = Field(default=8050, description="Dashboard port")
    dashboard_debug: bool = Field(default=False, description="Dashboard debug mode")

    # Paper trading (Binance testnet)
    binance_testnet_api_key: Optional[str] = Field(
        default=None, description="Binance testnet API key"
    )
    binance_testnet_secret_key: Optional[str] = Field(
        default=None, description="Binance testnet secret key"
    )
    binance_testnet_url: str = Field(
        default="https://testnet.binance.vision", description="Binance testnet URL"
    )

    # Database
    database_url: str = Field(default="sqlite:///./athena.db", description="Database URL")

    @field_validator("env")
    @classmethod
    def validate_env(cls, v: str) -> str:
        """Validate environment value."""
        valid_envs = ["development", "staging", "production"]
        if v not in valid_envs:
            raise ValueError(f"env must be one of {valid_envs}")
        return v

    @field_validator("log_level")
    @classmethod
    def validate_log_level(cls, v: str) -> str:
        """Validate log level."""
        valid_levels = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
        v = v.upper()
        if v not in valid_levels:
            raise ValueError(f"log_level must be one of {valid_levels}")
        return v

    @field_validator("max_position_size", "kelly_fraction")
    @classmethod
    def validate_fraction(cls, v: float) -> float:
        """Validate fraction values are between 0 and 1."""
        if not 0 < v <= 1:
            raise ValueError("Fraction must be between 0 and 1")
        return v

    def ensure_data_dir(self) -> None:
        """Ensure data directory exists."""
        self.data_dir.mkdir(parents=True, exist_ok=True)


# Global settings instance
settings = Settings()
