import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import CvHeader from "@/components/cv/CvHeader";
import CvQuote from "@/components/cv/CvQuote";
import CvExperience from "@/components/cv/CvExperience";
import CvSkills from "@/components/cv/CvSkills";
import CvEducation from "@/components/cv/CvEducation";
import CvLanguages from "@/components/cv/CvLanguages";
import CvCoordinates from "@/components/cv/CvCoordinates";

export const metadata: Metadata = {
  title: "CV — Mehmet Fahri Özmen",
  description:
    "Backend Systems Architect & Engineering Leader. 12+ years building scalable systems across e-commerce, ad-tech, edtech, and productivity.",
};

export default function CvPage() {
  return (
    <>
      <Navigation />
      <Starfield />

      {/* Nebula background divs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" data-testid="nebula-container">
        <div className="absolute -right-20 top-[15%] h-[350px] w-[350px] rounded-full bg-[rgba(186,117,23,0.055)] blur-[100px]" />
        <div className="absolute -left-16 top-[45%] h-[280px] w-[280px] rounded-full bg-[rgba(186,117,23,0.04)] blur-[100px]" />
        <div className="absolute bottom-[20%] right-[10%] h-[250px] w-[250px] rounded-full bg-[rgba(239,159,39,0.03)] blur-[100px]" />
        <div className="absolute bottom-[35%] left-[5%] h-[200px] w-[200px] rounded-full bg-[rgba(186,117,23,0.025)] blur-[100px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-[780px] px-6 pt-16 pb-16 sm:pt-24 sm:pb-24">
        <CvHeader />
        <CvQuote />
        <CvExperience />
        <CvSkills />
        <CvEducation />
        <CvLanguages />
        <CvCoordinates />
      </main>

      <Footer />
    </>
  );
}
