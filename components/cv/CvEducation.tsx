import CvSection from "./CvSection";

export default function CvEducation() {
  return (
    <CvSection title="Education">
      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
        <span className="text-[13px] text-neutral-300">
          Computer Engineering — <span className="text-neutral-500">Yaşar University, İzmir</span>
        </span>
        <span className="font-mono text-[12px] text-neutral-600">2006 — 2011</span>
      </div>
    </CvSection>
  );
}
