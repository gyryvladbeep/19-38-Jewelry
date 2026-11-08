"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import Logo from "@/components/layout/Logo";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { useStore } from "@/lib/store";
import { CartIcon, HeartIcon, MenuIcon, CloseIcon } from "@/components/icons";

const navItems = [
  { href: "/catalog", key: "catalog" },
  { href: "/about", key: "about" },
  { href: "/shipping", key: "shipping" },
  { href: "/faq", key: "faq" },
  { href: "/contact", key: "contact" },
] as const;

export default function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const { cartCount, wishlistCount, hydrated } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    // Fragment on purpose: the mobile menu overlay below must NOT be a
    // descendant of <header>. Its `backdrop-blur` uses `backdrop-filter`,
    // which (like `transform`) makes an element the containing block for
    // any `fixed`-position descendant — so a fixed overlay nested inside
    // it would size itself to the header's own ~80px box instead of the
    // viewport, rather than covering the screen.
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
        >
          {tc("skipToContent")}
        </a>
        <div className="container-content grid h-16 grid-cols-[auto_1fr_auto] items-center gap-4 md:h-20">
          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center lg:hidden"
              aria-label={t("menu")}
            >
              <MenuIcon className="h-5 w-5" />
            </button>

            <nav className="hidden items-center gap-8 lg:flex">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-xs uppercase tracking-[0.14em] transition-colors ${
                      active ? "text-burgundy" : "text-ink hover:text-burgundy"
                    }`}
                  >
                    {t(item.key)}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex justify-center">
            <Logo className="text-ink" />
          </div>

          <div className="flex items-center justify-end gap-4 md:gap-5">
            <LanguageSwitcher className="hidden sm:flex" />
            <Link
              href="/wishlist"
              className="relative flex h-9 w-9 items-center justify-center"
              aria-label={t("wishlist")}
            >
              <HeartIcon className="h-5 w-5" />
              {hydrated && wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center bg-burgundy text-[9px] text-on-dark">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="relative flex h-9 w-9 items-center justify-center"
              aria-label={t("cart")}
            >
              <CartIcon className="h-5 w-5" />
              {hydrated && cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center bg-burgundy text-[9px] text-on-dark">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-paper lg:hidden">
          <div className="container-content flex h-16 items-center justify-between">
            <Logo className="text-ink" />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="flex h-9 w-9 items-center justify-center"
              aria-label={t("menu")}
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
          <nav className="container-content mt-8 flex flex-col gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-2xl text-ink"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>
          <div className="container-content mt-auto mb-10">
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </>
  );
}
