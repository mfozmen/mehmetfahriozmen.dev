# Lab Day — Technical Writing Skill

## Description
Use this skill when creating, editing, or publishing Lab Day posts. Lab Day is the technical writing section of mehmetfahriozmen.dev — practical, hands-on, tutorial-style content aimed at developers. It is separate from Field Notes (essay/observation style posts under /writing).

Trigger: any task involving /lab route, Lab Day content, technical blog posts, content/lab/ directory.

## What Lab Day Is
- Practical technical guides — "here's how to do X, step by step"
- Teaching tone: clear, direct, no fluff. The author knows the topic and is sharing what they learned.
- Audience: developers who want to learn something specific. They searched for it or clicked a link. Respect their time.
- Think: senior engineer explaining something to a mid-level colleague at a whiteboard

## What Lab Day Is NOT
- Not an essay or opinion piece (that's Field Notes under /writing)
- Not documentation or a dry spec
- Not a beginner tutorial that over-explains fundamentals
- Not AI-generated slop — the writing is authentic, from real experience

## Content Structure

### Frontmatter (MDX)
```yaml
---
title: "Lab Day: [Descriptive Title]"
description: "[100+ chars, SEO-friendly description of what the reader will learn]"
date: "YYYY-MM-DD"
slug: "[kebab-case-descriptive-no-stop-words]"
coverImage: "/lab/lab-day-cover.webp"
tags: ["tag1", "tag2"]
---
```

Rules:
- Title MUST start with "Lab Day: " prefix
- Title (after prefix) under 60 characters
- **Title must be SEO-friendly** — use searchable keywords that developers would actually type into Google. The title is not a tagline or essay headline. It should clearly describe what the post teaches. Good: "Writing Custom Skills for AI Coding Agents". Bad: "Teach Your AI How You Work".
- description minimum 100 characters
- date in YYYY-MM-DD format
- coverImage is always exactly `"/lab/lab-day-cover.webp"` — this is a fixed value, never changes between posts
- tags: relevant technical keywords, lowercase

### Post Structure
1. **Open with the problem.** Why does this matter? What's broken or missing? The reader should recognize their own pain in the first few paragraphs.
2. **Explain the context.** What does the reader need to understand before the solution makes sense? Keep this tight — only what's necessary.
3. **Build the solution step by step.** Walk through it. Show code. Explain decisions. Don't skip steps — if you thought about it, the reader needs to think about it too.
4. **Show before/after or input/output.** Make the impact concrete. What did it look like without this? What does it look like now?
5. **Close with practical takeaways.** Short. What should the reader do next? No inspirational fluff.

### Tone
- Direct, clear, no filler
- Second person ("you") when addressing the reader
- OK to be opinionated — "this is how I do it and why" is more useful than "there are many approaches"
- Deadpan humor is welcome but never forced — if it doesn't come naturally, skip it
- Never: "In this article, we will explore..." / "Let's dive in!" / "Without further ado"
- Never use "journey" or "game-changer" or "dive deep"

### Code Blocks
- Use fenced code blocks with language identifiers — syntax highlighting is automatic via Shiki
- Code examples must be complete enough to understand — no "..." handwaving in critical parts
- If a code block is long, break it into pieces with explanation between each piece
- Comment sparingly inside code — explain in prose above or below

**Code block features available:**
- **Language label + copy button** — automatic for all fenced code blocks
- **Filename header** — ` ```ts title="src/lib/auth.ts" ` adds a filename bar above the block
- **Line highlighting** — ` ```ts {4-6} ` highlights specific lines with amber tint
- **Line numbers** — ` ```ts showLineNumbers ` enables line numbers
- **Diff highlighting** — prefix lines with `+` or `-` for before/after examples
- **Collapse for long blocks** — blocks > 400px auto-collapse with "Show more" button. Override with `expandable={false}` or `maxHeight={600}` in the fence meta
- **Markdown source/rendered toggle** — wrap markdown code blocks with `<MarkdownDemo>` to give readers a Source/Rendered toggle. Use for skill file examples, config files, or any markdown the reader benefits from seeing both raw and formatted:
  ```
  <MarkdownDemo>
  ` ` `markdown
  # Example Skill
  ## Description
  ...
  ` ` `
  </MarkdownDemo>
  ```

### Visual Content
- No illustrations or cartoons inside Lab Day posts
- Screenshots when they genuinely help (UI output, terminal output, before/after)
- Screenshots go in public/lab/[slug]/ directory
- Optimize with Squoosh: WebP, quality 80, max 800px width

## File Locations
- Posts: content/lab/[slug].mdx
- Images: public/lab/[slug]/
- Shared cover: public/lab/lab-day-cover.webp

## Cover Image
All Lab Day posts share a single cover image at a fixed path:

**Path:** `public/lab/lab-day-cover.webp`
**Frontmatter value:** `coverImage: "/lab/lab-day-cover.webp"`

This path is hardcoded. Every Lab Day post uses this exact value in its frontmatter — no per-post cover images. Before publishing any Lab Day post, verify that `public/lab/lab-day-cover.webp` exists. If the file is missing, do not publish — report it and stop.

Visual direction for the cover (generated via ChatGPT, not by Claude Code):
- Style: same as site illustrations (deep navy, amber, off-white, grain texture)
- Scene: astronaut working in a lab/workshop setting — focused, hands-on, calm
- NOT the Field Notes style (deadpan disaster humor). Lab Day astronaut is working, not surviving.

## SEO
- Title tag: "Lab Day: [Title] | Mehmet Fahri Özmen"
- Meta description: use frontmatter description
- URL structure: /lab/[slug]
- Slug: kebab-case, descriptive, no stop words

## Relationship with Field Notes
- Field Notes (/writing): essays, observations, reflections — "here's what I think"
- Lab Day (/lab): technical guides, tutorials, walkthroughs — "here's how to do it"
- Cross-linking is encouraged when natural: an essay can link to a Lab Day post for technical depth, a Lab Day post can reference an essay for broader context
- They share the same site design language but are separate sections with separate navigation

## Title Display Rules
- Frontmatter `title` always includes the "Lab Day: " prefix (e.g., `"Lab Day: Teach Your AI How You Work"`)
- **Post detail page** (`/lab/[slug]`): show full title with prefix — helps with SEO and context for direct landings from Google/social
- **Lab list page** (`/lab`): strip the "Lab Day: " prefix from card titles — it's redundant since the reader is already on the Lab page
- **Meta tags** (OG, Twitter): always use the full title with prefix

## Constraints
- Never publish a Lab Day post without code examples — if there's no code, it's an essay, not a Lab Day post
- Never publish a Lab Day post if `public/lab/lab-day-cover.webp` does not exist — stop and report
- coverImage frontmatter value is always exactly `"/lab/lab-day-cover.webp"` — never change it, never use a different image
- Never start the title without the "Lab Day: " prefix
- Never use numbered series like "#1, #2" — each post stands alone
