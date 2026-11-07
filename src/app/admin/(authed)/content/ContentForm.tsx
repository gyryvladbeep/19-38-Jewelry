"use client";

import { useActionState, useMemo, useRef, useState } from "react";
import type { ContentField } from "@/lib/content";
import { saveContentBatch, type ActionResult, type ContentEntry } from "./actions";

export interface FaqItem {
  q: string;
  a: string;
}

const inputClass =
  "mt-1 w-full border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-ink";

const initialState: ActionResult<null> | null = null;

export default function ContentForm({
  fields,
  initialValues,
  faqInitial,
  readOnly,
}: {
  fields: ContentField[];
  initialValues: Record<string, { ru: string; en: string }>;
  faqInitial: { ru: FaqItem[]; en: FaqItem[] };
  readOnly: boolean;
}) {
  const [values, setValues] = useState(initialValues);
  const [faqRows, setFaqRows] = useState(() => {
    const length = Math.max(faqInitial.ru.length, faqInitial.en.length);
    return Array.from({ length }, (_, i) => ({
      ruQ: faqInitial.ru[i]?.q ?? "",
      ruA: faqInitial.ru[i]?.a ?? "",
      enQ: faqInitial.en[i]?.q ?? "",
      enA: faqInitial.en[i]?.a ?? "",
    }));
  });
  const entriesInputRef = useRef<HTMLInputElement>(null);

  // Server Actions here must be driven through useActionState + native
  // <form action={...}> rather than called directly from an onSubmit/
  // onClick handler — calling one as a plain async function from a
  // client event handler caused the browser's underlying POST for the
  // Server Action RPC to be silently aborted (net::ERR_ABORTED) before
  // reaching the server. See the matching comment in ProductForm.tsx.
  const [saveState, saveAction, saving] = useActionState(saveContentBatch, initialState);

  const sections = useMemo(() => {
    const map = new Map<string, ContentField[]>();
    for (const field of fields) {
      if (!map.has(field.section)) map.set(field.section, []);
      map.get(field.section)!.push(field);
    }
    return Array.from(map.entries());
  }, [fields]);

  function updateValue(key: string, locale: "ru" | "en", text: string) {
    setValues((prev) => ({ ...prev, [key]: { ...prev[key], [locale]: text } }));
  }

  function updateFaqRow(index: number, field: keyof (typeof faqRows)[number], text: string) {
    setFaqRows((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: text } : row)));
  }

  function addFaqRow() {
    setFaqRows((prev) => [...prev, { ruQ: "", ruA: "", enQ: "", enA: "" }]);
  }

  function removeFaqRow(index: number) {
    setFaqRows((prev) => prev.filter((_, i) => i !== index));
  }

  // Runs synchronously before the browser gathers the form's FormData
  // for the action call — it does not call preventDefault, it just
  // fills in the hidden field the action reads the serialized entries
  // from.
  function handleFormSubmit() {
    const entries: ContentEntry[] = [];
    for (const field of fields) {
      const v = values[field.key];
      entries.push({ key: field.key, locale: "ru", value: v?.ru ?? "" });
      entries.push({ key: field.key, locale: "en", value: v?.en ?? "" });
    }
    const ruFaq = faqRows
      .filter((r) => r.ruQ.trim() || r.ruA.trim())
      .map((r) => ({ q: r.ruQ, a: r.ruA }));
    const enFaq = faqRows
      .filter((r) => r.enQ.trim() || r.enA.trim())
      .map((r) => ({ q: r.enQ, a: r.enA }));
    entries.push({ key: "faq.items", locale: "ru", value: JSON.stringify(ruFaq) });
    entries.push({ key: "faq.items", locale: "en", value: JSON.stringify(enFaq) });

    if (entriesInputRef.current) {
      entriesInputRef.current.value = JSON.stringify(entries);
    }
  }

  const message = saveState
    ? saveState.ok
      ? { type: "ok" as const, text: "Сохранено. Изменения появятся на сайте в течение минуты." }
      : { type: "error" as const, text: saveState.error }
    : null;

  return (
    <form action={saveAction} onSubmit={handleFormSubmit}>
      <input ref={entriesInputRef} type="hidden" name="entries" />
      <fieldset disabled={readOnly} className="space-y-12 disabled:opacity-60">
        {sections.map(([section, sectionFields]) => (
          <section key={section}>
            <h2 className="text-xs uppercase tracking-[0.14em] text-burgundy">{section}</h2>
            <div className="mt-4 space-y-6">
              {sectionFields.map((field) => (
                <div key={field.key} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm text-ink">{field.label} (RU)</label>
                    {field.type === "textarea" ? (
                      <textarea
                        rows={3}
                        value={values[field.key]?.ru ?? ""}
                        onChange={(e) => updateValue(field.key, "ru", e.target.value)}
                        className={inputClass}
                      />
                    ) : (
                      <input
                        value={values[field.key]?.ru ?? ""}
                        onChange={(e) => updateValue(field.key, "ru", e.target.value)}
                        className={inputClass}
                      />
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-ink">{field.label} (EN)</label>
                    {field.type === "textarea" ? (
                      <textarea
                        rows={3}
                        value={values[field.key]?.en ?? ""}
                        onChange={(e) => updateValue(field.key, "en", e.target.value)}
                        className={inputClass}
                      />
                    ) : (
                      <input
                        value={values[field.key]?.en ?? ""}
                        onChange={(e) => updateValue(field.key, "en", e.target.value)}
                        className={inputClass}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section>
          <h2 className="text-xs uppercase tracking-[0.14em] text-burgundy">
            Частые вопросы — вопросы и ответы
          </h2>
          <div className="mt-4 space-y-6">
            {faqRows.map((row, i) => (
              <div key={i} className="border border-line p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm text-ink">Вопрос (RU)</label>
                    <input
                      value={row.ruQ}
                      onChange={(e) => updateFaqRow(i, "ruQ", e.target.value)}
                      className={inputClass}
                    />
                    <label className="mt-3 block text-sm text-ink">Ответ (RU)</label>
                    <textarea
                      rows={2}
                      value={row.ruA}
                      onChange={(e) => updateFaqRow(i, "ruA", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-ink">Question (EN)</label>
                    <input
                      value={row.enQ}
                      onChange={(e) => updateFaqRow(i, "enQ", e.target.value)}
                      className={inputClass}
                    />
                    <label className="mt-3 block text-sm text-ink">Answer (EN)</label>
                    <textarea
                      rows={2}
                      value={row.enA}
                      onChange={(e) => updateFaqRow(i, "enA", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFaqRow(i)}
                  className="mt-3 text-xs uppercase tracking-[0.1em] text-muted hover:text-burgundy"
                >
                  Удалить вопрос
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addFaqRow}
              className="border border-line px-4 py-2 text-xs uppercase tracking-[0.14em] text-ink hover:border-ink"
            >
              + Добавить вопрос
            </button>
          </div>
        </section>

        <div className="sticky bottom-0 -mx-6 border-t border-line bg-paper px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving || readOnly}
              className="bg-ink px-5 py-2.5 text-xs uppercase tracking-[0.14em] text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Сохраняем…" : "Сохранить все тексты"}
            </button>
            {message && (
              <p className={`text-sm ${message.type === "error" ? "text-burgundy" : "text-ink"}`}>
                {message.text}
              </p>
            )}
          </div>
        </div>
      </fieldset>
    </form>
  );
}
