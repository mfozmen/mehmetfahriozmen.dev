import CvSection from "./CvSection";
import { cvCoordinates } from "@/data/cvData";

export default function CvCoordinates() {
  return (
    <CvSection title="Coordinates">
      <div className="space-y-1.5">
        {cvCoordinates.map((coord) => (
          <div key={coord.label} className="flex items-baseline gap-3 text-[13px]">
            <span className="w-16 shrink-0 text-[#666666]">{coord.label}</span>
            {coord.href ? (
              <a href={coord.href} target="_blank" rel="noopener noreferrer" className="text-[#a3a3a3] transition-colors hover:text-neutral-200">
                {coord.value}
              </a>
            ) : (
              <span className="text-[#a3a3a3]">{coord.value}</span>
            )}
          </div>
        ))}
      </div>
    </CvSection>
  );
}
