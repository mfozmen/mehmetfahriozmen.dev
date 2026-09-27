import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

function createMockCtx() {
  const gradient = { addColorStop: vi.fn() };
  return {
    save: vi.fn(), restore: vi.fn(), translate: vi.fn(), rotate: vi.fn(),
    createLinearGradient: vi.fn(() => gradient), createRadialGradient: vi.fn(() => gradient),
    fillRect: vi.fn(), beginPath: vi.fn(), arc: vi.fn(), fill: vi.fn(),
    drawImage: vi.fn(),
    globalCompositeOperation: "source-over", fillStyle: "",
  } as unknown as CanvasRenderingContext2D;
}

describe("drawDustBand", () => {
  let created: { w: number; h: number }[];
  let drawDustBand: typeof import("@/lib/galaxyRenderers").drawDustBand;

  // Fresh module per test: the band cache lives at module level.
  beforeEach(async () => {
    vi.resetModules();
    ({ drawDustBand } = await import("@/lib/galaxyRenderers"));
    created = [];
    vi.stubGlobal("OffscreenCanvas", class {
      constructor(public width: number, public height: number) { created.push({ w: width, h: height }); }
      getContext() { return createMockCtx(); }
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // The band depends only on the canvas size, and rebuilding its full-size
  // offscreen canvas every frame cost roughly half of each galaxy frame.
  it("builds the dust band once and reuses it on later frames", () => {
    const ctx = createMockCtx();

    drawDustBand(ctx, 900, 563, 450, 281.5);
    drawDustBand(ctx, 900, 563, 450, 281.5);

    expect(created).toHaveLength(1);
    expect(ctx.drawImage).toHaveBeenCalledTimes(2);
  });

  it("rebuilds the dust band when the canvas size changes", () => {
    const ctx = createMockCtx();

    drawDustBand(ctx, 900, 563, 450, 281.5);
    drawDustBand(ctx, 348, 218, 174, 109);

    expect(created).toEqual([{ w: 900, h: 563 }, { w: 348, h: 218 }]);
  });
});
