import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

// Questions/answers are editable from /admin -> Content; re-checked every
// minute so edits appear without a redeploy. See src/lib/content.ts.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  return { title: t("title") };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");
  const items = t.raw("items") as { q: string; a: string }[];

  return (
    <div className="container-content max-w-2xl py-14 md:py-20">
      <h1 className="text-3xl md:text-4xl">{t("title")}</h1>
      <div className="mt-10 divide-y divide-line border-t border-b border-line">
        {items.map((item, i) => (
          <details key={i} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm text-ink md:text-base">
              {item.q}
              <span className="shrink-0 text-muted transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
