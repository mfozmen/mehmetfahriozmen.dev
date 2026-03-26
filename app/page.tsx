import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import SystemsGalaxy from "@/components/SystemsGalaxy";
import FeaturedSystems from "@/components/FeaturedSystems";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import NebulaGlows from "@/components/NebulaGlows";

export const metadata: Metadata = {
  title: "Mehmet Fahri Özmen — Backend Systems Architect",
  description: "I build the things you don't see — distributed systems, search engines, payment flows, and the teams behind them.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <a href="#main" className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-2 focus-visible:left-1/2 focus-visible:-translate-x-1/2 focus-visible:z-[100] focus-visible:px-4 focus-visible:py-2 focus-visible:bg-neutral-900 focus-visible:text-white focus-visible:rounded focus-visible:text-sm">
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
