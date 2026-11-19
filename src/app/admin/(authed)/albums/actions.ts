"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";

export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

function dbErrorMessage(action: string, message: string): string {
  return `Не удалось ${action}: ${message}`;
}

/** Creates a new album, or renames/reorders an existing one (slug is immutable once created). */
export async function saveAlbum(
  _prevState: ActionResult<null> | null,
  formData: FormData
): Promise<ActionResult<null>> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      ok: false,
      error:
        "Supabase не настроен. Добавьте SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY в переменные окружения (см. README.md).",
    };
  }

  try {
    const id = String(formData.get("id") || "").trim();
    const nameRu = String(formData.get("nameRu") || "").trim();
    const nameEn = String(formData.get("nameEn") || "").trim();
    const sortOrder = Math.trunc(Number(formData.get("sortOrder") || 0));

    if (!nameRu || !nameEn) {
      return { ok: false, error: "Укажите название альбома на русском и английском." };
    }

    if (id) {
      const { error } = await supabase
        .from("albums")
        .update({ name_ru: nameRu, name_en: nameEn, sort_order: sortOrder })
        .eq("id", id);
      if (error) return { ok: false, error: dbErrorMessage("сохранить альбом", error.message) };
    } else {
      const slug = String(formData.get("slug") || "").trim();
      if (!slug) {
        return { ok: false, error: "Укажите slug нового альбома — латиницей, например: slow-season." };
      }
      if (!/^[a-z0-9-]+$/.test(slug)) {
        return {
          ok: false,
          error: "Slug может содержать только латинские буквы, цифры и дефис, например: slow-season.",
        };
      }
      const { error } = await supabase
        .from("albums")
        .insert({ slug, name_ru: nameRu, name_en: nameEn, sort_order: sortOrder });
      if (error) return { ok: false, error: dbErrorMessage("создать альбом", error.message) };
    }

    revalidatePath("/admin/albums");
    revalidatePath("/admin/products");
    revalidatePath("/[locale]", "layout");
    return { ok: true, data: null };
  } catch (err) {
    return {
      ok: false,
      error: dbErrorMessage("сохранить альбом", err instanceof Error ? err.message : String(err)),
    };
  }
}

/** Deletes an album and strips its slug from every product's `albums` array. */
export async function deleteAlbum(
  _prevState: ActionResult<null> | null,
  formData: FormData
): Promise<ActionResult<null>> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      ok: false,
      error:
        "Supabase не настроен. Добавьте SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY в переменные окружения (см. README.md).",
    };
  }

  const id = String(formData.get("id") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  if (!id || !slug) return { ok: false, error: "Не указан альбом для удаления." };

  try {
    // Strip this album's slug from every product that has it, so no
    // product is left pointing at an album that no longer exists.
    const { data: affected, error: selectError } = await supabase
      .from("products")
      .select("id, albums")
      .contains("albums", [slug]);
    if (selectError) {
      return { ok: false, error: dbErrorMessage("удалить альбом", selectError.message) };
    }
    for (const row of affected ?? []) {
      const nextAlbums = ((row as { albums: string[] }).albums ?? []).filter((a) => a !== slug);
      const { error: updateError } = await supabase
        .from("products")
        .update({ albums: nextAlbums })
        .eq("id", (row as { id: string }).id);
      if (updateError) {
        return { ok: false, error: dbErrorMessage("обновить товары альбома", updateError.message) };
      }
    }

    const { error } = await supabase.from("albums").delete().eq("id", id);
    if (error) return { ok: false, error: dbErrorMessage("удалить альбом", error.message) };

    revalidatePath("/admin/albums");
    revalidatePath("/admin/products");
    revalidatePath("/[locale]", "layout");
    return { ok: true, data: null };
  } catch (err) {
    return {
      ok: false,
      error: dbErrorMessage("удалить альбом", err instanceof Error ? err.message : String(err)),
    };
  }
}
