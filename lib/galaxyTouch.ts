/**
 * Touch interaction and responsive layout utilities for the galaxy canvas.
 */

export const ASPECT_RATIO = 1.6; // 16:10
export const MIN_ZOOM = 1;
export const MAX_ZOOM = 3;

export function clampZoom(zoom: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
}

export function clampPan(
  x: number,
  y: number,
  zoom: number,
  canvasW: number,
  canvasH: number,
): { x: number; y: number } {
  if (zoom <= 1) return { x: 0, y: 0 };
  const maxX = (canvasW * (zoom - 1)) / 2;
  const maxY = (canvasH * (zoom - 1)) / 2;
  return {
    x: Math.min(maxX, Math.max(-maxX, x)),
    y: Math.min(maxY, Math.max(-maxY, y)),
  };
}

export function computePinchZoom(opts: {
  initialDistance: number;
  currentDistance: number;
  initialZoom: number;
}): number {
  return opts.initialZoom * (opts.currentDistance / opts.initialDistance);
}
