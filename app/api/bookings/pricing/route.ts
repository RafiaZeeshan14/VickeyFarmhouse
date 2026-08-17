import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { getSettings } from "@/lib/models/Setting";
import { pricingPayload } from "@/lib/pricing";

export const dynamic = "force-dynamic";

/** GET /api/bookings/pricing — public prices + shift timings */
export async function GET() {
  try {
    await dbConnect();
    const settings = await getSettings();
    return NextResponse.json(pricingPayload(settings));
  } catch (err) {
    console.error("GET /api/bookings/pricing failed:", (err as Error).message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
