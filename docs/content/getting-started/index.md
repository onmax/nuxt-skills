---
title: What nuxt-skills is
description: What an agent skill is, how your agent uses one, and the three ways nuxt-skills reaches your agent.
icon: i-lucide-book-open
navigation.order: 1
---

## What a skill is

A skill is a folder with a `SKILL.md` file and, often, a `references/` folder. `SKILL.md` starts with a name and a description:

```md [skills/pinia/SKILL.md]
---
name: pinia
description: Pinia official Vue state management library, type-safe and extensible. Use when defining stores, working with state/getters/actions, or implementing store patterns in Vue apps.
---

# Pinia
...
```

Skills follow the [Agent Skills](https://agentskills.io) format, so Claude Code, Codex, Cursor, Copilot, Gemini CLI, OpenCode, and most other agents can read them.

## How your agent uses it

1. At the start of a session, the agent reads only the name and description of each skill. That costs a few tokens per skill.
2. When your task matches a description, the agent opens that `SKILL.md`. You can also ask for it by name, such as `/pinia` in Claude Code.
3. `SKILL.md` links to files in `references/`. The agent opens only the ones it needs.

So a large skill set doesn't fill the context window. The agent pays for a skill only when it uses it.

::note
An agent can skip a skill that would have helped. That is why each description says when to use the skill, and why the [Nuxt module](/nuxt-module) writes one entry skill that routes to the rest.
::

## What is in nuxt-skills

- **[Skills](/skills/catalog)** for Nuxt, Nitro, Vue, Pinia, Vite, Vitest, Nuxt UI, Nuxt Content, NuxtHub, and other modules. Some are written here. Others are copied from the repository that owns them and refreshed every week.
- **[The Nuxt module](/nuxt-module)** `nuxt-skill-hub`. On `nuxt prepare`, it writes one skill for your project: Nuxt rules, the Vue guide, and a skill for each module you installed.
- **The hosted `nuxt` skill** at `https://nuxt-skill.onmax.me`: the same Nuxt rules and Vue guide as the module writes, without your project's modules. Use it when you can't add a module.

## Which one to use

- In a Nuxt app, use the [module](/getting-started/install#nuxt-module). Its skill matches the modules and versions you have, and it updates when you update the package.
- For Vue without Nuxt, or for a module you work on, use the [skills CLI](/getting-started/install#skills-cli) and pick the skills you need.
- To have every skill everywhere, use the [plugin](/getting-started/install#plugin).

You can combine them. The module writes a skill named after your project, such as `nuxt-my-app`, so it doesn't replace skills you installed another way.
