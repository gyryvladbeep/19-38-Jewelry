import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { StoreProvider } from "@/lib/store";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "../globals.css";

/**
 * Fonts are loaded via a plain <link> tag below (not next/font/google).
 * next/font self-hosts fonts, which means it fetches them from
 * fonts.googleapis.com at BUILD time — that's blocked in some sandboxed
 * build environments (this one included) and would fail `next build`.
 * A runtime <link> avoids the build-time fetch entirely; the browser
 * loads the fonts normally when the deployed site is visited. Swap to
 * next/font/local + the real Aileron files once you have a licensed
 * copy — see README.md ("Fonts").
 */
const GOOGLE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Permanent+Marker&display=swap";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: {
      default: `${t("siteName")} — ${t("tagline")}`,
      template: `%s — ${t("siteName")}`,
    },
    description: t("defaultDescription"),
    openGraph: {
      title: t("siteName"),
      description: t("defaultDescription"),
      type: "website",
      locale,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={GOOGLE_FONTS_HREF} />
      </head>
      <body className="flex min-h-full flex-col antialiased">
        <NextIntlClientProvider>
          <StoreProvider>
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
