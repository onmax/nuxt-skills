---
title: Ship a skill in your module
description: Put a skill in your Nuxt module's package, so every app that installs it gives its agent your docs for the installed version.
icon: i-lucide-package
navigation.order: 3
---

A skill in your package is the best source for `nuxt-skill-hub`: it needs no network, and it always matches the version the app installed.

## Add the skill

Put the skill in a folder that you publish to npm, and declare it under `agents.skills` in `package.json`:

```txt
my-nuxt-module/
├── package.json
└── skills/
    └── my-nuxt-module/
        ├── SKILL.md
        └── references/
            └── options.md
```

```json [package.json]
{
  "name": "my-nuxt-module",
  "files": ["dist", "skills"],
  "agents": {
    "skills": [
      { "name": "my-nuxt-module", "path": "./skills/my-nuxt-module" }
    ]
  }
}
```

```md [skills/my-nuxt-module/SKILL.md]
---
name: my-nuxt-module
description: Use when configuring my-nuxt-module or calling its composables.
---

# my-nuxt-module
...
```

The module checks each skill and skips it with a warning when a rule fails:

- `name` is lowercase hyphen-case, up to 64 characters, with no `--` and no `-` at the start or end.
- The folder name equals `name`.
- `path` stays inside the package.
- `SKILL.md` has frontmatter with the same `name` and a description.

The skill is copied to `references/modules/<package>/<skill>/` in each app. Symlinks and the `scripts/` folder are not copied.

## Without a release

Until your next release ships the skill, the module also looks in your GitHub repository's `package.json` for `agents.skills`. It tries the tag `v<version>`, `<version>`, then the default branch. A `/.well-known/skills/index.json` on your docs site works too.

## Add a skill from a hook

The `skill-hub:contribute` hook adds a skill that isn't found by itself, such as one from a local module:

```ts [nuxt.config.ts]
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  modules: ['nuxt-skill-hub'],
  hooks: {
    'skill-hub:contribute': (ctx) => {
      ctx.add({
        packageName: 'my-local-module',
        sourceDir: fileURLToPath(new URL('./skills/my-local-module', import.meta.url)),
      })
    },
  },
})
```

A module can call it with `nuxt.hook('skill-hub:contribute', ...)` in its `setup`. `packageName` and `sourceDir` are required. Optional fields include `skillName`, `version`, `description`, `docsUrl`, `repoUrl`, and `official`. See `SkillHubContribution` in [`src/types.ts`](https://github.com/onmax/nuxt-skills/blob/main/packages/nuxt-skill-hub/src/types.ts).

Three more hooks report progress for packages without their own skill: `skill-hub:resolve:start`, `skill-hub:resolve:package` (once per package), and `skill-hub:resolve:done`.
