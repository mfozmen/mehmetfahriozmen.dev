"use client";

import { useState, useEffect } from "react";
import DesktopGalaxy from "./DesktopGalaxy";
import MobileGalaxy from "./MobileGalaxy";

export default function SystemsGalaxy() {
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const check = () => setIsSmall(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section className="pt-6 pb-12 sm:pt-10 sm:pb-20">
      <div className="mx-auto mb-4 max-w-2xl px-4 text-center sm:mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-100 sm:text-3xl">
          Systems I&apos;ve helped build
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-neutral-500 sm:text-base">
          A constellation of systems across commerce, search platforms and
          distributed infrastructure.
        </p>
      </div>

      {isSmall ? <MobileGalaxy /> : <DesktopGalaxy />}
    </section>
  );
}
