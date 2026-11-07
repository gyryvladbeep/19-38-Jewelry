import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase";

export type ContentFieldType = "text" | "textarea" | "json";

export interface ContentField {
  /** Dot path into the next-intl messages tree, e.g. "about.paragraph1". */
  key: string;
  /** Admin-panel grouping, shown as a section heading. */
  section: string;
  /** Admin-panel field label (Russian — this is an internal tool). */
  label: string;
  type: ContentFieldType;
}

/**
 * Every piece of site copy that's editable from /admin, grouped by the
 * page it appears on. This intentionally does NOT cover every string in
 * messages/*.json — navigation labels, button text, and other UI chrome
 * stay as code-level translations, since those aren't things a brand
 * owner edits day to day. It covers the actual brand/story/info copy:
 * About, FAQ, the Home page's narrative sections, Shipping, Returns,
 * Privacy, and the Contact blurb.
 *
 * Add a row here to make a new field editable — the admin content editor
 * (src/app/admin/content/page.tsx) renders itself from this list, and
 * src/i18n/request.ts overlays saved values onto the static translations
 * at request time, so page components never change.
 */
export const CONTENT_FIELDS: ContentField[] = [
  { key: "about.title", section: "О бренде", label: "Заголовок страницы", type: "text" },
  { key: "about.heroLine", section: "О бренде", label: "Строка над заголовком (курсив)", type: "text" },
  { key: "about.intro", section: "О бренде", label: "Вступление (курсив)", type: "textarea" },
  { key: "about.paragraph1", section: "О бренде", label: "Абзац 1", type: "textarea" },
  { key: "about.paragraph2", section: "О бренде", label: "Абзац 2", type: "textarea" },
  { key: "about.quote1", section: "О бренде", label: "Цитата-врезка", type: "textarea" },
  { key: "about.paragraph3", section: "О бренде", label: "Абзац 3", type: "textarea" },
  { key: "about.paragraph4", section: "О бренде", label: "Абзац 4", type: "textarea" },
  { key: "about.paragraph5", section: "О бренде", label: "Абзац 5", type: "textarea" },
  { key: "about.paragraph6", section: "О бренде", label: "Абзац 6", type: "textarea" },
  { key: "about.closingBrand", section: "О бренде", label: "Название бренда (в финальном блоке)", type: "text" },
  { key: "about.closingLine", section: "О бренде", label: "Финальная строка (курсив)", type: "text" },
  { key: "about.closingNote", section: "О бренде", label: "Финальная подпись", type: "textarea" },

  { key: "faq.items", section: "Частые вопросы", label: "Вопросы и ответы", type: "json" },

  { key: "home.heroTitle", section: "Главная", label: "Заголовок героя", type: "text" },
  { key: "home.heroSubtitle", section: "Главная", label: "Подзаголовок героя", type: "text" },
  { key: "home.signIntro", section: "Главная", label: "Текст про 19:38", type: "textarea" },
  { key: "home.aboutTeaserTitle", section: "Главная", label: "Заголовок блока «О бренде»", type: "text" },
  { key: "home.aboutTeaserBody", section: "Главная", label: "Текст блока «О бренде»", type: "textarea" },
  { key: "home.trustHandmadeBody", section: "Главная", label: "«Ручная работа» — текст", type: "textarea" },
  { key: "home.trustOneOfOneBody", section: "Главная", label: "«One of one» — текст", type: "textarea" },
  { key: "home.trustWorldwideBody", section: "Главная", label: "«Доставка» — текст", type: "textarea" },
  { key: "home.trustPersonalBody", section: "Главная", label: "«Персонализация» — текст", type: "textarea" },

  { key: "shipping.shippingBody", section: "Доставка и оплата", label: "Доставка", type: "textarea" },
  { key: "shipping.paymentBody", section: "Доставка и оплата", label: "Оплата", type: "textarea" },
  { key: "shipping.productionBody", section: "Доставка и оплата", label: "Изготовление под заказ", type: "textarea" },

  { key: "returns.section1Body", section: "Условия возврата", label: "Возврат товара", type: "textarea" },
  { key: "returns.section2Body", section: "Условия возврата", label: "Изделия с персонализацией", type: "textarea" },
  { key: "returns.section3Body", section: "Условия возврата", label: "Как оформить возврат", type: "textarea" },

  { key: "privacy.section1Body", section: "Политика конфиденциальности", label: "Какие данные мы собираем", type: "textarea" },
  { key: "privacy.section2Body", section: "Политика конфиденциальности", label: "Как мы используем данные", type: "textarea" },
  { key: "privacy.section3Body", section: "Политика конфиденциальности", label: "Хранение данных", type: "textarea" },

  { key: "contact.description", section: "Контакты", label: "Описание", type: "textarea" },
];

export const CONTENT_SECTIONS = Array.from(new Set(CONTENT_FIELDS.map((f) => f.section)));

/** Reads a dot-path ("about.paragraph1") out of a nested messages object. */
export function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((node, part) => {
    if (typeof node !== "object" || node === null) return undefined;
    return (node as Record<string, unknown>)[part];
  }, obj);
}

export interface ContentOverrideRow {
  key: string;
  locale: string;
  value: string;
}

/** All saved overrides, keyed as `${key}:${locale}` -> raw string value. */
export async function fetchContentOverrideRows(): Promise<ContentOverrideRow[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase.from("content_blocks").select("key, locale, value");
    if (error || !data) return [];
    return data as ContentOverrideRow[];
  } catch {
    // Network/DNS failure reaching Supabase — this runs on every page via
    // src/i18n/request.ts, so it must never throw: fall back to the
    // static translations rather than taking the whole site down.
    return [];
  }
}

/**
 * Deep-clones `messages` and overlays any saved content_blocks values onto
 * it at the field's dot path. Used by src/i18n/request.ts so every page
 * that reads `about.paragraph1` etc. via next-intl automatically sees
 * admin edits, with no changes needed in the page components themselves.
 */
export function applyContentOverrides(
  messages: Record<string, unknown>,
  rows: ContentOverrideRow[],
  locale: string
): Record<string, unknown> {
  if (rows.length === 0) return messages;

  const cloned = structuredClone(messages) as Record<string, unknown>;
  const fieldByKey = new Map(CONTENT_FIELDS.map((f) => [f.key, f]));

  for (const row of rows) {
    if (row.locale !== locale) continue;
    const field = fieldByKey.get(row.key);
    if (!field) continue;
    if (row.value === "") continue; // empty override = "not set yet", keep the static default

    const parts = row.key.split(".");
    let node: Record<string, unknown> = cloned;
    for (let i = 0; i < parts.length - 1; i++) {
      const next = node[parts[i]];
      if (typeof next !== "object" || next === null) break;
      node = next as Record<string, unknown>;
    }
    const lastKey = parts[parts.length - 1];

    if (field.type === "json") {
      try {
        node[lastKey] = JSON.parse(row.value);
      } catch {
        // malformed JSON in the DB — ignore and keep the static default
      }
    } else {
      node[lastKey] = row.value;
    }
  }

  return cloned;
}
