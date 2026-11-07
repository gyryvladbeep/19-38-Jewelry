import { isSupabaseConfigured } from "@/lib/supabase";
import { CONTENT_FIELDS, fetchContentOverrideRows, getByPath } from "@/lib/content";
import ruMessages from "../../../../../messages/ru.json";
import enMessages from "../../../../../messages/en.json";
import ContentForm, { type FaqItem } from "./ContentForm";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const configured = isSupabaseConfigured();
  const rows = await fetchContentOverrideRows();
  const overrideMap = new Map(rows.map((r) => [`${r.key}:${r.locale}`, r.value]));

  const textFields = CONTENT_FIELDS.filter((f) => f.type !== "json");
  const initialValues: Record<string, { ru: string; en: string }> = {};
  for (const field of textFields) {
    const ruOverride = overrideMap.get(`${field.key}:ru`);
    const enOverride = overrideMap.get(`${field.key}:en`);
    initialValues[field.key] = {
      ru: ruOverride ?? String(getByPath(ruMessages, field.key) ?? ""),
      en: enOverride ?? String(getByPath(enMessages, field.key) ?? ""),
    };
  }

  function parseFaq(raw: string | undefined, fallback: unknown): FaqItem[] {
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed as FaqItem[];
      } catch {
        // fall through to fallback
      }
    }
    return Array.isArray(fallback) ? (fallback as FaqItem[]) : [];
  }

  const faqInitial = {
    ru: parseFaq(overrideMap.get("faq.items:ru"), getByPath(ruMessages, "faq.items")),
    en: parseFaq(overrideMap.get("faq.items:en"), getByPath(enMessages, "faq.items")),
  };

  return (
    <div>
      <h1 className="text-2xl text-ink">Тексты страниц</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Изменения появляются на сайте в течение минуты, без пересборки. Пункты
        меню и подписи кнопок здесь не редактируются — только основной текст
        страниц.
      </p>

      {!configured && (
        <div className="mt-6 border border-burgundy/30 bg-burgundy-tint p-5 text-sm text-ink">
          Supabase не настроен — ниже показаны исходные тексты сайта (только для
          просмотра). Чтобы сохранять изменения, настройте{" "}
          <code className="font-mono text-xs">SUPABASE_URL</code> и{" "}
          <code className="font-mono text-xs">SUPABASE_SERVICE_ROLE_KEY</code> — см.
          README.md.
        </div>
      )}

      <div className="mt-8">
        <ContentForm
          fields={textFields}
          initialValues={initialValues}
          faqInitial={faqInitial}
          readOnly={!configured}
        />
      </div>
    </div>
  );
}
