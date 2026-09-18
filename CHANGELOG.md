# Changelog

## V28 — Frontend spacing and responsive polish
- Compact site header.
- Reduced hero whitespace.
- Balanced emergency notice alignment.
- Tightened form heading and body padding.
- Standardized field spacing and section dividers.
- Improved mobile/tablet rhythm.
- Preserved ingestion behavior and backend contract.

# Changelog

## V22 — Apps Script TEST integration
- Rebuilt the public intake as a standalone static GitHub Pages project.
- Removed dependency on the prior Node/PostgreSQL submission architecture.
- Wired the provided TEST Google Apps Script `/exec` deployment through `config.js`.
- Uses native form POST to a hidden iframe to avoid relying on cross-origin JSON access.
- Matches the current TEST Apps Script field names: `concernType`, `category`, `campus`, `narrative`, `name`, `email`, `phone`, `website`.
- Added required-field validation, email validation, character count, honeypot, disabled sending state, mobile layout and accessible focus/error states.
- Uses original full-resolution LHISD artwork without logo preprocessing.
- Added explicit TEST-only messaging and avoids falsely claiming the Sheet write has been verified.
