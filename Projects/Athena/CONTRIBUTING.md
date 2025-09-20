# Contributing to Athena Trading Platform

Thank you for your interest in contributing to Athena! This document outlines the development process and guidelines for contributing to the project.

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Poetry 1.8+
- Git
- Docker (optional, for containerized development)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/athena.git
   cd athena
   ```

2. **Install dependencies**
   ```bash
   make setup
   ```

3. **Install pre-commit hooks**
   ```bash
   poetry run pre-commit install
   ```

4. **Run tests to verify setup**
   ```bash
   make test
   ```

### Development Environment

We use several tools to maintain code quality:

- **Poetry**: Dependency management
- **Ruff**: Linting and formatting
- **MyPy**: Type checking
- **Pytest**: Testing framework
- **Pre-commit**: Git hooks for code quality

## 📋 Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Write clean, well-documented code
- Add type hints to all functions
- Follow the existing code style
- Write tests for new functionality

### 3. Test Your Changes

```bash
# Run all tests
make test

# Run linting
make lint

# Run formatting
make format
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

We use [Conventional Commits](https://www.conventionalcommits.org/) format:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `test:` Test additions/changes
- `refactor:` Code refactoring
- `perf:` Performance improvements

### 5. Submit a Pull Request

1. Push your branch to GitHub
2. Create a Pull Request with a clear description
3. Ensure all CI checks pass
4. Request review from maintainers

## 🏗️ Project Structure

```
athena/
├── athena/                 # Main package
│   ├── core/              # Core utilities and types
│   ├── data/              # Data providers and caching
│   ├── strategies/        # Trading strategies
│   ├── backtest/          # Backtesting engine
│   ├── optimize/          # Parameter optimization
│   ├── live/              # Live trading and paper trading
│   ├── cli/               # Command-line interface
│   └── dashboard/         # Web dashboard
├── tests/                 # Test suite
├── docker/                # Docker configurations
├── docs/                  # Documentation
└── artifacts/             # Generated artifacts
```

## 🧪 Testing Guidelines

### Writing Tests

- Write unit tests for all new functions
- Include integration tests for complex workflows
- Use descriptive test names
- Mock external dependencies (APIs, databases)

### Test Categories

1. **Unit Tests**: Test individual functions/classes
2. **Integration Tests**: Test component interactions
3. **Performance Tests**: Verify performance requirements
4. **Security Tests**: Check for vulnerabilities

### Running Tests

```bash
# All tests
make test

# Specific test file
poetry run pytest tests/test_specific.py

# With coverage
poetry run pytest --cov=athena --cov-report=html
```

## 📊 Code Quality Standards

### Linting and Formatting

We use Ruff for both linting and formatting:

```bash
# Check formatting
poetry run ruff format --check .

# Apply formatting
poetry run ruff format .

# Check linting
poetry run ruff check .

# Fix linting issues
poetry run ruff check --fix .
```

### Type Hints

All functions must include type hints:

```python
from typing import Dict, List, Optional

def process_data(
    data: pd.DataFrame,
    params: Dict[str, float]
) -> Optional[pd.DataFrame]:
    """Process trading data with given parameters."""
    pass
```

### Documentation

- Use docstrings for all public functions
- Include parameter descriptions and return types
- Add examples for complex functions

```python
def calculate_returns(prices: pd.Series) -> pd.Series:
    """Calculate percentage returns from price series.

    Args:
        prices: Series of asset prices

    Returns:
        Series of percentage returns

    Example:
        >>> prices = pd.Series([100, 102, 99])
        >>> returns = calculate_returns(prices)
        >>> print(returns)
        0         NaN
        1    0.020000
        2   -0.029412
    """
    return prices.pct_change()
```

## 🔧 Contributing to Specific Areas

### Adding New Strategies

1. Create strategy class inheriting from `BaseStrategy`
2. Implement required methods: `generate_signals()`, `get_name()`
3. Add parameter space in `optimize/optimizer.py`
4. Write comprehensive tests
5. Update documentation

### Adding Data Providers

1. Inherit from `BaseDataProvider`
2. Implement caching mechanism
3. Add error handling and retries
4. Include rate limiting
5. Write integration tests

### Dashboard Enhancements

1. Follow Dash/Plotly best practices
2. Ensure responsive design
3. Add loading states and error handling
4. Test with different data sizes
5. Optimize performance

## 🚦 CI/CD Pipeline

Our CI pipeline includes:

1. **Code Quality**: Linting, formatting, type checking
2. **Testing**: Unit, integration, and performance tests
3. **Security**: Dependency scanning and security linting
4. **Docker**: Image building and testing
5. **Documentation**: Verification of required docs

All checks must pass before merging.

## 📝 Documentation

### API Documentation

- Use clear, concise docstrings
- Include examples where helpful
- Document exceptions that may be raised

### README Updates

When adding features, update the README with:
- New CLI commands
- Configuration options
- Usage examples

## 🐛 Bug Reports

When reporting bugs, include:

1. **Environment**: Python version, OS, Poetry version
2. **Steps to Reproduce**: Clear, minimal example
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Logs**: Relevant error messages or logs

## 💡 Feature Requests

For new features:

1. **Use Case**: Describe the problem being solved
2. **Proposed Solution**: High-level approach
3. **Alternatives**: Other solutions considered
4. **Impact**: Who benefits and how

## 📞 Getting Help

- **Issues**: GitHub Issues for bugs and feature requests
- **Discussions**: GitHub Discussions for questions
- **Documentation**: Check existing docs and examples

## 🎉 Recognition

Contributors are recognized in:
- CHANGELOG.md for notable contributions
- README.md contributors section
- Release notes for major features

Thank you for contributing to Athena! 🚀