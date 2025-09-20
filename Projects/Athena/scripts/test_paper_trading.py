#!/usr/bin/env python3
"""Test script for paper trading with multiple brokers."""

import asyncio
import json
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any

from athena.core.types import Order, OrderSide, OrderType, OrderStatus
from athena.live.brokers.base import BrokerConfig
from athena.live.brokers.alpaca import AlpacaBroker
from athena.live.brokers.binance import BinanceBroker
from athena.live.brokers.ib import InteractiveBroker
from athena.live.execution_guard import ExecutionGuard, ExecutionGuardConfig
from athena.ops import init_prometheus, record_metric
from athena.core.logging import get_logger

logger = get_logger(__name__)


class PaperTradingTester:
    """Comprehensive paper trading test suite."""

    def __init__(self):
        """Initialize tester."""
        self.brokers: Dict[str, Any] = {}
        self.test_results: Dict[str, Any] = {}
        self.execution_guard: Optional[ExecutionGuard] = None

        # Test configuration
        self.test_symbols = ["AAPL", "MSFT", "GOOGL"]
        self.test_crypto_symbols = ["BTCUSDT", "ETHUSDT"]

        # Initialize Prometheus for metrics
        init_prometheus(port=8091, start_server=True)

    async def setup_brokers(self) -> None:
        """Setup broker connections for testing."""
        logger.info("Setting up broker connections...")

        # Alpaca configuration (paper trading)
        alpaca_config = BrokerConfig(
            api_key="test_key_alpaca",  # Would use real testnet keys
            api_secret="test_secret_alpaca",
            paper_trading=True,
            timeout=30,
            max_retries=3
        )

        # Binance configuration (testnet)
        binance_config = BrokerConfig(
            api_key="test_key_binance",
            api_secret="test_secret_binance",
            paper_trading=True,
            timeout=30,
            max_retries=3
        )

        # Interactive Brokers configuration (paper account)
        ib_config = BrokerConfig(
            api_key="",  # IB uses host/port instead
            api_secret="",
            paper_trading=True,
            timeout=30,
            max_retries=3,
            metadata={
                "host": "127.0.0.1",
                "port": 7497,  # TWS paper trading port
                "client_id": 1
            }
        )

        # Initialize brokers
        self.brokers["alpaca"] = AlpacaBroker(alpaca_config)
        self.brokers["binance"] = BinanceBroker(binance_config)
        self.brokers["ib"] = InteractiveBroker(ib_config)

        # Setup execution guard
        guard_config = ExecutionGuardConfig(
            max_daily_loss_dollars=1000.0,  # Conservative for testing
            max_position_per_symbol_dollars=5000.0,
            max_consecutive_losses=3,
            max_slippage_bps=25.0
        )
        self.execution_guard = ExecutionGuard(guard_config)

    async def test_broker_connections(self) -> Dict[str, bool]:
        """Test broker connection capabilities."""
        logger.info("Testing broker connections...")

        connection_results = {}

        for name, broker in self.brokers.items():
            try:
                logger.info(f"Testing {name} connection...")

                # Test connection
                connected = await broker.connect()
                connection_results[name] = {
                    "connected": connected,
                    "state": broker.state.value,
                    "error": None
                }

                if connected:
                    # Test basic functionality
                    account = await broker.get_account()
                    positions = await broker.get_positions()

                    connection_results[name].update({
                        "account_info": account is not None,
                        "positions_accessible": positions is not None,
                        "uptime": broker.get_uptime()
                    })

                    logger.info(f"{name}: Connected successfully")
                else:
                    logger.warning(f"{name}: Connection failed")

            except Exception as e:
                logger.error(f"{name}: Connection error - {e}")
                connection_results[name] = {
                    "connected": False,
                    "error": str(e)
                }

        return connection_results

    async def test_market_data(self) -> Dict[str, Any]:
        """Test market data retrieval."""
        logger.info("Testing market data retrieval...")

        market_data_results = {}

        for name, broker in self.brokers.items():
            if not await broker.is_connected():
                logger.warning(f"Skipping {name} - not connected")
                continue

            try:
                logger.info(f"Testing {name} market data...")

                # Test symbols based on broker type
                test_symbols = self.test_crypto_symbols if name == "binance" else self.test_symbols

                symbol_results = {}
                for symbol in test_symbols[:2]:  # Test first 2 symbols
                    try:
                        start_time = time.time()
                        market_data = await broker.get_market_data(symbol)
                        latency = (time.time() - start_time) * 1000

                        symbol_results[symbol] = {
                            "success": market_data is not None,
                            "latency_ms": latency,
                            "data": {
                                "bid": market_data.bid if market_data else None,
                                "ask": market_data.ask if market_data else None,
                                "spread_bps": market_data.spread * 10000 / market_data.last if market_data and market_data.last > 0 else None
                            } if market_data else None
                        }

                        # Record metrics
                        record_metric("latency", broker=name, endpoint="market_data", latency=latency/1000)

                    except Exception as e:
                        logger.error(f"{name} market data error for {symbol}: {e}")
                        symbol_results[symbol] = {"success": False, "error": str(e)}

                market_data_results[name] = symbol_results

            except Exception as e:
                logger.error(f"{name} market data test failed: {e}")
                market_data_results[name] = {"error": str(e)}

        return market_data_results

    async def test_order_placement(self) -> Dict[str, Any]:
        """Test order placement and management."""
        logger.info("Testing order placement...")

        order_results = {}

        for name, broker in self.brokers.items():
            if not await broker.is_connected():
                logger.warning(f"Skipping {name} - not connected")
                continue

            try:
                logger.info(f"Testing {name} order placement...")

                broker_results = {
                    "orders_placed": 0,
                    "orders_successful": 0,
                    "orders_failed": 0,
                    "average_latency_ms": 0,
                    "order_details": []
                }

                # Test different order types
                test_orders = [
                    {
                        "symbol": "AAPL" if name != "binance" else "BTCUSDT",
                        "side": OrderSide.BUY,
                        "quantity": 1.0 if name != "binance" else 0.001,
                        "order_type": OrderType.MARKET,
                        "description": "Market buy order"
                    },
                    {
                        "symbol": "MSFT" if name != "binance" else "ETHUSDT",
                        "side": OrderSide.SELL,
                        "quantity": 1.0 if name != "binance" else 0.01,
                        "order_type": OrderType.LIMIT,
                        "price": 100.0 if name != "binance" else 2000.0,
                        "description": "Limit sell order"
                    }
                ]

                latencies = []

                for order_spec in test_orders:
                    try:
                        # Check with execution guard first
                        order = Order(
                            symbol=order_spec["symbol"],
                            side=order_spec["side"],
                            quantity=order_spec["quantity"],
                            order_type=order_spec["order_type"],
                            price=order_spec.get("price"),
                            timestamp=datetime.now()
                        )

                        # Test execution guard
                        allowed, violation = await self.execution_guard.check_order_allowed(order)

                        order_detail = {
                            "description": order_spec["description"],
                            "symbol": order_spec["symbol"],
                            "guard_allowed": allowed,
                            "guard_violation": violation.message if violation else None
                        }

                        if allowed:
                            # Place order
                            start_time = time.time()
                            result_order = await broker.place_order(order)
                            latency = (time.time() - start_time) * 1000
                            latencies.append(latency)

                            order_detail.update({
                                "order_id": result_order.order_id,
                                "status": result_order.status.value if result_order.status else "unknown",
                                "latency_ms": latency,
                                "success": result_order.status not in [OrderStatus.REJECTED]
                            })

                            if result_order.status not in [OrderStatus.REJECTED]:
                                broker_results["orders_successful"] += 1

                                # Test order cancellation for limit orders
                                if order_spec["order_type"] == OrderType.LIMIT and result_order.order_id:
                                    await asyncio.sleep(1)  # Wait a bit
                                    cancel_success = await broker.cancel_order(result_order.order_id)
                                    order_detail["cancel_success"] = cancel_success
                            else:
                                broker_results["orders_failed"] += 1

                            # Record metrics
                            record_metric("order", broker=name, data={
                                "symbol": order_spec["symbol"],
                                "side": order_spec["side"].value,
                                "order_type": order_spec["order_type"].value,
                                "status": result_order.status.value if result_order.status else "unknown"
                            })

                        else:
                            order_detail.update({
                                "success": False,
                                "reason": "Execution guard violation"
                            })
                            broker_results["orders_failed"] += 1

                        broker_results["orders_placed"] += 1
                        broker_results["order_details"].append(order_detail)

                    except Exception as e:
                        logger.error(f"{name} order placement error: {e}")
                        broker_results["orders_failed"] += 1
                        broker_results["order_details"].append({
                            "description": order_spec["description"],
                            "success": False,
                            "error": str(e)
                        })

                if latencies:
                    broker_results["average_latency_ms"] = sum(latencies) / len(latencies)

                order_results[name] = broker_results

            except Exception as e:
                logger.error(f"{name} order test failed: {e}")
                order_results[name] = {"error": str(e)}

        return order_results

    async def test_execution_guards(self) -> Dict[str, Any]:
        """Test execution guard functionality."""
        logger.info("Testing execution guards...")

        guard_results = {
            "daily_loss_test": await self._test_daily_loss_guard(),
            "position_size_test": await self._test_position_size_guard(),
            "consecutive_loss_test": await self._test_consecutive_loss_guard(),
            "slippage_test": await self._test_slippage_guard()
        }

        return guard_results

    async def _test_daily_loss_guard(self) -> Dict[str, Any]:
        """Test daily loss limit guard."""
        try:
            # Simulate hitting daily loss limit
            self.execution_guard.update_daily_pnl(-1500.0)  # Exceeds $1000 limit

            test_order = Order(
                symbol="AAPL",
                side=OrderSide.BUY,
                quantity=10,
                order_type=OrderType.MARKET,
                timestamp=datetime.now()
            )

            allowed, violation = await self.execution_guard.check_order_allowed(test_order)

            return {
                "triggered_correctly": not allowed,
                "violation_type": violation.type.value if violation else None,
                "violation_message": violation.message if violation else None,
                "global_halt": self.execution_guard.is_global_halt
            }

        except Exception as e:
            return {"error": str(e)}

    async def _test_position_size_guard(self) -> Dict[str, Any]:
        """Test position size limit guard."""
        try:
            # Test oversized order
            test_order = Order(
                symbol="AAPL",
                side=OrderSide.BUY,
                quantity=100,  # Large quantity
                price=500.0,   # High price = $50,000 position (exceeds $5,000 limit)
                order_type=OrderType.LIMIT,
                timestamp=datetime.now()
            )

            allowed, violation = await self.execution_guard.check_order_allowed(test_order)

            return {
                "triggered_correctly": not allowed,
                "violation_type": violation.type.value if violation else None,
                "symbol_halted": test_order.symbol in self.execution_guard.halted_symbols
            }

        except Exception as e:
            return {"error": str(e)}

    async def _test_consecutive_loss_guard(self) -> Dict[str, Any]:
        """Test consecutive loss guard."""
        try:
            # Simulate consecutive losing trades
            from athena.core.types import Trade

            for i in range(4):  # Exceeds limit of 3
                trade = Trade(
                    symbol="TEST",
                    side=OrderSide.BUY,
                    quantity=1,
                    price=100.0,
                    timestamp=datetime.now() - timedelta(minutes=i),
                    trade_id=f"test_{i}",
                    commission=1.0  # Positive commission indicates loss in our test
                )
                self.execution_guard.add_trade(trade)

            test_order = Order(
                symbol="TEST",
                side=OrderSide.BUY,
                quantity=1,
                order_type=OrderType.MARKET,
                timestamp=datetime.now()
            )

            allowed, violation = await self.execution_guard.check_order_allowed(test_order)

            return {
                "triggered_correctly": not allowed,
                "violation_type": violation.type.value if violation else None,
                "global_halt": self.execution_guard.is_global_halt
            }

        except Exception as e:
            return {"error": str(e)}

    async def _test_slippage_guard(self) -> Dict[str, Any]:
        """Test slippage circuit breaker."""
        try:
            from athena.core.types import Trade

            # Simulate high slippage trade
            trade = Trade(
                symbol="AAPL",
                side=OrderSide.BUY,
                quantity=1,
                price=102.0,  # Actual execution price
                timestamp=datetime.now(),
                trade_id="slippage_test"
            )

            expected_price = 100.0  # Expected price
            violation = await self.execution_guard.check_trade_slippage(trade, expected_price)

            return {
                "slippage_detected": violation is not None,
                "slippage_bps": (trade.price - expected_price) / expected_price * 10000,
                "violation_type": violation.type.value if violation else None
            }

        except Exception as e:
            return {"error": str(e)}

    async def test_metrics_collection(self) -> Dict[str, Any]:
        """Test Prometheus metrics collection."""
        logger.info("Testing metrics collection...")

        try:
            from athena.ops import get_exporter

            exporter = get_exporter()
            if not exporter or not exporter.enabled:
                return {"error": "Prometheus exporter not available"}

            # Test metric recording
            record_metric("order", broker="test", data={
                "symbol": "TEST",
                "side": "buy",
                "order_type": "market",
                "status": "filled"
            })

            record_metric("trade", broker="test", data={
                "symbol": "TEST",
                "side": "buy",
                "pnl": 100.0,
                "slippage_bps": 15.0
            })

            # Check metrics endpoint
            import aiohttp
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.get("http://localhost:8091/metrics") as response:
                        metrics_available = response.status == 200
                        metrics_content = await response.text() if metrics_available else ""
            except:
                metrics_available = False
                metrics_content = ""

            return {
                "exporter_enabled": exporter.enabled,
                "server_started": exporter.server_started,
                "metrics_endpoint_accessible": metrics_available,
                "sample_metrics_present": "athena_orders_total" in metrics_content
            }

        except Exception as e:
            return {"error": str(e)}

    async def cleanup(self) -> None:
        """Cleanup connections and resources."""
        logger.info("Cleaning up test resources...")

        for name, broker in self.brokers.items():
            try:
                await broker.disconnect()
                logger.info(f"{name}: Disconnected")
            except Exception as e:
                logger.error(f"{name}: Cleanup error - {e}")

    async def run_all_tests(self) -> Dict[str, Any]:
        """Run complete test suite."""
        logger.info("🚀 Starting comprehensive paper trading tests...")

        start_time = time.time()

        try:
            # Setup
            await self.setup_brokers()

            # Run tests
            results = {
                "test_timestamp": datetime.now().isoformat(),
                "broker_connections": await self.test_broker_connections(),
                "market_data": await self.test_market_data(),
                "order_placement": await self.test_order_placement(),
                "execution_guards": await self.test_execution_guards(),
                "metrics_collection": await self.test_metrics_collection()
            }

            # Calculate summary
            results["test_summary"] = self._generate_summary(results)
            results["test_duration_seconds"] = time.time() - start_time

            return results

        except Exception as e:
            logger.error(f"Test suite failed: {e}")
            return {
                "error": str(e),
                "test_duration_seconds": time.time() - start_time
            }
        finally:
            await self.cleanup()

    def _generate_summary(self, results: Dict[str, Any]) -> Dict[str, Any]:
        """Generate test summary."""
        summary = {
            "total_brokers_tested": len(self.brokers),
            "brokers_connected": 0,
            "total_orders_tested": 0,
            "successful_orders": 0,
            "guard_tests_passed": 0,
            "overall_status": "PASS"
        }

        # Count successful connections
        if "broker_connections" in results:
            for broker_result in results["broker_connections"].values():
                if isinstance(broker_result, dict) and broker_result.get("connected"):
                    summary["brokers_connected"] += 1

        # Count order results
        if "order_placement" in results:
            for broker_result in results["order_placement"].values():
                if isinstance(broker_result, dict) and "orders_placed" in broker_result:
                    summary["total_orders_tested"] += broker_result.get("orders_placed", 0)
                    summary["successful_orders"] += broker_result.get("orders_successful", 0)

        # Count guard tests
        if "execution_guards" in results:
            for guard_test in results["execution_guards"].values():
                if isinstance(guard_test, dict) and guard_test.get("triggered_correctly"):
                    summary["guard_tests_passed"] += 1

        # Determine overall status
        if summary["brokers_connected"] == 0:
            summary["overall_status"] = "FAIL - No broker connections"
        elif summary["total_orders_tested"] == 0:
            summary["overall_status"] = "FAIL - No orders tested"
        elif summary["guard_tests_passed"] < 3:  # Expect at least 3 guard tests to pass
            summary["overall_status"] = "WARN - Some guard tests failed"

        return summary


async def main():
    """Main test execution."""
    tester = PaperTradingTester()

    try:
        results = await tester.run_all_tests()

        # Print summary
        print("\n" + "="*60)
        print("📊 PAPER TRADING TEST RESULTS")
        print("="*60)

        if "test_summary" in results:
            summary = results["test_summary"]
            print(f"Overall Status: {summary['overall_status']}")
            print(f"Brokers Connected: {summary['brokers_connected']}/{summary['total_brokers_tested']}")
            print(f"Orders Successful: {summary['successful_orders']}/{summary['total_orders_tested']}")
            print(f"Guard Tests Passed: {summary['guard_tests_passed']}")
            print(f"Test Duration: {results.get('test_duration_seconds', 0):.1f} seconds")

        # Save detailed results
        output_file = f"paper_trading_test_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(output_file, 'w') as f:
            json.dump(results, f, indent=2, default=str)

        print(f"\n📄 Detailed results saved to: {output_file}")

        if "test_summary" in results and results["test_summary"]["overall_status"] == "PASS":
            print("\n✅ All tests passed! Paper trading system is ready.")
            return 0
        else:
            print("\n❌ Some tests failed. Review results before proceeding.")
            return 1

    except Exception as e:
        logger.error(f"Test execution failed: {e}")
        print(f"\n💥 Test execution failed: {e}")
        return 1


if __name__ == "__main__":
    exit(asyncio.run(main()))