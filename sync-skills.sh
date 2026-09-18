#!/usr/bin/env bash
set -euo pipefail

# Copy this repository's skills and remove only stale directories previously managed by this script.
for target in "$HOME/.claude/skills" "$HOME/.codex/skills"; do
  mkdir -p "$target"
  manifest="$target/.nuxt-skills-managed"
  current=$(mktemp)
  find skills -mindepth 1 -maxdepth 1 -type d -printf '%f\n' | sort > "$current"
  if [[ -f "$manifest" ]]; then
    while IFS= read -r skill; do
      if ! grep -Fxq "$skill" "$current"; then
        rm -rf -- "$target/$skill"
      fi
    done < "$manifest"
  fi
  rsync -av skills/ "$target/" --exclude="versions.json"
  cp "$current" "$manifest"
  rm -f "$current"
  echo "✓ Skills synced to $target"
done
