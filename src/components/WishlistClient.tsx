"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import type { Product } from "@/data/products";
import { useStore } from "@/lib/store";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/Button";

export default function WishlistClient() {
  const t = useTranslations("wishlist");
  const { wishlist, addToCart, hydrated, getProduct, productsLoaded } = useStore();

  const products = useMemo(
    () => wishlist.map((slug) => getProduct(slug)).filter((p): p is Product => Boolean(p)),
    [wishlist, getProduct]
  );

  if (!hydrated) return null;

  if (products.length === 0 && wishlist.length > 0 && !productsLoaded) {
    // Wishlist has slugs, but the catalog hasn't finished loading yet —
    // render nothing rather than flashing an "empty wishlist" message.
    return null;
  }

  if (products.length === 0) {
    return (
      <div className="container-content py-20 text-center">
        <h1 className="text-3xl">{t("title")}</h1>
        <p className="mt-4 text-muted">{t("empty")}</p>
        <Button href="/catalog" className="mt-8">
          {t("title")}
        </Button>
      </div>
    );
  }

  return (
    <div className="container-content py-12 md:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl">{t("title")}</h1>
        <button
          type="button"
          onClick={() => products.forEach((p) => p && addToCart(p.slug))}
          className="text-xs uppercase tracking-[0.14em] text-ink underline underline-offset-4 hover:text-burgundy"
        >
          {t("moveAllToCart")}
        </button>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
        {products.map((product) => product && (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
