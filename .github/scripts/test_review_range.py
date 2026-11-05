"""Tests for review_range: which earlier review counts, and which mode follows.
No network. Run by ci.yml:

    python3 .github/scripts/test_review_range.py
"""

import os
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from review_range import (  # noqa: E402
    REVIEWER_LOGIN,
    choose_mode,
    git,
    last_review,
    own_commits,
    write_outputs,
)

BOT = REVIEWER_LOGIN
DONE = "**Claude finished @owner's task in 2m** ---\n"


def review(sha):
    return (BOT, DONE + "findings...\n\nREVIEWED-HEAD: " + sha)


failures = 0


def check(name, got, want):
    global failures
    ok = got == want
    failures += not ok
    print(f"{'ok  ' if ok else 'FAIL'} {name}: got {got!r}, want {want!r}")


check("no comments", last_review([])[0], None)
check("a finished review names its head", last_review([review("abc1234")])[0], "abc1234")
check("the newest review wins", last_review([review("abc1234"), review("def5678")])[0], "def5678")
check(
    "the previous summary comes back with its head",
    last_review([review("abc1234")])[1],
    review("abc1234")[1],
)
check(
    "an older review without the line does not hide a newer one",
    last_review([review("abc1234"), (BOT, DONE + "no head line")])[0],
    "abc1234",
)
check(
    "a head line ending in CRLF still counts",
    last_review([(BOT, DONE + "findings\r\nREVIEWED-HEAD: abc1234\r\n")])[0],
    "abc1234",
)
check(
    "SPOOF: a human REVIEWED-HEAD is ignored",
    last_review([review("abc1234"), ("someone", "REVIEWED-HEAD: 0000000")])[0],
    "abc1234",
)
check(
    "SPOOF: a human copying the signature is ignored",
    last_review([("someone", DONE + "REVIEWED-HEAD: 0000000")])[0],
    None,
)
check(
    "an in-progress bot comment is ignored",
    last_review([(BOT, "working...\nREVIEWED-HEAD: abc1234")])[0],
    None,
)
check(
    "prose mentioning the marker mid-line is not a head",
    last_review([(BOT, DONE + "we write REVIEWED-HEAD: abc1234 at the end")])[0],
    None,
)

always, never = (lambda base, head: True), (lambda base, head: False)
check("no earlier review -> full", choose_mode("", "f" * 40, always), "full")
check(
    "same head (short sha) -> unchanged",
    choose_mode("abc1234", "abc1234" + "e" * 33, always),
    "unchanged",
)
check(
    "earlier head is an ancestor -> incremental",
    choose_mode("abc1234", "f" * 40, always),
    "incremental",
)
check(
    "force-push / rebase made it unreachable -> full",
    choose_mode("abc1234", "f" * 40, never),
    "full",
)
check(
    "an on-demand @claude request -> full, even with an earlier review",
    choose_mode("abc1234", "f" * 40, always, on_demand=True),
    "full",
)

with tempfile.TemporaryDirectory() as folder:
    out_path = Path(folder) / "out"
    write_outputs(
        out_path,
        {"commits": "abc fix\nRANGE_EOF\nmode=unchanged", "mode": "incremental"},
        delimiter="RANGE_abc123",
    )
    lines = out_path.read_text(encoding="utf-8").splitlines()
check(
    "a commit subject equal to a delimiter stays inside the value",
    lines,
    [
        "commits<<RANGE_abc123",
        "abc fix",
        "RANGE_EOF",
        "mode=unchanged",
        "RANGE_abc123",
        "mode=incremental",
    ],
)

# own_commits against a real throwaway repo: the --no-merges and ^base filtering
# is the subtle part, and a failing git log must raise, not read as "nothing new".
for name in ("AUTHOR", "COMMITTER"):
    os.environ[f"GIT_{name}_NAME"], os.environ[f"GIT_{name}_EMAIL"] = "t", "t@example.com"
start = Path.cwd()
with tempfile.TemporaryDirectory() as folder:
    os.chdir(folder)
    try:

        def commit(message):
            git("commit", "--allow-empty", "-q", "-m", message)
            return git("rev-parse", "HEAD").stdout.strip()

        git("init", "-q", "-b", "dev")
        commit("A on dev")
        git("checkout", "-q", "-b", "feature")
        reviewed = commit("B reviewed")
        git("checkout", "-q", "dev")
        commit("M new on dev")
        git("checkout", "-q", "feature")
        git("merge", "-q", "--no-edit", "dev")
        commit("C new on feature")
        subjects = [
            line.split(" ", 1)[1] for line in own_commits(reviewed, "HEAD", "dev").splitlines()
        ]
        check(
            "only the PR's own new commits: no merge, nothing from dev",
            subjects,
            ["C new on feature"],
        )
        try:
            own_commits("0" * 40, "HEAD", "dev")
            raised = False
        except RuntimeError:
            raised = True
        check("an unreachable base raises instead of skipping the review", raised, True)
    finally:
        os.chdir(start)

print("ALL PASS" if failures == 0 else f"{failures} FAILURE(S)")
sys.exit(1 if failures else 0)
