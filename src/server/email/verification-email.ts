export interface VerificationEmailPayload {
  firstName: string;
  otp: string;
  expiresInSeconds: number;
  verifyUrl: string;
}

export function buildVerificationEmail({ firstName, otp, expiresInSeconds, verifyUrl }: VerificationEmailPayload) {
  const subject = "Your Dovia verification code";
  const preheader = `Use this 6-digit code to verify your Dovia account. It expires in ${expiresInSeconds / 60} minutes.`;

  const plainText = `Hi ${firstName},

Your Dovia verification code is:

${otp}

This code expires in ${expiresInSeconds / 60} minutes.

Never share this code with anyone.

If you didn't create this Dovia account, you can ignore this message.

Dovia
Turn conversations into action.`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Verify your Dovia account</title>
</head>
<body style="margin:0;padding:0;background-color:#F5F7FF;color:#11142D;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <div style="display:none;font-size:1px;color:#F5F7FF;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    ${preheader}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F5F7FF;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;margin:0 auto;background:#FFFFFF;border:1px solid #E7EAF3;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:24px 24px 16px;">
              <p style="margin:0;font-size:18px;font-weight:700;letter-spacing:-0.01em;">Dovia</p>
              <p style="margin:4px 0 0;font-size:13px;color:#667085;">Turn conversations into action.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 16px;">
              <h1 style="margin:0;font-size:20px;font-weight:700;">Verify your email</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 8px;">
              <p style="margin:0;font-size:14px;line-height:1.6;color:#11142D;">Hi ${firstName},</p>
              <p style="margin:12px 0 0;font-size:14px;line-height:1.6;color:#11142D;">Thanks for creating your Dovia account. Use the verification code below to confirm your email address.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="background:#F5F7FF;border:1px solid #E7EAF3;border-radius:12px;padding:18px 16px;">
                    <span style="font-size:32px;font-weight:800;letter-spacing:0.35em;color:#4F6BFF;">${otp}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 16px;">
              <p style="margin:0;font-size:13px;line-height:1.5;color:#667085;">This code expires in ${expiresInSeconds / 60} minutes.</p>
              <p style="margin:8px 0 0;font-size:13px;line-height:1.5;color:#667085;">Never share this code with anyone.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 16px;">
              <a href="${verifyUrl}" style="display:inline-block;min-height:40px;padding:10px 14px;border-radius:10px;background:#4F6BFF;color:#FFFFFF;font-size:14px;font-weight:600;text-decoration:none;">Verify in Dovia</a>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 24px;">
              <p style="margin:0;font-size:13px;line-height:1.5;color:#667085;">If you didn't create a Dovia account, you can safely ignore this email.</p>
              <p style="margin:16px 0 0;font-size:13px;line-height:1.5;color:#667085;">— Dovia Team</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, plainText, html };
}
