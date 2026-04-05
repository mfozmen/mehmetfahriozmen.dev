# mehmetfahriozmen.dev

[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=mfozmen_mehmetfahriozmen.dev&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=mfozmen_mehmetfahriozmen.dev)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=mfozmen_mehmetfahriozmen.dev&metric=coverage)](https://sonarcloud.io/summary/new_code?id=mfozmen_mehmetfahriozmen.dev)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=mfozmen_mehmetfahriozmen.dev&metric=bugs)](https://sonarcloud.io/summary/new_code?id=mfozmen_mehmetfahriozmen.dev)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=mfozmen_mehmetfahriozmen.dev&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=mfozmen_mehmetfahriozmen.dev)

Personal website for Mehmet Fahri Özmen — backend systems architect and engineering leader.

## Pages

- **Homepage** — Hero section, interactive galaxy visualization, featured systems grid, and Latest Signals (mixed Writing + Lab feed)
- **About** — Story, career journey, photos, and personal interests
- **CV** — Full timeline with role progressions, collapsible sections, PDF download, and skills
- **Writing (Field Notes)** — Essays on engineering leadership, architecture, and the human side of building software
- **Lab (Lab Day)** — Practical technical guides with code-heavy tutorials and step-by-step walkthroughs
- **Contact** — Contact form via Formspree with client-side validation and direct channel links

## Features

- Interactive galaxy visualization (Canvas API) with hover interactions, satellite animations, and parallax effects
- MDX blog with next-mdx-remote, cover images, reading time, progress bar, and social sharing
- Code blocks with Shiki syntax highlighting, copy button, language labels, line highlighting, diff support, collapsible long blocks, and MarkdownDemo source/rendered toggle
- Two content sections (Field Notes essays + Lab Day technical guides) with cross-links and mixed homepage feed
- Smooth scroll navigation with reduced-motion support
- Contact form with Formspree integration, client-side validation, and focus management
- Mobile navigation drawer with keyboard accessibility and touch support
- Responsive design with dark theme and amber accent palette
- Umami analytics with custom event tracking (CTA clicks, system cards, social links, CV interactions)
- WCAG AA contrast compliance across all pages
- Skip-to-content links, focus rings, and reduced-motion support

## Tech Stack

- **Next.js 16** with App Router
- **React 19** and **TypeScript**
- **Tailwind CSS v4**
- **Canvas API** for galaxy visualization
- **next-mdx-remote** + **gray-matter** for blog
- **Shiki** + **rehype-pretty-code** for syntax highlighting
- **Formspree** for contact form
- **Vitest** with v8 coverage
- **Umami** for privacy-friendly analytics
- **Microsoft Clarity** for session recording and heatmaps
- **SonarCloud** for code quality

## Scripts

```bash
npm run dev            # Start dev server
npm run build          # Production build
npm run lint           # ESLint
npm test               # Run all tests
npm run test:coverage  # Tests with coverage report
npm run check:overlaps # Galaxy overlap tests only
npm run release        # Bump version, tag, push to main
```

## Development & Release

- **Development:** work on `dev` branch, PRs target `dev`
- **Preview:** push to `dev` → Vercel preview deploy
- **Release:** `npm run release` (on dev) → bumps version, tags, pushes to main → Vercel production deploy
- **GitHub Release:** auto-created by CI on tag push
- **Rollback:** Vercel dashboard → Deployments → Promote old deployment

## Content SEO Checklist

When creating or editing MDX files in `content/writing/` or `content/lab/`, verify frontmatter before committing:

- `title` — under 60 characters (Lab Day posts must start with "Lab Day: " prefix)
- `description` — at least 100 characters
- `coverImage` — must be set (Lab Day posts always use `/lab/lab-day-cover.webp`)
- `date` — ISO format (`YYYY-MM-DD`)
- `slug` — kebab-case, descriptive, no stop words (Lab Day only)
