import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";
dotenv.config();

// setup client
const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

// send mail function
export const sendInviteMail = async (
  toEmail,
  orgName,
  inviterName,
  inviteLink,
) => {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const emailData = {
    sender: {
      name: "Zira App",
      email: process.env.SENDER_EMAIL,
    },
    to: [{ email: toEmail }],
    subject: `You've been invited to join ${orgName}`,
    htmlContent: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>You're invited to join ${orgName}</title>
</head>
<body style="margin:0;padding:0;background-color:#E0F2FE;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;background:#E0F2FE;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;border-radius:16px;overflow:hidden;border:1px solid #BAE6FD;">

        <!-- Sky Blue Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#38BDF8 0%,#0EA5E9 50%,#0284C7 100%);padding:28px 36px 64px;">
            <table width="100%"><tr>
              <td style="color:#fff;font-size:20px;font-weight:700;letter-spacing:-0.3px;">Zira</td>
              <td align="right"><span style="background:rgba(255,255,255,0.2);color:#fff;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;letter-spacing:0.06em;">INVITE</span></td>
            </tr></table>
          </td>
        </tr>

        <!-- White Body -->
        <tr>
          <td style="background:#ffffff;border-radius:16px 16px 0 0;margin-top:-24px;padding:32px 36px 0;text-align:center;">


            <div style="display:inline-block;background:#E0F2FE;color:#0369A1;font-size:11px;font-weight:700;padding:4px 14px;border-radius:20px;letter-spacing:0.06em;margin-bottom:16px;">NEW INVITATION</div>

            <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#0F172A;line-height:1.3;">
              Join <span style="color:#0284C7;">${orgName}</span> on Zira
            </h1>

            <p style="margin:0 0 28px;font-size:14px;color:#475569;line-height:1.75;">
              <strong style="color:#0F172A;">${inviterName}</strong> is inviting you to collaborate with the team. You're just one click away from getting started!
            </p>

            <!-- CTA Button -->
            <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
              <tr>
                <td style="background:linear-gradient(135deg,#38BDF8,#0284C7);border-radius:50px;">
                  <a href="${inviterName}" style="display:inline-block;padding:15px 44px;color:#fff;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.02em;">
                    Accept Invitation &rarr;
                  </a>
                </td>
              </tr>
            </table>

            <!-- Stats Row -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E0F2FE;border-radius:12px;overflow:hidden;margin-bottom:32px;">
              <tr>
                <td style="width:33%;padding:16px 8px;text-align:center;background:#F0F9FF;border-right:1px solid #E0F2FE;">
                  <p style="margin:0;font-size:20px;font-weight:700;color:#0284C7;">7</p>
                  <p style="margin:4px 0 0;font-size:11px;color:#7DD3FC;">Days left</p>
                </td>
                <td style="width:33%;padding:16px 8px;text-align:center;background:#F0F9FF;border-right:1px solid #E0F2FE;">
                  <p style="margin:0;font-size:20px;font-weight:700;color:#0284C7;">Free</p>
                  <p style="margin:4px 0 0;font-size:11px;color:#7DD3FC;">To join</p>
                </td>
                <td style="width:33%;padding:16px 8px;text-align:center;background:#F0F9FF;">
                  <p style="margin:0;font-size:20px;font-weight:700;color:#0284C7;">1-click</p>
                  <p style="margin:4px 0 0;font-size:11px;color:#7DD3FC;">Setup</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Fallback + Footer -->
        <tr>
          <td style="background:#fff;padding:0 36px 24px;">

            <!-- Notice -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border-left:3px solid #38BDF8;border-radius:0 8px 8px 0;margin-bottom:20px;">
              <tr><td style="padding:12px 16px;">
                <p style="margin:0;font-size:12px;color:#64748B;line-height:1.6;">
                  This invitation was sent to <strong style="color:#0F172A;">${toEmail}</strong>. If you weren't expecting this, you can safely ignore it.
                </p>
              </td></tr>
            </table>

            <p style="margin:0;font-size:11px;color:#CBD5E1;text-align:center;">
              &copy; 2025 Zira Inc. &nbsp;&middot;&nbsp; Unsubscribe &nbsp;&middot;&nbsp; Privacy Policy
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>
`,
  };

  try {
    const response = await apiInstance.sendTransacEmail(emailData);
    console.log("✅ Email sent:", response);
  } catch (error) {
    console.error("❌ Error:", error.response?.body || error.message);
  }
};
