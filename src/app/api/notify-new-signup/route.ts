import { NextResponse } from "next/server";

export const runtime = "nodejs";

type WebhookPayload = {
  type?: string;
  table?: string;
  schema?: string;
  record?: {
    id?: string;
    full_name?: string | null;
    email?: string | null;
    role?: string | null;
    status?: string | null;
    tenant_id?: string | null;
    created_at?: string | null;
  };
};

const NOTIFY_TO = "info@optifyllc.com";
const NOTIFY_FROM = "Operavo <noreply@operavo.ai>";

export async function POST(req: Request) {
  const secretHeader =
    req.headers.get("x-signup-notify-secret") ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  const expected = process.env.SIGNUP_NOTIFY_SECRET;
  if (!expected || secretHeader !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "RESEND_API_KEY not configured" },
      { status: 500 }
    );
  }

  let payload: WebhookPayload;
  try {
    payload = (await req.json()) as WebhookPayload;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (payload.type && payload.type !== "INSERT") {
    return NextResponse.json({ skipped: true });
  }

  const r = payload.record ?? {};
  const name = r.full_name?.trim() || "(no name)";
  const email = r.email?.trim() || "(no email)";
  const role = r.role || "—";
  const status = r.status || "—";
  const tenantId = r.tenant_id || "—";
  const createdAt = r.created_at || new Date().toISOString();

  const subject = `New signup: ${name} (${email})`;
  const text = [
    `A new client just signed up on Operavo.`,
    ``,
    `Name:       ${name}`,
    `Email:      ${email}`,
    `Role:       ${role}`,
    `Status:     ${status}`,
    `Tenant ID:  ${tenantId}`,
    `Created:    ${createdAt}`,
    ``,
    `Review and approve in the dashboard:`,
    `https://operavo.ai/dashboard`,
  ].join("\n");

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#111;line-height:1.55">
      <h2 style="margin:0 0 12px;font-size:18px">New signup on Operavo</h2>
      <table style="border-collapse:collapse;font-size:14px">
        <tr><td style="padding:4px 12px 4px 0;color:#666">Name</td><td><strong>${escapeHtml(name)}</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Email</td><td>${escapeHtml(email)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Role</td><td>${escapeHtml(role)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Status</td><td>${escapeHtml(status)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Tenant ID</td><td><code>${escapeHtml(tenantId)}</code></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Created</td><td>${escapeHtml(createdAt)}</td></tr>
      </table>
      <p style="margin-top:18px;font-size:13px">
        <a href="https://operavo.ai/dashboard" style="color:#059669">Review &amp; approve in dashboard →</a>
      </p>
    </div>
  `;

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: NOTIFY_FROM,
      to: [NOTIFY_TO],
      subject,
      text,
      html,
    }),
  });

  if (!resendRes.ok) {
    const detail = await resendRes.text();
    console.error("resend send failed", resendRes.status, detail);
    return NextResponse.json(
      { error: "send failed", detail },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
