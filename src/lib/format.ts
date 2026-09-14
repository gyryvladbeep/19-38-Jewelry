export function formatPrice(price: number, locale: string): string {
  const formatted = new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
    maximumFractionDigits: 0,
  }).format(price);
  return `${formatted} ₽`;
}

export const materialLabels: Record<string, { ru: string; en: string }> = {
  stone: { ru: "натуральный камень", en: "natural stone" },
  pearl: { ru: "жемчуг", en: "pearl" },
  rhodium: { ru: "родий", en: "rhodium" },
};

export const typeLabels: Record<string, { ru: string; en: string }> = {
  ring: { ru: "Кольцо", en: "Ring" },
  necklace: { ru: "Колье", en: "Necklace" },
  earrings: { ru: "Серьги", en: "Earrings" },
  bracelet: { ru: "Браслет", en: "Bracelet" },
};

export const personalizationLabels: Record<string, { ru: string; en: string }> = {
  engraving: { ru: "гравировка", en: "engraving" },
  size: { ru: "размер", en: "size" },
  color: { ru: "цвет", en: "color" },
};
