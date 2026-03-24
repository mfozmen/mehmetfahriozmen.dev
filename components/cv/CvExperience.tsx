"use client";

import { useState } from "react";
import CvSection from "./CvSection";
import { cvExperience, cvEarlierRoles, type CvExperienceEntry } from "@/data/cvData";

const linkCls = "border-b border-dashed border-[#BA7517]/40 pb-px transition-all hover:border-solid hover:border-[#BA7517] hover:text-[#BA7517]";

function CvLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${linkCls} ${className}`}>
      {children}
    </a>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {items.map((chip) => (
        <span key={chip} className="rounded-full border border-[#BA7517]/[0.12] bg-[#BA7517]/[0.03] px-2 py-0.5 font-mono text-[10px] text-neutral-500">
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
        style={{ animation: "cv-pulse 3s ease-in-out infinite", animationDelay: delay }}
      />
      <style jsx>{`
        @keyframes cv-pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.6); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          div { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

function CompanyHeader({ name, url }: { name: string; url?: string }) {
  const cls = "text-[15px] font-semibold text-[#BA7517]";
  if (url) return <CvLink href={url} className={cls}>{name}</CvLink>;
  return <span className={cls}>{name}</span>;
}

function ProjectName({ name, url }: { name: string; url?: string }) {
  if (url) return <CvLink href={url} className="font-semibold text-[#e5e5e5]">{name}</CvLink>;
  return <span className="font-semibold text-[#e5e5e5]">{name}</span>;
}

function EntryCard({ entry, index }: { entry: CvExperienceEntry; index: number }) {
  const roles = entry.roles ?? [{ title: entry.role, date: entry.date, description: entry.description }];
  const showRoleDate = roles.length > 1;

  return (
    <div className="relative pl-6">
      <TimelineDot index={index} />

      {/* Company header */}
      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
        <CompanyHeader name={entry.company} url={entry.companyUrl} />
        <span className="font-mono text-[11px] text-[#BA7517]/65">{entry.date}</span>
      </div>

      {/* Roles */}
      <div className="mt-2 space-y-3">
        {roles.map((role) => (
          <div key={role.title}>
            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
              <span className="text-[13px] font-semibold text-[#e5e5e5]">{role.title}</span>
              {showRoleDate && <span className="font-mono text-[10px] text-[#888888]">{role.date}</span>}
            </div>
            {role.bullets && role.bullets.length > 0 && (
              <ul className="mt-1.5 space-y-1">
                {role.bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-[12px] leading-[1.6] text-[#a3a3a3]">
                    <span className="shrink-0 text-[#BA7517]/30">▸</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
            {!role.bullets && role.description && (
              <p className="mt-1 text-[12px] leading-relaxed text-[#a3a3a3]">{role.description}</p>
            )}
          </div>
        ))}
      </div>

      {/* Nested projects */}
      {entry.projects && entry.projects.length > 0 && (
        <div className="mt-3 space-y-1.5 border-l border-[#BA7517]/10 pl-3">
          {entry.projects.map((proj) => (
            <div key={proj.name} className="relative text-[12px]">
              <span className="absolute -left-3.5 top-[7px] h-px w-1.5 bg-[#BA7517]/15" />
              <ProjectName name={proj.name} url={proj.url} />
              <span className="text-[#666666]"> — {proj.description}</span>
            </div>
          ))}
        </div>
      )}

      {entry.chips && <Chips items={entry.chips} />}

      {/* Sub-entry (e.g. BeforeSunset AI) — company-first, indented */}
      {entry.subEntry && (
        <div className="ml-4 mt-4 border-l border-[#BA7517]/15 pl-3.5">
          <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
            <div className="text-[13px]">
              {entry.subEntry.companyUrl ? (
                <CvLink href={entry.subEntry.companyUrl} className="font-semibold text-[#BA7517]">{entry.subEntry.company}</CvLink>
              ) : (
                <span className="font-semibold text-[#BA7517]">{entry.subEntry.company}</span>
              )}
              <span className="ml-1.5 text-[11px] italic text-[#666666]" aria-label="concurrent role">· concurrent</span>
            </div>
            <span className="font-mono text-[11px] text-[#BA7517]/65">{entry.subEntry.date}</span>
          </div>
          <div className="mt-1 text-[13px] font-semibold text-[#e5e5e5]">{entry.subEntry.role}</div>
          {entry.subEntry.bullets && entry.subEntry.bullets.length > 0 ? (
            <ul className="mt-1.5 space-y-1">
              {entry.subEntry.bullets.map((b) => (
                <li key={b} className="flex gap-2 text-[12px] leading-[1.6] text-[#a3a3a3]">
                  <span className="shrink-0 text-[#BA7517]/30">▸</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          ) : entry.subEntry.description ? (
            <p className="mt-1 text-[12px] leading-relaxed text-[#a3a3a3]">{entry.subEntry.description}</p>
          ) : null}
          <Chips items={entry.subEntry.chips} />
        </div>
      )}
    </div>
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
                width="8" height="8" viewBox="0 0 8 8" fill="#BA7517"
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
                        <CvLink href={entry.companyUrl} className="text-[#BA7517]">{entry.company}</CvLink>
                      ) : (
                        <span className="text-[#BA7517]">{entry.company}</span>
                      )}
                      <span className="text-[#BA7517]/40"> · </span>
                      <span className="font-medium text-[#b0b0b0]">{entry.role}</span>
                    </span>
                    <span className="font-mono text-[11px] text-[#BA7517]/65">{entry.date}</span>
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
