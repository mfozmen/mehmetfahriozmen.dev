import CvSection from "./CvSection";
import { cvSkills } from "@/data/cvData";

export default function CvSkills() {
  return (
    <CvSection title="Skills & Technologies">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cvSkills.map((cat) => (
          <div key={cat.label}>
            <div className="mb-1.5 text-[12px] font-medium text-neutral-400">{cat.label}</div>
            <div className="text-[12px] text-neutral-500">
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
