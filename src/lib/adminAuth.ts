/**
 * Minimal signed-cookie session for the /admin panel.
 *
 * There's a single shared password (ADMIN_PASSWORD) rather than per-user
 * accounts — this is a small single-admin site, not a multi-user system.
 * On successful login we set a cookie whose value is `${expiry}.${signature}`,
 * where signature = HMAC-SHA256(expiry, ADMIN_SESSION_SECRET). Verifying
 * the cookie only needs the secret, not a database lookup, which is what
 * lets src/proxy.ts check it on the Edge runtime for every /admin request.
 *
 * Uses the Web Crypto API (crypto.subtle) rather than Node's `crypto`
 * module so the same code runs in both the Edge runtime (proxy.ts) and
 * the Node runtime (the login Route Handler) — see
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md.
 */

export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not set. Add it to your environment — see .env.example."
    );
  }
  return secret;
}

async function hmac(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionCookieValue(): Promise<string> {
  const expires = Date.now() + SESSION_TTL_MS;
  const signature = await hmac(String(expires), getSecret());
  return `${expires}.${signature}`;
}

export async function isValidSessionCookieValue(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  const [expiresRaw, signature] = value.split(".");
  const expires = Number(expiresRaw);
  if (!expiresRaw || !signature || Number.isNaN(expires)) return false;
  if (Date.now() > expires) return false;
  const expected = await hmac(expiresRaw, getSecret());
  return expected === signature;
}

export const SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;
