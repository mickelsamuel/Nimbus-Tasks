# Repository Structure

Generated: Athena/

```
├── .github/
│   └── workflows/
│       └── ... (1 files)
├── artifacts/
│   ├── backtests/
│   │   └── ... (4 files)
│   ├── best_params/
│   │   └── ... (3 files)
│   ├── coverage/
│   │   ├── htmlcov/
│   │   └── ... (1 files)
│   ├── dashboard/
│   │   └── ... (1 files)
│   ├── dashboard_media/
│   │   └── ... (8 files)
│   ├── dashboard_screens/
│   ├── data/
│   │   └── ... (7 files)
│   ├── logs/
│   ├── misc/
│   │   └── ... (3 files)
│   ├── optimization/
│   │   └── ... (3 files)
│   ├── paper_trading/
│   │   └── ... (1 files)
│   ├── plots/
│   ├── portfolio/
│   │   └── ... (7 files)
│   ├── security/
│   │   └── ... (1 files)
│   └── wfv/
│       └── ... (9 files)
├── athena/
│   ├── backtest/
│   │   └── ... (4 files)
│   ├── cli/
│   │   └── ... (2 files)
│   ├── core/
│   │   └── ... (6 files)
│   ├── dashboard/
│   │   └── ... (2 files)
│   ├── data/
│   │   └── ... (2 files)
│   ├── live/
│   │   ├── brokers/
│   │   └── ... (5 files)
│   ├── ops/
│   │   └── ... (2 files)
│   ├── optimize/
│   │   └── ... (2 files)
│   ├── strategies/
│   │   └── ... (5 files)
│   └── __init__.py
├── backtest_results/
│   ├── AAPL_momentum_20250920_112211.txt
│   ├── SPY_bollinger_20250920_112226.txt
│   ├── SPY_sma_20250920_082015.txt
│   ├── SPY_sma_20250920_112156.txt
│   └── SPY_sma_20250920_125610.txt
├── dashboard_cache/
├── data_cache/
│   ├── AAPL_1d_0cfbee2f.parquet
│   ├── AAPL_1d_5208b669.parquet
│   ├── AAPL_1d_58d0e045.parquet
│   ├── AAPL_1d_7070ee70.parquet
│   ├── AAPL_1d_b9236544.parquet
│   ├── SPY_1d_9aa63c0f.parquet
│   ├── SPY_1d_c41b298c.parquet
│   └── SPY_1d_fdf5fcfd.parquet
├── docker/
│   ├── Dockerfile.app
│   └── Dockerfile.dashboard
├── docs/
│   ├── archive/
│   │   └── ... (2 files)
│   ├── ATHENA_VALIDATION_REPORT.md
│   ├── PRODUCTION_SAFETY_SUMMARY.md
│   ├── index.md
│   └── linkedin_post.md
├── scripts/
│   ├── archive/
│   │   └── ... (3 files)
│   ├── cleanup.py
│   ├── generate_tree.py
│   ├── link_check.py
│   ├── portfolio_demo.py
│   ├── test_paper_trading.py
│   └── validate_safety_guards.py
├── tests/
│   ├── __init__.py
│   ├── test_cli.py
│   ├── test_dashboard.py
│   ├── test_data.py
│   ├── test_golden_backtest.py
│   ├── test_integration.py
│   ├── test_metrics.py
│   ├── test_risk.py
│   └── test_strategies.py
├── wfv_results/
│   ├── AAPL_Bollinger_Bands_20250920_112318_metrics.csv
│   ├── AAPL_Bollinger_Bands_20250920_112318_summary.json
│   ├── SPY_SMA_Crossover_20250920_083309_metrics.csv
│   ├── SPY_SMA_Crossover_20250920_083309_summary.json
│   ├── SPY_SMA_Crossover_20250920_112259_metrics.csv
│   └── SPY_SMA_Crossover_20250920_112259_summary.json
├── .env.example
├── .pre-commit-config.yaml
├── ATHENA_PORTFOLIO_REPORT.md
├── CLEANUP_PLAN.json
├── CLEANUP_PLAN.md
├── CONTRIBUTING.md
├── Makefile
├── PLAYBOOKS.md
├── README.md
├── SECURITY.md
├── docker-compose.yml
├── poetry.lock
├── pyproject.toml
├── resume_bullets.txt
└── test_docker.sh
```