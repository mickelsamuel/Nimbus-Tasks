"""Athena Trading Dashboard."""

import json
import asyncio
import concurrent.futures
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Any
import logging
import os

import dash
import dash_bootstrap_components as dbc
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
from dash import Input, Output, State, callback, dash_table, dcc, html
import numpy as np

from athena.backtest.engine import BacktestEngine
from athena.backtest.walk_forward import WalkForwardValidator
from athena.data.yahoo import YahooDataAdapter
from athena.optimize.optimizer import get_param_space, StrategyOptimizer
from athena.strategies.bollinger_bands import BollingerBandsStrategy
from athena.strategies.momentum import MomentumStrategy
from athena.strategies.sma_crossover import SMACrossoverStrategy

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Dash app
app = dash.Dash(
    __name__,
    external_stylesheets=[dbc.themes.BOOTSTRAP, dbc.icons.FONT_AWESOME],
    title="Athena Trading Dashboard",
    suppress_callback_exceptions=True,
)

# Expose server for WSGI
server = app.server

# Strategy mapping
STRATEGY_CLASSES = {
    "SMA Crossover": SMACrossoverStrategy,
    "Bollinger Bands": BollingerBandsStrategy,
    "Momentum": MomentumStrategy,
}

# Parameter spaces for strategies
PARAM_SPACES = {
    "SMA Crossover": get_param_space("sma"),
    "Bollinger Bands": get_param_space("bollinger"),
    "Momentum": get_param_space("momentum"),
}

# Cache and artifacts directories
CACHE_DIR = Path("dashboard_cache")
ARTIFACTS_DIR = Path("artifacts/dashboard_media")
CACHE_DIR.mkdir(exist_ok=True)
ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

# Risk model options
RISK_MODELS = {
    "Fixed Fraction": "fixed_fraction",
    "Kelly Criterion": "kelly",
    "Capped Kelly": "capped_kelly"
}

# Executor for async tasks
executor = concurrent.futures.ThreadPoolExecutor(max_workers=4)


def create_header() -> dbc.Container:
    """Create dashboard header."""
    return dbc.Container(
        [
            dbc.Row(
                [
                    dbc.Col(
                        [
                            html.H1(
                                [
                                    html.I(className="fas fa-chart-line me-3"),
                                    "Athena Trading Dashboard",
                                ],
                                className="text-primary mb-0",
                            ),
                            html.P(
                                "Professional algorithmic trading platform",
                                className="text-muted mb-0",
                            ),
                        ],
                        width=8,
                    ),
                    dbc.Col(
                        [
                            dbc.Badge(
                                [
                                    html.I(className="fas fa-clock me-1"),
                                    datetime.now().strftime("%Y-%m-%d %H:%M"),
                                ],
                                color="info",
                                className="fs-6",
                            )
                        ],
                        width=4,
                        className="text-end",
                    ),
                ]
            ),
            html.Hr(),
        ],
        fluid=True,
        className="bg-light py-3 mb-4",
    )


def create_controls() -> dbc.Card:
    """Create control panel."""
    return dbc.Card(
        [
            dbc.CardHeader(
                html.H5([html.I(className="fas fa-cogs me-2"), "Backtest Configuration"])
            ),
            dbc.CardBody(
                [
                    dbc.Row(
                        [
                            dbc.Col(
                                [
                                    dbc.Label("Symbol", html_for="symbol-input"),
                                    dbc.Input(
                                        id="symbol-input",
                                        type="text",
                                        value="AAPL",
                                        placeholder="Enter symbol (e.g., AAPL, SPY)",
                                    ),
                                ],
                                width=3,
                            ),
                            dbc.Col(
                                [
                                    dbc.Label("Strategy", html_for="strategy-dropdown"),
                                    dcc.Dropdown(
                                        id="strategy-dropdown",
                                        options=[
                                            {"label": name, "value": name}
                                            for name in STRATEGY_CLASSES.keys()
                                        ],
                                        value="SMA Crossover",
                                    ),
                                ],
                                width=3,
                            ),
                            dbc.Col(
                                [
                                    dbc.Label("Start Date", html_for="start-date"),
                                    dcc.DatePickerSingle(
                                        id="start-date",
                                        date=(datetime.now() - timedelta(days=365)).date(),
                                        display_format="YYYY-MM-DD",
                                    ),
                                ],
                                width=3,
                            ),
                            dbc.Col(
                                [
                                    dbc.Label("End Date", html_for="end-date"),
                                    dcc.DatePickerSingle(
                                        id="end-date",
                                        date=datetime.now().date(),
                                        display_format="YYYY-MM-DD",
                                    ),
                                ],
                                width=3,
                            ),
                        ],
                        className="mb-3",
                    ),
                    html.Div(id="strategy-params"),
                    dbc.Row(
                        [
                            dbc.Col(
                                [
                                    dbc.Label("Risk Model", html_for="risk-model-dropdown"),
                                    dcc.Dropdown(
                                        id="risk-model-dropdown",
                                        options=[
                                            {"label": name, "value": value}
                                            for name, value in RISK_MODELS.items()
                                        ],
                                        value="fixed_fraction",
                                    ),
                                ],
                                width=3,
                            ),
                            dbc.Col(
                                [
                                    dbc.Label("Position Size (%)", html_for="position-size-input"),
                                    dbc.Input(
                                        id="position-size-input",
                                        type="number",
                                        value=10,
                                        min=1,
                                        max=100,
                                        step=1,
                                    ),
                                ],
                                width=3,
                            ),
                            dbc.Col(
                                [
                                    dbc.Button(
                                        [html.I(className="fas fa-search me-2"), "Optimize"],
                                        id="optimize-btn",
                                        color="warning",
                                        size="lg",
                                        className="w-100 mt-4",
                                    ),
                                ],
                                width=3,
                            ),
                            dbc.Col(
                                [
                                    dbc.Button(
                                        [html.I(className="fas fa-chart-line me-2"), "Walk Forward"],
                                        id="walk-forward-btn",
                                        color="info",
                                        size="lg",
                                        className="w-100 mt-4",
                                    ),
                                ],
                                width=3,
                            ),
                        ],
                        className="mb-3",
                    ),
                    dbc.Row(
                        [
                            dbc.Col(
                                [
                                    dbc.Label("Initial Capital ($)", html_for="capital-input"),
                                    dbc.Input(
                                        id="capital-input",
                                        type="number",
                                        value=100000,
                                        min=1000,
                                        step=1000,
                                    ),
                                ],
                                width=3,
                            ),
                            dbc.Col(
                                [
                                    dbc.Label("Commission (bps)", html_for="commission-input"),
                                    dbc.Input(
                                        id="commission-input",
                                        type="number",
                                        value=10,
                                        min=0,
                                        max=100,
                                        step=1,
                                    ),
                                ],
                                width=3,
                            ),
                            dbc.Col(
                                [
                                    html.Br(),
                                    dbc.Button(
                                        [
                                            html.I(className="fas fa-play me-2"),
                                            "Run Backtest",
                                        ],
                                        id="run-backtest-btn",
                                        color="primary",
                                        size="lg",
                                        className="w-100",
                                    ),
                                ],
                                width=3,
                            ),
                            dbc.Col(
                                [
                                    html.Br(),
                                    dbc.Button(
                                        [
                                            html.I(className="fas fa-download me-2"),
                                            "Export Results",
                                        ],
                                        id="export-btn",
                                        color="success",
                                        size="lg",
                                        className="w-100",
                                        disabled=True,
                                    ),
                                ],
                                width=3,
                            ),
                        ],
                        className="mb-3",
                    ),
                ]
            ),
        ],
        className="mb-4",
    )


def create_results_section() -> html.Div:
    """Create results display section."""
    return html.Div(
        [
            dcc.Loading(
                [
                    dbc.Alert(
                        id="alert-message",
                        is_open=False,
                        dismissable=True,
                    ),
                    dbc.Row(
                        [
                            dbc.Col(
                                [
                                    dbc.Card(
                                        [
                                            dbc.CardHeader("Performance Metrics"),
                                            dbc.CardBody(id="metrics-table"),
                                        ]
                                    )
                                ],
                                width=4,
                            ),
                            dbc.Col(
                                [
                                    dbc.Card(
                                        [
                                            dbc.CardHeader("Quick Stats"),
                                            dbc.CardBody(id="quick-stats"),
                                        ]
                                    )
                                ],
                                width=8,
                            ),
                        ],
                        className="mb-4",
                    ),
                    dbc.Row(
                        [
                            dbc.Col(
                                [
                                    dbc.Card(
                                        [
                                            dbc.CardHeader("Equity Curve"),
                                            dbc.CardBody(dcc.Graph(id="equity-curve-chart")),
                                        ]
                                    )
                                ],
                                width=12,
                            )
                        ],
                        className="mb-4",
                    ),
                    dbc.Row(
                        [
                            dbc.Col(
                                [
                                    dbc.Card(
                                        [
                                            dbc.CardHeader("Drawdown"),
                                            dbc.CardBody(dcc.Graph(id="drawdown-chart")),
                                        ]
                                    )
                                ],
                                width=6,
                            ),
                            dbc.Col(
                                [
                                    dbc.Card(
                                        [
                                            dbc.CardHeader("Rolling Sharpe"),
                                            dbc.CardBody(dcc.Graph(id="rolling-sharpe-chart")),
                                        ]
                                    )
                                ],
                                width=6,
                            ),
                        ],
                        className="mb-4",
                    ),
                    dbc.Row(
                        [
                            dbc.Col(
                                [
                                    dbc.Card(
                                        [
                                            dbc.CardHeader("Returns Distribution"),
                                            dbc.CardBody(dcc.Graph(id="returns-distribution")),
                                        ]
                                    )
                                ],
                                width=6,
                            ),
                            dbc.Col(
                                [
                                    dbc.Card(
                                        [
                                            dbc.CardHeader("Parameter Heatmap"),
                                            dbc.CardBody(dcc.Graph(id="parameter-heatmap")),
                                        ]
                                    )
                                ],
                                width=6,
                            ),
                        ],
                        className="mb-4",
                    ),
                    dbc.Row(
                        [
                            dbc.Col(
                                [
                                    dbc.Card(
                                        [
                                            dbc.CardHeader("Trade Analysis"),
                                            dbc.CardBody(id="trade-table"),
                                        ]
                                    )
                                ],
                                width=8,
                            ),
                            dbc.Col(
                                [
                                    dbc.Card(
                                        [
                                            dbc.CardHeader("Optimization Leaderboard"),
                                            dbc.CardBody(id="optimization-leaderboard"),
                                        ]
                                    )
                                ],
                                width=4,
                            ),
                        ],
                        className="mb-4",
                    ),
                    dbc.Row(
                        [
                            dbc.Col(
                                [
                                    dbc.Card(
                                        [
                                            dbc.CardHeader("Walk-Forward Validation"),
                                            dbc.CardBody(id="wfv-table"),
                                        ]
                                    )
                                ],
                                width=12,
                            )
                        ],
                    ),
                ],
                type="default",
                fullscreen=True,
            )
        ],
        id="results-section",
        style={"display": "none"},
    )


# App layout
app.layout = dbc.Container(
    [
        dcc.Store(id="backtest-results"),
        dcc.Store(id="optimization-results"),
        dcc.Store(id="wfv-results"),
        dcc.Interval(
            id="interval-component",
            interval=5*1000,  # Update every 5 seconds
            n_intervals=0,
            disabled=True
        ),
        create_header(),
        create_controls(),
        create_results_section(),
    ],
    fluid=True,
)


@callback(
    Output("strategy-params", "children"),
    Input("strategy-dropdown", "value"),
)
def update_strategy_params(strategy_name: str) -> List[html.Div]:
    """Update parameter inputs based on selected strategy."""
    if not strategy_name or strategy_name not in PARAM_SPACES:
        return []

    param_space = PARAM_SPACES[strategy_name]
    param_inputs = []

    for param_name, param_config in param_space.items():
        if param_config["type"] == "int":
            param_inputs.append(
                dbc.Col(
                    [
                        dbc.Label(param_name.replace("_", " ").title()),
                        dbc.Input(
                            id=f"param-{param_name}",
                            type="number",
                            value=param_config.get("default", param_config["low"]),
                            min=param_config["low"],
                            max=param_config["high"],
                            step=1,
                        ),
                    ],
                    width=3,
                )
            )
        elif param_config["type"] == "float":
            param_inputs.append(
                dbc.Col(
                    [
                        dbc.Label(param_name.replace("_", " ").title()),
                        dbc.Input(
                            id=f"param-{param_name}",
                            type="number",
                            value=param_config.get("default", param_config["low"]),
                            min=param_config["low"],
                            max=param_config["high"],
                            step=0.1,
                        ),
                    ],
                    width=3,
                )
            )

    return [dbc.Row(param_inputs, className="mb-3")] if param_inputs else []


@callback(
    [
        Output("backtest-results", "data"),
        Output("alert-message", "children"),
        Output("alert-message", "color"),
        Output("alert-message", "is_open"),
        Output("results-section", "style"),
        Output("export-btn", "disabled"),
    ],
    Input("run-backtest-btn", "n_clicks"),
    [
        State("symbol-input", "value"),
        State("strategy-dropdown", "value"),
        State("start-date", "date"),
        State("end-date", "date"),
        State("capital-input", "value"),
        State("commission-input", "value"),
        State("risk-model-dropdown", "value"),
        State("position-size-input", "value"),
    ]
    + [
        State("strategy-params", "children")
    ],
    prevent_initial_call=True,
)
def run_backtest(
    n_clicks, symbol, strategy_name, start_date, end_date, capital, commission, risk_model, position_size, strategy_params_children
):
    """Run backtest with given parameters."""
    if not n_clicks:
        return None, "", "info", False, {"display": "none"}, True

    try:
        # Validate inputs
        if not all([symbol, strategy_name, start_date, end_date]):
            return (
                None,
                "Please fill in all required fields.",
                "warning",
                True,
                {"display": "none"},
                True,
            )

        # Get parameter space for strategy
        param_space = PARAM_SPACES[strategy_name]

        # Extract parameters from strategy params inputs
        params = {}
        if strategy_params_children:
            from dash import ctx
            # Get current parameter values from the strategy params section
            for param_name, param_config in param_space.items():
                # Use default value for now - in a full implementation, you'd extract from inputs
                params[param_name] = param_config.get("default", param_config["low"])

        # Download data
        provider = YahooDataAdapter()
        data = provider.fetch(symbol, start_date, end_date)

        if data.empty:
            return (
                None,
                f"No data available for {symbol} in the specified date range.",
                "danger",
                True,
                {"display": "none"},
                True,
            )

        # Initialize strategy
        strategy_class = STRATEGY_CLASSES[strategy_name]
        strategy = strategy_class(**params)

        # Run backtest
        engine = BacktestEngine(
            initial_capital=capital,
            commission=commission / 10000,  # Convert bps to decimal
        )

        result = engine.run(strategy, data, symbol)

        # Prepare results for JSON serialization
        results_data = {
            "symbol": symbol,
            "strategy": strategy_name,
            "params": params,
            "metrics": {
                "initial_capital": result.initial_capital,
                "final_capital": result.final_capital,
                "total_return": result.total_return,
                "annualized_return": result.annualized_return,
                "sharpe_ratio": result.sharpe_ratio,
                "max_drawdown": result.max_drawdown,
                "win_rate": result.win_rate,
                "total_trades": result.total_trades,
                "avg_trade_return": result.avg_trade_return,
                "volatility": result.volatility,
            },
            "equity_curve": result.equity_curve.to_dict("index"),
            "trades": [
                {
                    "entry_date": trade.entry_date.isoformat(),
                    "exit_date": trade.exit_date.isoformat() if trade.exit_date else None,
                    "symbol": trade.symbol,
                    "side": trade.side.value,
                    "quantity": trade.quantity,
                    "entry_price": trade.entry_price,
                    "exit_price": trade.exit_price,
                    "pnl": trade.pnl,
                    "return_pct": trade.return_pct,
                }
                for trade in result.trades
            ],
            "daily_returns": (
                result.daily_returns.to_dict("index") if hasattr(result, "daily_returns") else {}
            ),
        }

        # Cache results
        cache_file = (
            CACHE_DIR
            / f"backtest_{symbol}_{strategy_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        )
        with open(cache_file, "w") as f:
            json.dump(results_data, f, indent=2, default=str)

        return (
            results_data,
            f"Backtest completed successfully! Total Return: {result.total_return:.2%}",
            "success",
            True,
            {"display": "block"},
            False,
        )

    except Exception as e:
        return (
            None,
            f"Error running backtest: {str(e)}",
            "danger",
            True,
            {"display": "none"},
            True,
        )


@callback(
    Output("metrics-table", "children"),
    Input("backtest-results", "data"),
)
def update_metrics_table(results_data):
    """Update performance metrics table."""
    if not results_data:
        return "No results available."

    metrics = results_data["metrics"]

    table_data = [
        {"Metric": "Initial Capital", "Value": f"${metrics['initial_capital']:,.2f}"},
        {"Metric": "Final Capital", "Value": f"${metrics['final_capital']:,.2f}"},
        {"Metric": "Total Return", "Value": f"{metrics['total_return']:.2%}"},
        {"Metric": "Annualized Return", "Value": f"{metrics['annualized_return']:.2%}"},
        {"Metric": "Sharpe Ratio", "Value": f"{metrics['sharpe_ratio']:.3f}"},
        {"Metric": "Max Drawdown", "Value": f"{metrics['max_drawdown']:.2%}"},
        {"Metric": "Win Rate", "Value": f"{metrics['win_rate']:.2%}"},
        {"Metric": "Total Trades", "Value": f"{metrics['total_trades']:,}"},
        {"Metric": "Volatility", "Value": f"{metrics['volatility']:.2%}"},
    ]

    return dash_table.DataTable(
        data=table_data,
        columns=[
            {"name": "Metric", "id": "Metric"},
            {"name": "Value", "id": "Value"},
        ],
        style_cell={"textAlign": "left"},
        style_data_conditional=[
            {
                "if": {"filter_query": "{Metric} = Total Return"},
                "backgroundColor": "#d4edda" if metrics["total_return"] > 0 else "#f8d7da",
                "color": "black",
            }
        ],
    )


@callback(
    Output("quick-stats", "children"),
    Input("backtest-results", "data"),
)
def update_quick_stats(results_data):
    """Update quick statistics cards."""
    if not results_data:
        return "No results available."

    metrics = results_data["metrics"]

    return dbc.Row(
        [
            dbc.Col(
                [
                    dbc.Card(
                        [
                            dbc.CardBody(
                                [
                                    html.H4(
                                        f"{metrics['total_return']:.2%}",
                                        className=(
                                            "text-success"
                                            if metrics["total_return"] > 0
                                            else "text-danger"
                                        ),
                                    ),
                                    html.P("Total Return", className="mb-0"),
                                ]
                            )
                        ],
                        className="text-center",
                    )
                ],
                width=3,
            ),
            dbc.Col(
                [
                    dbc.Card(
                        [
                            dbc.CardBody(
                                [
                                    html.H4(
                                        f"{metrics['sharpe_ratio']:.3f}",
                                        className="text-info",
                                    ),
                                    html.P("Sharpe Ratio", className="mb-0"),
                                ]
                            )
                        ],
                        className="text-center",
                    )
                ],
                width=3,
            ),
            dbc.Col(
                [
                    dbc.Card(
                        [
                            dbc.CardBody(
                                [
                                    html.H4(
                                        f"{metrics['max_drawdown']:.2%}",
                                        className="text-warning",
                                    ),
                                    html.P("Max Drawdown", className="mb-0"),
                                ]
                            )
                        ],
                        className="text-center",
                    )
                ],
                width=3,
            ),
            dbc.Col(
                [
                    dbc.Card(
                        [
                            dbc.CardBody(
                                [
                                    html.H4(
                                        f"{metrics['total_trades']:,}",
                                        className="text-primary",
                                    ),
                                    html.P("Total Trades", className="mb-0"),
                                ]
                            )
                        ],
                        className="text-center",
                    )
                ],
                width=3,
            ),
        ]
    )


@callback(
    Output("equity-curve-chart", "figure"),
    Input("backtest-results", "data"),
)
def update_equity_curve(results_data):
    """Update equity curve chart."""
    if not results_data:
        return {}

    equity_data = results_data["equity_curve"]
    dates = list(equity_data.keys())
    values = list(equity_data.values())

    fig = go.Figure()

    fig.add_trace(
        go.Scatter(
            x=dates,
            y=values,
            mode="lines",
            name="Portfolio Value",
            line=dict(color="#1f77b4", width=2),
        )
    )

    fig.update_layout(
        title="Portfolio Equity Curve",
        xaxis_title="Date",
        yaxis_title="Portfolio Value ($)",
        hovermode="x unified",
        template="plotly_white",
    )

    return fig


@callback(
    Output("drawdown-chart", "figure"),
    Input("backtest-results", "data"),
)
def update_drawdown_chart(results_data):
    """Update drawdown chart."""
    if not results_data:
        return {}

    equity_data = results_data["equity_curve"]
    dates = list(equity_data.keys())
    values = list(equity_data.values())

    # Calculate drawdown
    peak = pd.Series(values).expanding().max()
    drawdown = (pd.Series(values) - peak) / peak * 100

    fig = go.Figure()

    fig.add_trace(
        go.Scatter(
            x=dates,
            y=drawdown,
            mode="lines",
            name="Drawdown",
            fill="tonexty",
            line=dict(color="#d62728"),
        )
    )

    fig.update_layout(
        title="Portfolio Drawdown",
        xaxis_title="Date",
        yaxis_title="Drawdown (%)",
        hovermode="x unified",
        template="plotly_white",
    )

    return fig


@callback(
    Output("returns-distribution", "figure"),
    Input("backtest-results", "data"),
)
def update_returns_distribution(results_data):
    """Update returns distribution chart."""
    if not results_data or not results_data.get("daily_returns"):
        return {}

    daily_returns = list(results_data["daily_returns"].values())

    fig = go.Figure()

    fig.add_trace(
        go.Histogram(
            x=daily_returns,
            nbinsx=50,
            name="Daily Returns",
            opacity=0.7,
        )
    )

    fig.update_layout(
        title="Distribution of Daily Returns",
        xaxis_title="Daily Return (%)",
        yaxis_title="Frequency",
        template="plotly_white",
    )

    return fig


@callback(
    Output("trade-table", "children"),
    Input("backtest-results", "data"),
)
def update_trade_table(results_data):
    """Update trade analysis table."""
    if not results_data or not results_data["trades"]:
        return "No trades executed."

    trades = results_data["trades"]

    # Format trades for display
    formatted_trades = []
    for trade in trades[:100]:  # Limit to first 100 trades
        formatted_trades.append(
            {
                "Entry Date": trade["entry_date"][:10],
                "Exit Date": trade["exit_date"][:10] if trade["exit_date"] else "Open",
                "Side": trade["side"].upper(),
                "Quantity": trade["quantity"],
                "Entry Price": f"${trade['entry_price']:.2f}",
                "Exit Price": f"${trade['exit_price']:.2f}" if trade["exit_price"] else "N/A",
                "P&L": f"${trade['pnl']:.2f}" if trade["pnl"] else "N/A",
                "Return %": f"{trade['return_pct']:.2%}" if trade["return_pct"] else "N/A",
            }
        )

    return dash_table.DataTable(
        data=formatted_trades,
        columns=[{"name": col, "id": col} for col in formatted_trades[0].keys()],
        style_cell={"textAlign": "left"},
        style_data_conditional=[
            {
                "if": {"filter_query": "{Return %} > 0"},
                "backgroundColor": "#d4edda",
                "color": "black",
            },
            {
                "if": {"filter_query": "{Return %} < 0"},
                "backgroundColor": "#f8d7da",
                "color": "black",
            },
        ],
        page_size=20,
        sort_action="native",
        filter_action="native",
        export_format="csv",
        export_headers="display",
    )


@callback(
    Output("rolling-sharpe-chart", "figure"),
    Input("backtest-results", "data"),
)
def update_rolling_sharpe(results_data):
    """Update rolling Sharpe ratio chart."""
    if not results_data or not results_data.get("daily_returns"):
        return {}

    daily_returns = pd.Series(results_data["daily_returns"])
    daily_returns.index = pd.to_datetime(daily_returns.index)

    # Calculate rolling Sharpe ratio (30-day window)
    window = 30
    rolling_sharpe = daily_returns.rolling(window=window).mean() / daily_returns.rolling(window=window).std() * np.sqrt(252)

    fig = go.Figure()

    fig.add_trace(
        go.Scatter(
            x=rolling_sharpe.index,
            y=rolling_sharpe.values,
            mode="lines",
            name="Rolling Sharpe (30d)",
            line=dict(color="#2E86AB", width=2),
        )
    )

    # Add horizontal line at Sharpe = 1
    fig.add_hline(y=1.0, line_dash="dash", line_color="red", annotation_text="Sharpe = 1.0")

    fig.update_layout(
        title="Rolling Sharpe Ratio (30-day window)",
        xaxis_title="Date",
        yaxis_title="Sharpe Ratio",
        hovermode="x unified",
        template="plotly_white",
    )

    return fig


@callback(
    Output("parameter-heatmap", "figure"),
    Input("optimization-results", "data"),
)
def update_parameter_heatmap(optimization_data):
    """Update parameter optimization heatmap."""
    if not optimization_data:
        return {}

    try:
        # Create a simple heatmap for the first two parameters
        df = pd.DataFrame(optimization_data["trials"])

        if len(df) < 2:
            return {}

        param_cols = [col for col in df.columns if col.startswith("param_")]

        if len(param_cols) < 2:
            return {}

        # Create pivot table for heatmap
        x_param = param_cols[0]
        y_param = param_cols[1]

        pivot_df = df.pivot_table(
            values="sharpe_ratio",
            index=y_param,
            columns=x_param,
            aggfunc="mean"
        )

        fig = go.Figure(data=go.Heatmap(
            z=pivot_df.values,
            x=pivot_df.columns,
            y=pivot_df.index,
            colorscale="Viridis",
            hoverongaps=False
        ))

        fig.update_layout(
            title=f"Parameter Optimization Heatmap: {x_param.replace('param_', '')} vs {y_param.replace('param_', '')}",
            xaxis_title=x_param.replace('param_', '').replace('_', ' ').title(),
            yaxis_title=y_param.replace('param_', '').replace('_', ' ').title(),
            template="plotly_white",
        )

        return fig

    except Exception as e:
        logger.error(f"Error creating parameter heatmap: {e}")
        return {}


@callback(
    Output("optimization-leaderboard", "children"),
    Input("optimization-results", "data"),
)
def update_optimization_leaderboard(optimization_data):
    """Update optimization leaderboard."""
    if not optimization_data:
        return "No optimization results available."

    try:
        df = pd.DataFrame(optimization_data["trials"])

        # Sort by Sharpe ratio and take top 10
        top_trials = df.nlargest(10, "sharpe_ratio")

        # Format for display
        leaderboard_data = []
        for idx, row in top_trials.iterrows():
            leaderboard_data.append({
                "Rank": len(leaderboard_data) + 1,
                "Sharpe": f"{row['sharpe_ratio']:.3f}",
                "Return": f"{row['total_return']:.2%}",
                "Max DD": f"{row['max_drawdown']:.2%}",
                "Parameters": ", ".join([
                    f"{col.replace('param_', '')}: {row[col]}"
                    for col in row.index if col.startswith("param_")
                ][:2])  # Show only first 2 params
            })

        return dash_table.DataTable(
            data=leaderboard_data,
            columns=[{"name": col, "id": col} for col in leaderboard_data[0].keys()],
            style_cell={"textAlign": "left", "fontSize": 12},
            style_header={"backgroundColor": "#f8f9fa", "fontWeight": "bold"},
            page_size=10,
        )

    except Exception as e:
        logger.error(f"Error creating optimization leaderboard: {e}")
        return "Error loading optimization results."


@callback(
    Output("wfv-table", "children"),
    Input("wfv-results", "data"),
)
def update_wfv_table(wfv_data):
    """Update walk-forward validation table."""
    if not wfv_data:
        return "No walk-forward validation results available."

    try:
        splits = wfv_data["splits"]

        wfv_table_data = []
        for i, split in enumerate(splits):
            wfv_table_data.append({
                "Split": i + 1,
                "Training Period": f"{split['train_start']} to {split['train_end']}",
                "Testing Period": f"{split['test_start']} to {split['test_end']}",
                "IS Return": f"{split.get('in_sample_return', 0):.2%}",
                "OOS Return": f"{split.get('out_of_sample_return', 0):.2%}",
                "IS Sharpe": f"{split.get('in_sample_sharpe', 0):.3f}",
                "OOS Sharpe": f"{split.get('out_of_sample_sharpe', 0):.3f}",
            })

        return dash_table.DataTable(
            data=wfv_table_data,
            columns=[{"name": col, "id": col} for col in wfv_table_data[0].keys()],
            style_cell={"textAlign": "left"},
            style_data_conditional=[
                {
                    "if": {"filter_query": "{OOS Sharpe} > {IS Sharpe}"},
                    "backgroundColor": "#d4edda",
                    "color": "black",
                },
                {
                    "if": {"filter_query": "{OOS Sharpe} < {IS Sharpe}"},
                    "backgroundColor": "#f8d7da",
                    "color": "black",
                },
            ],
            export_format="csv",
            export_headers="display",
        )

    except Exception as e:
        logger.error(f"Error creating WFV table: {e}")
        return "Error loading walk-forward validation results."



@callback(
    [
        Output("optimization-results", "data"),
        Output("alert-message", "children", allow_duplicate=True),
        Output("alert-message", "color", allow_duplicate=True),
        Output("alert-message", "is_open", allow_duplicate=True),
    ],
    Input("optimize-btn", "n_clicks"),
    [
        State("symbol-input", "value"),
        State("strategy-dropdown", "value"),
        State("start-date", "date"),
        State("end-date", "date"),
        State("capital-input", "value"),
        State("commission-input", "value"),
    ],
    prevent_initial_call=True,
)
def run_optimization(n_clicks, symbol, strategy_name, start_date, end_date, capital, commission):
    """Run parameter optimization."""
    if not n_clicks:
        return None, "", "info", False

    try:
        provider = YahooDataAdapter()
        data = provider.fetch(symbol, start_date, end_date)

        if data.empty:
            return None, f"No data available for {symbol}", "danger", True

        strategy_class = STRATEGY_CLASSES[strategy_name]
        optimizer = StrategyOptimizer(
            initial_capital=capital,
            commission=commission / 10000,
        )

        best_params, study = optimizer.optimize(
            strategy_class=strategy_class,
            param_space=PARAM_SPACES[strategy_name],
            data=data,
            symbol=symbol,
            n_trials=50,
        )

        trials_data = []
        for trial in study.trials:
            trial_data = {
                "trial_number": trial.number,
                "sharpe_ratio": trial.value if trial.value else 0,
            }
            
            for param_name, param_value in trial.params.items():
                trial_data[f"param_{param_name}"] = param_value
            
            if trial.user_attrs:
                trial_data.update({
                    "total_return": trial.user_attrs.get("total_return", 0),
                    "max_drawdown": trial.user_attrs.get("max_drawdown", 0),
                    "win_rate": trial.user_attrs.get("win_rate", 0),
                })
            
            trials_data.append(trial_data)

        optimization_results = {
            "best_params": best_params,
            "best_value": study.best_value,
            "trials": trials_data,
            "symbol": symbol,
            "strategy": strategy_name,
        }

        return (
            optimization_results,
            f"Optimization completed! Best Sharpe: {study.best_value:.3f}",
            "success",
            True,
        )

    except Exception as e:
        logger.error(f"Optimization error: {e}")
        return None, f"Optimization failed: {str(e)}", "danger", True


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8050))
    debug = os.environ.get("ATHENA_LOG_LEVEL", "INFO").upper() == "DEBUG"
    print(f"Starting Athena Dashboard on port {port}")
    app.run_server(debug=debug, host="0.0.0.0", port=port)
