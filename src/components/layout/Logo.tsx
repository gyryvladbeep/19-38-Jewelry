import { Link } from "@/i18n/navigation";

// The approved brand-book logo: massive "19:38" (Peace Sans) above "JEWELRY"
// (Aileron, bold, tracked out) above a tiny two-line "YEREVAN / 2026"
// signature — centered, graphite-on-white in the book. Rendered here as
// live text (not an image) so it scales crisply at any size and recolors
// for free between the paper header (ink) and the burgundy-deep footer
// (light), via `currentColor`.
export default function Logo({
  className = "",
  variant = "ink",
}: {
  className?: string;
  variant?: "ink" | "light";
}) {
  const color = variant === "light" ? "text-on-dark" : "text-ink";
  return (
    <Link
      href="/"
      className={`inline-flex flex-col items-center leading-none ${color} ${className}`}
      aria-label="19:38 Jewelry — Yerevan 2026 — home"
    >
      <span className="font-display text-2xl tracking-tight md:text-[1.75rem]">19:38</span>
      <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.32em] md:text-xs">
        Jewelry
      </span>
      <span className="mt-1 text-[7px] uppercase leading-[1.3] tracking-[0.18em] opacity-60 md:text-[8px]">
        Yerevan
        <br />
        2026
      </span>
    </Link>
  );
}
