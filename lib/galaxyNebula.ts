/**
 * Nebula texture generation using simplex noise.
 * Generates an offscreen texture once, composited per-frame via drawImage.
 */

// --- Simplex 2D noise (self-contained, no dependencies) ---

// Permutation table (seeded, deterministic)
const PERM = new Uint8Array(512);
const GRAD2 = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

function initPerm(seed: number) {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  // Fisher-Yates shuffle with seed
  let s = seed;
  for (let i = 255; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
}

const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;

function dot2(g: number[], x: number, y: number) {
  return g[0] * x + g[1] * y;
}

function simplex2(x: number, y: number): number {
  const s = (x + y) * F2;
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);
  const t = (i + j) * G2;
  const X0 = i - t;
  const Y0 = j - t;
  const x0 = x - X0;
  const y0 = y - Y0;

  const i1 = x0 > y0 ? 1 : 0;
  const j1 = x0 > y0 ? 0 : 1;

  const x1 = x0 - i1 + G2;
  const y1 = y0 - j1 + G2;
  const x2 = x0 - 1 + 2 * G2;
  const y2 = y0 - 1 + 2 * G2;

  const ii = i & 255;
  const jj = j & 255;

  let n0 = 0,
    n1 = 0,
    n2 = 0;

  let t0 = 0.5 - x0 * x0 - y0 * y0;
  if (t0 >= 0) {
    t0 *= t0;
    const gi0 = PERM[ii + PERM[jj]] % 8;
    n0 = t0 * t0 * dot2(GRAD2[gi0], x0, y0);
  }

  let t1 = 0.5 - x1 * x1 - y1 * y1;
  if (t1 >= 0) {
    t1 *= t1;
    const gi1 = PERM[ii + i1 + PERM[jj + j1]] % 8;
    n1 = t1 * t1 * dot2(GRAD2[gi1], x1, y1);
  }

  let t2 = 0.5 - x2 * x2 - y2 * y2;
  if (t2 >= 0) {
    t2 *= t2;
    const gi2 = PERM[ii + 1 + PERM[jj + 1]] % 8;
    n2 = t2 * t2 * dot2(GRAD2[gi2], x2, y2);
  }

  // Returns value in [-1, 1]
  return 70 * (n0 + n1 + n2);
}

// Fractal brownian motion — multiple octaves for organic detail
function fbm(x: number, y: number, octaves: number): number {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxAmp = 0;
  for (let i = 0; i < octaves; i++) {
    value += amplitude * simplex2(x * frequency, y * frequency);
    maxAmp += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }
  return value / maxAmp; // Normalize to [-1, 1]
}

// --- Texture generation ---

export interface NebulaTexture {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}

/** Cosine fade factor for a normalized coordinate (0-1) within an edge band. */
function edgeFadeFactor(t: number, band: number): number {
  if (t < band) return (1 - Math.cos((Math.PI * t) / band)) / 2;
  if (t > 1 - band) return (1 - Math.cos((Math.PI * (1 - t)) / band)) / 2;
  return 1;
}

/** Apply smooth cosine fade to alpha channel at all edges. */
function applyEdgeFade(data: Uint8ClampedArray, w: number, h: number) {
  const band = 0.3;
  for (let y = 0; y < h; y++) {
    const fadeY = edgeFadeFactor(y / h, band);
    for (let x = 0; x < w; x++) {
      const fadeX = edgeFadeFactor(x / w, band);
      const i = (y * w + x) * 4;
      data[i + 3] = Math.round(data[i + 3] * fadeX * fadeY);
    }
  }
}

/**
 * Generate a warm-toned nebula noise texture concentrated along the galactic plane.
 * Returns an ImageData-compatible object. Generated once, composited per-frame.
 */
export function generateNebulaTexture(w: number, h: number): NebulaTexture {
  initPerm(42); // Deterministic seed

  const data = new Uint8ClampedArray(w * h * 4);
  const cx = w / 2;
  const cy = h / 2;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const nx = x / w;
      const ny = y / h;

      const noise = fbm(nx * 6, ny * 6, 5);
      const n = (noise + 1) * 0.5;

      const distFromPlane = Math.abs(y - cy) / (h * 0.5);
      const planeEnvelope = Math.exp(-distFromPlane * distFromPlane * 4);

      const distFromCenterX = Math.abs(x - cx) / (w * 0.5);
      const hEnvelope = Math.exp(-distFromCenterX * distFromCenterX * 1.5);

      const intensity = Math.pow(n * planeEnvelope * hEnvelope, 0.6);

      const i = (y * w + x) * 4;
      data[i] = Math.round(intensity * 180);
      data[i + 1] = Math.round(intensity * 120);
      data[i + 2] = Math.round(intensity * 50);
      data[i + 3] = Math.round(intensity * 90);
    }
  }

  applyEdgeFade(data, w, h);

  return { width: w, height: h, data };
}
