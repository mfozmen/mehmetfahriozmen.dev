import { describe, it, expect } from "vitest";
import { generateNebulaTexture } from "@/lib/galaxyNebula";

const W = 200; // Smaller than real canvas for fast tests
const H = 140;

describe("Nebula texture generation", () => {
  const texture = generateNebulaTexture(W, H);

  it("returns an ImageData of the correct dimensions", () => {
    expect(texture.width).toBe(W);
    expect(texture.height).toBe(H);
    expect(texture.data.length).toBe(W * H * 4); // RGBA
  });

  it("center band (galactic plane) is brighter than edges", () => {
    // Average brightness in the center 1/3 vs top 1/3
    const centerStart = Math.floor(H / 3);
    const centerEnd = Math.floor((2 * H) / 3);

    let centerSum = 0;
    let centerCount = 0;
    let edgeSum = 0;
    let edgeCount = 0;

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        const brightness = (texture.data[i] + texture.data[i + 1] + texture.data[i + 2]) / 3;

        if (y >= centerStart && y < centerEnd) {
          centerSum += brightness;
          centerCount++;
        } else {
          edgeSum += brightness;
          edgeCount++;
        }
      }
    }

    const centerAvg = centerSum / centerCount;
    const edgeAvg = edgeSum / edgeCount;

    expect(
      centerAvg,
      `Center avg brightness (${centerAvg.toFixed(1)}) should be > edge avg (${edgeAvg.toFixed(1)})`,
    ).toBeGreaterThan(edgeAvg);
  });

  it("has organic variance (not uniform)", () => {
    // Compute standard deviation of non-zero pixel brightnesses
    const brightnesses: number[] = [];
    for (let i = 0; i < texture.data.length; i += 4) {
      const b = (texture.data[i] + texture.data[i + 1] + texture.data[i + 2]) / 3;
      if (b > 0) brightnesses.push(b);
    }

    const mean = brightnesses.reduce((a, b) => a + b, 0) / brightnesses.length;
    const variance =
      brightnesses.reduce((sum, b) => sum + (b - mean) ** 2, 0) / brightnesses.length;
    const stdDev = Math.sqrt(variance);

    expect(
      stdDev,
      `Pixel std deviation (${stdDev.toFixed(2)}) should be > 2 for organic variance`,
    ).toBeGreaterThan(2);
  });

  it("is warm-toned (red channel > blue channel on average)", () => {
    let redSum = 0;
    let blueSum = 0;
    let count = 0;

    for (let i = 0; i < texture.data.length; i += 4) {
      if (texture.data[i + 3] > 0) {
        // Only count non-transparent pixels
        redSum += texture.data[i];
        blueSum += texture.data[i + 2];
        count++;
      }
    }

    const avgRed = redSum / count;
    const avgBlue = blueSum / count;

    expect(
      avgRed,
      `Avg red (${avgRed.toFixed(1)}) should be > avg blue (${avgBlue.toFixed(1)})`,
    ).toBeGreaterThan(avgBlue);
  });

  it("is deterministic (same dimensions produce same output)", () => {
    const texture2 = generateNebulaTexture(W, H);
    // Compare first 100 pixels
    for (let i = 0; i < 400; i++) {
      expect(texture.data[i]).toBe(texture2.data[i]);
    }
  });
});
