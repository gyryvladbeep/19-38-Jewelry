"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin, MEDIA_BUCKET } from "@/lib/supabase";

// See the comment on ActionResult in ../products/actions.ts: Server
// Actions return expected errors as values rather than throwing, since
// Next.js redacts a thrown error's message in production. For the same
// reason this action is invoked via useActionState + <form action>
// rather than called directly as a plain async function from a client
// event handler — see the comment above ProductForm's useActionState
// calls for the ERR_ABORTED issue that pattern caused.
export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

export interface ContentEntry {
  key: string;
  locale: "ru" | "en";
  value: string;
}

export async function saveContentBatch(
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

  let entries: ContentEntry[];
  try {
    entries = JSON.parse(String(formData.get("entries") || "[]"));
  } catch {
    return { ok: false, error: "Не удалось прочитать данные формы." };
  }
  if (!Array.isArray(entries) || entries.length === 0) return { ok: true, data: null };

  try {
    const { error } = await supabase
      .from("content_blocks")
      .upsert(entries, { onConflict: "key,locale" });
    // Supabase wraps a failed network request (e.g. an unreachable
    // SUPABASE_URL) into this `{ error }` value with a raw English
    // message ("TypeError: fetch failed") rather than throwing, so it
    // never reaches the catch below — prefix it here too, to keep the
    // admin UI's error text consistently in Russian either way.
    if (error) return { ok: false, error: `Не удалось сохранить тексты: ${error.message}` };
    return { ok: true, data: null };
  } catch (err) {
    return {
      ok: false,
      error: `Не удалось сохранить тексты: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/** Uploads one admin-picked photo for a site_images section key and saves its URL. */
export async function saveSiteImage(
  _prevState: ActionResult<{ url: string }> | null,
  formData: FormData
): Promise<ActionResult<{ url: string }>> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      ok: false,
      error:
        "Supabase не настроен. Добавьте SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY в переменные окружения (см. README.md).",
    };
  }

  const key = String(formData.get("key") || "").trim();
  if (!key) return { ok: false, error: "Не указан ключ фото." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Выберите файл изображения." };
  }

  try {
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
    const path = `site/${key}-${randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(path, file, { contentType: file.type || "image/jpeg", upsert: false });
    if (uploadError) {
      return {
        ok: false,
        error: `Не удалось загрузить фото: ${uploadError.message}. Проверьте, что в Supabase создан публичный бакет "media".`,
      };
    }
    const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);

    const { error } = await supabase
      .from("site_images")
      .upsert({ key, url: data.publicUrl }, { onConflict: "key" });
    if (error) return { ok: false, error: `Не удалось сохранить фото: ${error.message}` };

    revalidatePath("/admin/content");
    revalidatePath("/[locale]", "layout");
    return { ok: true, data: { url: data.publicUrl } };
  } catch (err) {
    return {
      ok: false,
      error: `Не удалось сохранить фото: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
