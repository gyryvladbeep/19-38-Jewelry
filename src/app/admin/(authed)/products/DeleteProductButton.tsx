"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteProduct, type ActionResult } from "./actions";

const initialState: ActionResult<null> | null = null;

/**
 * Quick-delete action for a single row on the admin products LIST page
 * (/admin/products) — lets you remove a product without first opening its
 * edit page. Wraps the same `deleteProduct` Server Action ProductForm.tsx
 * uses on the edit page; see the comment on ActionResult in ./actions.ts
 * for why that action returns errors as values rather than throwing.
 */
export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(deleteProduct, initialState);

  useEffect(() => {
    if (state?.ok) {
      router.refresh();
    }
  }, [state, router]);

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(`Удалить товар «${name}»? Это необратимо.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        aria-label={`Удалить товар «${name}»`}
        title="Удалить товар"
        className="flex h-8 w-8 shrink-0 items-center justify-center text-muted transition-colors hover:text-burgundy disabled:opacity-60"
      >
        {pending ? (
          <span className="text-[10px] uppercase tracking-[0.1em]">…</span>
        ) : (
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
            <path
              d="M4 6h12M8 6V4.5A1.5 1.5 0 0 1 9.5 3h1A1.5 1.5 0 0 1 12 4.5V6m-6.5 0 .6 9a1.5 1.5 0 0 0 1.496 1.4h3.808A1.5 1.5 0 0 0 14.9 15l.6-9"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
      {state && !state.ok && (
        <p className="mt-1 text-right text-[11px] text-burgundy">{state.error}</p>
      )}
    </form>
  );
}
