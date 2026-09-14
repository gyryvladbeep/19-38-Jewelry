import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ProductDetailClient from "@/components/ProductDetailClient";
import { getProductBySlug, getRelatedProducts, products } from "@/data/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);
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

  const product = getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(product);

  return <ProductDetailClient product={product} related={related} />;
}
