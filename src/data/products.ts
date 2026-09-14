/**
 * PLACEHOLDER CATALOG DATA — 19:38 Jewelry
 * ------------------------------------------------------------------
 * These 8 products are SAMPLE DATA so the site has something real to
 * render (catalog, filters, product pages, cart). Replace every field
 * with actual products before launch — see README.md ("Managing
 * products") for the exact shape each product needs.
 *
 * No real product photography exists yet, so every product uses the
 * <ProductImagePlaceholder> component instead of a photo — nothing
 * here is a stand-in photo pretending to be real.
 */

export type JewelryType = "ring" | "necklace" | "earrings" | "bracelet";
export type MaterialKey = "stone" | "pearl" | "rhodium";
export type Availability = "in_stock" | "made_to_order";
export type PersonalizationOption = "engraving" | "size" | "color";

export interface ProductLocaleContent {
  name: string;
  shortDescription: string;
  description: string;
}

export interface Review {
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  ru: string;
  en: string;
}

export interface Product {
  slug: string;
  pieceNumber: string;
  price: number;
  type: JewelryType;
  materials: MaterialKey[];
  availability: Availability;
  personalization: PersonalizationOption[];
  bestseller?: boolean;
  reviews: Review[];
  ru: ProductLocaleContent;
  en: ProductLocaleContent;
}

export const products: Product[] = [
  {
    slug: "signature-ring-19",
    pieceNumber: "019",
    price: 6800,
    type: "ring",
    materials: ["stone", "rhodium"],
    availability: "in_stock",
    personalization: ["size"],
    bestseller: true,
    reviews: [
      {
        author: "Alina",
        rating: 5,
        ru: "Заметила это кольцо случайно — и это оказался тот самый знак. Сижу и смотрю на него каждый день.",
        en: "I noticed this ring by chance — and it turned out to be the sign. I catch myself looking at it every day.",
      },
    ],
    ru: {
      name: "Кольцо Signature 19",
      shortDescription: "Тонкое кольцо с натуральным камнем и родиевым покрытием.",
      description:
        "Минималистичное кольцо ручной работы: натуральный камень в родиевой оправе. Экземпляр 19:38 / 019 — существует в единственном числе, с карточкой-посланием в комплекте.",
    },
    en: {
      name: "Signature 19 Ring",
      shortDescription: "A slim ring with a natural stone and rhodium plating.",
      description:
        "A minimalist handmade ring: a natural stone set in rhodium. Piece 19:38 / 019 — exists in a single copy, with a message card included.",
    },
  },
  {
    slug: "pearl-drop-necklace",
    pieceNumber: "007",
    price: 9200,
    type: "necklace",
    materials: ["pearl", "rhodium"],
    availability: "in_stock",
    personalization: ["size"],
    bestseller: true,
    reviews: [
      {
        author: "Marina",
        rating: 5,
        ru: "Купила себе на день рождения. Упаковка и карточка — отдельная история, невозможно не растрогаться.",
        en: "I bought this for my own birthday. The packaging and the card are a story on their own — impossible not to be moved.",
      },
      {
        author: "Ksenia",
        rating: 4,
        ru: "Украшение красивое, ждала чуть дольше обычного — но результат того стоил.",
        en: "Beautiful piece, took a little longer than expected — but it was worth the wait.",
      },
    ],
    ru: {
      name: "Колье Pearl Drop",
      shortDescription: "Тонкая цепочка с жемчужиной на родии.",
      description:
        "Колье с одной жемчужиной на тонкой родированной цепочке. Экземпляр 19:38 / 007 — one of one, с фирменной карточкой-посланием.",
    },
    en: {
      name: "Pearl Drop Necklace",
      shortDescription: "A delicate chain with a single pearl on rhodium.",
      description:
        "A necklace with a single pearl on a fine rhodium-plated chain. Piece 19:38 / 007 — one of one, with the signature message card.",
    },
  },
  {
    slug: "stone-hoop-earrings",
    pieceNumber: "032",
    price: 5400,
    type: "earrings",
    materials: ["stone", "rhodium"],
    availability: "in_stock",
    personalization: [],
    reviews: [],
    ru: {
      name: "Серьги Stone Hoop",
      shortDescription: "Серьги-кольца с натуральным камнем.",
      description:
        "Небольшие серьги-кольца с вкраплением натурального камня, родиевое покрытие. Экземпляр 19:38 / 032.",
    },
    en: {
      name: "Stone Hoop Earrings",
      shortDescription: "Hoop earrings set with a natural stone.",
      description:
        "Small hoop earrings featuring a natural stone accent, rhodium plated. Piece 19:38 / 032.",
    },
  },
  {
    slug: "midnight-bar-bracelet",
    pieceNumber: "014",
    price: 7100,
    type: "bracelet",
    materials: ["rhodium", "stone"],
    availability: "made_to_order",
    personalization: ["engraving", "size"],
    reviews: [],
    ru: {
      name: "Браслет Midnight Bar",
      shortDescription: "Браслет-цепочка с планкой под гравировку.",
      description:
        "Браслет на родированной цепочке с планкой, доступна персональная гравировка. Изготавливается под заказ — экземпляр 19:38 / 014.",
    },
    en: {
      name: "Midnight Bar Bracelet",
      shortDescription: "A chain bracelet with an engravable bar.",
      description:
        "A rhodium-plated chain bracelet with a bar available for personal engraving. Made to order — piece 19:38 / 014.",
    },
  },
  {
    slug: "pearl-stud-earrings",
    pieceNumber: "041",
    price: 3600,
    type: "earrings",
    materials: ["pearl"],
    availability: "in_stock",
    personalization: [],
    reviews: [
      {
        author: "Diana",
        rating: 5,
        ru: "Ношу не снимая с первого дня. Идеальный баланс размера и веса.",
        en: "I haven't taken them off since day one. The size and weight are perfectly balanced.",
      },
    ],
    ru: {
      name: "Серьги-пуссеты Pearl",
      shortDescription: "Классические жемчужные пуссеты.",
      description:
        "Лаконичные пуссеты с натуральным жемчугом на родированной основе. Экземпляр 19:38 / 041.",
    },
    en: {
      name: "Pearl Stud Earrings",
      shortDescription: "Classic natural pearl studs.",
      description:
        "Understated studs featuring natural pearl on a rhodium-plated base. Piece 19:38 / 041.",
    },
  },
  {
    slug: "sign-pendant-necklace",
    pieceNumber: "003",
    price: 8300,
    type: "necklace",
    materials: ["rhodium", "stone"],
    availability: "made_to_order",
    personalization: ["engraving"],
    bestseller: true,
    reviews: [],
    ru: {
      name: "Колье Sign Pendant",
      shortDescription: "Подвеска с камнем и местом под гравировку.",
      description:
        "Подвеска на тонкой цепочке с натуральным камнем — оборотная сторона доступна для персональной гравировки. Экземпляр 19:38 / 003, под заказ.",
    },
    en: {
      name: "Sign Pendant Necklace",
      shortDescription: "A stone pendant with space for engraving.",
      description:
        "A pendant on a fine chain featuring a natural stone — the reverse side is available for a personal engraving. Piece 19:38 / 003, made to order.",
    },
  },
  {
    slug: "twin-stone-ring",
    pieceNumber: "026",
    price: 6200,
    type: "ring",
    materials: ["stone", "stone"],
    availability: "in_stock",
    personalization: ["size"],
    reviews: [],
    ru: {
      name: "Кольцо Twin Stone",
      shortDescription: "Кольцо с двумя камнями разных оттенков.",
      description:
        "Кольцо с двумя натуральными камнями на родированной основе. Экземпляр 19:38 / 026.",
    },
    en: {
      name: "Twin Stone Ring",
      shortDescription: "A ring set with two stones in contrasting tones.",
      description:
        "A ring featuring two natural stones on a rhodium-plated band. Piece 19:38 / 026.",
    },
  },
  {
    slug: "pearl-chain-bracelet",
    pieceNumber: "058",
    price: 4900,
    type: "bracelet",
    materials: ["pearl", "rhodium"],
    availability: "in_stock",
    personalization: ["size", "color"],
    reviews: [],
    ru: {
      name: "Браслет Pearl Chain",
      shortDescription: "Браслет с жемчужными вставками на цепочке.",
      description:
        "Тонкий браслет с жемчужными вставками на родированной цепочке. Экземпляр 19:38 / 058.",
    },
    en: {
      name: "Pearl Chain Bracelet",
      shortDescription: "A chain bracelet with pearl accents.",
      description:
        "A delicate bracelet with pearl accents on a rhodium-plated chain. Piece 19:38 / 058.",
    },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getBestsellers(): Product[] {
  return products.filter((p) => p.bestseller);
}

export function getRelatedProducts(product: Product, count = 4): Product[] {
  return products
    .filter((p) => p.slug !== product.slug && p.type === product.type)
    .concat(products.filter((p) => p.slug !== product.slug && p.type !== product.type))
    .slice(0, count);
}
