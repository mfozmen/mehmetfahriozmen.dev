"use client";

import { useState } from "react";
import CvSection from "./CvSection";
import EntryCard from "./EntryCard";
import { cvExperience, cvEarlierRoles } from "@/data/cvData";
import { trackEvent } from "@/lib/analytics";

const linkCls = "border-b border-dashed border-[#BA7517]/40 pb-px transition-all hover:border-solid hover:border-[#BA7517] hover:text-[#BA7517]";

function CvLink({ href, children, className = "", onClick }: Readonly<{ href: string; children: React.ReactNode; className?: string; onClick?: () => void }>) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${linkCls} ${className}`} onClick={onClick}>
      {children}
    </a>
  );
}

export default function CvExperience() {
  const [showEarlier, setShowEarlier] = useState(false);

  return (
    <CvSection title="The Journey So Far" spacing="lg">
      <div className="relative divide-y divide-white/[0.02]">
        <div className="absolute bottom-0 left-[3px] top-0 w-px bg-gradient-to-b from-[#BA7517]/30 via-[#BA7517]/15 to-transparent" />

        {cvExperience.map((entry, i) => (
          <div key={`${entry.company}-${entry.date}`} className="py-5 first:pt-0">
            <EntryCard entry={entry} index={i} />
          </div>
        ))}

        <div className="py-5">
          <div>
            <button
              onClick={() => setShowEarlier(!showEarlier)}
              aria-expanded={showEarlier}
              className="mb-6 flex w-full items-center gap-2.5 text-left"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="#BA7517" className="shrink-0" aria-hidden="true">
                <path d="M12 2l2.09 6.26L20.18 9l-5.09 3.74L16.18 19 12 15.77 7.82 19l1.09-6.26L3.82 9l6.09-.74z" />
              </svg>
              <svg
                width="8" height="8" viewBox="0 0 8 8" fill="#BA7517" aria-hidden="true"
                className={`shrink-0 transition-transform duration-200 ${showEarlier ? "rotate-90" : ""}`}
              >
                <path d="M2 1l4 3-4 3z" />
              </svg>
              <span className="shrink-0 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-[#BA7517]">
                Earlier Missions (2009–2018)
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-[#BA7517]/30 to-transparent" />
            </button>

            <div className="mt-3 space-y-3">
              {showEarlier ? (
                /* Expanded: full entry cards */
                <div className="space-y-6">
                  {cvEarlierRoles.map((entry, i) => (
                    <EntryCard key={`${entry.company}-${entry.date}`} entry={entry} index={cvExperience.length + i} />
                  ))}
                </div>
              ) : (
                /* Collapsed: compact one-liners */
                cvEarlierRoles.map((entry) => (
                  <div key={`${entry.company}-${entry.date}`} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                    <span className="text-[12px]">
                      {entry.companyUrl ? (
                        <CvLink href={entry.companyUrl} className="text-[#BA7517]" onClick={() => trackEvent("cv-company-click", { company: entry.company })}>{entry.company}</CvLink>
                      ) : (
                        <span className="text-[#BA7517]">{entry.company}</span>
                      )}
                      <span className="text-[#BA7517]/40"> · </span>
                      <span className="font-medium text-[#b0b0b0]">{entry.role}</span>
                    </span>
                    <span className="font-mono text-[11px] text-[#BA7517]/80">{entry.date}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </CvSection>
  );
}
