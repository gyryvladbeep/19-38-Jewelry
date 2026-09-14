import type { SVGProps } from "react";
import type { JewelryType } from "@/data/products";

/**
 * Minimal line-icon set for 19:38 Jewelry.
 * Every icon is a plain inline SVG (currentColor stroke) — no icon
 * library, no emoji. Swap freely for custom artwork later.
 */

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function CartIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M3 4h2l2.2 11.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L20.5 8H6" />
      <circle cx="9.5" cy="20" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="17" cy="20" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function HeartIcon({ filled, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" {...base} fill={filled ? "currentColor" : "none"} {...props}>
      <path d="M12 20.5s-7.5-4.6-9.9-9.2C.6 7.9 2.4 4.5 5.8 4c2-.3 3.7.7 6.2 3 2.5-2.3 4.2-3.3 6.2-3 3.4.5 5.2 3.9 3.7 7.3C19.5 15.9 12 20.5 12 20.5Z" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20 20-4.3-4.3" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M5 5l14 14M19 5 5 19" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="m15 6-6 6 6 6" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="m5 12 5 5 9-9" />
    </svg>
  );
}

export function StarIcon({ filled, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" {...base} fill={filled ? "currentColor" : "none"} {...props}>
      <path d="M12 3.5 14.6 9l6 .9-4.3 4.2 1 6-5.3-2.8-5.3 2.8 1-6L3.4 9.9l6-.9L12 3.5Z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TelegramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="m3 11 17-7-4 17-5.5-4.3L7 19v-4.2L18 6.5" />
    </svg>
  );
}

/** Jewelry-type line icons used on placeholder product imagery. */
export function JewelryTypeIcon({
  type,
  ...props
}: IconProps & { type: JewelryType }) {
  switch (type) {
    case "ring":
      return (
        <svg viewBox="0 0 64 64" {...base} strokeWidth={1.25} {...props}>
          <circle cx="32" cy="38" r="16" />
          <path d="M24 24 32 10l8 14-8 6-8-6Z" />
        </svg>
      );
    case "necklace":
      return (
        <svg viewBox="0 0 64 64" {...base} strokeWidth={1.25} {...props}>
          <path d="M10 12c0 16 9.8 30 22 30s22-14 22-30" />
          <circle cx="32" cy="44" r="6" />
        </svg>
      );
    case "earrings":
      return (
        <svg viewBox="0 0 64 64" {...base} strokeWidth={1.25} {...props}>
          <circle cx="20" cy="16" r="4" />
          <path d="M20 20v10a6 6 0 0 0 6 6" />
          <circle cx="44" cy="16" r="4" />
          <path d="M44 20v10a6 6 0 0 1-6 6" />
        </svg>
      );
    case "bracelet":
      return (
        <svg viewBox="0 0 64 64" {...base} strokeWidth={1.25} {...props}>
          <ellipse cx="32" cy="32" rx="22" ry="14" />
          <path d="M14 26c8 6 28 6 36 0M14 38c8-6 28-6 36 0" />
        </svg>
      );
    default:
      return null;
  }
}
