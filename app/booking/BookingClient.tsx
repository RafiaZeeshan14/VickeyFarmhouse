"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import DateRangePicker from "@/components/DateRangePicker/DateRangePicker";
import StatusWidget, { saveBookingCode } from "@/components/StatusWidget/StatusWidget";
import {
  createBooking,
  getBookedDates,
  getPricing,
  type BookedDate,
  type Booking,
} from "@/lib/api";
import { addDaysYMD, displayDate, formatTime12, money } from "@/lib/format";
import {
  calcFulldayPrice,
  calcShiftPrice,
  fulldayDayRate,
  shiftTime,
  type Pricing,
  type ShiftSlot,
} from "@/lib/pricing";

type FilterType = "all" | "fullday" | "day" | "night";

/** Flat discount when the guest opts out of air conditioning. */
const NO_AC_DISCOUNT = 20000;

function daysInRange(checkIn: string, checkOut: string) {
  const days: string[] = [];
  if (!checkIn || !checkOut || checkOut <= checkIn) return days;
  let d = checkIn;
  while (d < checkOut) {
    days.push(d);
    d = addDaysYMD(d, 1);
  }
  return days;
}

const SHIFT_META: Record<ShiftSlot, { title: string; tagline: string; perks: string[] }> = {
  day: {
    title: "Day Shift",
    tagline: "12 hours, daytime",
    perks: ["Pool, lawns & BBQ", "Perfect for day trips", "Great for events"],
  },
  night: {
    title: "Night Shift",
    tagline: "12 hours, overnight",
    perks: ["Bonfire nights", "Stay till morning", "Cooler hours"],
  },
};

interface Option {
  key: string;
  kind: "fullday" | "shift";
  group: string;
  shiftSlot?: ShiftSlot;
  title: string;
  tagline: string;
  timing: string;
  dateText: string;
  slotDate: string;
  checkOut?: string;
  price: number;
  priceNote: string;
  available: boolean;
  perks: string[];
}

export default function BookingClient() {
  const params = useSearchParams();
  const initialDate = params.get("date") || "";
  const initialType = params.get("type");

  const [type, setType] = useState<FilterType>(
    initialType === "fullday" || initialType === "day" || initialType === "night"
      ? initialType
      : "all"
  );
  const [checkIn, setCheckIn] = useState(initialDate);
  const [checkOut, setCheckOut] = useState(initialDate ? addDaysYMD(initialDate, 1) : "");
  const [booked, setBooked] = useState<BookedDate[]>([]);
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [loading, setLoading] = useState(true);

  // Details modal + submit state
  const [bookingChoice, setBookingChoice] = useState<string | null>(null);
  const [noAc, setNoAc] = useState<Record<string, boolean>>({});
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [form, setForm] = useState({ name: "", whatsapp: "", guests: "2" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState<Booking | null>(null);

  async function loadAvailability() {
    setLoading(true);
    const [b, p] = await Promise.allSettled([getBookedDates(), getPricing()]);
    // Prices fall back to the packaged defaults when the API is unreachable, so
    // the page still shows correct rates.
    if (b.status === "fulfilled") setBooked(b.value.booked || []);
    if (p.status === "fulfilled") setPricing(p.value);
    setLoading(false);
  }

  useEffect(() => {
    loadAvailability();
  }, []);

  const bookedMap = useMemo(() => {
    const map = new Map<string, Set<string>>();
    booked.forEach((b) => map.set(b.date, new Set(b.slots || [])));
    return map;
  }, [booked]);

  const slotsOn = (date: string) => bookedMap.get(date) || new Set<string>();

  /** Full day needs BOTH day and night slots free on every night in the range. */
  function fulldayFree(inYMD: string, outYMD: string) {
    if (!inYMD || !outYMD || outYMD <= inYMD) return false;
    let d = inYMD;
    while (d < outYMD) {
      const taken = slotsOn(d);
      if (taken.has("day") || taken.has("night")) return false;
      d = addDaysYMD(d, 1);
    }
    return true;
  }

  const dayFulldayFree = (date: string) => fulldayFree(date, addDaysYMD(date, 1));
  const shiftFree = (date: string, slot: ShiftSlot) => !slotsOn(date).has(slot);

  function availabilityLabel(option: Option) {
    if (option.available) return "✓ Available";
    if (option.kind === "fullday" && option.group === "range") {
      return "✕ Not available for this range";
    }
    const taken = slotsOn(option.slotDate);
    const bothTaken = taken.has("day") && taken.has("night");
    if (option.kind === "fullday") {
      if (bothTaken) return "✕ Full day booked";
      if (taken.has("day") || taken.has("night")) return "✕ Shift already booked";
      return "✕ Not available";
    }
    if (bothTaken) return "✕ Full day booked";
    return "✕ Already booked";
  }

  const nights =
    checkIn && checkOut && checkOut > checkIn
      ? Math.round(
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000
        )
      : 0;

  const rangeDays = useMemo(
    () =>
      checkOut && checkOut > checkIn
        ? daysInRange(checkIn, checkOut)
        : checkIn
          ? [checkIn]
          : [],
    [checkIn, checkOut]
  );

  const optionList = useMemo<Option[]>(() => {
    if (!checkIn || rangeDays.length === 0) return [];

    const list: Option[] = [];
    const showFullday = type === "all" || type === "fullday";
    const shiftSlots: ShiftSlot[] =
      type === "all" ? ["day", "night"] : type === "day" ? ["day"] : type === "night" ? ["night"] : [];

    if (showFullday && nights > 0 && fulldayFree(checkIn, checkOut)) {
      list.push({
        key: "fullday:range",
        kind: "fullday",
        group: "range",
        title: "Full Day",
        tagline: "Whole property for your entire stay",
        timing: "Check-in 2:00 PM · Check-out 12:00 PM",
        dateText: `${displayDate(checkIn)} → ${displayDate(checkOut)} (${nights} ${nights === 1 ? "day" : "days"})`,
        slotDate: checkIn,
        checkOut,
        price: calcFulldayPrice(pricing, checkIn, checkOut),
        priceNote: `${nights} ${nights === 1 ? "night" : "nights"} · weekend/weekday rates apply`,
        available: true,
        perks: ["Both day & night slots", "All facilities included", "Overnight stay"],
      });
    }

    for (const date of rangeDays) {
      if (showFullday && dayFulldayFree(date)) {
        list.push({
          key: `fullday:${date}`,
          kind: "fullday",
          group: date,
          title: "Full Day",
          tagline: "Single day, whole property",
          timing: "Check-in 2:00 PM · Check-out 12:00 PM",
          dateText: displayDate(date),
          slotDate: date,
          checkOut: addDaysYMD(date, 1),
          price: fulldayDayRate(pricing, date),
          priceNote: "24 hrs · whole property",
          available: true,
          perks: ["Both day & night slots", "All facilities included", "Overnight stay"],
        });
      }

      for (const slot of shiftSlots) {
        const meta = SHIFT_META[slot];
        list.push({
          key: `${slot}:${date}`,
          kind: "shift",
          group: date,
          shiftSlot: slot,
          title: meta.title,
          tagline: meta.tagline,
          timing:
            slot === "day"
              ? `${formatTime12(shiftTime(pricing, "dayShiftStart"))} – ${formatTime12(shiftTime(pricing, "dayShiftEnd"))}`
              : `${formatTime12(shiftTime(pricing, "nightShiftStart"))} – ${formatTime12(shiftTime(pricing, "nightShiftEnd"))} (next morning)`,
          dateText: displayDate(date),
          slotDate: date,
          price: calcShiftPrice(pricing, date, slot),
          priceNote: slot === "day" ? "12 hrs · day shift" : "12 hrs · night shift",
          available: shiftFree(date, slot),
          perks: meta.perks,
        });
      }
    }

    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIn, checkOut, nights, rangeDays, type, bookedMap, pricing]);

  function switchType(newType: FilterType) {
    setType(newType);
    setSuccess(null);
    if (checkIn && (!checkOut || checkOut <= checkIn)) {
      setCheckOut(addDaysYMD(checkIn, 1));
    }
  }

  const chosen = bookingChoice ? optionList.find((o) => o.key === bookingChoice) : null;

  const isNoAc = (key: string) => !!noAc[key];
  const finalPrice = (o: Option) =>
    Math.max(0, o.price - (isNoAc(o.key) ? NO_AC_DISCOUNT : 0));

  async function submitDetails(e: React.FormEvent) {
    e.preventDefault();
    if (!chosen) return;
    setSubmitError("");
    setSubmitting(true);
    try {
      const base = {
        name: form.name,
        whatsapp: form.whatsapp,
        guests: form.guests,
        withoutAc: isNoAc(chosen.key),
      };
      const payload =
        chosen.kind === "fullday"
          ? {
              ...base,
              bookingType: "fullday" as const,
              checkIn: chosen.slotDate,
              checkOut: chosen.checkOut || addDaysYMD(chosen.slotDate, 1),
            }
          : {
              ...base,
              bookingType: "shift" as const,
              shiftSlot: chosen.shiftSlot!,
              checkIn: chosen.slotDate,
            };
      const data = await createBooking(payload);
      saveBookingCode(data.bookingCode);
      setSuccess(data);
      setDetailsOpen(false);
      loadAvailability();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bk-page">
      <div className="bk-banner">
        <Header hrefBase="/" activeLabel="" actions={<StatusWidget />} />
        <div className="bk-banner-inner">
          <p className="bk-eyebrow">Book Your Stay</p>
          <h1>
            Choose Your <span>Slot</span>
          </h1>
          <p>
            Pick your dates, compare every available slot and confirm in under a minute.
          </p>
        </div>
      </div>

      <main className="bk-main">
        <form
          className="bk-filters"
          onSubmit={(e) => {
            e.preventDefault();
            setSuccess(null);
            loadAvailability();
          }}
        >
          <label>
            Booking Type
            <select
              value={type}
              onChange={(e) => switchType(e.target.value as FilterType)}
            >
              <option value="all">All booking types</option>
              <option value="fullday">Full Day only</option>
              <option value="day">Day Shift (12h)</option>
              <option value="night">Night Shift (12h)</option>
            </select>
          </label>
          <DateRangePicker
            checkIn={checkIn}
            checkOut={checkOut}
            booked={booked}
            mode="range"
            slot={type === "day" ? "day" : type === "night" ? "night" : "any"}
            onChange={({ checkIn: ci, checkOut: co }) => {
              setCheckIn(ci);
              setCheckOut(co);
              setSuccess(null);
            }}
          />
          <button className="btn btn-primary" type="submit">
            Update
          </button>
        </form>

        {success ? (
          <div className="bk-success">
            <span className="bk-success-icon">✅</span>
            <h2>Booking Request Received!</h2>
            <p>
              Your booking ID is <strong>{success.bookingCode}</strong>. Details and your
              tracking link have been sent to your WhatsApp. Admin approval ke baad
              location bhi WhatsApp pe milegi.
            </p>
            <div className="bk-success-actions">
              <Link href={`/track/${success.bookingCode}`} className="btn btn-primary">
                Track Your Booking
              </Link>
              <button className="btn" onClick={() => setSuccess(null)}>
                Book Another Slot
              </button>
            </div>
          </div>
        ) : !checkIn || !checkOut || checkOut <= checkIn ? (
          <div className="bk-empty">
            <span>📅</span>
            <p>
              Select check-in and check-out dates above to see all available slots and
              prices.
            </p>
          </div>
        ) : loading ? (
          <div className="bk-empty">
            <p>Checking availability...</p>
          </div>
        ) : (
          <div className="bk-list">
            {optionList.length === 0 ? (
              <div className="bk-empty">
                <p>No booking options for this date range. Try different dates.</p>
              </div>
            ) : (
              optionList.map((o, index) => {
                const prev = optionList[index - 1];
                const showDateHead =
                  o.group !== "range" &&
                  (!prev || prev.group === "range" || prev.group !== o.group);

                return (
                  <div key={o.key} className="bk-option-wrap">
                    {showDateHead && (
                      <h3 className="bk-date-head">{displayDate(o.slotDate)}</h3>
                    )}
                    {o.group === "range" && (
                      <h3 className="bk-date-head bk-date-head-range">
                        Full stay · selected dates
                      </h3>
                    )}
                    <div className={`bk-card ${o.available ? "" : "unavailable"}`}>
                      <div className="bk-card-main">
                        <div className="bk-card-head">
                          <h2>{o.title}</h2>
                          <span className={`bk-avail ${o.available ? "yes" : "no"}`}>
                            {availabilityLabel(o)}
                          </span>
                        </div>
                        <p className="bk-tagline">{o.tagline}</p>
                        <p className="bk-meta">
                          <strong>{o.dateText}</strong>
                        </p>
                        <div className="bk-timing-row">
                          <p className="bk-timing">{o.timing}</p>
                          <label className={`bk-ac ${isNoAc(o.key) ? "on" : ""}`}>
                            <input
                              type="checkbox"
                              checked={isNoAc(o.key)}
                              disabled={!o.available}
                              onChange={(e) =>
                                setNoAc((prev) => ({
                                  ...prev,
                                  [o.key]: e.target.checked,
                                }))
                              }
                            />
                            Without AC — save <em>{money(NO_AC_DISCOUNT)}</em>
                          </label>
                        </div>
                        <ul className="bk-perks">
                          {o.perks.map((p) => (
                            <li key={`${o.key}-${p}`}>{p}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bk-card-side">
                        <div className="bk-price">
                          {isNoAc(o.key) && <del>{money(o.price)}</del>}
                          <strong>{money(finalPrice(o))}</strong>
                          <span>
                            {o.priceNote}
                            {isNoAc(o.key) ? " · without AC" : ""}
                          </span>
                        </div>
                        <button
                          className="btn btn-primary"
                          disabled={!o.available}
                          onClick={() => {
                            setBookingChoice(o.key);
                            setSubmitError("");
                            setDetailsOpen(true);
                          }}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>

      {detailsOpen && chosen && (
        <div
          className="modal-backdrop"
          onClick={() => !submitting && setDetailsOpen(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Almost there!</h3>
            <p className="hint" style={{ marginTop: 0, marginBottom: 14 }}>
              {chosen.title} · {chosen.dateText} · {money(finalPrice(chosen))}
              {isNoAc(chosen.key) ? " (without AC)" : ""}
            </p>
            {submitError && <div className="form-error">{submitError}</div>}
            <form onSubmit={submitDetails}>
              <div className="grid-2">
                <label>
                  Full Name
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ahmed Khan"
                  />
                </label>
                <label>
                  WhatsApp Number
                  <input
                    required
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    placeholder="03001234567"
                    inputMode="tel"
                  />
                </label>
              </div>
              <label className="modal-field">
                Total Guests
                <input
                  required
                  type="number"
                  min="1"
                  max="50"
                  value={form.guests}
                  onChange={(e) => setForm({ ...form, guests: e.target.value })}
                />
              </label>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn"
                  disabled={submitting}
                  onClick={() => setDetailsOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Booking..." : `Confirm — ${money(finalPrice(chosen))}`}
                </button>
              </div>
              <p className="hint modal-hint">
                Booking ID aur tracking link aapke WhatsApp pe turant aa jayega.
              </p>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
