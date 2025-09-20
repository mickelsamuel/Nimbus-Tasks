.PHONY: help setup install test lint format clean run-dashboard backtest-demo cleanup-plan cleanup-apply cleanup-verify repo-tree link-check

# Variables
PYTHON := python3
POETRY := poetry
PROJECT := athena

help:  ## Show this help
	@echo "Athena Trading Platform - Makefile Commands"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

setup: install pre-commit-install  ## Complete project setup
	@echo "✅ Project setup complete!"

install:  ## Install dependencies with Poetry
	$(POETRY) install
	@echo "✅ Dependencies installed"

pre-commit-install:  ## Install pre-commit hooks
	$(POETRY) run pre-commit install
	@echo "✅ Pre-commit hooks installed"

test:  ## Run tests with pytest
	$(POETRY) run pytest tests/ -v --cov=$(PROJECT) --cov-report=term-missing

test-fast:  ## Run tests without coverage
	$(POETRY) run pytest tests/ -v

lint:  ## Run linting (ruff + mypy)
	@echo "Running ruff..."
	$(POETRY) run ruff check $(PROJECT)
	@echo "Running mypy..."
	$(POETRY) run mypy $(PROJECT) --ignore-missing-imports

format:  ## Format code (black + isort)
	@echo "Running isort..."
	$(POETRY) run isort $(PROJECT) tests
	@echo "Running black..."
	$(POETRY) run black $(PROJECT) tests
	@echo "✅ Code formatted"

fmt: format  ## Alias for format

clean:  ## Clean cache and build files
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type f -name ".coverage" -delete
	rm -rf .pytest_cache
	rm -rf .mypy_cache
	rm -rf .ruff_cache
	rm -rf dist
	rm -rf build
	rm -rf *.egg-info
	@echo "✅ Cleaned cache and build files"

backtest-demo:  ## Run demo backtest (SPY with SMA strategy)
	@echo "🚀 Running demo backtest on SPY..."
	$(POETRY) run python -m athena.cli.main backtest SPY \
		--start 2018-01-01 \
		--end 2024-12-31 \
		--strategy sma \
		--fast-period 20 \
		--slow-period 50

dashboard:  ## Launch the web dashboard
	@echo "🌐 Launching dashboard at http://localhost:8050..."
	$(POETRY) run python -m athena.dashboard.app

ingest-demo:  ## Download demo data for major indices
	@echo "📥 Downloading demo data..."
	$(POETRY) run python -m athena.cli.main ingest "SPY,QQQ,IWM,DIA" \
		--start 2020-01-01 \
		--end 2024-12-31

cache-info:  ## Show cache information
	$(POETRY) run python -m athena.cli.main cache info

cache-clear:  ## Clear all cached data
	$(POETRY) run python -m athena.cli.main cache clear

docker-build:  ## Build Docker images
	docker build -t athena:latest -f docker/Dockerfile .
	@echo "✅ Docker image built"

docker-run:  ## Run Athena in Docker
	docker run -it --rm \
		-v $(PWD)/data_cache:/app/data_cache \
		-v $(PWD)/.env:/app/.env \
		-p 8050:8050 \
		athena:latest

check: lint test  ## Run all checks (lint + test)
	@echo "✅ All checks passed!"

dev:  ## Run in development mode with auto-reload
	$(POETRY) run python -m athena.cli.main --help

shell:  ## Open Python shell with project context
	$(POETRY) run python

update:  ## Update dependencies
	$(POETRY) update
	@echo "✅ Dependencies updated"

demo:  ## Run comprehensive demo
	@echo "🎭 Running Athena demo..."
	$(POETRY) run python demo.py

validate:  ## Run comprehensive validation
	@echo "🔍 Validating Athena platform..."
	$(POETRY) run python validate_athena.py

docker-test:  ## Test Docker workflow (requires Docker)
	@echo "🐳 Testing Docker workflow..."
	./test_docker.sh

docker-up:  ## Start Docker services
	docker compose up -d
	@echo "🚀 Dashboard available at http://localhost:8050"

docker-down:  ## Stop Docker services
	docker compose down

docker-logs:  ## View Docker logs
	docker compose logs -f dashboard

.DEFAULT_GOAL := help
demo-media:  ## Create dashboard screenshots and demo GIF
	@echo "📸 Creating dashboard media..."
	mkdir -p artifacts/dashboard_media
	@echo "Please run the dashboard and create screenshots/GIF manually"
	@echo "Dashboard URL: http://localhost:8050"

test-coverage:  ## Run tests and check coverage threshold
	$(POETRY) run pytest tests/ -v --cov=$(PROJECT) --cov-report=term-missing --cov-fail-under=80

demo-oneclick:  ## One-click portfolio demo for hiring showcase
	@echo "🎯 Running one-click portfolio demo..."
	@echo "📊 This will download data, run backtests, optimize, and generate HTML report"
	$(POETRY) run python scripts/portfolio_demo.py
	@echo ""
	@echo "✅ Demo complete! View results:"
	@echo "   📄 Main Report: file://$(PWD)/artifacts/portfolio/portfolio_demo_report.html"
	@echo "   📈 Equity Curves: file://$(PWD)/artifacts/portfolio/equity_curves.html"
	@echo "   🔥 Optimization: file://$(PWD)/artifacts/portfolio/optimization_heatmap.html"

# === Repository Cleanup Targets ===

cleanup-plan:  ## Generate cleanup plan (dry-run)
	@echo "🧹 Analyzing repository for cleanup..."
	$(PYTHON) scripts/cleanup.py
	@echo "📋 Review CLEANUP_PLAN.md before applying"

cleanup-apply:  ## Apply cleanup plan (after review)
	@echo "⚠️  Applying cleanup plan..."
	@if [ ! -f CLEANUP_PLAN.json ]; then \
		echo "❌ No cleanup plan found. Run 'make cleanup-plan' first."; \
		exit 1; \
	fi
	@echo "🗑️  Removing temporary files..."
	@$(PYTHON) -c "import json; plan=json.load(open('CLEANUP_PLAN.json')); \
		import os, shutil; \
		[os.remove(item['path']) if item['action']=='delete' and os.path.exists(item['path']) else None \
		 for item in plan['cleanup_plan'] if item['action']=='delete']; \
		[os.makedirs(os.path.dirname(item['destination']), exist_ok=True) for item in plan['cleanup_plan'] if item['action']=='move']; \
		[shutil.move(item['path'], item['destination']) if item['action']=='move' and os.path.exists(item['path']) else None \
		 for item in plan['cleanup_plan'] if item['action']=='move']"
	@git add .
	@git commit -m "🧹 Repository cleanup: Remove temp files, reorganize docs\n\n🤖 Generated with automated cleanup tool\n\nCo-Authored-By: Claude <noreply@anthropic.com>"
	@echo "✅ Cleanup applied and committed"

cleanup-verify:  ## Verify repository after cleanup
	@echo "🔍 Running post-cleanup verification..."
	@echo "1️⃣ Generating repository tree..."
	@$(PYTHON) scripts/generate_tree.py
	@echo "2️⃣ Checking documentation links..."
	@$(PYTHON) scripts/link_check.py
	@echo "3️⃣ Running code quality checks..."
	@$(MAKE) lint || echo "⚠️ Lint issues found"
	@$(MAKE) test-fast || echo "⚠️ Test issues found"
	@echo "✅ Verification complete"

repo-tree:  ## Generate repository structure tree
	@echo "🌳 Generating repository tree..."
	$(PYTHON) scripts/generate_tree.py

link-check:  ## Check all documentation links
	@echo "🔗 Checking documentation links..."
	$(PYTHON) scripts/link_check.py
