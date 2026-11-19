import Image from "next/image";
import { JewelryTypeIcon } from "@/components/icons";

/**
 * Shows the product's first uploaded photo (added through /admin ->
 * Products) when one exists, and otherwise falls back to a stand-in
 * (line icon + piece number) rather than a fabricated photo — see
 * README.md ("Product photography checklist").
 *
 * `natural`: when true and a real photo exists, the photo keeps its own
 * aspect ratio (no forced square crop) — used in the catalog/related/
 * bestseller grids per the otutochki.ru reference. `className` should
 * then set width only (e.g. "w-full"), not a fixed aspect-* class. The
 * placeholder (no-photo) box still needs *some* ratio to lay out a grid
 * cell, so it uses a tall portrait box in natural mode and whatever
 * `className` dictates otherwise.
 */
export default function ProductImagePlaceholder({
  albums,
  pieceNumber,
  images,
  className = "",
  iconClassName = "w-16 h-16",
  natural = false,
}: {
  albums: string[];
  pieceNumber: string;
  images?: string[];
  className?: string;
  iconClassName?: string;
  natural?: boolean;
}) {
  const photo = images?.[0];

  if (photo && natural) {
    // Deliberately a plain <img>, not next/image: we don't know the
    // uploaded photo's intrinsic size ahead of time, and height:auto is
    // what lets the browser keep each photo's own proportions instead of
    // a forced crop.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={photo} alt="" loading="lazy" className={`block h-auto w-full bg-burgundy-tint object-cover ${className}`} />
    );
  }

  if (photo) {
    return (
      <div className={`relative overflow-hidden bg-burgundy-tint ${className}`}>
        <Image src={photo} alt="" fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-burgundy-tint ${natural ? "aspect-[4/5]" : ""} ${className}`}
    >
      <Image
        src="/brand/mood-texture.jpg"
        alt=""
        fill
        aria-hidden
        className="object-cover opacity-[0.06] grayscale"
      />
      <JewelryTypeIcon
        albums={albums}
        className={`relative text-burgundy/70 ${iconClassName}`}
      />
      <span className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-[0.2em] text-burgundy/50">
        19:38 / {pieceNumber}
      </span>
    </div>
  );
}
