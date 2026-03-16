/**
 * Pure canvas rendering functions for the galaxy visualization.
 * No React dependency — takes ctx + params, draws to canvas.
 */

import {
  systems,
  domains,
  techClusters,
  type SystemNode,
  type TechClusterNode,
} from "@/data/systemsGraph";
import {
  getSystemPosition,
  getDomainPosition,
  getTechClusterPosition,
} from "@/lib/galaxyLayout";
import { satelliteOrbitRadius } from "@/lib/galaxyLayout";
import { seededRandom } from "@/lib/galaxyStars";
import { mobileLabelSize, mobileLabelAlpha } from "@/lib/galaxyMobileConfig";

// --- Types ---

export interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: string;
}

export type SystemImportance = "primary" | "secondary" | "minor";

// --- Data generators ---

export function generateNebulae(w: number, h: number): Nebula[] {
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

// --- Helpers ---

export function systemStarRadius(importance: SystemImportance, sf: number): number {
  switch (importance) {
    case "primary":
      return 7 * sf;
    case "secondary":
      return 4 * sf;
    case "minor":
      return 2.5 * sf;
  }
}

// --- Satellite rendering ---

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

export function drawSatellites(
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

  ctx.strokeStyle = `rgba(140, 120, 180, ${0.08 * ease})`;
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.arc(clusterPos.x, clusterPos.y, orbitRadius * ease, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < total; i++) {
    const pos = getSatellitePosition(clusterPos.x, clusterPos.y, i, total, animProgress, time);

    ctx.strokeStyle = `rgba(140, 120, 180, ${0.12 * ease})`;
    ctx.lineWidth = 0.3;
    ctx.beginPath();
    ctx.moveTo(clusterPos.x, clusterPos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    const grd = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 8);
    grd.addColorStop(0, `rgba(170, 150, 210, ${0.25 * ease})`);
    grd.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(180, 160, 220, ${0.7 * ease})`;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
    ctx.fill();

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

// --- Atmosphere rendering ---

export function drawGalacticCenter(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number, glowScale: number = 1) {
  const r = Math.min(w, h);
  const g = glowScale;

  const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.06);
  core.addColorStop(0, `rgba(255, 245, 220, ${0.25 * g})`);
  core.addColorStop(0.5, `rgba(240, 220, 180, ${0.12 * g})`);
  core.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = core;
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.06, 0, Math.PI * 2); ctx.fill();

  const inner = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.2);
  inner.addColorStop(0, `rgba(220, 200, 160, ${0.15 * g})`);
  inner.addColorStop(0.4, `rgba(180, 160, 120, ${0.08 * g})`);
  inner.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = inner;
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.2, 0, Math.PI * 2); ctx.fill();

  const wide = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.45);
  wide.addColorStop(0, `rgba(150, 130, 100, ${0.08 * g})`);
  wide.addColorStop(0.3, `rgba(100, 90, 70, ${0.04 * g})`);
  wide.addColorStop(0.7, `rgba(60, 55, 45, ${0.015 * g})`);
  wide.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = wide;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.45, 0, Math.PI * 2);
  ctx.fill();
}

export function drawLightRays(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number, time: number) {
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

export function drawDustBand(ctx: CanvasRenderingContext2D, w: number, h: number, cx: number, cy: number) {
  ctx.save();

  ctx.translate(cx, cy);
  ctx.rotate(-0.1);
  ctx.translate(-cx, -cy);

  const dust = ctx.createLinearGradient(0, 0, 0, h);
  dust.addColorStop(0, "rgba(0, 0, 0, 0)");
  dust.addColorStop(0.3, "rgba(0, 0, 0, 0)");
  dust.addColorStop(0.4, "rgba(80, 65, 40, 0.08)");
  dust.addColorStop(0.47, "rgba(100, 80, 50, 0.14)");
  dust.addColorStop(0.5, "rgba(110, 90, 55, 0.18)");
  dust.addColorStop(0.53, "rgba(100, 80, 50, 0.14)");
  dust.addColorStop(0.6, "rgba(80, 65, 40, 0.08)");
  dust.addColorStop(0.7, "rgba(0, 0, 0, 0)");
  dust.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = dust;
  ctx.fillRect(-w * 0.2, 0, w * 1.4, h);

  const hFade = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.5);
  hFade.addColorStop(0, "rgba(90, 75, 50, 0.10)");
  hFade.addColorStop(0.5, "rgba(70, 60, 40, 0.04)");
  hFade.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = hFade;
  ctx.beginPath();
  ctx.arc(cx, cy, w * 0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number, cx: number, cy: number) {
  const maxR = Math.hypot(cx, cy);
  const vig = ctx.createRadialGradient(cx, cy, maxR * 0.3, cx, cy, maxR);
  vig.addColorStop(0, "rgba(0, 0, 0, 0)");
  vig.addColorStop(0.6, "rgba(0, 0, 0, 0.06)");
  vig.addColorStop(1, "rgba(0, 0, 0, 0.15)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);
}

// --- Connection line rendering ---

export function drawTechConnections(
  ctx: CanvasRenderingContext2D,
  hoveredId: string,
  hoveredType: string,
  time: number, w: number, h: number, cx: number, cy: number,
  px: number, py: number,
  techToSystems: Map<string, string[]>,
) {
  ctx.strokeStyle = "rgba(160, 140, 200, 0.15)";
  ctx.lineWidth = 0.6;
  ctx.setLineDash([2, 3]);

  if (hoveredType === "system") {
    const sys = systems.find((s) => s.id === hoveredId);
    if (sys) {
      const sysPos = getSystemPosition(sys, time, w, h, cx, cy);
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
    }
  } else if (hoveredType === "tech") {
    const tc = techClusters.find((t) => t.id === hoveredId);
    if (tc) {
      const tcPos = getTechClusterPosition(tc, w, h, cx, cy);
      const connected = techToSystems.get(hoveredId) || [];
      for (const sysId of connected) {
        const sys = systems.find((s) => s.id === sysId);
        if (sys) {
          const sysPos = getSystemPosition(sys, time, w, h, cx, cy);
          ctx.beginPath();
          ctx.moveTo(tcPos.x + px, tcPos.y + py);
          ctx.lineTo(sysPos.x + px, sysPos.y + py);
          ctx.stroke();
        }
      }
    }
  }

  ctx.setLineDash([]);
}

export function drawDomainConnections(
  ctx: CanvasRenderingContext2D,
  hoveredId: string,
  hoveredType: string,
  time: number, w: number, h: number, cx: number, cy: number,
  px: number, py: number,
  domainToSystems: Map<string, string[]>,
) {
  ctx.strokeStyle = "rgba(120, 180, 240, 0.2)";
  ctx.lineWidth = 0.8;
  ctx.setLineDash([3, 4]);

  if (hoveredType === "system") {
    const sys = systems.find((s) => s.id === hoveredId);
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
  } else if (hoveredType === "domain") {
    const dom = domains.find((d) => d.id === hoveredId);
    if (dom) {
      const domPos = getDomainPosition(dom, w, h, cx, cy);
      const connected = domainToSystems.get(hoveredId) || [];
      for (const sysId of connected) {
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

// --- System star rendering ---

function drawPrimaryStar(ctx: CanvasRenderingContext2D, sx: number, sy: number, r: number, twinkle: number, isHovered: boolean, isDimmed: boolean) {
  const glowR = isHovered ? r * 5 : r * 4;
  const glowAlpha = (isHovered ? 0.4 : 0.3) * twinkle;
  const gradient = ctx.createRadialGradient(sx, sy, r * 0.15, sx, sy, glowR);
  gradient.addColorStop(0, `rgba(240, 192, 64, ${glowAlpha})`);
  gradient.addColorStop(0.4, `rgba(240, 192, 64, ${glowAlpha * 0.3})`);
  gradient.addColorStop(1, "rgba(240, 192, 64, 0)");
  ctx.beginPath(); ctx.arc(sx, sy, glowR, 0, Math.PI * 2); ctx.fillStyle = gradient; ctx.fill();

  ctx.save();
  ctx.shadowColor = "rgba(240, 200, 80, 0.6)";
  ctx.shadowBlur = (isHovered ? 18 : 14) * twinkle;
  ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.fillStyle = "#f0c040"; ctx.fill();
  ctx.restore();

  const spikeLen = r * (3 + twinkle * 2);
  const spikeAlpha = (isDimmed ? 0.15 : 1) * 0.25 * twinkle;
  ctx.globalAlpha = spikeAlpha;
  ctx.strokeStyle = "#f0c040";
  ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(sx - spikeLen, sy); ctx.lineTo(sx + spikeLen, sy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(sx, sy - spikeLen); ctx.lineTo(sx, sy + spikeLen); ctx.stroke();
  const diagLen = spikeLen * 0.6;
  ctx.globalAlpha = spikeAlpha * 0.5;
  ctx.lineWidth = 0.3;
  ctx.beginPath(); ctx.moveTo(sx - diagLen, sy - diagLen); ctx.lineTo(sx + diagLen, sy + diagLen); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(sx + diagLen, sy - diagLen); ctx.lineTo(sx - diagLen, sy + diagLen); ctx.stroke();
  ctx.globalAlpha = isDimmed ? 0.15 : 1;
}

function drawSecondaryStar(ctx: CanvasRenderingContext2D, sx: number, sy: number, r: number, twinkle: number, isHovered: boolean) {
  const glowR = isHovered ? r * 4 : r * 2.5;
  const glowAlpha = (isHovered ? 0.25 : 0.12) * twinkle;
  const gradient = ctx.createRadialGradient(sx, sy, r * 0.15, sx, sy, glowR);
  gradient.addColorStop(0, `rgba(168, 196, 220, ${glowAlpha})`);
  gradient.addColorStop(0.5, `rgba(168, 196, 220, ${glowAlpha * 0.3})`);
  gradient.addColorStop(1, "rgba(168, 196, 220, 0)");
  ctx.beginPath(); ctx.arc(sx, sy, glowR, 0, Math.PI * 2); ctx.fillStyle = gradient; ctx.fill();

  ctx.save();
  ctx.shadowColor = "rgba(168, 196, 220, 0.4)";
  ctx.shadowBlur = (isHovered ? 12 : 6) * twinkle;
  ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.fillStyle = "#a8c4dc"; ctx.fill();
  ctx.restore();
}

function drawMinorStar(ctx: CanvasRenderingContext2D, sx: number, sy: number, r: number, twinkle: number) {
  const glowR = r * 1.8;
  const glowAlpha = 0.06 * twinkle;
  const gradient = ctx.createRadialGradient(sx, sy, r * 0.2, sx, sy, glowR);
  gradient.addColorStop(0, `rgba(74, 85, 101, ${glowAlpha})`);
  gradient.addColorStop(1, "rgba(74, 85, 101, 0)");
  ctx.beginPath(); ctx.arc(sx, sy, glowR, 0, Math.PI * 2); ctx.fillStyle = gradient; ctx.fill();
  ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.fillStyle = "#4a5565"; ctx.fill();
}

export function drawSystemStar(
  ctx: CanvasRenderingContext2D,
  sys: SystemNode,
  sx: number, sy: number,
  sf: number, time: number,
  isHovered: boolean, isDimmed: boolean,
  showLabel: boolean = true,
) {
  let hash = 0;
  for (const ch of sys.id) {
    hash = Math.trunc((hash << 5) - hash + ch.codePointAt(0)!);
  }
  const nodePhase = ((hash % 1000) / 1000) * Math.PI * 2;
  const twinkle = 1 + Math.sin(time * 1.2 + nodePhase) * 0.1;

  let r = systemStarRadius(sys.importance, sf);
  if (isHovered) { r *= 1.3; }

  ctx.globalAlpha = isDimmed ? 0.15 : 1;

  if (sys.importance === "primary") {
    drawPrimaryStar(ctx, sx, sy, r, twinkle, isHovered, isDimmed);
  } else if (sys.importance === "secondary") {
    drawSecondaryStar(ctx, sx, sy, r, twinkle, isHovered);
  } else {
    drawMinorStar(ctx, sx, sy, r, twinkle);
  }

  if (isHovered) {
    ctx.beginPath(); ctx.arc(sx, sy, r * 2.2, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"; ctx.lineWidth = 0.5; ctx.stroke();
  }

  // Label — only draw if showLabel is true (or if hovered)
  if (showLabel || isHovered) {
    const isPrimary = sys.importance === "primary";
    const isSecondary = sys.importance === "secondary";

    let labelAlpha: number;
    if (isHovered) { labelAlpha = 1; }
    else if (isDimmed) { labelAlpha = 0.15; }
    else { labelAlpha = mobileLabelAlpha(sys.importance, sf); }

    let labelColor: string;
    if (isPrimary) { labelColor = "rgba(240, 220, 170, 1)"; }
    else if (isSecondary) { labelColor = "rgba(190, 210, 230, 1)"; }
    else { labelColor = "rgba(130, 140, 150, 1)"; }

    const fontSize = mobileLabelSize(isPrimary ? 13 : 11, sf, 11);
    ctx.globalAlpha = labelAlpha;
    ctx.font = `${isPrimary ? 500 : 400} ${fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = labelColor;
    ctx.fillText(sys.name, sx, sy + r + 4);
  }
  ctx.globalAlpha = 1;
}

// --- Satellite animation helper ---

export function updateSatelliteAnim(
  hoveredType: string | null,
  hoveredId: string | null,
  lastHoveredCluster: string | null,
  currentAnim: number,
  dt: number,
): { anim: number; lastCluster: string | null } {
  if (hoveredType === "tech") {
    const lastCluster = lastHoveredCluster !== hoveredId ? hoveredId : lastHoveredCluster;
    const anim = lastHoveredCluster !== hoveredId ? Math.min(1, dt * 2.5) : Math.min(1, currentAnim + dt * 2.5);
    return { anim, lastCluster };
  }
  return { anim: Math.max(0, currentAnim - dt * 4), lastCluster: lastHoveredCluster };
}
