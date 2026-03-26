import type { Metadata } from "next";
import Link from "next/link";
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
  title: "CV",
  description: "Backend Systems Architect & Engineering Leader. 12+ years building scalable systems across e-commerce, ad-tech, edtech, and productivity.",
  alternates: { canonical: "/cv" },
  openGraph: { type: "website", title: "CV — Mehmet Fahri Özmen", description: "Backend Systems Architect & Engineering Leader. 12+ years building scalable systems across e-commerce, ad-tech, edtech, and productivity.", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

function CvBottomCtas() {
  return (
    <p className="mt-16 text-center text-[13px] text-neutral-500">
      <Link href="/contact" className="group relative inline-block border-b border-dashed border-[#BA7517]/40 text-[#BA7517] transition-colors hover:text-[#BA7517]/80">
        <span className="absolute inset-0 -m-4 rounded-full opacity-0 transition-opacity group-hover:opacity-100" style={{ background: "radial-gradient(circle, rgba(186,117,23,0.06) 0%, transparent 70%)" }} />
        <span className="relative">Want to work together? &rarr;</span>
      </Link>
      <span className="mx-3">&middot;</span>
      <Link href="/writing" className="group relative inline-block border-b border-dashed border-[#BA7517]/40 text-[#BA7517] transition-colors hover:text-[#BA7517]/80">
        <span className="absolute inset-0 -m-4 rounded-full opacity-0 transition-opacity group-hover:opacity-100" style={{ background: "radial-gradient(circle, rgba(186,117,23,0.06) 0%, transparent 70%)" }} />
        <span className="relative">Read my thoughts &rarr;</span>
      </Link>
    </p>
  );
}

const profileSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: "Mehmet Fahri Özmen",
    jobTitle: "Backend Systems Architect & Engineering Leader",
    url: "https://mehmetfahriozmen.dev",
    sameAs: [
      "https://github.com/mfozmen",
      "https://linkedin.com/in/mfozmen",
      "https://x.com/mfozmen",
    ],
  },
};

export default function CvPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }} />
      <a href="#main" className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-2 focus-visible:left-1/2 focus-visible:-translate-x-1/2 focus-visible:z-[100] focus-visible:px-4 focus-visible:py-2 focus-visible:bg-neutral-900 focus-visible:text-white focus-visible:rounded focus-visible:text-sm">
        Skip to content
      </a>
      <Navigation />
      <Starfield />
      <NebulaGlows />

      <main id="main" className="relative z-10 mx-auto max-w-[780px] px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <CvHeader />
        <CvQuote />
        <CvExperience />
        <CvSkills />
        <CvEducation />
        <CvLanguages />
        <CvBottomCtas />
      </main>

      <Footer />
    </>
  );
}
