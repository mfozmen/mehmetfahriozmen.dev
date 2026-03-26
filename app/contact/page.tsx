import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import NebulaGlows from "@/components/NebulaGlows";
import SectionTitle from "@/components/SectionTitle";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch — send a message or connect directly.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact — Mehmet Fahri Özmen", description: "Get in touch — send a message or connect directly." },
};

function DirectChannels() {
  return (
    <div className="mt-12 border-t border-[#BA7517]/10 pt-8 text-center">
      <p className="text-[13px] text-neutral-500">
        Prefer a direct channel?
      </p>
      <div className="mt-3 flex items-center justify-center gap-4">
        <a
          href="mailto:contact@mehmetfahriozmen.dev"
          className="font-mono text-[11px] text-neutral-500 transition-colors hover:text-[#BA7517]"
        >
          contact@mehmetfahriozmen.dev
        </a>
        <span className="text-neutral-700">&middot;</span>
        <a
          href="https://linkedin.com/in/mfozmen"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] text-neutral-500 transition-colors hover:text-[#BA7517]"
        >
          LinkedIn
        </a>
        <span className="text-neutral-700">&middot;</span>
        <a
          href="https://x.com/mfozmen"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] text-neutral-500 transition-colors hover:text-[#BA7517]"
        >
          X
        </a>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <a href="#main" className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-2 focus-visible:left-1/2 focus-visible:-translate-x-1/2 focus-visible:z-[100] focus-visible:px-4 focus-visible:py-2 focus-visible:bg-neutral-900 focus-visible:text-white focus-visible:rounded focus-visible:text-sm">
        Skip to content
      </a>
      <Navigation />
      <Starfield />
      <NebulaGlows />

      <main id="main" className="relative z-10 mx-auto max-w-xl px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <section className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Send a Transmission
          </h1>
          <p className="mt-4 text-lg italic text-neutral-500">
            Open frequency. All channels monitored.
          </p>
        </section>

        <SectionTitle title="Message" />
        <ContactForm />
        <DirectChannels />
      </main>
      <Footer />
    </>
  );
}
