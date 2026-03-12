"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  systems,
  domains,
  orbits,
  SystemNode,
  DomainNode,
  SystemImportance,
} from "@/data/systemsGraph";

/* ------------------------------------------------------------------ */
/*  Background star types & helpers (unchanged from before)            */
/* ------------------------------------------------------------------ */

type StarLayer = "far" | "mid" | "near";

interface SpikeGeometry {
  lengthMul: number;
  arms: [number, number, number, number];
  diagonals: boolean;
  diagArms: [number, number, number, number];
}

interface BgStar {
  x: number;
  y: number;
  r: number;
  alpha: number;
  layer: StarLayer;
  phase: number;
  color: string;
  spike: SpikeGeometry | null;
  bright: boolean;
}

const STAR_LAYERS: Record<
  StarLayer,
  {
    radiusMin: number;
    radiusMax: number;
    alphaMin: number;
    alphaMax: number;
    parallax: number;
    driftMul: number;
    glowMul: number;
  }
> = {
  far: {
    radiusMin: 0.2, radiusMax: 0.5, alphaMin: 0.08, alphaMax: 0.2,
    parallax: 0.3, driftMul: 0.3, glowMul: 2,
  },
  mid: {
    radiusMin: 0.5, radiusMax: 0.9, alphaMin: 0.15, alphaMax: 0.35,
    parallax: 0.7, driftMul: 0.7, glowMul: 4,
  },
  near: {
    radiusMin: 0.9, radiusMax: 1.4, alphaMin: 0.25, alphaMax: 0.5,
    parallax: 1.5, driftMul: 1.3, glowMul: 6,
  },
};

const STAR_COLORS = [
  { color: "255,255,255", weight: 0.85 },
  { color: "230,240,255", weight: 0.07 },
  { color: "255,210,127", weight: 0.06 },
  { color: "255,176,122", weight: 0.02 },
];

interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: string;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pickStarColor(rand: () => number): string {
  const roll = rand();
  let cumulative = 0;
  for (const entry of STAR_COLORS) {
    cumulative += entry.weight;
    if (roll < cumulative) return entry.color;
  }
  return STAR_COLORS[0].color;
}

function generateBgStars(w: number, h: number, count: number): BgStar[] {
  const rand = seededRandom(42);
  const stars: BgStar[] = [];
  const layerDist: { layer: StarLayer; share: number }[] = [
    { layer: "far", share: 0.5 },
    { layer: "mid", share: 0.3 },
    { layer: "near", share: 0.2 },
  ];
  for (const { layer, share } of layerDist) {
    const cfg = STAR_LAYERS[layer];
    const n = Math.round(count * share);
    for (let i = 0; i < n; i++) {
      const isBright = rand() < 0.01;
      const spikeChance = isBright
        ? 0.9
        : layer === "near"
          ? 0.45
          : layer === "mid"
            ? 0.15
            : 0;
      const hasSpikes = rand() < spikeChance;
      let spike: SpikeGeometry | null = null;
      if (hasSpikes) {
        const armRand = () => 0.6 + rand() * 0.6;
        spike = {
          lengthMul: 4 + rand() * 5,
          arms: [armRand(), armRand(), armRand(), armRand()],
          diagonals: rand() < 0.4,
          diagArms: [armRand(), armRand(), armRand(), armRand()],
        };
      }
      let r = cfg.radiusMin + rand() * (cfg.radiusMax - cfg.radiusMin);
      let alpha = cfg.alphaMin + rand() * (cfg.alphaMax - cfg.alphaMin);
      if (isBright) {
        r *= 1.6 + rand() * 0.4;
        alpha = Math.min(alpha * 1.8, 0.7);
      }
      stars.push({
        x: rand() * w,
        y: rand() * h,
        r,
        alpha,
        layer,
        phase: rand() * Math.PI * 2,
        color: pickStarColor(rand),
        spike,
        bright: isBright,
      });
    }
  }
  return stars;
}

function generateNebulae(w: number, h: number): Nebula[] {
  const rand = seededRandom(7);
  const colors = [
    "rgba(120, 150, 255, 0.06)",
    "rgba(255, 200, 120, 0.05)",
    "rgba(160, 120, 255, 0.04)",
    "rgba(100, 200, 220, 0.04)",
  ];
  return colors.map((color) => ({
    x: w * 0.15 + rand() * w * 0.7,
    y: h * 0.15 + rand() * h * 0.7,
    radius: Math.min(w, h) * (0.25 + rand() * 0.2),
    color,
  }));
}

/* ------------------------------------------------------------------ */
/*  Orbital layout helpers                                             */
/* ------------------------------------------------------------------ */

const ORBIT_SPEEDS: Record<SystemImportance, number> = {
  primary: 0.015,
  secondary: 0.010,
  minor: 0.008,
};

function getOrbitPosition(
  orbitIndex: number,
  angle: number,
  w: number,
  h: number,
  cx: number,
  cy: number,
) {
  const orbit = orbits[orbitIndex];
  const rx = orbit.rx * w;
  const ry = orbit.ry * h;
  const cosA = Math.cos(angle),
    sinA = Math.sin(angle);
  const cosR = Math.cos(orbit.rotation),
    sinR = Math.sin(orbit.rotation);
  const ox = rx * cosA,
    oy = ry * sinA;
  return {
    x: cx + ox * cosR - oy * sinR,
    y: cy + ox * sinR + oy * cosR,
  };
}

function getSystemPosition(
  sys: SystemNode,
  time: number,
  w: number,
  h: number,
  cx: number,
  cy: number,
) {
  const angle = sys.angle + time * ORBIT_SPEEDS[sys.importance] * 0.001;
  return getOrbitPosition(sys.orbit, angle, w, h, cx, cy);
}

function getDomainPosition(
  dom: DomainNode,
  w: number,
  h: number,
  cx: number,
  cy: number,
) {
  const base = getOrbitPosition(dom.orbit, dom.angle, w, h, cx, cy);
  return {
    x: base.x + dom.offset.x * w,
    y: base.y + dom.offset.y * h,
  };
}

function systemStarRadius(importance: SystemImportance, sf: number): number {
  switch (importance) {
    case "primary":
      return 7 * sf;
    case "secondary":
      return 4 * sf;
    case "minor":
      return 2.5 * sf;
  }
}

/* ------------------------------------------------------------------ */
/*  Hit detection types                                                */
/* ------------------------------------------------------------------ */

type HitResult =
  | { type: "system"; id: string; item: SystemNode }
  | { type: "domain"; id: string; item: DomainNode }
  | null;

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const MOBILE_BREAKPOINT = 640;
const BG_STAR_COUNT = 800;

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function SystemsGalaxy() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const bgStarsRef = useRef<BgStar[]>([]);
  const nebulaeRef = useRef<Nebula[]>([]);
  const mouseOffsetRef = useRef({ x: 0, y: 0 });
  const mousePosRef = useRef({ x: -1, y: -1 });
  const timeRef = useRef(0);

  const [dimensions, setDimensions] = useState({ width: 900, height: 600 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredType, setHoveredType] = useState<"system" | "domain" | null>(null);
  const hoveredIdRef = useRef<string | null>(null);
  const hoveredTypeRef = useRef<"system" | "domain" | null>(null);

  const isMobile = dimensions.width < MOBILE_BREAKPOINT;
  const isMobileRef = useRef(isMobile);

  useEffect(() => { hoveredIdRef.current = hoveredId; }, [hoveredId]);
  useEffect(() => { hoveredTypeRef.current = hoveredType; }, [hoveredType]);
  useEffect(() => { isMobileRef.current = isMobile; }, [isMobile]);

  // Build domain→systems lookup
  const domainToSystems = useRef(new Map<string, string[]>());
  useEffect(() => {
    const map = new Map<string, string[]>();
    for (const sys of systems) {
      for (const domId of sys.domains) {
        if (!map.has(domId)) map.set(domId, []);
        map.get(domId)!.push(sys.id);
      }
    }
    domainToSystems.current = map;
  }, []);

  // Measure
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const w = Math.round(el.getBoundingClientRect().width);
      if (w <= 0) return;
      const mobile = w < MOBILE_BREAKPOINT;
      const h = mobile ? 450 : 600;
      setDimensions({ width: w, height: h });
      bgStarsRef.current = generateBgStars(w, h, BG_STAR_COUNT);
      nebulaeRef.current = generateNebulae(w, h);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Get connected IDs for a hovered element
  const getHighlightedIds = useCallback(
    (id: string, type: "system" | "domain"): Set<string> => {
      const set = new Set<string>();
      set.add(id);
      if (type === "system") {
        const sys = systems.find((s) => s.id === id);
        if (sys) sys.domains.forEach((d) => set.add(d));
      } else {
        const connected = domainToSystems.current.get(id);
        if (connected) connected.forEach((s) => set.add(s));
      }
      return set;
    },
    [],
  );

  // Hit test helper
  const hitTest = useCallback(
    (mx: number, my: number, time: number, w: number, h: number, cx: number, cy: number, sf: number): HitResult => {
      // Check systems first
      for (const sys of systems) {
        const pos = getSystemPosition(sys, time, w, h, cx, cy);
        const hitR = systemStarRadius(sys.importance, sf) * 3 + 10;
        const dx = mx - pos.x, dy = my - pos.y;
        if (dx * dx + dy * dy < hitR * hitR) {
          return { type: "system", id: sys.id, item: sys };
        }
      }
      // Then domains
      for (const dom of domains) {
        const pos = getDomainPosition(dom, w, h, cx, cy);
        const dx = mx - pos.x, dy = my - pos.y;
        if (dx * dx + dy * dy < 20 * 20) {
          return { type: "domain", id: dom.id, item: dom };
        }
      }
      return null;
    },
    [],
  );

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const animate = (timestamp: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const time = timestamp / 1000;
      timeRef.current = time;

      const dpr = window.devicePixelRatio || 1;
      const w = dimensions.width;
      const h = dimensions.height;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.clearRect(0, 0, w, h);

      const px = mouseOffsetRef.current.x;
      const py = mouseOffsetRef.current.y;

      // Background drift
      const driftSpeed = 3;
      const driftAngle = -2.6;
      const driftX = time * driftSpeed * Math.cos(driftAngle);
      const driftY = time * driftSpeed * Math.sin(driftAngle);

      // --- Nebulae ---
      const nebulaDriftX = Math.sin(time * 0.15) * 6 * Math.cos(driftAngle);
      const nebulaDriftY = Math.sin(time * 0.15) * 6 * Math.sin(driftAngle);
      for (const neb of nebulaeRef.current) {
        const nx = neb.x + nebulaDriftX + px * 0.5;
        const ny = neb.y + nebulaDriftY + py * 0.5;
        const gradient = ctx.createRadialGradient(nx, ny, 0, nx, ny, neb.radius);
        gradient.addColorStop(0, neb.color);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      }

      // --- Background stars ---
      const cx = w / 2;
      const cy = h / 2;
      const maxDist = Math.sqrt(cx * cx + cy * cy);
      for (const star of bgStarsRef.current) {
        const cfg = STAR_LAYERS[star.layer];
        let sx = star.x + driftX * cfg.driftMul + px * cfg.parallax;
        let sy = star.y + driftY * cfg.driftMul + py * cfg.parallax;
        sx += Math.sin(time * 0.3 + star.phase) * 0.5;
        sy += Math.cos(time * 0.25 + star.phase) * 0.5;
        sx = ((sx % w) + w) % w;
        sy = ((sy % h) + h) % h;

        const dx = sx - cx;
        const dy = sy - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const falloff = Math.pow(1 - dist / maxDist, 1.8);

        const twinkleAmp = star.bright ? 0.3 : 0.15;
        const twinkle = 1 + Math.sin(time * 1.5 + star.phase) * twinkleAmp;
        const baseAlpha = star.alpha * twinkle * (0.4 + falloff * 0.6);

        const glowR = star.r * cfg.glowMul * (star.bright ? 1.5 : 1);
        const glowGradient = ctx.createRadialGradient(
          sx, sy, star.r * 0.3, sx, sy, glowR,
        );
        glowGradient.addColorStop(0, `rgba(${star.color}, ${baseAlpha * 0.4})`);
        glowGradient.addColorStop(0.5, `rgba(${star.color}, ${baseAlpha * 0.1})`);
        glowGradient.addColorStop(1, `rgba(${star.color}, 0)`);
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(sx, sy, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        ctx.globalAlpha = baseAlpha;
        ctx.beginPath();
        ctx.arc(sx, sy, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${star.color})`;
        ctx.fill();

        if (star.spike) {
          const sp = star.spike;
          const baseLen = star.r * sp.lengthMul * (0.85 + twinkle * 0.15);
          const spikeAlpha = baseAlpha * 0.3;
          ctx.strokeStyle = `rgb(${star.color})`;
          ctx.lineWidth = 0.5;

          ctx.globalAlpha = spikeAlpha;
          ctx.beginPath();
          ctx.moveTo(sx - baseLen * sp.arms[0], sy);
          ctx.lineTo(sx + baseLen * sp.arms[1], sy);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(sx, sy - baseLen * sp.arms[2]);
          ctx.lineTo(sx, sy + baseLen * sp.arms[3]);
          ctx.stroke();

          if (sp.diagonals) {
            const diagBase = baseLen * 0.5;
            ctx.globalAlpha = spikeAlpha * 0.45;
            ctx.beginPath();
            ctx.moveTo(sx - diagBase * sp.diagArms[0], sy - diagBase * sp.diagArms[0]);
            ctx.lineTo(sx + diagBase * sp.diagArms[1], sy + diagBase * sp.diagArms[1]);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(sx + diagBase * sp.diagArms[2], sy - diagBase * sp.diagArms[2]);
            ctx.lineTo(sx - diagBase * sp.diagArms[3], sy + diagBase * sp.diagArms[3]);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // --- Dust band ---
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(-0.18);
      const bandH = h * 0.35;
      const dustGrad = ctx.createLinearGradient(0, -bandH / 2, 0, bandH / 2);
      dustGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
      dustGrad.addColorStop(0.3, "rgba(0, 0, 0, 0.12)");
      dustGrad.addColorStop(0.5, "rgba(0, 0, 0, 0.18)");
      dustGrad.addColorStop(0.7, "rgba(0, 0, 0, 0.12)");
      dustGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = dustGrad;
      ctx.fillRect(-w, -bandH / 2, w * 2, bandH);
      ctx.restore();

      // --- Center radial glow ---
      const centerGlow = ctx.createRadialGradient(
        cx, cy, 0, cx, cy, Math.min(w, h) * 0.45,
      );
      centerGlow.addColorStop(0, "rgba(180, 160, 120, 0.08)");
      centerGlow.addColorStop(0.3, "rgba(120, 110, 90, 0.04)");
      centerGlow.addColorStop(0.7, "rgba(60, 55, 50, 0.01)");
      centerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, w, h);

      // --- Orbit ellipses ---
      for (const orbit of orbits) {
        ctx.strokeStyle = `rgba(150, 170, 200, ${orbit.opacity})`;
        ctx.lineWidth = 0.5;
        ctx.save();
        ctx.translate(cx + px, cy + py);
        ctx.rotate(orbit.rotation);
        ctx.beginPath();
        ctx.ellipse(0, 0, orbit.rx * w, orbit.ry * h, 0, 0, Math.PI * 2);
        ctx.restore();
        ctx.stroke();
      }

      // --- Center name ---
      const nameSize = Math.max(16, w * 0.028);
      const subtitleSize = Math.max(11, w * 0.014);
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(230, 225, 215, 0.85)";
      ctx.font = `500 ${nameSize}px system-ui, -apple-system, sans-serif`;
      ctx.fillText("Mehmet Fahri Özmen", cx + px, cy + py - 6);
      ctx.fillStyle = "rgba(180, 175, 165, 0.5)";
      ctx.font = `400 ${subtitleSize}px system-ui, -apple-system, sans-serif`;
      ctx.fillText(
        "Backend Systems Architect  ·  Engineering Leader",
        cx + px,
        cy + py + 14,
      );

      // --- Hover state ---
      const currentHoveredId = hoveredIdRef.current;
      const currentHoveredType = hoveredTypeRef.current;
      const highlighted =
        currentHoveredId && currentHoveredType
          ? getHighlightedIds(currentHoveredId, currentHoveredType)
          : null;

      const sf = isMobileRef.current ? 0.75 : 1;

      // --- Connection lines (hover only) ---
      if (highlighted && currentHoveredId) {
        ctx.strokeStyle = "rgba(120, 180, 240, 0.2)";
        ctx.lineWidth = 0.8;
        ctx.setLineDash([3, 4]);

        if (currentHoveredType === "system") {
          const sys = systems.find((s) => s.id === currentHoveredId);
          if (sys) {
            const sysPos = getSystemPosition(sys, time, w, h, cx, cy);
            for (const domId of sys.domains) {
              const dom = domains.find((d) => d.id === domId);
              if (dom) {
                const domPos = getDomainPosition(dom, w, h, cx, cy);
                ctx.beginPath();
                ctx.moveTo(sysPos.x + px, sysPos.y + py);
                ctx.lineTo(domPos.x + px, domPos.y + py);
                ctx.stroke();
              }
            }
          }
        } else if (currentHoveredType === "domain") {
          const dom = domains.find((d) => d.id === currentHoveredId);
          if (dom) {
            const domPos = getDomainPosition(dom, w, h, cx, cy);
            const connectedSystems = domainToSystems.current.get(currentHoveredId) || [];
            for (const sysId of connectedSystems) {
              const sys = systems.find((s) => s.id === sysId);
              if (sys) {
                const sysPos = getSystemPosition(sys, time, w, h, cx, cy);
                ctx.beginPath();
                ctx.moveTo(domPos.x + px, domPos.y + py);
                ctx.lineTo(sysPos.x + px, sysPos.y + py);
                ctx.stroke();
              }
            }
          }
        }
        ctx.setLineDash([]);
      }

      // --- Domain nodes ---
      for (const dom of domains) {
        const pos = getDomainPosition(dom, w, h, cx, cy);
        const dx = pos.x + px;
        const dy = pos.y + py;
        const isActive = highlighted?.has(dom.id);
        const isDimmed = highlighted && !isActive;

        if (isDimmed) {
          ctx.globalAlpha = 0.05;
        } else {
          ctx.globalAlpha = 1;
        }

        const domR = isActive ? 13 * sf : 9 * sf;
        // Subtle pulse when active
        const pulseR = isActive
          ? domR + Math.sin(time * 2) * 1.5
          : domR;

        // Fill
        ctx.beginPath();
        ctx.arc(dx, dy, pulseR, 0, Math.PI * 2);
        ctx.fillStyle = isActive
          ? "rgba(80, 140, 200, 0.25)"
          : "rgba(80, 140, 200, 0.15)";
        ctx.fill();

        // Border
        ctx.strokeStyle = isActive
          ? "rgba(100, 160, 220, 0.45)"
          : "rgba(100, 160, 220, 0.15)";
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Label
        ctx.font = `400 ${9 * sf}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.letterSpacing = "1px";
        ctx.fillStyle = isActive
          ? "rgba(140, 186, 232, 0.85)"
          : "rgba(96, 120, 136, 0.22)";
        ctx.fillText(dom.name.toUpperCase(), dx, dy + pulseR + 4);
        ctx.letterSpacing = "0px";
      }
      ctx.globalAlpha = 1;

      // --- System stars ---
      for (const sys of systems) {
        const pos = getSystemPosition(sys, time, w, h, cx, cy);
        const sx = pos.x + px;
        const sy = pos.y + py;
        const isHL = !highlighted || highlighted.has(sys.id);
        const isHovered = sys.id === currentHoveredId;
        const isDimmed = highlighted && !isHL;

        // Per-system twinkle phase
        let hash = 0;
        for (let c = 0; c < sys.id.length; c++) {
          hash = ((hash << 5) - hash + sys.id.charCodeAt(c)) | 0;
        }
        const nodePhase = ((hash % 1000) / 1000) * Math.PI * 2;
        const twinkle = 1 + Math.sin(time * 1.2 + nodePhase) * 0.1;

        let r = systemStarRadius(sys.importance, sf);
        if (isHovered) r *= 1.3;

        if (isDimmed) {
          ctx.globalAlpha = 0.15;
        } else {
          ctx.globalAlpha = 1;
        }

        if (sys.importance === "primary") {
          // Warm gold primary stars
          const glowR = isHovered ? r * 5 : r * 4;
          const glowAlpha = (isHovered ? 0.4 : 0.3) * twinkle;
          const gradient = ctx.createRadialGradient(
            sx, sy, r * 0.15, sx, sy, glowR,
          );
          gradient.addColorStop(0, `rgba(240, 192, 64, ${glowAlpha})`);
          gradient.addColorStop(0.4, `rgba(240, 192, 64, ${glowAlpha * 0.3})`);
          gradient.addColorStop(1, "rgba(240, 192, 64, 0)");
          ctx.beginPath();
          ctx.arc(sx, sy, glowR, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          // Core
          ctx.save();
          ctx.shadowColor = "rgba(240, 200, 80, 0.6)";
          ctx.shadowBlur = (isHovered ? 18 : 14) * twinkle;
          ctx.beginPath();
          ctx.arc(sx, sy, r, 0, Math.PI * 2);
          ctx.fillStyle = "#f0c040";
          ctx.fill();
          ctx.restore();

          // Diffraction spikes for primary stars
          const spikeLen = r * (3 + twinkle * 2);
          const spikeAlpha = (isDimmed ? 0.15 : 1) * 0.25 * twinkle;
          ctx.globalAlpha = spikeAlpha;
          ctx.strokeStyle = "#f0c040";
          ctx.lineWidth = 0.5;
          // Cross (+)
          ctx.beginPath();
          ctx.moveTo(sx - spikeLen, sy);
          ctx.lineTo(sx + spikeLen, sy);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(sx, sy - spikeLen);
          ctx.lineTo(sx, sy + spikeLen);
          ctx.stroke();
          // Diagonal (×) — thinner
          const diagLen = spikeLen * 0.6;
          ctx.globalAlpha = spikeAlpha * 0.5;
          ctx.lineWidth = 0.3;
          ctx.beginPath();
          ctx.moveTo(sx - diagLen, sy - diagLen);
          ctx.lineTo(sx + diagLen, sy + diagLen);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(sx + diagLen, sy - diagLen);
          ctx.lineTo(sx - diagLen, sy + diagLen);
          ctx.stroke();

          ctx.globalAlpha = isDimmed ? 0.15 : 1;
        } else if (sys.importance === "secondary") {
          // Blue-white secondary stars
          const glowR = isHovered ? r * 4 : r * 2.5;
          const glowAlpha = (isHovered ? 0.25 : 0.12) * twinkle;
          const gradient = ctx.createRadialGradient(
            sx, sy, r * 0.15, sx, sy, glowR,
          );
          gradient.addColorStop(0, `rgba(168, 196, 220, ${glowAlpha})`);
          gradient.addColorStop(0.5, `rgba(168, 196, 220, ${glowAlpha * 0.3})`);
          gradient.addColorStop(1, "rgba(168, 196, 220, 0)");
          ctx.beginPath();
          ctx.arc(sx, sy, glowR, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          ctx.save();
          ctx.shadowColor = "rgba(168, 196, 220, 0.4)";
          ctx.shadowBlur = (isHovered ? 12 : 6) * twinkle;
          ctx.beginPath();
          ctx.arc(sx, sy, r, 0, Math.PI * 2);
          ctx.fillStyle = "#a8c4dc";
          ctx.fill();
          ctx.restore();
        } else {
          // Dim minor stars
          const glowR = r * 1.8;
          const glowAlpha = 0.06 * twinkle;
          const gradient = ctx.createRadialGradient(
            sx, sy, r * 0.2, sx, sy, glowR,
          );
          gradient.addColorStop(0, `rgba(74, 85, 101, ${glowAlpha})`);
          gradient.addColorStop(1, "rgba(74, 85, 101, 0)");
          ctx.beginPath();
          ctx.arc(sx, sy, glowR, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(sx, sy, r, 0, Math.PI * 2);
          ctx.fillStyle = "#4a5565";
          ctx.fill();
        }

        // Hover ring
        if (isHovered) {
          ctx.beginPath();
          ctx.arc(sx, sy, r * 2.2, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        // Label
        const labelSize =
          sys.importance === "primary" ? 13 : 11;
        const labelWeight = sys.importance === "primary" ? 500 : 400;
        const labelAlpha = isHovered
          ? 1.0
          : isDimmed
            ? 0.15
            : sys.importance === "primary"
              ? 0.8
              : sys.importance === "secondary"
                ? 0.55
                : 0.3;

        ctx.globalAlpha = labelAlpha;
        ctx.font = `${labelWeight} ${labelSize * sf}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle =
          sys.importance === "primary"
            ? "rgba(240, 220, 170, 1)"
            : sys.importance === "secondary"
              ? "rgba(190, 210, 230, 1)"
              : "rgba(130, 140, 150, 1)";
        ctx.fillText(sys.name, sx, sy + r + 4);
        ctx.globalAlpha = 1;
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [dimensions, getHighlightedIds]);

  // Mouse interaction
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const nx = (mx / rect.width - 0.5) * 2;
      const ny = (my / rect.height - 0.5) * 2;
      mouseOffsetRef.current = { x: nx * 3, y: ny * 3 };
      mousePosRef.current = { x: mx, y: my };

      const w = dimensions.width;
      const h = dimensions.height;
      const sf = w < MOBILE_BREAKPOINT ? 0.75 : 1;
      const hit = hitTest(mx, my, timeRef.current, w, h, w / 2, h / 2, sf);

      if (hit) {
        setHoveredId(hit.id);
        setHoveredType(hit.type);
      } else {
        setHoveredId(null);
        setHoveredType(null);
      }
    },
    [dimensions, hitTest],
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null);
    setHoveredType(null);
    mouseOffsetRef.current = { x: 0, y: 0 };
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const w = dimensions.width;
      const h = dimensions.height;
      const sf = w < MOBILE_BREAKPOINT ? 0.75 : 1;
      const hit = hitTest(mx, my, timeRef.current, w, h, w / 2, h / 2, sf);
      if (hit?.type === "system" && hit.item.url) {
        window.open(hit.item.url, "_blank");
      }
    },
    [dimensions, hitTest],
  );

  const cursorStyle =
    hoveredId && hoveredType === "system"
      ? "pointer"
      : "default";

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

      <div
        ref={containerRef}
        className="relative mx-auto w-full max-w-5xl"
        style={{ height: dimensions.height }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{ cursor: cursorStyle }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        />
      </div>
    </section>
  );
}
