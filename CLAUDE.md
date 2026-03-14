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

## Git Rules

- **Conventional Commits** format: `type(scope): message`
- Allowed types: `feat`, `fix`, `refactor`, `test`, `docs`, `style`, `chore`
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
- For visual QA and browser testing, use the Playwright MCP tool directly (launch browser, navigate, screenshot, hover via tool commands). Do NOT write standalone Playwright script files.

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
