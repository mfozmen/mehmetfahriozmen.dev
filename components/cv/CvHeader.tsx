import { TrackedAnchor } from "@/components/TrackedLink";

const cvViewUrl = process.env.NEXT_PUBLIC_CV_PDF_URL || "#";
const fileIdMatch = /\/d\/([a-zA-Z0-9_-]+)/.exec(cvViewUrl);
const cvDownloadUrl = fileIdMatch
  ? `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`
  : cvViewUrl;

export default function CvHeader() {
  return (
    <header className="mb-8 text-center">
      <div className="mb-6 flex items-center justify-center gap-3">
        <span className="h-px w-8 bg-gradient-to-r from-transparent via-[#BA7517]/40 to-transparent" />
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#BA7517]">
          Curriculum Vitae
        </span>
        <span className="h-px w-8 bg-gradient-to-r from-transparent via-[#BA7517]/40 to-transparent" />
      </div>

      <h1
        className="text-[26px] font-bold text-white sm:text-[28px]"
        style={{ textShadow: "0 0 40px rgba(186,117,23,0.08)" }}
      >
        Mehmet Fahri Özmen
      </h1>
      <p className="mt-2 text-[15px] text-neutral-400">
        Backend Systems Architect &amp; Engineering Leader
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[12px] text-neutral-500">
        <span>İzmir, Turkey</span>
        <span className="text-neutral-700">·</span>
        <a href="mailto:mehmetfahriozmen@gmail.com" className="transition-colors hover:text-neutral-300">mehmetfahriozmen@gmail.com</a>
        <span className="text-neutral-700">·</span>
        <a href="https://linkedin.com/in/mfozmen" className="transition-colors hover:text-neutral-300">LinkedIn</a>
        <span className="text-neutral-700">·</span>
        <a href="https://github.com/mfozmen" className="transition-colors hover:text-neutral-300">GitHub</a>
      </div>

      <div className="mt-6">
        <TrackedAnchor
          href={cvDownloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
          eventName="cv-pdf-download"
          eventData={{ source: "cv-page" }}
          className="group relative inline-block rounded-full border border-[#BA7517]/40 px-5 py-1.5 font-mono text-[11px] text-[#BA7517] transition-all hover:border-[#BA7517]/70 hover:shadow-[0_0_20px_rgba(186,117,23,0.15)]"
        >
          <span className="absolute inset-0 -m-2 rounded-full opacity-0 transition-opacity group-hover:opacity-100" style={{ background: "radial-gradient(circle, rgba(186,117,23,0.06) 0%, transparent 70%)" }} />
          <span className="relative">The no-stars PDF version ↓</span>
        </TrackedAnchor>
      </div>
    </header>
  );
}
