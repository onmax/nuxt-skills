#!/bin/bash
set -e

# OpenCode installer - fetches skills from GitHub and converts to OpenCode agents
# Usage: curl -fsSL https://raw.githubusercontent.com/onmax/nuxt-skills/main/scripts/opencode.sh | bash
# Or: ./scripts/opencode.sh [skill-name]

REPO="onmax/nuxt-skills"
BRANCH="main"
BASE_URL="https://raw.githubusercontent.com/$REPO/$BRANCH"
TARGET_DIR="${OPENCODE_AGENT_DIR:-$HOME/.config/opencode/agent}"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

mkdir -p "$TARGET_DIR"

fetch_and_convert() {
  local skill="$1"
  local output_file="$TARGET_DIR/$skill.md"
  local tmp_dir=$(mktemp -d)

  echo -e "${BLUE}→${NC} Fetching $skill..."

  # Fetch SKILL.md
  curl -fsSL "$BASE_URL/skills/$skill/SKILL.md" -o "$tmp_dir/SKILL.md" 2>/dev/null || {
    echo "Failed to fetch $skill"
    rm -rf "$tmp_dir"
    return 1
  }

  # Extract description from frontmatter
  local description=$(grep "^description:" "$tmp_dir/SKILL.md" | sed 's/^description: //')

  # Create OpenCode agent with frontmatter
  cat > "$output_file" << EOF
---
description: $description
mode: subagent
tools:
  write: false
  edit: false
---

EOF

  # Append SKILL.md content (skip frontmatter)
  sed -n '/^---$/,/^---$/!p' "$tmp_dir/SKILL.md" | tail -n +2 >> "$output_file"

  # Fetch and append other .md files
  case $skill in
    vue)
      for f in components composables testing utils-client; do
        if curl -fsSL "$BASE_URL/skills/$skill/$f.md" -o "$tmp_dir/$f.md" 2>/dev/null; then
          echo -e "\n---\n" >> "$output_file"
          cat "$tmp_dir/$f.md" >> "$output_file"
        fi
      done
      ;;
    nuxt)
      for f in server routing middleware-plugins nuxt-composables nuxt-components nuxt-config project-setup; do
        if curl -fsSL "$BASE_URL/skills/$skill/$f.md" -o "$tmp_dir/$f.md" 2>/dev/null; then
          echo -e "\n---\n" >> "$output_file"
          cat "$tmp_dir/$f.md" >> "$output_file"
        fi
      done
      ;;
    nuxthub)
      if curl -fsSL "$BASE_URL/skills/$skill/references/wrangler-templates.md" -o "$tmp_dir/wrangler.md" 2>/dev/null; then
        echo -e "\n---\n" >> "$output_file"
        cat "$tmp_dir/wrangler.md" >> "$output_file"
      fi
      ;;
  esac

  rm -rf "$tmp_dir"
  echo -e "${GREEN}✓${NC} Installed $skill → $output_file"
}

# Install specific skill or all
if [ -n "$1" ]; then
  fetch_and_convert "$1"
else
  for skill in vue nuxt nuxthub; do
    fetch_and_convert "$skill"
  done
fi

echo -e "\n${GREEN}Done!${NC} Agents installed to $TARGET_DIR"
echo "Invoke with /vue, /nuxt, /nuxthub or Tab to switch agents"
