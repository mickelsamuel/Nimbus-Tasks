"""Broker implementations for live trading."""

from athena.live.brokers.base import BaseBroker, BrokerConfig
from athena.live.brokers.alpaca import AlpacaBroker
from athena.live.brokers.binance import BinanceBroker
from athena.live.brokers.ib import InteractiveBroker

__all__ = [
    "BaseBroker",
    "BrokerConfig",
    "AlpacaBroker",
    "BinanceBroker",
    "InteractiveBroker",
]

BROKER_REGISTRY = {
    "alpaca": AlpacaBroker,
    "binance": BinanceBroker,
    "ib": InteractiveBroker,
    "interactive": InteractiveBroker,
}