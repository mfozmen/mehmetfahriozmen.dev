export default function TagPill({ tag }: Readonly<{ tag: string }>) {
  return (
    <span className="rounded-full border border-[#BA7517]/15 bg-[#BA7517]/[0.04] px-2.5 py-0.5 font-mono text-[10px] text-[#BA7517]/70">
      {tag}
    </span>
  );
}
