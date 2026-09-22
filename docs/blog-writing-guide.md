# Blog Writing Guide — mehmetfahriozmen.dev

## Language & Format

- All blog posts are written in **English**
- Posts use **MDX** format, stored in `content/posts/`
- Images stored in `public/writing/[slug]/`

## Frontmatter Rules (CLAUDE.md enforced)

```yaml
title: "Under 60 characters"
date: "YYYY-MM-DD"              # ISO format
description: "100-160 characters - meta description and OG description"
coverImage: "/writing/[slug]/cover.webp"
```

- `description` must be **100–160 characters** — hard gate, enforced by `__tests__/posts.test.ts`
- `coverImage` is **required** for every post
- `title` must stay **under 60 characters** for search engine display

## Voice & Tone

- **Deadpan humor** — observations delivered straight-faced, absurdity presented as normal
- **Thought-provoking questions** over prescriptive answers — don't tell the reader what to think
- **Short, punchy copy** — no verbose paragraphs, no filler
- **Leave deliberate ambiguities unanswered** when that's the honest position — not every section needs a neat resolution
- **No neat endings** — if you don't have the answer, say so. Don't manufacture closure

## What This Blog Is

A **learning journal across all engineering topics**: backend, leadership, AI, architecture, team dynamics, industry observations. It is **not** a management-transition blog — the writing section covers whatever the author finds worth exploring.

## What This Blog Is Not

- Not corporate thought leadership
- Not a list of tips disguised as insight
- Not prescriptive ("you should do X") — prefer observational ("here's what I noticed")
- Not "AI-generated content" — the collaborative process with Claude produces authentic writing. Never "humanize" or disclaim the process

## Structure Principles

- **Hook first** — open with a scene, contradiction, or observation. No throat-clearing
- **Sections earn their place** — every section must say something the previous one didn't. If two sections feel similar, merge or cut
- **No section dividers** — never put `---` between sections. The single exception is the `---` before the `_Sources_` footnote at the end.
- **No bullet-point lists in the article body** — write in prose. Lists kill the voice
- **Internal rhythm** — alternate between short punchy lines and longer reflective passages

## Illustrations

Prompts, palette, the reference-image trick and the generate/optimize scripts live in the blog-writer skill (Part 3). This file keeps only the standing rules below.

### Character

- Same **astronaut** in every illustration
- **Face never visible** — always from behind, profile, or obscured by helmet
- Space/shuttle/station settings

### Humor in Illustrations

- **Deadpan black humor** — disaster presented as completely normal
- **Single clear joke** readable at a glance, but rewards closer inspection
- The astronaut is never alarmed — that's the joke

### Count & Placement

- **No fixed limit** — a post can have 1 cover image or cover + 3 inline images
- **Effectiveness is the only criterion**: does this visual strengthen a critical transition point in the text?
- Cover image is always required
- Inline images sit at natural section breaks, with a short italic caption below

### Image Processing

- Optimize with `.claude/skills/blog-writer/optimize.mjs` (sharp, WebP q80: covers 1200w, inline 800w, og 1200×630)
- OG images use the cover illustration directly (not a generated text card)
- File structure: `public/writing/[slug]/cover.webp`, `secondary.webp`, etc.

## Social Sharing

Share text is owned by the blog-writer skill (`.claude/skills/blog-writer/SKILL.md`, Part 4), including voice, the LinkedIn shape that worked, and the Turkish version. Do not draft from this file.

- **No spoilers** — don't give away the article's best lines or conclusions
- **No forced pop culture references** without context
- **Timing is free** — share as soon as the post is live; both platforms on the same day is fine

## SEO (Automatic)

These are handled by the site infrastructure — no manual work needed per post:
- Sitemap: auto-generated from `getAllPosts()`
- Article JSON-LD: `headline`, `author`, `datePublished`, `image` from frontmatter
- OG tags: dynamic from frontmatter
- RSS feed: auto-updated at `/feed.xml`
- Canonical URLs: automatic
- BreadcrumbList JSON-LD: automatic on blog posts

## Workflow

1. **Brainstorm** — topic, angle, core thesis (Claude + Mehmet in conversation)
2. **Outline** — section-by-section skeleton with what each section says and why
3. **Write** — full draft in English, collaborative process
4. **Illustrations** — generated via Gemini (`generate.mjs`) from prompts based on the finished text, placed at impact points
5. **Claude Code prompt** — describe what needs to be created/updated (never write code — Claude Code has its own skills)
6. **Visual review** — Playwright MCP verification at 1440px and 390px
7. **Deploy** — merge after approval, verify OG tags via LinkedIn Post Inspector and X Card Validator
8. **Share** — as soon as the post is live, on both platforms
