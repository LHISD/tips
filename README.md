# LHISD Anonymous Tip Line — V28 Frontend Polish

Public GitHub Pages frontend for the Liberty Hill ISD Anonymous Tip Line.

## V28 changes
- Reduced excess vertical space in the site header and hero.
- Tightened the relationship between the page introduction, emergency notice and form card.
- Reduced unnecessary top padding inside the form card.
- Standardized field, section and divider spacing for a more consistent vertical rhythm.
- Improved desktop width balance while preserving a focused form layout.
- Improved tablet and mobile spacing and stacking behavior.
- Kept the existing public submission pipeline unchanged.

## Pipeline preserved
`GitHub Pages -> Cloudflare Worker -> Apps Script -> private datastore`

No submission fields, endpoint logic, payload names, report-ID validation, security metadata behavior or acknowledgement logic were changed.

## Files
- `index.html`
- `styles.css`
- `app.js`
- `config.js`
- `assets/lhisd-full.png`
- `assets/lhisd-texas.png`

Upload the complete contents of this folder to the root of the existing public `tips` GitHub repository.
