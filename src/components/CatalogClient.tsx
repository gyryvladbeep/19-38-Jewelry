"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { JewelryType, MaterialKey, Product } from "@/data/products";
import { materialLabels, typeLabels } from "@/lib/format";
import ProductCard from "@/components/ProductCard";

type SortKey = "newest" | "price-asc" | "price-desc";

const materialOptions: MaterialKey[] = ["stone", "pearl", "rhodium"];
const typeOptions: JewelryType[] = ["ring", "necklace", "earrings", "bracelet"];

export default function CatalogClient({ products }: { products: Product[] }) {
  const locale = useLocale() as "ru" | "en";
  const t = useTranslations("catalog");
  const tc = useTranslations("common");

  const [query, setQuery] = useState("");
  const [materials, setMaterials] = useState<MaterialKey[]>([]);
  const [type, setType] = useState<JewelryType | "all">("all");
  const [sort, setSort] = useState<SortKey>("newest");

  function toggleMaterial(material: MaterialKey) {
    setMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material]
    );
  }

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const name = p[locale].name.toLowerCase();
      const matchesQuery = query.trim() === "" || name.includes(query.toLowerCase());
      const matchesType = type === "all" || p.type === type;
      const matchesMaterial =
        materials.length === 0 || materials.some((m) => p.materials.includes(m));
      return matchesQuery && matchesType && matchesMaterial;
    });

    list = [...list].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return 0;
    });

    return list;
  }, [products, query, materials, type, sort, locale]);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
      <aside className="space-y-8">
        <div>
          <label htmlFor="catalog-search" className="sr-only">
            {t("title")}
          </label>
          <input
            id="catalog-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="..."
            className="w-full border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-ink"
          />
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.14em] text-muted">
            {t("filterType")}
          </h3>
          <div className="mt-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setType("all")}
              className={`text-left text-sm ${type === "all" ? "text-burgundy" : "text-ink hover:text-burgundy"}`}
            >
              {tc("all")}
            </button>
            {typeOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setType(opt)}
                className={`text-left text-sm ${type === opt ? "text-burgundy" : "text-ink hover:text-burgundy"}`}
              >
                {typeLabels[opt][locale]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.14em] text-muted">
            {t("filterMaterial")}
          </h3>
          <div className="mt-3 flex flex-col gap-2">
            {materialOptions.map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={materials.includes(opt)}
                  onChange={() => toggleMaterial(opt)}
                  className="h-4 w-4 accent-burgundy"
                />
                {materialLabels[opt][locale]}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.14em] text-muted">
            {t("filterPrice")}
          </h3>
          <p className="mt-3 text-sm text-muted">
            {tc("from")} 1&nbsp;000 &ndash; 10&nbsp;000&nbsp;₽
          </p>
        </div>

        {(materials.length > 0 || type !== "all" || query) && (
          <button
            type="button"
            onClick={() => {
              setMaterials([]);
              setType("all");
              setQuery("");
            }}
            className="text-xs uppercase tracking-[0.14em] text-ink underline underline-offset-4 hover:text-burgundy"
          >
            {tc("clearFilters")}
          </button>
        )}
      </aside>

      <div>
        <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
          <p className="text-sm text-muted">
            {t("resultsCount", { count: filtered.length })}
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="border border-line bg-surface px-3 py-2 text-xs uppercase tracking-[0.1em] outline-none focus:border-ink"
          >
            <option value="newest">{tc("sortNewest")}</option>
            <option value="price-asc">{tc("sortPriceAsc")}</option>
            <option value="price-desc">{tc("sortPriceDesc")}</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted">{t("empty")}</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
