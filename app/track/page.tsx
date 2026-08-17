import type { Metadata } from "next";
import TrackShell from "@/components/TrackBooking/TrackShell";
import "../../styles/booking.css";

export const metadata: Metadata = {
  title: "Track Your Booking | Vicky Farmhouse",
  description: "Check the latest status of your Vicky Farmhouse booking request.",
};

export default function TrackPage() {
  return <TrackShell />;
}
