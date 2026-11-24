"use client";

import { useActionState } from "react";
import { saveSiteImage, type ActionResult } from "./actions";

const initialState: ActionResult<{ url: string }> | null = null;

const SECTIONS: { key: string; label: string }[] = [
  { key: "home.hero", label: "Главная — фото в шапке (hero)" },
  { key: "home.aboutTeaser", label: "Главная — фото в блоке «О бренде»" },
  { key: "about.hero", label: "О бренде — фото в шапке страницы" },
  { key: "about.closing", label: "О бренде — фото в финальном блоке" },
  { key: "certificate.photo", label: "Сертификат — фото на странице" },
];

function SiteImageField({
  sectionKey,
  label,
  currentUrl,
  readOnly,
}: {
  sectionKey: string;
  label: string;
  currentUrl: string;
  readOnly: boolean;
}) {
  const [state, action, saving] = useActionState(saveSiteImage, initialState);
  const previewUrl = state?.ok ? state.data.url : currentUrl;

  return (
    <form action={action} className="flex flex-col gap-3 border border-line p-4 sm:flex-row sm:items-center">
      <input type="hidden" name="key" value={sectionKey} />
      {/* eslint-disable-next-line @next/next/no-img-element -- admin-only preview thumbnail of an already-uploaded/static URL */}
      <img src={previewUrl} alt="" className="h-20 w-32 shrink-0 border border-line bg-burgundy-tint object-cover" />
      <div className="flex-1">
        <p className="text-sm text-ink">{label}</p>
        <input
          type="file"
          name="file"
          accept="image/*,.heic,.heif"
          disabled={readOnly}
          className="mt-2 block w-full text-sm"
        />
        {state && !state.ok && <p className="mt-1 text-xs text-burgundy">{state.error}</p>}
        {state?.ok && <p className="mt-1 text-xs text-ink">Сохранено.</p>}
      </div>
      <button
        type="submit"
        disabled={saving || readOnly}
        className="shrink-0 border border-line px-4 py-2 text-xs uppercase tracking-[0.12em] text-ink hover:border-ink disabled:opacity-60"
      >
        {saving ? "Загружаем…" : "Заменить фото"}
      </button>
    </form>
  );
}

export default function SiteImagesPanel({
  currentUrls,
  readOnly,
}: {
  currentUrls: Record<string, string>;
  readOnly: boolean;
}) {
  return (
    <section>
      <h2 className="text-xs uppercase tracking-[0.14em] text-burgundy">Фото сайта</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Фоновые фото на главной и на странице «О бренде». Пока фото не загружено, показывается
        стандартная текстура.
      </p>
      <div className="mt-4 space-y-4">
        {SECTIONS.map((s) => (
          <SiteImageField
            key={s.key}
            sectionKey={s.key}
            label={s.label}
            currentUrl={currentUrls[s.key] || "/brand/mood-texture.jpg"}
            readOnly={readOnly}
          />
        ))}
      </div>
    </section>
  );
}
