// Client-safe album types/constants — deliberately NOT in products.ts or
// lib/albums.ts, both of which import "server-only" (they touch Supabase).
// ProductCard/ProductDetailClient/CatalogClient are Client Components that
// need these at runtime (not just as types), so they live in their own
// plain module with no server dependency.

/**
 * An admin-managed catalog tag ("album") — e.g. a jewelry type (Ring,
 * Necklace…) or a marketing collection (Bestseller, New, Sale). A product
 * can belong to any number of albums, and the admin can create/rename/
 * delete albums freely — see src/lib/albums.ts and /admin/albums.
 */
export interface Album {
  id?: string;
  slug: string;
  nameRu: string;
  nameEn: string;
  sortOrder: number;
}

/**
 * These three album slugs get special treatment in the storefront UI
 * (a colored badge on the product card/detail page, and — for "sale" —
 * the struck-through price) regardless of what else they're renamed to.
 * Every other album (jewelry-type ones included) is filter-only, with no
 * visual badge, matching the pre-albums design.
 */
export const BESTSELLER_SLUG = "bestseller";
export const NEW_SLUG = "new";
export const SALE_SLUG = "sale";
export const BADGE_ALBUM_SLUGS = [BESTSELLER_SLUG, NEW_SLUG, SALE_SLUG] as const;

/** The 4 built-in jewelry-type album slugs — used only to pick a placeholder icon. */
export const TYPE_ALBUM_SLUGS = ["ring", "necklace", "earrings", "bracelet"] as const;

export function albumLabel(album: Album, locale: string): string {
  return locale === "ru" ? album.nameRu : album.nameEn;
}
