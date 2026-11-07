import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase";
import ProductForm from "../ProductForm";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  const configured = isSupabaseConfigured();

  if (!configured) {
    return (
      <div className="max-w-xl">
        <h1 className="text-2xl text-ink">Новый товар</h1>
        <p className="mt-4 text-sm text-muted">
          Supabase не настроен, поэтому новые товары пока нельзя сохранить. Настройте{" "}
          <code className="font-mono text-xs">SUPABASE_URL</code> и{" "}
          <code className="font-mono text-xs">SUPABASE_SERVICE_ROLE_KEY</code> — см.
          README.md.
        </p>
        <Link href="/admin/products" className="mt-6 inline-block text-sm underline underline-offset-4">
          ← Назад к товарам
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl text-ink">Новый товар</h1>
      <div className="mt-8">
        <ProductForm />
      </div>
    </div>
  );
}
