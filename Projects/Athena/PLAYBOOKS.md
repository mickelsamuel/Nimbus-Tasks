# Athena Trading System - Operational Playbooks

## Table of Contents

1. [Emergency Response](#emergency-response)
2. [Daily Operations](#daily-operations)
3. [Incident Response](#incident-response)
4. [Recovery Procedures](#recovery-procedures)
5. [Monitoring & Alerts](#monitoring--alerts)
6. [Common Issues](#common-issues)

---

## Emergency Response

### 🚨 CRITICAL: Trading Halt Triggered

**Immediate Actions:**
1. **Verify halt reason**: Check execution guard logs and Prometheus alerts
2. **Assess portfolio exposure**: Review open positions and P&L
3. **Determine response**: Decide if manual intervention required

**Commands:**
```bash
# Check system status
python -c "
from athena.live.execution_guard import ExecutionGuard
from athena.ops import get_exporter
guard = ExecutionGuard.get_instance()
print('Guard Status:', guard.get_status())
exporter = get_exporter()
if exporter:
    print('Metrics:', exporter.get_metrics_summary())
"

# Force resume (DANGER - only if safe)
python -c "
from athena.live.execution_guard import ExecutionGuard
guard = ExecutionGuard.get_instance()
await guard.resume_trading()  # Global resume
# OR
await guard.resume_trading('AAPL')  # Symbol-specific resume
"
```

**Decision Matrix:**
- **Max Daily Loss Hit**: STOP - Manual review required
- **Position Size Violation**: Review position, consider partial close
- **Consecutive Losses**: Review strategy performance, consider pause
- **Connectivity Issues**: Check broker status, restart if needed

---

### 🔴 CRITICAL: Broker Disconnection

**Immediate Actions:**
1. **Check connectivity**: Verify internet and broker API status
2. **Review open orders**: Determine if orders are still active
3. **Assess risk**: Calculate exposure without order updates

**Commands:**
```bash
# Check broker status
python -c "
from athena.live.brokers import BROKER_REGISTRY
for name, broker_class in BROKER_REGISTRY.items():
    broker = broker_class.get_instance()
    if broker:
        print(f'{name}: {broker.state.value}')
        print(f'Uptime: {broker.get_uptime():.1f}s')
"

# Force reconnection
python -c "
from athena.live.brokers.alpaca import AlpacaBroker
broker = AlpacaBroker.get_instance()
if broker:
    success = await broker.reconnect()
    print(f'Reconnection: {success}')
"
```

**Escalation:**
- If disconnected > 30 seconds: Close all positions manually via broker web interface
- If positions cannot be closed: Contact broker support immediately

---

## Daily Operations

### 📅 Pre-Market Checklist (8:00 AM EST)

**System Health:**
```bash
# Run daily health check
make health-check

# Check overnight P&L
python -c "
from athena.core.portfolio import get_daily_pnl
pnl = get_daily_pnl()
print(f'Overnight P&L: ${pnl:,.2f}')
"

# Verify broker connections
python scripts/check_brokers.py

# Review execution guard config
python -c "
from athena.live.execution_guard import ExecutionGuard
guard = ExecutionGuard.get_instance()
print('Daily Loss Limit:', guard.config.max_daily_loss_dollars)
print('Max Position Size:', guard.config.max_position_per_symbol_dollars)
"
```

**Risk Review:**
- [ ] Daily loss limits appropriate for market conditions
- [ ] Position size limits align with volatility
- [ ] Strategy parameters still valid
- [ ] No pending guard violations

### 📊 Market Open Procedures (9:30 AM EST)

**System Activation:**
```bash
# Enable trading (if halted)
python -c "
from athena.live.execution_guard import ExecutionGuard
guard = ExecutionGuard.get_instance()
guard.is_active = True
print('Execution guards active')
"

# Start market data feeds
python scripts/start_market_data.py

# Verify strategy parameters
python scripts/validate_strategies.py
```

**Monitoring Setup:**
- [ ] Prometheus dashboard accessible
- [ ] Alert channels functioning
- [ ] Log aggregation working
- [ ] Real-time P&L tracking active

### 🌙 Post-Market Procedures (4:00 PM EST)

**Daily Summary:**
```bash
# Generate daily report
python scripts/daily_report.py

# Archive logs
python scripts/archive_logs.py

# Update risk parameters for next day
python scripts/update_risk_params.py
```

**Cleanup:**
- [ ] Close unused broker connections
- [ ] Archive trade data
- [ ] Update strategy performance metrics
- [ ] Plan next day's risk limits

---

## Incident Response

### 📉 High Drawdown Event

**Assessment (< 5 minutes):**
1. **Identify cause**: Market crash vs strategy failure
2. **Calculate exposure**: Total risk across all positions
3. **Review correlations**: Are all positions moving together?

**Response Actions:**
```bash
# Calculate current drawdown
python -c "
from athena.core.risk import RiskManager
from athena.core.portfolio import get_equity_curve
rm = RiskManager()
equity = get_equity_curve()
dd = rm.calculate_max_drawdown(equity)
print(f'Current Drawdown: {dd:.2%}')
"

# Get position correlation matrix
python scripts/position_correlation.py

# Emergency position sizing reduction
python -c "
from athena.live.execution_guard import ExecutionGuard
guard = ExecutionGuard.get_instance()
# Reduce position limits by 50%
guard.config.max_position_per_symbol_dollars *= 0.5
print('Position limits reduced')
"
```

**Escalation Thresholds:**
- **5% drawdown**: Reduce position sizes by 25%
- **10% drawdown**: Halt new entries, review exits
- **15% drawdown**: Emergency stop, manual review required

### ⚡ High Slippage Alert

**Investigation:**
```bash
# Check recent slippage events
python -c "
from athena.ops import get_exporter
exporter = get_exporter()
# Query slippage metrics from last hour
"

# Identify affected symbols
python scripts/slippage_analysis.py

# Check market conditions
python scripts/market_volatility.py
```

**Mitigation:**
- **< 25 bps**: Monitor, no action
- **25-50 bps**: Switch to limit orders
- **> 50 bps**: Halt symbol trading, investigate

### 🔄 Excessive Order Rejections

**Diagnosis:**
```bash
# Check rejection reasons
python -c "
from athena.live.brokers.alpaca import AlpacaBroker
broker = AlpacaBroker.get_instance()
health = await broker.health_check()
print('Broker Health:', health)
"

# Review recent orders
python scripts/order_analysis.py --failed-only
```

**Common Causes & Fixes:**
- **Insufficient buying power**: Reduce position sizes
- **Invalid symbols**: Update symbol list
- **Rate limiting**: Implement order queuing
- **Market hours**: Verify trading session

---

## Recovery Procedures

### 🔧 System Recovery After Crash

**Step 1: Assess Damage**
```bash
# Check if any orders are orphaned
python scripts/reconcile_orders.py

# Verify position accuracy
python scripts/position_reconciliation.py

# Review execution guard state
python scripts/guard_state_check.py
```

**Step 2: Safe Restart**
```bash
# Start in safe mode (no new orders)
export ATHENA_SAFE_MODE=true
python -m athena.cli --safe-mode

# Manually verify each broker connection
python scripts/broker_connection_test.py

# Gradually enable trading
python scripts/gradual_restart.py
```

**Step 3: Validate Recovery**
```bash
# Run end-to-end test
python scripts/e2e_test.py

# Verify metrics collection
curl http://localhost:8090/metrics

# Check execution guard functionality
python scripts/test_guards.py
```

### 💾 Data Recovery

**Portfolio State Recovery:**
```bash
# Restore from last known good state
python scripts/restore_portfolio.py --timestamp "2024-01-15 09:30:00"

# Reconcile with broker positions
python scripts/broker_reconciliation.py

# Rebuild equity curve
python scripts/rebuild_equity_curve.py
```

**Trade History Recovery:**
```bash
# Download trade history from brokers
python scripts/download_trades.py --days 30

# Merge trade histories
python scripts/merge_trade_data.py

# Recalculate performance metrics
python scripts/recalc_metrics.py
```

---

## Monitoring & Alerts

### 📊 Key Metrics Dashboard

**Prometheus Queries:**
```promql
# Daily P&L
athena_daily_pnl_dollars

# Order success rate
rate(athena_orders_total{status="filled"}[5m]) / rate(athena_orders_total[5m])

# Average slippage
rate(athena_slippage_basis_points_sum[5m]) / rate(athena_slippage_basis_points_count[5m])

# Guard violations
increase(athena_guard_violations_total[1h])

# Broker latency
histogram_quantile(0.95, rate(athena_api_latency_seconds_bucket[5m]))
```

**Alert Rules:**
```yaml
# alerting.yml
groups:
  - name: athena_trading
    rules:
      - alert: HighDailyLoss
        expr: athena_daily_pnl_dollars < -5000
        for: 0m
        labels:
          severity: critical
        annotations:
          summary: "Daily loss exceeding $5,000"

      - alert: BrokerDisconnected
        expr: athena_broker_connection_status != 2  # 2 = connected
        for: 30s
        labels:
          severity: critical
        annotations:
          summary: "Broker disconnected"

      - alert: HighSlippage
        expr: rate(athena_slippage_basis_points_sum[5m]) / rate(athena_slippage_basis_points_count[5m]) > 50
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High slippage detected"
```

### 🚨 Alert Channels

**Slack Integration:**
```bash
# Send alert to Slack
curl -X POST -H 'Content-type: application/json' \
    --data '{"text":"🚨 ATHENA ALERT: Daily loss limit exceeded"}' \
    $SLACK_WEBHOOK_URL
```

**Email Alerts:**
```python
# In scripts/send_alert.py
from athena.core.notifications import send_email

send_email(
    to="trading-team@company.com",
    subject="ATHENA TRADING ALERT",
    body="Guard violation detected. Check dashboard immediately."
)
```

---

## Common Issues

### 🐛 "Order rejected - insufficient buying power"

**Cause:** Account balance insufficient for order size

**Fix:**
```bash
# Check account balance
python -c "
from athena.live.brokers.alpaca import AlpacaBroker
broker = AlpacaBroker.get_instance()
account = await broker.get_account()
print(f'Available: ${account.available_balance:,.2f}')
"

# Reduce position sizes
python scripts/reduce_position_sizes.py --factor 0.8
```

### 🐛 "Symbol not found"

**Cause:** Invalid or delisted symbol

**Fix:**
```bash
# Update symbol list
python scripts/update_symbols.py

# Remove invalid symbols
python scripts/clean_watchlist.py
```

### 🐛 "API rate limit exceeded"

**Cause:** Too many requests to broker API

**Fix:**
```bash
# Check current rate limits
python -c "
from athena.live.execution_guard import ExecutionGuard
guard = ExecutionGuard.get_instance()
print(f'Orders/min: {len([t for t in guard._order_timestamps if t > datetime.now() - timedelta(minutes=1)])}')
print(f'Limit: {guard.config.max_orders_per_minute}')
"

# Temporarily reduce order frequency
python scripts/adjust_order_frequency.py --reduce-by 50
```

### 🐛 "Execution guard violation"

**Cause:** Safety guard triggered

**Investigation:**
```bash
# Check recent violations
python -c "
from athena.live.execution_guard import ExecutionGuard
guard = ExecutionGuard.get_instance()
recent = [v for v in guard.violations if v.timestamp > datetime.now() - timedelta(hours=1)]
for violation in recent:
    print(f'{violation.timestamp}: {violation.type.value} - {violation.message}')
"

# Review guard configuration
python scripts/review_guard_config.py
```

**Resolution:**
- **Daily loss**: Wait for next trading day or manual override
- **Position size**: Reduce order size or close positions
- **Consecutive losses**: Review strategy, consider pause
- **Slippage**: Switch to limit orders, check market conditions

---

## Emergency Contacts

- **Trading Team Lead**: [phone] / [email]
- **Risk Manager**: [phone] / [email]
- **System Administrator**: [phone] / [email]
- **Broker Support**: [phone] / [email]

## Quick Reference

**Stop All Trading:**
```bash
python -c "
from athena.live.execution_guard import ExecutionGuard
guard = ExecutionGuard.get_instance()
await guard.force_halt('Manual halt')
"
```

**Resume Trading:**
```bash
python -c "
from athena.live.execution_guard import ExecutionGuard
guard = ExecutionGuard.get_instance()
await guard.resume_trading()
"
```

**Check System Status:**
```bash
make status
```

**Emergency Shutdown:**
```bash
make emergency-stop
```

---

*Last updated: 2024-01-15*
*Review frequency: Weekly*
*Next review: 2024-01-22*