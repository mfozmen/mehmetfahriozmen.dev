/**
 * Background star generation for the galaxy visualization.
 * Shared between SystemsGalaxy.tsx (rendering) and tests.
 */

export type StarLayer = "far" | "mid" | "near";

export interface SpikeGeometry {
  lengthMul: number;
  arms: [number, number, number, number];
  diagonals: boolean;
  diagArms: [number, number, number, number];
}

export interface BgStar {
  x: number;
  y: number;
  r: number;
  alpha: number;
  layer: StarLayer;
  phase: number;
  color: string;
  spike: SpikeGeometry | null;
  bright: boolean;
}

export const STAR_LAYERS: Record<
  StarLayer,
  {
    radiusMin: number;
    radiusMax: number;
    alphaMin: number;
    alphaMax: number;
    parallax: number;
    driftMul: number;
    glowMul: number;
  }
> = {
  far: {
    radiusMin: 0.2, radiusMax: 0.5, alphaMin: 0.08, alphaMax: 0.2,
    parallax: 0.3, driftMul: 0.3, glowMul: 2,
  },
  mid: {
    radiusMin: 0.5, radiusMax: 0.9, alphaMin: 0.15, alphaMax: 0.35,
    parallax: 0.7, driftMul: 0.7, glowMul: 4,
  },
  near: {
    radiusMin: 0.9, radiusMax: 1.4, alphaMin: 0.25, alphaMax: 0.5,
    parallax: 1.5, driftMul: 1.3, glowMul: 6,
  },
};

const STAR_COLORS = [
  { color: "255,255,255", weight: 0.85 },
  { color: "230,240,255", weight: 0.07 },
  { color: "255,210,127", weight: 0.06 },
  { color: "255,176,122", weight: 0.02 },
];

export function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pickStarColor(rand: () => number): string {
  const roll = rand();
  let cumulative = 0;
  for (const entry of STAR_COLORS) {
    cumulative += entry.weight;
    if (roll < cumulative) return entry.color;
  }
  return STAR_COLORS[0].color;
}

function seededGaussian(rand: () => number, spread: number = 0.35): number {
  return seededGaussianFromRand(rand, spread);
}

function seededGaussianFromRand(rand: () => number, spread: number): number {
  const u1 = rand();
  const u2 = rand();
  const z = Math.sqrt(-2 * Math.log(Math.max(u1, 1e-10))) * Math.cos(2 * Math.PI * u2);
  return Math.max(-1, Math.min(1, z * spread));
}

export function generateBgStars(w: number, h: number, count: number): BgStar[] {
  const rand = seededRandom(42);
  const stars: BgStar[] = [];
  const cx = w / 2;
  const cy = h / 2;
  const layerDist: { layer: StarLayer; share: number }[] = [
    { layer: "far", share: 0.5 },
    { layer: "mid", share: 0.3 },
    { layer: "near", share: 0.2 },
  ];
  for (const { layer, share } of layerDist) {
    const cfg = STAR_LAYERS[layer];
    const n = Math.round(count * share);
    for (let i = 0; i < n; i++) {
      const isBright = rand() < 0.02;
      const spikeChance = isBright
        ? 0.9
        : layer === "near"
          ? 0.45
          : layer === "mid"
            ? 0.15
            : 0;
      const hasSpikes = rand() < spikeChance;
      let spike: SpikeGeometry | null = null;
      if (hasSpikes) {
        const armRand = () => 0.6 + rand() * 0.6;
        spike = {
          lengthMul: 4 + rand() * 5,
          arms: [armRand(), armRand(), armRand(), armRand()],
          diagonals: rand() < 0.4,
          diagArms: [armRand(), armRand(), armRand(), armRand()],
        };
      }
      let r = cfg.radiusMin + rand() * (cfg.radiusMax - cfg.radiusMin);
      let alpha = cfg.alphaMin + rand() * (cfg.alphaMax - cfg.alphaMin);
      if (isBright) {
        r *= 1.6 + rand() * 0.4;
        alpha = Math.min(alpha * 1.8, 0.7);
      }

      // Center-biased distribution: tighter gaussian (spread=0.25)
      // creates 3-4x density near center vs edges
      stars.push({
        x: cx + seededGaussian(rand, 0.25) * w * 0.5,
        y: cy + seededGaussian(rand, 0.25) * h * 0.5,
        r,
        alpha,
        layer,
        phase: rand() * Math.PI * 2,
        color: pickStarColor(rand),
        spike,
        bright: isBright,
      });
    }
  }
  return stars;
}

/* ------------------------------------------------------------------ */
/*  Star drift                                                         */
/* ------------------------------------------------------------------ */

export const DRIFT_SPEED = 3;
export const DRIFT_ANGLE = -2.6;
export const FADE_IN_DURATION = 2.5; // seconds

export interface DriftResult {
  x: number;
  y: number;
  wrapped: boolean;
  /** 0 = just wrapped (invisible), 1 = fully visible */
  fadeIn: number;
}

/**
 * Compute a star's drifted position at a given time.
 * When a star wraps past the canvas edge, it reappears at a
 * center-biased position (gaussian) on the opposite side,
 * preserving the center density invariant over time.
 * Returns a fadeIn factor (0→1) that ramps over 2.5s after wrap.
 */
export function applyStarDrift(
  star: BgStar,
  time: number,
  w: number,
  h: number,
): DriftResult {
  const cfg = STAR_LAYERS[star.layer];
  const vx = DRIFT_SPEED * Math.cos(DRIFT_ANGLE) * cfg.driftMul;
  const vy = DRIFT_SPEED * Math.sin(DRIFT_ANGLE) * cfg.driftMul;
  const dx = time * vx;
  const dy = time * vy;

  let sx = star.x + dx;
  let sy = star.y + dy;

  const cx = w / 2;
  const cy = h / 2;
  const wrapped = sx < 0 || sx > w || sy < 0 || sy > h;

  let fadeIn = 1;

  if (wrapped) {
    // Compute when the most recent wrap happened by finding the last
    // time the star crossed a canvas boundary
    let lastWrapTime = 0;

    if (Math.abs(vx) > 0.001) {
      // Time to reach each horizontal boundary from initial position
      // Star wraps every w pixels of travel
      const travelX = Math.abs(dx);
      // Distance from star to the exit edge in drift direction
      const distToEdgeX = vx > 0 ? w - star.x : star.x;
      if (travelX > distToEdgeX) {
        // How far past the first wrap
        const pastFirst = travelX - distToEdgeX;
        // Each subsequent wrap is w pixels apart
        const fullWraps = Math.floor(pastFirst / w);
        const lastWrapDist = distToEdgeX + fullWraps * w;
        const tWrap = lastWrapDist / Math.abs(vx);
        if (tWrap > lastWrapTime) lastWrapTime = tWrap;
      }
    }

    if (Math.abs(vy) > 0.001) {
      const travelY = Math.abs(dy);
      const distToEdgeY = vy > 0 ? h - star.y : star.y;
      if (travelY > distToEdgeY) {
        const pastFirst = travelY - distToEdgeY;
        const fullWraps = Math.floor(pastFirst / h);
        const lastWrapDist = distToEdgeY + fullWraps * h;
        const tWrap = lastWrapDist / Math.abs(vy);
        if (tWrap > lastWrapTime) lastWrapTime = tWrap;
      }
    }

    const timeSinceWrap = time - lastWrapTime;
    fadeIn = Math.min(1, timeSinceWrap / FADE_IN_DURATION);

    // Seed from star identity + wrap count for deterministic repositioning
    const wrapCount = Math.floor(Math.abs(dx) / w) + Math.floor(Math.abs(dy) / h);
    const wrapRand = seededRandom(
      Math.round(star.phase * 10000 + wrapCount * 31),
    );

    // Simple modular wrap to get base position on canvas
    sx = ((sx % w) + w) % w;
    sy = ((sy % h) + h) % h;

    // Blend toward center with gaussian bias (70% gaussian, 30% wrapped position)
    const gx = cx + seededGaussianFromRand(wrapRand, 0.25) * w * 0.5;
    const gy = cy + seededGaussianFromRand(wrapRand, 0.25) * h * 0.5;
    sx = sx * 0.3 + gx * 0.7;
    sy = sy * 0.3 + gy * 0.7;
  }

  return { x: sx, y: sy, wrapped, fadeIn };
}
