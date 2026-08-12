import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

/** GET /api/admin/session — lets the admin UI know whether it is still signed in */
export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  return NextResponse.json({ authed: await verifySessionToken(token) });
}
