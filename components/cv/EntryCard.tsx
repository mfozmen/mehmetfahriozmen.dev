"use client";

import { type CvExperienceEntry } from "@/data/cvData";
import { trackEvent } from "@/lib/analytics";
import TimelineDot from "./TimelineDot";
import ProjectList from "./ProjectList";

const linkCls = "border-b border-dashed border-[#BA7517]/40 pb-px transition-all hover:border-solid hover:border-[#BA7517] hover:text-[#BA7517]";

function CvLink({ href, children, className = "", onClick }: Readonly<{ href: string; children: React.ReactNode; className?: string; onClick?: () => void }>) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${linkCls} ${className}`} onClick={onClick}>
      {children}
    </a>
  );
}

function CompanyHeader({ name, url }: Readonly<{ name: string; url?: string }>) {
  const cls = "text-[15px] font-semibold text-[#BA7517]";
  if (url) return <CvLink href={url} className={cls} onClick={() => trackEvent("cv-company-click", { company: name })}>{name}</CvLink>;
  return <span className={cls}>{name}</span>;
}

function BulletList({ items }: Readonly<{ items: string[] }>) {
  return (
    <ul className="mt-1.5 space-y-1">
      {items.map((b) => (
        <li key={b} className="flex gap-2 text-[12px] leading-[1.6] text-[#a3a3a3]">
          <span className="shrink-0 text-[#BA7517]/40">▸</span>
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}

function Chips({ items }: Readonly<{ items: string[] }>) {
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

function RoleDescription({ bullets, description }: Readonly<{ bullets?: string[]; description?: string }>) {
  if (bullets && bullets.length > 0) return <BulletList items={bullets} />;
  if (description) return <p className="mt-1 text-[12px] leading-relaxed text-[#a3a3a3]">{description}</p>;
  return null;
}

export default function EntryCard({ entry, index }: Readonly<{ entry: CvExperienceEntry; index: number }>) {
  const roles = entry.roles ?? [{ title: entry.role, date: entry.date, description: entry.description }];
  const showRoleDate = roles.length > 1;

  return (
    <div className="relative pl-6">
      <TimelineDot index={index} />

      {/* Company header */}
      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
        <CompanyHeader name={entry.company} url={entry.companyUrl} />
        <span className="font-mono text-[11px] text-[#BA7517]/80">{entry.date}</span>
      </div>

      {/* Roles */}
      <div className="mt-2 space-y-3">
        {roles.map((role) => (
          <div key={role.title}>
            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
              <span className="text-[13px] font-semibold text-[#e5e5e5]">{role.title}</span>
              {showRoleDate && <span className="font-mono text-[10px] text-[#888888]">{role.date}</span>}
            </div>
            <RoleDescription bullets={role.bullets} description={role.description} />
          </div>
        ))}
      </div>

      {/* Nested projects */}
      {entry.projects && entry.projects.length > 0 && (
        <ProjectList projects={entry.projects} />
      )}

      {entry.chips && <Chips items={entry.chips} />}

      {/* Sub-entry (e.g. BeforeSunset AI) — company-first, indented */}
      {entry.subEntry && (
        <div className="ml-4 mt-4 border-l border-[#BA7517]/15 pl-3.5">
          <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
            <div className="text-[13px]">
              {entry.subEntry.companyUrl ? (
                <CvLink href={entry.subEntry.companyUrl} className="font-semibold text-[#BA7517]" onClick={() => trackEvent("cv-company-click", { company: entry.subEntry?.company ?? entry.company })}>{entry.subEntry.company}</CvLink>
              ) : (
                <span className="font-semibold text-[#BA7517]">{entry.subEntry.company}</span>
              )}
              <span className="ml-1.5 text-[11px] italic text-[#888888]" aria-label="concurrent role">· concurrent</span>
            </div>
            <span className="font-mono text-[11px] text-[#BA7517]/80">{entry.subEntry.date}</span>
          </div>
          <div className="mt-1 text-[13px] font-semibold text-[#e5e5e5]">{entry.subEntry.role}</div>
          <RoleDescription bullets={entry.subEntry.bullets} description={entry.subEntry.description} />
          <Chips items={entry.subEntry.chips} />
        </div>
      )}
    </div>
  );
}
