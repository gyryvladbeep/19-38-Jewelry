"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/data/products";

const CART_KEY = "1938-jewelry:cart";
const WISHLIST_KEY = "1938-jewelry:wishlist";
const PROMO_KEY = "1938-jewelry:promo";

export interface CartLine {
  slug: string;
  quantity: number;
  note?: string;
}

interface StoreContextValue {
  cart: CartLine[];
  wishlist: string[];
  addToCart: (slug: string, quantity?: number, note?: string) => void;
  removeFromCart: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
  cartCount: number;
  wishlistCount: number;
  hydrated: boolean;
  promoCode: string | null;
  setPromoCode: (code: string | null) => void;
  /**
   * The full product catalog, fetched once from /api/products on mount.
   * Cart/wishlist/order only ever store slugs in localStorage, so client
   * components that need full product details (price, name, images) for
   * an arbitrary slug — rather than the server-rendered list a page
   * already passed them — read it from here instead of importing
   * src/data/products.ts directly (that module is server-only, since the
   * catalog may live in Supabase).
   */
  products: Product[];
  productsLoaded: boolean;
  getProduct: (slug: string) => Product | undefined;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [promoCode, setPromoCodeState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/products")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Product[]) => {
        if (!cancelled) setProducts(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        // best-effort — cart/wishlist pages just show nothing for an
        // unresolvable slug until the next successful fetch
      })
      .finally(() => {
        if (!cancelled) setProductsLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const getProduct = useCallback(
    (slug: string) => products.find((p) => p.slug === slug),
    [products]
  );

  // Hydrate from localStorage on mount only, deliberately inside an effect:
  // the server (and the client's first render) must match with an empty
  // cart/wishlist, so reading localStorage has to happen post-mount rather
  // than during render, or React would throw a hydration mismatch.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setCart(readJSON(CART_KEY, [] as CartLine[]));
    setWishlist(readJSON(WISHLIST_KEY, [] as string[]));
    setPromoCodeState(readJSON(PROMO_KEY, null as string | null));
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      // best-effort persistence only
    }
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch {
      // best-effort persistence only
    }
  }, [wishlist, hydrated]);

  const addToCart = useCallback((slug: string, quantity = 1, note?: string) => {
    setCart((prev) => {
      const existing = prev.find((line) => line.slug === slug);
      if (existing) {
        return prev.map((line) =>
          line.slug === slug
            ? {
                ...line,
                quantity: line.quantity + quantity,
                note: note ?? line.note,
              }
            : line
        );
      }
      return [...prev, { slug, quantity, note }];
    });
  }, []);

  const removeFromCart = useCallback((slug: string) => {
    setCart((prev) => prev.filter((line) => line.slug !== slug));
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((line) => line.slug !== slug)
        : prev.map((line) => (line.slug === slug ? { ...line, quantity } : line))
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const setPromoCode = useCallback((code: string | null) => {
    setPromoCodeState(code);
    try {
      if (code) {
        window.localStorage.setItem(PROMO_KEY, JSON.stringify(code));
      } else {
        window.localStorage.removeItem(PROMO_KEY);
      }
    } catch {
      // best-effort persistence only
    }
  }, []);

  const toggleWishlist = useCallback((slug: string) => {
    setWishlist((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);

  const isWishlisted = useCallback(
    (slug: string) => wishlist.includes(slug),
    [wishlist]
  );

  const value = useMemo<StoreContextValue>(
    () => ({
      cart,
      wishlist,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart,
      toggleWishlist,
      isWishlisted,
      cartCount: cart.reduce((sum, line) => sum + line.quantity, 0),
      wishlistCount: wishlist.length,
      hydrated,
      promoCode,
      setPromoCode,
      products,
      productsLoaded,
      getProduct,
    }),
    [
      cart,
      wishlist,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart,
      toggleWishlist,
      isWishlisted,
      hydrated,
      promoCode,
      setPromoCode,
      products,
      productsLoaded,
      getProduct,
    ]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return ctx;
}
