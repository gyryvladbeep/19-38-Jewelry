import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase";
import { fetchProducts } from "@/data/products";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const configured = isSupabaseConfigured();
  const products = await fetchProducts();
  const usingFallbackData = !configured;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl text-ink">Обзор</h1>

      {!configured && (
        <div className="mt-6 border border-burgundy/30 bg-burgundy-tint p-5 text-sm text-ink">
          <p className="text-burgundy">Supabase ещё не подключён.</p>
          <p className="mt-2 leading-relaxed text-ink">
            Сайт сейчас показывает встроенные демо-товары и исходные тексты. Чтобы
            изменения из этой панели попадали на сайт, настройте переменные
            окружения <code className="font-mono text-xs">SUPABASE_URL</code> и{" "}
            <code className="font-mono text-xs">SUPABASE_SERVICE_ROLE_KEY</code> —
            инструкция в README.md («Admin panel &amp; content editing»).
          </p>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Link
          href="/admin/products"
          className="block border border-line bg-surface p-6 hover:border-ink"
        >
          <h2 className="text-sm uppercase tracking-[0.12em] text-burgundy">Товары</h2>
          <p className="mt-2 text-sm text-muted">
            {products.length} {usingFallbackData ? "демо-товаров" : "товаров"} в каталоге.
            Добавляйте, редактируйте и загружайте фото.
          </p>
        </Link>
        <Link
          href="/admin/content"
          className="block border border-line bg-surface p-6 hover:border-ink"
        >
          <h2 className="text-sm uppercase tracking-[0.12em] text-burgundy">
            Тексты страниц
          </h2>
          <p className="mt-2 text-sm text-muted">
            О бренде, частые вопросы, главная, доставка, возврат, конфиденциальность,
            контакты.
          </p>
        </Link>
      </div>

      <p className="mt-8 text-xs leading-relaxed text-muted">
        Изменения на сайте появляются в течение минуты (без пересборки). Этот
        раздел охватывает основной контент бренда — пункты меню и подписи кнопок
        остаются частью кода сайта.
      </p>
    </div>
  );
}
