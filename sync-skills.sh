#!/usr/bin/env bash
set -euo pipefail

# Keep local Claude and Codex skill directories in sync during development.
for target in "$HOME/.claude/skills" "$HOME/.codex/skills"; do
  mkdir -p "$target"
  rsync -av --delete skills/ "$target/" --exclude="versions.json"
  echo "✓ Skills synced to $target"
done
