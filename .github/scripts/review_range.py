"""Decides what the Claude reviewer looks at: only what changed since its last review.

Called by .github/workflows/claude-review.yml before the review step. The
reviewer's finished tracking comment ends with a `REVIEWED-HEAD: <sha>` line,
so the PR thread is the reviewer's notebook. This script finds the newest such
line, checks the sha is still an ancestor of the PR head (a rebase or
force-push makes it unreachable, and `git log A..B` would then list the whole
branch), and hands the review step:

  mode      incremental | full | unchanged
  base      the last reviewed sha (incremental/unchanged), else empty
  head      the PR head sha now under review
  commits   this PR's own new commits since base; merges and dev's commits are
            left out so merging dev into the branch does not flood the review
  previous  the previous summary, so open findings are checked rather than
            re-derived

Standard library only. Adapted from the notelore repo's review_range.py.
Tests: .github/scripts/test_review_range.py (run by ci.yml).
"""

import json
import os
import re
import subprocess
import sys
import urllib.request
import uuid
from pathlib import Path

# A whole line only: prose that merely mentions the marker is not a head.
REVIEWED_HEAD = re.compile(r"^REVIEWED-HEAD: ([0-9a-f]{7,40})\r?$", re.MULTILINE)
# Only the action's own finished comment counts: a human cannot post as the
# Actions bot, and a review still in progress has not got the signature yet.
REVIEWER_LOGIN = "github-actions[bot]"
FINISHED_SIGNATURE = "**Claude finished"


def last_review(comments):
    """(reviewed sha, body) of the newest finished review, else (None, None).

    `comments` is (author login, body) pairs, oldest first.
    """
    found = (None, None)
    for login, body in comments:
        body = body or ""
        if login != REVIEWER_LOGIN or not body.startswith(FINISHED_SIGNATURE):
            continue
        matches = REVIEWED_HEAD.findall(body)
        if matches:
            found = (matches[-1], body)
    return found


def choose_mode(base, head, is_ancestor, on_demand=False):
    """full without a usable earlier review or on an @claude request, unchanged when
    it already saw this head, incremental otherwise. `is_ancestor(base, head)` asks git."""
    if not base or on_demand:
        return "full"
    if head.startswith(base) or base.startswith(head):
        return "unchanged"
    return "incremental" if is_ancestor(base, head) else "full"


def git(*args):
    return subprocess.run(["git", *args], capture_output=True, text=True, check=False)


def is_ancestor(base, head):
    return git("merge-base", "--is-ancestor", base, head).returncode == 0


def own_commits(base, head, base_ref="origin/dev"):
    """This PR's commits since `base`, oldest first, without merges or dev's commits.

    A failing `git log` raises: an empty answer would read as "nothing new" and
    silently skip the review.
    """
    listed = git(
        "log", "--no-merges", "--reverse", "--format=%h %s", f"{base}..{head}", f"^{base_ref}"
    )
    if listed.returncode != 0:
        raise RuntimeError(f"git log failed: {listed.stderr.strip()}")
    return listed.stdout.strip()


def github_get(url, token):
    request = urllib.request.Request(
        url,
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        },
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def fetch_bodies(repo, number, token):
    """Every issue comment on the PR as (author login, body), following pagination."""
    bodies, page = [], 1
    while True:
        batch = github_get(
            f"https://api.github.com/repos/{repo}/issues/{number}/comments?per_page=100&page={page}",
            token,
        )
        if not batch:
            return bodies
        bodies.extend(
            ((c.get("user") or {}).get("login", ""), c.get("body") or "") for c in batch
        )
        page += 1


def write_outputs(path, values, delimiter=None):
    # A random delimiter: commit subjects flow into `commits`, and a fixed one could
    # be closed early by a subject equal to it, letting the rest overwrite `mode`.
    delimiter = delimiter or f"RANGE_{uuid.uuid4().hex}"
    with Path(path).open("a", encoding="utf-8") as out:
        for key, value in values.items():
            if "\n" in value:
                out.write(f"{key}<<{delimiter}\n{value}\n{delimiter}\n")
            else:
                out.write(f"{key}={value}\n")


def main():
    repo, number = os.environ["GITHUB_REPOSITORY"], os.environ["PR_NUMBER"]
    token = os.environ["GH_TOKEN"]
    pr = github_get(f"https://api.github.com/repos/{repo}/pulls/{number}", token)
    head, base_ref = pr["head"]["sha"], f"origin/{pr['base']['ref']}"
    base, previous = last_review(fetch_bodies(repo, number, token))
    on_demand = os.environ.get("GITHUB_EVENT_NAME") == "issue_comment"
    mode = choose_mode(base or "", head, is_ancestor, on_demand)
    commits = own_commits(base, head, base_ref) if mode == "incremental" else ""
    if mode == "incremental" and not commits:
        mode = "unchanged"  # only merges from dev arrived: nothing of its own to review
    write_outputs(
        os.environ["GITHUB_OUTPUT"],
        {
            "mode": mode,
            "base": (base or "") if mode != "full" else "",
            "head": head,
            "commits": commits,
            "previous": previous or "(none)",
        },
    )
    print(f"review range: mode={mode} base={base or '-'} head={head}")


if __name__ == "__main__":
    main()
