"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Обзор" },
  { href: "/admin/products", label: "Товары" },
  { href: "/admin/content", label: "Тексты страниц" },
];

export default function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-line bg-surface">
        <div className="container-content flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-sm text-ink">19:38 Jewelry — Админка</span>
            <nav className="hidden items-center gap-6 sm:flex">
              {navItems.map((item) => {
                const active =
                  item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-xs uppercase tracking-[0.12em] ${
                      active ? "text-burgundy" : "text-muted hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/ru"
              target="_blank"
              className="text-xs uppercase tracking-[0.12em] text-muted hover:text-ink"
            >
              Открыть сайт ↗
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs uppercase tracking-[0.12em] text-muted hover:text-burgundy"
            >
              Выйти
            </button>
          </div>
        </div>
        <nav className="container-content flex gap-5 overflow-x-auto pb-3 sm:hidden">
          {navItems.map((item) => {
            const active =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 text-xs uppercase tracking-[0.12em] ${
                  active ? "text-burgundy" : "text-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="container-content flex-1 py-10">{children}</main>
    </div>
  );
}
