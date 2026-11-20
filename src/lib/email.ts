import "server-only";
import nodemailer from "nodemailer";

/**
 * Sends the shop's order/contact notifications over Gmail SMTP, using an
 * App Password generated from the 1938jewshop@gmail.com Google account
 * (Google account -> Security -> 2-Step Verification -> App passwords —
 * 2FA has to be turned on first). See README.md ("Wiring up real
 * notifications") for the full setup walkthrough and the required env
 * vars (GMAIL_USER, GMAIL_APP_PASSWORD, SHOP_NOTIFICATION_EMAIL).
 *
 * Optional by design, like Supabase: isEmailConfigured() guards every
 * call site, so a missing/not-yet-set-up App Password degrades to the
 * original MVP behavior (console.log only) rather than breaking checkout
 * or the contact form.
 */

let cachedTransporter: ReturnType<typeof nodemailer.createTransport> | null | undefined;

export function isEmailConfigured(): boolean {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

function getTransporter() {
  if (!isEmailConfigured()) return null;
  if (cachedTransporter !== undefined) return cachedTransporter;

  cachedTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
  return cachedTransporter;
}

/** Where shop notifications land — defaults to the Gmail account itself. */
function notificationRecipient(): string {
  return process.env.SHOP_NOTIFICATION_EMAIL || (process.env.GMAIL_USER as string);
}

/**
 * Sends one notification email. Returns `{ ok: false }` instead of
 * throwing on failure (bad App Password, network issue, etc.) — the
 * caller already has the request logged via console.log, so a failed
 * send should never turn into a 500 for the person submitting the form.
 */
export async function sendNotificationEmail(subject: string, text: string): Promise<{ ok: boolean; error?: string }> {
  const transporter = getTransporter();
  if (!transporter) return { ok: false, error: "email_not_configured" };

  try {
    await transporter.sendMail({
      from: `"19:38 Jewelry" <${process.env.GMAIL_USER}>`,
      to: notificationRecipient(),
      subject,
      text,
    });
    return { ok: true };
  } catch (err) {
    console.error("[19:38 Jewelry] Failed to send notification email:", err);
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
