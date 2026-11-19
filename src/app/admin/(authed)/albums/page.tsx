import { isSupabaseConfigured } from "@/lib/supabase";
import { fetchAlbums } from "@/lib/albums";
import AlbumsManager from "./AlbumsManager";

export const dynamic = "force-dynamic";

export default async function AdminAlbumsPage() {
  const configured = isSupabaseConfigured();
  const albums = await fetchAlbums();

  return (
    <div>
      <h1 className="text-2xl text-ink">Альбомы</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Единый список категорий и коллекций — тип украшения (Кольцо, Колье…) и маркетинговые
        тэги (Bestseller, New, Sale) теперь один список «альбомов». Товар можно добавить сразу в
        несколько альбомов — выбор делается в форме товара. Переименуйте, добавьте свой альбом
        (например сезонную подборку) или удалите ненужный — он будет снят со всех товаров.
      </p>

      {!configured && (
        <div className="mt-6 border border-burgundy/30 bg-burgundy-tint p-5 text-sm text-ink">
          Supabase не настроен — ниже показаны альбомы по умолчанию (только для просмотра).
          Настройте <code className="font-mono text-xs">SUPABASE_URL</code> и{" "}
          <code className="font-mono text-xs">SUPABASE_SERVICE_ROLE_KEY</code>, чтобы управлять
          альбомами — см. README.md.
        </div>
      )}

      <div className="mt-8">
        <AlbumsManager albums={albums} />
      </div>
    </div>
  );
}
