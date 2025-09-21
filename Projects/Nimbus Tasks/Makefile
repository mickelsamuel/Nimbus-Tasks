# Nimbus Tasks Monorepo Makefile

.PHONY: help dev build test clean setup cleanup

# Default target
help:
	@echo "Nimbus Tasks Monorepo Commands"
	@echo "=============================="
	@echo "setup          - Initial project setup"
	@echo "dev            - Start development servers"
	@echo "dev-stack      - Start dev with Docker services"
	@echo "build          - Build all packages"
	@echo "test           - Run all tests"
	@echo "test-e2e       - Run end-to-end tests"
	@echo "lint           - Run linting"
	@echo "format         - Format code"
	@echo "clean          - Clean build artifacts"
	@echo "cleanup-plan   - Generate cleanup plan"
	@echo "cleanup-apply  - Apply cleanup plan"
	@echo "cleanup-verify - Verify cleanup (run all checks)"
	@echo "docker-up      - Start Docker services"
	@echo "docker-down    - Stop Docker services"

# Development
setup:
	pnpm install
	pnpm db:push
	pnpm db:seed

dev:
	pnpm dev

dev-stack:
	pnpm dev:stack

# Building
build:
	pnpm build

# Testing
test:
	pnpm test:unit

test-e2e:
	pnpm test:e2e

# Code quality
lint:
	pnpm lint

format:
	pnpm format

# Cleanup
clean:
	pnpm clean

cleanup-plan:
	pnpm cleanup:plan

cleanup-apply:
	pnpm cleanup:apply

cleanup-verify:
	pnpm cleanup:verify

# Docker
docker-up:
	pnpm docker:up

docker-down:
	pnpm docker:down

# Database
db-setup:
	pnpm db:push
	pnpm db:seed

# Full verification pipeline
verify: lint build test test-e2e
	@echo "✅ All verification checks passed!"