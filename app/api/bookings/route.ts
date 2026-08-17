import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Booking from "@/lib/models/Booking";
import { getSettings } from "@/lib/models/Setting";
import { sendBookingCreated } from "@/lib/whatsapp";
import { normalizePhone, isValidPakistaniPhone } from "@/lib/phone";
import { findClash } from "@/lib/availability";
import { applyNoAc, calcFulldayFee, calcShiftFee } from "@/lib/pricing";

export const dynamic = "force-dynamic";

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

/** POST /api/bookings — create a booking */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const {
      name,
      whatsapp,
      checkIn,
      checkOut,
      checkInTime,
      checkOutTime,
      guests,
      notes,
      bookingType,
      shiftSlot,
      withoutAc,
    } = await req.json();

    if (!name || !whatsapp || !checkIn || !guests) {
      return bad("Missing required fields");
    }

    const type = bookingType === "shift" ? "shift" : "fullday";
    const slot = type === "shift" ? (shiftSlot === "night" ? "night" : "day") : null;

    if (type === "fullday" && !checkOut) return bad("Missing required fields");

    if (
      (checkInTime && !TIME_RE.test(checkInTime)) ||
      (checkOutTime && !TIME_RE.test(checkOutTime))
    ) {
      return bad("Invalid time format (use HH:MM)");
    }

    const settings = await getSettings();

    const inDate = new Date(checkIn);
    // Shift is always exactly one date: occupy [date, date+1)
    const outDate =
      type === "shift"
        ? new Date(new Date(inDate).setDate(inDate.getDate() + 1))
        : new Date(checkOut);

    if (Number.isNaN(inDate.getTime()) || Number.isNaN(outDate.getTime())) {
      return bad("Invalid dates");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (inDate < today) return bad("Check-in cannot be in the past");
    if (outDate <= inDate) return bad("Check-out must be after check-in");

    const phone = normalizePhone(whatsapp);
    if (!isValidPakistaniPhone(phone)) {
      return bad("Invalid WhatsApp number (use e.g. 03001234567)");
    }

    const guestCount = Number(guests);
    if (!Number.isFinite(guestCount) || guestCount < 1) return bad("Invalid guest count");

    const clash = await findClash({
      checkIn: inDate,
      checkOut: outDate,
      bookingType: type,
      shiftSlot: slot,
    });
    if (clash) return bad("Selected dates are already booked", 409);

    // Server-side fee from admin-configured pricing, then the no-AC discount
    const noAc = withoutAc === true;
    const baseFee =
      type === "shift"
        ? calcShiftFee(settings, inDate, slot!)
        : calcFulldayFee(settings, inDate, outDate);
    const fee = applyNoAc(baseFee, noAc);

    // Shift timings come from settings; fullday keeps user/default times
    const times =
      type === "shift"
        ? slot === "night"
          ? {
              checkInTime: settings.nightShiftStart,
              checkOutTime: settings.nightShiftEnd,
            }
          : { checkInTime: settings.dayShiftStart, checkOutTime: settings.dayShiftEnd }
        : {
            checkInTime: checkInTime || "14:00",
            checkOutTime: checkOutTime || "12:00",
          };

    const booking = await Booking.create({
      name,
      whatsapp: phone,
      bookingType: type,
      shiftSlot: slot,
      checkIn: inDate,
      checkOut: outDate,
      ...times,
      guests: guestCount,
      notes: notes || "",
      withoutAc: noAc,
      fee,
    });

    // Fire and forget: a WhatsApp hiccup must not fail the booking
    sendBookingCreated(booking).catch((err) =>
      console.error("sendBookingCreated failed:", err.message)
    );

    return NextResponse.json(
      {
        bookingCode: booking.bookingCode,
        status: booking.status,
        bookingType: booking.bookingType,
        shiftSlot: booking.shiftSlot,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        checkInTime: booking.checkInTime,
        checkOutTime: booking.checkOutTime,
        guests: booking.guests,
        withoutAc: booking.withoutAc,
        fee: booking.fee,
        name: booking.name,
        createdAt: booking.createdAt,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/bookings failed:", (err as Error).message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
