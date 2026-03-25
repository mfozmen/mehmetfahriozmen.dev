import CvSection from "./CvSection";
import { cvSkills } from "@/data/cvData";

export default function CvSkills() {
  return (
    <CvSection title="The Arsenal">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {cvSkills.map((cat) => (
          <div key={cat.label} className="min-w-0 rounded-lg border border-[#BA7517]/[0.10] p-3">
            <div className="mb-1.5 text-[11px] font-medium text-[#e5e5e5]">{cat.label}</div>
            <div className="flex flex-wrap items-baseline gap-x-0.5 gap-y-0.5 text-[11px] leading-snug text-[#888888]">
              {cat.items.map((item, i) => (
                <span key={item} className="whitespace-nowrap">
                  {item}
                  {i < cat.items.length - 1 && <span className="ml-0.5 mr-0.5 text-[#BA7517]/40">·</span>}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </CvSection>
  );
}
