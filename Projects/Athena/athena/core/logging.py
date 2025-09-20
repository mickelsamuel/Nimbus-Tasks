"""Logging configuration using structlog."""

import logging

import structlog
from rich.console import Console
from rich.logging import RichHandler

from athena.core.config import settings


def setup_logging() -> None:
    """Configure structlog with rich formatting for development."""
    # Configure standard logging for libraries
    logging.basicConfig(
        level=getattr(logging, settings.log_level),
        handlers=[
            RichHandler(
                console=Console(stderr=True), rich_tracebacks=True, show_time=True, show_path=False
            )
        ],
        format="%(message)s",
        datefmt="[%X]",
    )

    # Configure structlog
    structlog.configure(
        processors=[
            structlog.stdlib.add_log_level,
            structlog.stdlib.add_logger_name,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            (
                structlog.dev.ConsoleRenderer()
                if settings.env == "development"
                else structlog.processors.JSONRenderer()
            ),
        ],
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )


def get_logger(name: str) -> structlog.BoundLogger:
    """Get a configured logger instance.

    Args:
        name: Logger name, typically __name__ of the module

    Returns:
        Configured structlog logger
    """
    return structlog.get_logger(name)


# Initialize logging on module import
setup_logging()
