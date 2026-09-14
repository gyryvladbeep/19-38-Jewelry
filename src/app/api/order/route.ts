import { NextResponse } from "next/server";

/**
 * MVP order-request endpoint. There is no online payment on the site yet
 * (per the brief: MVP = cart -> request -> manual follow-up), so this
 * route just validates the request and logs it server-side. Wire this up
 * to a real notification channel before launch, e.g.:
 *   - Resend / Postmark for an order email to the shop owner
 *   - Telegram Bot API (sendMessage) for an instant notification
 * See README.md ("Wiring up real notifications").
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (
    !body ||
    typeof body.name !== "string" ||
    typeof body.contact !== "string" ||
    !Array.isArray(body.items) ||
    !body.name.trim() ||
    !body.contact.trim()
  ) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  console.log("[19:38 Jewelry] New order request:", {
    name: body.name,
    contact: body.contact,
    contactMethod: body.contactMethod ?? null,
    comment: body.comment ?? null,
    promoCode: body.promoCode ?? null,
    items: body.items,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
