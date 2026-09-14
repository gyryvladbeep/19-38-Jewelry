"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

export default function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="border border-line bg-surface p-6 text-sm text-ink">
        {t("formSuccess")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="contact-name" className="text-sm text-ink">
          {t("formName")}
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          className="mt-1 w-full border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-ink"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="text-sm text-ink">
          {t("formEmail")}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          className="mt-1 w-full border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-ink"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="text-sm text-ink">
          {t("formMessage")}
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          className="mt-1 w-full border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-ink"
        />
      </div>
      <Button type="submit" disabled={status === "sending"}>
        {t("formSubmit")}
      </Button>
      {status === "error" && (
        <p className="text-xs text-burgundy">Error. Please try again.</p>
      )}
    </form>
  );
}
