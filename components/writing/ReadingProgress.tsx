"use client";

import { useState, useEffect } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = globalThis.window?.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    function handleScroll() {
      const article = document.querySelector("article");
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const total = article.scrollHeight - globalThis.window.innerHeight;
      const scrolled = -rect.top;
      setProgress(Math.min(Math.max(scrolled / total, 0), 1));
    }

    globalThis.window.addEventListener("scroll", handleScroll, { passive: true });
    return () => globalThis.window.removeEventListener("scroll", handleScroll);
  }, []);

  if (progress === 0) return null;

  return (
    <progress
      className="fixed top-0 left-0 z-[100] h-[2px] w-full appearance-none border-0 bg-transparent [&::-moz-progress-bar]:bg-[#BA7517] [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:bg-[#BA7517] [&::-webkit-progress-value]:transition-[width] [&::-webkit-progress-value]:duration-150"
      value={Math.round(progress * 100)}
      max={100}
      aria-label="Reading progress"
      style={{ width: `${progress * 100}%` }}
    />
  );
}
