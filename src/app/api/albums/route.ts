import { NextResponse } from "next/server";
import { fetchAlbums } from "@/lib/albums";

// Public album list, used by client components (wishlist) that render
// <ProductCard> outside a Server Component — see src/lib/store.tsx. The
// same data Server Components get from fetchAlbums() directly; this just
// exposes it to the browser.
export const revalidate = 60;

export async function GET() {
  const albums = await fetchAlbums();
  return NextResponse.json(albums);
}
