import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "shipping" });
  return { title: t("title") };
}

export default async function ShippingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("shipping");

  const sections = [
    ["shippingTitle", "shippingBody"],
    ["paymentTitle", "paymentBody"],
    ["productionTitle", "productionBody"],
  ] as const;

  return (
    <div className="container-content max-w-2xl py-14 md:py-20">
      <h1 className="text-3xl md:text-4xl">{t("title")}</h1>
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
