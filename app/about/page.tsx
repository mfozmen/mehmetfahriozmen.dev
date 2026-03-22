import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
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
      <Navigation />
      <main className="mx-auto max-w-4xl px-6 pt-16 pb-16 sm:pt-24 sm:pb-24">
        <AboutIntro />
        <AboutOrigins />
        <AboutWork />
        <AboutLife />
      </main>
      <Footer />
    </>
  );
}
