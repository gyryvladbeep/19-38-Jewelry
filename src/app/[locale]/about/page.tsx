import type { Metadata } from "next";
import Image from "next/image";
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
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <div>
      <section className="relative flex min-h-[50vh] items-end overflow-hidden bg-burgundy-deep text-on-dark">
        <Image
          src="/brand/mood-texture.jpg"
          alt=""
          fill
          priority
          aria-hidden
          className="object-cover opacity-30"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-burgundy-deep via-burgundy-deep/50 to-transparent" />
        <div className="container-content relative py-16">
          <p className="font-script text-2xl text-on-dark-muted">{t("heroLine")}</p>
          <h1 className="mt-3 max-w-xl text-3xl leading-tight md:text-5xl">
            {t("title")}
          </h1>
        </div>
      </section>

      <section className="container-content max-w-2xl py-16 md:py-24">
        <p className="font-script text-2xl text-burgundy">{t("intro")}</p>
        <p className="mt-8 leading-relaxed text-ink">{t("paragraph1")}</p>
        <p className="mt-6 leading-relaxed text-ink">{t("paragraph2")}</p>
        <p className="mt-8 border-l-2 border-burgundy pl-5 text-lg italic text-muted">
          {t("quote1")}
        </p>
        <p className="mt-8 leading-relaxed text-ink">{t("paragraph3")}</p>
        <p className="mt-6 leading-relaxed text-ink">{t("paragraph4")}</p>
        <p className="mt-6 leading-relaxed text-ink">{t("paragraph5")}</p>
        <p className="mt-6 leading-relaxed text-ink">{t("paragraph6")}</p>
      </section>

      <section className="relative overflow-hidden bg-burgundy-deep py-16 text-on-dark md:py-24">
        <Image
          src="/brand/mood-texture.jpg"
          alt=""
          fill
          aria-hidden
          className="object-cover opacity-20"
        />
        <div className="container-content relative max-w-xl">
          <h2 className="text-xl uppercase tracking-[0.14em] text-on-dark-muted">
            {t("closingBrand")}
          </h2>
          <p className="mt-4 font-script text-3xl">{t("closingLine")}</p>
          <p className="mt-6 text-lg leading-relaxed">{t("closingNote")}</p>
        </div>
      </section>
    </div>
  );
}
