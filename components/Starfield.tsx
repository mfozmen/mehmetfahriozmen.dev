"use client";

import { useRef, useEffect } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  alpha: number;
  phase: number;
  amber: boolean;
}

function generateStars(w: number, h: number): Star[] { // NOSONAR: S2245 — Math.random is safe here, used for visual star placement only
  const count = Math.round((w * h) / 8000);
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    const isBright = Math.random() < 0.05; // NOSONAR
    stars.push({
      x: Math.random() * w, // NOSONAR
      y: Math.random() * h, // NOSONAR
      r: isBright ? 1.5 + Math.random() * 0.5 : 0.2 + Math.random() * 1.2, // NOSONAR
      alpha: isBright ? 0.5 + Math.random() * 0.3 : 0.15 + Math.random() * 0.45, // NOSONAR
      phase: Math.random() * Math.PI * 2, // NOSONAR
      amber: Math.random() < 0.2, // NOSONAR
    });
  }
  return stars;
}

export default function Starfield({ className = "" }: Readonly<{ className?: string }>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      const dpr = globalThis.devicePixelRatio || 1;
      const w = globalThis.innerWidth;
      const h = globalThis.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      starsRef.current = generateStars(w, h);
    }
    resize();
    globalThis.addEventListener("resize", resize);

    const prefersReducedMotion = globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const animate = (t: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) { animRef.current = requestAnimationFrame(animate); return; }
      const dpr = globalThis.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const time = t / 1000;
      const scrollY = prefersReducedMotion ? 0 : globalThis.scrollY * 0.03;

      for (const star of starsRef.current) {
        const twinkle = prefersReducedMotion ? star.alpha : star.alpha * (0.55 + 0.45 * Math.sin(time * 1.5 + star.phase));
        const sy = star.y - scrollY;
        if (star.amber) {
          ctx.fillStyle = `rgba(186,117,23,${twinkle})`;
        } else {
          ctx.fillStyle = `rgba(200,210,230,${twinkle})`;
        }
        ctx.beginPath();
        ctx.arc(star.x, sy, star.r, 0, Math.PI * 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      globalThis.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-0 ${className}`}
    />
  );
}
