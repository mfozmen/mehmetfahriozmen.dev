import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { prepareFrame, type GalaxyRefs } from "@/lib/galaxyAnimationSetup";

function createMockCanvas(ctxOrNull: object | null) {
  return {
    getContext: vi.fn().mockReturnValue(ctxOrNull),
    width: 0,
    height: 0,
    style: { width: "", height: "" },
  } as unknown as HTMLCanvasElement;
}

function createMockCtx() {
  return { setTransform: vi.fn() } as unknown as CanvasRenderingContext2D;
}

function createRefs(overrides?: Partial<Record<keyof GalaxyRefs, unknown>>): GalaxyRefs {
  return {
    canvasRef: { current: null },
    animFrameRef: { current: 0 },
    timeRef: { current: 0 },
    prevTimestampRef: { current: 0 },
    hoveredTypeRef: { current: null },
    hoveredIdRef: { current: null },
    lastHoveredClusterRef: { current: null },
    satelliteAnimRef: { current: 0 },
    ...overrides,
  } as GalaxyRefs;
}

const DIMS = { width: 948, height: 600 };

describe("prepareFrame", () => {
  beforeEach(() => {
    vi.stubGlobal("window", { devicePixelRatio: 2 });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns null when getContext returns null", () => {
    const canvas = createMockCanvas(null);
    const refs = createRefs();
    const result = prepareFrame(canvas, 1000, refs, DIMS);
    expect(result).toBeNull();
  });

  it("returns FrameContext with correct time, w, h", () => {
    const mockCtx = createMockCtx();
    const canvas = createMockCanvas(mockCtx);
    const refs = createRefs();
    const result = prepareFrame(canvas, 2500, refs, DIMS);

    expect(result).not.toBeNull();
    expect(result!.ctx).toBe(mockCtx);
    expect(result!.time).toBe(2.5); // 2500ms / 1000
    expect(result!.w).toBe(948);
    expect(result!.h).toBe(600);
  });

  it("updates timeRef and prevTimestampRef", () => {
    const canvas = createMockCanvas(createMockCtx());
    const refs = createRefs();

    prepareFrame(canvas, 1000, refs, DIMS);
    expect(refs.timeRef.current).toBe(1);
    expect(refs.prevTimestampRef.current).toBe(1000);

    prepareFrame(canvas, 2000, refs, DIMS);
    expect(refs.timeRef.current).toBe(2);
    expect(refs.prevTimestampRef.current).toBe(2000);
  });

  it("updates satellite animation refs", () => {
    const canvas = createMockCanvas(createMockCtx());
    const refs = createRefs({
      hoveredTypeRef: { current: "tech" },
      hoveredIdRef: { current: "databases" },
      lastHoveredClusterRef: { current: null },
      satelliteAnimRef: { current: 0 },
      prevTimestampRef: { current: 500 },
    });

    prepareFrame(canvas, 1000, refs, DIMS);

    // satelliteAnimRef should have been updated (non-zero after dt > 0 with a hovered tech)
    expect(refs.satelliteAnimRef.current).toBeGreaterThan(0);
    // lastHoveredClusterRef should track the hovered cluster
    expect(refs.lastHoveredClusterRef.current).toBe("databases");
  });

  it("computes DPR scaling correctly", () => {
    const mockCtx = createMockCtx();
    const canvas = createMockCanvas(mockCtx);
    const refs = createRefs();

    // devicePixelRatio is 2 (stubbed above)
    prepareFrame(canvas, 1000, refs, DIMS);

    expect(canvas.width).toBe(948 * 2);
    expect(canvas.height).toBe(600 * 2);
    expect(canvas.style.width).toBe("948px");
    expect(canvas.style.height).toBe("600px");
    expect(mockCtx.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 0, 0);
  });

  it("uses devicePixelRatio of 1 when not set", () => {
    vi.stubGlobal("window", { devicePixelRatio: undefined });
    const mockCtx = createMockCtx();
    const canvas = createMockCanvas(mockCtx);
    const refs = createRefs();

    prepareFrame(canvas, 1000, refs, DIMS);

    expect(canvas.width).toBe(948);
    expect(canvas.height).toBe(600);
    expect(mockCtx.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0);
  });

  it("computes dt=0 on first frame (prevTimestamp=0)", () => {
    const canvas = createMockCanvas(createMockCtx());
    const refs = createRefs({ prevTimestampRef: { current: 0 } });

    prepareFrame(canvas, 1000, refs, DIMS);

    // With dt=0 and no hovered tech, satellite anim should stay at 0
    expect(refs.satelliteAnimRef.current).toBe(0);
  });
});
