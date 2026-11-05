import { describe, expect, it } from "vitest";
import { GET } from "@/app/feed.xml/route";

describe("feed.xml", () => {
  it("lists writing and lab items together, newest first", async () => {
    const xml = await GET().text();
    const dates = [...xml.matchAll(/<pubDate>(.+?)<\/pubDate>/g)].map((m) => Date.parse(m[1]));

    expect(dates.length).toBeGreaterThan(1);
    expect(dates).toEqual([...dates].sort((a, b) => b - a));
  });
});
