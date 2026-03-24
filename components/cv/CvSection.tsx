function StarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="#BA7517" className="shrink-0" aria-hidden="true">
      <path d="M12 2l2.09 6.26L20.18 9l-5.09 3.74L16.18 19 12 15.77 7.82 19l1.09-6.26L3.82 9l6.09-.74z" />
    </svg>
  );
}

export default function CvSection({ title, children, spacing = "md" }: Readonly<{ title: string; children: React.ReactNode; spacing?: "lg" | "md" }>) {
  const mb = spacing === "lg" ? "mb-16" : "mb-10";
  return (
    <section className={mb}>
      <h2 className="mb-6 flex items-center gap-2.5">
        <StarIcon />
        <span className="shrink-0 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-[#BA7517]">
          {title}
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-[#BA7517]/30 to-transparent" />
      </h2>
      {children}
    </section>
  );
}
