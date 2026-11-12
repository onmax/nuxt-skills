---
title: Install
description: Install nuxt-skills as a Claude Code or Codex plugin, with the skills CLI, or as a Nuxt module.
icon: i-lucide-download
navigation.order: 2
---

## Plugin

The plugin installs every skill and connects the [Nuxt MCP server](https://nuxt.com/docs/guide/ai/mcp). Your agent updates it like any other plugin.

::tabs
:::tabs-item{label="Claude Code"}
```bash
/plugin marketplace add onmax/nuxt-skills
/plugin install nuxt-skills@nuxt-skills
```
:::

:::tabs-item{label="Codex"}
```bash
codex plugin marketplace add onmax/nuxt-skills
codex plugin add nuxt-skills@nuxt-skills
```
:::
::

## Skills CLI

The [`skills`](https://www.npmjs.com/package/skills) CLI copies skills into your agent's skills folder. It works with Claude Code, Codex, Cursor, Copilot, Gemini CLI, OpenCode, and other agents.

```bash
npx skills add onmax/nuxt-skills
```

It finds the agents you have installed and asks which skills to copy. Add `--skill <name>` to pick skills without the prompt, `-y` to copy all of them, and `-g` to install them for your user instead of the project.

The copies don't update themselves. Run the command again to get new versions.

## Nuxt module

In a Nuxt project, the module writes one skill for your project:

```bash
npx nuxi module add nuxt-skill-hub
```

The skill is written on every `nuxt prepare`, which runs after each install. It has the Nuxt rules, the Vue guide, and a skill for each module in your `nuxt.config.ts`. [How the module works](/nuxt-module) explains where each part comes from.

Turn it off with `skillHub: false` in `nuxt.config.ts`.

## Hosted `nuxt` skill

Without the module, you can install the same Nuxt rules and Vue guide from this site:

```bash
npx skills add https://nuxt-skill.onmax.me/
```

It doesn't know your modules. For Nuxt UI, Nuxt Content, and other modules, add their skills from the [catalog](/skills/catalog).

## By hand

Clone [onmax/nuxt-skills](https://github.com/onmax/nuxt-skills) and copy folders from `skills/` to your agent's skills folder:

| Agent | In the project | For your user |
| --- | --- | --- |
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| Cursor | `.cursor/skills/` | `~/.cursor/skills/` |
| Codex | `.codex/skills/` | `~/.codex/skills/` |
| OpenCode | `.opencode/skill/` | `~/.config/opencode/skill/` |
| GitHub Copilot | `.github/skills/` | None |
