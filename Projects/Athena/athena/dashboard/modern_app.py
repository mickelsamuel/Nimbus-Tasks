"""Modern Athena Trading Dashboard with Enhanced UI/UX."""

import json
import asyncio
from datetime import datetime, timedelta
import logging
import os
import random

import dash
import dash_bootstrap_components as dbc
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
from dash import Input, Output, State, callback, dash_table, dcc, html, ALL, MATCH
import numpy as np
import yfinance as yf

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Dash app with modern theme
app = dash.Dash(
    __name__,
    external_stylesheets=[
        dbc.themes.CYBORG,  # Dark modern theme
        dbc.icons.FONT_AWESOME,
        "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
    ],
    title="Athena Trading Platform | Professional Algo Trading",
    suppress_callback_exceptions=True,
    meta_tags=[
        {"name": "viewport", "content": "width=device-width, initial-scale=1"}
    ]
)

# Expose server for WSGI
server = app.server

# Custom CSS for modern look
app.index_string = '''
<!DOCTYPE html>
<html>
    <head>
        {%metas%}
        <title>{%title%}</title>
        {%favicon%}
        {%css%}
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');

            body {
                font-family: 'Inter', sans-serif;
                background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
                min-height: 100vh;
                margin: 0;
                overflow-x: hidden;
            }

            .main-container {
                animation: fadeIn 0.8s ease-in;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .card {
                background: rgba(255, 255, 255, 0.05);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
                transition: all 0.3s ease;
            }

            .card:hover {
                transform: translateY(-5px);
                box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.5);
            }

            .btn-glow {
                position: relative;
                overflow: hidden;
                transition: all 0.3s ease;
                border: none;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .btn-glow:before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                transition: width 0.6s, height 0.6s;
                transform: translate(-50%, -50%);
            }

            .btn-glow:hover:before {
                width: 300px;
                height: 300px;
            }

            .progress-ring {
                animation: rotate 2s linear infinite;
            }

            @keyframes rotate {
                100% { transform: rotate(360deg); }
            }

            .pulse {
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
                70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
                100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
            }

            .metric-card {
                background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
                border-radius: 20px;
                padding: 1.5rem;
                position: relative;
                overflow: hidden;
            }

            .metric-card::before {
                content: '';
                position: absolute;
                top: -50%;
                right: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
                animation: shine 3s infinite;
            }

            @keyframes shine {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .loading-wave {
                width: 100%;
                height: 100px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .loading-wave div {
                width: 5px;
                height: 50px;
                margin: 0 5px;
                background: linear-gradient(to top, #00d4ff, #0099ff);
                border-radius: 20px;
                animation: wave 1.2s infinite ease-in-out;
            }

            .loading-wave div:nth-child(1) { animation-delay: 0s; }
            .loading-wave div:nth-child(2) { animation-delay: 0.1s; }
            .loading-wave div:nth-child(3) { animation-delay: 0.2s; }
            .loading-wave div:nth-child(4) { animation-delay: 0.3s; }
            .loading-wave div:nth-child(5) { animation-delay: 0.4s; }

            @keyframes wave {
                0%, 60%, 100% { transform: scaleY(1); }
                30% { transform: scaleY(2); }
            }

            .stat-number {
                font-size: 2.5rem;
                font-weight: 700;
                background: linear-gradient(135deg, #00d4ff, #0099ff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .success-animation {
                animation: successPulse 0.6s ease;
            }

            @keyframes successPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }

            /* Scrollbar styling */
            ::-webkit-scrollbar {
                width: 10px;
            }

            ::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
            }

            ::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, #00d4ff, #0099ff);
                border-radius: 10px;
            }

            ::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(135deg, #00a4cf, #0079df);
            }
        </style>
    </head>
    <body>
        {%app_entry%}
        <footer>
            {%config%}
            {%scripts%}
            {%renderer%}
        </footer>
    </body>
</html>
'''


def create_modern_header():
    """Create a modern, animated header."""
    return dbc.Container([
        dbc.Row([
            dbc.Col([
                html.Div([
                    html.Div([
                        html.I(className="fas fa-rocket fa-2x me-3", style={"color": "#00d4ff"}),
                        html.H1("ATHENA", style={
                            "display": "inline",
                            "fontWeight": "700",
                            "background": "linear-gradient(135deg, #00d4ff, #0099ff)",
                            "-webkit-background-clip": "text",
                            "-webkit-text-fill-color": "transparent",
                            "letterSpacing": "2px"
                        })
                    ], className="d-flex align-items-center mb-2"),
                    html.P("AI-Powered Trading Platform", style={
                        "color": "rgba(255,255,255,0.7)",
                        "fontSize": "1.1rem"
                    })
                ], className="animate__animated animate__fadeInLeft")
            ], md=6),
            dbc.Col([
                html.Div([
                    dbc.Row([
                        dbc.Col([
                            html.Div([
                                html.Div("Live Status", style={"fontSize": "0.8rem", "opacity": "0.7"}),
                                html.Div([
                                    html.Span("●", style={"color": "#00ff88", "fontSize": "1.2rem"}),
                                    html.Span(" Connected", style={"marginLeft": "5px"})
                                ], className="pulse")
                            ])
                        ], width=4),
                        dbc.Col([
                            html.Div([
                                html.Div("Server Time", style={"fontSize": "0.8rem", "opacity": "0.7"}),
                                html.Div(id="live-time", style={"fontWeight": "600"})
                            ])
                        ], width=4),
                        dbc.Col([
                            html.Div([
                                html.Div("Version", style={"fontSize": "0.8rem", "opacity": "0.7"}),
                                html.Div("2.0 PRO", style={"fontWeight": "600", "color": "#00d4ff"})
                            ])
                        ], width=4),
                    ])
                ], className="animate__animated animate__fadeInRight text-end", style={"color": "white"})
            ], md=6)
        ], className="mb-4 p-3")
    ], fluid=True)


def create_metrics_row():
    """Create real-time metrics dashboard."""
    return dbc.Row([
        dbc.Col([
            html.Div([
                html.Div([
                    html.I(className="fas fa-chart-line fa-2x mb-3", style={"color": "#00d4ff"}),
                    html.H6("Portfolio Value", className="text-muted"),
                    html.H2(id="portfolio-value", children="$100,000", className="stat-number"),
                    html.P([
                        html.Span("▲ ", style={"color": "#00ff88"}),
                        html.Span("+12.5%", style={"color": "#00ff88", "fontWeight": "600"}),
                        html.Span(" today", style={"opacity": "0.7"})
                    ])
                ], className="metric-card animate__animated animate__fadeInUp")
            ])
        ], md=3),
        dbc.Col([
            html.Div([
                html.Div([
                    html.I(className="fas fa-trophy fa-2x mb-3", style={"color": "#ffd700"}),
                    html.H6("Win Rate", className="text-muted"),
                    html.H2(id="win-rate", children="68%", className="stat-number"),
                    html.P([
                        html.Span("▲ ", style={"color": "#00ff88"}),
                        html.Span("+5%", style={"color": "#00ff88", "fontWeight": "600"}),
                        html.Span(" vs last month", style={"opacity": "0.7"})
                    ])
                ], className="metric-card animate__animated animate__fadeInUp", style={"animationDelay": "0.1s"})
            ])
        ], md=3),
        dbc.Col([
            html.Div([
                html.Div([
                    html.I(className="fas fa-bolt fa-2x mb-3", style={"color": "#ff6b6b"}),
                    html.H6("Active Trades", className="text-muted"),
                    html.H2(id="active-trades", children="7", className="stat-number"),
                    html.P([
                        html.Span("3 Buy ", style={"color": "#00ff88"}),
                        html.Span("/ ", style={"opacity": "0.5"}),
                        html.Span("4 Sell", style={"color": "#ff6b6b"})
                    ])
                ], className="metric-card animate__animated animate__fadeInUp", style={"animationDelay": "0.2s"})
            ])
        ], md=3),
        dbc.Col([
            html.Div([
                html.Div([
                    html.I(className="fas fa-brain fa-2x mb-3", style={"color": "#9b59b6"}),
                    html.H6("AI Confidence", className="text-muted"),
                    html.H2(id="ai-confidence", children="92%", className="stat-number"),
                    dbc.Progress([
                        dbc.Progress(value=92, color="info", bar=True, animated=True, striped=True)
                    ], style={"height": "8px", "backgroundColor": "rgba(255,255,255,0.1)"})
                ], className="metric-card animate__animated animate__fadeInUp", style={"animationDelay": "0.3s"})
            ])
        ], md=3)
    ], className="mb-4", style={"color": "white"})


def create_trading_controls():
    """Create modern trading control panel."""
    return dbc.Card([
        dbc.CardBody([
            dbc.Row([
                dbc.Col([
                    html.H4([
                        html.I(className="fas fa-cog me-2"),
                        "Strategy Configuration"
                    ], style={"color": "white", "fontWeight": "600"}),
                ], md=12)
            ]),
            html.Hr(style={"borderColor": "rgba(255,255,255,0.1)"}),
            dbc.Row([
                dbc.Col([
                    dbc.Label("Symbol", style={"color": "rgba(255,255,255,0.7)"}),
                    dbc.InputGroup([
                        dbc.InputGroupText(html.I(className="fas fa-search"), style={
                            "background": "rgba(255,255,255,0.05)",
                            "border": "1px solid rgba(255,255,255,0.1)"
                        }),
                        dbc.Input(
                            id="symbol-input",
                            placeholder="Enter symbol (e.g., AAPL)",
                            value="AAPL",
                            style={
                                "background": "rgba(255,255,255,0.05)",
                                "border": "1px solid rgba(255,255,255,0.1)",
                                "color": "white"
                            }
                        )
                    ])
                ], md=3),
                dbc.Col([
                    dbc.Label("Strategy", style={"color": "rgba(255,255,255,0.7)"}),
                    dcc.Dropdown(
                        id="strategy-dropdown",
                        options=[
                            {"label": "🎯 SMA Crossover", "value": "sma"},
                            {"label": "📊 Bollinger Bands", "value": "bb"},
                            {"label": "🚀 Momentum", "value": "momentum"},
                            {"label": "🤖 AI Strategy", "value": "ai"}
                        ],
                        value="sma",
                        style={"background": "#1e1e2e"}
                    )
                ], md=3),
                dbc.Col([
                    dbc.Label("Time Period", style={"color": "rgba(255,255,255,0.7)"}),
                    dcc.DatePickerRange(
                        id="date-range",
                        start_date=datetime.now() - timedelta(days=365),
                        end_date=datetime.now(),
                        display_format="MMM DD, YYYY",
                        style={"background": "transparent"}
                    )
                ], md=6)
            ], className="mb-3"),
            dbc.Row([
                dbc.Col([
                    html.Div([
                        dbc.Button([
                            html.I(className="fas fa-rocket me-2"),
                            "QUICK ANALYSIS"
                        ], id="quick-analysis-btn",
                        className="btn-glow w-100",
                        style={
                            "background": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            "border": "none",
                            "padding": "12px",
                            "fontSize": "1.1rem"
                        })
                    ], className="animate__animated animate__pulse animate__infinite")
                ], md=3),
                dbc.Col([
                    dbc.Button([
                        html.I(className="fas fa-play me-2"),
                        "RUN BACKTEST"
                    ], id="backtest-btn",
                    color="success",
                    className="btn-glow w-100",
                    style={"padding": "12px", "fontSize": "1.1rem"})
                ], md=3),
                dbc.Col([
                    dbc.Button([
                        html.I(className="fas fa-magic me-2"),
                        "OPTIMIZE"
                    ], id="optimize-btn",
                    color="warning",
                    className="btn-glow w-100",
                    style={"padding": "12px", "fontSize": "1.1rem"})
                ], md=3),
                dbc.Col([
                    dbc.Button([
                        html.I(className="fas fa-brain me-2"),
                        "AI PREDICT"
                    ], id="ai-predict-btn",
                    color="info",
                    className="btn-glow w-100",
                    style={"padding": "12px", "fontSize": "1.1rem"})
                ], md=3)
            ])
        ])
    ], className="card mb-4")


def create_main_chart_section():
    """Create main interactive chart section."""
    return dbc.Card([
        dbc.CardBody([
            dbc.Row([
                dbc.Col([
                    html.Div([
                        html.H4([
                            html.I(className="fas fa-chart-area me-2"),
                            "Live Market Analysis"
                        ], style={"color": "white", "display": "inline-block"}),
                        dbc.Badge("LIVE", color="danger", className="ms-2 pulse",
                                 style={"verticalAlign": "middle"})
                    ])
                ], md=8),
                dbc.Col([
                    dbc.ButtonGroup([
                        dbc.Button("1D", id="1d-btn", size="sm", outline=True, color="info"),
                        dbc.Button("1W", id="1w-btn", size="sm", outline=True, color="info"),
                        dbc.Button("1M", id="1m-btn", size="sm", outline=True, color="info"),
                        dbc.Button("3M", id="3m-btn", size="sm", outline=True, color="info"),
                        dbc.Button("1Y", id="1y-btn", size="sm", outline=True, color="info", active=True),
                    ], className="float-end")
                ], md=4)
            ]),
            html.Hr(style={"borderColor": "rgba(255,255,255,0.1)"}),

            # Progress indicator
            html.Div([
                html.Div([
                    html.Div([
                        html.Div(className="spinner-border text-info me-3", role="status"),
                        html.Span("Loading market data...", style={"fontSize": "1.1rem"})
                    ], className="d-flex align-items-center justify-content-center",
                       style={"height": "400px"})
                ], id="loading-indicator", style={"display": "none"}),

                # Main chart
                dcc.Graph(
                    id="main-chart",
                    config={
                        "displayModeBar": True,
                        "displaylogo": False,
                        "modeBarButtonsToRemove": ["pan2d", "lasso2d"]
                    },
                    style={"height": "500px"}
                ),

                # Progress bar for operations
                html.Div([
                    dbc.Progress(
                        id="operation-progress",
                        value=0,
                        max=100,
                        striped=True,
                        animated=True,
                        color="info",
                        style={"height": "25px", "display": "none"},
                        className="mt-3"
                    ),
                    html.Div(id="progress-text", className="text-center mt-2",
                            style={"color": "white", "fontSize": "1.1rem"})
                ])
            ])
        ])
    ], className="card mb-4")


def create_results_section():
    """Create results and analytics section."""
    return dbc.Row([
        dbc.Col([
            dbc.Card([
                dbc.CardBody([
                    html.H5([
                        html.I(className="fas fa-trophy me-2"),
                        "Performance Metrics"
                    ], style={"color": "white"}),
                    html.Hr(style={"borderColor": "rgba(255,255,255,0.1)"}),
                    html.Div(id="performance-metrics", children=[
                        html.Div([
                            dbc.Row([
                                dbc.Col([
                                    html.P("Total Return", className="text-muted mb-1"),
                                    html.H4("--", id="total-return", style={"color": "#00ff88"})
                                ], md=6),
                                dbc.Col([
                                    html.P("Sharpe Ratio", className="text-muted mb-1"),
                                    html.H4("--", id="sharpe-ratio", style={"color": "#00d4ff"})
                                ], md=6)
                            ]),
                            dbc.Row([
                                dbc.Col([
                                    html.P("Max Drawdown", className="text-muted mb-1"),
                                    html.H4("--", id="max-drawdown", style={"color": "#ff6b6b"})
                                ], md=6),
                                dbc.Col([
                                    html.P("Total Trades", className="text-muted mb-1"),
                                    html.H4("--", id="total-trades", style={"color": "#ffd700"})
                                ], md=6)
                            ])
                        ], style={"minHeight": "200px"})
                    ])
                ])
            ], className="card mb-4")
        ], md=4),

        dbc.Col([
            dbc.Card([
                dbc.CardBody([
                    html.H5([
                        html.I(className="fas fa-history me-2"),
                        "Recent Activity"
                    ], style={"color": "white"}),
                    html.Hr(style={"borderColor": "rgba(255,255,255,0.1)"}),
                    html.Div(id="activity-feed", children=[
                        create_activity_item("System initialized", "info", "Just now"),
                        create_activity_item("Ready for trading", "success", "1 min ago"),
                    ])
                ])
            ], className="card mb-4")
        ], md=4),

        dbc.Col([
            dbc.Card([
                dbc.CardBody([
                    html.H5([
                        html.I(className="fas fa-lightbulb me-2"),
                        "AI Insights"
                    ], style={"color": "white"}),
                    html.Hr(style={"borderColor": "rgba(255,255,255,0.1)"}),
                    html.Div(id="ai-insights", children=[
                        html.Div([
                            html.I(className="fas fa-robot fa-3x mb-3",
                                  style={"color": "#9b59b6", "opacity": "0.5"}),
                            html.P("Run analysis to get AI-powered insights",
                                  className="text-muted")
                        ], className="text-center", style={"padding": "40px"})
                    ])
                ])
            ], className="card mb-4")
        ], md=4)
    ])


def create_activity_item(message, type_color, time_ago):
    """Create an activity feed item."""
    icons = {
        "success": "fa-check-circle",
        "info": "fa-info-circle",
        "warning": "fa-exclamation-triangle",
        "danger": "fa-times-circle"
    }
    colors = {
        "success": "#00ff88",
        "info": "#00d4ff",
        "warning": "#ffd700",
        "danger": "#ff6b6b"
    }

    return html.Div([
        html.I(className=f"fas {icons.get(type_color, 'fa-circle')} me-2",
              style={"color": colors.get(type_color, "#ffffff")}),
        html.Span(message, style={"color": "rgba(255,255,255,0.8)"}),
        html.Small(f" • {time_ago}", className="text-muted ms-2")
    ], className="mb-2 animate__animated animate__fadeInRight")


# App layout
app.layout = html.Div([
    dcc.Interval(id="interval-component", interval=1000, n_intervals=0),  # 1 second updates
    dcc.Store(id="backtest-results"),
    dcc.Store(id="operation-status"),

    html.Div([
        create_modern_header(),
        dbc.Container([
            create_metrics_row(),
            create_trading_controls(),
            create_main_chart_section(),
            create_results_section()
        ], fluid=True)
    ], className="main-container")
])


# Callback for live time updates
@callback(
    Output("live-time", "children"),
    Input("interval-component", "n_intervals")
)
def update_time(n):
    """Update live time display."""
    return datetime.now().strftime("%H:%M:%S")


# Callback for animated metrics
@callback(
    [Output("portfolio-value", "children"),
     Output("win-rate", "children"),
     Output("active-trades", "children"),
     Output("ai-confidence", "children")],
    Input("interval-component", "n_intervals")
)
def update_metrics(n):
    """Simulate live metric updates."""
    # Simulate some variance in metrics
    base_portfolio = 100000
    portfolio = f"${base_portfolio + random.randint(-5000, 5000):,}"
    win_rate = f"{68 + random.randint(-2, 2)}%"
    trades = str(random.randint(5, 10))
    confidence = f"{92 + random.randint(-3, 3)}%"

    return portfolio, win_rate, trades, confidence


# Main backtest callback with progress updates
@callback(
    [Output("main-chart", "figure"),
     Output("operation-progress", "value"),
     Output("operation-progress", "style"),
     Output("progress-text", "children"),
     Output("loading-indicator", "style"),
     Output("activity-feed", "children"),
     Output("total-return", "children"),
     Output("sharpe-ratio", "children"),
     Output("max-drawdown", "children"),
     Output("total-trades", "children")],
    [Input("quick-analysis-btn", "n_clicks"),
     Input("backtest-btn", "n_clicks"),
     Input("optimize-btn", "n_clicks"),
     Input("ai-predict-btn", "n_clicks")],
    [State("symbol-input", "value"),
     State("activity-feed", "children")],
    prevent_initial_call=False
)
def handle_operations(quick_clicks, backtest_clicks, optimize_clicks, ai_clicks, symbol, current_activity):
    """Handle all trading operations with progress feedback."""
    from dash import ctx

    # Default empty chart
    default_fig = create_default_chart()

    if not ctx.triggered:
        return default_fig, 0, {"display": "none"}, "", {"display": "none"}, current_activity, "--", "--", "--", "--"

    button_id = ctx.triggered[0]["prop_id"].split(".")[0]

    # Show loading immediately
    loading_style = {"display": "block"}
    progress_style = {"display": "block", "height": "25px"}

    # Add activity item
    if current_activity is None:
        current_activity = []

    if button_id == "quick-analysis-btn":
        new_activity = create_activity_item(f"Quick analysis started for {symbol}", "info", "Just now")
        current_activity = [new_activity] + current_activity[:4]

        # Simulate quick analysis with real data
        try:
            # Download real data
            ticker = yf.Ticker(symbol)
            data = ticker.history(period="1y")

            if not data.empty:
                fig = create_candlestick_chart(data, symbol)

                # Calculate real metrics
                returns = data['Close'].pct_change().dropna()
                total_return = f"+{((data['Close'].iloc[-1] / data['Close'].iloc[0] - 1) * 100):.2f}%"
                sharpe = f"{(returns.mean() / returns.std() * np.sqrt(252)):.2f}"
                max_dd = f"-{((1 - data['Close'] / data['Close'].cummax()).max() * 100):.2f}%"

                success_activity = create_activity_item(f"Analysis complete for {symbol}!", "success", "Just now")
                current_activity[0] = success_activity

                return fig, 100, {"display": "none"}, "Analysis Complete! ✅", {"display": "none"}, current_activity, total_return, sharpe, max_dd, "N/A"
        except Exception as e:
            error_activity = create_activity_item(f"Error: {str(e)[:50]}", "danger", "Just now")
            current_activity[0] = error_activity

    elif button_id == "backtest-btn":
        new_activity = create_activity_item(f"Backtest initiated for {symbol}", "warning", "Just now")
        current_activity = [new_activity] + current_activity[:4]

        # Simulate backtest progress
        return default_fig, 50, progress_style, "Running backtest simulation... 50%", loading_style, current_activity, "--", "--", "--", "--"

    elif button_id == "optimize-btn":
        new_activity = create_activity_item(f"Optimization started for {symbol}", "warning", "Just now")
        current_activity = [new_activity] + current_activity[:4]

        return default_fig, 25, progress_style, "Optimizing parameters... 25%", loading_style, current_activity, "--", "--", "--", "--"

    elif button_id == "ai-predict-btn":
        new_activity = create_activity_item(f"AI prediction running for {symbol}", "info", "Just now")
        current_activity = [new_activity] + current_activity[:4]

        return default_fig, 75, progress_style, "AI analyzing patterns... 75%", loading_style, current_activity, "--", "--", "--", "--"

    return default_fig, 0, {"display": "none"}, "", {"display": "none"}, current_activity, "--", "--", "--", "--"


def create_default_chart():
    """Create a default animated chart."""
    # Create sample data
    dates = pd.date_range(start='2024-01-01', end='2024-09-20', freq='D')
    prices = 150 + np.cumsum(np.random.randn(len(dates)) * 2)

    fig = go.Figure()

    # Add main price line with gradient
    fig.add_trace(go.Scatter(
        x=dates,
        y=prices,
        mode='lines',
        name='Price',
        line=dict(color='#00d4ff', width=2),
        fill='tozeroy',
        fillcolor='rgba(0, 212, 255, 0.1)'
    ))

    # Add moving average
    ma = pd.Series(prices).rolling(20).mean()
    fig.add_trace(go.Scatter(
        x=dates,
        y=ma,
        mode='lines',
        name='MA(20)',
        line=dict(color='#ffd700', width=1, dash='dash')
    ))

    fig.update_layout(
        template="plotly_dark",
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        margin=dict(l=0, r=0, t=0, b=0),
        xaxis=dict(showgrid=False, zeroline=False),
        yaxis=dict(showgrid=True, gridcolor='rgba(255,255,255,0.05)', zeroline=False),
        hovermode='x unified',
        showlegend=True,
        legend=dict(
            yanchor="top",
            y=0.99,
            xanchor="left",
            x=0.01,
            bgcolor='rgba(0,0,0,0.5)'
        )
    )

    return fig


def create_candlestick_chart(data, symbol):
    """Create a professional candlestick chart."""
    fig = make_subplots(
        rows=2, cols=1,
        shared_xaxes=True,
        vertical_spacing=0.03,
        row_heights=[0.7, 0.3]
    )

    # Candlestick chart
    fig.add_trace(go.Candlestick(
        x=data.index,
        open=data['Open'],
        high=data['High'],
        low=data['Low'],
        close=data['Close'],
        name=symbol,
        increasing_line_color='#00ff88',
        decreasing_line_color='#ff6b6b'
    ), row=1, col=1)

    # Volume bars
    colors = ['#00ff88' if row['Close'] >= row['Open'] else '#ff6b6b'
              for idx, row in data.iterrows()]

    fig.add_trace(go.Bar(
        x=data.index,
        y=data['Volume'],
        name='Volume',
        marker_color=colors,
        opacity=0.5
    ), row=2, col=1)

    # Add moving averages
    if len(data) >= 20:
        ma20 = data['Close'].rolling(20).mean()
        fig.add_trace(go.Scatter(
            x=data.index,
            y=ma20,
            name='MA(20)',
            line=dict(color='#00d4ff', width=1)
        ), row=1, col=1)

    if len(data) >= 50:
        ma50 = data['Close'].rolling(50).mean()
        fig.add_trace(go.Scatter(
            x=data.index,
            y=ma50,
            name='MA(50)',
            line=dict(color='#ffd700', width=1)
        ), row=1, col=1)

    fig.update_layout(
        template="plotly_dark",
        title=f"{symbol} - Professional Trading Chart",
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        xaxis_rangeslider_visible=False,
        margin=dict(l=0, r=0, t=30, b=0),
        hovermode='x unified',
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=1.02,
            xanchor="right",
            x=1
        )
    )

    fig.update_xaxes(showgrid=False)
    fig.update_yaxes(showgrid=True, gridcolor='rgba(255,255,255,0.05)', row=1, col=1, title="Price")
    fig.update_yaxes(showgrid=True, gridcolor='rgba(255,255,255,0.05)', row=2, col=1, title="Volume")

    return fig


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8050))
    debug = os.environ.get("DEBUG", "false").lower() == "true"
    print(f"🚀 Starting Modern Athena Dashboard on port {port}")
    print(f"🌐 Open http://localhost:{port} in your browser")
    app.run(debug=debug, host="0.0.0.0", port=port)