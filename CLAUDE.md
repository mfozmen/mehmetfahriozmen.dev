# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website for Mehmet Fahri Özmen (mehmetfahriozmen.dev). Built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — run ESLint (flat config with next/core-web-vitals and next/typescript)
- `npm test` — run vitest (includes galaxy overlap detection)
- `npm run check:overlaps` — run only the galaxy overlap test

## Architecture

- **Next.js App Router** — all pages/layouts live under `app/`
- `app/layout.tsx` — root layout with Geist font family
- `app/page.tsx` — homepage
- `app/globals.css` — Tailwind v4 setup with dark mode via `prefers-color-scheme`
- Path alias: `@/*` maps to project root

## Development Workflow

- Work in small, incremental steps with minimal changes.
- Respect the current project structure.
- For any non-trivial logic, write tests. Tests must pass before committing.

## Code Style

- TypeScript, functional React components, TailwindCSS.
- Prefer small reusable components.
- Avoid unnecessary dependencies.
- **Every clickable link must be tracked.** Use `TrackedNextLink` (internal) or `TrackedAnchor` (external) from `@/components/TrackedLink` — never plain `Link` or `<a>` for user-facing links. Every link needs an `eventName` and `eventData` for analytics.

## Code Quality Rules

- No function longer than 50 lines. If a function exceeds this, extract smaller functions.
- No file longer than 300 lines. If a file exceeds this, split into modules.
- Apply extract method refactoring proactively — don't wait for review.

### Exceptions
- `lib/galaxyRenderLoop.ts` and `lib/galaxyRenderers.ts` may exceed 300 lines — they are collections of pure canvas rendering functions, each individually under 50 lines.
- `renderGalaxyFrame` orchestrates 13 rendering layers in sequence — splitting it further would reduce readability.

## Git Rules

- **Conventional Commits** format: `type(scope): message`
- Allowed types: `feat`, `fix`, `refactor`, `perf`, `style`, `test`, `docs`, `build`, `ci`, `chore`
- `feat` — add, adjust, or remove a feature (API or UI)
- `fix` — fix a bug
- `refactor` — rewrite/restructure code without changing behavior
- `perf` — performance improvement (special refactor)
- `style` — code formatting only (whitespace, semicolons) — NOT visual/UI changes
- `test` — add or correct tests
- `docs` — documentation only
- `build` — build tools, dependencies, project version
- `ci` — CI/CD pipelines, deployment scripts, infrastructure
- `chore` — miscellaneous tasks (.gitignore, initial commit)
- **Never commit automatically.** Always show proposed changes, commit message, and modified files — then ask the user for explicit approval before committing.
- Never push commits automatically or run destructive git commands.
- Never modify unrelated files.

## Testing

- **Strict TDD workflow** for all changes:
  1. Write tests FIRST — before any implementation, write failing tests that define expected behavior
  2. Show the tests for review before proceeding
  3. Implement — make the tests pass
  4. Run ALL tests — `npm test` must pass completely
  5. Verify with Playwright — visual confirmation
  6. Then commit
- After ANY change to galaxy positions, angles, offsets, or tech cluster data, always run `npm test` before committing. If tests fail, fix the overlaps before proceeding.
- For visual QA and browser testing, use the Playwright MCP plugin directly (launch browser, navigate, screenshot, hover via tool commands). Do NOT install playwright as an npm package or write standalone Playwright script files.

## Visual QA

- Always use the Playwright MCP plugin for screenshots — do NOT install playwright as an npm package.
- Use the plugin for all visual QA tasks: full-page screenshots, viewport testing, element screenshots.
- **Save all screenshots to `screenshots/`** — this folder is gitignored. Use descriptive filenames (e.g. `homepage-desktop-1440.png`, `lab-list-mobile-390.png`). Never save screenshots to the project root or `public/`.

## Development & Release Flow

- All development happens on `dev` branch — never commit directly to `main`
- **Pull requests always target `dev`** — never create PRs targeting `main`
- To release: `npm run release` on dev → bumps version, creates tag, pushes to main
- **Release checklist:** (1) merge PR first (`gh pr merge`), (2) `git pull origin dev`, (3) verify new commits in pull output, (4) only then `npx release-it --ci`. Never run release-it before the PR merge is confirmed.
- CI: tag push triggers GitHub Release creation (auto-generated notes)
- Vercel: main push = production deploy, dev push = preview deploy
- Rollback: Vercel dashboard → Deployments → Promote old deployment
- On release, main and dev are synced to the same commit

## Blog Post SEO Checklist

When creating or editing blog posts (MDX files in `content/writing/`), verify ALL of the following before committing:

1. **`description`** — at least 100 characters
2. **`coverImage`** — must be set (non-empty)
3. **`date`** — must be in ISO format (`YYYY-MM-DD`)
4. **`title`** — must be under 60 characters

If any check fails, fix it before committing.

## Blog Writing Guide

Before creating or editing any blog post, consult `docs/blog-writing-guide.md` for voice, tone, illustration rules, structure principles, and workflow. This is the authoritative reference for all writing on the site.

## Graph Data Architecture

The systems visualization uses a 3-layer orbital layout with data defined in `data/systemsGraph.ts`.

- All systems, domains, tech clusters, and orbit configs are defined in `data/systemsGraph.ts`.
- Components must not hardcode nodes or relationships — they are pure UI renderers.
- Systems reference domains via `domains: string[]` and tech clusters via `techClusters: string[]`.
- 3 orbit rings: primary systems (0), secondary systems (1), minor systems (2).
- Tech clusters are positioned freely in the interior via `position: { x, y }` (normalized coords relative to center).
- After modifying any positions, angles, or adding new systems/domains/tech clusters, run `npm test` to verify no labels collide.
- Layout calculation functions live in `lib/galaxyLayout.ts` — shared between the component and tests. Do not duplicate layout math.

```ts
// data/systemsGraph.ts — key types
export type SystemNode = {
  id: string; name: string; url?: string;
  importance: "primary" | "secondary" | "minor";
  domains: string[]; techClusters: string[];
  angle: number; orbit: number;
};
export type DomainNode = { id: string; name: string; angle: number; orbit: number; offset: { x: number; y: number } };
export type TechClusterNode = { id: string; name: string; technologies: string[]; position: { x: number; y: number } };
export type OrbitConfig = { rx: number; ry: number; rotation: number; opacity: number };
```
