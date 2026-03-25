# Navigation Audit Report — Recruiter Journey (v2)

> Updated 2026-03-26 — reflects current state after all navigation fixes.

Comprehensive navigation audit from a recruiter's perspective, evaluating all CTAs, page flows, and navigation paths. Assessed against UI/UX Pro Max navigation pattern rules.

---

## The Recruiter's Journey (Simulated Flow)

```
Homepage -> Hero CTAs -> "Explore" scrolls to #systems (OK)
                      -> "Get in touch" -> /contact (OK)
         -> Systems cards -> external links (OK)
         -> "follow the light" -> /about (OK)

/about -> story, photos, work philosophy
       -> Bottom CTAs: "Curious about my work?" -> /cv (OK)
                       "Want to get in touch?" -> /contact (OK)

/cv -> Full CV with PDF download, experience timeline
    -> Bottom CTAs: "Want to work together?" -> /contact (OK)
                    "Read my thoughts?" -> /writing (OK)

/writing -> Post listing with cards
         -> Post card -> /writing/hardest-refactor (OK)

/writing/hardest-refactor -> Full article
         -> "Back to Writing" -> /writing (OK)
         -> Share row: Copy link, LinkedIn, X (OK)
         -> "Curious who wrote this?" -> /about (OK)
         -> "Want to talk about this?" -> /contact (OK)

/contact -> Contact form with Formspree
         -> Direct channels: email, LinkedIn, X (OK)
         -> Success: "Send another" + "Back to home" (OK)

Nav bar -> Systems (OK), Writing (OK), About (OK), CV (OK), Contact (OK)
         -> Active state highlights current page in amber (OK)
Footer -> Internal: About, CV, Writing, Contact (OK)
       -> Social: GitHub, LinkedIn, X, Email (OK)
```

---

## Journey Flow Map

```
                    +----------------+
                    |   HOMEPAGE     |
                    |                |
                    | Hero CTAs:     |
                    |  Explore       |---- scrolls to #systems (OK)
                    |  Get in touch  |---- /contact (OK)
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
                    |  Get in touch? |--+-- /contact (OK)
                    +----------------+  |
                                        |
                    +----------------+  |
                    |      CV        |<-+
                    |                |
                    | PDF download   |---- Google Drive (OK)
                    | Experience     |
                    | Skills         |
                    |                |
                    | Bottom CTAs:   |
                    |  Work together?|---- /contact (OK)
                    |  My thoughts?  |---- /writing (OK)
                    +----------------+

                    +----------------+
                    |   WRITING      |---- listing page (OK)
                    |                |
                    | Post card      |---- /writing/slug (OK)
                    +----------------+
                            |
                    +----------------+
                    |   POST         |
                    |                |
                    | Back to Writing|---- /writing (OK)
                    | Share row      |---- copy/LinkedIn/X (OK)
                    | Who wrote this?|---- /about (OK)
                    | Talk about it? |---- /contact (OK)
                    +----------------+

                    +----------------+
                    |   CONTACT      |---- form + direct channels (OK)
                    |                |
                    | Success:       |
                    |  Send another  |---- resets form (OK)
                    |  Back to home  |---- / (OK)
                    +----------------+
```

---

## Resolved Issues (from v1 audit)

| Original Issue | Status | How Resolved |
|----------------|--------|-------------|
| /contact is 404 | FIXED | app/contact/page.tsx created with Formspree form |
| /writing is 404 | FIXED | app/writing/page.tsx created with MDX blog |
| CV page is dead end | FIXED | Bottom CTAs added: contact + writing links |
| No active nav state | FIXED | usePathname() with amber highlight + aria-current |
| CV missing skip-to-content | FIXED | Skip link + id="main" added |
| Footer lacks internal links | FIXED | About, CV, Writing, Contact links added |

---

## Current Assessment by Rule

| Rule | Status | Details |
|------|--------|---------|
| `nav-state-active` | PASS | Active link in amber with font-medium (desktop) and amber bg (mobile). aria-current="page" set. |
| `deep-linking` | PASS | All 5 pages reachable via direct URL. Blog posts have individual slugs. |
| `escape-routes` | PASS | Every page has onward CTAs. Contact success has "Send another" + "Back to home". Blog posts have "Back to Writing". |
| `persistent-nav` | PASS | Navigation bar present on all pages. Footer with internal links on all pages. |
| `navigation-consistency` | PASS | Same nav component on every page. Same footer on every page. Link order consistent. |
| `back-stack-integrity` | PASS | No silent resets. Back button works predictably on all pages. |
| `empty-nav-state` | PASS | All nav destinations have corresponding pages. No 404s in navigation. |
| `skip-links` | PASS | Skip-to-content present on all 5 pages (homepage, about, cv, writing, contact) + post pages. |

---

## Footer Evaluation

**Internal links consistency with main nav:**
- Nav: Systems, Writing, About, CV, Contact
- Footer: About, CV, Writing, Contact
- "Systems" is correctly omitted from footer — it's an anchor link to a homepage section, not a standalone page. Footer links are page-level navigation only.

**Visual hierarchy:**
- Internal links: `text-xs text-neutral-500 hover:text-neutral-300` — subtle, secondary
- Social icons: `text-neutral-500 hover:text-white` — slightly more prominent due to icon size
- Hierarchy is correct: internal links are navigation aids (you're already on the site), social links are outbound actions (leave the site). Social icons being slightly more prominent is appropriate.

**Active state in footer:**
- The footer does NOT have an active state for the current page.
- This is correct. Footer links are utility navigation, not primary wayfinding. Adding active state to the footer would create visual noise and contradict the footer's role as a secondary/fallback navigation element. The main nav already handles orientation.

---

## Remaining Issues

| Severity | Issue | UX Rule | Action |
|----------|-------|---------|--------|
| LOW | "Systems" nav link behavior differs from page links | `navigation-consistency` | Anchor link (/#systems) navigates to homepage then scrolls — works but is slightly inconsistent with other nav links that are full page navigations. Not a bug, architectural choice. |
| LOW | Homepage has no skip-to-content for the galaxy canvas section | `skip-links` | Homepage skip link jumps to #main which is the content area. The galaxy canvas is decorative and correctly skipped. No action needed. |

---

## Recruiter Funnel Status

The ideal recruiter journey is:

**Homepage -> About -> CV -> Contact**

Every step in this chain now works:
- Homepage "follow the light" -> About (OK)
- About "Curious about my work?" -> CV (OK)
- CV "Want to work together?" -> Contact (OK)

Alternative paths also work:
- Any page -> nav bar -> any other page (OK)
- Any page -> footer links -> any other page (OK)
- Blog post -> "Want to talk about this?" -> Contact (OK)
- Blog post -> "Curious who wrote this?" -> About (OK)
- Contact success -> "Back to home" -> Homepage (OK)

**No dead ends. No broken links. All navigation paths are complete.**
