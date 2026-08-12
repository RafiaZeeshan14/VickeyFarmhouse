import About from "@/components/About/About";
import Facilities from "@/components/Facilities/Facilities";
import Footer from "@/components/Footer/Footer";
import Gallery from "@/components/Gallery/Gallery";
import Hero from "@/components/Hero/Hero";
import Location from "@/components/Location/Location";
import Pricing from "@/components/Pricing/Pricing";
import ScrollToTop from "@/components/ScrollToTop/ScrollToTop";
import Terms from "@/components/Terms/Terms";
import VideoSection from "@/components/VideoSection/VideoSection";
import dbConnect from "@/lib/db";
import { getSettings } from "@/lib/models/Setting";
import { PRICE_FIELDS, pricingPayload } from "@/lib/pricing";

// Prices are read on the server and re-checked every 5 minutes, so an admin
// change shows up on the public page without a redeploy and without a
// client-side loading flash.
export const revalidate = 300;

async function loadRates(): Promise<Record<string, number> | undefined> {
  try {
    await dbConnect();
    const payload = pricingPayload(await getSettings());
    return Object.fromEntries(
      PRICE_FIELDS.map((key) => [key, payload[key] as number])
    );
  } catch (err) {
    // Fall back to the values baked into the Pricing component
    console.error("Could not load live pricing:", (err as Error).message);
    return undefined;
  }
}

export default async function Home() {
  const rates = await loadRates();

  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfaf7] text-[#06233a]">
      <Hero />
      <About />
      <VideoSection />
      <Facilities />
      <Pricing rates={rates} />
      <Gallery />
      <Terms />
      <Location />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
