"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin, MEDIA_BUCKET } from "@/lib/supabase";
import type {
  Availability,
  JewelryType,
  MaterialKey,
  PersonalizationOption,
} from "@/data/products";

/**
 * Server Actions must return expected errors as values, not throw them —
 * Next.js redacts a thrown error's message in production builds (it only
 * ever reaches the client as a generic digest), which would turn every
 * "Supabase isn't configured" or "upload failed" message into an opaque
 * error. See node_modules/next/dist/docs/.../error-handling.md
 * ("Handling expected errors" — "avoid using try/catch blocks and throw
 * errors. Instead, model expected errors as return values").
 */
export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

function getList(formData: FormData, name: string): string[] {
  return formData
    .getAll(name)
    .map((v) => String(v))
    .filter(Boolean);
}

// Supabase's client wraps a failed network request (e.g. an unreachable
// SUPABASE_URL) into a `{ error }` return value with a raw, English,
// low-level message ("TypeError: fetch failed") rather than throwing —
// so it never reaches our try/catch below. This keeps the admin UI's
// error text consistently in Russian either way.
function dbErrorMessage(action: string, message: string): string {
  return `Не удалось ${action}: ${message}`;
}

export async function saveProduct(
  _prevState: ActionResult<{ id: string }> | null,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
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
    const existingImages = getList(formData, "existingImages");
    const newFiles = formData
      .getAll("newImages")
      .filter((f): f is File => f instanceof File && f.size > 0);

    const uploaded: string[] = [];
    for (const file of newFiles) {
      const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
      const path = `products/${randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from(MEDIA_BUCKET)
        .upload(path, file, { contentType: file.type || "image/jpeg", upsert: false });
      if (uploadError) {
        return {
          ok: false,
          error: `Не удалось загрузить фото «${file.name}»: ${uploadError.message}. Проверьте, что в Supabase создан публичный бакет "media" (см. supabase/schema.sql).`,
        };
      }
      const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }

    const images = [...existingImages, ...uploaded];

    const slug = String(formData.get("slug") || "").trim();
    if (!slug) {
      return { ok: false, error: "Укажите slug — короткий идентификатор для адреса страницы товара." };
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return {
        ok: false,
        error: "Slug может содержать только латинские буквы, цифры и дефис, например: pearl-ring.",
      };
    }

    const row = {
      slug,
      piece_number: String(formData.get("pieceNumber") || "").trim(),
      price: Math.max(0, Number(formData.get("price") || 0)),
      type: String(formData.get("type") || "ring") as JewelryType,
      materials: getList(formData, "materials") as MaterialKey[],
      availability: String(formData.get("availability") || "in_stock") as Availability,
      personalization: getList(formData, "personalization") as PersonalizationOption[],
      bestseller: formData.get("bestseller") === "on",
      images,
      name_ru: String(formData.get("nameRu") || "").trim(),
      name_en: String(formData.get("nameEn") || "").trim(),
      short_description_ru: String(formData.get("shortDescriptionRu") || "").trim(),
      short_description_en: String(formData.get("shortDescriptionEn") || "").trim(),
      description_ru: String(formData.get("descriptionRu") || "").trim(),
      description_en: String(formData.get("descriptionEn") || "").trim(),
    };

    if (id) {
      const { error } = await supabase.from("products").update(row).eq("id", id);
      if (error) return { ok: false, error: dbErrorMessage("сохранить товар", error.message) };
      revalidatePath("/admin/products");
      return { ok: true, data: { id } };
    }

    const { data, error } = await supabase.from("products").insert(row).select("id").single();
    if (error) return { ok: false, error: dbErrorMessage("сохранить товар", error.message) };
    revalidatePath("/admin/products");
    return { ok: true, data: { id: data.id as string } };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? `Не удалось сохранить товар: ${err.message}`
          : "Не удалось сохранить товар. Проверьте подключение к Supabase.",
    };
  }
}

export async function deleteProduct(
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
  if (!id) return { ok: false, error: "Не указан идентификатор товара." };
  try {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return { ok: false, error: dbErrorMessage("удалить товар", error.message) };
    revalidatePath("/admin/products");
    return { ok: true, data: null };
  } catch (err) {
    return {
      ok: false,
      error: dbErrorMessage("удалить товар", err instanceof Error ? err.message : String(err)),
    };
  }
}
