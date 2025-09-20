"""WSGI entry point for Railway deployment."""
import os
from athena.dashboard.app import server

# This is the WSGI application object
application = server

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8050))
    server.run(host="0.0.0.0", port=port)