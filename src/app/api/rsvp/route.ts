import { NextResponse } from "next/server";

type RsvpBody = {
  firstName?: unknown;
  lastName?: unknown;
  attending?: unknown;
};

export async function POST(request: Request) {
  const scriptUrl = process.env.RSVP_GOOGLE_SCRIPT_URL;
  if (!scriptUrl) {
    return NextResponse.json(
      { error: "RSVP_GOOGLE_SCRIPT_URL is not set" },
      { status: 503 }
    );
  }

  let body: RsvpBody;
  try {
    body = (await request.json()) as RsvpBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const firstName =
    typeof body.firstName === "string" ? body.firstName.trim() : "";
  const lastName =
    typeof body.lastName === "string" ? body.lastName.trim() : "";
  const attending =
    body.attending === "yes" || body.attending === "no"
      ? body.attending
      : null;

  if (!firstName || !lastName || !attending) {
    return NextResponse.json(
      { error: "First name, last name, and attendance are required" },
      { status: 400 }
    );
  }

  const payload = {
    firstName,
    lastName,
    attending,
    submittedAt: new Date().toISOString(),
  };

  const upstream = await fetch(scriptUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    redirect: "follow",
  });

  const raw = await upstream.text();
  let parsed: { ok?: boolean; error?: string } = {};
  try {
    parsed = JSON.parse(raw) as { ok?: boolean; error?: string };
  } catch {
    return NextResponse.json(
      {
        error:
          "RSVP service returned an unexpected response. Check Apps Script deployment and SPREADSHEET_ID.",
      },
      { status: 502 }
    );
  }

  // Apps Script often returns HTTP 200 even when { ok: false } — check the body.
  if (!upstream.ok || parsed.ok !== true) {
    return NextResponse.json(
      {
        error:
          parsed.error ||
          "Could not save your response. Check Google Sheet script (SPREADSHEET_ID) and redeploy.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
