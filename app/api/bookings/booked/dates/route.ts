import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Booking from "@/lib/models/Booking";
import { toYMD } from "@/lib/format";

export const dynamic = "force-dynamic";

/**
 * GET /api/bookings/booked/dates — per-date slot occupancy
 * Response: { booked: [{ date: "YYYY-MM-DD", slots: ["day","night"] }] }
 */
export async function GET() {
  try {
    await dbConnect();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookings = await Booking.find(
      { status: { $in: ["approved", "pending"] }, checkOut: { $gte: today } },
      { checkIn: 1, checkOut: 1, bookingType: 1, shiftSlot: 1, _id: 0 }
    ).sort({ checkIn: 1 });

    const byDate = new Map<string, Set<string>>();
    for (const b of bookings) {
      const start = new Date(b.checkIn);
      const end = new Date(b.checkOut);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      if (b.bookingType === "shift") {
        const key = toYMD(start);
        if (!byDate.has(key)) byDate.set(key, new Set());
        byDate.get(key)!.add(b.shiftSlot || "day");
      } else {
        const d = new Date(start);
        while (d < end) {
          const key = toYMD(d);
          if (!byDate.has(key)) byDate.set(key, new Set());
          byDate.get(key)!.add("day");
          byDate.get(key)!.add("night");
          d.setDate(d.getDate() + 1);
        }
      }
    }

    return NextResponse.json({
      booked: Array.from(byDate.entries()).map(([date, slots]) => ({
        date,
        slots: Array.from(slots),
      })),
    });
  } catch (err) {
    console.error("GET /api/bookings/booked/dates failed:", (err as Error).message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
