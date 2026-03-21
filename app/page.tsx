import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import SystemsGalaxy from "@/components/SystemsGalaxy";
import FeaturedSystems from "@/components/FeaturedSystems";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="mx-auto max-w-6xl px-6 pt-16 pb-16 sm:pt-24 sm:pb-24">
        <Hero />
        <div className="mt-6 sm:mt-10">
          <SystemsGalaxy />
        </div>
        <FeaturedSystems />
      </main>
      <Footer />
    </>
  );
}
