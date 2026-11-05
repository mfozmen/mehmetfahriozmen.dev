import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { trackEvent } from "@/lib/analytics";
import { TrackedNextLink } from "@/components/TrackedLink";

vi.mock("@/lib/analytics", () => ({ trackEvent: vi.fn() }));

const read = (file: string) => readFileSync(join(process.cwd(), file), "utf-8");

describe("site navigation tracking", () => {
  it("tracks header and drawer menu links as nav-click with their location", () => {
    const source = read("components/Navigation.tsx");
    expect(source).toMatch(/eventName="nav-click"[^>]*location: "header"/);
    expect(source).toMatch(/eventName="nav-click"[^>]*location: "drawer"/);
  });

  it("tracks footer menu links as nav-click with location footer", () => {
    expect(read("components/Footer.tsx")).toMatch(/eventName="nav-click"[^>]*location: "footer"/);
  });
});

describe("TrackedNextLink", () => {
  it("tracks the click and still runs the caller's onClick", () => {
    const onClick = vi.fn();
    const el = TrackedNextLink({ href: "/lab", eventName: "nav-click", eventData: { label: "Lab" }, onClick, children: "Lab" });

    el.props.onClick({});

    expect(trackEvent).toHaveBeenCalledWith("nav-click", { label: "Lab" });
    expect(onClick).toHaveBeenCalled();
  });
});
