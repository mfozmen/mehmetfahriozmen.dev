import { describe, it, expect } from "vitest";
import {
  clampZoom,
  clampPan,
  computePinchZoom,
  ASPECT_RATIO,
  MIN_ZOOM,
  MAX_ZOOM,
} from "@/lib/galaxyTouch";

describe("Galaxy aspect ratio", () => {
  it("ASPECT_RATIO is 16:10 (1.6)", () => {
    expect(ASPECT_RATIO).toBe(1.6);
  });

  it("height is computed from width using aspect ratio", () => {
    // At 400px width, height should be 400 / 1.6 = 250
    expect(400 / ASPECT_RATIO).toBe(250);
    // At 948px width, height should be 948 / 1.6 = 592.5
    expect(948 / ASPECT_RATIO).toBeCloseTo(592.5);
  });
});

describe("Pinch zoom calculation", () => {
  it("returns zoom factor based on distance ratio", () => {
    // Fingers 100px apart initially, spread to 200px → 2x zoom
    const result = computePinchZoom({
      initialDistance: 100,
      currentDistance: 200,
      initialZoom: 1,
    });
    expect(result).toBe(2);
  });

  it("handles zoom from non-1x base", () => {
    // Already at 1.5x, spread to 2x distance → 3x total
    const result = computePinchZoom({
      initialDistance: 100,
      currentDistance: 200,
      initialZoom: 1.5,
    });
    expect(result).toBe(3);
  });

  it("pinch in reduces zoom", () => {
    // Fingers 200px apart, pinch to 100px → 0.5x zoom
    const result = computePinchZoom({
      initialDistance: 200,
      currentDistance: 100,
      initialZoom: 1,
    });
    expect(result).toBe(0.5);
  });
});

describe("Zoom clamping", () => {
  it("MIN_ZOOM is 1 and MAX_ZOOM is 3", () => {
    expect(MIN_ZOOM).toBe(1);
    expect(MAX_ZOOM).toBe(3);
  });

  it("clamps below minimum to 1", () => {
    expect(clampZoom(0.5)).toBe(1);
    expect(clampZoom(0)).toBe(1);
  });

  it("clamps above maximum to 3", () => {
    expect(clampZoom(4)).toBe(3);
    expect(clampZoom(10)).toBe(3);
  });

  it("passes through values in range", () => {
    expect(clampZoom(1)).toBe(1);
    expect(clampZoom(2)).toBe(2);
    expect(clampZoom(3)).toBe(3);
    expect(clampZoom(1.5)).toBe(1.5);
  });
});

describe("Pan clamping", () => {
  // Canvas 400x250, at 2x zoom the viewable area is 200x125
  // Pan should be bounded so edges don't show empty space
  const canvasW = 400;
  const canvasH = 250;

  it("returns 0,0 when not zoomed (zoom=1)", () => {
    const result = clampPan(100, 100, 1, canvasW, canvasH);
    expect(result).toEqual({ x: 0, y: 0 });
  });

  it("allows panning within bounds at 2x zoom", () => {
    // At 2x, max pan = canvas * (zoom-1) / 2 = 400 * 0.5 = 200 in x
    const result = clampPan(50, 30, 2, canvasW, canvasH);
    expect(result.x).toBe(50);
    expect(result.y).toBe(30);
  });

  it("clamps pan to prevent showing empty space", () => {
    // At 2x, max pan x = 400 * (2-1) / 2 = 200
    const result = clampPan(300, 200, 2, canvasW, canvasH);
    expect(result.x).toBe(200);
    expect(result.y).toBe(125);
  });

  it("clamps negative pan values", () => {
    const result = clampPan(-300, -200, 2, canvasW, canvasH);
    expect(result.x).toBe(-200);
    expect(result.y).toBe(-125);
  });
});
