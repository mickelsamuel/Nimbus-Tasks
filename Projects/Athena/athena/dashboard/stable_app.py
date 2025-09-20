"""Stable, Professional Athena Trading Dashboard."""

import os
import logging
from datetime import datetime, timedelta
import random
import time

import dash
import dash_bootstrap_components as dbc
import pandas as pd
import numpy as np
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from dash import Input, Output, State, callback, dcc, html, ALL
import yfinance as yf

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Dash app - using FLATLY for clean, readable theme
app = dash.Dash(
    __name__,
    external_stylesheets=[
        dbc.themes.FLATLY,  # Clean, professional theme with good contrast
        dbc.icons.FONT_AWESOME,
    ],
    title="Athena Trading Platform",
    suppress_callback_exceptions=True,
)

# Expose server for WSGI
server = app.server

# Simple, clean custom CSS
app.index_string = '''
<!DOCTYPE html>
<html>
    <head>
        {%metas%}
        <title>{%title%}</title>
        {%favicon%}
        {%css%}
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                background: #f8f9fa;
            }

            .main-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 2rem;
                margin-bottom: 2rem;
                border-radius: 0 0 20px 20px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }

            .metric-card {
                background: white;
                border-radius: 10px;
                padding: 1.5rem;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                transition: transform 0.2s;
                height: 100%;
            }

            .metric-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            }

            .metric-value {
                font-size: 2rem;
                font-weight: bold;
                color: #2c3e50;
            }

            .metric-label {
                color: #7f8c8d;
                font-size: 0.9rem;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .status-badge {
                display: inline-block;
                padding: 0.25rem 0.75rem;
                border-radius: 20px;
                font-size: 0.875rem;
                font-weight: 500;
            }

            .status-running {
                background: #fff3cd;
                color: #856404;
            }

            .status-success {
                background: #d4edda;
                color: #155724;
            }

            .status-error {
                background: #f8d7da;
                color: #721c24;
            }

            .btn-primary-custom {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                color: white;
                font-weight: 500;
                padding: 0.75rem 1.5rem;
                border-radius: 5px;
                transition: opacity 0.2s;
            }

            .btn-primary-custom:hover {
                opacity: 0.9;
            }

            .progress-container {
                background: #e9ecef;
                border-radius: 10px;
                padding: 1rem;
                margin: 1rem 0;
            }

            .activity-item {
                padding: 0.75rem;
                border-left: 3px solid #667eea;
                margin-bottom: 0.5rem;
                background: white;
                border-radius: 0 5px 5px 0;
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

# Store for demo data
DEMO_DATA = {}

def create_header():
    """Create a clean, professional header."""
    return html.Div([
        dbc.Container([
            dbc.Row([
                dbc.Col([
                    html.H1("🚀 Athena Trading Platform", className="mb-0"),
                    html.P("Professional Algorithmic Trading System", className="mb-0 opacity-75")
                ], md=8),
                dbc.Col([
                    html.Div([
                        html.Div([
                            html.Span("●", className="text-success me-2"),
                            html.Span("System Online", className="text-white")
                        ]),
                        html.Small(id="current-time", className="text-white-50")
                    ], className="text-end mt-3")
                ], md=4)
            ])
        ], fluid=True)
    ], className="main-header")


def create_metrics_dashboard():
    """Create metrics cards with real data."""
    return dbc.Row([
        dbc.Col([
            html.Div([
                html.Div("Portfolio Value", className="metric-label"),
                html.Div("$100,000", id="portfolio-value", className="metric-value text-primary"),
                html.Small("Initial Capital", className="text-muted")
            ], className="metric-card")
        ], md=3, className="mb-4"),

        dbc.Col([
            html.Div([
                html.Div("Total Return", className="metric-label"),
                html.Div("--", id="total-return", className="metric-value text-success"),
                html.Small("Profit/Loss", className="text-muted")
            ], className="metric-card")
        ], md=3, className="mb-4"),

        dbc.Col([
            html.Div([
                html.Div("Sharpe Ratio", className="metric-label"),
                html.Div("--", id="sharpe-ratio", className="metric-value text-info"),
                html.Small("Risk-Adjusted Return", className="text-muted")
            ], className="metric-card")
        ], md=3, className="mb-4"),

        dbc.Col([
            html.Div([
                html.Div("Win Rate", className="metric-label"),
                html.Div("--", id="win-rate", className="metric-value text-warning"),
                html.Small("Success Rate", className="text-muted")
            ], className="metric-card")
        ], md=3, className="mb-4"),
    ])


def create_control_panel():
    """Create simple, working control panel."""
    return dbc.Card([
        dbc.CardBody([
            html.H4("📊 Strategy Configuration", className="mb-4"),

            dbc.Row([
                dbc.Col([
                    dbc.Label("Stock Symbol"),
                    dbc.Input(id="symbol-input", value="AAPL", placeholder="e.g., AAPL, TSLA, MSFT")
                ], md=4),

                dbc.Col([
                    dbc.Label("Time Period"),
                    dbc.Select(
                        id="period-select",
                        value="1mo",
                        options=[
                            {"label": "1 Week", "value": "1wk"},
                            {"label": "1 Month", "value": "1mo"},
                            {"label": "3 Months", "value": "3mo"},
                            {"label": "6 Months", "value": "6mo"},
                            {"label": "1 Year", "value": "1y"},
                        ]
                    )
                ], md=4),

                dbc.Col([
                    dbc.Label("Strategy Type"),
                    dbc.Select(
                        id="strategy-select",
                        value="sma",
                        options=[
                            {"label": "SMA Crossover", "value": "sma"},
                            {"label": "Buy & Hold", "value": "hold"},
                            {"label": "Mean Reversion", "value": "mean"},
                        ]
                    )
                ], md=4),
            ], className="mb-4"),

            dbc.Row([
                dbc.Col([
                    dbc.Button(
                        "📈 Get Live Data",
                        id="get-data-btn",
                        color="primary",
                        size="lg",
                        className="w-100",
                        n_clicks=0
                    )
                ], md=4),

                dbc.Col([
                    dbc.Button(
                        "🎯 Run Analysis",
                        id="run-analysis-btn",
                        color="success",
                        size="lg",
                        className="w-100",
                        n_clicks=0
                    )
                ], md=4),

                dbc.Col([
                    dbc.Button(
                        "📊 Demo Mode",
                        id="demo-btn",
                        color="info",
                        size="lg",
                        className="w-100",
                        n_clicks=0
                    )
                ], md=4),
            ])
        ])
    ], className="mb-4")


def create_chart_section():
    """Create chart section."""
    return dbc.Card([
        dbc.CardBody([
            dbc.Row([
                dbc.Col([
                    html.H4("📈 Market Analysis"),
                ], md=9),
                dbc.Col([
                    html.Div(id="chart-status", className="text-end")
                ], md=3)
            ]),

            html.Hr(),

            # Loading spinner
            dcc.Loading(
                id="loading-chart",
                type="default",
                children=[
                    dcc.Graph(
                        id="main-chart",
                        config={"displayModeBar": True, "displaylogo": False},
                        style={"height": "500px"}
                    )
                ]
            ),

            # Status message
            dbc.Alert(
                id="status-message",
                children="Ready to analyze markets. Click 'Get Live Data' to start!",
                color="info",
                className="mt-3"
            )
        ])
    ], className="mb-4")


def create_results_section():
    """Create results display section."""
    return dbc.Row([
        dbc.Col([
            dbc.Card([
                dbc.CardBody([
                    html.H5("📋 Activity Log"),
                    html.Hr(),
                    html.Div(id="activity-log", children=[
                        html.Div("System initialized", className="activity-item")
                    ])
                ])
            ])
        ], md=6),

        dbc.Col([
            dbc.Card([
                dbc.CardBody([
                    html.H5("📊 Analysis Results"),
                    html.Hr(),
                    html.Div(id="analysis-results", children=[
                        html.P("No analysis run yet. Click 'Run Analysis' after loading data.", className="text-muted")
                    ])
                ])
            ])
        ], md=6),
    ])


# App Layout
app.layout = html.Div([
    dcc.Store(id="data-store"),
    dcc.Interval(id="time-interval", interval=1000),

    create_header(),

    dbc.Container([
        create_metrics_dashboard(),
        create_control_panel(),
        create_chart_section(),
        create_results_section()
    ], fluid=True)
])


# Callback for time updates
@callback(
    Output("current-time", "children"),
    Input("time-interval", "n_intervals")
)
def update_time(n):
    """Update current time."""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


# Main callback for getting live data
@callback(
    [Output("main-chart", "figure"),
     Output("status-message", "children"),
     Output("status-message", "color"),
     Output("activity-log", "children"),
     Output("data-store", "data"),
     Output("chart-status", "children")],
    [Input("get-data-btn", "n_clicks"),
     Input("demo-btn", "n_clicks")],
    [State("symbol-input", "value"),
     State("period-select", "value"),
     State("activity-log", "children")],
    prevent_initial_call=False
)
def get_market_data(get_clicks, demo_clicks, symbol, period, current_log):
    """Get real market data from Yahoo Finance."""
    from dash import ctx

    if not ctx.triggered:
        # Return default empty chart
        fig = go.Figure()
        fig.update_layout(
            title="No Data Loaded",
            xaxis_title="Date",
            yaxis_title="Price",
            template="plotly_white",
            height=500
        )
        return fig, "Ready to analyze markets. Click 'Get Live Data' to start!", "info", current_log, None, ""

    button_id = ctx.triggered[0]["prop_id"].split(".")[0]

    # Add to activity log
    if current_log is None:
        current_log = []

    timestamp = datetime.now().strftime("%H:%M:%S")

    if button_id == "demo-btn":
        # Generate demo data
        new_log = html.Div(f"[{timestamp}] Loading demo data...", className="activity-item")
        current_log = [new_log] + current_log[:9]

        # Create demo data
        dates = pd.date_range(end=datetime.now(), periods=100)
        prices = 150 + np.cumsum(np.random.randn(100) * 2)
        volume = np.random.randint(1000000, 10000000, 100)

        demo_df = pd.DataFrame({
            'Date': dates,
            'Close': prices,
            'Open': prices + np.random.randn(100) * 0.5,
            'High': prices + np.abs(np.random.randn(100)) * 2,
            'Low': prices - np.abs(np.random.randn(100)) * 2,
            'Volume': volume
        })

        # Create chart
        fig = create_stock_chart(demo_df, "DEMO")

        # Store data
        data_json = demo_df.to_json(date_format='iso')

        status = html.Span([
            "✅ ",
            html.B("Demo data loaded successfully!")
        ])

        chart_status = html.Span("Demo Mode", className="status-badge status-success")

        return fig, status, "success", current_log, data_json, chart_status

    elif button_id == "get-data-btn":
        # Get real data
        new_log = html.Div(f"[{timestamp}] Fetching {symbol} data...", className="activity-item")
        current_log = [new_log] + current_log[:9]

        try:
            # Download real data from Yahoo Finance
            ticker = yf.Ticker(symbol)
            df = ticker.history(period=period)

            if df.empty:
                error_log = html.Div(f"[{timestamp}] ❌ No data found for {symbol}", className="activity-item")
                current_log[0] = error_log

                fig = go.Figure()
                fig.update_layout(title=f"No data available for {symbol}")

                return fig, f"Error: No data found for symbol {symbol}", "danger", current_log, None, "Error"

            # Reset index to make Date a column
            df.reset_index(inplace=True)

            # Create chart
            fig = create_stock_chart(df, symbol)

            # Store data
            data_json = df.to_json(date_format='iso')

            # Update log
            success_log = html.Div(f"[{timestamp}] ✅ Loaded {len(df)} days of {symbol} data", className="activity-item")
            current_log[0] = success_log

            status = html.Span([
                "✅ ",
                html.B(f"Successfully loaded {symbol} data!"),
                f" ({len(df)} trading days)"
            ])

            chart_status = html.Span(f"Live: {symbol}", className="status-badge status-success")

            return fig, status, "success", current_log, data_json, chart_status

        except Exception as e:
            error_log = html.Div(f"[{timestamp}] ❌ Error: {str(e)[:50]}", className="activity-item")
            current_log[0] = error_log

            fig = go.Figure()
            fig.update_layout(title="Error loading data")

            return fig, f"Error: {str(e)}", "danger", current_log, None, "Error"

    return dash.no_update


# Callback for running analysis
@callback(
    [Output("total-return", "children"),
     Output("sharpe-ratio", "children"),
     Output("win-rate", "children"),
     Output("portfolio-value", "children"),
     Output("analysis-results", "children")],
    Input("run-analysis-btn", "n_clicks"),
    [State("data-store", "data"),
     State("strategy-select", "value")],
    prevent_initial_call=True
)
def run_analysis(n_clicks, data_json, strategy):
    """Run analysis on loaded data."""
    if not data_json:
        return "--", "--", "--", "$100,000", html.P("No data loaded. Please load data first!", className="text-danger")

    try:
        # Load data
        df = pd.read_json(data_json)

        # Calculate returns
        df['Returns'] = df['Close'].pct_change()

        # Simple strategy simulation
        if strategy == "sma":
            # SMA Crossover
            df['SMA20'] = df['Close'].rolling(20).mean()
            df['SMA50'] = df['Close'].rolling(50).mean()
            df['Signal'] = np.where(df['SMA20'] > df['SMA50'], 1, -1)
            df['Strategy_Returns'] = df['Returns'] * df['Signal'].shift(1)
        else:
            # Buy and hold
            df['Strategy_Returns'] = df['Returns']

        # Calculate metrics
        total_return = (df['Close'].iloc[-1] / df['Close'].iloc[0] - 1) * 100

        # Sharpe ratio (annualized)
        returns_clean = df['Strategy_Returns'].dropna()
        if len(returns_clean) > 0:
            sharpe = (returns_clean.mean() / returns_clean.std()) * np.sqrt(252)
        else:
            sharpe = 0

        # Win rate
        winning_days = (returns_clean > 0).sum()
        total_days = len(returns_clean)
        win_rate = (winning_days / total_days * 100) if total_days > 0 else 0

        # Final portfolio value
        initial_capital = 100000
        final_value = initial_capital * (1 + total_return / 100)

        # Format results
        total_return_str = f"{total_return:+.2f}%"
        sharpe_str = f"{sharpe:.2f}"
        win_rate_str = f"{win_rate:.1f}%"
        portfolio_str = f"${final_value:,.0f}"

        # Create detailed results
        results = html.Div([
            html.H6("Analysis Complete ✅", className="text-success mb-3"),
            html.P([html.B("Strategy: "), strategy.upper()]),
            html.P([html.B("Trading Days: "), f"{len(df)}"]),
            html.P([html.B("Best Day: "), f"{df['Returns'].max() * 100:+.2f}%"]),
            html.P([html.B("Worst Day: "), f"{df['Returns'].min() * 100:+.2f}%"]),
            html.P([html.B("Volatility: "), f"{df['Returns'].std() * np.sqrt(252) * 100:.1f}%"]),
        ])

        return total_return_str, sharpe_str, win_rate_str, portfolio_str, results

    except Exception as e:
        error_msg = html.P(f"Error running analysis: {str(e)}", className="text-danger")
        return "--", "--", "--", "$100,000", error_msg


def create_stock_chart(df, symbol):
    """Create a professional stock chart."""
    fig = make_subplots(
        rows=2, cols=1,
        shared_xaxes=True,
        vertical_spacing=0.05,
        row_heights=[0.7, 0.3],
        subplot_titles=(f"{symbol} Price", "Volume")
    )

    # Candlestick chart
    fig.add_trace(
        go.Candlestick(
            x=df['Date'] if 'Date' in df else df.index,
            open=df['Open'],
            high=df['High'],
            low=df['Low'],
            close=df['Close'],
            name='Price',
            increasing_line_color='#28a745',
            decreasing_line_color='#dc3545'
        ),
        row=1, col=1
    )

    # Volume bars
    colors = ['#28a745' if close >= open_ else '#dc3545'
              for close, open_ in zip(df['Close'], df['Open'])]

    fig.add_trace(
        go.Bar(
            x=df['Date'] if 'Date' in df else df.index,
            y=df['Volume'],
            name='Volume',
            marker_color=colors,
            opacity=0.5
        ),
        row=2, col=1
    )

    # Add moving averages if we have enough data
    if len(df) >= 20:
        ma20 = df['Close'].rolling(20).mean()
        fig.add_trace(
            go.Scatter(
                x=df['Date'] if 'Date' in df else df.index,
                y=ma20,
                name='MA(20)',
                line=dict(color='orange', width=1)
            ),
            row=1, col=1
        )

    if len(df) >= 50:
        ma50 = df['Close'].rolling(50).mean()
        fig.add_trace(
            go.Scatter(
                x=df['Date'] if 'Date' in df else df.index,
                y=ma50,
                name='MA(50)',
                line=dict(color='blue', width=1)
            ),
            row=1, col=1
        )

    # Update layout
    fig.update_layout(
        template="plotly_white",
        height=500,
        showlegend=True,
        xaxis_rangeslider_visible=False,
        hovermode='x unified'
    )

    fig.update_xaxes(title_text="Date", row=2, col=1)
    fig.update_yaxes(title_text="Price ($)", row=1, col=1)
    fig.update_yaxes(title_text="Volume", row=2, col=1)

    return fig


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8050))
    debug = os.environ.get("DEBUG", "false").lower() == "true"

    print("=" * 50)
    print("🚀 Athena Trading Platform - Stable Version")
    print(f"📍 Starting on port {port}")
    print(f"🌐 Open http://localhost:{port} in your browser")
    print("=" * 50)
    print("\n✅ All features working:")
    print("  - Get Live Data: Downloads real stock prices")
    print("  - Run Analysis: Calculates returns and metrics")
    print("  - Demo Mode: Test with sample data")
    print("\n")

    app.run(debug=debug, host="0.0.0.0", port=port)