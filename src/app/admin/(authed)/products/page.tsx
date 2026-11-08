import Link from "next/link";
import { fetchProducts } from "@/data/products";
import { isSupabaseConfigured } from "@/lib/supabase";
import DeleteProductButton from "./DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await fetchProducts();
  const configured = isSupabaseConfigured();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-ink">Товары</h1>
        <Link
          href="/admin/products/new"
          className="bg-ink px-4 py-2 text-xs uppercase tracking-[0.14em] text-paper hover:opacity-90"
        >
          + Добавить товар
        </Link>
      </div>

      {!configured && (
        <p className="mt-4 text-sm text-muted">
          Supabase не настроен — ниже показаны встроенные демо-товары (только для
          просмотра). Чтобы редактировать и сохранять товары, настройте Supabase —
          см. README.md.
        </p>
      )}

      <div className="mt-8 divide-y divide-line border-t border-b border-line">
        {products.map((product) => (
          <div key={product.slug} className="flex items-center gap-4 py-4">
            <Link
              href={configured && product.id ? `/admin/products/${product.id}` : "#"}
              className={`flex min-w-0 flex-1 items-center gap-4 ${
                configured && product.id ? "hover:bg-surface" : "cursor-default"
              }`}
            >
              <div className="h-14 w-14 shrink-0 border border-line bg-burgundy-tint">
                {product.images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element -- admin list thumbnail
                  <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-ink">{product.ru.name}</p>
                <p className="text-xs text-muted">
                  19:38 / {product.pieceNumber || "—"} · {product.slug}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm text-ink">{product.price.toLocaleString("ru-RU")} ₽</p>
                <p className="text-xs text-muted">
                  {product.availability === "in_stock" ? "В наличии" : "Под заказ"}
                </p>
              </div>
            </Link>
            {configured && product.id && (
              <DeleteProductButton id={product.id} name={product.ru.name} />
            )}
          </div>
        ))}
        {products.length === 0 && (
          <p className="py-10 text-center text-sm text-muted">Пока нет товаров.</p>
        )}
      </div>
    </div>
  );
}
