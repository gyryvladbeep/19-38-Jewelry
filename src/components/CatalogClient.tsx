"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { JewelryType, Product } from "@/data/products";
import { typeLabels } from "@/lib/format";
import ProductCard from "@/components/ProductCard";

const typeOptions: JewelryType[] = ["ring", "necklace", "earrings", "bracelet"];

export default function CatalogClient({ products }: { products: Product[] }) {
  const locale = useLocale() as "ru" | "en";
  const t = useTranslations("catalog");
  const tc = useTranslations("common");

  const [type, setType] = useState<JewelryType | "all">("all");

  const filtered = useMemo(() => {
    if (type === "all") return products;
    return products.filter((p) => p.type === type);
  }, [products, type]);

  return (
    <div>
      <nav
        aria-label={t("filterType")}
        className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-b border-line pb-6"
      >
        <button
          type="button"
          onClick={() => setType("all")}
          className={`text-xs uppercase tracking-[0.14em] transition-colors ${
            type === "all"
              ? "border-b border-burgundy text-burgundy"
              : "text-ink hover:text-burgundy"
          }`}
        >
          {tc("all")}
        </button>
        {typeOptions.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setType(opt)}
            className={`text-xs uppercase tracking-[0.14em] transition-colors ${
              type === opt
                ? "border-b border-burgundy text-burgundy"
                : "text-ink hover:text-burgundy"
            }`}
          >
            {typeLabels[opt][locale]}
          </button>
        ))}
      </nav>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted">{t("empty")}</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
