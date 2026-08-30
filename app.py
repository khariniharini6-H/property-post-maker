import os

from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def index():
    """Serve the Property Post Maker single-page app."""
    return render_template("index.html")


@app.route("/healthz")
def healthz():
    """Simple health check endpoint for deployment platforms."""
    return {"status": "ok"}


if __name__ == "__main__":
    # Render (and most PaaS providers) inject PORT; default to 5000 locally.
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
