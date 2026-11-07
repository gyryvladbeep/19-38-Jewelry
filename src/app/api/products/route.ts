import { NextResponse } from "next/server";
import { fetchProducts } from "@/data/products";

// Public catalog data, used by client components (cart/wishlist/order)
// that need to resolve an arbitrary slug stored in localStorage — see
// src/lib/store.tsx. The same data Server Components get from
// fetchProducts() directly; this just exposes it to the browser.
export const revalidate = 60;

export async function GET() {
  const products = await fetchProducts();
  return NextResponse.json(products);
}
