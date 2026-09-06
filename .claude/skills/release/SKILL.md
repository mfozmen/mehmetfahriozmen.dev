---
name: release
description: Use when shipping a production release of mehmetfahriozmen.dev — merging an approved PR into dev and cutting a versioned release that deploys to main/production. Triggers: "create a release", "release to production", "ship it", "cut a release", "bump the version", running release-it.
---

# Release — mehmetfahriozmen.dev

Cut a production release: merge the approved PR into `dev`, then `release-it` bumps the version, tags, and pushes `dev → main` (production deploy). Only run this after the PR is merged and pulled — never before.

## The flow at a glance

`approved PR → squash-merge to dev → release-it on dev → tag + dev→main push → CI builds GitHub Release + Vercel prod deploy`

## How this repo is wired (`.release-it.json`)

- `requireBranch: dev` — release-it ONLY runs on `dev`. Be on `dev` first.
- `requireCleanWorkingDir: true` — uncommitted changes abort the release. (`.next/`, `screenshots/` are gitignored, so a running dev server won't dirty it.)
- **No `before:`/test/build hooks** — release-it does NOT run `npm test` or the build, so the sandbox `ogImage` test quirk (below) can't block it.
- `github.release: false`, `npm.publish: false` — no direct GitHub release, no npm publish.
- `after:release` → `git push origin HEAD:main` — this is what deploys production.
- `@release-it/conventional-changelog` auto-determines the bump from commits since the last tag: **`feat` → minor, `fix` → patch**, `docs`/`chore` alone → no bump. No manual version argument.

## Procedure

**1. Pre-flight the PR** (must be green and target `dev`):
```bash
gh pr view <N> --json state,mergeable,mergeStateStatus,baseRefName
gh pr checks <N>      # want: test-and-build pass, SonarCloud pass, Vercel pass
```

**2. Merge (squash — repo convention; squashed commits carry `(#N)`):**
```bash
gh pr merge <N> --squash --delete-branch
```

**3. Get onto a clean, synced `dev` and confirm the merge landed:**
```bash
git checkout dev && git pull origin dev
git status --short            # must be clean
git log --oneline -3          # confirm the squashed "(#N)" commit is on top
```

**4. Release:**
```bash
npx release-it --ci           # == npm run release; --ci skips prompts
```

**5. Verify:**
```bash
git rev-parse origin/dev origin/main     # identical SHAs = main updated
git ls-remote --tags origin "v$(node -p "require('./package.json').version")"
gh run list --limit 4                    # tag run = GitHub Release; main run = prod deploy
```
The GitHub Release and Vercel prod deploy are created by CI on the tag/main push — in-progress is expected; no further action needed.

## Verifying a route or content change

Vercel **preview** deployments are behind deployment protection: `curl` on the preview URL returns `302` to a login page, so you cannot verify a PR's output there from the shell. Verify **after** the release, on production, with a short poll — prod typically serves the new version 60–90 s after `release-it` finishes:

```bash
for i in $(seq 1 24); do curl -s https://mehmetfahriozmen.dev/llms.txt | grep -q "<new slug>" && { echo live; break; }; sleep 10; done
```

## Common mistakes

- **Releasing before the merge is confirmed.** Always merge the PR, then `git pull origin dev`, and verify the new commit BEFORE `release-it`. (Project rule + lived gotcha.)
- **Dirty working tree.** `requireCleanWorkingDir` aborts; commit or stash first.
- **PR doesn't target `dev`.** PRs always target `dev`, never `main`; release-it refuses to run anywhere but `dev`.
- **`npm test` shows 1 failing `ogImage fallback` test.** Sandbox/worktree-only artifact (ENOENT on `unlink`); it mutates `public/writing/hardest-refactor/og.webp` — restore with `git checkout -- public/writing/hardest-refactor/og.webp`. Not a real failure, and release-it never runs it.
- **Future-dated blog post.** If the release includes a post whose `date` is after today, it may not appear in the published list until that date. Check the post date before releasing.
- **Don't hand-edit `package.json` version or `CHANGELOG.md`** — conventional-changelog owns both.

## Related

- `CLAUDE.md` → "Development & Release Flow" (the canonical checklist this skill operationalizes).
