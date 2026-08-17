import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Booking from "@/lib/models/Booking";

export const dynamic = "force-dynamic";

/** GET /api/bookings/:code — public status lookup by booking code */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await dbConnect();
    const { code } = await params;

    const booking = await Booking.findOne({ bookingCode: code.toUpperCase() });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({
      bookingCode: booking.bookingCode,
      status: booking.status,
      bookingType: booking.bookingType || "fullday",
      shiftSlot: booking.shiftSlot,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      checkInTime: booking.checkInTime,
      checkOutTime: booking.checkOutTime,
      guests: booking.guests,
      withoutAc: booking.withoutAc,
      name: booking.name,
      createdAt: booking.createdAt,
    });
  } catch (err) {
    console.error("GET /api/bookings/[code] failed:", (err as Error).message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
