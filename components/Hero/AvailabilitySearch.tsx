"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { CalendarSearch, ShieldCheck } from "lucide-react";
import DateRangePicker from "../DateRangePicker/DateRangePicker";
import { getBookedDates, type BookedDate } from "@/lib/api";

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: easeOutExpo, delay: 0.2 },
  },
};

export default function AvailabilitySearch() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [date, setDate] = useState("");
  const [booked, setBooked] = useState<BookedDate[]>([]);
  const [error, setError] = useState("");

  // Availability is a nice-to-have here: if the booking service is unreachable
  // the calendar simply shows every upcoming date as selectable.
  useEffect(() => {
    getBookedDates()
      .then((data) => setBooked(data.booked || []))
      .catch(() => {});
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!date) {
      setError("Please select a date first");
      return;
    }
    router.push(`/booking?date=${date}`);
  }

  return (
    <motion.form
      onSubmit={submit}
      className="hero-search w-full max-w-[420px] rounded-[26px] border border-white/70 bg-white/60 p-5 shadow-[0_22px_54px_rgba(6,35,58,.18),inset_0_1px_0_rgba(255,255,255,.9)] ring-1 ring-white/40 backdrop-blur-[18px] sm:p-6"
      variants={cardReveal}
      initial={shouldReduceMotion ? false : "hidden"}
      animate={shouldReduceMotion ? undefined : "show"}
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#e6a334] text-[#06233a] shadow-[0_10px_22px_rgba(230,163,52,.35)]">
          <CalendarSearch className="h-5 w-5" strokeWidth={2.4} aria-hidden="true" />
        </span>
        <div>
          <p className="text-[15px] font-black uppercase leading-tight text-[#06233a]">
            Check Availability
          </p>
          <p className="text-[11px] font-semibold text-[#5a6670]">
            Live slots &amp; instant booking
          </p>
        </div>
      </div>

      <DateRangePicker
        checkIn={date}
        mode="single"
        slot="any"
        booked={booked}
        onChange={({ checkIn }) => {
          setDate(checkIn);
          setError("");
        }}
      />

      {error ? (
        <p className="mt-3 rounded-xl bg-[#fee2e2] px-3 py-2 text-[12px] font-semibold text-[#b91c1c]">
          {error}
        </p>
      ) : null}

      <motion.button
        type="submit"
        className="mt-5 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#06233a] px-6 text-[13px] font-bold uppercase tracking-wide text-white shadow-[0_14px_30px_rgba(6,35,58,.28)] transition-colors hover:bg-[#e6a334] hover:text-[#06233a]"
        whileHover={shouldReduceMotion ? undefined : { y: -2 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
      >
        Check Availability
        <span aria-hidden="true">&gt;</span>
      </motion.button>

      <p className="mt-4 flex items-center justify-center gap-2 text-[11px] font-semibold text-[#5a6670]">
        <ShieldCheck className="h-4 w-4 text-[#3f8f51]" strokeWidth={2.4} aria-hidden="true" />
        No signup needed &middot; WhatsApp confirmation
      </p>
    </motion.form>
  );
}
