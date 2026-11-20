import { NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/email";

interface OrderItem {
  slug: string;
  name: string;
  quantity: number;
  price: number;
  note: string | null;
}

/**
 * Order-request endpoint. There is no online payment on the site yet (per
 * the brief: MVP = cart -> request -> manual follow-up), so this route
 * validates the request, logs it server-side, and emails the shop owner
 * at 1938jewshop@gmail.com (via Gmail SMTP — see src/lib/email.ts and
 * README.md, "Wiring up real notifications"). If email isn't configured
 * yet, the request still succeeds — the shop owner still has the
 * server-side log — so checkout never breaks on a missing App Password.
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

  const items = body.items as OrderItem[];
  const receivedAt = new Date().toISOString();

  console.log("[19:38 Jewelry] New order request:", {
    name: body.name,
    contact: body.contact,
    contactMethod: body.contactMethod ?? null,
    comment: body.comment ?? null,
    promoCode: body.promoCode ?? null,
    items,
    receivedAt,
  });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemLines = items
    .map(
      (item) =>
        `  - ${item.name} (${item.slug}) x${item.quantity} — ${item.price} ₽${
          item.note ? ` [пометка: ${item.note}]` : ""
        }`
    )
    .join("\n");

  await sendNotificationEmail(
    `Новая заявка с сайта — ${body.name}`,
    [
      `Новая заявка на заказ.`,
      ``,
      `Имя: ${body.name}`,
      `Контакт: ${body.contact}${body.contactMethod ? ` (${body.contactMethod})` : ""}`,
      body.comment ? `Комментарий: ${body.comment}` : null,
      body.promoCode ? `Промокод: ${body.promoCode}` : null,
      ``,
      `Товары:`,
      itemLines,
      ``,
      `Итого: ${total} ₽`,
      ``,
      `Получено: ${receivedAt}`,
    ]
      .filter((line) => line !== null)
      .join("\n")
  );

  return NextResponse.json({ ok: true });
}
