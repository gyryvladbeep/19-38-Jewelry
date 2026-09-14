/**
 * DEMO promo codes — placeholder logic so the cart's promo-code field
 * does something. Replace with real codes (and move server-side, so
 * discounts can't be forged from the client) before launch.
 */
export const promoCodes: Record<string, number> = {
  WELCOME10: 0.1,
  SIGN15: 0.15,
};

export function getPromoDiscount(code: string): number {
  return promoCodes[code.trim().toUpperCase()] ?? 0;
}
