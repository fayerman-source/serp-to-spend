import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Public contact endpoint (no auth — prospects aren't signed in). Delivers via
// Web3Forms when WEB3FORMS_ACCESS_KEY is set (free tier, no card, arrives in the
// inbox tied to the key). Until a key is added, submissions are captured in the
// server logs so nothing is lost — either way there is no paid dependency.
export async function POST(req: Request) {
  let name = "";
  let email = "";
  let message = "";
  let botcheck = "";
  try {
    const body = (await req.json()) as { name?: string; email?: string; message?: string; botcheck?: string };
    name = String(body.name ?? "").trim();
    email = String(body.email ?? "").trim();
    message = String(body.message ?? "").trim();
    botcheck = String(body.botcheck ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: only a bot fills the hidden field. Accept silently and drop.
  if (botcheck) return NextResponse.json({ ok: true });

  if (!email || !message) {
    return NextResponse.json({ error: "Email and message are required." }, { status: 400 });
  }
  if (name.length > 200 || email.length > 200 || message.length > 5000) {
    return NextResponse.json({ error: "That message is too long." }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const key = process.env.WEB3FORMS_ACCESS_KEY;
  if (key) {
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({
          access_key: key,
          subject: `serptospend contact — ${name || email}`,
          from_name: "serptospend contact form",
          name,
          email,
          message,
        }),
      });
      if (!res.ok) throw new Error(`delivery failed (${res.status})`);
    } catch (err) {
      const m = err instanceof Error ? err.message : "delivery failed";
      console.log(JSON.stringify({ event: "contact", delivered: false, error: m, email, name, message }));
      return NextResponse.json(
        { error: "Could not send right now. Please try again shortly." },
        { status: 502 },
      );
    }
    console.log(JSON.stringify({ event: "contact", delivered: true, email }));
    return NextResponse.json({ ok: true });
  }

  // No delivery key yet: log the submission so it is not lost.
  console.log(
    JSON.stringify({ event: "contact", delivered: false, note: "no WEB3FORMS_ACCESS_KEY set", email, name, message }),
  );
  return NextResponse.json({ ok: true });
}
