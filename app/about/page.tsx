import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import NebulaGlows from "@/components/NebulaGlows";
import AboutIntro from "@/components/about/AboutIntro";
import AboutOrigins from "@/components/about/AboutOrigins";
import AboutWork from "@/components/about/AboutWork";
import AboutLife from "@/components/about/AboutLife";

export const metadata: Metadata = {
  title: "About — Mehmet Fahri Özmen",
  description:
    "The story behind the systems — from a Commodore 64 to backend architecture at scale.",
};

export default function AboutPage() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-neutral-900 focus:text-white focus:rounded">
        Skip to content
      </a>
      <Navigation />
      <Starfield />

      <NebulaGlows />

      <main id="main" className="relative z-10 mx-auto max-w-4xl px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <AboutIntro />
        <AboutOrigins />
        <AboutWork />
        <AboutLife />
      </main>
      <Footer />
    </>
  );
}
