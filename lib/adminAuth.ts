import { NextResponse, type NextRequest } from "next/server";

export const ADMIN_COOKIE = "vf_admin";
const SESSION_SECONDS = 60 * 60 * 8; // 8 hours

/**
 * Session token is `<expiry>.<hmac>`, signed with ADMIN_KEY. The key itself
 * never leaves the server — the browser only ever holds a signature it cannot
 * forge, and the cookie is httpOnly so page scripts cannot read it either.
 *
 * Uses Web Crypto so the same code runs in both the Node and Edge runtimes.
 */
function bytesToHex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(payload: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return bytesToHex(sig);
}

/** Constant-time compare so a wrong guess leaks no timing information. */
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function adminKey() {
  return process.env.ADMIN_KEY || "";
}

export async function createSessionToken() {
  const exp = String(Date.now() + SESSION_SECONDS * 1000);
  return `${exp}.${await sign(exp, adminKey())}`;
}

export async function verifySessionToken(token?: string | null) {
  if (!token || !adminKey()) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  if (Number(exp) < Date.now()) return false;
  return safeEqual(sig, await sign(exp, adminKey()));
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_SECONDS,
  };
}

/** Returns a 401 response when the caller is not an authenticated admin. */
export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  if (!adminKey()) {
    return NextResponse.json(
      { error: "ADMIN_KEY is not configured on the server" },
      { status: 500 }
    );
  }
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  if (await verifySessionToken(token)) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/**
 * Best-effort login throttle. Serverless instances each keep their own map, so
 * this slows down guessing without being a hard guarantee.
 */
const attempts = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

export function loginThrottled(ip: string) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now - entry.first > WINDOW_MS) {
    attempts.set(ip, { count: 1, first: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export function clearThrottle(ip: string) {
  attempts.delete(ip);
}
