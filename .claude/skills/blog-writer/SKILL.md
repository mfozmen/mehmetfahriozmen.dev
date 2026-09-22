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
description: "100–160 characters — becomes meta description and OG description"
coverImage: "/writing/[slug]/cover.webp"
---
```

Validation before every commit:
- `title` under 60 characters
- `description` **100–160 characters** — hard gate enforced by `__tests__/posts.test.ts`; outside this range fails `npm test` and blocks commit. Confirm the exact count.
- `date` valid ISO format
- `coverImage` path exists and file is present
- Cover image is WebP, 3:2 (1200x800), and the OG variant exists at `public/writing/[slug]/og.webp` (1200x630). Both come out of `optimize.mjs` (Part 3) — the old manual Squoosh and Photopea steps are retired.

### Title

The title is a promise about the post's **thesis**, not its mood. Get it wrong and it misdirects every reader before §1.

- **Register (empirical, from existing posts).** Title case, under 60 characters, usually ~3–6 words. Shapes in the corpus: a vivid concrete/metaphorical noun phrase (*The Nuclear Reactor in Your Codebase*, *The Ant Colony*), a flat declarative that states the thesis (*The Revolution Has No Manual*, *Everyone's an Accidental Engineering Manager Now*), a wry comma-twist (*The Moon, Again*), or — once, first post only — a colon subtitle (*The Hardest Refactor: From Engineer to Manager*; avoid for new posts, the corpus moved away from it). Plain is in-register — the bar is specificity or turn, not cleverness. Name a *specific* image or make a *turn*.
- **Re-verify the title against the FINAL thesis after any ending/structure rewrite.** A title written for an early draft can be silently orphaned when the closing changes — and an orphaned title actively misleads (it sells the old thesis). Whenever §6 / the closing / the core argument moves, re-check the title. This is the single most common title failure.
- **No reading-lock.** The title must not bias the reader toward a framing the body *refutes*, and must not reintroduce a framing later edits *removed*. Check it against the finalized closing's agency (e.g. if the ending relocates blame from "the team disengaged" to "leadership divided the work," a title implying the former fights the essay).
- **Three elements, three angles: title ↔ opening blockquote ↔ description.** None may duplicate another's angle, imagery, or rhythm. Don't title with a phrase that already lives in the blockquote or description. If the blockquote seeds the metaphor, the title is freed to be the memorable hook instead of the metaphor's first appearance.
- **Brainstorm across registers before picking** — plain/direct, single-noun-phrase, image-driven, mechanism-named — and evaluate the plain options honestly rather than defaulting to the cleverest. Note the cost of each: titling with a strong body line *spends* that line (it lands with less surprise when the reader reaches it).

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

### Sentence Mechanics

- **Never start a sentence with "Or."** It reads as a dropped fragment rather than a deliberate cut. Rewrite it as a full sentence, or fold it into the preceding one. Sentence-initial **"And"** and **"But"** are in-register and used throughout the corpus (*the-ant-colony*, *the-moon-again*, *the-nuclear-reactor-in-your-codebase*); "Or" appears in none of them. Check every draft for `^Or ` and `. Or ` before review.

- **Plain sentences over constructed ones.** If a sentence has to be re-read to be parsed, it fails, however elegant it is. Symptom: an abstraction carrying a clever relative clause. Cure: say the lived version in short sentences.

  > ❌ "Developers aren't storage. They're people who were mid-thought when the calendar interrupted them."
  >
  > ✅ "People have lives. Somebody's kid gets sick. Somebody takes two weeks off and comes back to four hundred emails. Somebody spends Tuesday on a production incident and never gets back to the feature."

- **Write for a reader whose first language is not English.** Most of this audience is not native. Use the everyday word: "the problem here is simple" over "the argument was that", "shows" over "demonstrates", "so" over "consequently". No essay-critic register ("the argument", "the notion", "what the piece contends"), no Latinate verbs where a plain one exists, no idioms that only land for native speakers. Short sentences do this work almost by themselves.

- **Referring back to an earlier post: give the idea, not the scene, and say it in the terms of the post you are writing now.** Link it by title, then state the problem in two or three short sentences. Do not re-stage the anecdote — it belongs to the post that told it, and a reader who followed the link reads it twice. Do not summarise the old post's whole subject either; take the one strand this post continues. Three tries on *The Map* landed here:

  > ❌ scene: "It was about a QA who was nervous in a meeting, and about a codebase that had grown past what any one person in the building could hold."
  >
  > ❌ summary, and too long: "The problem there is simple. After a while a codebase gets too big for one person to hold in their head. And the part that keeps it running is not written down anywhere: who gets paged when it breaks, who depends on the thing you are about to change, …"
  >
  > ✅ "An agent writes code from whatever fits in its context, and that is all it sees. It does not know where the change lands. It does not know what it breaks on the way. It has the repository, and the repository does not say any of this."

- **A phrase you coined in an older post is not vocabulary yet.** "The 2 a.m. page", "the social map" read as jargon to someone who has not read that post, and stopping to define them costs more than they are worth. Say the plain thing instead: *who gets called when it breaks*, *who knew what and who to ask*. Callbacks work for an idea; they do not work for a coinage.

- **Do not answer the question in the setup.** The paragraph that closes the opening section should leave the reader wanting the next one. If it already names the mechanism the post exists to explain, cut that line and let the section that shows it do the work.

  > ❌ "Then I spent the summer inside a very large monolith where somebody had, partly, done it. Not as a document. As a set of things the agents could ask."
  >
  > ✅ "Then I spent the summer inside a very large monolith where somebody had, partly, done it."

- **Show the capability through the questions a working engineer asks.** A tool described in the abstract ("it returned which teams depended on the thing you were about to touch") means nothing. Ask the reader's own questions back at them, in their words, and the capability explains itself. Two or three questions; a fourth turns it into a list.

  > ❌ "It came back with which other teams depended on the thing you were about to change, and what it would cost them."
  >
  > ✅ "Does this migration touch a table another team reads directly? Does the default value you just added change what a consumer of this endpoint gets back? Is the field you renamed sitting inside an event that two other services listen to?"

- **Check who the first person makes the author in this post.** "I had never seen this before" is a fine, honest line in a post about a discovery — the corpus uses that register often. It fails when the post's authority rests on the author already doing the thing well: there, surprise reads as the junior in the room, and it undercuts every later claim. Decide per post which stance the piece is written from, then keep it consistent.

  > *The Map* is written from "I do this work, and here is what a good version looked like", so: ❌ "What I hadn't seen before were the agents." ✅ "The answer there was to build more agents. Of course it was; this is the AI era."

- **State the obvious move quickly, then move on.** When the reader can predict the answer (in an AI-era post: build agents), do not build suspense around it. Say it flatly, in its own short paragraph, and spend the space on the part that is actually new.

- **A paragraph gets one job.** When a sentence pair concedes something obvious and the next sentences turn to the real subject, split them. Two short paragraphs read faster than one paragraph that changes direction in the middle.

- **Never write from the middle of a book.** No sentence should assume the reader is still holding three earlier clauses in mind. One idea per sentence; break long ones at the natural "and" or "because" seam. Concrete everyday events beat abstract nouns — the sick kid and the two weeks off, not "attention", "working memory" or "cognitive load". Read it aloud: if you have to slow down to keep the referents straight, split it.


### Section Headings

**Headings live in their own file: `headings.md`, next to this one.** Two-to-four words, name the thing instead of describing it, don't spend the punchline, sentence case, plus a standalone audit pass. Read `.claude/skills/blog-writer/headings.md` before naming or renaming any section, and read it alone when the request is only about headings ("başlıkları gözden geçir", "bu başlık uzun mu") — no need to load the rest of this skill. It is the authority; this section does not repeat it.

- Do NOT use `---` horizontal rule separators between sections. One exception: the single `---` before the `_Sources_` footnote at the very end (see "Sources footnotes" below).
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

### TicketBlock — backlog artifacts

`<TicketBlock>` renders an artifact lifted out of a ticket: acceptance criteria, test cases, a task list, a `Done when` line. It is the third block type on the site, and the three do not overlap:

| Block | Use for | Reads as |
|---|---|---|
| Code block (``` ```) | Code, config, terminal output — anything a reader would run | Executable |
| `MdxBlockquote` (`>`) | A pause in the prose: an overheard line, a story sentence, an epigraph | Atmosphere |
| `TicketBlock` | Something a reader could paste into their own backlog | Artifact |

Choosing wrong is the common mistake: acceptance criteria in a code block claim to be runnable, and in a blockquote they claim to be a pause. They are neither.

Authoring is a plain markdown list as children — blank lines around the list are required, and props other than `label` are not supported (MDX does not pass array props):

```mdx
<TicketBlock label="Acceptance criteria">

- The export covers the selected date range and nothing outside it.
- A range with no tickets still produces a file, headers only.

</TicketBlock>
```

`label` is sentence case, short, and names the artifact ("Acceptance criteria", "Test cases", "The same case, in given / when / then"). Component lives at `components/writing/TicketBlock.tsx` and is registered for both `/writing` and `/lab`.

### Sources footnotes

A post that cites research ends with a numbered, two-way linked footnote. Not a paragraph of links, and not bare URLs in the prose.

In the body, the marker is a superscript link into the footnote:

```mdx
around 47% for the complex ones.<sup id="ref-1" className="scroll-mt-24">[1](#src-1)</sup>
```

At the very end of the post, after a single `---`, an italic `_Sources_` line and an ordered list:

```mdx
---

_Sources_

1. [Title of the paper](https://example.org/paper) — Venue, year. One sentence on what is actually cited, including the caveat if there is one.
```

`MdxOl` (`components/writing/MdxComponents.tsx`) gives each list item `id="src-N"` and prepends the `N.` back-link to `#ref-N`, so the reader can jump both ways. Numbering is by order of first appearance in the text. Say what each source supports and where it is weak — "correlational", "cited for the participant quote only" — rather than presenting every link as proof.

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

### SEO and AI search — what a post actually gets

Everything below is automatic per post; never hand-write it: sitemap entry, Article + BreadcrumbList JSON-LD, OG/Twitter meta (`og.webp` picked up by path), RSS item, canonical, and a line in `/llms.txt` (a generated route — `lib/llmsTxt.ts` — so a new post is listed by construction; a test fails if it isn't).

What moves discoverability, in order:
1. **H2 headings that name the artifacts** ("The user stories", "The acceptance criteria", "The test cases"). Headings are the strongest on-page keyword signal and they are already in-register.
2. **The `description`** — it is the meta description; make sure the searchable nouns are in it (epics, user stories, acceptance criteria), not only the mood.
3. **TicketBlocks and tables** — passage-level, quotable artifacts are what AI answer engines lift. This is the essay's GEO advantage; keep them.
4. **Bold does nothing.** Google barely weights `<strong>`, and this voice doesn't use it. Never bold for SEO.

An essay title ("The First Button") carries no search intent, and that is the right editorial call. If a post needs a searchable `<title>`/OG title without changing the H1, the option is an optional `seoTitle` frontmatter field consumed only by `buildArticleMetadata` — not implemented yet; propose it per post rather than assume it.

### Deployment Checklist

1. Branch created off `dev`, PR opened into `dev` (never commit to `dev` or `main` directly)
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

The blog's voice is deadpan humor with honest observations. **Calibrate against the recent posts, not the early ones.** The voice evolved: the first two posts (March 2026 — *hardest-refactor*, *accidental-engineering-manager*) end with explicit advice sections and bold-led tip lists; the no-prescription standard solidified from *The Moon, Again* onward (which names and refuses the advice ending on the page). Early-post advice endings are grandfathered, not license — hold new writing to the current bar. Watch for these violations:

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
- **Voice:** deadpan, observational, lived "we" when possible, concrete over abstract. No LinkedIn vocabulary, no aphorisms that flatten into maxims. (Same bar as the body — see the AI-detection dimension.) An established house option is the essayistic "On X, Y, and Z" closing tag (about half the corpus uses it: "On perfectionism, team diversity, and earning leadership…") — available, not required.
- **Function:** it earns its place by making a reader who sees *only* the description — link preview, search result, RSS feed — want to click, **without giving the answer.** Good test: would it make someone click without handing them the thesis? Flag descriptions that are pure summary, that spoil a payoff, or that read as SEO filler.

**2. Opening blockquote** — the convention lives in Part 1, "Opening Quote Block"; check the draft against it here rather than restating it. The usual failure is a blockquote that establishes instead of teasing, or one over ~24 words.

**3. Title ↔ description ↔ blockquote relationship**

- **They do different jobs.** The title is the *thesis promise* (the first thing every reader sees). The description is *meta-context* (seen off-page: link previews, search, RSS). The blockquote is *body-context* (atmosphere carrying the reader into §1). Each must earn its place independently.
- **None may duplicate another.** If any two say nearly the same content — same angle, imagery, or rhythm — one isn't earning its place (e.g. don't title with a phrase that already lives in the blockquote). The fix is different angles, not trimming one.
- **Always check the three elements together** and explicitly flag any duplication, naming which one should change and what different angle it should take.
- **Title-vs-thesis staleness (check every review).** Confirm the title still matches the *finalized* thesis and closing — a title written for an earlier draft is the most common orphaned element, and it misleads every reader before §1. Flag any title that sells an old ending, locks the reader into a framing the body refutes, or reintroduces one the edits removed.

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

**Production is owned by the `blog-writer` agent** (`.claude/agents/blog-writer.md`, Part 2) — it crafts the prompts below, generates the rasters via `.claude/skills/blog-writer/generate.mjs` (Google AI Studio Gemini, default `gemini-3.1-flash-image`, `--model` to override; needs `GEMINI_API_KEY` in `.env.local`), then optimizes and places them via `.claude/skills/blog-writer/optimize.mjs` (sharp, WebP q80 — covers 1200w, inline 800w, og 1200×630 cover-crop; replaces the manual Squoosh and Photopea steps).

Base prompt for all illustrations:

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

### Replacing an image that already has a URL

Next's image optimizer caches by URL, not by file content. If you overwrite `cover.webp` (or any image the dev server has already served), the page keeps showing the **old** image — `X-Nextjs-Cache: HIT` — even after a browser hard reload, and `curl` will lie to you because it gets a different (JPEG) cache entry than the browser (WebP/AVIF). Deleting `.next/cache/images` while the server is running fails silently (files are locked).

The only reliable sequence:

1. Stop every node process (`Get-Process node | Stop-Process -Force`).
2. Delete `.next` entirely.
3. `npm run dev` again.

Then verify with the browser, not curl. Budget for this every time an existing image path gets new bytes.

### Placement
- No fixed limit on count — effectiveness is the only criterion
- Cover image always required (3:2 ratio, 1200x800 before optimization)
- Inline images at critical transition points with short deadpan captions

---

## Part 4: Social Sharing

The share text is not a summary of the post. It is the author, in his own voice, telling a peer why he wrote it. Get the voice wrong and the content doesn't matter — the author rejects drafts on voice first, content second.

### Voice (non-negotiable)

- **The author does this work. He is not confessing.** Never open with "I've skipped this myself" or any self-deprecating admission that undercuts the expertise. The stance is: *I do this properly, it isn't hard, and it still surprises me how few teams do.* Surprise at rarity, never guilt.
- **Humanize means warm and direct, not soft.** First person, concrete scenes, a question at the end. It does not mean hedging, apologising, or making the practice sound optional.
- **Keep the credibility details.** "Not sloppy teams — good ones, shipping to millions, with a QA chapter and a Jira admin" survived every trim. Specifics that establish *who* skips this (strong teams) are what make the observation land; a compressed "good teams, too" reads thinner and was passed over.
- **Name the know-how.** List the actual artifacts the post teaches, plainly, as a mini table of contents: *an epic that can actually close, a story with a real benefit line, acceptance criteria written before anyone opens an editor.* This is what sells a technical reader; wit alone does not.
- **End with an invitation, not an announcement.** "Would like to hear if it matches what you see in your teams." Dialogue, not broadcast.
- **No spoilers.** Never quote the post's best lines. Paraphrase the scene loosely (the four-people-four-versions image is fine; "it's that it doesn't" and "merged guess" are not).

### LinkedIn — shape that worked

Three short paragraphs, ~110–140 words. The "3–4 sentences" cap from earlier posts is too tight for a know-how essay; length is fine as long as every sentence is concrete.

1. **The surprising observation + a scene.** What the author keeps seeing, who it happens to, one lived image.
2. **What I do, why it's cheap, why now.** The artifacts by name, the cost ("half an hour"), and the AI turn in one clause.
3. **"I wrote it up, with the examples I actually use" + a question.**

Exemplar (used for *The First Button*, 2026-09-06):

> Something that still surprises me: how few teams actually write their stories down. Not sloppy teams — good ones, shipping to millions, with a QA chapter and a Jira admin. The feature gets explained in a meeting, everyone nods, and by Monday it lives in four people's heads in four slightly different versions.
>
> I've been doing this properly for years and it's not hard. An epic that can actually close. A story with a real benefit line. Acceptance criteria written before anyone opens an editor. Half an hour of writing that saves a sprint of rework — and now that AI agents do a big part of the building, the cost of skipping it stopped being a conversation and became a merged pull request.
>
> I wrote the whole thing up, with the examples I actually use. Would like to hear if it matches what you see in your teams.

### X/Twitter

- 2–3 sentences + link. Same stance, compressed: the surprise, the scene, "wrote up how".
- Drop the credibility list; keep "good teams, too".

### Turkish version

- Offer it as a **separate** post, never a bilingual one. Same structure, same stance; keep the English artifact names (`epic`, `story`, `acceptance criteria`, `so that`) — that is how the audience says them.

### Process

- Expect 2–3 rounds. First draft is usually rejected on voice ("more humanize"), then on length ("okunsun"). Draft the confident-practitioner version first; it saves a round.
- Timing is free — share as soon as the post is live; both platforms on the same day is fine.
- Before sharing, check the OG card once (LinkedIn Post Inspector, X Card Validator) — a wrong card cached on first share is painful to fix.
- No forced pop culture references without context.

---

## Reference: Existing Posts

**Current-voice exemplars — calibrate new posts and reviews against these:**
- `content/posts/the-first-button.mdx` — Planning know-how (epics, stories, acceptance criteria, test cases); the most heavily co-edited post; TicketBlocks and tables inside an essay; plain sentences throughout
- `content/posts/the-ant-colony.mdx` — Organizational misalignment, lived "we" register, sentence-case headings, sustained metaphor (ant colony), no prescriptive ending
- `content/posts/the-nuclear-reactor-in-your-codebase.mdx` — AI + systems complexity, extended historical analogy (Chernobyl), "No clean answer" ending
- `content/posts/the-moon-again.mdx` — Legacy systems via Artemis II; explicitly refuses the advice ending on the page; attribution-style opening blockquote (joke quote + "— every developer…")

**Earlier posts — useful for range, but they predate the no-prescription standard (advice endings, bold tip lists, Title Case headings in two):**
- `content/posts/hardest-refactor.mdx` — Personal narrative, first post; colon-subtitle title; ends with direct advice
- `content/posts/accidental-engineering-manager.mdx` — AI + management; ends with a bold-led tip list; repeats its opening blockquote verbatim in the body (now a rule violation — rule stands)
- `content/posts/when-everyone-has-a-superpower.mdx` — Homogeneity + creativity; first post to carry a sources footnote, retrofitted in Sept 2026 to the numbered form
- `content/posts/the-revolution-has-no-manual.mdx` — AI economy, longest post; Title Case headings; has the corpus's only mid-body blockquote
