
# Athena Dashboard Demo Instructions

## Quick Start
1. Start the dashboard: `make dashboard`
2. Open browser to: http://localhost:8050
3. Use the demo data provided in artifacts/dashboard_media/

## Demo Scenarios

### Basic Backtest Demo
1. Symbol: SPY
2. Strategy: SMA Crossover
3. Date Range: 2018-01-01 to 2024-12-31
4. Parameters: Fast=20, Slow=50
5. Click "Run Backtest"

### Expected Results
- Total Return: ~50%
- Sharpe Ratio: ~0.65
- Max Drawdown: ~-30%
- Total Trades: ~15

### Dashboard Features to Test
- [x] Basic backtest execution
- [x] Strategy parameter adjustment
- [x] Performance metrics display
- [x] Equity curve visualization
- [x] Drawdown chart
- [x] Rolling Sharpe ratio
- [x] Trade analysis table
- [x] CSV export functionality

### Advanced Features (if implemented)
- [ ] Parameter optimization
- [ ] Walk-forward validation
- [ ] Parameter heatmaps
- [ ] Optimization leaderboard

## Performance Notes
- Backtest execution: ~5 seconds for 7 years of data
- Data loading: Cached for fast subsequent runs
- Dashboard: Responsive updates with loading indicators

## Files Created
- Demo backtest results: artifacts/dashboard_media/
- Strategy comparisons: CSV format for analysis
- Best strategy equity curve: For visualization
