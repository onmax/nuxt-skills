# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

Claude Code skills for Vue 3, Nuxt 4+, NuxtHub v0.10, and Nuxt module development. Pure documentation repo - no build/test commands.

## Structure

- `skills/<name>/SKILL.md` - Entry point for each skill (has frontmatter with name/description)
- `skills/<name>/*.md` - Sub-files loaded on-demand to save context
- `.claude-plugin/marketplace.json` - Claude Code marketplace manifest
- `scripts/opencode.sh` - OpenCode installer

## MANDATORY: Before Starting Work

**Always run `git pull`** before making any changes. CI auto-commits lint fixes, so your local branch may be behind.

## MANDATORY: When Working on Skills

**Always use the `example-skills:skill-creator` skill** when creating or editing any skill content. This ensures skills follow best practices.

### Checklist When Changing Skills

When adding/editing/removing a skill, update ALL of these:

1. `skills/<name>/SKILL.md` - Main skill entry point
2. `skills/<name>/*.md` - Sub-files if applicable
3. `.claude-plugin/marketplace.json` - Add/update plugin entry
4. `scripts/opencode.sh` - Update the skill list and file fetching logic
5. `README.md` - Update skills table and installation commands

**Do not skip any of these.** All must stay in sync.

## Skill Design Pattern

Skills use progressive loading - main SKILL.md is small (~300 tokens), references sub-files that users load based on context. Keeps context usage minimal.
