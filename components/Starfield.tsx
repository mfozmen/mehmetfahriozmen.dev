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

function generateStars(w: number, h: number): Star[] {
  const count = Math.round((w * h) / 8000);
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.2 + Math.random() * 1.2,
      alpha: 0.1 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
      amber: Math.random() < 0.15,
    });
  }
  return stars;
}

export default function Starfield({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      canvas!.style.width = `${window.innerWidth}px`;
      canvas!.style.height = `${window.innerHeight}px`;
      starsRef.current = generateStars(window.innerWidth, window.innerHeight);
    }
    resize();
    window.addEventListener("resize", resize);

    const animate = (t: number) => {
      const ctx = canvas!.getContext("2d");
      if (!ctx) { animRef.current = requestAnimationFrame(animate); return; }
      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas!.width / dpr, canvas!.height / dpr);

      const time = t / 1000;
      const scrollY = window.scrollY * 0.03;

      for (const star of starsRef.current) {
        const twinkle = star.alpha * (0.7 + 0.3 * Math.sin(time * 1.5 + star.phase));
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
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-0 ${className}`}
    />
  );
}
