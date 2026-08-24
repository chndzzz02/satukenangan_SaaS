import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FilmPresetsSection from "@/components/FilmPresetsSection";
import PricingSection from "@/components/PricingSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import FlashOverlay from "@/components/FlashOverlay";

export default function Home() {
  return (
    <main className="min-h-screen bg-cream text-ink relative">
      <FlashOverlay />
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <FilmPresetsSection />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
