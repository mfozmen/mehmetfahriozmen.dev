"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  systems,
  domains,
  techClusters,
  orbits,
  SystemNode,
  DomainNode,
  TechClusterNode,
} from "@/data/systemsGraph";
import {
  satelliteOrbitRadius,
  getSystemPosition,
  getDomainPosition,
  getTechClusterPosition,
} from "@/lib/galaxyLayout";
import {
  type BgStar,
  STAR_LAYERS,
  DRIFT_ANGLE,
  seededRandom,
  generateBgStars,
  applyStarDrift,
} from "@/lib/galaxyStars";
import { generateNebulaTexture } from "@/lib/galaxyNebula";

/* ------------------------------------------------------------------ */
/*  Background helpers                                                 */
/* ------------------------------------------------------------------ */

interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: string;
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
/*  Local rendering helpers                                            */
/* ------------------------------------------------------------------ */

type SystemImportance = "primary" | "secondary" | "minor";

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
/*  Satellite helpers                                                  */
/* ------------------------------------------------------------------ */

function getSatellitePosition(
  clusterX: number,
  clusterY: number,
  techIndex: number,
  totalTechs: number,
  animProgress: number,
  time: number,
): { x: number; y: number } {
  const baseAngle = (Math.PI * 2 / totalTechs) * techIndex - Math.PI / 2;
  const orbitRadius = satelliteOrbitRadius(totalTechs);
  const wobble = Math.sin(time * 0.002 + techIndex * 0.7) * 0.03;
  const angle = baseAngle + wobble;
  const ease = 1 - Math.pow(1 - animProgress, 3);
  return {
    x: clusterX + Math.cos(angle) * orbitRadius * ease,
    y: clusterY + Math.sin(angle) * orbitRadius * ease,
  };
}

function drawSatellites(
  ctx: CanvasRenderingContext2D,
  cluster: TechClusterNode,
  clusterPos: { x: number; y: number },
  animProgress: number,
  time: number,
  mobile: boolean,
) {
  const techs = cluster.technologies;
  const total = techs.length;
  const orbitRadius = satelliteOrbitRadius(total);
  const ease = 1 - Math.pow(1 - animProgress, 3);

  ctx.save();

  // Faint orbit ring
  ctx.strokeStyle = `rgba(140, 120, 180, ${0.08 * ease})`;
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.arc(clusterPos.x, clusterPos.y, orbitRadius * ease, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < total; i++) {
    const pos = getSatellitePosition(clusterPos.x, clusterPos.y, i, total, animProgress, time);

    // Connector line from cluster to satellite
    ctx.strokeStyle = `rgba(140, 120, 180, ${0.12 * ease})`;
    ctx.lineWidth = 0.3;
    ctx.beginPath();
    ctx.moveTo(clusterPos.x, clusterPos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    // Satellite glow
    const grd = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 8);
    grd.addColorStop(0, `rgba(170, 150, 210, ${0.25 * ease})`);
    grd.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
    ctx.fill();

    // Satellite dot
    ctx.fillStyle = `rgba(180, 160, 220, ${0.7 * ease})`;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
    ctx.fill();

    // Satellite label — position outward from cluster center
    const angle = Math.atan2(pos.y - clusterPos.y, pos.x - clusterPos.x);
    const labelDistance = 14;
    const labelX = pos.x + Math.cos(angle) * labelDistance;
    const labelY = pos.y + Math.sin(angle) * labelDistance;

    ctx.globalAlpha = 0.75 * ease;
    ctx.fillStyle = "#c0b0e0";
    ctx.font = `400 ${mobile ? 8 : 10}px sans-serif`;

    if (Math.abs(angle) < Math.PI / 4 || Math.abs(angle) > 3 * Math.PI / 4) {
      ctx.textAlign = angle > -Math.PI / 2 && angle < Math.PI / 2 ? "left" : "right";
      ctx.textBaseline = "middle";
    } else {
      ctx.textAlign = "center";
      ctx.textBaseline = angle > 0 ? "top" : "bottom";
    }

    ctx.fillText(techs[i], labelX, labelY);
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  Galaxy atmosphere helpers                                          */
/* ------------------------------------------------------------------ */

function drawGalacticCenter(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number) {
  const r = Math.min(w, h);

  // Layer 1: Tight bright core
  const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.06);
  core.addColorStop(0, "rgba(255, 245, 220, 0.25)");
  core.addColorStop(0.5, "rgba(240, 220, 180, 0.12)");
  core.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = core;
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.06, 0, Math.PI * 2); ctx.fill();

  // Layer 2: Inner warm glow
  const inner = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.2);
  inner.addColorStop(0, "rgba(220, 200, 160, 0.15)");
  inner.addColorStop(0.4, "rgba(180, 160, 120, 0.08)");
  inner.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = inner;
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.2, 0, Math.PI * 2); ctx.fill();

  // Layer 3: Wide ambient glow
  const wide = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.45);
  wide.addColorStop(0, "rgba(150, 130, 100, 0.08)");
  wide.addColorStop(0.3, "rgba(100, 90, 70, 0.04)");
  wide.addColorStop(0.7, "rgba(60, 55, 45, 0.015)");
  wide.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = wide;
  ctx.fillRect(0, 0, w, h);
}

function drawLightRays(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number, time: number) {
  ctx.save();
  const rayCount = 8;
  const maxLen = Math.min(w, h) * 0.35;

  for (let i = 0; i < rayCount; i++) {
    const baseAngle = (Math.PI * 2 / rayCount) * i + 0.3;
    const wobble = Math.sin(time * 0.0003 + i * 1.7) * 0.05;
    const angle = baseAngle + wobble;
    const length = maxLen * (0.6 + Math.sin(i * 2.3) * 0.4);
    const opacity = 0.08 + Math.sin(i * 1.1) * 0.04;

    const endX = cx + Math.cos(angle) * length;
    const endY = cy + Math.sin(angle) * length;

    const grad = ctx.createLinearGradient(cx, cy, endX, endY);
    grad.addColorStop(0, `rgba(220, 200, 160, ${opacity * 2.5})`);
    grad.addColorStop(0.3, `rgba(200, 180, 140, ${opacity * 1.5})`);
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.5 + Math.sin(i * 0.7) * 1;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
  ctx.restore();
}

function drawDustBand(ctx: CanvasRenderingContext2D, w: number, h: number, cx: number, cy: number) {
  ctx.save();

  ctx.translate(cx, cy);
  ctx.rotate(-0.1);
  ctx.translate(-cx, -cy);

  // Main dust band — warm tones
  const bandHeight = h * 0.35;
  const bandY = cy - bandHeight / 2;
  const dust = ctx.createLinearGradient(0, bandY, 0, bandY + bandHeight);
  dust.addColorStop(0, "rgba(0, 0, 0, 0)");
  dust.addColorStop(0.2, "rgba(80, 65, 40, 0.08)");
  dust.addColorStop(0.35, "rgba(100, 80, 50, 0.14)");
  dust.addColorStop(0.5, "rgba(110, 90, 55, 0.18)");
  dust.addColorStop(0.65, "rgba(100, 80, 50, 0.14)");
  dust.addColorStop(0.8, "rgba(80, 65, 40, 0.08)");
  dust.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = dust;
  ctx.fillRect(0, bandY, w, bandHeight);

  // Horizontal falloff — dust is denser near center
  const hFade = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.5);
  hFade.addColorStop(0, "rgba(90, 75, 50, 0.10)");
  hFade.addColorStop(0.5, "rgba(70, 60, 40, 0.04)");
  hFade.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = hFade;
  ctx.fillRect(0, bandY, w, bandHeight);

  ctx.restore();
}

function drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number, cx: number, cy: number) {
  const maxR = Math.hypot(cx, cy);
  const vig = ctx.createRadialGradient(cx, cy, maxR * 0.3, cx, cy, maxR);
  vig.addColorStop(0, "rgba(0, 0, 0, 0)");
  vig.addColorStop(0.6, "rgba(0, 0, 0, 0.06)");
  vig.addColorStop(1, "rgba(0, 0, 0, 0.15)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);
}

/* ------------------------------------------------------------------ */
/*  Hit detection types                                                */
/* ------------------------------------------------------------------ */

type HitResult =
  | { type: "system"; id: string; item: SystemNode }
  | { type: "domain"; id: string; item: DomainNode }
  | { type: "tech"; id: string; item: TechClusterNode }
  | null;

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const MOBILE_BREAKPOINT = 640;
const BG_STAR_COUNT = 1200;

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function SystemsGalaxy() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const bgStarsRef = useRef<BgStar[]>([]);
  const nebulaeRef = useRef<Nebula[]>([]);
  const nebulaCanvasRef = useRef<OffscreenCanvas | null>(null);
  const mouseOffsetRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);

  const [dimensions, setDimensions] = useState({ width: 900, height: 600 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredType, setHoveredType] = useState<"system" | "domain" | "tech" | null>(null);
  const hoveredIdRef = useRef<string | null>(null);
  const hoveredTypeRef = useRef<"system" | "domain" | "tech" | null>(null);
  const satelliteAnimRef = useRef(0);
  const lastHoveredClusterRef = useRef<string | null>(null);
  const prevTimestampRef = useRef(0);

  const isMobile = dimensions.width < MOBILE_BREAKPOINT;
  const isMobileRef = useRef(isMobile);

  useEffect(() => { hoveredIdRef.current = hoveredId; }, [hoveredId]);
  useEffect(() => { hoveredTypeRef.current = hoveredType; }, [hoveredType]);
  useEffect(() => { isMobileRef.current = isMobile; }, [isMobile]);

  // Lookup maps
  const domainToSystems = useRef(new Map<string, string[]>());
  const techToSystems = useRef(new Map<string, string[]>());
  useEffect(() => {
    const domMap = new Map<string, string[]>();
    const techMap = new Map<string, string[]>();
    for (const sys of systems) {
      for (const domId of sys.domains) {
        if (!domMap.has(domId)) domMap.set(domId, []);
        domMap.get(domId)!.push(sys.id);
      }
      for (const tcId of sys.techClusters) {
        if (!techMap.has(tcId)) techMap.set(tcId, []);
        techMap.get(tcId)!.push(sys.id);
      }
    }
    domainToSystems.current = domMap;
    techToSystems.current = techMap;
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

      // Generate nebula noise texture on offscreen canvas (once)
      const nebulaTexture = generateNebulaTexture(w, h);
      const offscreen = new OffscreenCanvas(w, h);
      const offCtx = offscreen.getContext("2d");
      if (offCtx) {
        const imgData = new ImageData(new Uint8ClampedArray(nebulaTexture.data), w, h);
        offCtx.putImageData(imgData, 0, 0);
      }
      nebulaCanvasRef.current = offscreen;
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Get connected IDs for a hovered element
  const getHighlightedIds = useCallback(
    (id: string, type: "system" | "domain" | "tech"): Set<string> => {
      const set = new Set<string>();
      set.add(id);
      if (type === "system") {
        const sys = systems.find((s) => s.id === id);
        if (sys) {
          sys.domains.forEach((d) => set.add(d));
          sys.techClusters.forEach((t) => set.add(t));
        }
      } else if (type === "domain") {
        const connected = domainToSystems.current.get(id);
        if (connected) connected.forEach((s) => set.add(s));
      } else {
        const connected = techToSystems.current.get(id);
        if (connected) connected.forEach((s) => set.add(s));
      }
      return set;
    },
    [],
  );

  // Hit test helper
  const hitTest = useCallback(
    (opts: { mx: number; my: number; time: number; w: number; h: number; cx: number; cy: number; sf: number }): HitResult => {
      const { mx, my, time, w, h, cx, cy, sf } = opts;
      // Systems first
      for (const sys of systems) {
        const pos = getSystemPosition(sys, time, w, h, cx, cy);
        const hitR = systemStarRadius(sys.importance, sf) * 3 + 10;
        const dx = mx - pos.x, dy = my - pos.y;
        if (dx * dx + dy * dy < hitR * hitR) {
          return { type: "system", id: sys.id, item: sys };
        }
      }
      // Domains
      for (const dom of domains) {
        const pos = getDomainPosition(dom, w, h, cx, cy);
        const dx = mx - pos.x, dy = my - pos.y;
        if (dx * dx + dy * dy < 20 * 20) {
          return { type: "domain", id: dom.id, item: dom };
        }
      }
      // Tech clusters
      for (const tc of techClusters) {
        const pos = getTechClusterPosition(tc, w, h, cx, cy);
        const dx = mx - pos.x, dy = my - pos.y;
        if (dx * dx + dy * dy < 16 * 16) {
          return { type: "tech", id: tc.id, item: tc };
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

    const animate = (timestamp: number) => { // NOSONAR: S3776 — canvas render loop, complexity is inherent
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const time = timestamp / 1000;
      timeRef.current = time;
      const dt = prevTimestampRef.current > 0 ? (timestamp - prevTimestampRef.current) / 1000 : 0;
      prevTimestampRef.current = timestamp;

      // Satellite animation progress
      const currentHovType = hoveredTypeRef.current;
      const currentHovId = hoveredIdRef.current;
      if (currentHovType === "tech") {
        if (lastHoveredClusterRef.current !== currentHovId) {
          satelliteAnimRef.current = 0;
          lastHoveredClusterRef.current = currentHovId;
        }
        satelliteAnimRef.current = Math.min(1, satelliteAnimRef.current + dt * 2.5);
      } else {
        satelliteAnimRef.current = Math.max(0, satelliteAnimRef.current - dt * 4);
      }

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

      // --- 1. Nebulae ---
      const nebulaDriftX = Math.sin(time * 0.15) * 6 * Math.cos(DRIFT_ANGLE);
      const nebulaDriftY = Math.sin(time * 0.15) * 6 * Math.sin(DRIFT_ANGLE);
      for (const neb of nebulaeRef.current) {
        const nx = neb.x + nebulaDriftX + px * 0.5;
        const ny = neb.y + nebulaDriftY + py * 0.5;
        const gradient = ctx.createRadialGradient(nx, ny, 0, nx, ny, neb.radius);
        gradient.addColorStop(0, neb.color);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      }

      // --- 2. Background stars ---
      const cx = w / 2;
      const cy = h / 2;
      const maxDist = Math.hypot(cx, cy);
      for (const star of bgStarsRef.current) {
        const cfg = STAR_LAYERS[star.layer];
        const drifted = applyStarDrift(star, time, w, h);
        // Add parallax and twinkle wobble on top of drift
        let sx = drifted.x + px * cfg.parallax + Math.sin(time * 0.3 + star.phase) * 0.5;
        let sy = drifted.y + py * cfg.parallax + Math.cos(time * 0.25 + star.phase) * 0.5;
        // Clamp to canvas (parallax/wobble are small, simple clamp is fine)
        if (sx > w) { sx -= w; } else if (sx < 0) { sx += w; }
        if (sy > h) { sy -= h; } else if (sy < 0) { sy += h; }

        const sdx = sx - cx;
        const sdy = sy - cy;
        const dist = Math.hypot(sdx, sdy);
        const falloff = Math.pow(1 - dist / maxDist, 1.8);

        const twinkleAmp = star.bright ? 0.3 : 0.15;
        const twinkle = 1 + Math.sin(time * 1.5 + star.phase) * twinkleAmp;
        const baseAlpha = star.alpha * twinkle * (0.4 + falloff * 0.6) * drifted.fadeIn;

        const glowR = star.r * cfg.glowMul * (star.bright ? 2.25 : 1);
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

      // --- 3. Enhanced dust band ---
      drawDustBand(ctx, w, h, cx, cy);

      // --- 3b. Nebula noise texture ---
      if (nebulaCanvasRef.current) {
        ctx.drawImage(nebulaCanvasRef.current, 0, 0);
      }

      // --- 4. Multi-layer galactic center glow ---
      drawGalacticCenter(ctx, cx, cy, w, h);

      // --- 5. Light rays from center ---
      drawLightRays(ctx, cx, cy, w, h, timestamp);

      // --- 6. Vignette (edge darkening) ---
      drawVignette(ctx, w, h, cx, cy);

      // --- 7. Orbit ellipses (4 rings) ---
      for (const orbit of orbits) {
        ctx.strokeStyle = `rgba(150, 170, 200, ${orbit.opacity})`;
        ctx.lineWidth = 1;
        ctx.save();
        ctx.translate(cx + px, cy + py);
        ctx.rotate(orbit.rotation);
        ctx.beginPath();
        ctx.ellipse(0, 0, orbit.rx * w, orbit.ry * h, 0, 0, Math.PI * 2);
        ctx.restore();
        ctx.stroke();
      }

      // --- Hover state ---
      const currentHoveredId = hoveredIdRef.current;
      const currentHoveredType = hoveredTypeRef.current;
      const highlighted =
        currentHoveredId && currentHoveredType
          ? getHighlightedIds(currentHoveredId, currentHoveredType)
          : null;

      const sf = isMobileRef.current ? 0.75 : 1;

      // --- 7. Connection lines: tech cluster ↔ system (purple, thinnest) ---
      if (highlighted && currentHoveredId) {
        if (currentHoveredType === "system") {
          const sys = systems.find((s) => s.id === currentHoveredId);
          if (sys) {
            const sysPos = getSystemPosition(sys, time, w, h, cx, cy);
            // Tech cluster connections
            ctx.strokeStyle = "rgba(160, 140, 200, 0.15)";
            ctx.lineWidth = 0.6;
            ctx.setLineDash([2, 3]);
            for (const tcId of sys.techClusters) {
              const tc = techClusters.find((t) => t.id === tcId);
              if (tc) {
                const tcPos = getTechClusterPosition(tc, w, h, cx, cy);
                ctx.beginPath();
                ctx.moveTo(sysPos.x + px, sysPos.y + py);
                ctx.lineTo(tcPos.x + px, tcPos.y + py);
                ctx.stroke();
              }
            }
            ctx.setLineDash([]);
          }
        } else if (currentHoveredType === "tech") {
          const tc = techClusters.find((t) => t.id === currentHoveredId);
          if (tc) {
            const tcPos = getTechClusterPosition(tc, w, h, cx, cy);
            const connectedSystems = techToSystems.current.get(currentHoveredId) || [];
            ctx.strokeStyle = "rgba(160, 140, 200, 0.15)";
            ctx.lineWidth = 0.6;
            ctx.setLineDash([2, 3]);
            for (const sysId of connectedSystems) {
              const sys = systems.find((s) => s.id === sysId);
              if (sys) {
                const sysPos = getSystemPosition(sys, time, w, h, cx, cy);
                ctx.beginPath();
                ctx.moveTo(tcPos.x + px, tcPos.y + py);
                ctx.lineTo(sysPos.x + px, sysPos.y + py);
                ctx.stroke();
              }
            }
            ctx.setLineDash([]);
          }
        }
      }

      // --- 8. Connection lines: domain ↔ system (blue) ---
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

      // --- 9. Satellites (tech cluster hover) ---
      if (satelliteAnimRef.current > 0 && lastHoveredClusterRef.current) {
        const satCluster = techClusters.find((t) => t.id === lastHoveredClusterRef.current);
        if (satCluster) {
          const satPos = getTechClusterPosition(satCluster, w, h, cx, cy);
          drawSatellites(
            ctx,
            satCluster,
            { x: satPos.x + px, y: satPos.y + py },
            satelliteAnimRef.current,
            timestamp,
            isMobileRef.current,
          );
        }
      }

      // --- 10. Tech cluster nodes ---
      for (const tc of techClusters) {
        const pos = getTechClusterPosition(tc, w, h, cx, cy);
        const tx = pos.x + px;
        const ty = pos.y + py;
        const isActive = highlighted?.has(tc.id);
        const isDimmed = highlighted && !isActive;

        ctx.globalAlpha = isDimmed ? 0.04 : 1;

        const tcR = isActive ? 8 * sf : 6 * sf;
        const pulseR = isActive ? tcR + Math.sin(time * 2) * 1 : tcR;

        // Fill
        ctx.beginPath();
        ctx.arc(tx, ty, pulseR, 0, Math.PI * 2);
        ctx.fillStyle = isActive
          ? "rgba(140, 120, 180, 0.4)"
          : "rgba(140, 120, 180, 0.2)";
        ctx.fill();

        // Border
        ctx.strokeStyle = isActive
          ? "rgba(140, 120, 180, 0.5)"
          : "rgba(140, 120, 180, 0.25)";
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Label
        ctx.font = `500 ${8 * sf}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.letterSpacing = "1px";
        ctx.fillStyle = isActive
          ? "rgba(170, 150, 210, 0.75)"
          : "rgba(140, 120, 180, 0.25)";
        ctx.fillText(tc.name.toUpperCase(), tx, ty + pulseR + 3);
        ctx.letterSpacing = "0px";
      }
      ctx.globalAlpha = 1;

      // --- 11. Domain nodes ---
      for (const dom of domains) {
        const pos = getDomainPosition(dom, w, h, cx, cy);
        const dx = pos.x + px;
        const dy = pos.y + py;
        const isActive = highlighted?.has(dom.id);
        const isDimmed = highlighted && !isActive;

        ctx.globalAlpha = isDimmed ? 0.05 : 1;

        const domR = isActive ? 11 * sf : 7 * sf;
        const pulseR = isActive ? domR + Math.sin(time * 2) * 1.5 : domR;

        ctx.beginPath();
        ctx.arc(dx, dy, pulseR, 0, Math.PI * 2);
        ctx.fillStyle = isActive
          ? "rgba(80, 140, 200, 0.25)"
          : "rgba(80, 140, 200, 0.15)";
        ctx.fill();

        ctx.strokeStyle = isActive
          ? "rgba(100, 160, 220, 0.45)"
          : "rgba(100, 160, 220, 0.15)";
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.font = `500 ${8 * sf}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.letterSpacing = "1px";
        ctx.fillStyle = isActive
          ? "rgba(140, 186, 232, 0.85)"
          : "rgba(96, 120, 136, 0.18)";
        ctx.fillText(dom.name.toUpperCase(), dx, dy + pulseR + 4);
        ctx.letterSpacing = "0px";
      }
      ctx.globalAlpha = 1;

      // --- 12. System stars ---
      for (const sys of systems) {
        const pos = getSystemPosition(sys, time, w, h, cx, cy);
        const sx = pos.x + px;
        const sy = pos.y + py;
        const isHL = !highlighted || highlighted.has(sys.id);
        const isHovered = sys.id === currentHoveredId;
        const isDimmed = highlighted && !isHL;

        let hash = 0;
        for (const ch of sys.id) {
          hash = Math.trunc((hash << 5) - hash + ch.codePointAt(0)!);
        }
        const nodePhase = ((hash % 1000) / 1000) * Math.PI * 2;
        const twinkle = 1 + Math.sin(time * 1.2 + nodePhase) * 0.1;

        let r = systemStarRadius(sys.importance, sf);
        if (isHovered) r *= 1.3;

        ctx.globalAlpha = isDimmed ? 0.15 : 1;

        if (sys.importance === "primary") {
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

          ctx.save();
          ctx.shadowColor = "rgba(240, 200, 80, 0.6)";
          ctx.shadowBlur = (isHovered ? 18 : 14) * twinkle;
          ctx.beginPath();
          ctx.arc(sx, sy, r, 0, Math.PI * 2);
          ctx.fillStyle = "#f0c040";
          ctx.fill();
          ctx.restore();

          // Diffraction spikes
          const spikeLen = r * (3 + twinkle * 2);
          const spikeAlpha = (isDimmed ? 0.15 : 1) * 0.25 * twinkle;
          ctx.globalAlpha = spikeAlpha;
          ctx.strokeStyle = "#f0c040";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(sx - spikeLen, sy);
          ctx.lineTo(sx + spikeLen, sy);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(sx, sy - spikeLen);
          ctx.lineTo(sx, sy + spikeLen);
          ctx.stroke();
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
        const isPrimary = sys.importance === "primary";
        const isSecondary = sys.importance === "secondary";
        const labelSize = isPrimary ? 13 : 11;
        const labelWeight = isPrimary ? 500 : 400;

        let labelAlpha: number;
        if (isHovered) { labelAlpha = 1; }
        else if (isDimmed) { labelAlpha = 0.15; }
        else if (isPrimary) { labelAlpha = 0.8; }
        else if (isSecondary) { labelAlpha = 0.55; }
        else { labelAlpha = 0.3; }

        let labelColor: string;
        if (isPrimary) { labelColor = "rgba(240, 220, 170, 1)"; }
        else if (isSecondary) { labelColor = "rgba(190, 210, 230, 1)"; }
        else { labelColor = "rgba(130, 140, 150, 1)"; }

        ctx.globalAlpha = labelAlpha;
        ctx.font = `${labelWeight} ${labelSize * sf}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = labelColor;
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

      const w = dimensions.width;
      const h = dimensions.height;
      const sf = w < MOBILE_BREAKPOINT ? 0.75 : 1;
      const hit = hitTest({ mx, my, time: timeRef.current, w, h, cx: w / 2, cy: h / 2, sf });

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
      const hit = hitTest({ mx, my, time: timeRef.current, w, h, cx: w / 2, cy: h / 2, sf });
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
