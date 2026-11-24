/**
 * Shared constants for the gift-certificate cart line — kept in their own
 * small, non-server-only module (unlike src/data/products.ts) so both the
 * client-side store (src/lib/store.tsx) and the certificate page/components
 * can import them without pulling in Supabase.
 *
 * Unlike a regular product, the certificate isn't a row in the `products`
 * table: its price is whatever amount the buyer types in on
 * /certificate, not a fixed catalog price. See CartLine.certificateAmount
 * in src/lib/store.tsx for how that custom amount travels through the
 * cart/order flow.
 */
export const CERTIFICATE_SLUG = "gift-certificate";

/** Buyer must enter at least this many ֏ — guards against 0/blank input. No upper limit. */
export const CERTIFICATE_MIN_AMOUNT = 1000;

/** Pre-filled in the amount field so the page never shows an empty/zero price. */
export const CERTIFICATE_DEFAULT_AMOUNT = 5000;
