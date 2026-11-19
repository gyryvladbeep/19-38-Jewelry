import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Admin photo uploads (products + site images) go straight through
      // a Server Action as multipart form data — Next.js caps that body
      // at 1MB by default, which a single uncompressed PNG product photo
      // (let alone several picked at once) comfortably exceeds, failing
      // the whole save with no useful error. Raised well above what a
      // batch of full-resolution jewelry photos needs.
      bodySizeLimit: "25mb",
    },
  },
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
