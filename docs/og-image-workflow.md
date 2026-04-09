# OG Image Workflow

## Why this exists

Site cover images are 1200x800 (3:2 editorial frame). Social platforms
— LinkedIn, Twitter, Facebook, Slack, Discord — expect 1200x630
(~1.91:1) for Open Graph previews and crop any other ratio
incorrectly. ChatGPT cannot produce 1.91:1 output natively — its
widest landscape format is 1536x1024 (3:2) regardless of prompt
instructions.

Solution: keep the site at 3:2 for editorial consistency, generate a
separate `og.webp` per post at 1200x630 from the same cover image,
and point the OG meta tags at the og.webp variant when it exists.

The code falls back to `cover.webp` if no `og.webp` is present, so
posts without an OG variant still work — they just get cropped by
social platforms the way they do today.

## Manual workflow (Photopea)

1. Open the post's `cover.webp` in Photopea (photopea.com).

2. **Image → Canvas Size.** Set Width to 1524, Height to 800. Anchor:
   center. OK. This creates empty 162px strips on each side of the
   original image.

3. **Rectangle Select tool (M).** Select one of the empty side strips,
   including 2-3 pixels of overlap into the original image so the
   content-aware fill has source pixels to sample from.

4. **Edit → Fill → Content-Aware.** Confirm. Photopea synthesizes
   pixels to fill the selected strip. Repeat for the other side.

5. **Move tool (V).** Enable transform controls. Hold **Alt** and drag
   from a corner to scale the whole image up slightly, re-centering
   the focal point so the composition doesn't feel stretched. This
   preserves the visual weight of the subject when the image is
   later downsized to 1200x630.

6. **File → Export As → WebP.** Save the 1524x800 result.

7. Upload the exported file to **Squoosh** (squoosh.app).

8. In Squoosh: Resize to **1200x630**, format **WebP**, quality **85**.
   Download. (Photopea's own resize can introduce quality loss;
   Squoosh's Lanczos resampling is more reliable.)

9. Save the result as:
   - Field Notes: `public/writing/[slug]/og.webp`
   - Lab Day: `public/lab/[slug]/og.webp`

The code will automatically detect the file and use it for OG meta
tags. No frontmatter change is needed.

## Code integration

`lib/posts.ts` and `lib/lab.ts` check at build time whether an
`og.webp` file exists alongside the cover. If yes, the in-memory
post object gets an `ogImage` field with the path. The
`generateMetadata` functions in `app/writing/[slug]/page.tsx` and
`app/lab/[slug]/page.tsx` read `post.ogImage ?? post.coverImage`
and adjust the declared dimensions accordingly (1200x630 for og,
1200x800 for cover fallback).

## When to revisit automation

This workflow is manual because there is no free, scriptable,
Windows-compatible content-aware fill tool as of April 2026.
Options considered and ruled out:

- **sharp (Node)** — can pad with solid color but cannot synthesize
  edge content; only works for images with uniform backgrounds.
- **GIMP + Resynthesizer plugin** — headless and scriptable, but no
  Windows build exists.
- **Cloud outpainting APIs** (Clipdrop, Runway, Adobe Firefly) —
  paid, external dependency, variable quality.
- **ChatGPT regeneration at 1.91:1** — ChatGPT cannot output that
  ratio natively.

Revisit if any of these becomes viable, or if the post count grows
past ~20 and manual work becomes a bottleneck.

## Checklist before publishing a new post

- [ ] Cover image saved at `public/[section]/[slug]/cover.webp`
      (1200x800)
- [ ] OG variant generated via the Photopea workflow above
- [ ] OG variant saved at `public/[section]/[slug]/og.webp` (1200x630)
- [ ] Verify on LinkedIn Post Inspector after deploy
