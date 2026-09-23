import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
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

describe("every link in the UI is tracked", () => {
  // A raw <a> is allowed only inside TrackedLink itself, as a skip link, or
  // when it wires its own onClick (the CV components call trackEvent directly).
  const files = ["app", "components"].flatMap((dir) =>
    readdirSync(dir, { recursive: true, encoding: "utf8" })
      .filter((f) => f.endsWith(".tsx"))
      .map((f) => join(dir, f)),
  );

  it.each(files.filter((f) => !f.endsWith("TrackedLink.tsx")))("%s", (file) => {
    const src = readFileSync(file, "utf8");
    const raw = [...src.matchAll(/<a\s/g)]
      .map((m) => src.slice(m.index, src.indexOf("</a>", m.index)))
      .filter((el) => !el.includes('href="#main"') && !el.includes("onClick"));
    expect(raw).toEqual([]);
  });
});
