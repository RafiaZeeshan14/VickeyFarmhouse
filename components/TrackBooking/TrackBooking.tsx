"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getBooking, type Booking, type BookingStatus } from "@/lib/api";
import { formatTime12 } from "@/lib/format";

const STATUS_META: Record<
  BookingStatus,
  { label: string; sub: string; cls: string; emoji: string }
> = {
  pending: {
    label: "Waiting for Approval",
    sub: "Admin ko aapki request mil gayi hai — approval par WhatsApp aayega.",
    cls: "pending",
    emoji: "⏳",
  },
  approved: {
    label: "Booking Confirmed!",
    sub: "Location aur house rules aapke WhatsApp par bhej diye gaye hain.",
    cls: "approved",
    emoji: "✅",
  },
  rejected: {
    label: "Booking Rejected",
    sub: "Yeh dates available nahi thi — aap dusri dates try kar sakte hain.",
    cls: "rejected",
    emoji: "❌",
  },
  cancelled: {
    label: "Booking Cancelled",
    sub: "Yeh booking cancel ho chuki hai. Dobara book karne ke liye contact karein.",
    cls: "rejected",
    emoji: "⛔",
  },
};

const LEGEND = [
  { emoji: "⏳", title: "Pending", desc: "Waiting for admin approval" },
  { emoji: "✅", title: "Approved", desc: "Confirmed — location sent on WhatsApp" },
  { emoji: "❌", title: "Rejected", desc: "Dates unavailable, try new ones" },
  { emoji: "⛔", title: "Cancelled", desc: "Contact us to rebook" },
];

function typeLabel(b: Booking) {
  if ((b.bookingType || "fullday") !== "shift") return "Full Day";
  return b.shiftSlot === "night" ? "Night Shift (12h)" : "Day Shift (12h)";
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Day shift ends the SAME day (stored checkOut is exclusive date+1) */
function checkoutDate(b: Booking) {
  return b.bookingType === "shift" && b.shiftSlot !== "night" ? b.checkIn : b.checkOut;
}

function timelineSteps(status: BookingStatus) {
  switch (status) {
    case "pending":
      return [
        { title: "Request Received", state: "done" },
        { title: "Admin Approval", state: "current" },
        { title: "Your Stay", state: "todo" },
      ];
    case "approved":
      return [
        { title: "Request Received", state: "done" },
        { title: "Admin Approval", state: "done" },
        { title: "Your Stay", state: "current" },
      ];
    case "rejected":
      return [
        { title: "Request Received", state: "done" },
        { title: "Rejected", state: "failed" },
        { title: "Your Stay", state: "todo" },
      ];
    case "cancelled":
      return [
        { title: "Request Received", state: "done" },
        { title: "Admin Approval", state: "done" },
        { title: "Cancelled", state: "failed" },
      ];
    default:
      return [];
  }
}

export default function TrackBooking({ initialCode = "" }: { initialCode?: string }) {
  const [code, setCode] = useState(initialCode);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const lookup = useCallback(async (raw: string) => {
    const trimmed = (raw || "").trim();
    if (!trimmed) return;
    setError("");
    setBooking(null);
    setLoading(true);
    try {
      const data = await getBooking(trimmed.toUpperCase());
      setBooking(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not find that booking");
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch when opened via a tracking link (/track/FH-XXXXXX)
  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
      lookup(initialCode);
    }
  }, [initialCode, lookup]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    lookup(code);
  }

  const meta = booking ? STATUS_META[booking.status] : null;

  // ===== Result view =====
  if (booking && meta) {
    const steps = timelineSteps(booking.status);
    return (
      <div className="trk-card">
        <div className={`trk-hero ${meta.cls}`}>
          <span className="trk-hero-icon">{meta.emoji}</span>
          <h2>{meta.label}</h2>
          <p>{meta.sub}</p>
          <span className="trk-code">{booking.bookingCode}</span>
        </div>

        <div className="trk-timeline">
          {steps.map((s, i) => (
            <div className={`trk-step ${s.state}`} key={s.title + i}>
              <span className="trk-step-dot">
                {s.state === "done" ? "✓" : s.state === "failed" ? "✕" : i + 1}
              </span>
              <span className="trk-step-title">{s.title}</span>
              {i < steps.length - 1 && <span className="trk-step-line" />}
            </div>
          ))}
        </div>

        <div className="trk-details">
          <div className="trk-row">
            <span>👤 Name</span>
            <strong>{booking.name}</strong>
          </div>
          <div className="trk-row">
            <span>🏷️ Booking Type</span>
            <strong>{typeLabel(booking)}</strong>
          </div>
          <div className="trk-row">
            <span>📅 Check-in</span>
            <strong>
              {fmtDate(booking.checkIn)}
              {booking.checkInTime && ` · ${formatTime12(booking.checkInTime)}`}
            </strong>
          </div>
          <div className="trk-row">
            <span>📅 Check-out</span>
            <strong>
              {fmtDate(checkoutDate(booking))}
              {booking.checkOutTime && ` · ${formatTime12(booking.checkOutTime)}`}
            </strong>
          </div>
          <div className="trk-row">
            <span>👥 Guests</span>
            <strong>{booking.guests}</strong>
          </div>
        </div>

        <div className="trk-actions">
          {(booking.status === "rejected" || booking.status === "cancelled") && (
            <Link href="/booking" className="btn btn-primary">
              Try Different Dates
            </Link>
          )}
          <button
            className="btn"
            onClick={() => {
              setBooking(null);
              setCode("");
            }}
          >
            Check Another Booking
          </button>
        </div>
      </div>
    );
  }

  // ===== Search view =====
  return (
    <div className="trk-card">
      <div className="trk-search-head">
        <span className="trk-search-icon">🔎</span>
        <h2>Enter Your Booking ID</h2>
        <p>
          Booking ID aapko WhatsApp message mein mili hai (e.g. <strong>FH-2B00CE</strong>
          ). Enter karte hi latest status yahan aa jayega.
        </p>
      </div>

      <form className="trk-form" onSubmit={submit}>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="FH-XXXXXX"
        />
        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Checking..." : "Track"}
        </button>
      </form>

      {error && <div className="form-error">{error}</div>}

      <div className="track-legend">
        {LEGEND.map((l) => (
          <div className="track-legend-item" key={l.title}>
            <span className="track-legend-emoji">{l.emoji}</span>
            <strong>{l.title}</strong>
            <p>{l.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
