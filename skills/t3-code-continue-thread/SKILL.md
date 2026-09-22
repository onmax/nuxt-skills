---
name: t3-code-continue-thread
description: Continue work from an earlier T3 Code thread by resolving its UUID, identifying the correct checkout or worktree, and producing a handoff for the normal agent.
---

Use this skill when work must move from one T3 Code thread into a fresh thread. The input is the source thread UUID (for example `a40b36e9-04d9-4a70-9f99-4ecfda1eef4b`) and optionally the new focus.

1. Resolve the source thread with the bundled script:

   ```bash
   python3 <skill-dir>/scripts/find_thread.py <uuid> --full
   ```

   The script reads T3 Code's local databases under `${CODEX_HOME:-$HOME/.codex}` and returns JSON containing the thread record, source `cwd`, branch, commit, origin, conversation, and a `recommended_worktree`. Treat the reported `cwd`/worktree as the checkout to inspect first. Compare `recommended_worktree.matches_recorded` with the thread's recorded branch and commit. If it is false, the path has been reused or changed: use `matching_worktrees` when present, otherwise locate or create the checkout for the recorded branch/commit only after the normal agent verifies it. If the path is missing, use the recorded branch and commit to locate an existing git worktree; do not silently switch to an unrelated checkout. A non-zero exit or `found: false` means the UUID could not be resolved.

2. Delegate continuation context preparation to a subagent when collaboration is available. Give it the script output and the requested focus, and ask it to use the `handoff` skill to write a compact continuation handoff. The subagent should preserve the source thread's exact repository, branch, worktree, dirty-file ownership, decisions, proof, blockers, and next action. It must not mutate the source checkout merely to prepare the handoff.

3. The subagent's handoff path is the `$handoff` consumed by the normal agent. Report the absolute path explicitly. The normal agent must read that file before acting and then continue from its stated worktree and branch. If delegation is unavailable, create the handoff yourself using the `handoff` skill and return its absolute path.

Do not claim the continuation is complete merely because the source thread was found. The continuation is ready only when the handoff exists and names the checkout/worktree and the next concrete action. Never include credentials or private configuration values from the thread transcript in the handoff.
