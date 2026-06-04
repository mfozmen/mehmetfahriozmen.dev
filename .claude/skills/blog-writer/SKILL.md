---
name: blog-writer
description: Use this skill whenever creating, editing, or reviewing blog posts for mehmetfahriozmen.dev. Triggers include any mention of 'blog post', 'writing', 'new post', 'MDX', 'review my post', 'how does this read', blog content creation, blog illustration prompts, social sharing text, or any request to evaluate blog content quality. Also triggers when editing existing posts, adding images, writing frontmatter, preparing posts for deployment, or when the user asks for feedback on draft text. If the user mentions their blog, writing section, field notes, post review, or content feedback — use this skill.
---

# Blog Writer & Reviewer — mehmetfahriozmen.dev

Skill for creating, editing, and reviewing blog posts on the personal portfolio site of Mehmet Fahri Özmen, a Backend Systems Architect & Engineering Leader based in İzmir.

This skill operates in two modes:
- **Create mode** — Building new posts (file structure, MDX, frontmatter, deployment)
- **Review mode** — Evaluating post quality from a reader's perspective

Always read `docs/blog-writing-guide.md` and check `CLAUDE.md` before starting either mode.

---

## Part 1: Creating a Post

### File Structure

```
content/posts/[slug].mdx          → Blog post content
public/writing/[slug]/cover.webp  → Cover image (required)
public/writing/[slug]/*.webp      → Inline images (optional)
```

Every post lives in its own slug directory under `public/writing/`. Never put images in a flat `public/writing/` folder.

### MDX Frontmatter (Mandatory)

```yaml
---
title: "Under 60 characters"
date: "YYYY-MM-DD"
description: "At least 100 characters — becomes meta description and OG description"
coverImage: "/writing/[slug]/cover.webp"
---
```

Validation before every commit:
- `title` under 60 characters
- `description` **100–160 characters** — hard gate enforced by `__tests__/posts.test.ts`; outside this range fails `npm test` and blocks commit. Confirm the exact count.
- `date` valid ISO format
- `coverImage` path exists and file is present
- Cover image is WebP, optimized (Squoosh: quality 80, 1200px width for 1200x800 covers)
- Cover image aspect ratio is 3:2 (e.g., 1200x800)
- OG image variant generated at `public/writing/[slug]/og.webp` (1200x630).
  See `docs/og-image-workflow.md` for the manual Photopea workflow.

### Opening Quote Block

Every post opens with a blockquote. Rules:
- Split into two lines if it has a setup + punchline structure
- Each line is a separate paragraph within the blockquote
- This quote should NOT repeat verbatim later in the body text
- **Keep it short — 1–2 short paragraph-units, ~4–24 words.** It teases, it never establishes; the body does the establishing work. A 3+ paragraph blockquote that narrates a full arc breaks the convention (that's an epigraph, not the opening element).
- Must NOT duplicate the frontmatter `description` — they do different jobs (description = off-page meta; blockquote = on-page atmosphere). Different angle, imagery, and rhythm.

```mdx
> Every revolution promises a new world.
>
> What they don't mention — the old one hasn't finished collapsing yet.
```

### Section Headings

- Use `##` (h2) for section titles
- Short, punchy, often with a twist
- Do NOT use `---` horizontal rule separators between sections
- Heading hierarchy: h1 (auto-generated title) → h2 (sections) → h3 (rare)

### Inline Images

```mdx
![Short editorial punchline here](/writing/[slug]/image-name.webp)
```

- Alt text is a short editorial punchline (5–12 words) that captures the joke or observation of the illustration. The site's `MdxImage` component renders alt text as both the HTML `alt` attribute and the visible `<figcaption>` — one string serves both roles. Match the deadpan tone of the post itself. Examples from existing posts: "Mr. Anderson? No. It's 'Boss' now." / "Humanity reached the stars. Furnished them from the same catalog." / "Declared dead. Twice the price now."
- Place at natural section breaks or critical transition points
- Never place directly next to a blockquote
- Images display at full aspect ratio, never cropped

### Blockquotes Inside the Post

- Max 1-2 per post besides the opening quote
- Never repeat a sentence from the body text
- Place far from inline images (both are "pause" moments)

### Code Blocks

Writing posts support the full code block system (same as Lab Day):
- Syntax highlighting via Shiki (server-side, no flash)
- Language label + copy button (automatic)
- Line highlighting: ` ```ts {4-6} `
- Line numbers: ` ```ts showLineNumbers `
- Diff highlighting: prefix lines with `+` or `-`
- Collapsible long blocks (>400px auto-collapse)
- Markdown source/rendered toggle: wrap with `<MarkdownDemo>`

Code blocks are rare in Field Notes essays but work when needed.

### Relationship with Lab Day

- Field Notes (/writing): essays, observations, reflections — "here's what I think"
- Lab Day (/lab): technical guides, tutorials, walkthroughs — "here's how to do it"
- Cross-linking is encouraged when natural
- If a post has heavy code and a tutorial structure, it probably belongs in Lab Day, not here

### What Infrastructure Handles Automatically

Do NOT manually create: sitemap entry, Article JSON-LD, OG/Twitter meta tags, OG image, RSS feed entry, BreadcrumbList JSON-LD, reading time, post navigation.

### Deployment Checklist

1. Branch created (never commit to main)
2. Frontmatter validates
3. Images in correct directory and optimized
4. Build succeeds (`npm run build`)
5. Playwright MCP verification at 1440px and 390px
6. OG tags verified post-deploy (LinkedIn Post Inspector + X Card Validator)

---

## Part 2: Reviewing a Post

When asked to review a blog post, evaluate it across these dimensions. Be honest and specific — vague praise is useless. Point to exact paragraphs, sentences, or sections.

### The 3-Second Test

Read only the opening quote block and first paragraph. Then answer:
- Do I know what this post is about?
- Do I want to keep reading?
- Is there a hook — a contradiction, a question, an unexpected observation?

If the answer to any of these is "no", the opening needs work. The reader decides in 3 seconds. Everything else is irrelevant if the opening fails.

### Flow & Pacing

Read the full post and mark moments where:
- **You got bored** — the paragraph is saying something the previous one already said
- **You got lost** — the transition between sections doesn't connect
- **You wanted to skip** — a section feels like filler or obligation rather than insight
- **You wanted more** — an idea was introduced and abandoned too quickly

For each moment, explain what went wrong and suggest a fix. "This section drags" is not useful. "The third paragraph in section 2 repeats the point from section 1 paragraph 4 — merge or cut" is useful.

### The "Does This Earn Its Place?" Test

For every section, ask: if I removed this section entirely, would the post be worse? If the answer is "not really", the section should be cut or merged into another one. Every section must say something the others don't.

### Tone Audit

The blog's voice is deadpan humor with honest observations. Watch for these violations:

- **Preacher mode** — "You should...", "The key is...", "What matters most is..." — this is prescriptive. The blog observes and questions, it doesn't instruct
- **Corporate mode** — "Leveraging synergies", "driving impact", "thought leadership" — kill it with fire
- **Motivational poster mode** — "You've got this!", "Believe in yourself", "The future is bright" — this is the opposite of deadpan
- **Over-explaining** — trusting the reader is fundamental. If the joke needs a footnote, it's not landing
- **Neat resolution** — the post ties everything up with a bow at the end. Life doesn't do that. The blog shouldn't either
- **Forced humor** — a joke that doesn't serve the argument. Humor should carry the point, not decorate it

For each violation found, quote the specific text and suggest a rewrite or cut.

### Human Authorship Signal (AI-Prose Detection)

Run this dimension on **every** review, automatically — alongside the voice, pacing, and thesis checks above. It is never optional and never needs to be requested separately.

The goal: catch any sentence that reads as machine-generated rather than written by a human author with a distinct voice. Judge against the **author's established Field Notes voice** — deadpan, observational, "we" perspective, concrete over abstract, hard cuts over smooth transitions, no maxims, no LinkedIn vocabulary, no koans — **not** against a generic "good writing" standard. A sentence that would pass a generic style guide can still fail here.

Scan for these signals:

1. **Balanced-clause cadences** — "not just X, but Y," "more than just X — it's Y," "X isn't X, it's Y." Even one or two flip a reader's sense that a human wrote this.
2. **Listicle rhythms inside prose** — three parallel clauses where two would do, four where three would do. Especially the triadic "X. Y. Z." cadence repeated across paragraphs.
3. **Synthetic transitions** — "Moreover," "In essence," "Ultimately," "What's more," "Furthermore," "Indeed." This voice uses hard cuts and paragraph breaks instead.
4. **Mechanical em-dashes** — an em-dash mid-clause used to soften every assertion, or em-dashes recurring at near-uniform spacing across paragraphs.
5. **Abstract-noun stacking** — "the dynamics of organizational alignment," "the realities of cross-functional collaboration," "the nature of distributed systems."
6. **Training-data vocabulary** — navigate, leverage, journey, landscape, ecosystem, delve, tapestry, myriad, underscore, robust, seamless, holistic, synergy, embark, unlock, elevate, harness, and the rest of that family.
7. **Hedge stacking** — "perhaps," "arguably," "in some sense," "to some degree" appearing in clusters. A human hedges once; an LLM stacks.
8. **Wisdom-shaped emptiness** — "the work is the work," "the answer is in the question," "we are what we measure." Empty-koan cadence that sounds profound and says nothing.
9. **Self-telegraphing conclusions** — "And that, in the end, is the real lesson," "Perhaps that's the point," "Which is, ultimately, what it's all about."
10. **Sentence-opening uniformity** — multiple paragraphs opening with the same construction ("There is…," "It is…," "The fact that…") in close succession.

How to report this dimension:

- **Quote specific sentences, never vague concerns.** For each flag, quote the offending sentence and propose how a human author *in this voice* would write it instead — but **do not apply the fix**. Reporting only.
- **Single vs. cluster.** Treat one occurrence differently from a pattern. One synthetic transition is a stumble; three across a draft is a pattern. State which you're seeing ("one occurrence" vs. "a pattern of N").
- **Do not manufacture concerns.** If a category is clean across the draft, say so explicitly (e.g. "Categories 3, 6, 8: clean"). Never pad the report to look thorough — a clean draft should produce a short section.
- **Net read.** Close with a one-line verdict: does the draft read as human-authored in the Field Notes voice, or are there machine-prose tells that warrant another pass?

### Frontmatter Description & Opening Element Conventions

Run this dimension on **every** review, automatically — alongside the AI-detection and voice/pacing/thesis checks. It governs two adjacent elements (the frontmatter `description` and the opening blockquote) and the relationship between them.

**1. Frontmatter description**

- **Length is a hard gate: 100–160 characters.** Enforced by `__tests__/posts.test.ts` ("each post description is between 100 and 160 characters"). A description outside this range fails `npm test` and blocks commit. It cannot be relaxed without editing the test itself — never quietly exceed it. Always confirm the exact character count.
- **Voice:** deadpan, observational, lived "we" when possible, concrete over abstract. No LinkedIn vocabulary, no aphorisms that flatten into maxims. (Same bar as the body — see the AI-detection dimension.)
- **Function:** it earns its place by making a reader who sees *only* the description — link preview, search result, RSS feed — want to click, **without giving the answer.** Good test: would it make someone click without handing them the thesis? Flag descriptions that are pure summary, that spoil a payoff, or that read as SEO filler.

**2. Opening blockquote (empirical convention, derived from existing Field Notes posts)**

- **Length:** 1–2 short paragraph-units, roughly 4–24 words total. (Range across existing posts: "Same shelf. Different apartment." through the ~24-word QA scene fragment in *the-nuclear-reactor-in-your-codebase*.)
- **Function: tease, never establish.** The blockquote is a compressed hook; the body (or pre-§1 prose / §1 itself) does the establishing work.
- **Shape:** a single compressed beat — an aphorism, an overheard line, or a scene fragment.
- **Red flag:** a 3+ paragraph blockquote, or one that narrates a full establishing arc, breaks the convention. That is an epigraph/lead, not the blockquote element — flag it and propose compressing to the tease, or moving it to replace the opening element entirely (a structural choice, not a drop-in).

**3. Description ↔ blockquote relationship**

- **They do different jobs.** The description is *meta-context* (seen off-page: link previews, search, RSS). The blockquote is *body-context* (atmosphere carrying the reader into §1). Each must earn its place independently.
- **Neither may duplicate the other.** If the description and the blockquote say nearly the same content — same angle, same imagery, same rhythm — one of them isn't earning its place. The fix is to give them different angles, not to trim one.
- **Always check the two elements together** and explicitly flag any duplication, naming which one should change and what different angle it should take.

### Repetition Check

Scan for:
- Same idea expressed in different words across sections
- A strong sentence repeated as a blockquote (blockquotes must add, not echo)
- Same word or phrase appearing too frequently (especially "just", "actually", "really", "simply")
- Multiple sections arriving at the same conclusion from different angles without adding new insight

### The Reader Empathy Check

Put yourself in the reader's position. The reader is likely:
- A developer or engineering leader
- Possibly anxious about AI and job security
- Smart but busy — scanning, not studying
- Skeptical of both hype and doom narratives

Ask:
- Does this post respect the reader's intelligence?
- Does it acknowledge complexity without hiding behind it?
- Would I share this? What's the one line I'd quote?
- After reading, do I feel I gained something — a new perspective, a question worth sitting with, a shift in how I see the topic?

### Image & Quote Placement Review

- Are images placed at genuine transition points or just dropped in?
- Do captions work as standalone punchlines?
- Are blockquotes and images spaced apart (never adjacent)?
- Is the pacing of "pause moments" (images + quotes) evenly distributed or clustered?

### The Brutal Summary

End every review with:

1. **Strongest moment** — the single best paragraph or sentence in the post, and why
2. **Weakest moment** — the single worst paragraph or section, and why
3. **One cut** — if you had to remove one section or paragraph, which one?
4. **One addition** — what's missing that would make the post stronger?
5. **Publish verdict** — one of:
   - "Ship it" — ready to publish
   - "Almost — minor edits" — 1-2 small fixes, then publish
   - "Needs work" — structural issues, needs another pass

---

## Part 3: Illustration Prompts

Base prompt for all ChatGPT illustrations:

```
"Modern flat editorial illustration, clean and minimal. Color palette: 
deep navy (#0a0f1e), amber (#BA7517), off-white. Subtle grain texture. 
Single image, wide composition. [SCENE DESCRIPTION]. Single scene."
```

When attaching a reference image, append:
```
"Use this image as strict style reference. Same style, palette, texture. 
Only scene changes."
```

### Character
- Same astronaut in every illustration
- Face never visible (behind, profile, or helmet visor)
- Space/shuttle/station settings

### Humor
- Deadpan black humor — disaster presented as completely normal
- Single clear joke readable at a glance, rewards closer inspection
- The astronaut is never alarmed — that's the joke

### Placement
- No fixed limit on count — effectiveness is the only criterion
- Cover image always required (3:2 ratio, 1200x800 before optimization)
- Inline images at critical transition points with short deadpan captions

---

## Part 4: Social Sharing

### LinkedIn
- 3-4 sentences max
- Personal hook + twist + "I wrote about why/what" + link
- No spoilers — don't give away the post's best lines

### X/Twitter
- 2 sentences + link
- Punchier hook, less explanation

### Rules
- Never share both platforms on the same day
- LinkedIn first, X/Twitter 2-3 days later
- No forced pop culture references without context

---

## Reference: Existing Posts

Study these for consistent patterns:
- `content/posts/hardest-refactor.mdx` — Personal narrative, first post
- `content/posts/accidental-engineering-manager.mdx` — AI + management, multiple inline images
- `content/posts/when-everyone-has-a-superpower.mdx` — Homogeneity + creativity
- `content/posts/the-revolution-has-no-manual.mdx` — AI economy, longest post, 3 images
