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
