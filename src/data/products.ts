import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase";
import fallbackProductsData from "./fallback-products.json";

/**
 * PLACEHOLDER CATALOG DATA — 19:38 Jewelry
 * ------------------------------------------------------------------
 * The 8 products in fallback-products.json are the site's built-in SAMPLE
 * DATA. Once the admin panel's products table has at least one row,
 * fetchProducts() reads from there instead — see README.md ("Admin panel &
 * content editing") and src/app/admin/products. Until then (or if Supabase
 * isn't configured at all), the site falls back to this JSON file, so
 * `next build` and the public site both work with zero setup. It's a plain
 * JSON file (not inlined below) so scripts/seed-supabase.mjs can read the
 * same data with plain Node, without pulling in this module's
 * `server-only` import.
 *
 * No real product photography exists yet, so every fallback product has
 * an empty `images` array and renders <ProductImagePlaceholder> instead —
 * nothing here is a stand-in photo pretending to be real.
 */

export type JewelryType = "ring" | "necklace" | "earrings" | "bracelet";
export type Availability = "in_stock" | "made_to_order";
export type PersonalizationOption = "engraving" | "size" | "color";

/** Edition badge shown on the product (admin-editable, replaces the old always-on "one of one" badge). */
export type EditionType = "none" | "one_of_one" | "limited";

/** Catalog collections a product can belong to — a product may be in several at once. */
export type CollectionTag = "signature_piece" | "new" | "sale";

export interface ProductLocaleContent {
  name: string;
  description: string;
}

export interface Review {
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  ru: string;
  en: string;
}

export interface Product {
  /** Supabase row id once DB-backed; absent for the static fallback data. */
  id?: string;
  slug: string;
  pieceNumber: string;
  price: number;
  /** Discounted price — shown struck-through-old + new only when "sale" is in `collections`. */
  salePrice?: number | null;
  type: JewelryType;
  /** Free text, e.g. "natural stone, rhodium" — admin types this directly. */
  materials: string;
  /** Free text, e.g. "17 cm / size 16" — admin types this directly. */
  size: string;
  availability: Availability;
  personalization: PersonalizationOption[];
  bestseller?: boolean;
  editionType: EditionType;
  collections: CollectionTag[];
  /** Uploaded product photo URLs (Supabase Storage). Empty = show the placeholder. */
  images: string[];
  reviews: Review[];
  ru: ProductLocaleContent;
  en: ProductLocaleContent;
}

export const fallbackProducts: Product[] = fallbackProductsData as Product[];

interface ProductRow {
  id: string;
  slug: string;
  piece_number: string;
  price: number;
  sale_price: number | null;
  type: JewelryType;
  materials: string;
  size: string;
  availability: Availability;
  personalization: PersonalizationOption[];
  bestseller: boolean;
  edition_type: EditionType;
  collections: CollectionTag[];
  images: string[];
  reviews: Review[];
  name_ru: string;
  name_en: string;
  description_ru: string;
  description_en: string;
}

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    pieceNumber: row.piece_number,
    price: row.price,
    salePrice: row.sale_price ?? null,
    type: row.type,
    materials: row.materials ?? "",
    size: row.size ?? "",
    availability: row.availability,
    personalization: row.personalization,
    bestseller: row.bestseller,
    editionType: row.edition_type ?? "none",
    collections: row.collections ?? [],
    images: row.images ?? [],
    reviews: row.reviews ?? [],
    ru: {
      name: row.name_ru,
      description: row.description_ru,
    },
    en: {
      name: row.name_en,
      description: row.description_en,
    },
  };
}

/**
 * The product catalog, Supabase-backed once the admin panel has been used
 * to add at least one product; otherwise the built-in sample data. Call
 * this from Server Components / Route Handlers — it never runs in the
 * browser (products.ts is `server-only`).
 */
export async function fetchProducts(): Promise<Product[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return fallbackProducts;

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return fallbackProducts;
    return (data as ProductRow[]).map(rowToProduct);
  } catch {
    // Network/DNS failure reaching Supabase (as opposed to a query error,
    // which the branch above already handles) — fall back rather than
    // taking down every page that renders the catalog.
    return fallbackProducts;
  }
}

export function getProductBySlug(products: Product[], slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getBestsellers(products: Product[]): Product[] {
  return products.filter((p) => p.bestseller);
}

export function getRelatedProducts(products: Product[], product: Product, count = 4): Product[] {
  return products
    .filter((p) => p.slug !== product.slug && p.type === product.type)
    .concat(products.filter((p) => p.slug !== product.slug && p.type !== product.type))
    .slice(0, count);
}
