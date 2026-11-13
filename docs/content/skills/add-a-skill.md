---
title: Add a skill
description: Fix a skill, ship one with your Nuxt module, or write a new one here, and where each change has to go.
icon: i-lucide-square-pen
navigation.order: 3
---

## Fix a skill

Check the [catalog](/skills/catalog) first. A skill with a source repository is copied from there, so open the change in that repository. A change made here is overwritten by the next weekly copy.

For a skill written here, edit `skills/<name>/` in [onmax/nuxt-skills](https://github.com/onmax/nuxt-skills) and open a pull request.

## Add a skill for your module

You don't need a pull request here. Ship the skill in your module's package and repository, as [Ship a skill in your module](/nuxt-module/module-authors) shows. Then:

- the Nuxt module gives it to every app that installs your module, matching the installed version,
- and the weekly job copies it into this catalog once your module is on [nuxt.com/modules](https://nuxt.com/modules).

## Write a new skill here

Open an issue first if the skill is for a library that could ship its own. A skill in the library's repository stays in sync with its releases. One here does not.

A skill is a folder in `skills/`:

```txt
skills/my-skill/
├── SKILL.md          name, description, and a short guide
└── references/
    ├── setup.md      loaded only when SKILL.md links to it
    └── api.md
```

- Keep `SKILL.md` short, about 300 tokens. Put details in `references/` and link them from `SKILL.md`, so the agent loads them only when it needs them.
- Start the description with what the skill covers, then "Use when..." with the files, APIs, or tasks that should load it.
- The folder name and `name` must match: lowercase letters, digits, and single hyphens.

In the same pull request, add the skill to the README and bump `plugins[0].version` in `.claude-plugin/marketplace.json`, so plugin users get it. CI validates every skill with [skills-ref](https://github.com/agentskills/agentskills).
