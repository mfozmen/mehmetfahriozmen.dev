import { describe, it, expect, vi } from "vitest";
import { starGlowGradient } from "@/lib/galaxyRenderLoop";
import type { BgStar } from "@/lib/galaxyStars";

function createMockCtx() {
  const stops: [number, string][] = [];
  const gradient = { addColorStop: vi.fn((o: number, c: string) => stops.push([o, c])) };
  const ctx = { createRadialGradient: vi.fn(() => gradient) } as unknown as CanvasRenderingContext2D;
  return { ctx, gradient, stops };
}

const star = { r: 1, color: "255,210,127" } as BgStar;

describe("starGlowGradient", () => {
  // The caller translates to the star and applies its alpha through
  // globalAlpha, so the gradient is built once around the origin at unit alpha.
  it("builds the glow around the origin with the star's colour at unit alpha", () => {
    const { ctx, stops } = createMockCtx();

    starGlowGradient(ctx, star, 6);

    expect(ctx.createRadialGradient).toHaveBeenCalledWith(0, 0, 0.3, 0, 0, 6);
    expect(stops).toEqual([
      [0, "rgba(255,210,127, 0.4)"],
      [0.5, "rgba(255,210,127, 0.1)"],
      [1, "rgba(255,210,127, 0)"],
    ]);
  });

  it("reuses the gradient on later frames", () => {
    const { ctx, gradient } = createMockCtx();
    const s = { ...star };

    expect(starGlowGradient(ctx, s, 6)).toBe(gradient);
    expect(starGlowGradient(ctx, s, 6)).toBe(gradient);
    expect(ctx.createRadialGradient).toHaveBeenCalledTimes(1);
  });
});
