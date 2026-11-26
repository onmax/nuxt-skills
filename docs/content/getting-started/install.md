---
title: Install
description: nuxt-skills is discontinued. How to remove the Claude Code or Codex plugin, skills from the skills CLI, and the nuxt-skill-hub module.
icon: i-lucide-download
navigation.order: 2
---

::warning
nuxt-skills is discontinued and no longer gets updates. Remove it with the steps below.
::

## Remove nuxt-skills

| You installed it with | Remove it with |
| --- | --- |
| The Claude Code plugin | `/plugin uninstall nuxt-skills@nuxt-skills`, then `/plugin marketplace remove nuxt-skills` |
| The Codex plugin | `codex plugin remove nuxt-skills@nuxt-skills`, then `codex plugin marketplace remove nuxt-skills` |
| `npx skills add onmax/nuxt-skills` | `npx skills remove onmax/nuxt-skills`, with `-g` if you installed them globally |
| `npx skills add https://nuxt-skill.onmax.me/` | `npx skills remove nuxt`, with `-g` if you installed it globally |
| A copy by hand | Delete the folders you copied, such as `skills/nuxt/`, from `.agents/`, `.claude/`, `.codex/` or your agent's own folder |

To remove the `nuxt-skill-hub` module from a Nuxt project:

1. Remove `'nuxt-skill-hub'` from `modules` in `nuxt.config.ts`, and the `skillHub` options if you set any.
2. Remove the package from `package.json`, for example with `npm uninstall nuxt-skill-hub`.
3. Delete the skill folder it wrote, named `nuxt-<your package name>` or `nuxt`, from `.agents/skills/`, `.claude/skills/` or your agent's skills folder. Windsurf keeps it in `.codeium/windsurf/rules/`.
4. If the setup added a hint to `AGENTS.md` or `CLAUDE.md`, delete the lines from `<!-- nuxt-skill-hub:start -->` to `<!-- nuxt-skill-hub:end -->`.

Many skills here were copies from other repositories. The [README](https://github.com/onmax/nuxt-skills#get-bundled-skills-from-their-source) lists where to get each one.

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
