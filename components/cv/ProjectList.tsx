"use client";

import { useState } from "react";
import { type CvExperienceEntry } from "@/data/cvData";
import { trackEvent } from "@/lib/analytics";

const linkCls = "border-b border-dashed border-[#BA7517]/40 pb-px transition-all hover:border-solid hover:border-[#BA7517] hover:text-[#BA7517]";

function ProjectName({ name, url }: Readonly<{ name: string; url?: string }>) {
  if (url) return <a href={url} target="_blank" rel="noopener noreferrer" className={`${linkCls} font-semibold text-[#e5e5e5]`} onClick={() => trackEvent("cv-project-click", { project: name })}>{name}</a>;
  return <span className="font-semibold text-[#e5e5e5]">{name}</span>;
}

const MAX_VISIBLE_PROJECTS = 4;

export default function ProjectList({ projects }: Readonly<{ projects: CvExperienceEntry["projects"] }>) {
  const [showAll, setShowAll] = useState(false);
  if (!projects || projects.length === 0) return null;

  const visible = showAll ? projects : projects.slice(0, MAX_VISIBLE_PROJECTS);
  const hiddenCount = projects.length - MAX_VISIBLE_PROJECTS;

  return (
    <div className="mt-3 space-y-1.5 border-l border-[#BA7517]/10 pl-3">
      {visible.map((proj) => (
        <div key={proj.name} className="relative text-[12px]">
          <span className="absolute -left-3.5 top-[7px] h-px w-1.5 bg-[#BA7517]/15" />
          <ProjectName name={proj.name} url={proj.url} />
          {proj.description && <span className="text-[#888888]"> — {proj.description}</span>}
        </div>
      ))}
      {hiddenCount > 0 && !showAll && (
        <button
          onClick={() => { setShowAll(true); trackEvent("cv-more-projects-toggle"); }}
          className="ml-1 text-[11px] text-[#BA7517]/60 transition-colors hover:text-[#BA7517]"
        >
          and {hiddenCount} more projects
        </button>
      )}
    </div>
  );
}
