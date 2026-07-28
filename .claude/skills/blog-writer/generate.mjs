// Generates a Field Notes illustration via Google AI Studio Gemini.
// Usage (repo root): node .claude/skills/blog-writer/generate.mjs "<prompt>" <output.png> [--ref <img> ...] [--ar 3:2] [--model <id>]
//   --ref    attach a style-reference image (repeatable)
//   --ar     aspect ratio (default 3:2 — covers; use 16:9 etc. for other shapes)
//   --model  Gemini image model id (default gemini-3.1-flash-image)
// Requires GEMINI_API_KEY in env or .env.local at repo root.
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const args = process.argv.slice(2);
const refs = [];
const positional = [];
let ar = "3:2";
let model = "gemini-3.1-flash-image";
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--ref") refs.push(args[++i]);
  else if (args[i] === "--ar") ar = args[++i];
  else if (args[i] === "--model") model = args[++i];
  else positional.push(args[i]);
}
const [prompt, output] = positional;
if (!prompt || !output) {
  console.error('Usage: node generate.mjs "<prompt>" <output.png> [--ref <img> ...] [--ar 3:2]');
  process.exit(1);
}

let key = process.env.GEMINI_API_KEY;
if (!key && existsSync(".env.local")) {
  key = /^GEMINI_API_KEY=(.+)$/m.exec(readFileSync(".env.local", "utf8"))?.[1]?.trim();
}
if (!key) {
  console.error("GEMINI_API_KEY not set (env or .env.local at repo root)");
  process.exit(1);
}

const mime = (f) =>
  f.endsWith(".webp") ? "image/webp" : /\.jpe?g$/.test(f) ? "image/jpeg" : "image/png";
const parts = [
  ...refs.map((f) => ({ inlineData: { mimeType: mime(f), data: readFileSync(f).toString("base64") } })),
  { text: prompt },
];

const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
  {
    method: "POST",
    headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: { responseModalities: ["TEXT", "IMAGE"], imageConfig: { aspectRatio: ar } },
    }),
  },
);
if (!res.ok) {
  console.error(`Gemini API ${res.status}: ${await res.text()}`);
  process.exit(1);
}
const json = await res.json();
const img = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)?.inlineData;
if (!img) {
  console.error(`No image in response: ${JSON.stringify(json).slice(0, 500)}`);
  process.exit(1);
}
writeFileSync(output, Buffer.from(img.data, "base64"));
console.log(`${output} — ${img.mimeType}`);
