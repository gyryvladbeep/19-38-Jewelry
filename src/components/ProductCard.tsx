"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { useStore } from "@/lib/store";
import ProductImagePlaceholder from "@/components/ProductImagePlaceholder";
import { Badge } from "@/components/ui/Badge";
import { HeartIcon } from "@/components/icons";

export default function ProductCard({ product }: { product: Product }) {
  const locale = useLocale() as "ru" | "en";
  const t = useTranslations("common");
  const tp = useTranslations("product");
  const content = product[locale];
  const { toggleWishlist, isWishlisted, hydrated } = useStore();
  const wishlisted = hydrated && isWishlisted(product.slug);

  return (
    <div className="group relative flex flex-col">
      <div className="relative">
        <Link href={`/product/${product.slug}`} className="block">
          <ProductImagePlaceholder
            type={product.type}
            pieceNumber={product.pieceNumber}
            className="aspect-square w-full transition-opacity duration-300 group-hover:opacity-90"
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.bestseller && <Badge tone="ink">{tp("oneOfOneBadge")}</Badge>}
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

      <Link href={`/product/${product.slug}`} className="mt-4 flex flex-col gap-1">
        <span className="text-sm text-ink">{content.name}</span>
        <span className="text-sm text-muted">{formatPrice(product.price, locale)}</span>
      </Link>
    </div>
  );
}
