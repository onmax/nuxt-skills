---
title: Skills
description: Where the skills in nuxt-skills come from, how they stay current, and how to pick the ones you need.
icon: i-lucide-library
navigation.order: 1
---

nuxt-skills collects skills for Nuxt, Vue, and the libraries around them in one place, so you install one source instead of twenty. The [catalog](/skills/catalog) lists every skill.

## Where they come from

- **Written here.** Skills such as `nuxthub`, `nuxt-content`, and `nuxt-seo` are maintained in this repository.
- **Copied from their owners.** Skills such as `vue-best-practices` (from [vuejs-ai/skills](https://github.com/vuejs-ai/skills)) and `pinia` (from [antfu/skills](https://github.com/antfu/skills)) are copied from the repository that owns them. A weekly job copies the latest version.
- **Found in Nuxt modules.** The same job reads the modules on [nuxt.com/modules](https://nuxt.com/modules). When a module's GitHub repository has a skill, it is copied into the catalog.

The catalog shows the source of each skill. Fix a copied skill in its own repository, and the next weekly run brings the fix here.

## Pick the ones you need

Each skill costs your agent a few tokens per session for its name and description, and nothing more until it is used. Installing all of them is fine. If you prefer fewer:

- **Nuxt app:** use the [Nuxt module](/nuxt-module). It adds the skills for the modules you installed.
- **Vue app:** `vue-best-practices`, plus `pinia`, `vueuse-functions`, or `vue-router-best-practices` if you use them.
- **Nuxt module:** `nuxt-modules`, and `nuxt` for the framework itself.

```bash
npx skills add onmax/nuxt-skills --skill vue-best-practices --skill pinia
```
