import Image from "next/image";
import { JewelryTypeIcon } from "@/components/icons";
import type { JewelryType } from "@/data/products";

/**
 * Stand-in for real product photography, which doesn't exist yet.
 * Deliberately reads as a placeholder (line icon + piece number) rather
 * than a fabricated photo, so nothing here is mistaken for the real thing.
 * Swap for <Image src="/products/..."> once photos are shot — see
 * README.md ("Product photography checklist").
 */
export default function ProductImagePlaceholder({
  type,
  pieceNumber,
  className = "",
  iconClassName = "w-16 h-16",
}: {
  type: JewelryType;
  pieceNumber: string;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-burgundy-tint ${className}`}
    >
      <Image
        src="/brand/mood-texture.jpg"
        alt=""
        fill
        aria-hidden
        className="object-cover opacity-[0.06] grayscale"
      />
      <JewelryTypeIcon
        type={type}
        className={`relative text-burgundy/70 ${iconClassName}`}
      />
      <span className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-[0.2em] text-burgundy/50">
        19:38 / {pieceNumber}
      </span>
    </div>
  );
}
