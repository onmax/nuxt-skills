<p align="center">
  <img src="https://nuxt-skill.onmax.me/og/readme-banner.png" alt="Nuxt Skill Hub: teach your AI agent the Nuxt way" width="100%">
</p>

<h1 align="center"><img src="https://nuxt-skill.onmax.me/icon.png" alt="" width="32" height="32" style="vertical-align: middle;"> nuxt-skill-hub</h1>

<p align="center">Teach your AI agent the Nuxt way with best practices and module guidance.</p>

<p align="center">
  <a href="https://npmx.dev/package/nuxt-skill-hub"><img src="https://comark-ui.onmax.me/badge.svg?source=npm-version&amp;package=nuxt-skill-hub&amp;icon=npm" alt="npm version"></a>
  <a href="https://npmx.dev/package/nuxt-skill-hub"><img src="https://comark-ui.onmax.me/badge.svg?source=npm-downloads&amp;package=nuxt-skill-hub&amp;period=month&amp;icon=npm" alt="npm downloads"></a>
  <a href="https://npmx.dev/package/nuxt-skill-hub"><img src="https://comark-ui.onmax.me/badge.svg?label=license&amp;value=MIT" alt="License"></a>
  <a href="https://nuxt.com"><img src="https://comark-ui.onmax.me/badge.svg?value=Nuxt" alt="Nuxt"></a>
</p>

## Documentation

**[nuxt-skill.onmax.me](https://nuxt-skill.onmax.me)**

## Install

For agents:

```bash
npx skills add https://nuxt-skill.onmax.me/
```

For Nuxt projects:

```bash
npx nuxi module add nuxt-skill-hub
```

Use [Doctor](https://vite-doctor.onmax.me/) to check AI-written Nuxt changes for Nuxt, Vue, Nitro, and Vite issues before review.

## How it works

On `nuxt prepare`, the module writes the full skill into each agent's project-local skills directory. Agents load it like any other skill, and the router's relative links resolve from there.

```
my-app/
└── .claude/skills/nuxt-my-app/
    ├── .gitignore                # "*": the folder keeps itself out of git
    ├── SKILL.md                  # router: picks the smallest relevant guide
    └── references/
        ├── nuxt/
        │   └── rules/            # packs the router links: data-fetching-ssr.md, plugins.md, ...
        ├── vue/                  # Vue best practices (vuejs-ai/skills)
        └── modules/              # only when there are module skills or skipped packages
            ├── index.md
            └── <package>/<skill>/SKILL.md
```

The skill is written during `nuxt prepare`, which also runs on `postinstall` in most Nuxt projects. `nuxt dev`, `nuxt build` and deleting `.nuxt` don't touch it. Generation is skipped in CI (unless tests are running), during `nuxi typecheck`, and when no agent target is detected. Each run builds the tree in a staging folder and swaps it in when complete, so a failed run keeps the previous skill. Results are cached in `node_modules/.cache/nuxt-skill-hub`. A later `nuxt prepare` reuses the cached tree if the inputs (options, module versions, local skill files) are unchanged and the cache is younger than `remote.cacheTtlMs`.

The router links only the Nuxt packs that apply: the Nuxt UI and Nuxt Content packs need their module installed, and the module authoring pack needs `moduleAuthoring`. Only linked packs are copied.

**Agents.** With no `targets` set, the module writes a skill for every agent whose config directory exists in your home directory, such as `~/.claude` or `~/.codex`. The agent running the command, detected from its environment, is included too, so `nuxt prepare` run by an agent writes that agent's skill. The agent list comes from [unagent](https://github.com/onmax/unagent). Agents that read the shared `.agents/skills` folder (Amp, Cline, Codex and Cursor) get one copy at `.agents/skills/<name>/`. For other agents the skill path mirrors their config directory inside the project, such as `.claude/skills/<name>/` for Claude Code. Agents that load every file in a rules directory as a rule, such as Windsurf (`.codeium/windsurf/rules/<name>/`), get one `SKILL.md` that points to the generated tree in `node_modules/.cache/nuxt-skill-hub/generated/<name>/`, plus where to run `npx nuxt prepare` when it's missing. If no agent is detected, nothing is written and the module logs a warning.

The module only replaces a skill folder it wrote. If `<name>` already holds a skill it didn't write, it logs a warning and leaves it alone. When an agent moved to `.agents/skills`, the copy an older version wrote to its own folder, such as `.codex/skills/<name>/` or `.cursor/rules/<name>/`, is deleted so the agent doesn't load the skill twice.

**Upgrading from 0.2.** The skill no longer lives in `.nuxt/skill-hub`, and the committed wrapper is gone. If you committed the wrapper, untrack it with `git rm --cached -r .claude/skills/<name>` (and the same for other agents). Project `.gitignore` entries for these folders are no longer needed. The old `.nuxt/skill-hub` folder is deleted on the next `nuxt prepare`.

**Skill name.** The default is `nuxt-<package name>` from your `package.json` (scope removed), or `nuxt` if there is no name.

**Monorepos.** Skills go to the workspace root (the nearest folder with `pnpm-workspace.yaml` or a `workspaces` field in `package.json`), so agents find them when opened at the repo root. The generated router then gets a "Monorepo scope" section that limits it to the app's path, for example `apps/web`. Each app gets its own skill name from its own `package.json`.

## Configuration

Options go under `skillHub` in `nuxt.config.ts`. All are optional.

```ts
export default defineNuxtConfig({
  modules: ['nuxt-skill-hub'],
  skillHub: {
    targets: ['claude-code', 'codex'],
    moduleAuthoring: true,
    remote: {
      githubHeuristics: true,
      timeoutMs: 3000,
    },
  },
})
```

| Option            | Type                    | Default               | Description                                                                                                                                                                                                           |
| ----------------- | ----------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `skillName`       | `string`                | `nuxt-<package name>` | Name of the generated skill. Lowercase, hyphen-case, up to 64 characters. Invalid values fall back to the default.                                                                                                    |
| `targets`         | `string[]`              | `[]` (auto-detect)    | Agent ids from unagent, such as `claude-code`, `codex`, `cursor`, or `universal` to write `.agents/skills/<name>/` without naming an agent. Setting this turns off detection. Unknown ids are skipped with a warning. |
| `generationMode`  | `'prepare' \| 'manual'` | `'prepare'`           | `prepare` writes the skill during `nuxt prepare`. `manual` writes nothing.                                                                                                                                            |
| `moduleAuthoring` | `boolean`               | `false`               | Adds the module authoring guide to the router. Enable it when the project is a Nuxt module.                                                                                                                           |
| `remote`          | `boolean \| object`     | `true`                | Remote lookup of module skills. `false` limits sources to installed packages, the `skill-hub:contribute` hook, and generated metadata routers.                                                                        |

`remote` accepts an object with these fields:

| Option                    | Type      | Default           | Description                                                                                           |
| ------------------------- | --------- | ----------------- | ----------------------------------------------------------------------------------------------------- |
| `remote.enabled`          | `boolean` | `true`            | Fetch module skills from GitHub and docs sites.                                                       |
| `remote.githubHeuristics` | `boolean` | `false`           | Also search GitHub repos for skill folders by path when a package declares none.                      |
| `remote.timeoutMs`        | `number`  | `1500`            | Timeout for each GitHub API and docs request. Skill folder downloads from GitHub are not bound by it. |
| `remote.concurrency`      | `number`  | `8`               | Number of packages resolved in parallel.                                                              |
| `remote.cacheTtlMs`       | `number`  | `86400000` (24 h) | How long a cached generated tree is reused. `0` regenerates on every `nuxt prepare`.                  |
| `remote.refresh`          | `boolean` | `false`           | Ignore the cache and regenerate on every `nuxt prepare` while set.                                    |
| `remote.timings`          | `boolean` | `false`           | Log how each package was resolved and how long it took. Also enabled when Nuxt `debug` is set.        |
| `remote.maxFiles`         | `number`  | `40`              | Max files per skill from a `.well-known` index.                                                       |
| `remote.maxBytes`         | `number`  | `524288` (512 KB) | Max total bytes per skill from a `.well-known` index.                                                 |
| `remote.maxFileBytes`     | `number`  | `131072` (128 KB) | Max bytes per file from a `.well-known` index.                                                        |

## For module authors

Skill Hub looks at every package in `modules` (local paths are ignored) and every layer in `extends`. For each package it takes the first source that produces a skill:

1. **Installed package.** An `agents.skills` field in the installed `package.json`. This is the recommended path. It needs no network, and the skill always matches the installed version. The app's own `package.json` is read the same way.
2. **GitHub `agents` field.** The same field, read from the repo's `package.json`. Refs are tried in order: the built-in override ref (if any), tag `v<version>`, `<version>`, then the default branch, `main`, and `master`. The repo comes from the override, `repository`, or `homepage`.
3. **Docs `.well-known`.** `/.well-known/agent-skills/index.json` (Agent Skills discovery 0.2.0 ([spec](https://agentskills.io/specification)), `skill-md` entries with a sha256 digest) or `/.well-known/skills/index.json` (entries with `name`, `description`, and a `files` list of `.md`/`.json` files). The base URL comes from a built-in override docs URL, or from `docs`, `documentation`, or `homepage` in `package.json`. Files must be on the same origin.
4. **GitHub heuristics.** Only with `remote.githubHeuristics: true`. Looks for folders under `skills/`, then `skills/<slug>`, `.claude/skills/<slug>`, and `.github/skills/<slug>`.
5. **Metadata router.** If nothing else matched and the package has a repository or docs URL, Skill Hub writes a short skill that links to them. Otherwise the package is skipped.

Steps 2 to 4 run only when `remote` is enabled. A few popular packages (`@nuxt/ui`, `@vueuse/core`, `@nuxt/content`, and others) have built-in overrides in [`src/package-overrides.ts`](./src/package-overrides.ts) that can set the repo, ref, path, skill name, or docs URL.

### Ship a skill in your package

Put the skill in a folder that is published to npm and declare it in `package.json`:

```
my-nuxt-module/
├── package.json
└── skills/
    └── my-nuxt-module/
        ├── SKILL.md
        └── references/
            └── options.md
```

```json
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

```md
---
name: my-nuxt-module
description: Use when configuring my-nuxt-module or calling its composables.
---

# my-nuxt-module
...
```

Skill Hub validates each skill and skips it with a warning if a rule fails:

- `name` is lowercase hyphen-case, up to 64 characters, with no `--` and no leading or trailing `-`.
- The folder name equals `name`.
- `path` stays inside the package root.
- `SKILL.md` exists and has YAML frontmatter with `name` (equal to the declared name) and a non-empty `description`.

Skill Hub copies the folder to `references/modules/<package>/<skill>/`. It skips symlinks, and for installed packages it also skips `scripts/`.

### Trust levels

Each module entry in the generated index is labeled `official` or `community`. Skills from the package itself, its repo, its docs site, or a metadata router are `official`. Skills that Skill Hub maps from a third-party repo, such as the curated `@nuxt/content` and `nuxt-studio` skills from `onmax/nuxt-skills`, are `community`.

### Add a skill from a hook

Use the `skill-hub:contribute` hook to add a skill that is not discovered automatically, for example from a local module or from your app's own config:

```ts
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

A module can call the same hook with `nuxt.hook('skill-hub:contribute', ...)` in its `setup`. `packageName` and `sourceDir` are required. `sourceDir` can be absolute or relative to the Nuxt root. Common optional fields: `skillName` (defaults to the folder name), `version`, `description`, `docsUrl`, `repoUrl`, `official` (defaults to `true`), and `forceIncludeScripts` (defaults to `false`). Provenance fields (`sourceKind`, `sourceRepo`, `sourceRef`, `sourcePath`, `resolver`) are also accepted; see `SkillHubContribution` in [`src/types.ts`](./src/types.ts). Contributed skills go through the same validation as package skills.

Three more hooks report resolution progress for packages that don't ship their own skill:

- `skill-hub:resolve:start`: `skillName`, `packageCount`, `concurrency`, `remoteEnabled`, `githubHeuristics`.
- `skill-hub:resolve:package`: once per package, with `skillName`, `packageName`, `packageIndex` (zero-based), `packageCount`, `durationMs`, `contributionCount`, `skippedCount`, and `resolver`/`sourceKind` when a skill was found.
- `skill-hub:resolve:done`: the start fields plus `durationMs`, `contributionCount`, `skippedCount`, `issueCount`, and `resolverCounts`.

## Template dependency guidance

Template dependency guidance comes from [`onmax/nuxt-skills`](https://github.com/onmax/nuxt-skills/blob/main/skills/nuxt-modules/references/template-dependencies.md). Update it there, then run `pnpm sync:template-guidance` to refresh the generated section of `nuxt-best-practices/rules/module-authoring.md`. The package generator, hosted skill, and playground all load that pack through the existing Nuxt content loader.

For coordinated local changes, run `pnpm sync:template-guidance --source-dir /path/to/nuxt-skills`. Add `--check` to verify without writing. `--ref <branch-or-sha>` selects a remote revision. The checked-in section includes a source digest, so package and docs builds use the same content without a network fetch.

## Releasing

uppt opens a draft `release/vX.Y.Z` PR from conventional commits on `main`. Merging it runs the CI checks, tags the version, creates the GitHub release, and publishes to npm through OIDC trusted publishing. The npm trusted publisher uses workflow `release.yml` and environment `npm`. If publishing fails after the tag exists, run `gh workflow run release.yml --repo onmax/nuxt-skill-hub --ref vX.Y.Z`.

## License

MIT
