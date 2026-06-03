import About from "@/components/About/About";
import Facilities from "@/components/Facilities/Facilities";
import Hero from "@/components/Hero/Hero";
import Pricing from "@/components/Pricing/Pricing";
import VideoSection from "@/components/VideoSection/VideoSection";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#06233a]">
      <Hero />
      <About />
      <VideoSection />
      <Facilities />
      <Pricing />
    </main>
  );
}
