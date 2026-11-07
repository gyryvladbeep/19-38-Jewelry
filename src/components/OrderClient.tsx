"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getPromoDiscount } from "@/data/promocodes";
import { formatPrice } from "@/lib/format";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";

const contactMethods = ["whatsapp", "telegram", "phone", "email"] as const;

export default function OrderClient() {
  const locale = useLocale() as "ru" | "en";
  const t = useTranslations("order");
  const tc = useTranslations("common");
  const { cart, promoCode, clearCart, hydrated, getProduct } = useStore();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [method, setMethod] = useState<(typeof contactMethods)[number]>("whatsapp");

  const lines = useMemo(
    () =>
      cart
        .map((line) => ({ line, product: getProduct(line.slug) }))
        .filter((e): e is { line: typeof e.line; product: NonNullable<typeof e.product> } =>
          Boolean(e.product)
        ),
    [cart, getProduct]
  );

  const subtotal = lines.reduce(
    (sum, { line, product }) => sum + product.price * line.quantity,
    0
  );
  const discountRate = promoCode ? getPromoDiscount(promoCode) : 0;
  const total = subtotal - Math.round(subtotal * discountRate);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          contact: data.get("contact"),
          contactMethod: method,
          comment: data.get("comment"),
          promoCode,
          items: lines.map(({ line, product }) => ({
            slug: product.slug,
            name: product[locale].name,
            quantity: line.quantity,
            price: product.price,
            note: line.note ?? null,
          })),
        }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
      clearCart();
    } catch {
      setStatus("error");
    }
  }

  if (!hydrated) return null;

  if (lines.length === 0 && cart.length > 0) {
    // Cart has slugs, but the catalog hasn't finished loading yet —
    // render nothing rather than flashing an "empty cart" message.
    return null;
  }

  if (status === "sent") {
    return (
      <div className="container-content max-w-lg py-24 text-center">
        <h1 className="text-3xl">{t("successTitle")}</h1>
        <p className="mt-4 text-muted">{t("successBody")}</p>
        <Button href="/catalog" className="mt-8">
          {tc("backToCatalog")}
        </Button>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container-content max-w-lg py-24 text-center">
        <h1 className="text-3xl">{t("title")}</h1>
        <p className="mt-4 text-muted">{tc("empty")}</p>
        <Button href="/catalog" className="mt-8">
          {tc("backToCatalog")}
        </Button>
      </div>
    );
  }

  return (
    <div className="container-content py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl">{t("title")}</h1>
      <p className="mt-3 max-w-lg text-sm text-muted">{t("subtitle")}</p>

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_340px]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="order-name" className="text-sm text-ink">
              {t("name")}
            </label>
            <input
              id="order-name"
              name="name"
              type="text"
              required
              className="mt-1 w-full border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-ink"
            />
          </div>
          <div>
            <label htmlFor="order-contact" className="text-sm text-ink">
              {t("contact")}
            </label>
            <input
              id="order-contact"
              name="contact"
              type="text"
              required
              className="mt-1 w-full border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-ink"
            />
          </div>
          <div>
            <span className="text-sm text-ink">{t("contactMethod")}</span>
            <div className="mt-2 flex flex-wrap gap-4">
              {contactMethods.map((m) => (
                <label key={m} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="contactMethod"
                    checked={method === m}
                    onChange={() => setMethod(m)}
                    className="h-4 w-4 accent-burgundy"
                  />
                  {t(m)}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="order-comment" className="text-sm text-ink">
              {t("comment")}
            </label>
            <textarea
              id="order-comment"
              name="comment"
              rows={4}
              placeholder={t("commentPlaceholder")}
              className="mt-1 w-full border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-ink"
            />
          </div>
          <Button type="submit" disabled={status === "sending"} className="w-full sm:w-auto">
            {t("submit")}
          </Button>
          {status === "error" && (
            <p className="text-xs text-burgundy">{tc("error")}</p>
          )}
        </form>

        <div className="h-fit border border-line p-6">
          <h2 className="text-sm uppercase tracking-[0.14em] text-muted">
            {t("orderSummary")}
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {lines.map(({ line, product }) => (
              <li key={line.slug} className="flex justify-between gap-3">
                <span>
                  {product[locale].name} &times; {line.quantity}
                </span>
                <span className="shrink-0">
                  {formatPrice(product.price * line.quantity, locale)}
                </span>
              </li>
            ))}
          </ul>
          {promoCode && discountRate > 0 && (
            <p className="mt-3 text-xs text-burgundy">
              {t("promoApplied")}: {promoCode}
            </p>
          )}
          <div className="mt-4 flex justify-between border-t border-line pt-4 text-base text-ink">
            <span>{tc("total")}</span>
            <span>{formatPrice(total, locale)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
