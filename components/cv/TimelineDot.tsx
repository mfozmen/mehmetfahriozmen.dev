"use client";

export default function TimelineDot({ index }: Readonly<{ index: number }>) {
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
