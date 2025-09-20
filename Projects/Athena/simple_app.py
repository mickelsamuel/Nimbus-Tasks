"""Simple Athena Dashboard for Railway deployment testing."""
import os
import dash
import dash_bootstrap_components as dbc
from dash import html, dcc

# Initialize Dash app
app = dash.Dash(
    __name__,
    external_stylesheets=[dbc.themes.BOOTSTRAP],
    title="Athena Trading Dashboard",
)

# Simple layout
app.layout = dbc.Container([
    dbc.Row([
        dbc.Col([
            html.H1("🏛️ Athena Trading Platform", className="text-center mb-4"),
            html.P("Production-grade algorithmic trading platform", className="text-center"),
            dbc.Alert("Dashboard is initializing... Full features coming soon!", color="info"),
        ])
    ])
], fluid=True, className="p-4")

# Expose server for WSGI
server = app.server

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8050))
    debug = os.environ.get("DEBUG", "false").lower() == "true"
    print(f"Starting Simple Athena Dashboard on port {port}")
    app.run(debug=debug, host="0.0.0.0", port=port)