# LHISD Anonymous Tip Line — V23 Production-Track TEST

Production-shaped test build for the Liberty Hill ISD Anonymous Tip Line.

## What changed
- Stable `AR-YYYY-######` report IDs generated server-side.
- Production-shaped Google Sheet schema instead of writing to the Google Form response tab.
- Separate restricted `Security Metadata` table.
- Case Management and Audit Log records created at intake.
- Verified acknowledgement: the green success screen is shown only after Apps Script reports that storage succeeded.
- Exact LHISD Texas seal supplied by the district is used as favicon.
- Explicit technical-data privacy notice.

## Important
This remains a TEST environment. IP address capture is intentionally blank in the Apps Script-direct path because Apps Script does not reliably expose the originating visitor IP. V23 prepares the restricted metadata schema for the edge-ingestion layer that will capture it later.

## Install
1. In the existing TEST Apps Script project, replace `Code.gs` with `apps-script/Code.gs`.
2. Save and run `initializeV23Datastore` once. Approve permissions if prompted.
3. Run `testV23Datastore`; confirm `SUCCESS: V23 datastore verified.`
4. Update the existing Web App deployment to a New version, keeping Execute as Me and access Anyone.
5. Open the `/exec` URL and confirm it reports `schema: v23`.
6. Upload `index.html`, `styles.css`, `app.js`, `config.js`, and `assets/` to the root of the public `tips` GitHub repository.
7. Submit a fictitious test. A confirmed submission should show a stable report ID and create rows in Reports, Security Metadata, Case Management, and Audit Log.
