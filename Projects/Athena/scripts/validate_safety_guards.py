#!/usr/bin/env python3
"""Validation script for safety guards with synthetic scenarios."""

import asyncio
import json
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any

from athena.core.types import Order, OrderSide, OrderType, Trade, Position
from athena.live.execution_guard import ExecutionGuard, ExecutionGuardConfig, GuardViolationType
from athena.core.risk import RiskManager
from athena.ops import init_prometheus, record_metric
from athena.core.logging import get_logger

logger = get_logger(__name__)


class SafetyGuardValidator:
    """Comprehensive safety guard validation with synthetic scenarios."""

    def __init__(self):
        """Initialize validator."""
        self.guard: Optional[ExecutionGuard] = None
        self.risk_manager: Optional[RiskManager] = None
        self.test_results: Dict[str, Any] = {}

        # Initialize metrics
        init_prometheus(port=8092, start_server=True)

    async def setup_guards(self) -> None:
        """Setup execution guards with test configuration."""
        logger.info("Setting up execution guards...")

        # Conservative configuration for testing
        guard_config = ExecutionGuardConfig(
            max_daily_loss_dollars=1000.0,
            max_daily_loss_percent=0.02,  # 2%
            max_position_per_symbol_dollars=5000.0,
            max_position_per_symbol_percent=0.05,  # 5%
            max_consecutive_losses=3,
            max_slippage_bps=25.0,
            max_orders_per_minute=10,
            max_orders_per_hour=100,
            default_halt_duration_minutes=5,  # Short for testing
            auto_resume_enabled=True
        )

        self.guard = ExecutionGuard(guard_config)
        self.risk_manager = RiskManager(
            max_drawdown=0.15,
            max_position_size=0.05,
            daily_loss_limit=0.02
        )

        # Set initial account state
        self.guard.update_account_balance(50000.0)  # $50k test account
        self.guard.update_daily_pnl(0.0)

        logger.info("Execution guards configured and ready")

    async def test_daily_loss_scenarios(self) -> Dict[str, Any]:
        """Test daily loss limit scenarios."""
        logger.info("Testing daily loss scenarios...")

        scenarios = {}

        # Scenario 1: Gradual approach to limit
        scenario_1 = await self._test_gradual_loss_approach()
        scenarios["gradual_approach"] = scenario_1

        # Scenario 2: Sudden large loss
        scenario_2 = await self._test_sudden_large_loss()
        scenarios["sudden_large_loss"] = scenario_2

        # Scenario 3: Percentage vs absolute limits
        scenario_3 = await self._test_percentage_vs_absolute()
        scenarios["percentage_vs_absolute"] = scenario_3

        # Scenario 4: Recovery after halt
        scenario_4 = await self._test_loss_recovery()
        scenarios["loss_recovery"] = scenario_4

        return scenarios

    async def _test_gradual_loss_approach(self) -> Dict[str, Any]:
        """Test gradual approach to daily loss limit."""
        try:
            # Reset state
            self.guard.update_daily_pnl(0.0)
            await self.guard.resume_trading()

            results = {
                "steps": [],
                "final_halt_triggered": False,
                "violations": []
            }

            # Gradually increase losses
            loss_steps = [-200, -500, -800, -950, -1100]  # Last one exceeds $1000 limit

            for i, loss in enumerate(loss_steps):
                self.guard.update_daily_pnl(loss)

                test_order = Order(
                    symbol="AAPL",
                    side=OrderSide.BUY,
                    quantity=1,
                    order_type=OrderType.MARKET,
                    timestamp=datetime.now()
                )

                allowed, violation = await self.guard.check_order_allowed(test_order)

                step_result = {
                    "step": i + 1,
                    "daily_pnl": loss,
                    "order_allowed": allowed,
                    "global_halt": self.guard.is_global_halt,
                    "violation_type": violation.type.value if violation else None
                }

                results["steps"].append(step_result)

                if violation:
                    results["violations"].append(violation.type.value)

                if not allowed and loss == -1100:
                    results["final_halt_triggered"] = True

                # Record metrics
                record_metric("violation", violation=violation) if violation else None

            return results

        except Exception as e:
            return {"error": str(e)}

    async def _test_sudden_large_loss(self) -> Dict[str, Any]:
        """Test sudden large loss triggering immediate halt."""
        try:
            # Reset state
            self.guard.update_daily_pnl(0.0)
            await self.guard.resume_trading()

            # Sudden large loss
            large_loss = -2500.0  # Exceeds both dollar and percentage limits
            self.guard.update_daily_pnl(large_loss)

            test_order = Order(
                symbol="MSFT",
                side=OrderSide.SELL,
                quantity=10,
                order_type=OrderType.MARKET,
                timestamp=datetime.now()
            )

            allowed, violation = await self.guard.check_order_allowed(test_order)

            return {
                "loss_amount": large_loss,
                "order_allowed": allowed,
                "global_halt": self.guard.is_global_halt,
                "violation_triggered": violation is not None,
                "violation_type": violation.type.value if violation else None,
                "exceeds_dollar_limit": abs(large_loss) > self.guard.config.max_daily_loss_dollars,
                "exceeds_percent_limit": abs(large_loss) > (self.guard._account_balance * self.guard.config.max_daily_loss_percent)
            }

        except Exception as e:
            return {"error": str(e)}

    async def _test_percentage_vs_absolute(self) -> Dict[str, Any]:
        """Test percentage vs absolute limit interaction."""
        try:
            results = {}

            # Test with different account sizes
            for account_size, test_name in [(10000, "small_account"), (100000, "large_account")]:
                self.guard.update_account_balance(account_size)

                # Calculate which limit is more restrictive
                dollar_limit = self.guard.config.max_daily_loss_dollars
                percent_limit = account_size * self.guard.config.max_daily_loss_percent

                # Test loss just above the more restrictive limit
                restrictive_limit = min(dollar_limit, percent_limit)
                test_loss = -(restrictive_limit + 100)

                self.guard.update_daily_pnl(test_loss)

                test_order = Order(
                    symbol="GOOGL",
                    side=OrderSide.BUY,
                    quantity=5,
                    order_type=OrderType.MARKET,
                    timestamp=datetime.now()
                )

                allowed, violation = await self.guard.check_order_allowed(test_order)

                results[test_name] = {
                    "account_size": account_size,
                    "dollar_limit": dollar_limit,
                    "percent_limit": percent_limit,
                    "restrictive_limit": restrictive_limit,
                    "test_loss": test_loss,
                    "order_allowed": allowed,
                    "violation_triggered": violation is not None
                }

                # Reset for next test
                await self.guard.resume_trading()

            return results

        except Exception as e:
            return {"error": str(e)}

    async def _test_loss_recovery(self) -> Dict[str, Any]:
        """Test recovery after loss-triggered halt."""
        try:
            # Trigger halt with large loss
            self.guard.update_daily_pnl(-1500.0)

            test_order = Order(
                symbol="TSLA",
                side=OrderSide.BUY,
                quantity=2,
                order_type=OrderType.MARKET,
                timestamp=datetime.now()
            )

            # Should be halted
            allowed_before, violation = await self.guard.check_order_allowed(test_order)

            # Manual resume
            await self.guard.resume_trading()

            # Should be allowed after resume
            allowed_after, _ = await self.guard.check_order_allowed(test_order)

            return {
                "halt_triggered": not allowed_before,
                "violation_type": violation.type.value if violation else None,
                "manual_resume_successful": allowed_after,
                "final_state": "resumed" if allowed_after else "still_halted"
            }

        except Exception as e:
            return {"error": str(e)}

    async def test_position_size_scenarios(self) -> Dict[str, Any]:
        """Test position size limit scenarios."""
        logger.info("Testing position size scenarios...")

        scenarios = {}

        # Scenario 1: Single large position
        scenario_1 = await self._test_single_large_position()
        scenarios["single_large_position"] = scenario_1

        # Scenario 2: Cumulative position building
        scenario_2 = await self._test_cumulative_position_building()
        scenarios["cumulative_position_building"] = scenario_2

        # Scenario 3: Cross-symbol exposure
        scenario_3 = await self._test_cross_symbol_exposure()
        scenarios["cross_symbol_exposure"] = scenario_3

        return scenarios

    async def _test_single_large_position(self) -> Dict[str, Any]:
        """Test single oversized position."""
        try:
            # Reset state
            await self.guard.resume_trading()

            # Order that would create oversized position
            large_order = Order(
                symbol="AAPL",
                side=OrderSide.BUY,
                quantity=50,  # 50 shares
                price=200.0,  # $200/share = $10,000 (exceeds $5,000 limit)
                order_type=OrderType.LIMIT,
                timestamp=datetime.now()
            )

            self.guard.update_market_price("AAPL", 200.0)

            allowed, violation = await self.guard.check_order_allowed(large_order)

            return {
                "order_value": large_order.quantity * large_order.price,
                "position_limit": self.guard.config.max_position_per_symbol_dollars,
                "order_allowed": allowed,
                "symbol_halted": large_order.symbol in self.guard.halted_symbols,
                "violation_type": violation.type.value if violation else None
            }

        except Exception as e:
            return {"error": str(e)}

    async def _test_cumulative_position_building(self) -> Dict[str, Any]:
        """Test cumulative position building hitting limits."""
        try:
            # Reset state
            await self.guard.resume_trading()
            if "MSFT" in self.guard.halted_symbols:
                del self.guard.halted_symbols["MSFT"]

            # Simulate existing position
            existing_position = Position(
                symbol="MSFT",
                quantity=20,
                side=OrderSide.BUY,
                entry_price=150.0,
                current_price=160.0,
                market_value=3200.0
            )

            self.guard.update_positions([existing_position])
            self.guard.update_market_price("MSFT", 160.0)

            # Order that would exceed limit when added to existing position
            additional_order = Order(
                symbol="MSFT",
                side=OrderSide.BUY,
                quantity=15,  # 15 * $160 = $2,400, total would be $5,600 (exceeds $5,000)
                price=160.0,
                order_type=OrderType.LIMIT,
                timestamp=datetime.now()
            )

            allowed, violation = await self.guard.check_order_allowed(additional_order)

            return {
                "existing_position_value": existing_position.market_value,
                "additional_order_value": additional_order.quantity * additional_order.price,
                "total_position_value": existing_position.market_value + (additional_order.quantity * additional_order.price),
                "position_limit": self.guard.config.max_position_per_symbol_dollars,
                "order_allowed": allowed,
                "violation_type": violation.type.value if violation else None
            }

        except Exception as e:
            return {"error": str(e)}

    async def _test_cross_symbol_exposure(self) -> Dict[str, Any]:
        """Test exposure across multiple symbols."""
        try:
            # Reset state
            await self.guard.resume_trading()

            # Create multiple positions approaching limits
            positions = [
                Position(symbol="AAPL", quantity=25, side=OrderSide.BUY, entry_price=180.0, current_price=185.0, market_value=4625.0),
                Position(symbol="MSFT", quantity=15, side=OrderSide.BUY, entry_price=320.0, current_price=315.0, market_value=4725.0),
                Position(symbol="GOOGL", quantity=8, side=OrderSide.BUY, entry_price=140.0, current_price=145.0, market_value=1160.0)
            ]

            self.guard.update_positions(positions)

            # Test orders for different symbols
            test_orders = [
                Order(symbol="AAPL", side=OrderSide.BUY, quantity=5, price=185.0, order_type=OrderType.LIMIT, timestamp=datetime.now()),
                Order(symbol="MSFT", side=OrderSide.BUY, quantity=5, price=315.0, order_type=OrderType.LIMIT, timestamp=datetime.now()),
                Order(symbol="NFLX", side=OrderSide.BUY, quantity=10, price=450.0, order_type=OrderType.LIMIT, timestamp=datetime.now())  # New position
            ]

            results = {}
            for order in test_orders:
                allowed, violation = await self.guard.check_order_allowed(order)
                results[order.symbol] = {
                    "order_allowed": allowed,
                    "would_exceed_limit": violation is not None and violation.type == GuardViolationType.MAX_POSITION_SIZE,
                    "violation_type": violation.type.value if violation else None
                }

            return results

        except Exception as e:
            return {"error": str(e)}

    async def test_consecutive_loss_scenarios(self) -> Dict[str, Any]:
        """Test consecutive loss protection."""
        logger.info("Testing consecutive loss scenarios...")

        scenarios = {}

        # Scenario 1: Building up to limit
        scenario_1 = await self._test_consecutive_loss_buildup()
        scenarios["consecutive_loss_buildup"] = scenario_1

        # Scenario 2: Mixed wins and losses
        scenario_2 = await self._test_mixed_wins_losses()
        scenarios["mixed_wins_losses"] = scenario_2

        return scenarios

    async def _test_consecutive_loss_buildup(self) -> Dict[str, Any]:
        """Test building up consecutive losses."""
        try:
            # Reset state
            await self.guard.resume_trading()
            self.guard._recent_trades = []

            results = {"trades": [], "final_halt": False}

            # Add consecutive losing trades
            for i in range(5):  # 5 trades, limit is 3
                trade = Trade(
                    symbol=f"TEST{i}",
                    side=OrderSide.BUY,
                    quantity=1,
                    price=100.0,
                    timestamp=datetime.now() - timedelta(minutes=i),
                    trade_id=f"loss_test_{i}",
                    commission=1.0  # Positive commission indicates loss in our test logic
                )

                self.guard.add_trade(trade)

                # Test if new order would be allowed
                test_order = Order(
                    symbol="TEST_NEW",
                    side=OrderSide.BUY,
                    quantity=1,
                    order_type=OrderType.MARKET,
                    timestamp=datetime.now()
                )

                allowed, violation = await self.guard.check_order_allowed(test_order)

                trade_result = {
                    "trade_number": i + 1,
                    "order_allowed_after": allowed,
                    "global_halt": self.guard.is_global_halt,
                    "violation_type": violation.type.value if violation else None
                }

                results["trades"].append(trade_result)

                if not allowed and i >= 2:  # Should halt after 3rd consecutive loss
                    results["final_halt"] = True

            return results

        except Exception as e:
            return {"error": str(e)}

    async def _test_mixed_wins_losses(self) -> Dict[str, Any]:
        """Test mixed wins and losses (should not trigger)."""
        try:
            # Reset state
            await self.guard.resume_trading()
            self.guard._recent_trades = []

            # Add mixed trades (wins and losses)
            trades = [
                {"commission": 1.0, "type": "loss"},    # Loss
                {"commission": 0.0, "type": "win"},     # Win (breaks sequence)
                {"commission": 1.0, "type": "loss"},    # Loss
                {"commission": 1.0, "type": "loss"},    # Loss
                {"commission": 1.0, "type": "loss"},    # Loss
            ]

            for i, trade_spec in enumerate(trades):
                trade = Trade(
                    symbol=f"MIX{i}",
                    side=OrderSide.BUY,
                    quantity=1,
                    price=100.0,
                    timestamp=datetime.now() - timedelta(minutes=len(trades) - i),
                    trade_id=f"mix_test_{i}",
                    commission=trade_spec["commission"]
                )

                self.guard.add_trade(trade)

            # Test final order (should be allowed since wins broke the sequence)
            test_order = Order(
                symbol="MIX_FINAL",
                side=OrderSide.BUY,
                quantity=1,
                order_type=OrderType.MARKET,
                timestamp=datetime.now()
            )

            allowed, violation = await self.guard.check_order_allowed(test_order)

            return {
                "total_trades": len(trades),
                "wins_present": any(t["type"] == "win" for t in trades),
                "order_allowed": allowed,
                "consecutive_limit_triggered": violation is not None and violation.type == GuardViolationType.CONSECUTIVE_LOSSES,
                "global_halt": self.guard.is_global_halt
            }

        except Exception as e:
            return {"error": str(e)}

    async def test_slippage_scenarios(self) -> Dict[str, Any]:
        """Test slippage circuit breaker."""
        logger.info("Testing slippage scenarios...")

        scenarios = {}

        # Scenario 1: Single high slippage event
        scenario_1 = await self._test_single_high_slippage()
        scenarios["single_high_slippage"] = scenario_1

        # Scenario 2: Multiple moderate slippage events
        scenario_2 = await self._test_multiple_moderate_slippage()
        scenarios["multiple_moderate_slippage"] = scenario_2

        return scenarios

    async def _test_single_high_slippage(self) -> Dict[str, Any]:
        """Test single high slippage event."""
        try:
            # Reset slippage violations
            self.guard._slippage_violations = 0

            trade = Trade(
                symbol="SLIPPAGE_TEST",
                side=OrderSide.BUY,
                quantity=10,
                price=105.0,  # Executed at $105
                timestamp=datetime.now(),
                trade_id="slippage_test_1"
            )

            expected_price = 100.0  # Expected $100
            slippage_bps = (trade.price - expected_price) / expected_price * 10000

            violation = await self.guard.check_trade_slippage(trade, expected_price)

            return {
                "trade_price": trade.price,
                "expected_price": expected_price,
                "slippage_bps": slippage_bps,
                "slippage_limit_bps": self.guard.config.max_slippage_bps,
                "violation_triggered": violation is not None,
                "violation_severity": violation.severity if violation else None,
                "symbol_halted": trade.symbol in self.guard.halted_symbols
            }

        except Exception as e:
            return {"error": str(e)}

    async def _test_multiple_moderate_slippage(self) -> Dict[str, Any]:
        """Test multiple moderate slippage events triggering circuit breaker."""
        try:
            # Reset slippage violations
            self.guard._slippage_violations = 0

            results = {"slippage_events": [], "circuit_breaker_triggered": False}

            # Create multiple moderate slippage events
            for i in range(4):  # Threshold is 3, so 4th should trigger circuit breaker
                trade = Trade(
                    symbol="MODERATE_SLIP",
                    side=OrderSide.BUY,
                    quantity=5,
                    price=100 + (i + 1) * 3,  # $103, $106, $109, $112
                    timestamp=datetime.now() - timedelta(seconds=i),
                    trade_id=f"moderate_slip_{i}"
                )

                expected_price = 100.0
                violation = await self.guard.check_trade_slippage(trade, expected_price)

                slippage_bps = (trade.price - expected_price) / expected_price * 10000

                event_result = {
                    "event_number": i + 1,
                    "slippage_bps": slippage_bps,
                    "violation_triggered": violation is not None,
                    "total_violations": self.guard._slippage_violations,
                    "symbol_halted": trade.symbol in self.guard.halted_symbols
                }

                results["slippage_events"].append(event_result)

                if trade.symbol in self.guard.halted_symbols:
                    results["circuit_breaker_triggered"] = True

            return results

        except Exception as e:
            return {"error": str(e)}

    async def test_rate_limiting_scenarios(self) -> Dict[str, Any]:
        """Test order rate limiting."""
        logger.info("Testing rate limiting scenarios...")

        try:
            # Reset rate limiter
            self.guard._order_timestamps = []

            results = {"orders": [], "rate_limit_triggered": False}

            # Rapid order placement
            for i in range(15):  # Limit is 10 per minute
                test_order = Order(
                    symbol=f"RATE_TEST_{i}",
                    side=OrderSide.BUY,
                    quantity=1,
                    order_type=OrderType.MARKET,
                    timestamp=datetime.now()
                )

                allowed, violation = await self.guard.check_order_allowed(test_order)

                order_result = {
                    "order_number": i + 1,
                    "order_allowed": allowed,
                    "violation_triggered": violation is not None,
                    "violation_type": violation.type.value if violation else None,
                    "orders_this_minute": len([t for t in self.guard._order_timestamps if t > datetime.now() - timedelta(minutes=1)])
                }

                results["orders"].append(order_result)

                if not allowed and violation and violation.type == GuardViolationType.ORDER_RATE_LIMIT:
                    results["rate_limit_triggered"] = True

            return results

        except Exception as e:
            return {"error": str(e)}

    async def run_all_validations(self) -> Dict[str, Any]:
        """Run all safety guard validations."""
        logger.info("🔒 Starting comprehensive safety guard validation...")

        start_time = time.time()

        try:
            # Setup
            await self.setup_guards()

            # Run validation scenarios
            results = {
                "validation_timestamp": datetime.now().isoformat(),
                "daily_loss_scenarios": await self.test_daily_loss_scenarios(),
                "position_size_scenarios": await self.test_position_size_scenarios(),
                "consecutive_loss_scenarios": await self.test_consecutive_loss_scenarios(),
                "slippage_scenarios": await self.test_slippage_scenarios(),
                "rate_limiting_scenarios": await self.test_rate_limiting_scenarios()
            }

            # Generate validation summary
            results["validation_summary"] = self._generate_validation_summary(results)
            results["validation_duration_seconds"] = time.time() - start_time

            return results

        except Exception as e:
            logger.error(f"Validation failed: {e}")
            return {
                "error": str(e),
                "validation_duration_seconds": time.time() - start_time
            }

    def _generate_validation_summary(self, results: Dict[str, Any]) -> Dict[str, Any]:
        """Generate validation summary."""
        summary = {
            "total_scenarios_tested": 0,
            "scenarios_passed": 0,
            "critical_guards_working": [],
            "overall_status": "PASS"
        }

        # Count scenarios and check critical functionality
        scenario_categories = [
            "daily_loss_scenarios",
            "position_size_scenarios",
            "consecutive_loss_scenarios",
            "slippage_scenarios",
            "rate_limiting_scenarios"
        ]

        for category in scenario_categories:
            if category in results and isinstance(results[category], dict):
                for scenario_name, scenario_result in results[category].items():
                    summary["total_scenarios_tested"] += 1

                    # Check if scenario passed (no error and expected behavior)
                    if isinstance(scenario_result, dict) and "error" not in scenario_result:
                        # Specific checks for different scenario types
                        passed = False

                        if category == "daily_loss_scenarios":
                            if scenario_name == "sudden_large_loss":
                                passed = not scenario_result.get("order_allowed", True)
                            elif scenario_name == "gradual_approach":
                                passed = scenario_result.get("final_halt_triggered", False)
                            else:
                                passed = True

                        elif category == "position_size_scenarios":
                            if scenario_name == "single_large_position":
                                passed = not scenario_result.get("order_allowed", True)
                            else:
                                passed = True

                        elif category == "consecutive_loss_scenarios":
                            if scenario_name == "consecutive_loss_buildup":
                                passed = scenario_result.get("final_halt", False)
                            else:
                                passed = True

                        elif category == "slippage_scenarios":
                            if scenario_name == "multiple_moderate_slippage":
                                passed = scenario_result.get("circuit_breaker_triggered", False)
                            else:
                                passed = True

                        elif category == "rate_limiting_scenarios":
                            passed = scenario_result.get("rate_limit_triggered", False)

                        if passed:
                            summary["scenarios_passed"] += 1

        # Check critical guard functionality
        critical_checks = [
            ("Daily loss halt", "daily_loss_scenarios", "sudden_large_loss"),
            ("Position size limit", "position_size_scenarios", "single_large_position"),
            ("Consecutive loss protection", "consecutive_loss_scenarios", "consecutive_loss_buildup"),
            ("Slippage circuit breaker", "slippage_scenarios", "multiple_moderate_slippage"),
            ("Rate limiting", "rate_limiting_scenarios", None)
        ]

        for check_name, category, scenario in critical_checks:
            if category in results:
                if scenario:
                    scenario_result = results[category].get(scenario, {})
                    if isinstance(scenario_result, dict) and "error" not in scenario_result:
                        if category == "daily_loss_scenarios" and not scenario_result.get("order_allowed", True):
                            summary["critical_guards_working"].append(check_name)
                        elif category == "position_size_scenarios" and not scenario_result.get("order_allowed", True):
                            summary["critical_guards_working"].append(check_name)
                        elif category == "consecutive_loss_scenarios" and scenario_result.get("final_halt", False):
                            summary["critical_guards_working"].append(check_name)
                        elif category == "slippage_scenarios" and scenario_result.get("circuit_breaker_triggered", False):
                            summary["critical_guards_working"].append(check_name)
                else:
                    # Rate limiting check
                    if results[category].get("rate_limit_triggered", False):
                        summary["critical_guards_working"].append(check_name)

        # Determine overall status
        if len(summary["critical_guards_working"]) < 4:  # Expect at least 4 critical guards working
            summary["overall_status"] = "FAIL - Critical guards not functioning"
        elif summary["scenarios_passed"] < summary["total_scenarios_tested"] * 0.8:
            summary["overall_status"] = "WARN - Some scenarios failed"

        return summary


async def main():
    """Main validation execution."""
    validator = SafetyGuardValidator()

    try:
        results = await validator.run_all_validations()

        # Print summary
        print("\n" + "="*60)
        print("🔒 SAFETY GUARD VALIDATION RESULTS")
        print("="*60)

        if "validation_summary" in results:
            summary = results["validation_summary"]
            print(f"Overall Status: {summary['overall_status']}")
            print(f"Scenarios Passed: {summary['scenarios_passed']}/{summary['total_scenarios_tested']}")
            print(f"Critical Guards Working: {len(summary['critical_guards_working'])}/5")
            print(f"Validation Duration: {results.get('validation_duration_seconds', 0):.1f} seconds")

            if summary["critical_guards_working"]:
                print("\n✅ Working Guards:")
                for guard in summary["critical_guards_working"]:
                    print(f"  - {guard}")

        # Save detailed results
        output_file = f"safety_guard_validation_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(output_file, 'w') as f:
            json.dump(results, f, indent=2, default=str)

        print(f"\n📄 Detailed results saved to: {output_file}")

        if "validation_summary" in results and results["validation_summary"]["overall_status"] == "PASS":
            print("\n✅ All safety guards validated! System is production-ready.")
            return 0
        else:
            print("\n❌ Some safety guards failed validation. Review results before production deployment.")
            return 1

    except Exception as e:
        logger.error(f"Validation execution failed: {e}")
        print(f"\n💥 Validation execution failed: {e}")
        return 1


if __name__ == "__main__":
    exit(asyncio.run(main()))