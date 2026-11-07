import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ProductDetailClient from "@/components/ProductDetailClient";
import { fetchProducts, getProductBySlug, getRelatedProducts } from "@/data/products";

// Products can be added/edited any time through /admin, so this page is
// rendered on demand (no generateStaticParams) and revalidated every
// minute rather than only at build/deploy time.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const products = await fetchProducts();
  const product = getProductBySlug(products, slug);
  if (!product) return {};
  const content = product[locale === "ru" ? "ru" : "en"];
  return {
    title: content.name,
    description: content.shortDescription,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  await getTranslations("product");

  const products = await fetchProducts();
  const product = getProductBySlug(products, slug);
  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(products, product);

  return <ProductDetailClient product={product} related={related} />;
}
