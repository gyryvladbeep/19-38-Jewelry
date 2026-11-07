import type { Metadata } from "next";
import "../globals.css";

// /admin is a separate root layout from app/[locale]/layout.tsx (see
// node_modules/next/dist/docs/.../file-conventions/layout.md — "Omitting
// app/layout.js so layouts in subdirectories... each become root
// layouts"). It's a single internal, Russian-only tool, not part of the
// bilingual public site, so it doesn't go through next-intl at all.

export const metadata: Metadata = {
  title: "19:38 Jewelry — Админка",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="h-full">
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
