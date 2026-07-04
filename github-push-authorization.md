# github-push-authorization.md
### Standing authorization for autonomous pushes to the fork

This file authorizes the agent to commit and push directly to `main` on this repository's fork **without asking for permission on each push.** A GitHub Personal Access Token (PAT) will be supplied to you for this purpose — treat it as a live credential from the moment it's available.

## What this authorizes
- Committing and pushing directly to `main` on the fork, continuously, per the Git Workflow rules already defined in `MASTER_AGENT_EXECUTION.md` (Section 7): granular commits, clean messages, no giant batched commits, no uncommitted work left at the end of a session.
- Doing this without a confirmation prompt for routine pushes. You do not need to ask "should I push this?" — if the change is committed, push it.

## What this does NOT authorize
- **No force-pushing (`git push --force` / `--force-with-lease`)** and no rewriting of existing shared history, unless explicitly requested in the moment.
- **No pushing to the upstream repository** (`Sakshamraina07/EdgeTwinAi`) — confirm `git remote -v` points at the fork (`obstinix/EdgeTwinAiV1`) before the first push of a session, not just once ever.
- **No deleting branches, tags, or releases** without explicit instruction.
- If any of the above genuinely seems necessary, stop and say so instead of proceeding.

## Handling the PAT
- Treat the token as a secret at all times: never print it, log it, echo it to a terminal that gets captured in output, or write it into any file that gets committed (including `.env` files that aren't gitignored).
- Prefer environment-variable–based auth over embedding the token in the remote URL:
  ```bash
  # one-time per session, if the harness doesn't already inject this
  git config credential.helper store
  # or, for GitHub CLI-based auth:
  gh auth login --with-token <<< "$GITHUB_TOKEN"
  ```
  If a credential helper isn't available and a URL-embedded token is the only option, set it via environment substitution at push time rather than writing it into `.git/config`:
  ```bash
  git push "https://${GITHUB_TOKEN}@github.com/obstinix/EdgeTwinAiV1.git" main
  ```
- If a push fails on auth, report the failure plainly (without echoing the token or any header containing it) rather than retrying with a hardcoded credential.

## Routine push loop
1. Make the change.
2. Run the Quality Gates from `MASTER_AGENT_EXECUTION.md` (Section 8) — lint, build — before committing.
3. `git add` the relevant files (avoid `git add .` if it would sweep in `__pycache__`, `*.db`, or other ignored artifacts — check `.gitignore` is actually doing its job).
4. Commit with a clean, conventional message.
5. Push to `main` on the fork. Do not wait for a go-ahead.
6. Continue to the next change.
