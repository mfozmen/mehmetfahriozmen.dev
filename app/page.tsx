import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import SystemsGalaxy from "@/components/SystemsGalaxy";
import FeaturedSystems from "@/components/FeaturedSystems";
import Domains from "@/components/Domains";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <Hero />
        <SystemsGalaxy />
        <div className="space-y-24">
          <FeaturedSystems />
          <Domains />
        </div>
      </main>
      <Footer />
    </>
  );
}
