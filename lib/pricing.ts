import { addDaysYMD } from "./format";

/**
 * Mirrors the server's pricing rules. These defaults match the six packages
 * shown in the Pricing section, so every price stays correct even when the
 * booking API is unreachable.
 */
export const PRICE_DEFAULTS = {
  weekend24Hrs: 150000,
  nonWeekend24Hrs: 100000,
  weekend12Hrs: 120000,
  weekend12HrsDay: 100000,
  nonWeekend12HrsDay: 65000,
  nonWeekend40Person12Hrs: 75000,
} as const;

export type PriceKey = keyof typeof PRICE_DEFAULTS;

export interface Pricing extends Partial<Record<PriceKey, number>> {
  dayShiftStart?: string;
  dayShiftEnd?: string;
  nightShiftStart?: string;
  nightShiftEnd?: string;
}

export const SHIFT_TIME_DEFAULTS = {
  dayShiftStart: "08:00",
  dayShiftEnd: "20:00",
  nightShiftStart: "20:00",
  nightShiftEnd: "08:00",
} as const;

export type ShiftSlot = "day" | "night";

/** Flat discount when the guest opts out of air conditioning. Shared by the
 *  booking UI and the server so the quoted fee always matches. */
export const NO_AC_DISCOUNT = 20000;

export const applyNoAc = (fee: number, withoutAc?: boolean) =>
  withoutAc ? Math.max(0, fee - NO_AC_DISCOUNT) : fee;

/** Sat–Sun treated as weekend. */
export function isWeekend(dateYMD: string): boolean {
  const [y, m, d] = dateYMD.split("-").map(Number);
  const day = new Date(y, m - 1, d).getDay();
  return day === 6 || day === 0;
}

export function priceValue(pricing: Pricing | null, key: PriceKey): number {
  const val = pricing?.[key];
  return val != null && !Number.isNaN(Number(val)) ? Number(val) : PRICE_DEFAULTS[key];
}

export function shiftTime(
  pricing: Pricing | null,
  key: keyof typeof SHIFT_TIME_DEFAULTS
): string {
  return pricing?.[key] || SHIFT_TIME_DEFAULTS[key];
}

export function calcShiftPrice(
  pricing: Pricing | null,
  dateYMD: string,
  slot: ShiftSlot
): number {
  const weekend = isWeekend(dateYMD);
  if (slot === "day") {
    return weekend
      ? priceValue(pricing, "weekend12HrsDay")
      : priceValue(pricing, "nonWeekend12HrsDay");
  }
  return weekend
    ? priceValue(pricing, "weekend12Hrs")
    : priceValue(pricing, "nonWeekend40Person12Hrs");
}

export function calcFulldayPrice(
  pricing: Pricing | null,
  checkInYMD: string,
  checkOutYMD: string
): number {
  let total = 0;
  let d = checkInYMD;
  while (d < checkOutYMD) {
    total += isWeekend(d)
      ? priceValue(pricing, "weekend24Hrs")
      : priceValue(pricing, "nonWeekend24Hrs");
    d = addDaysYMD(d, 1);
  }
  return (
    total ||
    priceValue(pricing, isWeekend(checkInYMD) ? "weekend24Hrs" : "nonWeekend24Hrs")
  );
}

export function fulldayDayRate(pricing: Pricing | null, dateYMD: string): number {
  return isWeekend(dateYMD)
    ? priceValue(pricing, "weekend24Hrs")
    : priceValue(pricing, "nonWeekend24Hrs");
}

/* ===== Server-side helpers (work with Date objects and the Setting doc) ===== */

export const PRICE_FIELDS = Object.keys(PRICE_DEFAULTS) as PriceKey[];
export const SHIFT_TIME_FIELDS = Object.keys(
  SHIFT_TIME_DEFAULTS
) as Array<keyof typeof SHIFT_TIME_DEFAULTS>;

/** Sat–Sun treated as weekend. */
export function isWeekendDate(date: Date): boolean {
  const day = date.getDay();
  return day === 6 || day === 0;
}

export function calcShiftFee(
  settings: Pricing | null,
  date: Date,
  slot: ShiftSlot
): number {
  const weekend = isWeekendDate(date);
  if (slot === "day") {
    return weekend
      ? priceValue(settings, "weekend12HrsDay")
      : priceValue(settings, "nonWeekend12HrsDay");
  }
  return weekend
    ? priceValue(settings, "weekend12Hrs")
    : priceValue(settings, "nonWeekend40Person12Hrs");
}

export function calcFulldayFee(
  settings: Pricing | null,
  checkIn: Date,
  checkOut: Date
): number {
  let total = 0;
  const d = new Date(checkIn);
  d.setHours(0, 0, 0, 0);
  const end = new Date(checkOut);
  end.setHours(0, 0, 0, 0);
  while (d < end) {
    total += isWeekendDate(d)
      ? priceValue(settings, "weekend24Hrs")
      : priceValue(settings, "nonWeekend24Hrs");
    d.setDate(d.getDate() + 1);
  }
  return (
    total ||
    priceValue(settings, isWeekendDate(checkIn) ? "weekend24Hrs" : "nonWeekend24Hrs")
  );
}

/** Public shape returned by GET /api/bookings/pricing. */
export function pricingPayload(settings: Pricing | null): Required<Pricing> {
  const out = {} as Record<string, number | string>;
  for (const key of PRICE_FIELDS) out[key] = priceValue(settings, key);
  for (const key of SHIFT_TIME_FIELDS) out[key] = shiftTime(settings, key);
  return out as Required<Pricing>;
}
