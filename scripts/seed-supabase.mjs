// Pushes the site's built-in sample products into Supabase, so you start
// the admin panel with something in the catalog instead of an empty list.
// Safe to run more than once — it skips any slug that already exists.
//
// Usage (from the project root, with your Supabase env vars available):
//   node --env-file=.env.local scripts/seed-supabase.mjs
//
// (--env-file needs Node 20.6+. On an older Node, export SUPABASE_URL and
// SUPABASE_SERVICE_ROLE_KEY in your shell first, then run the script
// without --env-file.)

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY. Run with --env-file=.env.local (Node 20.6+) or export them first."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const raw = await readFile(path.join(__dirname, "../src/data/fallback-products.json"), "utf8");
const products = JSON.parse(raw);

const { data: existing, error: existingError } = await supabase.from("products").select("slug");
if (existingError) {
  console.error("Could not read the products table — did you run supabase/schema.sql yet?");
  console.error(existingError.message);
  process.exit(1);
}
const existingSlugs = new Set((existing ?? []).map((r) => r.slug));

const rows = products
  .filter((p) => !existingSlugs.has(p.slug))
  .map((p) => ({
    slug: p.slug,
    piece_number: p.pieceNumber,
    price: p.price,
    type: p.type,
    materials: p.materials,
    availability: p.availability,
    personalization: p.personalization,
    bestseller: Boolean(p.bestseller),
    images: p.images ?? [],
    reviews: p.reviews ?? [],
    name_ru: p.ru.name,
    name_en: p.en.name,
    short_description_ru: p.ru.shortDescription,
    short_description_en: p.en.shortDescription,
    description_ru: p.ru.description,
    description_en: p.en.description,
  }));

if (rows.length === 0) {
  console.log("Nothing to seed — every sample slug already exists in Supabase.");
  process.exit(0);
}

const { error: insertError } = await supabase.from("products").insert(rows);
if (insertError) {
  console.error("Insert failed:", insertError.message);
  process.exit(1);
}

console.log(`Seeded ${rows.length} product(s) into Supabase.`);
