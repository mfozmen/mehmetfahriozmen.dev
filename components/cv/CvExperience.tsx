"use client";

import { useState } from "react";
import CvSection from "./CvSection";
import { cvExperience, cvEarlierRoles, type CvExperienceEntry } from "@/data/cvData";

function Chips({ items }: { items: string[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {items.map((chip) => (
        <span
          key={chip}
          className="rounded-full border border-[#BA7517]/[0.12] bg-[#BA7517]/[0.03] px-2 py-0.5 font-mono text-[10px] text-neutral-500"
        >
          {chip}
        </span>
      ))}
    </div>
  );
}

function TimelineDot({ index }: { index: number }) {
  const delay = `${index * 0.5}s`;
  return (
    <div className="absolute left-0 top-1.5 h-2 w-2">
      <div className="h-full w-full rounded-full bg-[#BA7517]/50 shadow-[0_0_6px_rgba(186,117,23,0.4)]" />
      <div
        className="absolute -inset-1 rounded-full shadow-[0_0_8px_rgba(186,117,23,0.25)]"
        style={{
          animation: `cv-pulse 3s ease-in-out infinite`,
          animationDelay: delay,
        }}
      />
      <style jsx>{`
        @keyframes cv-pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function EntryCard({ entry, index }: { entry: CvExperienceEntry; index: number }) {
  return (
    <div className="relative pl-6">
      <TimelineDot index={index} />

      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
        <span className="text-[15px] font-medium text-neutral-200">{entry.role}</span>
        <span className="font-mono text-[12px] text-neutral-600">{entry.date}</span>
      </div>
      <div className="text-[13px] text-[#BA7517]">{entry.company}</div>

      {entry.description && (
        <p className="mt-2 text-[13px] leading-relaxed text-[#8a8a8a]">{entry.description}</p>
      )}

      {entry.projects && entry.projects.length > 0 && (
        <div className="mt-2 space-y-1.5 border-l border-[#BA7517]/10 pl-3">
          {entry.projects.map((proj) => (
            <div key={proj.name} className="relative text-[12px]">
              <span className="absolute -left-3.5 top-[7px] h-px w-1.5 bg-[#BA7517]/15" />
              <span className="font-medium text-[#c4c4c4]">{proj.name}</span>
              <span className="text-[#666]"> — {proj.description}</span>
            </div>
          ))}
        </div>
      )}

      {entry.chips && <Chips items={entry.chips} />}
    </div>
  );
}

export default function CvExperience() {
  const [showEarlier, setShowEarlier] = useState(false);

  return (
    <CvSection title="Experience">
      <div className="relative space-y-8">
        {/* Timeline line */}
        <div className="absolute bottom-0 left-[3px] top-0 w-px bg-gradient-to-b from-[#BA7517]/30 via-[#BA7517]/15 to-transparent" />

        {cvExperience.map((entry, i) => (
          <EntryCard key={`${entry.company}-${entry.date}`} entry={entry} index={i} />
        ))}

        {/* Earlier roles */}
        <div className="relative pl-6">
          <div className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-neutral-700" />
          <button
            onClick={() => setShowEarlier(!showEarlier)}
            className="flex items-center gap-1.5 text-[12px] text-[#BA7517]/50 transition-colors hover:text-[#BA7517]"
          >
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="currentColor"
              className={`transition-transform ${showEarlier ? "rotate-90" : ""}`}
            >
              <path d="M2 1l4 3-4 3z" />
            </svg>
            Earlier roles (2009–2013)
          </button>

          {showEarlier && (
            <div className="mt-3 space-y-3">
              {cvEarlierRoles.map((role) => (
                <div key={`${role.company}-${role.date}`} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                  <span className="text-[13px] text-neutral-500">
                    {role.role} · <span className="text-[#BA7517]/70">{role.company}</span>
                  </span>
                  <span className="font-mono text-[11px] text-neutral-700">{role.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </CvSection>
  );
}
