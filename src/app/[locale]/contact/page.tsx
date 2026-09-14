import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ContactForm from "@/components/ContactForm";
import { InstagramIcon, TelegramIcon } from "@/components/icons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <div className="container-content max-w-2xl py-14 md:py-20">
      <h1 className="text-3xl md:text-4xl">{t("title")}</h1>
      <p className="mt-4 leading-relaxed text-muted">{t("description")}</p>

      <div className="mt-6 flex flex-col gap-2 text-sm text-ink">
        <p>
          {t("emailLabel")}:{" "}
          <a href="mailto:hello@1938jewelry.com" className="underline underline-offset-4">
            hello@1938jewelry.com
          </a>
        </p>
        <div className="flex items-center gap-4">
          <span className="text-muted">{t("socialLabel")}:</span>
          <a href="#" aria-label="Instagram" className="hover:text-burgundy">
            <InstagramIcon className="h-4 w-4" />
          </a>
          <a href="#" aria-label="Telegram" className="hover:text-burgundy">
            <TelegramIcon className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="mt-10 border-t border-line pt-10">
        <ContactForm />
      </div>
    </div>
  );
}
