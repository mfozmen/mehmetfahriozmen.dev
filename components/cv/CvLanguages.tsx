import CvSection from "./CvSection";

export default function CvLanguages() {
  return (
    <CvSection title="Languages">
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
        <div className="text-[13px]">
          <span className="text-neutral-300">Turkish</span>
          <span className="ml-2 text-neutral-600">Native</span>
        </div>
        <div className="text-[13px]">
          <span className="text-neutral-300">English</span>
          <span className="ml-2 text-neutral-600">Professional</span>
        </div>
      </div>
    </CvSection>
  );
}
