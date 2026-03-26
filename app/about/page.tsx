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
  title: "About",
  description: "The story behind the systems — from a Commodore 64 to backend architecture at scale.",
  alternates: { canonical: "/about" },
  openGraph: { type: "website", title: "About — Mehmet Fahri Özmen", description: "The story behind the systems — from a Commodore 64 to backend architecture at scale.", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

export default function AboutPage() {
  return (
    <>
      <a href="#main" className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-2 focus-visible:left-1/2 focus-visible:-translate-x-1/2 focus-visible:z-[100] focus-visible:px-4 focus-visible:py-2 focus-visible:bg-neutral-900 focus-visible:text-white focus-visible:rounded focus-visible:text-sm">
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
