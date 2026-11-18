"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Product } from "@/data/products";
import { collectionLabels, editionLabels, formatPrice } from "@/lib/format";
import { useStore } from "@/lib/store";
import ProductImagePlaceholder from "@/components/ProductImagePlaceholder";
import { Badge } from "@/components/ui/Badge";
import { HeartIcon } from "@/components/icons";

export default function ProductCard({ product }: { product: Product }) {
  const locale = useLocale() as "ru" | "en";
  const t = useTranslations("common");
  const content = product[locale];
  const { toggleWishlist, isWishlisted, hydrated } = useStore();
  const wishlisted = hydrated && isWishlisted(product.slug);

  const onSale = product.collections.includes("sale") && Boolean(product.salePrice);

  return (
    <div className="group relative flex flex-col">
      <div className="relative">
        <Link href={`/product/${product.slug}`} className="block">
          <ProductImagePlaceholder
            type={product.type}
            pieceNumber={product.pieceNumber}
            images={product.images}
            className="aspect-square w-full transition-opacity duration-300 group-hover:opacity-90"
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.editionType !== "none" && (
            <Badge tone="ink">{editionLabels[product.editionType]}</Badge>
          )}
          {product.collections.includes("sale") && (
            <Badge tone="burgundy">{collectionLabels.sale}</Badge>
          )}
          {product.collections.includes("new") && (
            <Badge tone="outline" className="bg-paper">
              {collectionLabels.new}
            </Badge>
          )}
          {product.collections.includes("signature_piece") && (
            <Badge tone="outline" className="bg-paper">
              {collectionLabels.signature_piece}
            </Badge>
          )}
          {product.availability === "made_to_order" && (
            <Badge tone="outline" className="bg-paper">
              {t("madeToOrder")}
            </Badge>
          )}
        </div>

        <button
          type="button"
          onClick={() => toggleWishlist(product.slug)}
          aria-pressed={wishlisted}
          aria-label={t(wishlisted ? "removeFromWishlist" : "addToWishlist")}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-paper/90 text-ink transition-colors hover:text-burgundy"
        >
          <HeartIcon filled={wishlisted} className="h-4.5 w-4.5" />
        </button>
      </div>

      <Link href={`/product/${product.slug}`} className="mt-4 flex flex-col gap-1 px-1">
        <span className="text-sm font-black tracking-tight text-ink md:text-base">{content.name}</span>
        {onSale ? (
          <span className="flex items-center gap-2 text-sm">
            <span className="text-muted line-through">{formatPrice(product.price, locale)}</span>
            <span className="text-burgundy">{formatPrice(product.salePrice as number, locale)}</span>
          </span>
        ) : (
          <span className="text-sm text-muted">{formatPrice(product.price, locale)}</span>
        )}
      </Link>
    </div>
  );
}
