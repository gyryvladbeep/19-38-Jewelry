import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { products } from "@/data/products";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

const staticPaths = [
  "",
  "/catalog",
  "/about",
  "/shipping",
  "/faq",
  "/contact",
  "/privacy",
  "/returns",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified: new Date(),
      });
    }
    for (const product of products) {
      entries.push({
        url: `${siteUrl}/${locale}/product/${product.slug}`,
        lastModified: new Date(),
      });
    }
  }

  return entries;
}
