// Renders a Lab Day diagram SVG to WebP (quality 80), per the lab-day agent's diagram spec.
// Usage: node .claude/skills/lab-day/render.mjs <input.svg> <output.webp>
import sharp from "sharp";
import { readFileSync } from "node:fs";

const [svgPath, outPath] = process.argv.slice(2);
if (!svgPath || !outPath) {
  console.error("Usage: node render.mjs <input.svg> <output.webp>");
  process.exit(1);
}

const svg = readFileSync(svgPath);
await sharp(svg).webp({ quality: 80 }).toFile(outPath);
const meta = await sharp(outPath).metadata();
console.log(`${outPath} — ${meta.width}x${meta.height}`);
