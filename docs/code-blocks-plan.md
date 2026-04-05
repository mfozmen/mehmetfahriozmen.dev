# Code Block System — Implementation Plan

## Overview

Upgrade the code block experience across Lab Day and Writing posts with syntax highlighting, copy buttons, language labels, line highlighting, diff support, collapsible long blocks, and a markdown source/rendered toggle.

## Libraries

- **Shiki** — server-side syntax highlighting, zero client JS, no flash
- **rehype-pretty-code** — rehype plugin bridging Shiki with MDX, provides line highlighting, titles, line numbers, diff via standard fence syntax

## Custom Theme: "Deep Space"

Dimmer amber for large-surface tokens, full `#BA7517` reserved for small UI elements only.

| Token | Color | Notes |
|-------|-------|-------|
| Background | `#0d0d0d` | Matches existing code block bg |
| Foreground (default) | `#d4d4d4` | Clean gray |
| Keywords | `#A06614` | Dimmed amber (~85%) |
| Strings | `#B8896A` | Warm tan |
| Comments | `#525252` | Site's muted gray |
| Functions/methods | `#D4A86A` | Light gold |
| Types/classes | `#C49050` | Medium amber-brown |
| Numbers/constants | `#B8896A` | Same as strings |
| Operators/punctuation | `#737373` | Neutral gray |
| Variables | `#D4D4D4` | Default foreground |
| HTML tags | `#A06614` | Same as keywords |
| Attributes | `#B8896A` | Same as strings |
| Regex | `#C49050` | Same as types |
| JSON keys | `#D4A86A` | Same as functions |
| Markdown headings | `#D4A86A` | Structural |

Full `#BA7517` reserved for: language label badge, copy button, filename header border accent, line highlight bg tint (~6% opacity).

## Phase 1: Core Code Block System

### Features

1. **Syntax highlighting** — Shiki + rehype-pretty-code, server-side via MDXRemote options
2. **Language label** — badge in top-right corner of code block, reads `data-language`
3. **Copy button** — client component, `navigator.clipboard`, "Copied!" feedback for 2s
4. **Filename header** — ` ```ts title="src/lib/auth.ts" ` renders as `<figcaption>`
5. **Line highlighting** — ` ```ts {4-6} ` adds `data-highlighted-line`, styled with amber bg tint
6. **Line numbers** — ` ```ts showLineNumbers ` enables CSS counters
7. **Diff highlighting** — `+`/`-` prefixed lines get `.diff.add` (amber tint) / `.diff.remove` (red tint)
8. **Long block collapse** — blocks > 400px collapse with fade gradient + "Show more" button
   - Per-block overrides: `expandable={false}` disables collapse, `maxHeight={600}` sets custom threshold
   - Meta string attributes forwarded as data attributes on `<pre>`
9. **Inline code** — subtle amber border/bg styling, consistent across Lab and Writing

### Architecture

```
MDX source
  -> rehype-pretty-code (server-side, via MDXRemote options)
  -> Shiki tokenizes + applies theme colors as CSS vars
  -> Outputs <figure data-rehype-pretty-code-figure>
  -> Custom components intercept:
     figure -> CodeBlockWrapper (collapse/expand)
     figcaption[data-rehype-pretty-code-title] -> FilenameHeader
     pre -> CodePre (language label + copy button)
     code (inline) -> InlineCode (amber-tinted)
```

### Components

| Component | File | Client/Server |
|-----------|------|---------------|
| CodeBlockWrapper | `components/writing/CodeBlock.tsx` | Client (height measurement + state) |
| CodePre | same file | Client (copy needs clipboard API) |
| InlineCode | same file | Server |
| Theme | `lib/shikiTheme.ts` | Server (build-time) |
| Plugin config | `lib/rehypePrettyCode.ts` | Server |

### CSS Strategy

All code block styles in `app/globals.css` using rehype-pretty-code data attributes:
- `[data-rehype-pretty-code-figure]` — figure wrapper
- `[data-rehype-pretty-code-title]` — filename header
- `[data-line]` — each line
- `[data-highlighted-line]` — highlighted line bg
- `[data-line-numbers]` — CSS counter setup
- `.diff.add` — amber-green tint
- `.diff.remove` — red tint

### Migration Safety

1. Install deps, create theme, create new components
2. Add rehype-pretty-code to MDXRemote options in both slug pages
3. Update component maps to use new components
4. Verify rendering with Playwright
5. Only then remove old LabMdxPre/LabMdxCode definitions
6. Run tests, verify again

### Files Changed

| Action | File |
|--------|------|
| New | `lib/shikiTheme.ts` |
| New | `lib/rehypePrettyCode.ts` |
| New | `components/writing/CodeBlock.tsx` |
| Modify | `app/lab/[slug]/page.tsx` — add rehype plugin, update components |
| Modify | `app/writing/[slug]/page.tsx` — add rehype plugin, update components |
| Modify | `app/globals.css` — code block styles |
| Modify | `package.json` — add shiki + rehype-pretty-code |
| Remove | LabMdxPre, LabMdxCode from lab slug page (after verification) |

## Phase 2: MarkdownDemo Component

### Feature

`<MarkdownDemo>` — a custom MDX component that wraps a markdown code block and adds a "Source / Rendered" toggle button. Default view is source (syntax-highlighted markdown). Toggle switches to rendered markdown output.

### Use Case

The first Lab Day post contains markdown skill file examples. Readers benefit from seeing both the raw markdown structure and the rendered result.

### Architecture

- Client component (`"use client"`) with toggle state
- Source view: the code block rendered by Phase 1's system (syntax-highlighted markdown)
- Rendered view: markdown content rendered via a lightweight markdown renderer (not full MDX — just standard markdown to HTML)
- Used explicitly in MDX as `<MarkdownDemo>` wrapper, not automatically applied to every markdown block

### RSC Considerations

- MDXRemote runs server-side, but MarkdownDemo needs client-side toggle
- The source code block HTML is pre-rendered by Shiki (server)
- The rendered markdown can be pre-rendered server-side and hidden/shown via CSS or client state
- Alternative: render both views server-side, toggle visibility client-side (no client-side markdown parsing needed)

### Files

| Action | File |
|--------|------|
| New | `components/writing/MarkdownDemo.tsx` |
| Modify | MDX component maps in both slug pages |

## Testing Plan

1. Verify all existing code blocks in Lab Day post render with syntax highlighting
2. Test language label + copy button on every code block
3. Test long block collapse on the markdown skill example blocks
4. Test at 1440px and 390px with Playwright MCP
5. Run `npm test` — all tests pass
6. Run `npm run build` — no build errors
7. Check SonarCloud quality gate after push
