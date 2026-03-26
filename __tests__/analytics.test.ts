import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { trackEvent } from "@/lib/analytics";

describe("trackEvent", () => {
  const mockTrack = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("window", { umami: { track: mockTrack } });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    mockTrack.mockClear();
  });

  it("calls umami.track with event name and data when umami is available", () => {
    trackEvent("cta-click", { cta: "explore", page: "/" });
    expect(mockTrack).toHaveBeenCalledOnce();
    expect(mockTrack).toHaveBeenCalledWith("cta-click", { cta: "explore", page: "/" });
  });

  it("calls umami.track with event name only when no data is provided", () => {
    trackEvent("cv-more-projects-toggle");
    expect(mockTrack).toHaveBeenCalledOnce();
    expect(mockTrack).toHaveBeenCalledWith("cv-more-projects-toggle", undefined);
  });

  it("does not throw when window.umami is undefined", () => {
    vi.stubGlobal("window", {});
    expect(() => trackEvent("test-event")).not.toThrow();
    expect(mockTrack).not.toHaveBeenCalled();
  });

  it("does not throw when window is undefined (SSR)", () => {
    vi.stubGlobal("window", undefined);
    expect(() => trackEvent("test-event")).not.toThrow();
  });
});
