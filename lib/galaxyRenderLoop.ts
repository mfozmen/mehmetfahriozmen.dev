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
  systemStarRadius,
  drawSatellites,
  drawGalacticCenter,
  drawLightRays,
  drawDustBand,
  drawVignette,
} from "@/lib/galaxyRenderers";
import { getHighlightedIds } from "@/lib/galaxyInteraction";

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
    const drifted = applyStarDrift(star, time, w, h);
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
  drawGalacticCenter(ctx, cx, cy, w, h);

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

  // --- 8. Connection lines: tech cluster ↔ system ---
  if (highlighted && hoveredId) {
    if (hoveredType === "system") {
      const sys = systems.find((s) => s.id === hoveredId);
      if (sys) {
        const sysPos = getSystemPosition(sys, time, w, h, cx, cy);
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
    } else if (hoveredType === "tech") {
      const tc = techClusters.find((t) => t.id === hoveredId);
      if (tc) {
        const tcPos = getTechClusterPosition(tc, w, h, cx, cy);
        const connectedSystems = techToSystems.get(hoveredId) || [];
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

  // --- 9. Connection lines: domain ↔ system ---
  if (highlighted && hoveredId) {
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
        const connectedSystems = domainToSystems.get(hoveredId) || [];
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
      ctx.font = `500 ${9 * sf}px system-ui, -apple-system, sans-serif`;
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
      ctx.font = `500 ${9 * sf}px system-ui, -apple-system, sans-serif`;
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
  for (const sys of systems) { // NOSONAR: S3776 — canvas render loop
    const pos = getSystemPosition(sys, time, w, h, cx, cy);
    const sx = pos.x + px;
    const sy = pos.y + py;
    const isHL = !highlighted || highlighted.has(sys.id);
    const isHovered = sys.id === hoveredId;
    const isDimmed = highlighted && !isHL;

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
    } else if (sys.importance === "secondary") {
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
    } else {
      const glowR = r * 1.8;
      const glowAlpha = 0.06 * twinkle;
      const gradient = ctx.createRadialGradient(sx, sy, r * 0.2, sx, sy, glowR);
      gradient.addColorStop(0, `rgba(74, 85, 101, ${glowAlpha})`);
      gradient.addColorStop(1, "rgba(74, 85, 101, 0)");
      ctx.beginPath(); ctx.arc(sx, sy, glowR, 0, Math.PI * 2); ctx.fillStyle = gradient; ctx.fill();
      ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.fillStyle = "#4a5565"; ctx.fill();
    }

    if (isHovered) {
      ctx.beginPath(); ctx.arc(sx, sy, r * 2.2, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"; ctx.lineWidth = 0.5; ctx.stroke();
    }

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
}
