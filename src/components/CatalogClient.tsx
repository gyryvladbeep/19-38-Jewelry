"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import type { Product } from "@/data/products";
import type { Album } from "@/data/albumTypes";
import { albumLabel } from "@/data/albumTypes";
import ProductCard from "@/components/ProductCard";

export default function CatalogClient({
  products,
  albums,
}: {
  products: Product[];
  albums: Album[];
}) {
  const locale = useLocale() as "ru" | "en";
  const t = useTranslations("catalog");
  const tc = useTranslations("common");

  // A link into the catalog can pre-select an album via ?album=<slug> (the
  // homepage's "new collection" buttons use this) — falls back to "all"
  // for a plain /catalog visit or an unknown/removed slug. Read once on
  // mount; the filter buttons below then behave exactly as before.
  const searchParams = useSearchParams();
  const initialAlbum = searchParams.get("album");
  const [album, setAlbum] = useState<string | "all">(
    initialAlbum && albums.some((a) => a.slug === initialAlbum) ? initialAlbum : "all"
  );

  const sortedAlbums = useMemo(
    () => [...albums].sort((a, b) => a.sortOrder - b.sortOrder),
    [albums]
  );

  const filtered = useMemo(() => {
    if (album === "all") return products;
    return products.filter((p) => p.albums.includes(album));
  }, [products, album]);

  return (
    <div>
      <nav
        aria-label={t("filterType")}
        className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-b border-line pb-6"
      >
        <button
          type="button"
          onClick={() => setAlbum("all")}
          className={`text-xs uppercase tracking-[0.14em] transition-colors ${
            album === "all"
              ? "border-b border-burgundy text-burgundy"
              : "text-ink hover:text-burgundy"
          }`}
        >
          {tc("all")}
        </button>
        {sortedAlbums.map((a) => (
          <button
            key={a.slug}
            type="button"
            onClick={() => setAlbum(a.slug)}
            className={`text-xs uppercase tracking-[0.14em] transition-colors ${
              album === a.slug
                ? "border-b border-burgundy text-burgundy"
                : "text-ink hover:text-burgundy"
            }`}
          >
            {albumLabel(a, locale)}
          </button>
        ))}
      </nav>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted">{t("empty")}</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-px gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
