"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { CERTIFICATE_DEFAULT_AMOUNT, CERTIFICATE_MIN_AMOUNT, CERTIFICATE_SLUG } from "@/data/certificate";
import { formatPrice } from "@/lib/format";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/icons";

export default function CertificateClient({ photoUrl }: { photoUrl: string }) {
  const locale = useLocale() as "ru" | "en";
  const t = useTranslations("certificate");
  const tc = useTranslations("common");
  const { addToCart } = useStore();

  const [amountInput, setAmountInput] = useState(String(CERTIFICATE_DEFAULT_AMOUNT));
  const [added, setAdded] = useState(false);

  const amount = Number(amountInput);
  const isValid = Number.isFinite(amount) && amount >= CERTIFICATE_MIN_AMOUNT;

  function handleAddToCart() {
    if (!isValid) return;
    addToCart(CERTIFICATE_SLUG, 1, undefined, Math.round(amount));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="container-content pb-20 pt-6 md:pb-28 md:pt-10">
      {/* object-contain + an aspect ratio close to the uploaded certificate
          photo's own (commonly ~8:5 for a gift-card design) so the whole
          image shows — a photo like this one is the product itself, unlike
          the cropped mood photos used as backgrounds elsewhere on the site. */}
      <div className="relative aspect-[8/5] w-full overflow-hidden bg-paper">
        <Image src={photoUrl} alt="" fill className="object-contain object-center" priority />
      </div>

      <div className="mx-auto mt-10 max-w-xl text-center">
        <h1 className="font-display text-3xl tracking-tight md:text-4xl">{t("pageTitle")}</h1>
        <p className="mt-5 text-lg text-ink">{t("intro")}</p>
        <p className="mt-4 leading-relaxed text-muted">{t("body")}</p>
        <p className="mt-4 text-xs italic leading-relaxed text-muted">{t("note")}</p>

        <p className="mt-8 text-2xl text-ink">{formatPrice(isValid ? Math.round(amount) : 0, locale)}</p>

        <div className="mt-6 text-left">
          <label htmlFor="certificate-amount" className="text-sm text-ink">
            {t("amountLabel")}
          </label>
          <input
            id="certificate-amount"
            type="number"
            min={CERTIFICATE_MIN_AMOUNT}
            step={100}
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            className="mt-1 w-full border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-ink"
          />
          <p className="mt-1 text-xs text-muted">{t("amountHint")}</p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button onClick={handleAddToCart} size="lg" disabled={!isValid}>
            {added ? tc("addedToCart") : tc("addToCart")}
          </Button>
        </div>
        {added && (
          <p className="mt-3 flex items-center justify-center gap-2 text-xs text-burgundy">
            <CheckIcon className="h-4 w-4" /> {tc("addedToCart")}
          </p>
        )}
      </div>
    </div>
  );
}
