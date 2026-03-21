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
    <section className="pb-12 sm:pb-20">
      {isSmall ? <MobileGalaxy /> : <DesktopGalaxy />}
    </section>
  );
}
