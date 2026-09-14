"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getProductBySlug } from "@/data/products";
import { getPromoDiscount } from "@/data/promocodes";
import { formatPrice } from "@/lib/format";
import { useStore } from "@/lib/store";
import ProductImagePlaceholder from "@/components/ProductImagePlaceholder";
import { Button } from "@/components/ui/Button";
import { CloseIcon } from "@/components/icons";

export default function CartClient() {
  const locale = useLocale() as "ru" | "en";
  const t = useTranslations("cart");
  const tc = useTranslations("common");
  const { cart, setQuantity, removeFromCart, promoCode, setPromoCode, hydrated } =
    useStore();
  const [promoInput, setPromoInput] = useState(promoCode ?? "");
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  const lines = useMemo(
    () =>
      cart
        .map((line) => ({ line, product: getProductBySlug(line.slug) }))
        .filter((entry): entry is { line: typeof entry.line; product: NonNullable<typeof entry.product> } =>
          Boolean(entry.product)
        ),
    [cart]
  );

  const subtotal = lines.reduce(
    (sum, { line, product }) => sum + product.price * line.quantity,
    0
  );
  const discountRate = promoCode ? getPromoDiscount(promoCode) : 0;
  const discount = Math.round(subtotal * discountRate);
  const total = subtotal - discount;

  function applyPromo() {
    const rate = getPromoDiscount(promoInput);
    if (rate > 0) {
      setPromoCode(promoInput.trim().toUpperCase());
      setPromoMessage(tc("promoCode") + ": " + Math.round(rate * 100) + "%");
    } else {
      setPromoCode(null);
      setPromoMessage(null);
    }
  }

  if (!hydrated) return null;

  if (lines.length === 0) {
    return (
      <div className="container-content py-20 text-center">
        <h1 className="text-3xl">{t("title")}</h1>
        <p className="mt-4 text-muted">{t("empty")}</p>
        <Button href="/catalog" className="mt-8">
          {t("goToCatalog")}
        </Button>
      </div>
    );
  }

  return (
    <div className="container-content py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl">{t("title")}</h1>

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_340px]">
        <ul className="divide-y divide-line border-t border-b border-line">
          {lines.map(({ line, product }) => {
            const content = product[locale];
            return (
              <li key={line.slug} className="flex gap-4 py-6">
                <Link href={`/product/${product.slug}`} className="shrink-0">
                  <ProductImagePlaceholder
                    type={product.type}
                    pieceNumber={product.pieceNumber}
                    className="h-24 w-24"
                    iconClassName="w-8 h-8"
                  />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link href={`/product/${product.slug}`} className="text-sm text-ink">
                        {content.name}
                      </Link>
                      {line.note && (
                        <p className="mt-1 text-xs text-muted">{line.note}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(line.slug)}
                      aria-label={tc("remove")}
                      className="text-muted hover:text-burgundy"
                    >
                      <CloseIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-line">
                      <button
                        type="button"
                        onClick={() => setQuantity(line.slug, line.quantity - 1)}
                        className="px-3 py-1 text-sm hover:text-burgundy"
                        aria-label="-"
                      >
                        {"−"}
                      </button>
                      <span className="min-w-8 px-2 text-center text-sm">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(line.slug, line.quantity + 1)}
                        className="px-3 py-1 text-sm hover:text-burgundy"
                        aria-label="+"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-ink">
                      {formatPrice(product.price * line.quantity, locale)}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="h-fit border border-line p-6">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              placeholder={tc("promoCode")}
              className="w-full border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-ink"
            />
            <button
              type="button"
              onClick={applyPromo}
              className="shrink-0 border border-ink px-4 py-2 text-xs uppercase tracking-[0.1em] hover:bg-ink hover:text-paper"
            >
              {tc("apply")}
            </button>
          </div>
          {promoMessage && (
            <p className="mt-2 text-xs text-burgundy">{promoMessage}</p>
          )}

          <div className="mt-6 space-y-2 border-t border-line pt-6 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">{tc("subtotal")}</span>
              <span>{formatPrice(subtotal, locale)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-burgundy">
                <span>{promoCode}</span>
                <span>&minus;{formatPrice(discount, locale)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-line pt-2 text-base text-ink">
              <span>{tc("total")}</span>
              <span>{formatPrice(total, locale)}</span>
            </div>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-muted">{t("orderNote")}</p>

          <Button href="/order" className="mt-6 w-full">
            {t("proceedToOrder")}
          </Button>
        </div>
      </div>
    </div>
  );
}
