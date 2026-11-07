import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import CatalogClient from "@/components/CatalogClient";
import { fetchProducts } from "@/data/products";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "catalog" });
  return { title: t("title") };
}

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("catalog");
  const products = await fetchProducts();

  return (
    <div className="container-content py-12 md:py-16">
      <div className="mb-10 border-b border-line pb-8">
        <h1 className="text-3xl md:text-4xl">{t("title")}</h1>
        <p className="mt-2 max-w-lg text-sm text-muted">{t("subtitle")}</p>
      </div>
      <CatalogClient products={products} />
    </div>
  );
}
