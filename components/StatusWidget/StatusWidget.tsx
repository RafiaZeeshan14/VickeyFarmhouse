"use client";

import { useEffect, useState, useCallback } from "react";
import { getBooking, type Booking, type BookingStatus } from "@/lib/api";
import { formatTime12 } from "@/lib/format";

const STORAGE_KEY = "fh_booking_code";
const POLL_MS = 15000;

const STATUS_META: Record<BookingStatus, { label: string; cls: string; emoji: string }> = {
  pending: { label: "Waiting for approval", cls: "pending", emoji: "⏳" },
  approved: { label: "Booking confirmed!", cls: "approved", emoji: "✅" },
  rejected: { label: "Booking rejected", cls: "rejected", emoji: "❌" },
  cancelled: { label: "Booking cancelled", cls: "rejected", emoji: "⛔" },
};

export default function StatusWidget({ refreshSignal = 0 }: { refreshSignal?: number }) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const code = localStorage.getItem(STORAGE_KEY);
    if (!code) {
      setBooking(null);
      return;
    }
    try {
      const data = await getBooking(code);
      setBooking(data);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load booking");
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, [load, refreshSignal]);

  // Open the panel automatically right after a new booking
  useEffect(() => {
    if (refreshSignal > 0) setOpen(true);
  }, [refreshSignal]);

  if (!booking && !error) return null;

  const meta = booking ? STATUS_META[booking.status] : null;

  return (
    <div className="status-widget">
      <button
        className={`status-pill ${meta ? meta.cls : ""}`}
        onClick={() => setOpen(!open)}
      >
        {meta ? `${meta.emoji} My Booking` : "My Booking"}
      </button>
      {open && (
        <div className="status-panel">
          {booking && meta ? (
            <>
              <div className={`status-banner ${meta.cls}`}>
                {meta.emoji} {meta.label}
              </div>
              <p>
                <strong>ID:</strong> {booking.bookingCode}
              </p>
              <p>
                <strong>Name:</strong> {booking.name}
              </p>
              <p>
                <strong>Dates:</strong>{" "}
                {new Date(booking.checkIn).toLocaleDateString()}
                {booking.checkInTime && ` ${formatTime12(booking.checkInTime)}`} to{" "}
                {new Date(
                  booking.bookingType === "shift" && booking.shiftSlot !== "night"
                    ? booking.checkIn
                    : booking.checkOut
                ).toLocaleDateString()}
                {booking.checkOutTime && ` ${formatTime12(booking.checkOutTime)}`}
              </p>
              <p>
                <strong>Guests:</strong> {booking.guests}
              </p>
              {booking.status === "pending" && (
                <p className="hint">We will notify you on WhatsApp once approved.</p>
              )}
              {booking.status === "approved" && (
                <p className="hint">
                  Location and instructions were sent to your WhatsApp.
                </p>
              )}
              <button
                className="link-btn"
                onClick={() => {
                  localStorage.removeItem(STORAGE_KEY);
                  setBooking(null);
                  setOpen(false);
                }}
              >
                Dismiss
              </button>
            </>
          ) : (
            <p className="hint">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}

export function saveBookingCode(code: string) {
  localStorage.setItem(STORAGE_KEY, code);
}
