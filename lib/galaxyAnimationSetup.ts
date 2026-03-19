/**
 * Shared animation frame setup used by both Desktop and Mobile galaxy components.
 * Handles ctx acquisition, DPR scaling, time tracking, and satellite animation.
 */

import { updateSatelliteAnim } from "@/lib/galaxyRenderers";

export interface GalaxyRefs {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  animFrameRef: React.MutableRefObject<number>;
  timeRef: React.MutableRefObject<number>;
  prevTimestampRef: React.MutableRefObject<number>;
  hoveredTypeRef: React.MutableRefObject<string | null>;
  hoveredIdRef: React.MutableRefObject<string | null>;
  lastHoveredClusterRef: React.MutableRefObject<string | null>;
  satelliteAnimRef: React.MutableRefObject<number>;
}

export interface FrameContext {
  ctx: CanvasRenderingContext2D;
  time: number;
  w: number;
  h: number;
}

/**
 * Prepares a single animation frame: acquires context, scales for DPR,
 * advances time, and updates satellite animation.
 * Returns null if canvas/ctx is unavailable (caller should skip rendering).
 */
export function prepareFrame(
  canvas: HTMLCanvasElement,
  timestamp: number,
  refs: GalaxyRefs,
  dimensions: { width: number; height: number },
): FrameContext | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const time = timestamp / 1000;
  refs.timeRef.current = time;
  const dt = refs.prevTimestampRef.current > 0
    ? (timestamp - refs.prevTimestampRef.current) / 1000
    : 0;
  refs.prevTimestampRef.current = timestamp;

  const satUpdate = updateSatelliteAnim(
    refs.hoveredTypeRef.current, refs.hoveredIdRef.current,
    refs.lastHoveredClusterRef.current, refs.satelliteAnimRef.current, dt,
  );
  refs.satelliteAnimRef.current = satUpdate.anim;
  refs.lastHoveredClusterRef.current = satUpdate.lastCluster;

  const dpr = window.devicePixelRatio || 1;
  const { width: w, height: h } = dimensions;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  return { ctx, time, w, h };
}
