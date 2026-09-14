import { NextResponse } from "next/server";

/**
 * MVP contact endpoint — validates the payload and logs it server-side.
 * Wire this up to a real notification channel before launch, e.g.:
 *   - Resend / Postmark for email
 *   - Telegram Bot API (sendMessage) for an instant notification
 * See README.md ("Wiring up real notifications").
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (
    !body ||
    typeof body.name !== "string" ||
    typeof body.email !== "string" ||
    typeof body.message !== "string" ||
    !body.name.trim() ||
    !body.email.trim() ||
    !body.message.trim()
  ) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  console.log("[19:38 Jewelry] New contact message:", {
    name: body.name,
    email: body.email,
    message: body.message,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
