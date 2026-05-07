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

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>New signup on Operavo</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #050505; padding: 48px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%;">
          <tr>
            <td style="padding: 0 0 32px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align: middle; padding-right: 10px;">
                    <div style="width: 8px; height: 8px; background-color: #34d399; border-radius: 50%; box-shadow: 0 0 10px rgba(16, 185, 129, 0.8);"></div>
                  </td>
                  <td style="vertical-align: middle;">
                    <span style="color: #ffffff; font-size: 20px; font-weight: 600; letter-spacing: -0.02em;">Operavo</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #0a0a0a; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 40px;">
              <p style="margin: 0 0 14px 0; color: #34d399; font-size: 11px; line-height: 1; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 600;">
                New signup
              </p>
              <h1 style="margin: 0 0 20px 0; color: #ffffff; font-size: 32px; font-weight: 500; line-height: 1.15; letter-spacing: -0.025em;">
                A new client <em style="font-style: italic; font-weight: 400; color: #34d399;">just signed up</em>.
              </h1>
              <p style="margin: 0 0 28px 0; color: #a1a1aa; font-size: 15px; line-height: 1.65;">
                Review the workspace details below and approve, pair them with a Vapi assistant, or revoke access from your dashboard.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; background-color: rgba(255,255,255,0.02);">
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <p style="margin: 0 0 4px 0; color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Name</p>
                    <p style="margin: 0; color: #ffffff; font-size: 14px;">${escapeHtml(name)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <p style="margin: 0 0 4px 0; color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Email</p>
                    <p style="margin: 0; color: #ffffff; font-size: 14px;">${escapeHtml(email)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <p style="margin: 0 0 4px 0; color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Role</p>
                    <p style="margin: 0; color: #ffffff; font-size: 14px;">${escapeHtml(role)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <p style="margin: 0 0 4px 0; color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Status</p>
                    <p style="margin: 0; color: #ffffff; font-size: 14px;">${escapeHtml(status)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <p style="margin: 0 0 4px 0; color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Tenant ID</p>
                    <p style="margin: 0; color: #d4d4d8; font-size: 13px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;">${escapeHtml(tenantId)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px;">
                    <p style="margin: 0 0 4px 0; color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Created</p>
                    <p style="margin: 0; color: #ffffff; font-size: 14px;">${escapeHtml(createdAt)}</p>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0 12px 0;">
                <tr>
                  <td align="center">
                    <a href="https://operavo.ai/dashboard"
                       style="display: inline-block; background-color: #ffffff; color: #050505; text-decoration: none; padding: 15px 32px; border-radius: 999px; font-size: 15px; font-weight: 500; letter-spacing: -0.005em; box-shadow: 0 0 40px -10px rgba(255,255,255,0.25);">
                      Review &amp; approve &nbsp;→
                    </a>
                  </td>
                </tr>
              </table>

              <div style="height: 1px; background-color: rgba(255,255,255,0.06); margin: 32px 0 20px 0;"></div>
              <p style="margin: 0; color: #52525b; font-size: 13px; line-height: 1.6;">
                You're receiving this because you're an admin on Operavo. New signups are flagged here automatically.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 8px 0 8px;">
              <p style="margin: 0 0 6px 0; color: #a1a1aa; font-size: 13px; font-weight: 500;">— The Operavo Team</p>
              <p style="margin: 0; color: #52525b; font-size: 12px; line-height: 1.6;">Internal notification · Do not forward.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

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
