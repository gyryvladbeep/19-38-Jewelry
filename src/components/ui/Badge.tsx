import type { ReactNode } from "react";

export function Badge({
  children,
  tone = "burgundy",
  className = "",
}: {
  children: ReactNode;
  tone?: "burgundy" | "ink" | "outline";
  className?: string;
}) {
  const toneClasses =
    tone === "burgundy"
      ? "bg-burgundy text-on-dark"
      : tone === "ink"
        ? "bg-ink text-paper"
        : "bg-transparent text-ink border border-line";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] ${toneClasses} ${className}`}
    >
      {children}
    </span>
  );
}
