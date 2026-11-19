/**
 * Product "plashki" (display badges) — ONE OF ONE / LIMITED EDITION /
 * BESTSELLER / NEW / SALE.
 *
 * Deliberately independent from the `albums` system (see ./albumTypes):
 * a product's badges are a plain, admin-picked multi-select on the
 * product itself (see Product["badges"] in ./products), never derived
 * from which albums the product happens to belong to. The admin can
 * tick any combination — e.g. a product can be both LIMITED EDITION and
 * SALE at once, or carry no badge at all.
 *
 * Plain module (no `server-only` import) so Client Components can import
 * these runtime constants/functions directly — same reasoning as
 * ./albumTypes.ts (see the comment there for the Next.js build error this
 * avoids).
 */

export const ONE_OF_ONE = "one_of_one";
export const LIMITED = "limited";
export const SALE = "sale";
export const NEW = "new";
export const BESTSELLER = "bestseller";

export const BADGE_SLUGS = [ONE_OF_ONE, LIMITED, SALE, NEW, BESTSELLER] as const;
export type BadgeSlug = (typeof BADGE_SLUGS)[number];

/** Display order on the product card/detail page when several badges are set at once. */
export const BADGE_ORDER: BadgeSlug[] = [ONE_OF_ONE, LIMITED, SALE, NEW, BESTSELLER];

/** Short badge text, by locale. */
export const badgeLabels: Record<BadgeSlug, { ru: string; en: string }> = {
  one_of_one: { ru: "ONE OF ONE", en: "ONE OF ONE" },
  limited: { ru: "LIMITED EDITION", en: "LIMITED EDITION" },
  sale: { ru: "SALE", en: "SALE" },
  new: { ru: "NEW", en: "NEW" },
  bestseller: { ru: "BESTSELLER", en: "BESTSELLER" },
};

export function badgeLabel(slug: BadgeSlug, locale: string): string {
  return locale === "ru" ? badgeLabels[slug].ru : badgeLabels[slug].en;
}

/** Checkbox labels for the admin product form. */
export const badgeAdminLabels: Record<BadgeSlug, string> = {
  one_of_one: "One of One",
  limited: "Limited Edition",
  sale: "Sale",
  new: "New",
  bestseller: "Bestseller",
};

/**
 * The full explanatory sentence shown under the price on the product
 * page for an edition-type badge. Only one_of_one/limited have a note —
 * sale/new/bestseller are plain visual tags with nothing further to say.
 */
export const badgeNotes: Partial<Record<BadgeSlug, { ru: string; en: string }>> = {
  one_of_one: {
    ru: "украшение создано в единственном экземпляре.",
    en: "this piece was made in a single copy.",
  },
  limited: {
    ru: "украшение выпущено ограниченным тиражом. Количество экземпляров указано в описании товара.",
    en: "this piece was made in a limited run. The exact quantity is stated in the product description.",
  },
};
