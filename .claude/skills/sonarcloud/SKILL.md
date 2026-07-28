---
name: sonarcloud
description: Check SonarCloud quality gates and open issues for a pull request on mehmetfahriozmen.dev. Use after pushing a PR, or when the user mentions SonarCloud, quality gate, code smells, coverage on new code, or duplication.
---

# SonarCloud

- **Quality gates:** Coverage >= 80% on new code, Duplication <= 3% on new code.
- **Check issues after push:** Fetch the SonarCloud API directly — it's public, no auth needed:
  ```
  WebFetch https://sonarcloud.io/api/issues/search?componentKeys=mfozmen_mehmetfahriozmen.dev&pullRequest=<PR_NUMBER>&statuses=OPEN,CONFIRMED&sinceLeakPeriod=true&ps=50
  ```
- **Check quality gate status:** Use `gh pr checks <PR_NUMBER>` and look for `SonarCloud Code Analysis`.
- **Get the summary comment:** Use `gh api repos/mfozmen/mehmetfahriozmen.dev/issues/<PR_NUMBER>/comments --jq '.[] | select(.user.login | contains("sonar")) | .body'`
- **Common issue types:** unused imports (S1128), duplicate imports (S3863), nested ternaries (S3358), cognitive complexity (S3776). Fix all issues before merging — don't leave open issues.
