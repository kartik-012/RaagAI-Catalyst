export function passwordResetEmail(resetLink: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0a0a0b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0b;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#18181b;border-radius:16px;border:1px solid #27272a;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 32px 0;">
              <div style="display:inline-flex;align-items:center;gap:8px;">
                <div style="width:32px;height:32px;background:linear-gradient(135deg,#6366f1,#a855f7);border-radius:8px;display:inline-block;"></div>
                <span style="font-size:16px;font-weight:600;color:#fafafa;">RagaAI Catalyst</span>
              </div>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#fafafa;">Reset Your Password</h1>
              <p style="margin:0 0 24px;font-size:14px;color:#a1a1aa;line-height:1.6;">
                We received a request to reset the password for your RagaAI Catalyst account. Click the button below to create a new password.
              </p>
              <a href="${resetLink}" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#6366f1,#a855f7);color:white;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">
                Reset Password
              </a>
              <p style="margin:24px 0 0;font-size:12px;color:#71717a;line-height:1.5;">
                This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
              </p>
              <hr style="border:none;border-top:1px solid #27272a;margin:24px 0;" />
              <p style="margin:0;font-size:11px;color:#52525b;">
                If the button doesn't work, copy and paste this URL into your browser:<br/>
                <a href="${resetLink}" style="color:#6366f1;word-break:break-all;">${resetLink}</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px 24px;border-top:1px solid #27272a;">
              <p style="margin:0;font-size:11px;color:#52525b;text-align:center;">
                © 2024 RagaAI Catalyst · Enterprise LLM Observability Platform
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function notificationEmail(title: string, message: string, actionUrl?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0a0a0b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0b;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#18181b;border-radius:16px;border:1px solid #27272a;overflow:hidden;">
          <tr>
            <td style="padding:32px 32px 0;">
              <div style="display:inline-flex;align-items:center;gap:8px;">
                <div style="width:32px;height:32px;background:linear-gradient(135deg,#6366f1,#a855f7);border-radius:8px;display:inline-block;"></div>
                <span style="font-size:16px;font-weight:600;color:#fafafa;">RagaAI Catalyst</span>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#fafafa;">${title}</h1>
              <p style="margin:0 0 24px;font-size:14px;color:#a1a1aa;line-height:1.6;">${message}</p>
              ${actionUrl ? `<a href="${actionUrl}" style="display:inline-block;padding:10px 24px;background:linear-gradient(135deg,#6366f1,#a855f7);color:white;text-decoration:none;border-radius:8px;font-size:13px;font-weight:600;">View in Dashboard</a>` : ""}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 24px;border-top:1px solid #27272a;">
              <p style="margin:0;font-size:11px;color:#52525b;text-align:center;">
                You're receiving this because you enabled email notifications · <a href="${actionUrl || '#'}" style="color:#6366f1;">Manage Preferences</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
