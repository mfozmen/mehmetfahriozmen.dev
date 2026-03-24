import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import SystemsGalaxy from "@/components/SystemsGalaxy";
import FeaturedSystems from "@/components/FeaturedSystems";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import NebulaGlows from "@/components/NebulaGlows";

export default function Home() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-neutral-900 focus:text-white focus:rounded">
        Skip to content
      </a>
      <Navigation />
      <Starfield />
      <NebulaGlows />
      <main id="main" className="relative z-10 mx-auto max-w-6xl px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
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
