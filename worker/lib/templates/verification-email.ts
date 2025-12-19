import type { PendingEmailRequest } from "../supabase.js";

// Role labels for display in emails
const ROLE_LABELS: Record<string, string> = {
  founder: "the Founder",
  co_founder: "a Co-Founder",
  cofounder: "a Co-Founder",
  executive: "an Executive",
  ceo_non_founder: "the CEO",
  employee: "a team member",
  customer: "a customer",
  supplier: "a supplier",
  partner: "a partner",
  investor: "an investor",
  other: "a team member",
};

// Relationship labels for display in emails
const RELATIONSHIP_LABELS: Record<string, string> = {
  colleague: "ex-colleague",
  customer: "ex-customer",
  supplier: "ex-supplier",
  partner: "ex-partner",
  investor: "ex-investor",
  other: "contact",
};

export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

export function generateVerificationEmail(
  request: PendingEmailRequest,
  appUrl: string
): EmailContent {
  const requesterName = request.requester_name || "Someone";
  const organizationName = request.organization.name;
  const recipientName = request.verifier_name || "there";
  const roleLabel = request.claimed_role
    ? ROLE_LABELS[request.claimed_role] || "a team member"
    : "a team member";
  const relationshipLabel = RELATIONSHIP_LABELS[request.relationship] || "contact";

  // Build location string from city and country
  const locationParts = [
    request.organization.location_city,
    request.organization.location_country,
  ].filter(Boolean);
  const location = locationParts.length > 0 ? locationParts.join(", ") : null;
  const organizationWithLocation = location
    ? `${organizationName} (${location})`
    : organizationName;

  const verifyUrl = `${appUrl}/verify/${request.token}`;

  const subject = `${requesterName} asks for your help preserving ${organizationName}'s legacy`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a; color: #94a3b8;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #334155;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #f8fafc;">SOIL</h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #64748b;">Preserving organizational legacies</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #cbd5e1;">
                Hi ${recipientName},
              </p>

              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #cbd5e1;">
                <strong style="color: #f8fafc;">${requesterName}</strong>, who was
                <strong style="color: #fbbf24;">${roleLabel}</strong> of
                <strong style="color: #f8fafc;">${organizationWithLocation}</strong>, is documenting
                the organization's story on SOIL — a platform dedicated to preserving the
                legacies of organizations that have closed.
              </p>

              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #cbd5e1;">
                Every year, millions of companies close their doors. Their stories, lessons,
                and the people who built them risk being forgotten. SOIL exists to change that
                — creating digital cenotaphs that honor these journeys and help future founders
                learn from the past.
              </p>

              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #cbd5e1;">
                <strong style="color: #f8fafc;">${requesterName}</strong> listed you as
                <strong style="color: #fbbf24;">an ${relationshipLabel}</strong> who can confirm
                that ${organizationName} existed and their role in it. Your verification helps
                ensure authenticity and honors the real story.
              </p>

              <!-- CTA Box -->
              <table role="presentation" style="width: 100%; margin: 24px 0;">
                <tr>
                  <td style="background-color: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.2); border-radius: 8px; padding: 16px;">
                    <p style="margin: 0; font-size: 14px; color: #fcd34d;">
                      <strong>It takes just 30 seconds:</strong> Click the button below, review
                      the details, and confirm.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Button -->
              <table role="presentation" style="width: 100%; margin: 24px 0;">
                <tr>
                  <td style="text-align: center;">
                    <a href="${verifyUrl}"
                       style="display: inline-block; padding: 14px 32px; background-color: #fbbf24; color: #1e293b; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 8px;">
                      Verify Now
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Link fallback -->
              <p style="margin: 20px 0; font-size: 14px; color: #64748b; word-break: break-all;">
                Or copy this link: <a href="${verifyUrl}" style="color: #60a5fa;">${verifyUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; border-top: 1px solid #334155;">
              <p style="margin: 0; font-size: 12px; color: #475569; line-height: 1.5;">
                If you don't recognize ${requesterName} or ${organizationName}, simply ignore
                this email. This link will expire in 30 days.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

  // Plain text version for email clients that don't support HTML
  const text = `
Hi ${recipientName},

${requesterName}, who was ${roleLabel} of ${organizationWithLocation}, is documenting the organization's story on SOIL — a platform dedicated to preserving the legacies of organizations that have closed.

Every year, millions of companies close their doors. Their stories, lessons, and the people who built them risk being forgotten. SOIL exists to change that — creating digital cenotaphs that honor these journeys and help future founders learn from the past.

${requesterName} listed you as an ${relationshipLabel} who can confirm that ${organizationName} existed and their role in it. Your verification helps ensure authenticity and honors the real story.

It takes just 30 seconds: Click the link below, review the details, and confirm.

Verify Now: ${verifyUrl}

---
If you don't recognize ${requesterName} or ${organizationName}, simply ignore this email. This link will expire in 30 days.
`.trim();

  return { subject, html, text };
}
