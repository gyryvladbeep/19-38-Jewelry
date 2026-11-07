import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

// Copy on this page is editable from /admin -> Content; re-checked every
// minute so edits appear without a redeploy. See src/lib/content.ts.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "returns" });
  return { title: t("title") };
}

export default async function ReturnsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("returns");

  const sections = [
    ["section1Title", "section1Body"],
    ["section2Title", "section2Body"],
    ["section3Title", "section3Body"],
  ] as const;

  return (
    <div className="container-content max-w-2xl py-14 md:py-20">
      <h1 className="text-3xl md:text-4xl">{t("title")}</h1>
      <p className="mt-8 leading-relaxed text-muted">{t("intro")}</p>
      <div className="mt-10 space-y-10">
        {sections.map(([titleKey, bodyKey]) => (
          <section key={titleKey}>
            <h2 className="text-lg text-burgundy">{t(titleKey)}</h2>
            <p className="mt-3 leading-relaxed text-ink">{t(bodyKey)}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
