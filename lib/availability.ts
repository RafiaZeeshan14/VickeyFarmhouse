import Booking from "./models/Booking";
import type { ShiftSlot } from "./pricing";

/** Mongoose's FilterQuery export moved between major versions, so the query is
 *  built as a plain object and cast once at the call site. */
type BookingFilter = Record<string, unknown>;

/**
 * Slot-aware clash check against approved/pending bookings.
 *
 * Rules:
 *  - fullday occupies BOTH slots of every date in [checkIn, checkOut)
 *  - shift occupies ONE slot (day|night) of its single date
 *  - legacy bookings without bookingType count as fullday
 *
 * So a candidate clashes with an overlapping booking when:
 *  - the candidate is fullday (needs both slots free), OR
 *  - the existing booking is fullday, OR
 *  - both are shifts on the same slot
 */
export function findClash({
  checkIn,
  checkOut,
  bookingType,
  shiftSlot,
  excludeId,
}: {
  checkIn: Date;
  checkOut: Date;
  bookingType?: string;
  shiftSlot?: ShiftSlot | null;
  excludeId?: string;
}) {
  const filter: BookingFilter = {
    status: { $in: ["approved", "pending"] },
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  };
  if (excludeId) filter._id = { $ne: excludeId };
  if (bookingType === "shift") {
    filter.$or = [
      { bookingType: { $ne: "shift" } }, // fullday or legacy
      { shiftSlot: shiftSlot }, // same slot shift
    ];
  }
  return Booking.findOne(filter as unknown as Parameters<typeof Booking.findOne>[0]);
}

export function daysBetween(inDate: Date, outDate: Date) {
  return Math.max(1, Math.round((outDate.getTime() - inDate.getTime()) / 86400000));
}
