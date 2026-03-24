import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import NebulaGlows from "@/components/NebulaGlows";
import CvHeader from "@/components/cv/CvHeader";
import CvQuote from "@/components/cv/CvQuote";
import CvExperience from "@/components/cv/CvExperience";
import CvSkills from "@/components/cv/CvSkills";
import CvEducation from "@/components/cv/CvEducation";
import CvLanguages from "@/components/cv/CvLanguages";

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

      <NebulaGlows />

      <main className="relative z-10 mx-auto max-w-[780px] px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <CvHeader />
        <CvQuote />
        <CvExperience />
        <CvSkills />
        <CvEducation />
        <CvLanguages />
      </main>

      <Footer />
    </>
  );
}
