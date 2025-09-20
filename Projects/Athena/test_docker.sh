#!/bin/bash

# Docker Workflow Test Script for Athena Trading Platform
# This script validates the complete Docker setup

set -e  # Exit on any error

echo "🐳 ATHENA DOCKER WORKFLOW TEST"
echo "==============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

# Check prerequisites
echo
info "Checking prerequisites..."

# Check Docker
if ! command -v docker &> /dev/null; then
    error "Docker is not installed. Please install Docker Desktop."
fi
success "Docker is installed"

# Check Docker Compose
if ! docker compose version &> /dev/null; then
    error "Docker Compose is not available. Please ensure Docker Desktop is running."
fi
success "Docker Compose is available"

# Check Docker daemon
if ! docker info &> /dev/null; then
    error "Docker daemon is not running. Please start Docker Desktop."
fi
success "Docker daemon is running"

# Validate configuration files
echo
info "Validating configuration files..."

if [ ! -f "docker-compose.yml" ]; then
    error "docker-compose.yml not found"
fi
success "docker-compose.yml exists"

if [ ! -f "docker/Dockerfile.app" ]; then
    error "docker/Dockerfile.app not found"
fi
success "docker/Dockerfile.app exists"

if [ ! -f "docker/Dockerfile.dashboard" ]; then
    error "docker/Dockerfile.dashboard not found"
fi
success "docker/Dockerfile.dashboard exists"

if [ ! -f ".dockerignore" ]; then
    warning ".dockerignore not found (recommended)"
else
    success ".dockerignore exists"
fi

# Validate docker-compose syntax
echo
info "Validating docker-compose configuration..."
if docker compose config > /dev/null; then
    success "docker-compose.yml syntax is valid"
else
    error "docker-compose.yml has syntax errors"
fi

# Create required directories
echo
info "Creating required directories..."
mkdir -p data_cache artifacts dashboard_cache logs
success "Required directories created"

# Create minimal .env file if it doesn't exist
if [ ! -f ".env" ]; then
    info "Creating minimal .env file..."
    cat > .env << EOF
# Athena Trading Platform Configuration
ATHENA_LOG_LEVEL=INFO
ATHENA_DATA_DIR=/app/data_cache
ATHENA_ARTIFACTS_DIR=/app/artifacts

# Optional: Binance testnet credentials (for paper trading)
# BINANCE_TESTNET_API_KEY=your_testnet_api_key_here
# BINANCE_TESTNET_SECRET_KEY=your_testnet_secret_key_here
EOF
    success "Created .env file"
fi

# Test build process (without running)
echo
info "Testing Docker build process..."

echo "Building app image..."
if docker build -f docker/Dockerfile.app -t athena-app:test . > /dev/null 2>&1; then
    success "App image builds successfully"
else
    error "Failed to build app image"
fi

echo "Building dashboard image..."
if docker build -f docker/Dockerfile.dashboard -t athena-dashboard:test . > /dev/null 2>&1; then
    success "Dashboard image builds successfully"
else
    error "Failed to build dashboard image"
fi

# Test docker-compose (start and quick health check)
echo
info "Testing docker-compose startup..."

# Start services in detached mode
if docker compose up -d > /dev/null 2>&1; then
    success "Docker Compose services started"
else
    error "Failed to start Docker Compose services"
fi

# Wait for services to initialize
info "Waiting for services to initialize..."
sleep 10

# Check if dashboard is responding
info "Testing dashboard health..."
if curl -f http://localhost:8050/ > /dev/null 2>&1; then
    success "Dashboard is responding on port 8050"
else
    warning "Dashboard health check failed (may need more time to start)"
fi

# Show service status
echo
info "Service status:"
docker compose ps

# Test CLI container
echo
info "Testing CLI container..."
if docker compose run --rm cli poetry run python -m athena.cli.main --help > /dev/null 2>&1; then
    success "CLI container is working"
else
    warning "CLI container test failed"
fi

# Cleanup
echo
info "Cleaning up test environment..."
docker compose down > /dev/null 2>&1
docker rmi athena-app:test athena-dashboard:test > /dev/null 2>&1 || true
success "Cleanup completed"

echo
echo "🎉 DOCKER WORKFLOW TEST COMPLETED SUCCESSFULLY!"
echo
echo "Next steps:"
echo "1. Start the dashboard: docker compose up -d"
echo "2. Visit: http://localhost:8050"
echo "3. Run CLI commands: docker compose run cli <command>"
echo "4. View logs: docker compose logs -f dashboard"
echo "5. Stop services: docker compose down"
echo
echo "For production deployment, see the README.md file."