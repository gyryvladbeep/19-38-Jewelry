"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Product } from "@/data/products";
import { BADGE_ORDER, type BadgeSlug, badgeLabel, badgeNotes } from "@/data/badgeTypes";
import { formatPrice, personalizationLabels } from "@/lib/format";
import { useStore } from "@/lib/store";
import ProductImagePlaceholder from "@/components/ProductImagePlaceholder";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HeartIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import ProductCard from "@/components/ProductCard";

/** Badge visual tone on the product detail page — see src/data/badgeTypes.ts for the slugs. */
const DETAIL_BADGE_TONE: Record<BadgeSlug, "ink" | "burgundy" | "outline"> = {
  one_of_one: "burgundy",
  limited: "burgundy",
  sale: "ink",
  new: "outline",
  bestseller: "outline",
};

/** The one or two badges (one_of_one/limited) that get an explanatory note under the price. */
const EDITION_BADGES: BadgeSlug[] = ["one_of_one", "limited"];

const personalizationFieldLabel: Record<
  string,
  { ru: string; en: string }
> = {
  size: { ru: "Желаемый размер", en: "Preferred size" },
  engraving: { ru: "Текст гравировки", en: "Engraving text" },
  color: { ru: "Пожелание по цвету", en: "Color preference" },
};

export default function ProductDetailClient({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const locale = useLocale() as "ru" | "en";
  const t = useTranslations("common");
  const tp = useTranslations("product");
  const content = product[locale];
  const { addToCart, toggleWishlist, isWishlisted, hydrated } = useStore();
  const wishlisted = hydrated && isWishlisted(product.slug);

  const [notes, setNotes] = useState<Record<string, string>>({});
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const onSale = product.badges.includes("sale") && Boolean(product.salePrice);
  const activeBadges = BADGE_ORDER.filter((slug) => product.badges.includes(slug));
  const editionBadge = EDITION_BADGES.find((slug) => product.badges.includes(slug));
  const hasMultipleImages = product.images.length > 1;

  function showPreviousImage() {
    setActiveImage((i) => (i - 1 + product.images.length) % product.images.length);
  }
  function showNextImage() {
    setActiveImage((i) => (i + 1) % product.images.length);
  }

  const noteSummary = useMemo(() => {
    return product.personalization
      .filter((key) => notes[key]?.trim())
      .map((key) => `${personalizationFieldLabel[key][locale]}: ${notes[key]}`)
      .join("; ");
  }, [notes, product.personalization, locale]);

  function handleAddToCart() {
    addToCart(product.slug, 1, noteSummary || undefined);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="container-content pb-28 pt-6 md:pb-16 md:pt-10">
      <Link
        href="/catalog"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted hover:text-burgundy"
      >
        ← {t("backToCatalog")}
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
        <div>
          {product.images[activeImage] ? (
            <div className="relative aspect-square w-full overflow-hidden bg-burgundy-tint">
              <Image src={product.images[activeImage]} alt="" fill className="object-cover" />
              {hasMultipleImages && (
                <>
                  <button
                    type="button"
                    onClick={showPreviousImage}
                    aria-label={t("previousImage")}
                    className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-paper/80 text-ink transition-colors hover:text-burgundy"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={showNextImage}
                    aria-label={t("nextImage")}
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-paper/80 text-ink transition-colors hover:text-burgundy"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          ) : (
            <ProductImagePlaceholder
              albums={product.albums}
              pieceNumber={product.pieceNumber}
              images={[]}
              className="aspect-square w-full"
              iconClassName="w-24 h-24"
            />
          )}

          {product.images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {product.images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  aria-label={`${content.name} — ${i + 1}`}
                  aria-current={i === activeImage}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden bg-burgundy-tint ${
                    i === activeImage ? "ring-1 ring-ink" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={src} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            {activeBadges.map((slug) => (
              <Badge key={slug} tone={DETAIL_BADGE_TONE[slug]}>
                {badgeLabel(slug, locale)}
              </Badge>
            ))}
            <Badge tone="outline">
              {product.availability === "in_stock" ? t("inStock") : t("madeToOrder")}
            </Badge>
          </div>

          <h1 className="mt-4 font-display text-4xl tracking-tight md:text-5xl">{content.name}</h1>
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted">
            {tp("pieceNumberLabel")} 19:38 / {product.pieceNumber}
          </p>

          {onSale ? (
            <p className="mt-6 flex items-center gap-3 text-2xl">
              <span className="text-muted line-through">{formatPrice(product.price, locale)}</span>
              <span className="text-burgundy">{formatPrice(product.salePrice as number, locale)}</span>
            </p>
          ) : (
            <p className="mt-6 text-2xl text-ink">{formatPrice(product.price, locale)}</p>
          )}

          {editionBadge && (
            <p className="mt-2 text-xs uppercase tracking-[0.08em] text-muted">
              {badgeLabel(editionBadge, locale)} — {badgeNotes[editionBadge]?.[locale]}
            </p>
          )}

          <p className="mt-6 leading-relaxed text-ink">{content.description}</p>

          {product.materials && (
            <div className="mt-6">
              <h2 className="text-xs uppercase tracking-[0.14em] text-muted">
                {tp("materialsTitle")}
              </h2>
              <p className="mt-2 text-sm text-ink">{product.materials}</p>
            </div>
          )}

          {product.size && (
            <div className="mt-6">
              <h2 className="text-xs uppercase tracking-[0.14em] text-muted">{t("size")}</h2>
              <p className="mt-2 text-sm text-ink">{product.size}</p>
            </div>
          )}

          {product.personalization.length > 0 && (
            <div className="mt-8 space-y-4 border-t border-line pt-6">
              <h2 className="text-xs uppercase tracking-[0.14em] text-muted">
                {product.personalization
                  .map((key) => personalizationLabels[key][locale])
                  .join(" · ")}
              </h2>
              {product.personalization.map((key) => (
                <div key={key}>
                  <label className="text-sm text-ink" htmlFor={`opt-${key}`}>
                    {personalizationFieldLabel[key][locale]}
                  </label>
                  <input
                    id={`opt-${key}`}
                    type="text"
                    value={notes[key] ?? ""}
                    onChange={(e) =>
                      setNotes((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    className="mt-1 w-full border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-ink"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button onClick={handleAddToCart} size="lg">
              {added ? t("addedToCart") : t("addToCart")}
            </Button>
            <button
              type="button"
              onClick={() => toggleWishlist(product.slug)}
              aria-pressed={wishlisted}
              className="flex items-center gap-2 text-sm text-ink hover:text-burgundy"
            >
              <HeartIcon filled={wishlisted} className="h-5 w-5" />
              {t(wishlisted ? "removeFromWishlist" : "addToWishlist")}
            </button>
          </div>
          {added && (
            <p className="mt-3 flex items-center gap-2 text-xs text-burgundy">
              <CheckIcon className="h-4 w-4" /> {t("addedToCart")}
            </p>
          )}

          <div className="mt-8 divide-y divide-line border-t border-b border-line">
            <details className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm">
                {tp("careTitle")}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {tp("careBody")}
              </p>
            </details>
            <details className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm">
                {tp("deliveryTitle")}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {tp("deliveryNote")}
              </p>
            </details>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-20 border-t border-line pt-10">
          <h2 className="font-display text-2xl tracking-tight">{t("relatedProducts")}</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-px gap-y-12 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky add-to-cart bar — mobile only */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur md:hidden">
        <span className="text-sm text-ink">
          {onSale ? formatPrice(product.salePrice as number, locale) : formatPrice(product.price, locale)}
        </span>
        <Button onClick={handleAddToCart} size="sm" className="flex-1 max-w-[220px]">
          {added ? t("addedToCart") : t("addToCart")}
        </Button>
      </div>
    </div>
  );
}
