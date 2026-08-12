import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import { getSettings } from "@/lib/models/Setting";
import { requireAdmin } from "@/lib/adminAuth";
import { PRICE_FIELDS, SHIFT_TIME_FIELDS, pricingPayload } from "@/lib/pricing";

export const dynamic = "force-dynamic";

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

/** GET /api/admin/settings — booking package prices + shift timings */
export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    await dbConnect();
    const settings = await getSettings();
    return NextResponse.json(pricingPayload(settings));
  } catch (err) {
    console.error("GET /api/admin/settings failed:", (err as Error).message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** PUT /api/admin/settings — update prices + shift timings */
export async function PUT(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const body = await req.json();

    for (const key of PRICE_FIELDS) {
      const val = body[key];
      if (val !== undefined && (Number.isNaN(Number(val)) || Number(val) < 0)) {
        return NextResponse.json({ error: `Invalid price for ${key}` }, { status: 400 });
      }
    }
    for (const key of SHIFT_TIME_FIELDS) {
      const val = body[key];
      if (val !== undefined && !TIME_RE.test(val)) {
        return NextResponse.json(
          { error: `Invalid time for ${key} (use HH:MM)` },
          { status: 400 }
        );
      }
    }

    await dbConnect();
    const settings = await getSettings();
    for (const key of PRICE_FIELDS) {
      if (body[key] !== undefined) settings.set(key, Number(body[key]));
    }
    for (const key of SHIFT_TIME_FIELDS) {
      if (body[key] !== undefined) settings.set(key, body[key]);
    }
    await settings.save();

    return NextResponse.json(pricingPayload(settings));
  } catch (err) {
    console.error("PUT /api/admin/settings failed:", (err as Error).message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
