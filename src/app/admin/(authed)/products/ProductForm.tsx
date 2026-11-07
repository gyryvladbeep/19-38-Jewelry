"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/data/products";
import { saveProduct, deleteProduct, type ActionResult } from "./actions";

const typeOptions: { value: Product["type"]; label: string }[] = [
  { value: "ring", label: "Кольцо" },
  { value: "necklace", label: "Колье" },
  { value: "earrings", label: "Серьги" },
  { value: "bracelet", label: "Браслет" },
];

const materialOptions: { value: Product["materials"][number]; label: string }[] = [
  { value: "stone", label: "Натуральный камень" },
  { value: "pearl", label: "Жемчуг" },
  { value: "rhodium", label: "Родий" },
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

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [keepImages, setKeepImages] = useState<string[]>(product?.images ?? []);
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
                Цена, ₽
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
              <label className={labelClass} htmlFor="type">
                Тип украшения
              </label>
              <select id="type" name="type" defaultValue={product?.type ?? "ring"} className={inputClass}>
                {typeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
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
            <span className={labelClass}>Материалы</span>
            <div className="mt-2 flex flex-wrap gap-4">
              {materialOptions.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="materials"
                    value={opt.value}
                    defaultChecked={product?.materials.includes(opt.value)}
                    className="h-4 w-4 accent-burgundy"
                  />
                  {opt.label}
                </label>
              ))}
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
                <label className={labelClass} htmlFor="shortDescriptionRu">
                  Короткое описание
                </label>
                <input
                  id="shortDescriptionRu"
                  name="shortDescriptionRu"
                  defaultValue={product?.ru.shortDescription}
                  className={inputClass}
                />
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
                <label className={labelClass} htmlFor="shortDescriptionEn">
                  Short description
                </label>
                <input
                  id="shortDescriptionEn"
                  name="shortDescriptionEn"
                  defaultValue={product?.en.shortDescription}
                  className={inputClass}
                />
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
