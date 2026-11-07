"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Не удалось войти.");
        setLoading(false);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Не удалось войти. Проверьте соединение.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-line bg-surface p-8"
      >
        <h1 className="text-xl text-ink">19:38 Jewelry</h1>
        <p className="mt-1 text-sm text-muted">Вход в панель управления</p>

        <label htmlFor="admin-password" className="mt-6 block text-sm text-ink">
          Пароль
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          required
          className="mt-1 w-full border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink"
        />

        {error && <p className="mt-3 text-sm text-burgundy">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-ink px-4 py-2.5 text-xs uppercase tracking-[0.14em] text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Входим…" : "Войти"}
        </button>
      </form>
    </div>
  );
}
