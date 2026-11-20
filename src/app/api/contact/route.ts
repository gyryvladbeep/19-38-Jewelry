import { NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/email";

/**
 * Contact endpoint — validates the payload, logs it server-side, and
 * emails the shop owner at 1938jewshop@gmail.com (via Gmail SMTP — see
 * src/lib/email.ts and README.md, "Wiring up real notifications"). If
 * email isn't configured yet, the request still succeeds — the shop
 * owner still has the server-side log — so the contact form never
 * breaks on a missing App Password.
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

  const receivedAt = new Date().toISOString();

  console.log("[19:38 Jewelry] New contact message:", {
    name: body.name,
    email: body.email,
    message: body.message,
    receivedAt,
  });

  await sendNotificationEmail(
    `Новое сообщение с сайта — ${body.name}`,
    [
      `Новое сообщение с формы обратной связи.`,
      ``,
      `Имя: ${body.name}`,
      `Email: ${body.email}`,
      ``,
      `Сообщение:`,
      body.message,
      ``,
      `Получено: ${receivedAt}`,
    ].join("\n")
  );

  return NextResponse.json({ ok: true });
}
