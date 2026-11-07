import Image from "next/image";
import { JewelryTypeIcon } from "@/components/icons";
import type { JewelryType } from "@/data/products";

/**
 * Shows the product's first uploaded photo (added through /admin ->
 * Products) when one exists, and otherwise falls back to a stand-in
 * (line icon + piece number) rather than a fabricated photo — see
 * README.md ("Product photography checklist").
 */
export default function ProductImagePlaceholder({
  type,
  pieceNumber,
  images,
  className = "",
  iconClassName = "w-16 h-16",
}: {
  type: JewelryType;
  pieceNumber: string;
  images?: string[];
  className?: string;
  iconClassName?: string;
}) {
  const photo = images?.[0];

  if (photo) {
    return (
      <div className={`relative overflow-hidden bg-burgundy-tint ${className}`}>
        <Image src={photo} alt="" fill className="object-cover" />
      </div>
    );
  }

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
