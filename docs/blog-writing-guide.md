# Blog Writing Guide — mehmetfahriozmen.dev

## Language & Format

- All blog posts are written in **English**
- Posts use **MDX** format, stored in `content/posts/`
- Images stored in `public/writing/[slug]/`

## Frontmatter Rules (CLAUDE.md enforced)

```yaml
title: "Under 60 characters"
date: "YYYY-MM-DD"              # ISO format
description: "At least 100 characters — used as meta description and OG description"
coverImage: "/writing/[slug]/cover.webp"
```

- `description` must be **100+ characters** — this is an SEO requirement
- `coverImage` is **required** for every post
- `title` must stay **under 60 characters** for search engine display

## Voice & Tone

- **Deadpan humor** — observations delivered straight-faced, absurdity presented as normal
- **Thought-provoking questions** over prescriptive answers — don't tell the reader what to think
- **Short, punchy copy** — no verbose paragraphs, no filler
- **Galaxy/space metaphors** woven throughout where they fit naturally
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
- **Section dividers** — use `---` between major sections (established convention from first two posts)
- **No bullet-point lists in the article body** — write in prose. Lists kill the voice
- **Internal rhythm** — alternate between short punchy lines and longer reflective passages

## Illustrations

### Style (ChatGPT generation)

Base prompt:
> "Modern flat editorial illustration, clean and minimal. Color palette: deep navy (#0a0f1e), amber (#BA7517), off-white. Subtle grain texture. Single image, wide composition. [SCENE]. No text. Single scene."

Always append when attaching a reference image:
> "Use this image as strict style reference. Same style, palette, texture. Only scene changes."

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

- Optimize with **Squoosh**: WebP format, quality 80, max 800px width
- OG images use the cover illustration directly (not a generated text card)
- File structure: `public/writing/[slug]/cover.webp`, `secondary.webp`, etc.

## Social Sharing

### General Rules

- **2–3 sentences max** — personal hook + twist + "I wrote about why/what" + link
- **No spoilers** — don't give away the article's best lines or conclusions
- **No forced pop culture references** without context
- **Don't over-explain** — let curiosity drive the click
- **Post on different days**, not the same day
- LinkedIn can be slightly longer if needed

### LinkedIn

- Slightly more context is OK — 3–4 sentences at most
- Professional but not corporate. Match the blog's voice
- Best posting time (Turkey): weekday mornings, 08:00–10:00

### X/Twitter

- Tighter — 2 sentences + link
- Punchier hook, less explanation

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
4. **Illustrations** — ChatGPT prompts based on the finished text, placed at impact points
5. **Claude Code prompt** — describe what needs to be created/updated (never write code — Claude Code has its own skills)
6. **Visual review** — Playwright MCP verification at 1440px and 390px
7. **Deploy** — merge after approval, verify OG tags via LinkedIn Post Inspector and X Card Validator
8. **Share** — LinkedIn first, X/Twitter 2–3 days later
