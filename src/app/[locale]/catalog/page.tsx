import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import CatalogClient from "@/components/CatalogClient";
import { fetchProducts } from "@/data/products";
import { fetchAlbums } from "@/lib/albums";

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
  const products = await fetchProducts();
  const albums = await fetchAlbums();

  return (
    <div className="container-content py-8 md:py-10">
      <h1 className="sr-only">{(await getTranslations("catalog"))("title")}</h1>
      {/* useSearchParams (for the homepage's ?album= deep link) needs a
          Suspense boundary during static prerendering. */}
      <Suspense fallback={null}>
        <CatalogClient products={products} albums={albums} />
      </Suspense>
    </div>
  );
}
