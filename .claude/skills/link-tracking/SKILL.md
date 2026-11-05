---
name: link-tracking
description: Decide whether a link on mehmetfahriozmen.dev gets analytics tracking, and which event it sends. Use when adding, changing or reviewing any Link, <a>, TrackedNextLink or TrackedAnchor, when writing components with navigation or CTAs, and in every PR review that touches links.
---

# Link Tracking

Track a link only when its click answers a question the page view does not already answer. Tracking a click that tells us nothing new is noise in Umami.

## Decide

Ask: **"What would I learn from this click that I can't see from the next page view?"**

| Track (`TrackedNextLink` / `TrackedAnchor`) | Leave plain (`Link` / `<a>`) |
|---|---|
| Menu links (header, mobile drawer, footer): which section people pick, and from where | Logo / home links: "went home" says nothing |
| CTAs and cards (post cards, featured systems, latest signals, "try the Lab") | 404 page home link: the 404 view is already counted |
| Outbound links: the next page view happens on another site, so it is invisible | Post-submit utility links (e.g. "back home" after the contact form): the submit is the signal |
| Social, share, RSS and download links | Skip links (`href="#main"`) and other accessibility-only anchors |
| In-content cross links, footnotes, heading anchors, post navigation | Links rendered only in error/fallback states |

If a link is not covered by the table, track it only if you can name the question its click answers. If you can't, leave it plain.

## How

- Internal: `TrackedNextLink` from `@/components/TrackedLink`. External: `TrackedAnchor`. Both need `eventName` and `eventData`. `TrackedNextLink` accepts `onClick`, which runs after tracking (for example to close the drawer).
- Reuse an existing event before you invent one. Put the variation in `eventData`, not in the name:
  - `nav-click` `{ label, location: "header" | "drawer" | "footer" }`
  - `cta-click`, `post-card-click`, `featured-system-click`, `latest-signal-click`, `post-nav-click`
  - `social-link-click` `{ platform }`, `share-click`, `outbound-link`, `internal-link`
  - `footnote-jump`, `footnote-return`, `heading-anchor`, `back-nav`, `cv-pdf-download`
- `eventData` values are strings. Include whatever identifies the click (slug, label, platform, page path).

## Review

When a diff adds or changes a link:
1. **Should be tracked but isn't:** a plain `Link`/`<a>` in the "Track" column → Warning.
2. **Tracked but shouldn't be:** a tracked link in the "Leave plain" column → Suggestion (it's noise, not breakage).
3. **New event name** that duplicates an existing one with different wording → Suggestion: reuse the existing name and move the difference into `eventData`.
4. **Missing identifying `eventData`** (e.g. a card click without the slug) → Warning.
