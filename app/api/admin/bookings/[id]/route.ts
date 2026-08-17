import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Booking from "@/lib/models/Booking";
import { requireAdmin } from "@/lib/adminAuth";
import { findClash } from "@/lib/availability";
import { normalizePhone, isValidPakistaniPhone } from "@/lib/phone";
import {
  sendBookingApproved,
  sendBookingCancelled,
  sendBookingRejected,
} from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

type Params = { params: Promise<{ id: string }> };

/** PATCH /api/admin/bookings/:id — approve | reject | cancel */
export async function PATCH(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    await dbConnect();
    const { id } = await params;
    const { action, adminNote, fee, amountPaid, notes } = await req.json();

    if (!["approve", "reject", "cancel"].includes(action)) {
      return bad("action must be approve, reject or cancel");
    }

    const booking = await Booking.findById(id);
    if (!booking) return bad("Booking not found", 404);

    if (action === "cancel") {
      if (booking.status !== "approved") {
        return bad(
          `Only approved bookings can be cancelled (current: ${booking.status})`,
          409
        );
      }
      booking.status = "cancelled";
      booking.adminNote = adminNote || "";
      await booking.save();
      sendBookingCancelled(booking).catch((e) =>
        console.error("sendBookingCancelled failed:", e.message)
      );
      return NextResponse.json(booking);
    }

    if (booking.status !== "pending") {
      return bad(`Booking already ${booking.status}`, 409);
    }

    if (action === "approve") {
      // Re-check overlap before approving (slot-aware)
      const clash = await findClash({
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        bookingType: booking.bookingType || "fullday",
        shiftSlot: booking.shiftSlot,
        excludeId: String(booking._id),
      });
      if (clash) return bad("Dates clash with an approved booking", 409);

      booking.status = "approved";
      if (fee !== undefined) booking.fee = Math.max(0, Number(fee) || 0);
      if (amountPaid !== undefined) {
        booking.amountPaid = Math.max(0, Number(amountPaid) || 0);
      }
      if (notes !== undefined) booking.notes = notes || "";
    } else {
      booking.status = "rejected";
    }

    booking.adminNote = adminNote || "";
    await booking.save();

    const notify =
      booking.status === "approved" ? sendBookingApproved : sendBookingRejected;
    notify(booking).catch((e) => console.error("WhatsApp notify failed:", e.message));

    return NextResponse.json(booking);
  } catch (err) {
    console.error("PATCH /api/admin/bookings/[id] failed:", (err as Error).message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** PUT /api/admin/bookings/:id — edit booking fields */
export async function PUT(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    await dbConnect();
    const { id } = await params;

    const booking = await Booking.findById(id);
    if (!booking) return bad("Booking not found", 404);

    const {
      name,
      whatsapp,
      checkIn,
      checkOut,
      checkInTime,
      checkOutTime,
      guests,
      notes,
      fee,
      amountPaid,
      bookingType,
      shiftSlot,
      withoutAc,
    } = await req.json();

    if (!name || !whatsapp || !checkIn || !checkOut || !guests) {
      return bad("Missing required fields");
    }
    if (
      (checkInTime && !TIME_RE.test(checkInTime)) ||
      (checkOutTime && !TIME_RE.test(checkOutTime))
    ) {
      return bad("Invalid time format (use HH:MM)");
    }

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    if (Number.isNaN(inDate.getTime()) || Number.isNaN(outDate.getTime())) {
      return bad("Invalid dates");
    }
    if (outDate <= inDate) return bad("Check-out must be after check-in");

    const phone = normalizePhone(whatsapp);
    if (!isValidPakistaniPhone(phone)) {
      return bad("Invalid WhatsApp number (use e.g. 03001234567)");
    }

    const newType =
      bookingType === "shift"
        ? "shift"
        : bookingType === "fullday"
          ? "fullday"
          : booking.bookingType || "fullday";
    const newSlot = newType === "shift" ? (shiftSlot === "night" ? "night" : "day") : null;

    if (booking.status === "approved") {
      const clash = await findClash({
        checkIn: inDate,
        checkOut: outDate,
        bookingType: newType,
        shiftSlot: newSlot,
        excludeId: String(booking._id),
      });
      if (clash) return bad("Dates clash with another approved booking", 409);
    }

    booking.name = name;
    booking.whatsapp = phone;
    booking.bookingType = newType;
    booking.shiftSlot = newSlot;
    booking.checkIn = inDate;
    booking.checkOut = outDate;
    if (checkInTime) booking.checkInTime = checkInTime;
    if (checkOutTime) booking.checkOutTime = checkOutTime;
    booking.guests = Number(guests);
    booking.notes = notes || "";
    if (withoutAc !== undefined) booking.withoutAc = withoutAc === true;
    if (fee !== undefined) booking.fee = Math.max(0, Number(fee) || 0);
    if (amountPaid !== undefined) booking.amountPaid = Math.max(0, Number(amountPaid) || 0);
    await booking.save();

    return NextResponse.json(booking);
  } catch (err) {
    console.error("PUT /api/admin/bookings/[id] failed:", (err as Error).message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** DELETE /api/admin/bookings/:id */
export async function DELETE(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    await dbConnect();
    const { id } = await params;
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) return bad("Booking not found", 404);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/admin/bookings/[id] failed:", (err as Error).message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
