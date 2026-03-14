# mehmetfahriozmen.dev

[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=mfozmen_mehmetfahriozmen.dev&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=mfozmen_mehmetfahriozmen.dev)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=mfozmen_mehmetfahriozmen.dev&metric=coverage)](https://sonarcloud.io/summary/new_code?id=mfozmen_mehmetfahriozmen.dev)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=mfozmen_mehmetfahriozmen.dev&metric=bugs)](https://sonarcloud.io/summary/new_code?id=mfozmen_mehmetfahriozmen.dev)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=mfozmen_mehmetfahriozmen.dev&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=mfozmen_mehmetfahriozmen.dev)

Personal portfolio site for Mehmet Fahri Özmen. Features an interactive galaxy visualization built with Canvas API where systems, domains, and tech clusters orbit as stars with hover interactions, satellite animations, and parallax effects.

## Tech Stack

- **Next.js 16** with App Router
- **React 19** and **TypeScript**
- **Tailwind CSS v4**
- **Canvas API** for galaxy visualization
- **Vitest** with v8 coverage

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

- **Development:** work on `dev` branch
- **Preview:** push to `dev` → Vercel preview deploy
- **Release:** `npm run release` (on dev) → bumps version, tags, pushes to main → Vercel production deploy
- **GitHub Release:** auto-created by CI on tag push
- **Rollback:** Vercel dashboard → Deployments → Promote old deployment
