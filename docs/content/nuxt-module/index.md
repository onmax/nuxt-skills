---
title: How the module works
description: nuxt-skill-hub writes one skill for your Nuxt project on every nuxt prepare. What goes in it, where it is written, and when it updates.
icon: i-lucide-workflow
navigation.order: 1
---

```bash
npx nuxi module add nuxt-skill-hub
```

Your agent already knows how to search your code. What it doesn't know is which Nuxt rules apply to your project and how the modules you installed work in the versions you installed. `nuxt-skill-hub` writes that into one skill, named after your project, such as `nuxt-my-app`.

## What it writes

On `nuxt prepare`, the module writes the skill into each agent's skills folder in your project:

```txt
my-app/
└── .claude/skills/nuxt-my-app/
    ├── .gitignore          keeps the folder out of git
    ├── SKILL.md            the router
    └── references/
        ├── nuxt/rules/     Nuxt rules
        ├── vue/            the Vue guide
        └── modules/        one skill per module
            ├── index.md
            └── <package>/<skill>/SKILL.md
```

`SKILL.md` is the router: a table of tasks and the file to open for each, such as the data fetching rules or the Nuxt UI skill. The agent reads it first and opens one file, not the whole tree.

The Nuxt rules for Nuxt UI and Nuxt Content are linked only when those modules are installed, and the module authoring rules only with [`moduleAuthoring`](/nuxt-module/configuration).

## How it finds a skill for each module

For every package in `modules` and every layer in `extends`, the module takes the first source that has a skill:

::steps{level="3"}
### The installed package

The module's own skill, declared in its `package.json`. It needs no network, and it matches the version you installed. [Ship a skill in your module](/nuxt-module/module-authors) shows how.

### A skill from nuxt-skills

If the package ships no skill and nuxt-skills has one for it, the module uses that one. It is in the package already, so it needs no network either. For example, `@pinia/nuxt` gets `pinia`, and `@nuxthub/core` gets `nuxthub`.

### The module's repository or docs site

The `agents.skills` field in the module's GitHub `package.json`, or a `/.well-known/skills` index on its docs site.

### A link to the docs

If nothing else has a skill, the module writes a short one that links to the package's docs and repository.
::

Only step 3 uses the network. Turn it off with `remote: false`. Each skill in `references/modules/index.md` is marked `official` when it comes from the module's own package, repository, or docs, and `community` when it comes from nuxt-skills.

## Which agents get it

With no [`targets`](/nuxt-module/configuration) set, the module writes a skill for every agent whose config folder is in your home folder, such as `~/.claude` or `~/.codex`, and for the agent that runs the command. The list of agents comes from [unagent](https://github.com/onmax/unagent).

- Amp, Cline, Codex, and Cursor read the shared `.agents/skills/` folder, so they get one copy there.
- Other agents get it in their own folder, such as `.claude/skills/` for Claude Code.
- Agents that load every file in a folder as a rule, such as Windsurf, get one file that points to the generated skill.

If no agent is found, nothing is written and the module logs a warning.

## When it updates

The skill is written on `nuxt prepare`, which most Nuxt projects run after every install. So it updates when you add a module or update one.

- `nuxt dev` and `nuxt build` don't change it.
- It is not written in CI or during `nuxi typecheck`.
- When the inputs haven't changed, the cached skill is reused for 24 hours.
- A failed run keeps the previous skill.

The module replaces only folders it wrote. If your project already has a skill with the same name, it logs a warning and leaves it alone.

## Turn it off

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  skillHub: false,
})
```

Or keep the module and stop the writes with `generationMode: 'manual'`.
