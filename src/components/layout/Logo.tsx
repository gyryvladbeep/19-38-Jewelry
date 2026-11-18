import Image from "next/image";
import { Link } from "@/i18n/navigation";

// Source: the uploaded "19:38 JEWELRY — YEREVAN 2026" logo mark, processed
// into two flat-color transparent PNGs (ink-on-light / on-dark-on-dark) so
// it drops cleanly onto both the paper header and the burgundy-deep
// footer without carrying its own background. See public/brand/logo-*.png.
const LOGO_WIDTH = 1159;
const LOGO_HEIGHT = 782;

export default function Logo({
  className = "",
  variant = "ink",
}: {
  className?: string;
  variant?: "ink" | "light";
}) {
  const src = variant === "light" ? "/brand/logo-light.png" : "/brand/logo-ink.png";
  return (
    <Link
      href="/"
      className={`inline-flex items-center ${className}`}
      aria-label="19:38 Jewelry — Yerevan 2026 — home"
    >
      <Image
        src={src}
        alt="19:38 Jewelry — Yerevan 2026"
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        priority
        className="h-10 w-auto md:h-12"
      />
    </Link>
  );
}
