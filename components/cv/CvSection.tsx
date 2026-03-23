function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(186,117,23,0.6)" className="shrink-0">
      <path d="M12 2l2.09 6.26L20.18 9l-5.09 3.74L16.18 19 12 15.77 7.82 19l1.09-6.26L3.82 9l6.09-.74z" />
    </svg>
  );
}

export default function CvSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="mb-6 flex items-center gap-2 border-b border-white/[0.04] pb-3 text-[15px] font-medium text-neutral-300">
        <StarIcon />
        {title}
      </h2>
      {children}
    </section>
  );
}
