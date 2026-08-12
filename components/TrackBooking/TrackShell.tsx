import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TrackBooking from "./TrackBooking";

export default function TrackShell({ code = "" }: { code?: string }) {
  return (
    <div className="bk-page">
      <div className="bk-banner">
        <Header hrefBase="/" activeLabel="" />
        <div className="bk-banner-inner">
          <p className="bk-eyebrow">Booking Status</p>
          <h1>
            Track Your <span>Booking</span>
          </h1>
          <p>Enter your booking ID to see the latest status of your request.</p>
        </div>
      </div>

      <main className="track-main">
        <TrackBooking initialCode={code} />
      </main>

      <Footer />
    </div>
  );
}
