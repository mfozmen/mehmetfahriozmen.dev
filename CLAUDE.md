# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website for Mehmet Fahri Özmen (mehmetfahriozmen.dev). Built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — run ESLint (flat config with next/core-web-vitals and next/typescript)

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

## Graph Data Architecture

The systems visualization is powered by structured graph data.

- All nodes and relationships are defined in the `data/` directory.
- Components must not hardcode nodes or relationships — they are pure UI renderers.
- Graph structure is defined in a single source of truth: `data/systemsGraph.ts`.

Node types: `system`, `domain` (future: `technology`, `post`)

```ts
// data/systemsGraph.ts
export interface GraphNode {
  id: string;
  label: string;
  type: "system" | "domain";
  featured?: boolean;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface SystemsGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
```
