# SEO Audit Report — mehmetfahriozmen.dev

> Generated on 2026-03-26. Site version: v0.14.0

## Executive Summary

**SEO Health Score: 32/100**

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Technical SEO | 35/100 | 22% | 7.7 |
| Content Quality | 72/100 | 23% | 16.6 |
| On-Page SEO | 40/100 | 20% | 8.0 |
| Schema / Structured Data | 0/100 | 10% | 0.0 |
| Performance (CWV) | N/A | 10% | -- |
| AI Search Readiness | 15/100 | 10% | 1.5 |
| Images | 60/100 | 5% | 3.0 |
| **Total** | | | **~32** |

**Business type detected:** Personal Portfolio / Engineering Leadership

---

## What's Working

- Every page has a unique title and meta description
- Dynamic metadata generation for blog posts (title + excerpt from MDX)
- Correct html lang="en"
- Favicon set with multiple sizes (ico, svg, 96x96, apple-touch-icon)
- Web app manifest configured
- All pages are statically generated (SSG) — fast TTFB
- Geist font loaded via next/font (no FOIT)
- WebP images used for blog illustrations
- Clean URL structure: /about, /cv, /writing, /contact, /writing/[slug]

---

## Critical Issues

| # | Issue | Impact | Pages Affected |
|---|-------|--------|----------------|
| 1 | No robots.txt | Search engines have no crawl directives | Entire site |
| 2 | No sitemap.xml | Search engines can't discover all pages efficiently | Entire site |
| 3 | No Open Graph tags | Links shared on LinkedIn, Twitter, Slack show no preview image | All 6 pages |
| 4 | No JSON-LD structured data | No Person, WebSite, or Article schema for rich results | All 6 pages |
| 5 | No metadataBase in root layout | OG URLs would be relative without it | Entire site |
| 6 | Blog post has no OG image | Cover illustration not wired to OG tags | /writing/hardest-refactor |

---

## Per-Page Metadata Status

| Page | Title | Description | OG | Twitter | Canonical | JSON-LD |
|------|-------|-------------|----|---------|-----------|---------|
| / | Inherits from layout | Inherits from layout | Missing | Missing | Missing | Missing |
| /about | About -- Mehmet Fahri Ozmen | Good | Missing | Missing | Missing | Missing |
| /cv | CV -- Mehmet Fahri Ozmen | Good (mentions experience) | Missing | Missing | Missing | Missing |
| /writing | Writing -- Mehmet Fahri Ozmen | Good | Missing | Missing | Missing | Missing |
| /writing/hardest-refactor | Dynamic (good) | Dynamic from excerpt | Missing | Missing | Missing | Missing |
| /contact | Contact -- Mehmet Fahri Ozmen | Good | Missing | Missing | Missing | Missing |

---

## AI Search Readiness (GEO)

| Signal | Status | Notes |
|--------|--------|-------|
| AI crawler access | UNKNOWN | No robots.txt -- GPTBot, ClaudeBot, PerplexityBot not explicitly allowed or blocked |
| llms.txt | MISSING | No /llms.txt file for LLM-friendly content summary |
| Passage-level citability | MEDIUM | Blog post has clear h2 sections -- good for citation. No schema to reinforce authority. |
| Brand mention signals | LOW | No structured data linking to LinkedIn, GitHub, or establishing the author as an entity |
| Content uniqueness | HIGH | Original editorial content. Explorer/finisher framework is highly citable. |

---

## Prioritized Action Plan

### Critical (fix immediately)

1. **Add metadataBase to root layout**
   - Set `metadataBase: new URL("https://mehmetfahriozmen.dev")` in app/layout.tsx

2. **Add Open Graph + Twitter Card metadata to all pages**
   - Root layout: default OG image, site name, type
   - Each page: override with page-specific title, description
   - Blog post: use cover image as OG image dynamically

3. **Create app/robots.ts**
   - Allow all crawlers, reference sitemap URL

4. **Create app/sitemap.ts**
   - Include all 6 static pages + all blog post slugs dynamically
   - Set appropriate lastModified and changeFrequency

5. **Add JSON-LD structured data**
   - Root layout: WebSite + Person schema
   - Blog post: Article schema with author, datePublished, image
   - CV page: ProfilePage schema

### High (fix within 1 week)

6. **Add canonical URLs** -- automatic when metadataBase is set
7. **Create a default OG image** -- static at public/og-default.png (1200x630) or dynamic via app/opengraph-image.tsx
8. **Add public/llms.txt** -- structured summary of site content, author bio, key topics
9. **Homepage needs its own metadata export** -- currently inherits from layout

### Medium (fix within 1 month)

10. **Add BreadcrumbList schema to blog posts** -- Home > Writing > Post Title
11. **Add article:published_time and article:author OG tags to blog posts**
12. **Consider dynamic OG image generation** -- app/opengraph-image.tsx with post title + author name

### Low (backlog)

13. Add alternate hreflang if planning multi-language content
14. Add RSS feed (/feed.xml) for blog subscribers
15. Consider adding rel="me" links to GitHub/LinkedIn for identity verification

---

## Technical Details

### Heading Structure (all pages)

- **Homepage**: H1 "Mehmet Fahri Ozmen" > H2 "What I've built" > H3s (project names)
- **About**: H1 "Hey, I'm Mehmet Fahri." > H2s (Where it started, What I do, When I'm not coding)
- **CV**: H1 "Mehmet Fahri Ozmen" > H2s (The Journey So Far, The Arsenal, Launch Pad, Comm Protocols)
- **Writing**: H1 "Field Notes" > H2 "Latest" > H3 (post titles)
- **Blog Post**: H1 (post title) > H2s (6 section headings)
- **Contact**: H1 "Send a Transmission" > H2 "Message"

All pages have correct sequential heading hierarchy (no level skips).

### Existing Configuration

- next.config.ts: empty/default (no SEO config)
- No app/robots.ts or public/robots.txt
- No app/sitemap.ts or public/sitemap.xml
- No JSON-LD anywhere in codebase
- No OpenGraph or Twitter Card metadata in any page
- No app/opengraph-image.tsx

### Assets Available

- Favicon: ico, svg, 96x96 png, apple-touch-icon
- Web manifest: 192x192 + 512x512 icons
- Blog cover images: hardest-refactor-cover.webp (1200x800)
