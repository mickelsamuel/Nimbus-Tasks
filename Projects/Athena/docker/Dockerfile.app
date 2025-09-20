# Dockerfile for Athena CLI/Backtest
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install poetry==1.8.3

# Configure Poetry
ENV POETRY_NO_INTERACTION=1 \
    POETRY_VENV_IN_PROJECT=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache

# Copy Poetry files
COPY pyproject.toml poetry.lock ./

# Install dependencies
RUN poetry install --no-dev && rm -rf $POETRY_CACHE_DIR

# Copy application code
COPY athena/ ./athena/
COPY Makefile ./
COPY README.md ./

# Create directories for data and artifacts
RUN mkdir -p data_cache artifacts logs

# Set environment variables
ENV PYTHONPATH=/app
ENV ATHENA_LOG_LEVEL=INFO
ENV ATHENA_DATA_DIR=/app/data_cache
ENV ATHENA_ARTIFACTS_DIR=/app/artifacts

# Create non-root user
RUN useradd -m -u 1000 athena && chown -R athena:athena /app
USER athena

# Default command
CMD ["poetry", "run", "python", "-m", "athena.cli.main", "--help"]