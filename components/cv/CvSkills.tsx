import CvSection from "./CvSection";
import { cvSkills } from "@/data/cvData";

export default function CvSkills() {
  return (
    <CvSection title="The Arsenal">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {cvSkills.map((cat) => (
          <div key={cat.label} className="min-w-0 rounded-lg border border-[#BA7517]/[0.06] p-4">
            <div className="mb-2 text-[12px] font-medium text-[#e5e5e5]">{cat.label}</div>
            <div className="break-words text-[11px] leading-relaxed text-[#666666]">
              {cat.items.map((item, i) => (
                <span key={item}>
                  {item}
                  {i < cat.items.length - 1 && <span className="mx-1 text-[#BA7517]/40">·</span>}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </CvSection>
  );
}
