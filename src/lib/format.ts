export function formatPrice(price: number, locale: string): string {
  const formatted = new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
    maximumFractionDigits: 0,
  }).format(price);
  return `${formatted} ֏`;
}

export const personalizationLabels: Record<string, { ru: string; en: string }> = {
  engraving: { ru: "гравировка", en: "engraving" },
  size: { ru: "размер", en: "size" },
  color: { ru: "цвет", en: "color" },
};

/** Short badge label for a product's edition type — "none" renders no badge at all. */
export const editionLabels: Record<string, string> = {
  one_of_one: "ONE OF ONE",
  limited: "LIMITED EDITION",
};

/** The full explanatory sentence shown alongside the short edition badge. */
export const editionNotes: Record<string, { ru: string; en: string }> = {
  one_of_one: {
    ru: "украшение создано в единственном экземпляре.",
    en: "this piece was made in a single copy.",
  },
  limited: {
    ru: "украшение выпущено ограниченным тиражом. Количество экземпляров указано в описании товара.",
    en: "this piece was made in a limited run. The exact quantity is stated in the product description.",
  },
};
