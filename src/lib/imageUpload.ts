import "server-only";
import convert from "heic-convert";

const HEIC_EXTENSIONS = [".heic", ".heif"];
const HEIC_MIME_TYPES = ["image/heic", "image/heif", "image/heic-sequence", "image/heif-sequence"];

export interface NormalizedImage {
  /** Bytes to upload — either the original file untouched, or a converted JPEG. */
  buffer: Uint8Array;
  contentType: string;
  /** File extension to use for the storage path (no leading dot). */
  extension: string;
}

/**
 * Normalizes an admin-uploaded photo before it goes to Supabase Storage.
 *
 * The one real gap in "any format" is HEIC/HEIF — the format iPhones save
 * photos in by default. No browser can decode it (Chrome, Firefox, Edge —
 * none ship a HEIC decoder), so a HEIC file uploaded as-is would show as a
 * broken image everywhere on the site. Everything else admins are likely to
 * upload (JPEG/PNG/WEBP/GIF/AVIF/...) already renders fine via next/image
 * and is uploaded byte-for-byte, unchanged.
 *
 * Detection uses both the browser-reported MIME type and the filename
 * extension, because many browsers report an empty or generic `file.type`
 * (e.g. "" or "application/octet-stream") for HEIC files rather than
 * "image/heic" — the extension is the more reliable signal in practice.
 */
export async function normalizeUploadedImage(file: File): Promise<NormalizedImage> {
  const nameLower = file.name.toLowerCase();
  const isHeic =
    HEIC_MIME_TYPES.includes(file.type) || HEIC_EXTENSIONS.some((ext) => nameLower.endsWith(ext));

  if (!isHeic) {
    const extension = file.name.includes(".") ? file.name.split(".").pop()! : "jpg";
    return {
      buffer: new Uint8Array(await file.arrayBuffer()),
      contentType: file.type || "image/jpeg",
      extension,
    };
  }

  const inputBuffer = new Uint8Array(await file.arrayBuffer());
  // sharp's prebuilt binaries deliberately exclude HEIF/HEIC decoding
  // (HEVC/H.265 patent licensing), so this uses heic-convert instead — a
  // pure JS/WASM decoder with no native codec dependency.
  const outputBuffer = await convert({ buffer: inputBuffer, format: "JPEG", quality: 0.92 });
  return {
    buffer: outputBuffer,
    contentType: "image/jpeg",
    extension: "jpg",
  };
}
