---
title: Configuration
description: Every skillHub option in nuxt.config.ts. The defaults work for most projects.
icon: i-lucide-settings
navigation.order: 2
---

Options go under `skillHub` in `nuxt.config.ts`. All are optional.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['nuxt-skill-hub'],
  skillHub: {
    targets: ['claude-code', 'codex'],
    moduleAuthoring: true,
    remote: { timeoutMs: 3000 },
  },
})
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `skillName` | `string` | `nuxt-<package name>` | Name of the skill. Lowercase, hyphen-case, up to 64 characters. An invalid name falls back to the default. |
| `targets` | `string[]` | `[]`, detect agents | Agent ids from unagent, such as `claude-code`, `codex`, or `cursor`. `universal` writes `.agents/skills/<name>/` without naming an agent. Setting it turns detection off. Unknown ids are skipped with a warning. |
| `generationMode` | `'prepare' \| 'manual'` | `'prepare'` | `prepare` writes the skill on `nuxt prepare`. `manual` writes nothing. |
| `moduleAuthoring` | `boolean` | `false` | Adds the module authoring rules. Turn it on when the project is a Nuxt module. |
| `remote` | `boolean \| object` | `true` | Looks up module skills on GitHub and docs sites. `false` uses only installed packages, nuxt-skills, and the `skill-hub:contribute` hook. |

## `remote`

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `remote.enabled` | `boolean` | `true` | Fetch module skills from GitHub and docs sites. |
| `remote.githubHeuristics` | `boolean` | `false` | Also look for skill folders in a module's GitHub repository when its package declares none. |
| `remote.timeoutMs` | `number` | `1500` | Timeout of each GitHub API and docs request. |
| `remote.concurrency` | `number` | `8` | Packages resolved in parallel. |
| `remote.cacheTtlMs` | `number` | `86400000` (24 h) | How long a generated skill is reused. `0` regenerates on every `nuxt prepare`. |
| `remote.refresh` | `boolean` | `false` | Ignore the cache while set. |
| `remote.timings` | `boolean` | `false` | Log how each package was resolved and how long it took. Nuxt's `debug` turns it on too. |
| `remote.maxFiles` | `number` | `40` | Most files per skill from a `.well-known` index. |
| `remote.maxBytes` | `number` | `524288` (512 KB) | Most bytes per skill from a `.well-known` index. |
| `remote.maxFileBytes` | `number` | `131072` (128 KB) | Most bytes per file from a `.well-known` index. |

## Monorepos

The skill goes to the workspace root, the nearest folder with `pnpm-workspace.yaml` or a `workspaces` field, so the agent finds it when you open the repository. The skill then says which app it covers, such as `apps/web`. Each app gets its own skill, named from its own `package.json`.
