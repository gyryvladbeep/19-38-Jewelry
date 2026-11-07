import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { fetchContentOverrideRows, applyContentOverrides } from "@/lib/content";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const baseMessages = (await import(`../../messages/${locale}.json`)).default;

  // Overlay any text saved through /admin (About, FAQ, Home, Shipping,
  // Returns, Privacy, Contact copy — see src/lib/content.ts) onto the
  // static translations. Falls back to baseMessages untouched when
  // Supabase isn't configured or has no saved overrides yet.
  const overrideRows = await fetchContentOverrideRows();
  const messages = applyContentOverrides(baseMessages, overrideRows, locale);

  return {
    locale,
    messages,
  };
});
