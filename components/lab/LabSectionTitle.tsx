function TerminalPromptIcon() {
  return (
    <span className="shrink-0 font-mono text-[13px] text-[#BA7517]" aria-hidden="true">
      &gt;_
    </span>
  );
}

export default function LabSectionTitle({ title }: Readonly<{ title: string }>) {
  return (
    <h2 className="mb-6 flex items-center gap-2.5">
      <TerminalPromptIcon />
      <span className="shrink-0 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-[#BA7517]">
        {title}
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-[#BA7517]/30 to-transparent" />
    </h2>
  );
}
