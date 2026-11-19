import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * Admin-editable background photos on the Home and About pages — replaces
 * the static /brand/mood-texture.jpg placeholder on a per-section basis.
 * Each section has its own key so changing one doesn't affect the others,
 * even though they all fall back to the same placeholder file until set.
 * See /admin/content ("Фото сайта") and the Server Action in
 * src/app/admin/(authed)/content/actions.ts (saveSiteImage).
 */
export const SITE_IMAGE_KEYS = {
  homeHero: "home.hero",
  homeAboutTeaser: "home.aboutTeaser",
  aboutHero: "about.hero",
  aboutClosing: "about.closing",
} as const;

export type SiteImageKey = (typeof SITE_IMAGE_KEYS)[keyof typeof SITE_IMAGE_KEYS];

export const SITE_IMAGE_FALLBACK = "/brand/mood-texture.jpg";

interface SiteImageRow {
  key: string;
  url: string;
}

/** All saved overrides, keyed by section — empty map when none are set yet. */
export async function fetchSiteImages(): Promise<Record<string, string>> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return {};

  try {
    const { data, error } = await supabase.from("site_images").select("key, url");
    if (error || !data) return {};
    const map: Record<string, string> = {};
    for (const row of data as SiteImageRow[]) {
      if (row.url) map[row.key] = row.url;
    }
    return map;
  } catch {
    // Network/DNS failure reaching Supabase — this runs on the home/about
    // pages, so it must never throw; fall back to the static placeholder.
    return {};
  }
}

export function siteImageUrl(images: Record<string, string>, key: SiteImageKey): string {
  return images[key] || SITE_IMAGE_FALLBACK;
}
