# SEO Audit Report v3 — mehmetfahriozmen.dev (Live Site)

> Generated on 2026-03-26. Audited live production site (v0.15.2).

## Executive Summary

**SEO Health Score: 88/100** (v1: 32, v2: 82, v3: 88 — +6 from v2)

| Category | v1 | v2 | v3 | Weight | v3 Weighted |
|----------|-----|-----|-----|--------|-------------|
| Technical SEO | 35 | 90 | 95 | 22% | 20.9 |
| Content Quality | 72 | 75 | 78 | 23% | 17.9 |
| On-Page SEO | 40 | 92 | 92 | 20% | 18.4 |
| Schema / Structured Data | 0 | 85 | 90 | 10% | 9.0 |
| Performance (CWV) | -- | 80 | 80 | 10% | 8.0 |
| AI Search Readiness | 15 | 70 | 78 | 10% | 7.8 |
| Images | 60 | 65 | 68 | 5% | 3.4 |
| **Total** | **32** | **82** | **88** | | |

---

## What Changed Since v2

| Item | v2 Status | v3 Status | Change |
|------|-----------|-----------|--------|
| Blog post meta description | 46 chars (too short) | 198 chars | Fixed — LinkedIn Post Inspector compliant |
| OG image readability | Small text (64px name) | Large text (88px name) | Fixed — readable at WhatsApp 400px preview |
| Per-post OG image readability | Small text (48px title) | Large text (72px title) | Fixed — readable at small preview sizes |
| www redirect | Not tested | 301 to non-www | Verified — handled by Vercel edge |
| RSS feed | Implemented in v2 | Live and serving | Verified on production |
| llms.txt | Implemented in v2 | Live and serving | Verified on production |

---

## Live Site Verification Results

### Per-Page Metadata (verified on production)

| Page | Title | Description | OG Title | OG Image | OG Type | Canonical | JSON-LD |
|------|-------|-------------|----------|----------|---------|-----------|---------|
| / | Mehmet Fahri Ozmen -- Backend Systems Architect | 113 chars | Yes | /opengraph-image | website | Yes | Person, WebSite |
| /about | About -- Mehmet Fahri Ozmen | 81 chars | Yes | Inherits root | Inherits | Yes | Person, WebSite |
| /cv | CV -- Mehmet Fahri Ozmen | 137 chars | Yes | Inherits root | Inherits | Yes | Person, WebSite, ProfilePage |
| /writing | Writing -- Mehmet Fahri Ozmen | 89 chars | Yes | Inherits root | Inherits | Yes | Person, WebSite, CollectionPage |
| /writing/hardest-refactor | The Hardest Refactor... -- MFO | 198 chars | Yes | /writing/.../opengraph-image | article | Yes | Person, WebSite, Article, BreadcrumbList |
| /contact | Contact -- Mehmet Fahri Ozmen | 49 chars | Yes | Inherits root | Inherits | Yes | Person, WebSite |

### Infrastructure (verified on production)

| Item | Status | Details |
|------|--------|---------|
| robots.txt | Live | Allow all, sitemap reference |
| sitemap.xml | Live | 6 URLs with priorities and frequencies |
| feed.xml | Live | RSS with 1 article, auto-discovery link in head |
| llms.txt | Live | Author bio, expertise, pages, projects |
| opengraph-image | Live | Dynamic 1200x630, dark/amber, readable at 400px |
| Per-post OG image | Live | Dynamic with post title, readable at 400px |
| www redirect | Live | 301 to non-www (Vercel edge) |

### JSON-LD Coverage (verified on production)

| Schema | Pages | Status |
|--------|-------|--------|
| Person | All pages (root layout) | name, jobTitle, url, sameAs, knowsAbout |
| WebSite | All pages (root layout) | name, url, description, author |
| ProfilePage | /cv | mainEntity Person with sameAs |
| Article | /writing/hardest-refactor | headline, datePublished, author, image, url |
| BreadcrumbList | /writing/hardest-refactor | Home > Writing > Post Title |
| CollectionPage | /writing | ItemList with all posts |

---

## Remaining Issues

| Severity | Issue | Notes |
|----------|-------|-------|
| MEDIUM | og:image missing on /about, /cv, /writing, /contact | These pages inherit the root OG image via opengraph-image.tsx but don't show it in HTML meta tags. Next.js file-based OG images are served via a separate route — social platforms should pick them up, but explicit meta tags would be more reliable. |
| LOW | og:type missing on /about, /cv, /writing, /contact | Should default to "website" but not explicitly set in child page OG overrides |
| LOW | Contact description only 49 chars | Below LinkedIn's 100-char recommendation |
| LOW | Homepage og:description differs from meta description | Intentional (different audiences) but worth noting |
| LOW | CV og:description truncated vs meta description | Missing domain specifics (e-commerce, ad-tech, etc.) |

---

## Score Improvement Journey

```
v1 (pre-fix):  32/100  — No robots, no sitemap, no OG, no JSON-LD
v2 (post-fix): 82/100  — All critical + high items implemented
v3 (live):     88/100  — Blog description fixed, OG images enlarged, live verification
```

### What drove each improvement

- **v1 -> v2 (+50)**: metadataBase, OG tags, JSON-LD (Person, WebSite, Article, ProfilePage), robots.txt, sitemap.xml, canonical URLs, title template, llms.txt
- **v2 -> v3 (+6)**: Blog excerpt expanded (46 -> 198 chars), OG images enlarged for mobile preview readability, BreadcrumbList + CollectionPage JSON-LD, RSS feed, rel=me on social links, www 301 redirect verified

### What remains for 100/100

- Add explicit og:image meta tags to child pages (or create per-page opengraph-image.tsx files)
- Expand short descriptions (contact: 49 chars)
- Add og:type to child page OG overrides
- Consider adding more blog posts (content depth signals)
