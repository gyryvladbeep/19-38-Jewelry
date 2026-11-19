import { Link } from "@/i18n/navigation";

// The logo mark: just "19:38" (Peace Sans), set as live text so it scales
// crisply at any size and recolors for free between the paper header
// (ink) and the burgundy-deep footer (light), via `currentColor`.
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
      className={`inline-flex items-center leading-none ${color} ${className}`}
      aria-label="19:38 Jewelry — home"
    >
      <span className="font-display text-2xl tracking-tight md:text-[1.75rem]">19:38</span>
    </Link>
  );
}
