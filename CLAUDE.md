# Working in this repo

## PR merge policy — read this before merging anything

**A green CI status is not "ready to merge." It means CI ran to completion, nothing more.**
This repo's CI includes automated reviewers (SonarCloud, codereviewbot-ai, chatgpt-codex-connector /
Codex, Vercel's bot) that post their findings as PR comments and inline review comments —
those often carry real, valid bugs even when every check shows a green checkmark, because a
"pass" from these tools usually means "no blocking gate failed," not "no issues found."

Before merging any PR in this repo:

1. **Read every PR comment, submitted review, and inline review comment**, not just the checks
   list. All three are separate GitHub objects and a finding can live in any of them — a
   submitted review's own body (not just its inline comments) is easy to miss:
   ```
   gh pr view <n> --json comments -q '.comments[] | {author: .author.login, body: .body}'
   gh api repos/<owner>/<repo>/pulls/<n>/reviews --paginate --jq '.[] | select(.body != "") | {user: .user.login, state, body}'
   gh api repos/<owner>/<repo>/pulls/<n>/comments --paginate --jq '.[] | {user: .user.login, path, line, body}'
   ```
   Use `--paginate` on the `gh api` calls — a PR with enough comments to span more than one API
   page will otherwise silently drop the later ones.
2. **Triage each finding on its merits.** Don't dismiss a bot comment because it's from a bot —
   verify it against the actual code (and, for legal/compliance content in `lib/knowledge/` or
   `app/guides/`, against the primary source) before deciding whether it's real.
3. **Fix confirmed issues before merging**, not after. If a finding is confirmed but genuinely
   out of scope for the PR, say so explicitly in the PR thread and open a follow-up — don't
   merge past it silently.
4. **Only merge once the PR is reasonably clean**: CI green AND no unaddressed substantive
   review comments. Sonar's "Quality Gate passed" can coexist with a list of "New issues" that
   still needs a look — check that list, not just the gate badge.

This applies even under time pressure or an autonomous directive (a `/goal`, a scheduled task,
"just get this done"). Speed is never a reason to skip review — it's the reason review exists.

## Compliance content accuracy

`lib/knowledge/*.ts` and `app/guides/*` state legal/regulatory claims (FTC, FDA, Meta, Google,
TikTok policy) as fact, with citations. This product's stated differentiator is that those
citations are real and verified — get them wrong and it undermines the whole premise. Before
asserting *what a rule says* or *when it changed*, verify against a primary source (the CFR
text, the Federal Register notice, the platform's published policy page) — don't rely on
memory or on an existing citation elsewhere in the codebase being correct; re-verify.
