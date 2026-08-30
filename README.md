# Property Post Maker

A tiny, focused web tool for **Kavva Harini**: type in four details about a
property and get back a polished, ready-to-share real-estate social media
post — no design skills required.

Enter the property type, location, price and highlights, hit **Generate
Property Post**, and a premium listing card appears instantly, branded
automatically, ready to download as a PNG and post to WhatsApp, Instagram or
LinkedIn.

---

## Features

- **Just 4 inputs** — Property & Type, Location, Price, Highlights. Nothing
  else to fill in.
- **One-click generation** — the creative renders instantly in the browser,
  no page reload.
- **Built-in validation** — every field is required, with clear inline error
  messages guiding the user to what's missing.
- **Automatic branding** — "Kavva Harini" and a contact/enquiry strip are
  added to every post automatically. The user never has to type their own
  name or contact details.
- **Premium, professional design** — a dark, editorial real-estate card with
  a gold accent, a "Featured Listing" ribbon, and a subtle blueprint-grid
  texture — not a plain text box.
- **Download as PNG** — one click exports the finished card as a
  high-resolution image, ready to share.
- **Fully responsive** — the whole tool, including the generated post, adapts
  cleanly from desktop down to a phone screen.
- **No external CDN dependency for image export** — `html2canvas` is
  vendored locally, so downloads work reliably even on restrictive networks.

## Technologies used

- **Backend:** Python, Flask
- **Frontend:** HTML, CSS, vanilla JavaScript
- **Image export:** [html2canvas](https://html2canvas.hertzen.com/) (bundled
  locally in `static/`)
- **Fonts:** Fraunces (display) + Manrope (body), via Google Fonts
- **Production server:** Gunicorn
- **Deployment target:** Render

## Project structure

```
property-post-maker/
├── app.py                    # Flask app (serves the page + a health check)
├── requirements.txt          # Python dependencies
├── README.md
├── templates/
│   └── index.html            # The page: form + live preview
└── static/
    ├── style.css              # All styling / design system
    ├── script.js              # Validation, live rendering, PNG export
    └── html2canvas.min.js     # Vendored image-export library
```

## Running locally

1. **Clone / open the project folder:**

   ```bash
   cd property-post-maker
   ```

2. **Create a virtual environment (recommended) and install dependencies:**

   ```bash
   python3 -m venv venv
   source venv/bin/activate        # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Run the development server:**

   ```bash
   python3 app.py
   ```

4. Open **http://127.0.0.1:5000** in your browser.

   Fill in the four fields, click **Generate Property Post**, and use
   **Download Post** to save the creative as a PNG.

## Deploying on Render

1. Push this project to a GitHub (or GitLab) repository.
2. In Render, create a **New Web Service** and connect the repository.
3. Configure the service:
   - **Environment:** Python 3
   - **Build command:**
     ```bash
     pip install -r requirements.txt
     ```
   - **Start command:**
     ```bash
     gunicorn app:app --bind 0.0.0.0:$PORT
     ```
4. Deploy. Render automatically sets the `PORT` environment variable, and
   `app.py` reads it (defaulting to `5000` for local runs), so no code
   changes are needed between local development and Render.

Once deployed, the live URL will serve the exact same app you ran locally.

## Notes on the "Download Post" feature

The generated creative is captured client-side with `html2canvas` and turned
into a PNG the browser downloads directly — no server round-trip, no image
files stored anywhere. This keeps the app simple, fast, and stateless.
