# SEO Audit Report v2 — mehmetfahriozmen.dev

> Generated on 2026-03-26. Compared against v1 audit (same date, pre-fix).

## Executive Summary

**SEO Health Score: 82/100** (was 32/100 — +50 points)

| Category | v1 Score | v2 Score | Weight | v2 Weighted | Change |
|----------|----------|----------|--------|-------------|--------|
| Technical SEO | 35 | 90 | 22% | 19.8 | +55 |
| Content Quality | 72 | 75 | 23% | 17.3 | +3 |
| On-Page SEO | 40 | 92 | 20% | 18.4 | +52 |
| Schema / Structured Data | 0 | 85 | 10% | 8.5 | +85 |
| Performance (CWV) | N/A | 80* | 10% | 8.0 | new |
| AI Search Readiness | 15 | 70 | 10% | 7.0 | +55 |
| Images | 60 | 65 | 5% | 3.3 | +5 |
| **Total** | **~32** | **~82** | | | **+50** |

*CWV estimated based on SSG + Vercel CDN + next/font + WebP images.

---

## Before / After Comparison

### Per-Page Metadata

| Page | Field | v1 | v2 |
|------|-------|----|----|
| **All pages** | metadataBase | Missing | `https://mehmetfahriozmen.dev` |
| **All pages** | Title template | None | `%s — Mehmet Fahri Özmen` |
| **All pages** | OG tags | Missing | Complete (type, siteName, locale, image) |
| **All pages** | Twitter card | Missing | `summary_large_image` + `@mfozmen` |
| **All pages** | Canonical URL | Missing | Set on every page |
| `/` | Own metadata | Inherited from layout | Explicit title + description |
| `/about` | OG override | Missing | title + description |
| `/cv` | OG override | Missing | title + description |
| `/cv` | JSON-LD | Missing | ProfilePage schema |
| `/writing` | OG override | Missing | title + description |
| `/writing/[slug]` | OG image | Missing | Cover image (1200x800) |
| `/writing/[slug]` | OG type | Missing | `article` with publishedTime + authors |
| `/writing/[slug]` | Twitter image | Missing | Cover image |
| `/writing/[slug]` | JSON-LD | Missing | Article schema (headline, author, date, image) |
| `/contact` | OG override | Missing | title + description |

### Infrastructure

| Item | v1 | v2 |
|------|----|----|
| robots.txt | 404 | `app/robots.ts` — allow all, sitemap reference |
| sitemap.xml | 404 | `app/sitemap.ts` — 5 static pages + dynamic blog posts |
| Default OG image | Missing | `app/opengraph-image.tsx` — 1200x630 dynamic (dark/amber) |
| llms.txt | Missing | `public/llms.txt` — author bio, expertise, pages, projects |

### JSON-LD Structured Data

| Schema | v1 | v2 |
|--------|----|----|
| Person | Missing | Root layout — name, jobTitle, url, sameAs, knowsAbout |
| WebSite | Missing | Root layout — name, url, description, author |
| ProfilePage | Missing | CV page — mainEntity Person with sameAs |
| Article | Missing | Blog posts — headline, datePublished, author, image, url |

---

## Remaining Issues

| Severity | Issue | Notes |
|----------|-------|-------|
| MEDIUM | No BreadcrumbList schema on blog posts | Home > Writing > Post Title |
| MEDIUM | No RSS feed (/feed.xml) | Useful for blog subscribers |
| LOW | No rel="me" on social links | Identity verification for search engines |
| LOW | No dynamic OG image per blog post | Cover image is used but not a branded OG card |
| LOW | Writing listing page has no JSON-LD | Could add CollectionPage schema |

---

## What Was Fixed (Items 1-9 from v1 Action Plan)

| # | Item | Status |
|---|------|--------|
| 1 | Add metadataBase to root layout | DONE |
| 2 | Add OG + Twitter Card to all pages | DONE |
| 3 | Create app/robots.ts | DONE |
| 4 | Create app/sitemap.ts | DONE |
| 5 | Add JSON-LD structured data | DONE (Person, WebSite, ProfilePage, Article) |
| 6 | Blog post OG image | DONE (cover image wired to OG + Twitter) |
| 7 | Add canonical URLs | DONE (all pages) |
| 8 | Create default OG image | DONE (app/opengraph-image.tsx, dynamic) |
| 9 | Homepage own metadata | DONE (explicit title + description) |

### Also Added (not in original plan)

- `public/llms.txt` for AI search readiness
- Title template (`%s — Mehmet Fahri Özmen`) for consistent page titles
- `article:published_time` and `article:author` on blog OG tags
- Twitter `creator` set to `@mfozmen`

---

## Score Breakdown Reasoning

### Technical SEO: 35 -> 90

- robots.txt now exists (+20)
- sitemap.xml with dynamic pages (+20)
- metadataBase set (+10)
- Canonical URLs on all pages (+5)
- Remaining gap: no noindex on utility pages, no security headers audit

### On-Page SEO: 40 -> 92

- All pages have explicit metadata (+15)
- OG tags complete on all pages (+20)
- Twitter cards configured (+10)
- Title template for consistency (+7)
- Remaining gap: no BreadcrumbList

### Schema / Structured Data: 0 -> 85

- Person schema on root (+25)
- WebSite schema on root (+20)
- ProfilePage on CV (+15)
- Article on blog posts (+25)
- Remaining gap: no BreadcrumbList, no CollectionPage

### AI Search Readiness: 15 -> 70

- llms.txt created (+25)
- Structured data establishes entity (+15)
- sameAs links to social profiles (+10)
- knowsAbout for topic authority (+5)
- Remaining gap: no explicit AI crawler permissions in robots.txt
