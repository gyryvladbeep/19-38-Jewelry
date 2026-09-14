"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className={`flex items-center gap-1 text-xs uppercase tracking-[0.14em] ${className}`}>
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-1">
          {i > 0 && <span className="text-line">/</span>}
          <button
            type="button"
            onClick={() => router.replace(pathname, { locale: loc as AppLocale })}
            aria-current={locale === loc}
            className={
              locale === loc
                ? "text-ink"
                : "text-muted transition-colors hover:text-ink"
            }
          >
            {loc}
          </button>
        </span>
      ))}
    </div>
  );
}
