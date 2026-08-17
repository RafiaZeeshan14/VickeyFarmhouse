import type { Metadata } from "next";
import { Suspense } from "react";
import BookingClient from "./BookingClient";
import "../../styles/booking.css";

export const metadata: Metadata = {
  title: "Book Your Stay | Vicky Farmhouse",
  description:
    "Check availability and book a full day, day shift or night shift at Vicky Farmhouse.",
};

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="bk-page" />}>
      <BookingClient />
    </Suspense>
  );
}
