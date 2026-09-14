import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Logo from "@/components/layout/Logo";
import { InstagramIcon, TelegramIcon } from "@/components/icons";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tReturns = useTranslations("returns");
  const tPrivacy = useTranslations("privacy");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-burgundy-deep text-on-dark">
      <div className="container-content py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="[&_a]:text-on-dark">
              <Logo />
            </div>
            <p className="mt-4 max-w-xs font-script text-2xl text-on-dark-muted">
              {t("tagline")}
            </p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-on-dark-muted">
              {t("shop")}
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/catalog" className="hover:text-on-dark-muted">
                  {tNav("catalog")}
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-on-dark-muted">
                  {tNav("wishlist")}
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-on-dark-muted">
                  {tNav("cart")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-on-dark-muted">
              {t("information")}
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/about" className="hover:text-on-dark-muted">
                  {tNav("about")}
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-on-dark-muted">
                  {tNav("shipping")}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-on-dark-muted">
                  {tNav("faq")}
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-on-dark-muted">
                  {tReturns("title")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-on-dark-muted">
                  {tPrivacy("title")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-on-dark-muted">
                  {tNav("contact")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-8 text-xs text-on-dark-muted md:flex-row md:items-center">
          <p>
            &copy; {year} 19:38 Jewelry. {t("rights")}
          </p>
          <div className="flex items-center gap-4">
            <span className="uppercase tracking-[0.2em]">{t("followUs")}</span>
            <a href="#" aria-label="Instagram" className="hover:text-on-dark">
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Telegram" className="hover:text-on-dark">
              <TelegramIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
