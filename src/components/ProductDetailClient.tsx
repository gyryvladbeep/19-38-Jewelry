"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Product } from "@/data/products";
import { formatPrice, materialLabels, personalizationLabels } from "@/lib/format";
import { useStore } from "@/lib/store";
import ProductImagePlaceholder from "@/components/ProductImagePlaceholder";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HeartIcon, StarIcon, CheckIcon } from "@/components/icons";
import ProductCard from "@/components/ProductCard";

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
            </div>
          ) : (
            <ProductImagePlaceholder
              type={product.type}
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
            <Badge tone="burgundy">{tp("oneOfOneBadge")}</Badge>
            <Badge tone="outline">
              {product.availability === "in_stock" ? t("inStock") : t("madeToOrder")}
            </Badge>
          </div>

          <h1 className="mt-4 text-3xl md:text-4xl">{content.name}</h1>
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted">
            {tp("pieceNumberLabel")} 19:38 / {product.pieceNumber}
          </p>
          <p className="mt-6 text-2xl text-ink">{formatPrice(product.price, locale)}</p>

          <p className="mt-6 leading-relaxed text-ink">{content.description}</p>

          <div className="mt-6">
            <h2 className="text-xs uppercase tracking-[0.14em] text-muted">
              {tp("materialsTitle")}
            </h2>
            <p className="mt-2 text-sm text-ink">
              {product.materials
                .map((m) => materialLabels[m][locale])
                .filter((v, i, arr) => arr.indexOf(v) === i)
                .join(", ")}
            </p>
          </div>

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

          {/* Message card concept */}
          <div className="mt-10 border border-line bg-surface p-6">
            <h2 className="text-sm uppercase tracking-[0.14em] text-burgundy">
              {tp("messageCardTitle")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink">
              {tp("messageCardBody")}
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.1em] text-muted">
              {tp("existsOnceNote")}
            </p>
          </div>

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

      {/* Reviews */}
      <section className="mt-20 border-t border-line pt-10">
        <h2 className="text-2xl">{t("reviews")}</h2>
        {product.reviews.length === 0 ? (
          <p className="mt-4 text-sm text-muted">{t("noReviews")}</p>
        ) : (
          <ul className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {product.reviews.map((review, i) => (
              <li key={i} className="border border-line p-5">
                <div className="flex items-center gap-1 text-burgundy">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <StarIcon
                      key={starIndex}
                      filled={starIndex < review.rating}
                      className="h-4 w-4"
                    />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink">
                  {locale === "ru" ? review.ru : review.en}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.1em] text-muted">
                  {review.author}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-20 border-t border-line pt-10">
          <h2 className="text-2xl">{t("relatedProducts")}</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky add-to-cart bar — mobile only */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur md:hidden">
        <span className="text-sm text-ink">{formatPrice(product.price, locale)}</span>
        <Button onClick={handleAddToCart} size="sm" className="flex-1 max-w-[220px]">
          {added ? t("addedToCart") : t("addToCart")}
        </Button>
      </div>
    </div>
  );
}
