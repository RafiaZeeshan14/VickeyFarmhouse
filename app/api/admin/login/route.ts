import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_COOKIE,
  adminKey,
  clearThrottle,
  createSessionToken,
  loginThrottled,
  sessionCookieOptions,
} from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

/** POST /api/admin/login — exchange the admin key for an httpOnly session */
export async function POST(req: NextRequest) {
  if (!adminKey()) {
    return NextResponse.json(
      { error: "ADMIN_KEY is not configured on the server" },
      { status: 500 }
    );
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (loginThrottled(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429 }
    );
  }

  const { key } = await req.json().catch(() => ({ key: "" }));

  // Compare lengths first so the constant-time check below is meaningful
  if (typeof key !== "string" || key.length !== adminKey().length) {
    return NextResponse.json({ error: "Invalid key" }, { status: 401 });
  }
  let diff = 0;
  for (let i = 0; i < key.length; i++) diff |= key.charCodeAt(i) ^ adminKey().charCodeAt(i);
  if (diff !== 0) {
    return NextResponse.json({ error: "Invalid key" }, { status: 401 });
  }

  clearThrottle(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await createSessionToken(), sessionCookieOptions());
  return res;
}
