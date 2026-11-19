import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { Album } from "@/data/albumTypes";

export type { Album } from "@/data/albumTypes";
export { albumLabel } from "@/data/albumTypes";

/**
 * Default albums — used until Supabase is configured (or has zero rows),
 * same fallback pattern as src/data/products.ts. These are the 4 jewelry
 * types plus the 3 marketing tags that shipped before the admin-managed
 * "albums" system replaced the old fixed `type` + `collections` fields.
 * The admin can rename, reorder, delete or add to this list freely from
 * /admin/albums — this array is only ever the starting point.
 */
export const fallbackAlbums: Album[] = [
  { slug: "ring", nameRu: "Кольцо", nameEn: "Ring", sortOrder: 0 },
  { slug: "necklace", nameRu: "Колье", nameEn: "Necklace", sortOrder: 1 },
  { slug: "earrings", nameRu: "Серьги", nameEn: "Earrings", sortOrder: 2 },
  { slug: "bracelet", nameRu: "Браслет", nameEn: "Bracelet", sortOrder: 3 },
  { slug: "bestseller", nameRu: "BESTSELLER", nameEn: "BESTSELLER", sortOrder: 4 },
  { slug: "new", nameRu: "NEW", nameEn: "NEW", sortOrder: 5 },
  { slug: "sale", nameRu: "SALE", nameEn: "SALE", sortOrder: 6 },
];

interface AlbumRow {
  id: string;
  slug: string;
  name_ru: string;
  name_en: string;
  sort_order: number;
}

function rowToAlbum(row: AlbumRow): Album {
  return {
    id: row.id,
    slug: row.slug,
    nameRu: row.name_ru,
    nameEn: row.name_en,
    sortOrder: row.sort_order,
  };
}

/**
 * All albums, ordered for display — Supabase-backed once the admin panel
 * has been used, otherwise the built-in defaults above. Call this from
 * Server Components only (albums.ts is `server-only`).
 */
export async function fetchAlbums(): Promise<Album[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return fallbackAlbums;

  try {
    const { data, error } = await supabase.from("albums").select("*").order("sort_order");
    if (error || !data || data.length === 0) return fallbackAlbums;
    return (data as AlbumRow[]).map(rowToAlbum);
  } catch {
    // Network/DNS failure reaching Supabase — never throw from a function
    // that runs on every page that shows a filter row or admin form.
    return fallbackAlbums;
  }
}
