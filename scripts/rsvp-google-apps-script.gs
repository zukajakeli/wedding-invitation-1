/**
 * SETUP (do these in order)
 *
 * A) Sheet ID (required for rows to appear)
 *    Open your sheet; copy the ID from the URL …/spreadsheets/d/THIS_ID/edit
 *    Put it in SPREADSHEET_ID below (replace YOUR_SPREADSHEET_ID_HERE).
 *
 * B) Apps Script
 *    Same spreadsheet → Extensions → Apps Script.
 *    Paste this whole file over Code.gs → Save.
 *
 * C) Deploy the web app
 *    Deploy → New deployment → gear icon “Select type” → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone  (so the wedding site can POST without Google login)
 *    → Deploy → Authorize (pick your Google account → Advanced → Go to … → Allow)
 *    → Copy the Web app URL (must contain “/exec” at the end).
 *
 * D) Connect your Next.js app
 *    In the wedding-invitation folder, create .env.local with one line:
 *    RSVP_GOOGLE_SCRIPT_URL=paste_the_web_app_url_here
 *    Restart: npm run dev
 *
 * E) Quick test
 *    Paste the same URL in a browser: you should see “RSVP endpoint OK”.
 *    Submit the form on your site: a new row should appear in the sheet.
 *
 * Optional row 1 in the sheet: Timestamp | First name | Last name | Attending
 *
 * IMPORTANT: Web app runs “headless” — getActiveSpreadsheet() is often null.
 * Put your Sheet ID below (from the browser URL: /spreadsheets/d/SHEET_ID_HERE/edit).
 */

/** Paste between /d/ and /edit in your Google Sheet URL */
var SPREADSHEET_ID = '1VzxRvpDj0NPunexVYJtmPImub914Z7DtHPlY8oIFenM';

function getTargetSheet() {
  if (SPREADSHEET_ID && SPREADSHEET_ID !== 'YOUR_SPREADSHEET_ID_HERE') {
    return SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
  }
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error(
      'Set SPREADSHEET_ID in the script (see comment). getActiveSpreadsheet() is empty for web apps.',
    );
  }
  return ss.getActiveSheet();
}

/** Open this Web app URL in a browser to confirm deployment (GET). */
function doGet() {
  return ContentService.createTextOutput('RSVP endpoint OK — form uses POST.');
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getTargetSheet();
    sheet.appendRow([
      data.submittedAt || new Date().toISOString(),
      data.firstName,
      data.lastName,
      data.attending,
    ]);
    return ContentService.createTextOutput(
      JSON.stringify({ ok: true }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
