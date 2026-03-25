# Navigation Audit Report — Recruiter Journey

> Generated on 2026-03-25 — to be addressed when Contact and Writing pages are built.

Comprehensive navigation-focused UI/UX audit from a recruiter's perspective, evaluating all CTAs, page flows, and navigation paths across the site. Assessed against UI/UX Pro Max navigation pattern rules (`nav-state-active`, `deep-linking`, `escape-routes`, `persistent-nav`, `navigation-consistency`, `back-stack-integrity`, `empty-nav-state`, `skip-links`).

---

## The Recruiter's Journey (Simulated Flow)

```
Homepage -> Hero CTAs -> "Explore down" scrolls to #systems
                      -> "Get in touch" leads to /contact -> 404 !!
         -> Systems cards -> external links (all open new tabs, fine)
         -> "follow the light" -> /about (works)

/about -> story, photos, work philosophy
       -> Bottom CTAs: "Curious about my work?" -> /cv (works)
                       "Want to get in touch?" -> /contact -> 404 !!

/cv -> Full CV with PDF download, experience timeline
    -> PDF download button (external Google Drive link)
    -> NO bottom CTAs — dead end after scrolling

Nav bar -> Systems (works), Writing (404), About (works), CV (works), Contact (404)
Footer -> GitHub, LinkedIn, X, Email (all work)
```

---

## Issues Found

### CRITICAL — Broken Links (2 pages return 404)

| Link | Referenced From | Result |
|------|----------------|--------|
| `/contact` | Hero CTA, About bottom CTA, Nav bar | **404** |
| `/writing` | Nav bar | **404** |

These are the two most damaging issues. A recruiter clicking "Get in touch" from the hero — the primary conversion CTA — lands on a 404. This breaks the entire conversion funnel.

**Violated rules**: `deep-linking` (all key screens must be reachable), `back-stack-integrity` (never land on an unexpected page), `empty-nav-state` (when unavailable, explain why instead of silently hiding)

### HIGH — CV Page is a Dead End

The CV page has **no bottom CTAs**. After reading the full CV, the recruiter has no guided next step. Every other page (home, about) ends with clear CTAs that push the recruiter forward. The CV — the page most likely to trigger action — just stops.

**Missing**: A CTA like "Want to work together?" linking to contact, or "Learn more about me" linking to about.

**Violated rule**: `escape-routes` — always provide a clear next action

### HIGH — No Active Nav State

All nav links render with identical `text-neutral-400` styling. There is **no visual indicator** showing which page the user is currently on. On `/about`, the "About" link looks identical to every other nav link.

**Violated rule**: `nav-state-active` — current location must be visually highlighted (color, weight, indicator)

### MEDIUM — No Skip-to-Content on CV Page

The homepage and about page both have a "Skip to content" link for accessibility. The CV page does **not** — it goes straight from navigation to main content with no skip link.

**Violated rules**: `skip-links`, `navigation-consistency`

### MEDIUM — Footer is Not a Navigation Aid

The footer contains only social/external links. For a recruiter-focused site, the footer is a missed opportunity — it could reinforce internal navigation (About, CV, Contact) to catch recruiters who scroll past the bottom CTAs.

**Violated rule**: `persistent-nav` — core navigation must remain reachable from deep pages

### LOW — "Systems" Nav Link Behavior

The "Systems" nav link points to `/#systems` (anchor on homepage). When clicked from `/about` or `/cv`, it navigates back to the homepage and scrolls — this works, but the behavior differs from other nav links (which are full page navigations). Not a bug, but slightly inconsistent.

---

## Journey Flow Map

```
                    +----------------+
                    |   HOMEPAGE     |
                    |                |
                    | Hero CTAs:     |
                    |  Explore       |---- scrolls to #systems (OK)
                    |  Get in touch  |---- /contact (404!!)
                    |                |
                    | Systems grid   |---- external links (OK)
                    |                |
                    | follow the     |
                    | light          |--+
                    +----------------+  |
                                        |
                    +----------------+  |
                    |    ABOUT       |<-+
                    |                |
                    | Story +        |
                    | Photos         |
                    |                |
                    | Bottom CTAs:   |
                    |  My work?      |--+
                    |  Touch?        |--+-- /contact (404!!)
                    +----------------+  |
                                        |
                    +----------------+  |
                    |      CV        |<-+
                    |                |
                    | PDF download   |---- Google Drive (OK)
                    | Experience     |
                    | Skills         |
                    |                |
                    | (NO CTAs)      |---- DEAD END
                    +----------------+

                    +----------------+
                    |   WRITING      |---- 404!!
                    +----------------+

                    +----------------+
                    |   CONTACT      |---- 404!!
                    +----------------+
```

---

## Summary by Severity

| Severity | Issue | UX Rule |
|----------|-------|---------|
| CRITICAL | `/contact` is 404 — breaks primary conversion CTA | `deep-linking` |
| CRITICAL | `/writing` is 404 — nav link to nonexistent page | `deep-linking`, `empty-nav-state` |
| HIGH | CV page has no bottom CTAs — dead end | `escape-routes` |
| HIGH | No active state on nav links | `nav-state-active` |
| MEDIUM | CV page missing skip-to-content link | `skip-links`, `navigation-consistency` |
| MEDIUM | Footer lacks internal navigation links | `persistent-nav` |
| LOW | "Systems" anchor-link behavior differs from page links | `navigation-consistency` |

---

## Recommended Recruiter Funnel

The ideal recruiter journey is:

**Homepage -> About -> CV -> Contact**

Each page should end with a CTA that pushes the recruiter to the next step in this funnel. Currently the chain breaks at the final step because `/contact` doesn't exist, and the CV (the decision-making page) offers no next step.

### Action Items

1. **Create `/contact` page** — This is the highest priority. The primary hero CTA and about page CTA both point here.
2. **Create `/writing` page** — Or remove from nav until ready (per `empty-nav-state`: explain unavailability rather than showing 404).
3. **Add bottom CTAs to CV page** — e.g., "Want to work together?" linking to contact.
4. **Add active state to nav links** — Highlight current page in navigation bar.
5. **Add skip-to-content link on CV page** — Match homepage and about page accessibility pattern.
6. **Add internal links to footer** — Reinforce About, CV, Contact navigation.
