/**
 * Galaxy render loop — pure canvas drawing orchestration.
 * Called each animation frame by the component.
 */

import {
  systems,
  domains,
  techClusters,
  orbits,
} from "@/data/systemsGraph";
import {
  getSystemPosition,
  getDomainPosition,
  getTechClusterPosition,
} from "@/lib/galaxyLayout";
import {
  type BgStar,
  STAR_LAYERS,
  DRIFT_ANGLE,
  applyStarDrift,
} from "@/lib/galaxyStars";
import {
  type Nebula,
  drawSatellites,
  drawGalacticCenter,
  drawLightRays,
  drawDustBand,
  drawVignette,
  drawTechConnections,
  drawDomainConnections,
  drawSystemStar,
} from "@/lib/galaxyRenderers";
import { getHighlightedIds } from "@/lib/galaxyInteraction";
import { mobileLabelSize } from "@/lib/galaxyMobileConfig";

export interface RenderOpts {
  w: number;
  h: number;
  time: number;
  timestamp: number;
  stars: BgStar[];
  nebulae: Nebula[];
  nebulaCanvas: OffscreenCanvas | null;
  px: number;
  py: number;
  sf: number;
  zoom: number;
  pan: { x: number; y: number };
  hoveredId: string | null;
  hoveredType: "system" | "domain" | "tech" | null;
  domainToSystems: Map<string, string[]>;
  techToSystems: Map<string, string[]>;
  satelliteAnim: number;
  lastHoveredCluster: string | null;
  showLabels: { domains: boolean; techClusters: boolean };
  centerGlowScale: number;
  driftSpeedMultiplier: number;
}

export function renderGalaxyFrame(
  ctx: CanvasRenderingContext2D,
  opts: RenderOpts,
): void {
  const {
    w, h, time, timestamp, stars, nebulae, nebulaCanvas,
    px, py, sf, zoom, pan,
    hoveredId, hoveredType,
    domainToSystems, techToSystems,
    satelliteAnim, lastHoveredCluster,
    centerGlowScale, driftSpeedMultiplier,
    showLabels,
  } = opts;

  // Apply zoom/pan transform
  if (zoom > 1) {
    const cx0 = w / 2;
    const cy0 = h / 2;
    ctx.translate(cx0 + pan.x, cy0 + pan.y);
    ctx.scale(zoom, zoom);
    ctx.translate(-cx0, -cy0);
  }

  ctx.clearRect(-w, -h, w * 3, h * 3);

  // --- 1. Nebulae ---
  const nebulaDriftX = Math.sin(time * 0.15) * 6 * Math.cos(DRIFT_ANGLE);
  const nebulaDriftY = Math.sin(time * 0.15) * 6 * Math.sin(DRIFT_ANGLE);
  for (const neb of nebulae) {
    const nx = neb.x + nebulaDriftX + px * 0.5;
    const ny = neb.y + nebulaDriftY + py * 0.5;
    const gradient = ctx.createRadialGradient(nx, ny, 0, nx, ny, neb.radius);
    gradient.addColorStop(0, neb.color);
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(nx, ny, neb.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- 2. Background stars ---
  const cx = w / 2;
  const cy = h / 2;
  const maxDist = Math.hypot(cx, cy);
  for (const star of stars) {
    const cfg = STAR_LAYERS[star.layer];
    const drifted = applyStarDrift(star, time * driftSpeedMultiplier, w, h);
    let sx = drifted.x + px * cfg.parallax + Math.sin(time * 0.3 + star.phase) * 0.5;
    let sy = drifted.y + py * cfg.parallax + Math.cos(time * 0.25 + star.phase) * 0.5;
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
    const glowGradient = ctx.createRadialGradient(sx, sy, star.r * 0.3, sx, sy, glowR);
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

  // --- 3. Dust band ---
  drawDustBand(ctx, w, h, cx, cy);

  // --- 3b. Nebula noise texture ---
  if (nebulaCanvas) {
    ctx.drawImage(nebulaCanvas, 0, 0);
  }

  // --- 4. Galactic center glow ---
  drawGalacticCenter(ctx, cx, cy, w, h, centerGlowScale);

  // --- 5. Light rays ---
  drawLightRays(ctx, cx, cy, w, h, timestamp);

  // --- 6. Vignette ---
  drawVignette(ctx, w, h, cx, cy);

  // --- 7. Orbit ellipses ---
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
  const highlighted =
    hoveredId && hoveredType
      ? getHighlightedIds(hoveredId, hoveredType, domainToSystems, techToSystems)
      : null;

  const smallScreen = sf < 0.7;

  // --- 8. Connection lines ---
  if (highlighted && hoveredId && hoveredType) {
    drawTechConnections(ctx, hoveredId, hoveredType, time, w, h, cx, cy, px, py, techToSystems);
    drawDomainConnections(ctx, hoveredId, hoveredType, time, w, h, cx, cy, px, py, domainToSystems);
  }

  // --- 10. Satellites ---
  if (satelliteAnim > 0 && lastHoveredCluster) {
    const satCluster = techClusters.find((t) => t.id === lastHoveredCluster);
    if (satCluster) {
      const satPos = getTechClusterPosition(satCluster, w, h, cx, cy);
      drawSatellites(
        ctx, satCluster,
        { x: satPos.x + px, y: satPos.y + py },
        satelliteAnim, timestamp, smallScreen,
      );
    }
  }

  // --- 11. Tech cluster nodes ---
  for (const tc of techClusters) {
    const pos = getTechClusterPosition(tc, w, h, cx, cy);
    const tx = pos.x + px;
    const ty = pos.y + py;
    const isActive = highlighted?.has(tc.id);
    const isDimmed = highlighted && !isActive;

    ctx.globalAlpha = isDimmed ? 0.04 : 1;

    const tcR = isActive ? 8 * sf : 6 * sf;
    const pulseR = isActive ? tcR + Math.sin(time * 2) * 1 : tcR;

    ctx.beginPath();
    ctx.arc(tx, ty, pulseR, 0, Math.PI * 2);
    ctx.fillStyle = isActive ? "rgba(140, 120, 180, 0.4)" : "rgba(140, 120, 180, 0.2)";
    ctx.fill();

    ctx.strokeStyle = isActive ? "rgba(140, 120, 180, 0.5)" : "rgba(140, 120, 180, 0.25)";
    ctx.lineWidth = 0.5;
    ctx.stroke();

    if ((showLabels.techClusters || isActive) && !isDimmed) {
      ctx.font = `500 ${mobileLabelSize(9, sf, 8)}px system-ui, -apple-system, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.letterSpacing = "1px";
      ctx.fillStyle = isActive ? "rgba(170, 150, 210, 0.75)" : "rgba(180, 170, 210, 0.35)";
      ctx.fillText(tc.name.toUpperCase(), tx, ty + pulseR + 3);
      ctx.letterSpacing = "0px";
    }
  }
  ctx.globalAlpha = 1;

  // --- 12. Domain nodes ---
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
    ctx.fillStyle = isActive ? "rgba(80, 140, 200, 0.25)" : "rgba(80, 140, 200, 0.15)";
    ctx.fill();

    ctx.strokeStyle = isActive ? "rgba(100, 160, 220, 0.45)" : "rgba(100, 160, 220, 0.15)";
    ctx.lineWidth = 0.5;
    ctx.stroke();

    if ((showLabels.domains || isActive) && !isDimmed) {
      ctx.font = `500 ${mobileLabelSize(9, sf, 8)}px system-ui, -apple-system, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.letterSpacing = "1px";
      ctx.fillStyle = isActive ? "rgba(140, 186, 232, 0.85)" : "rgba(130, 160, 190, 0.35)";
      ctx.fillText(dom.name.toUpperCase(), dx, dy + pulseR + 4);
      ctx.letterSpacing = "0px";
    }
  }
  ctx.globalAlpha = 1;

  // --- 13. System stars ---
  for (const sys of systems) {
    const pos = getSystemPosition(sys, time, w, h, cx, cy);
    const isHL = !highlighted || highlighted.has(sys.id);
    const isDimmed = highlighted && !isHL;
    drawSystemStar(ctx, sys, pos.x + px, pos.y + py, sf, time, sys.id === hoveredId, !!isDimmed);
  }
}
