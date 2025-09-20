"""Prometheus metrics exporter for Athena trading system."""

import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from threading import Thread
import asyncio

try:
    from prometheus_client import (
        Counter, Histogram, Gauge, Info, Enum,
        start_http_server, CollectorRegistry, REGISTRY
    )
    PROMETHEUS_AVAILABLE = True
except ImportError:
    PROMETHEUS_AVAILABLE = False

from athena.core.logging import get_logger
from athena.live.brokers.base import BaseBroker, BrokerMetrics
from athena.live.execution_guard import ExecutionGuard, GuardViolation

logger = get_logger(__name__)


class PrometheusExporter:
    """Prometheus metrics exporter for trading system telemetry."""

    def __init__(self, port: int = 8090, registry: Optional[CollectorRegistry] = None):
        """Initialize Prometheus exporter.

        Args:
            port: Port to serve metrics on
            registry: Custom registry (uses default if None)
        """
        if not PROMETHEUS_AVAILABLE:
            logger.warning("Prometheus client not available. Install with: pip install prometheus-client")
            self.enabled = False
            return

        self.port = port
        self.registry = registry or REGISTRY
        self.enabled = True
        self.server_started = False

        # Trading metrics
        self._init_trading_metrics()

        # Broker metrics
        self._init_broker_metrics()

        # Risk and guard metrics
        self._init_risk_metrics()

        # System metrics
        self._init_system_metrics()

    def _init_trading_metrics(self):
        """Initialize trading-related metrics."""
        # Order metrics
        self.orders_total = Counter(
            'athena_orders_total',
            'Total number of orders placed',
            ['broker', 'symbol', 'side', 'order_type', 'status'],
            registry=self.registry
        )

        self.order_latency = Histogram(
            'athena_order_latency_seconds',
            'Order placement latency',
            ['broker'],
            registry=self.registry
        )

        # Trade metrics
        self.trades_total = Counter(
            'athena_trades_total',
            'Total number of completed trades',
            ['broker', 'symbol', 'side'],
            registry=self.registry
        )

        self.trade_pnl = Histogram(
            'athena_trade_pnl_dollars',
            'Trade P&L in dollars',
            ['broker', 'symbol'],
            buckets=(-1000, -500, -100, -50, -10, 0, 10, 50, 100, 500, 1000, float('inf')),
            registry=self.registry
        )

        self.slippage_bps = Histogram(
            'athena_slippage_basis_points',
            'Trade slippage in basis points',
            ['broker', 'symbol'],
            buckets=(0, 5, 10, 25, 50, 100, 250, 500, float('inf')),
            registry=self.registry
        )

        # Portfolio metrics
        self.portfolio_value = Gauge(
            'athena_portfolio_value_dollars',
            'Current portfolio value',
            ['broker'],
            registry=self.registry
        )

        self.daily_pnl = Gauge(
            'athena_daily_pnl_dollars',
            'Daily profit and loss',
            ['broker'],
            registry=self.registry
        )

        self.positions_count = Gauge(
            'athena_positions_count',
            'Number of open positions',
            ['broker'],
            registry=self.registry
        )

        self.position_value = Gauge(
            'athena_position_value_dollars',
            'Value of individual positions',
            ['broker', 'symbol'],
            registry=self.registry
        )

    def _init_broker_metrics(self):
        """Initialize broker-related metrics."""
        # Connection metrics
        self.broker_connection_status = Enum(
            'athena_broker_connection_status',
            'Broker connection status',
            ['broker'],
            states=['disconnected', 'connecting', 'connected', 'error', 'suspended'],
            registry=self.registry
        )

        self.broker_uptime_seconds = Gauge(
            'athena_broker_uptime_seconds',
            'Broker connection uptime',
            ['broker'],
            registry=self.registry
        )

        self.broker_reconnects_total = Counter(
            'athena_broker_reconnects_total',
            'Total broker reconnection attempts',
            ['broker'],
            registry=self.registry
        )

        # Data quality metrics
        self.market_data_ticks = Counter(
            'athena_market_data_ticks_total',
            'Total market data ticks received',
            ['broker', 'symbol'],
            registry=self.registry
        )

        self.dropped_ticks_total = Counter(
            'athena_dropped_ticks_total',
            'Total dropped market data ticks',
            ['broker', 'symbol'],
            registry=self.registry
        )

        self.api_latency = Histogram(
            'athena_api_latency_seconds',
            'API call latency',
            ['broker', 'endpoint'],
            registry=self.registry
        )

    def _init_risk_metrics(self):
        """Initialize risk and guard metrics."""
        # Guard violations
        self.guard_violations_total = Counter(
            'athena_guard_violations_total',
            'Total guard violations',
            ['type', 'severity', 'action', 'symbol'],
            registry=self.registry
        )

        # Trading halts
        self.trading_halts_total = Counter(
            'athena_trading_halts_total',
            'Total trading halts',
            ['type', 'symbol'],  # global or symbol-specific
            registry=self.registry
        )

        self.halt_duration_seconds = Histogram(
            'athena_halt_duration_seconds',
            'Duration of trading halts',
            ['type', 'symbol'],
            registry=self.registry
        )

        # Risk metrics
        self.max_drawdown = Gauge(
            'athena_max_drawdown_percent',
            'Maximum drawdown percentage',
            ['broker'],
            registry=self.registry
        )

        self.var_1d = Gauge(
            'athena_var_1day_dollars',
            '1-day Value at Risk',
            ['broker', 'confidence_level'],
            registry=self.registry
        )

        self.leverage_ratio = Gauge(
            'athena_leverage_ratio',
            'Current leverage ratio',
            ['broker'],
            registry=self.registry
        )

    def _init_system_metrics(self):
        """Initialize system-level metrics."""
        # System info
        self.system_info = Info(
            'athena_system_info',
            'System information',
            registry=self.registry
        )

        # Performance metrics
        self.backtest_duration = Histogram(
            'athena_backtest_duration_seconds',
            'Backtest execution time',
            ['strategy', 'symbol'],
            registry=self.registry
        )

        self.optimization_duration = Histogram(
            'athena_optimization_duration_seconds',
            'Strategy optimization time',
            ['strategy', 'optimizer'],
            registry=self.registry
        )

        # Error tracking
        self.errors_total = Counter(
            'athena_errors_total',
            'Total errors by component',
            ['component', 'error_type'],
            registry=self.registry
        )

    def start_server(self) -> bool:
        """Start Prometheus metrics server."""
        if not self.enabled:
            logger.warning("Prometheus exporter not enabled")
            return False

        if self.server_started:
            logger.info(f"Prometheus server already running on port {self.port}")
            return True

        try:
            start_http_server(self.port, registry=self.registry)
            self.server_started = True
            logger.info(f"Prometheus metrics server started on port {self.port}")
            return True
        except Exception as e:
            logger.error(f"Failed to start Prometheus server: {e}")
            return False

    def update_broker_metrics(self, broker: BaseBroker) -> None:
        """Update broker-specific metrics."""
        if not self.enabled:
            return

        broker_name = broker.__class__.__name__.lower()

        # Connection status
        self.broker_connection_status.labels(broker=broker_name).state(broker.state.value)

        # Uptime
        uptime = broker.get_uptime()
        self.broker_uptime_seconds.labels(broker=broker_name).set(uptime)

        # Metrics from broker
        metrics = broker.metrics
        self.broker_reconnects_total.labels(broker=broker_name)._value._value = metrics.reconnect_count
        self.dropped_ticks_total.labels(broker=broker_name, symbol='*')._value._value = metrics.dropped_ticks

    def record_order(self, broker_name: str, order_data: Dict[str, Any]) -> None:
        """Record order metrics."""
        if not self.enabled:
            return

        self.orders_total.labels(
            broker=broker_name,
            symbol=order_data.get('symbol', 'unknown'),
            side=order_data.get('side', 'unknown'),
            order_type=order_data.get('order_type', 'unknown'),
            status=order_data.get('status', 'unknown')
        ).inc()

    def record_trade(self, broker_name: str, trade_data: Dict[str, Any]) -> None:
        """Record trade metrics."""
        if not self.enabled:
            return

        symbol = trade_data.get('symbol', 'unknown')
        side = trade_data.get('side', 'unknown')
        pnl = trade_data.get('pnl', 0)
        slippage = trade_data.get('slippage_bps', 0)

        self.trades_total.labels(
            broker=broker_name,
            symbol=symbol,
            side=side
        ).inc()

        if pnl != 0:
            self.trade_pnl.labels(
                broker=broker_name,
                symbol=symbol
            ).observe(pnl)

        if slippage > 0:
            self.slippage_bps.labels(
                broker=broker_name,
                symbol=symbol
            ).observe(slippage)

    def record_guard_violation(self, violation: GuardViolation) -> None:
        """Record guard violation metrics."""
        if not self.enabled:
            return

        self.guard_violations_total.labels(
            type=violation.type.value,
            severity=violation.severity,
            action=violation.action.value,
            symbol=violation.symbol or 'global'
        ).inc()

    def record_trading_halt(self, halt_type: str, symbol: Optional[str] = None, duration: Optional[float] = None) -> None:
        """Record trading halt metrics."""
        if not self.enabled:
            return

        halt_symbol = symbol or 'global'
        self.trading_halts_total.labels(
            type=halt_type,
            symbol=halt_symbol
        ).inc()

        if duration is not None:
            self.halt_duration_seconds.labels(
                type=halt_type,
                symbol=halt_symbol
            ).observe(duration)

    def update_portfolio_metrics(self, broker_name: str, portfolio_data: Dict[str, Any]) -> None:
        """Update portfolio metrics."""
        if not self.enabled:
            return

        if 'portfolio_value' in portfolio_data:
            self.portfolio_value.labels(broker=broker_name).set(portfolio_data['portfolio_value'])

        if 'daily_pnl' in portfolio_data:
            self.daily_pnl.labels(broker=broker_name).set(portfolio_data['daily_pnl'])

        if 'positions_count' in portfolio_data:
            self.positions_count.labels(broker=broker_name).set(portfolio_data['positions_count'])

        if 'max_drawdown' in portfolio_data:
            self.max_drawdown.labels(broker=broker_name).set(portfolio_data['max_drawdown'] * 100)

        if 'leverage' in portfolio_data:
            self.leverage_ratio.labels(broker=broker_name).set(portfolio_data['leverage'])

    def update_position_metrics(self, broker_name: str, positions: List[Dict[str, Any]]) -> None:
        """Update individual position metrics."""
        if not self.enabled:
            return

        for position in positions:
            symbol = position.get('symbol', 'unknown')
            value = position.get('market_value', 0)

            self.position_value.labels(
                broker=broker_name,
                symbol=symbol
            ).set(value)

    def record_latency(self, broker_name: str, endpoint: str, latency_seconds: float) -> None:
        """Record API latency."""
        if not self.enabled:
            return

        self.api_latency.labels(
            broker=broker_name,
            endpoint=endpoint
        ).observe(latency_seconds)

    def record_backtest_performance(self, strategy: str, symbol: str, duration_seconds: float) -> None:
        """Record backtest performance."""
        if not self.enabled:
            return

        self.backtest_duration.labels(
            strategy=strategy,
            symbol=symbol
        ).observe(duration_seconds)

    def record_error(self, component: str, error_type: str) -> None:
        """Record system errors."""
        if not self.enabled:
            return

        self.errors_total.labels(
            component=component,
            error_type=error_type
        ).inc()

    def set_system_info(self, info: Dict[str, str]) -> None:
        """Set system information."""
        if not self.enabled:
            return

        self.system_info.info(info)

    def get_metrics_summary(self) -> Dict[str, Any]:
        """Get summary of key metrics."""
        if not self.enabled:
            return {"enabled": False}

        # This would typically query the metrics from the registry
        # For now, return a basic summary
        return {
            "enabled": True,
            "server_port": self.port,
            "server_started": self.server_started,
            "metrics_endpoint": f"http://localhost:{self.port}/metrics"
        }


# Global exporter instance
_exporter: Optional[PrometheusExporter] = None


def get_exporter() -> Optional[PrometheusExporter]:
    """Get global Prometheus exporter instance."""
    return _exporter


def init_prometheus(port: int = 8090, start_server: bool = True) -> Optional[PrometheusExporter]:
    """Initialize global Prometheus exporter."""
    global _exporter

    if _exporter is not None:
        logger.info("Prometheus exporter already initialized")
        return _exporter

    _exporter = PrometheusExporter(port=port)

    if start_server and _exporter.enabled:
        _exporter.start_server()

    if _exporter.enabled:
        # Set basic system info
        _exporter.set_system_info({
            "version": "1.0.0",
            "component": "athena-trading-system",
            "started_at": datetime.now().isoformat()
        })

        logger.info(f"Prometheus metrics initialized on port {port}")

    return _exporter


def record_metric(metric_type: str, **kwargs) -> None:
    """Convenience function to record metrics."""
    exporter = get_exporter()
    if not exporter or not exporter.enabled:
        return

    try:
        if metric_type == "order":
            exporter.record_order(kwargs.get('broker'), kwargs.get('data', {}))
        elif metric_type == "trade":
            exporter.record_trade(kwargs.get('broker'), kwargs.get('data', {}))
        elif metric_type == "violation":
            exporter.record_guard_violation(kwargs.get('violation'))
        elif metric_type == "halt":
            exporter.record_trading_halt(
                kwargs.get('halt_type'),
                kwargs.get('symbol'),
                kwargs.get('duration')
            )
        elif metric_type == "error":
            exporter.record_error(kwargs.get('component'), kwargs.get('error_type'))
        else:
            logger.warning(f"Unknown metric type: {metric_type}")
    except Exception as e:
        logger.error(f"Failed to record metric {metric_type}: {e}")


# Decorator for automatic latency measurement
def measure_latency(broker_name: str, endpoint: str):
    """Decorator to measure function latency."""
    def decorator(func):
        def wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = func(*args, **kwargs)
                return result
            finally:
                latency = time.time() - start_time
                exporter = get_exporter()
                if exporter and exporter.enabled:
                    exporter.record_latency(broker_name, endpoint, latency)
        return wrapper
    return decorator


async def measure_async_latency(broker_name: str, endpoint: str):
    """Async context manager to measure latency."""
    class LatencyMeasurer:
        def __init__(self, broker: str, ep: str):
            self.broker = broker
            self.endpoint = ep
            self.start_time = None

        async def __aenter__(self):
            self.start_time = time.time()
            return self

        async def __aexit__(self, exc_type, exc_val, exc_tb):
            if self.start_time:
                latency = time.time() - self.start_time
                exporter = get_exporter()
                if exporter and exporter.enabled:
                    exporter.record_latency(self.broker, self.endpoint, latency)

    return LatencyMeasurer(broker_name, endpoint)