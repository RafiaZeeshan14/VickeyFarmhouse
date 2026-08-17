"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import type { BookedDate } from "@/lib/api";
import type { ShiftSlot } from "@/lib/pricing";
import { displayDate, toYMD } from "@/lib/format";

const DOW = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export type PickerMode = "range" | "single";
export type PickerSlot = ShiftSlot | "any";

interface DateRangePickerProps {
  checkIn: string;
  checkOut?: string;
  onChange: (value: { checkIn: string; checkOut: string }) => void;
  booked?: BookedDate[];
  /** "range" (full day: needs BOTH slots free every night) | "single" (12h shift) */
  mode?: PickerMode;
  /** which slot must be free in single mode; "any" blocks only fully-booked days */
  slot?: PickerSlot;
  /** render the calendar always-open instead of behind an input */
  inline?: boolean;
  /** label shown above the input (single mode) */
  label?: string;
  /** allow selecting past dates (admin filters) */
  allowPast?: boolean;
  /** show booked/selection legend under the calendar */
  showLegend?: boolean;
  checkInLabel?: string;
  checkOutLabel?: string;
  className?: string;
}

export default function DateRangePicker({
  checkIn,
  checkOut = "",
  onChange,
  booked = [],
  mode = "range",
  slot = "day",
  inline = false,
  label = "Date",
  allowPast = false,
  showLegend = true,
  checkInLabel = "Check-in",
  checkOutLabel = "Check-out",
  className = "",
}: DateRangePickerProps) {
  const [open, setOpen] = useState<"in" | "out" | null>(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayYMD = toYMD(today);
  const [cursor, setCursor] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const inRef = useRef<HTMLDivElement>(null);
  const outRef = useRef<HTMLDivElement>(null);

  // date -> Set of occupied slots
  const bookedMap = useMemo(() => {
    const map = new Map<string, Set<string>>();
    booked.forEach((b) => map.set(b.date, new Set(b.slots || [])));
    return map;
  }, [booked]);

  const isBlocked = (day: string) => {
    const slots = bookedMap.get(day);
    if (!slots || slots.size === 0) return false;
    if (mode === "single") {
      // "any" = only fully-booked days blocked (both slots gone) — used on the
      // landing search where the visitor hasn't picked a booking type yet
      if (slot === "any") return slots.has("day") && slots.has("night");
      return slots.has(slot);
    }
    return true; // range/fullday needs the whole day free
  };

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const wrap = open === "in" ? inRef.current : outRef.current;
      if (wrap && !wrap.contains(e.target as Node)) setOpen(null);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  function openField(which: "in" | "out") {
    setOpen((o) => (o === which ? null : which));
    const base = which === "out" && checkIn ? checkIn : checkIn || todayYMD;
    const [y, m] = base.split("-").map(Number);
    setCursor(new Date(y, m - 1, 1));
  }

  function pick(day: string) {
    if (mode === "single") {
      onChange({ checkIn: day, checkOut: "" });
      setOpen(null);
      return;
    }
    if (open === "in" || !checkIn || day <= checkIn) {
      onChange({ checkIn: day, checkOut: checkOut && checkOut > day ? checkOut : "" });
      setOpen("out");
    } else {
      onChange({ checkIn, checkOut: day });
      setOpen(null);
    }
  }

  function dayState(day: string) {
    const isPast = !allowPast && day < todayYMD;
    const isBooked = isBlocked(day);
    let disabled = isPast || isBooked;
    if (mode === "range" && open === "out" && checkIn && day <= checkIn) {
      disabled = true;
    }
    const isEdge = day === checkIn || (mode === "range" && day === checkOut);
    const inRange =
      mode === "range" && !!checkIn && !!checkOut && day > checkIn && day < checkOut;
    return { disabled, isBooked, isEdge, inRange };
  }

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDisabled =
    !allowPast && year === today.getFullYear() && month === today.getMonth();

  const calendar = (
    <div className={`drp-pop ${inline ? "drp-pop-inline" : ""}`}>
      <div className="drp-head">
        <button
          type="button"
          className="drp-nav"
          disabled={prevDisabled}
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          aria-label="Previous month"
        >
          ‹
        </button>
        <strong>
          {MONTHS[month]} {year}
        </strong>
        <button
          type="button"
          className="drp-nav"
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          aria-label="Next month"
        >
          ›
        </button>
      </div>
      <div className="drp-grid">
        {DOW.map((d) => (
          <span className="drp-dow" key={d}>
            {d}
          </span>
        ))}
        {Array.from({ length: firstDow }).map((_, i) => (
          <span key={`e${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = toYMD(new Date(year, month, i + 1));
          const s = dayState(day);
          return (
            <button
              type="button"
              key={day}
              className={[
                "drp-day",
                s.isBooked ? "booked" : "",
                s.inRange ? "in-range" : "",
                s.isEdge ? "edge" : "",
              ].join(" ")}
              disabled={s.disabled}
              onClick={() => pick(day)}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      {showLegend ? (
        <div className="drp-legend">
          <span>
            <i className="drp-dot booked-dot" /> Booked
          </span>
          <span>
            <i className="drp-dot sel-dot" /> Your stay
          </span>
        </div>
      ) : null}
    </div>
  );

  if (inline) return calendar;

  if (mode === "single") {
    return (
      <div className={`drp-wrap ${className}`.trim()} ref={inRef}>
        <label>
          {label}
          <button type="button" className="drp-input" onClick={() => openField("in")}>
            {checkIn ? (
              displayDate(checkIn)
            ) : (
              <span className="drp-placeholder">Select date</span>
            )}
          </button>
        </label>
        {open === "in" && calendar}
      </div>
    );
  }

  return (
    <div className={`drp-range ${className}`.trim()}>
      <div className="drp-wrap" ref={inRef}>
        <label>
          {checkInLabel}
          <button type="button" className="drp-input" onClick={() => openField("in")}>
            {checkIn ? (
              displayDate(checkIn)
            ) : (
              <span className="drp-placeholder">Select date</span>
            )}
          </button>
        </label>
        {open === "in" && calendar}
      </div>
      <div className="drp-wrap" ref={outRef}>
        <label>
          {checkOutLabel}
          <button type="button" className="drp-input" onClick={() => openField("out")}>
            {checkOut ? (
              displayDate(checkOut)
            ) : (
              <span className="drp-placeholder">Select date</span>
            )}
          </button>
        </label>
        {open === "out" && calendar}
      </div>
    </div>
  );
}
