// Optimizes a Field Notes illustration to WebP (quality 80), per the blog-writer agent.
// Usage: node .claude/skills/blog-writer/optimize.mjs <input.(png|jpg|webp)> <output.webp> [width] [height]
//   width only          → resize to width, keep aspect (inline images: 800, covers: 1200)
//   width + height      → cover-crop to exact size (og.webp: 1200 630)
import sharp from "sharp";

const [input, output, width, height] = process.argv.slice(2);
if (!input || !output) {
  console.error("Usage: node optimize.mjs <input> <output.webp> [width] [height]");
  process.exit(1);
}

let img = sharp(input);
if (width && height) img = img.resize(Number(width), Number(height), { fit: "cover" });
else if (width) img = img.resize({ width: Number(width) });
await img.webp({ quality: 80 }).toFile(output);
const meta = await sharp(output).metadata();
console.log(`${output} — ${meta.width}x${meta.height}`);
