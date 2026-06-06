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

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfaf7] text-[#06233a]">
      <Hero />
      <About />
      <VideoSection />
      <Facilities />
      <Pricing />
      <Gallery />
      <Terms/>
      <Location />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
