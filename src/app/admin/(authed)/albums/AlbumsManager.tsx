"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Album } from "@/data/albumTypes";
import { BADGE_ALBUM_SLUGS } from "@/data/albumTypes";
import { saveAlbum, deleteAlbum, type ActionResult } from "./actions";

const inputClass =
  "mt-1 w-full border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-ink";

const initialSaveState: ActionResult<null> | null = null;
const initialDeleteState: ActionResult<null> | null = null;

function AlbumRow({ album }: { album: Album }) {
  const router = useRouter();
  const [saveState, saveAction, saving] = useActionState(saveAlbum, initialSaveState);
  const [deleteState, deleteAction, deleting] = useActionState(deleteAlbum, initialDeleteState);

  useEffect(() => {
    if (saveState?.ok || deleteState?.ok) router.refresh();
  }, [saveState, deleteState, router]);

  const reserved = (BADGE_ALBUM_SLUGS as readonly string[]).includes(album.slug);

  return (
    <div className="border border-line p-4">
      <form action={saveAction} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_1fr_6rem_auto] sm:items-end">
        <input type="hidden" name="id" value={album.id} />
        <div>
          <label className="text-xs uppercase tracking-[0.1em] text-muted">Slug</label>
          <p className="mt-1 py-2 font-mono text-sm text-muted">{album.slug}</p>
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.1em] text-muted">Название (RU)</label>
          <input name="nameRu" defaultValue={album.nameRu} required className={inputClass} />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.1em] text-muted">Название (EN)</label>
          <input name="nameEn" defaultValue={album.nameEn} required className={inputClass} />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.1em] text-muted">Порядок</label>
          <input
            name="sortOrder"
            type="number"
            defaultValue={album.sortOrder}
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="h-fit bg-ink px-4 py-2 text-xs uppercase tracking-[0.12em] text-paper hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "…" : "Сохранить"}
        </button>
      </form>
      {saveState && !saveState.ok && <p className="mt-2 text-xs text-burgundy">{saveState.error}</p>}

      <form
        action={deleteAction}
        onSubmit={(e) => {
          if (!window.confirm(`Удалить альбом «${album.nameRu}»? Он будет снят со всех товаров.`)) {
            e.preventDefault();
          }
        }}
        className="mt-3"
      >
        <input type="hidden" name="id" value={album.id} />
        <input type="hidden" name="slug" value={album.slug} />
        <button
          type="submit"
          disabled={deleting}
          className="text-xs uppercase tracking-[0.1em] text-muted hover:text-burgundy disabled:opacity-60"
        >
          {deleting ? "Удаляем…" : "Удалить альбом"}
        </button>
        {reserved && (
          <span className="ml-3 text-[11px] text-muted">
            Используется для плашек «Bestseller/New/Sale» и цены со скидкой — удаляйте с осторожностью.
          </span>
        )}
      </form>
      {deleteState && !deleteState.ok && (
        <p className="mt-2 text-xs text-burgundy">{deleteState.error}</p>
      )}
    </div>
  );
}

function NewAlbumForm() {
  const router = useRouter();
  const [state, action, saving] = useActionState(saveAlbum, initialSaveState);
  const [open, setOpen] = useState(false);

  // Closing the form on success is handled by the parent remounting this
  // component (via a `key` tied to the album count) once router.refresh()
  // brings in the new row — not by setting local state from this effect.
  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border border-line px-5 py-2.5 text-xs uppercase tracking-[0.14em] text-ink hover:border-ink"
      >
        + Новый альбом
      </button>
    );
  }

  return (
    <form action={action} className="border border-line p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-burgundy">Новый альбом</p>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_1fr_6rem]">
        <div>
          <label className="text-xs uppercase tracking-[0.1em] text-muted">Slug</label>
          <input
            name="slug"
            placeholder="slow-season"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.1em] text-muted">Название (RU)</label>
          <input name="nameRu" required className={inputClass} />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.1em] text-muted">Название (EN)</label>
          <input name="nameEn" required className={inputClass} />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.1em] text-muted">Порядок</label>
          <input name="sortOrder" type="number" defaultValue={0} className={inputClass} />
        </div>
      </div>
      {state && !state.ok && <p className="mt-2 text-xs text-burgundy">{state.error}</p>}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-ink px-5 py-2.5 text-xs uppercase tracking-[0.14em] text-paper hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Создаём…" : "Создать альбом"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="border border-line px-5 py-2.5 text-xs uppercase tracking-[0.14em] text-ink hover:border-ink"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}

export default function AlbumsManager({ albums }: { albums: Album[] }) {
  const sorted = [...albums].sort((a, b) => a.sortOrder - b.sortOrder);
  return (
    <div className="space-y-4">
      {sorted.map((album) => (
        <AlbumRow key={album.id} album={album} />
      ))}
      <NewAlbumForm key={albums.length} />
    </div>
  );
}
