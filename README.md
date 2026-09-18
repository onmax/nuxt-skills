<p align="center">
  <img src="https://raw.githubusercontent.com/onmax/nuxt-skills/main/.github/nuxt-skills.webp" alt="Nuxt Skills" width="100%">
  <br>
  <sub>Design inspired by <a href="https://github.com/HugoRCD">HugoRCD</a>'s work</sub>
</p>

<p align="center">Vue, Nuxt, and NuxtHub skills for AI coding assistants.</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/onmax/nuxt-skills/main/.github/badge-claude-code.svg" alt="Claude Code">
  <img src="https://raw.githubusercontent.com/onmax/nuxt-skills/main/.github/badge-copilot.svg" alt="GitHub Copilot">
  <img src="https://raw.githubusercontent.com/onmax/nuxt-skills/main/.github/badge-codex.svg" alt="OpenAI Codex">
  <img src="https://raw.githubusercontent.com/onmax/nuxt-skills/main/.github/badge-gemini.svg" alt="Google Gemini">
  <img src="https://raw.githubusercontent.com/onmax/nuxt-skills/main/.github/badge-opencode.svg" alt="OpenCode">
</p>

<p align="center">
  <a href="https://github.com/nuxt/nuxt/discussions/34059">
    🔗 Related Nuxt RFC: Bundling Agent Skills in Nuxt Modules
  </a>
</p>

> [!NOTE]
> **Sponsored by [Cactus](https://usecactus.app/for-coding-agents?utm_source=github&utm_medium=readme&utm_campaign=nuxt_skills_cactus_test)**
>
> Your agent is working. Don't drift into YouTube. Cactus blocks distracting websites on your Mac during the hours you choose, with a schedule that repeats every week. Built by this repo's maintainer.
>
> [Try Cactus free for 7 days](https://usecactus.app/for-coding-agents?utm_source=github&utm_medium=readme&utm_campaign=nuxt_skills_cactus_test). Keep it for $19.99 USD, paid once. No subscription.

## Other projects

- [Nuxt Skill Hub](https://nuxt-skill.onmax.me/): Give your coding agent Nuxt guidance tailored to your project's modules and stack.
- [Vite Doctor](https://vite-doctor.onmax.me/): Catch framework bugs in Nuxt, Vue, Nitro, and Vite before code review.

## Installation

```bash
npx skills add onmax/nuxt-skills
```

The [`skills`](https://www.npmjs.com/package/skills) CLI auto-detects your installed agents and provides an interactive picker. Use `-g` for global (user-wide) or `-y` to install all skills.

Works with Claude Code, Cursor, Codex, OpenCode, GitHub Copilot, Antigravity, Roo Code, and more.

### Claude Code Marketplace

An alternative for Claude Code users:

```bash
# Add marketplace
/plugin marketplace add onmax/nuxt-skills

# Install Nuxt Skills
/plugin install nuxt-skills@nuxt-skills
```

Claude Code installs Nuxt Skills as one plugin and dynamically discovers all included skill entries.

### Codex plugin marketplace

Install the Codex plugin from this repository's marketplace source:

```bash
codex plugin marketplace add onmax/nuxt-skills
codex plugin add nuxt-skills@nuxt-skills
```

See the [Codex plugin manifest](.codex-plugin/plugin.json) and [marketplace source](https://github.com/onmax/nuxt-skills) for the published metadata.

### Manual Installation

Clone the repository and copy skill folders to your agent's skills directory:

| Agent       | Project path       | Global path                 |
| ----------- | ------------------ | --------------------------- |
| Claude Code | `.claude/skills/`  | `~/.claude/skills/`         |
| Cursor      | `.cursor/skills/`  | `~/.cursor/skills/`         |
| Codex       | `.codex/skills/`   | `~/.codex/skills/`          |
| OpenCode    | `.opencode/skill/` | `~/.config/opencode/skill/` |
| Copilot     | `.github/skills/`  | —                           |

## Skills

The complete skill list, including provenance links for every bundled or hand-authored skill, is maintained in the generated [skill catalog](#skill-catalog) below.

## How Skills Work

Skills follow the [Agent Skills](https://agentskills.io) open format. They can be activated in two ways:

1. **Auto-discovery** — The agent reads each skill's `description` and loads it when relevant to your task
2. **Manual invocation** — Type `/skill-name` (e.g., `/nuxt`) to explicitly load a skill

| You're working on... | Agent may auto-load... |
| -------------------- | ---------------------- |
| `.vue` file          | `vue` skill            |
| `server/api/` route  | `nuxt` skill           |
| `nuxt.config.ts`     | `nuxt` skill           |
| NuxtHub storage      | `nuxthub` skill        |

## Structure

Follows [agentskills](https://github.com/agentskills/agentskills) standard format.

```
nuxt-skills/
├── plugin.json             # Portable Agent Plugins manifest
├── mcp.json                # Portable Nuxt MCP configuration
├── skills/                 # Materialized manual and ecosystem skills
├── ecosystem-skills.json   # Upstream skill sources and selected paths
├── .claude-plugin/         # Claude Code manifest and marketplace metadata
└── .codex-plugin/          # Codex compatibility manifest
```

## Automated Maintenance

Skills are kept up-to-date via GitHub Actions:

| Workflow                        | Schedule              | Purpose                                                                                             |
| ------------------------------- | --------------------- | --------------------------------------------------------------------------------------------------- |
| **update-skills.yml**           | Weekly (Monday)       | Regenerates reka-ui docs from upstream                                                              |
| **skill-maintenance.yml**       | Biweekly (1st & 15th) | Claude analyzes upstream changelogs, creates PRs if updates needed                                  |
| **bundle-ecosystem-skills.yml** | Weekly (Monday)       | Replaces configured local skills with upstream ecosystem copies, validates them, and pushes changes |

The maintenance workflow uses [claude-code-action](https://github.com/anthropics/claude-code-action) to intelligently detect breaking changes, new features, and deprecations from upstream sources.

The ecosystem bundle is configured in [`ecosystem-skills.json`](ecosystem-skills.json). It records the upstream repositories and skill names included in the Claude and Codex plugin. `ecosystem-skills.lock.json` records the exact source revisions used for each bundle.

## Nuxt module skill discovery

The Nuxt-specific sources follow the discovery model used by [Nuxt Skill Hub](https://nuxt-skill.onmax.me/) and its [resolver](https://github.com/onmax/nuxt-skill-hub): prefer a skill shipped by the package, then check the package's `.well-known/skills` publication, then use a repository path or fallback path. Configured sources live in `ecosystem-skills.json`; discovered sources and exact revisions are recorded in `ecosystem-skills.lock.json` so CI can materialize the bundle reproducibly.

## Resources

VueUse maintains its own current skill, so install it directly with `npx skills add vueuse/skills` instead of relying on a generated copy here.

- [Agent Skills Spec](https://agentskills.io) - Open format for extending AI agent capabilities
- [Claude Code Skills](https://code.claude.com/docs/en/skills) - Skills in Claude Code
- [VS Code Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills) - GitHub Copilot skills in VS Code
- [GitHub Agent Skills Docs](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) - About agent skills
- [OpenCode Skills](https://opencode.ai/docs/skills/) - Agent skills in OpenCode
- [awesome-copilot](https://github.com/github/awesome-copilot) - Community collection of custom agents and prompts

## Acknowledgments

- **vue** skill gotchas from [vuejs-ai/skills](https://github.com/vuejs-ai/skills) vue-best-practices (200+ rules)
- **vitest** and **vite** skills from [@antfu](https://github.com/antfu)'s [skills](https://github.com/antfu/skills)

## License

MIT

<!-- BEGIN GENERATED SKILL CATALOG -->

## Skill catalog

Every skill in the plugin is listed below with its provenance. The table is regenerated by `pnpm bundle:ecosystem`.

| Skill                                                              | Provenance                                                                                                                                                                                      |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`arkenv`](skills/arkenv/)                                         | [Bundled from nuxt-modules/yamcodes/arkenv](https://github.com/yamcodes/arkenv/tree/4465170dd36d9c0dddfdee4cf4134076785850df/skills/arkenv)                                                     |
| [`comark`](skills/comark/)                                         | [Bundled from nuxt-modules/comarkdown/comark](https://github.com/comarkdown/comark/tree/9bcbbfd427c647e5f7ebaf4a43b191ba01b747c1/docs/skills/comark)                                            |
| [`nitro`](skills/nitro/)                                           | [Bundled from antfu/skills](https://github.com/antfu/skills/tree/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/nitro)                                                                         |
| [`nuxt`](skills/nuxt/)                                             | [Bundled from antfu/skills](https://github.com/antfu/skills/tree/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/nuxt)                                                                          |
| [`nuxt-better-auth`](skills/nuxt-better-auth/)                     | [Bundled from nuxt-modules/nuxt-modules/better-auth](https://github.com/nuxt-modules/better-auth/tree/4e0b7cc20bd23ebaa721c4a1dfce51a281b9e750/docs/public/.well-known/skills/nuxt-better-auth) |
| [`nuxt-content`](skills/nuxt-content/)                             | Manually written in this repository.                                                                                                                                                            |
| [`nuxt-i18n`](skills/nuxt-i18n/)                                   | Manually written in this repository.                                                                                                                                                            |
| [`nuxt-modules`](skills/nuxt-modules/)                             | Manually written in this repository.                                                                                                                                                            |
| [`nuxt-seo`](skills/nuxt-seo/)                                     | Manually written in this repository.                                                                                                                                                            |
| [`nuxt-studio`](skills/nuxt-studio/)                               | Manually written in this repository.                                                                                                                                                            |
| [`nuxt-ui`](skills/nuxt-ui/)                                       | [Bundled from nuxt-modules/nuxt/ui](https://github.com/nuxt/ui/tree/b3d4342d9b588b85c69410dd14f0f7bba4a83adb/skills/nuxt-ui)                                                                    |
| [`nuxt-users`](skills/nuxt-users/)                                 | [Bundled from nuxt-modules/rrd108/nuxt-users](https://github.com/rrd108/nuxt-users/tree/ac0b122c6f92ec001ed30bdec5637939570f587f/skills/nuxt-users)                                             |
| [`nuxthub`](skills/nuxthub/)                                       | Manually written in this repository.                                                                                                                                                            |
| [`pinia`](skills/pinia/)                                           | [Bundled from antfu/skills](https://github.com/antfu/skills/tree/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/pinia)                                                                         |
| [`regle`](skills/regle/)                                           | [Bundled from nuxt-modules/victorgarciaesgi/regle](https://github.com/victorgarciaesgi/regle/tree/0df09b530955e2e54d0f3b931346ff33f8e19834/skills/regle)                                        |
| [`reka-ui`](skills/reka-ui/)                                       | Manually written in this repository.                                                                                                                                                            |
| [`unocss`](skills/unocss/)                                         | [Bundled from antfu/skills](https://github.com/antfu/skills/tree/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/unocss)                                                                        |
| [`vite`](skills/vite/)                                             | [Bundled from antfu/skills](https://github.com/antfu/skills/tree/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vite)                                                                          |
| [`vitest`](skills/vitest/)                                         | [Bundled from antfu/skills](https://github.com/antfu/skills/tree/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vitest)                                                                        |
| [`vue`](skills/vue/)                                               | [Bundled from antfu/skills](https://github.com/antfu/skills/tree/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vue)                                                                           |
| [`vue-best-practices`](skills/vue-best-practices/)                 | [Bundled from antfu/skills](https://github.com/antfu/skills/tree/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vue-best-practices)                                                            |
| [`vue-debug-guides`](skills/vue-debug-guides/)                     | [Bundled from vuejs-ai/skills](https://github.com/vuejs-ai/skills/tree/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-debug-guides)                                                        |
| [`vue-router-best-practices`](skills/vue-router-best-practices/)   | [Bundled from antfu/skills](https://github.com/antfu/skills/tree/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vue-router-best-practices)                                                     |
| [`vue-testing-best-practices`](skills/vue-testing-best-practices/) | [Bundled from antfu/skills](https://github.com/antfu/skills/tree/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vue-testing-best-practices)                                                    |
| [`vueuse-functions`](skills/vueuse-functions/)                     | [Bundled from antfu/skills](https://github.com/antfu/skills/tree/a74f281a27dadc02397bc1a174b0f2c97531b6ae/skills/vueuse-functions)                                                              |

<!-- END GENERATED SKILL CATALOG -->
