import CvSection from "./CvSection";

export default function CvEducation() {
  return (
    <CvSection title="Launch Pad">
      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
        <span className="text-[13px] text-[#e5e5e5]">
          Computer Engineering — <span className="text-[#a3a3a3]">Yaşar University, İzmir</span>
        </span>
        <span className="font-mono text-[12px] text-[#888888]">Sep 2006 — Jun 2011</span>
      </div>
    </CvSection>
  );
}
