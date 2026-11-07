import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Product/content photos uploaded through /admin are stored in Supabase
    // Storage and served from the project's own *.supabase.co subdomain —
    // this is a wildcard so it works for any Supabase project, without
    // needing to know the exact project ref ahead of time.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
