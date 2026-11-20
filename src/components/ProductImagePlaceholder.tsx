import Image from "next/image";
import { JewelryTypeIcon } from "@/components/icons";

/**
 * Shows the product's first uploaded photo (added through /admin ->
 * Products) when one exists, and otherwise falls back to a stand-in
 * (line icon + piece number) rather than a fabricated photo — see
 * README.md ("Product photography checklist").
 *
 * Always rendered in a fixed 3:4 portrait frame (`aspect-ratio: 3 / 4`,
 * `object-fit: cover`, centered), per the otutochki.ru reference: every
 * card/thumbnail lines up in a grid at the same height regardless of
 * the uploaded photo's own proportions (square, landscape, whatever).
 * `className` should only ever set width/layout utilities on the frame
 * (e.g. "w-full") — never its own `aspect-*` class, which would fight
 * this one.
 */
export default function ProductImagePlaceholder({
  albums,
  pieceNumber,
  images,
  hoverImage,
  className = "",
  iconClassName = "w-16 h-16",
}: {
  albums: string[];
  pieceNumber: string;
  images?: string[];
  /**
   * A second photo to crossfade in on hover (e.g. `product.images[1]`) —
   * catalog/home/related/wishlist cards only. Needs a `.group` class
   * somewhere up the tree (Tailwind's `group-hover:` works across
   * component boundaries, it's a plain CSS descendant selector).
   */
  hoverImage?: string;
  className?: string;
  iconClassName?: string;
}) {
  const photo = images?.[0];

  return (
    <div className={`relative aspect-[3/4] overflow-hidden bg-burgundy-tint ${className}`}>
      {photo ? (
        <>
          <Image src={photo} alt="" fill className="object-cover object-center" />
          {hoverImage && (
            <Image
              src={hoverImage}
              alt=""
              fill
              className="object-cover object-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}
        </>
      ) : (
        <>
          <Image
            src="/brand/mood-texture.jpg"
            alt=""
            fill
            aria-hidden
            className="object-cover object-center opacity-[0.06] grayscale"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <JewelryTypeIcon albums={albums} className={`text-burgundy/70 ${iconClassName}`} />
          </div>
          <span className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-[0.2em] text-burgundy/50">
            19:38 / {pieceNumber}
          </span>
        </>
      )}
    </div>
  );
}
