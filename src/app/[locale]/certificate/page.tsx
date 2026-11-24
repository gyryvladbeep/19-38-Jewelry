import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import CertificateClient from "@/components/CertificateClient";
import { SITE_IMAGE_KEYS, fetchSiteImages, siteImageUrl } from "@/lib/siteImages";

// Copy and photo on this page are editable from /admin -> Content; re-checked
// every minute so edits appear without a redeploy. See src/lib/content.ts
// and src/lib/siteImages.ts.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "certificate" });
  return { title: t("pageTitle") };
}

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const siteImages = await fetchSiteImages();
  const photoUrl = siteImageUrl(siteImages, SITE_IMAGE_KEYS.certificatePhoto);

  return <CertificateClient photoUrl={photoUrl} />;
}
