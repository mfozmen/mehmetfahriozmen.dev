import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
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

      {/* Nebula background divs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" data-testid="nebula-container">
        <div className="absolute -right-20 top-[15%] h-[350px] w-[350px] rounded-full bg-[rgba(186,117,23,0.055)] blur-[100px]" />
        <div className="absolute -left-16 top-[45%] h-[280px] w-[280px] rounded-full bg-[rgba(186,117,23,0.04)] blur-[100px]" />
        <div className="absolute bottom-[20%] right-[10%] h-[250px] w-[250px] rounded-full bg-[rgba(239,159,39,0.03)] blur-[100px]" />
        <div className="absolute bottom-[35%] left-[5%] h-[200px] w-[200px] rounded-full bg-[rgba(186,117,23,0.025)] blur-[100px]" />
      </div>

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
