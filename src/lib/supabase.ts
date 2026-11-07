import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase access for the /admin panel and the public content
 * it publishes (products, editable page text). Every call goes through the
 * service role key on the server — the browser never talks to Supabase
 * directly, and no Supabase key is ever sent to the client. See
 * README.md ("Admin panel & content editing") for setup.
 *
 * Supabase is optional: until SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are
 * set, isSupabaseConfigured() returns false and every reader in
 * src/data/products.ts and src/lib/content.ts falls back to the static
 * placeholder data that shipped with the site, so `next build` and the
 * public site both keep working with zero configuration.
 */

let cached: SupabaseClient | null | undefined;

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getSupabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (cached !== undefined) return cached;

  cached = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    { auth: { persistSession: false } }
  );
  return cached;
}

export const MEDIA_BUCKET = "media";
