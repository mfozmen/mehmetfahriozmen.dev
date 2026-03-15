/**
 * Pure canvas rendering functions for the galaxy visualization.
 * No React dependency — takes ctx + params, draws to canvas.
 */

import { type TechClusterNode } from "@/data/systemsGraph";
import { satelliteOrbitRadius } from "@/lib/galaxyLayout";
import { seededRandom } from "@/lib/galaxyStars";

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

export function drawGalacticCenter(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number) {
  const r = Math.min(w, h);

  const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.06);
  core.addColorStop(0, "rgba(255, 245, 220, 0.25)");
  core.addColorStop(0.5, "rgba(240, 220, 180, 0.12)");
  core.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = core;
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.06, 0, Math.PI * 2); ctx.fill();

  const inner = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.2);
  inner.addColorStop(0, "rgba(220, 200, 160, 0.15)");
  inner.addColorStop(0.4, "rgba(180, 160, 120, 0.08)");
  inner.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = inner;
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.2, 0, Math.PI * 2); ctx.fill();

  const wide = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.45);
  wide.addColorStop(0, "rgba(150, 130, 100, 0.08)");
  wide.addColorStop(0.3, "rgba(100, 90, 70, 0.04)");
  wide.addColorStop(0.7, "rgba(60, 55, 45, 0.015)");
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
