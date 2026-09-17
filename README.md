# LHISD Anonymous Tip Line — TEST Intake (V22)

Static GitHub Pages-ready test intake for Liberty Hill ISD.

## Purpose

This build tests the path:

`Custom public intake -> Google Apps Script web app -> TEST Google Sheet`

It is deliberately marked TEST and should never receive real student, staff, medical, or safety information.

## Files

- `index.html` — public intake
- `styles.css` — responsive LHISD styling
- `app.js` — validation and Apps Script submission behavior
- `config.js` — TEST Apps Script `/exec` endpoint
- `assets/` — official LHISD logo files

## Test

1. Serve this folder over HTTP (GitHub Pages, VS Code Live Server, or `python3 -m http.server`).
2. Submit fictitious values.
3. Open `Anonymous Tip Line - TEST Responses`.
4. Confirm a new row contains the submitted values in the expected columns.

The success screen intentionally says **sent**, not **received**. Apps Script web apps are cross-origin from GitHub Pages, so the browser cannot reliably inspect the response body. The TEST spreadsheet is the authoritative verification during this integration step.

## Production note

Do not simply remove the TEST labels and call this production. After the data path is verified, production should use the production endpoint, final source taxonomy, abuse controls, and a confirmation strategy appropriate for the deployed environment.
