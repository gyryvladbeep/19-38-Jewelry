import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import OrderClient from "@/components/OrderClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "order" });
  return { title: t("title") };
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <OrderClient />;
}
