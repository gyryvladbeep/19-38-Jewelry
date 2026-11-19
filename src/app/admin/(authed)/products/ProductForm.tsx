"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Album, Product } from "@/data/products";
import { saveProduct, deleteProduct, type ActionResult } from "./actions";

const editionOptions: { value: Product["editionType"]; label: string }[] = [
  { value: "none", label: "Нет" },
  { value: "one_of_one", label: "One of One" },
  { value: "limited", label: "Limited Edition" },
];

const personalizationOptions: { value: Product["personalization"][number]; label: string }[] = [
  { value: "engraving", label: "Гравировка" },
  { value: "size", label: "Размер" },
  { value: "color", label: "Цвет" },
];

const inputClass =
  "mt-1 w-full border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-ink";
const labelClass = "text-sm text-ink";

const initialSaveState: ActionResult<{ id: string }> | null = null;
const initialDeleteState: ActionResult<null> | null = null;

export default function ProductForm({ product, albums }: { product?: Product; albums: Album[] }) {
  const router = useRouter();
  const [keepImages, setKeepImages] = useState<string[]>(product?.images ?? []);
  const [selectedAlbums, setSelectedAlbums] = useState<string[]>(product?.albums ?? []);
  const [saveState, saveAction, saving] = useActionState(saveProduct, initialSaveState);
  const [deleteState, deleteAction, deleting] = useActionState(deleteProduct, initialDeleteState);

  // Server Actions here return a result value rather than throwing (see
  // the comment on ActionResult in ./actions.ts), so success is detected
  // by watching the returned state rather than a try/catch — navigating
  // away is a side effect of that state, not of the submit handler itself.
  useEffect(() => {
    if (saveState?.ok) {
      router.push("/admin/products");
      router.refresh();
    }
  }, [saveState, router]);

  useEffect(() => {
    if (deleteState?.ok) {
      router.push("/admin/products");
      router.refresh();
    }
  }, [deleteState, router]);

  const error = (saveState && !saveState.ok && saveState.error) || (deleteState && !deleteState.ok && deleteState.error) || null;
  const saleSelected = selectedAlbums.includes("sale");
  const sortedAlbums = [...albums].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="max-w-3xl space-y-10">
      <form action={saveAction} className="space-y-10">
        {product?.id && <input type="hidden" name="id" value={product.id} />}

        <section>
          <h2 className="text-xs uppercase tracking-[0.14em] text-burgundy">Основное</h2>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="slug">
                Slug (адрес страницы)
              </label>
              <input
                id="slug"
                name="slug"
                defaultValue={product?.slug}
                placeholder="pearl-drop-necklace"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="pieceNumber">
                Номер экземпляра
              </label>
              <input
                id="pieceNumber"
                name="pieceNumber"
                defaultValue={product?.pieceNumber}
                placeholder="019"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="price">
                Цена, ֏
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min={0}
                step={1}
                defaultValue={product?.price}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="salePrice">
                Цена со скидкой, ֏ (для коллекции Sale)
              </label>
              <input
                id="salePrice"
                name="salePrice"
                type="number"
                min={0}
                step={1}
                defaultValue={product?.salePrice ?? ""}
                placeholder="необязательно"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="availability">
                Наличие
              </label>
              <select
                id="availability"
                name="availability"
                defaultValue={product?.availability ?? "in_stock"}
                className={inputClass}
              >
                <option value="in_stock">В наличии</option>
                <option value="made_to_order">Под заказ</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="editionType">
                Тип тиража (плашка)
              </label>
              <select
                id="editionType"
                name="editionType"
                defaultValue={product?.editionType ?? "none"}
                className={inputClass}
              >
                {editionOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-muted">
                Limited Edition — не забудьте указать количество экземпляров в описании товара.
              </p>
            </div>
            <label className="mt-6 flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name="bestseller"
                defaultChecked={product?.bestseller}
                className="h-4 w-4 accent-burgundy"
              />
              Показывать в «Заметных вещах» на главной
            </label>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between">
              <span className={labelClass}>Альбомы (тип украшения и коллекции)</span>
              <Link
                href="/admin/albums"
                target="_blank"
                className="text-xs uppercase tracking-[0.1em] text-muted underline underline-offset-4 hover:text-burgundy"
              >
                Управлять альбомами ↗
              </Link>
            </div>
            <div className="mt-2 flex flex-wrap gap-4">
              {sortedAlbums.map((album) => (
                <label key={album.slug} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="albums"
                    value={album.slug}
                    defaultChecked={product?.albums.includes(album.slug)}
                    onChange={(e) =>
                      setSelectedAlbums((prev) =>
                        e.target.checked
                          ? [...prev, album.slug]
                          : prev.filter((v) => v !== album.slug)
                      )
                    }
                    className="h-4 w-4 accent-burgundy"
                  />
                  {album.nameRu}
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted">
              Товар можно отметить сразу в нескольких альбомах — например «Серьги» и «New»
              одновременно.
            </p>
            {saleSelected && (
              <p className="mt-2 text-xs text-muted">
                Товар отмечен как Sale — укажите цену со скидкой выше, иначе на сайте будет
                показана обычная цена.
              </p>
            )}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="materials">
                Материалы
              </label>
              <input
                id="materials"
                name="materials"
                defaultValue={product?.materials}
                placeholder="например: натуральный камень, родий"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="size">
                Размер
              </label>
              <input
                id="size"
                name="size"
                defaultValue={product?.size}
                placeholder="например: 17 см / размер 16"
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-5">
            <span className={labelClass}>Персонализация</span>
            <div className="mt-2 flex flex-wrap gap-4">
              {personalizationOptions.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="personalization"
                    value={opt.value}
                    defaultChecked={product?.personalization.includes(opt.value)}
                    className="h-4 w-4 accent-burgundy"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xs uppercase tracking-[0.14em] text-burgundy">Фото</h2>
          {keepImages.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {keepImages.map((url) => (
                <div key={url} className="relative">
                  <input type="hidden" name="existingImages" value={url} />
                  {/* eslint-disable-next-line @next/next/no-img-element -- admin-only preview thumbnail, not worth next/image config for arbitrary already-uploaded URLs */}
                  <img src={url} alt="" className="h-20 w-20 border border-line object-cover" />
                  <button
                    type="button"
                    onClick={() => setKeepImages((prev) => prev.filter((u) => u !== url))}
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] text-paper"
                    aria-label="Удалить фото"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <label className={`${labelClass} mt-4 block`} htmlFor="newImages">
            Добавить фото
          </label>
          <input
            id="newImages"
            name="newImages"
            type="file"
            accept="image/*"
            multiple
            className="mt-1 block w-full text-sm"
          />
          <p className="mt-1 text-xs text-muted">
            Первое фото в списке используется как основное на карточке товара.
          </p>
        </section>

        <section>
          <h2 className="text-xs uppercase tracking-[0.14em] text-burgundy">Название и описание</h2>
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.1em] text-muted">Русский</p>
              <div>
                <label className={labelClass} htmlFor="nameRu">
                  Название
                </label>
                <input id="nameRu" name="nameRu" defaultValue={product?.ru.name} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="descriptionRu">
                  Полное описание
                </label>
                <textarea
                  id="descriptionRu"
                  name="descriptionRu"
                  rows={4}
                  defaultValue={product?.ru.description}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.1em] text-muted">English</p>
              <div>
                <label className={labelClass} htmlFor="nameEn">
                  Name
                </label>
                <input id="nameEn" name="nameEn" defaultValue={product?.en.name} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="descriptionEn">
                  Full description
                </label>
                <textarea
                  id="descriptionEn"
                  name="descriptionEn"
                  rows={4}
                  defaultValue={product?.en.description}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </section>

        {error && <p className="text-sm text-burgundy">{error}</p>}

        <div className="flex items-center gap-3 border-t border-line pt-6">
          <button
            type="submit"
            disabled={saving}
            className="bg-ink px-5 py-2.5 text-xs uppercase tracking-[0.14em] text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Сохраняем…" : "Сохранить"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="border border-line px-5 py-2.5 text-xs uppercase tracking-[0.14em] text-ink hover:border-ink"
          >
            Отмена
          </button>
        </div>
      </form>

      {product?.id && (
        <form
          action={deleteAction}
          onSubmit={(e) => {
            if (!window.confirm(`Удалить товар «${product.ru.name}»? Это необратимо.`)) {
              e.preventDefault();
            }
          }}
          className="border-t border-line pt-6"
        >
          <input type="hidden" name="id" value={product.id} />
          <button
            type="submit"
            disabled={deleting}
            className="text-xs uppercase tracking-[0.12em] text-muted hover:text-burgundy disabled:opacity-60"
          >
            {deleting ? "Удаляем…" : "Удалить товар"}
          </button>
        </form>
      )}
    </div>
  );
}
