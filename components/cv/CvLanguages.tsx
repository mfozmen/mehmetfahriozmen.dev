import CvSection from "./CvSection";

export default function CvLanguages() {
  return (
    <CvSection title="Comm Protocols">
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
        <div className="text-[13px]">
          <span className="text-[#e5e5e5]">Turkish</span>
          {" — "}
          <span className="text-[#888888]">Native</span>
        </div>
        <div className="text-[13px]">
          <span className="text-[#e5e5e5]">English</span>
          {" — "}
          <span className="text-[#888888]">Professional</span>
        </div>
      </div>
    </CvSection>
  );
}
