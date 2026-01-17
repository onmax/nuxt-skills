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
  <img src="https://raw.githubusercontent.com/onmax/nuxt-skills/main/.github/badge-opencode.svg" alt="OpenCode">
</p>

<p align="center">
  <a href="https://github.com/nuxt/nuxt/discussions/34059">
    🔗 Related Nuxt RFC: Bundling Agent Skills in Nuxt Modules
  </a>
</p>

## Installation

```bash
npx skills add onmax/nuxt-skills
```

The [`skills`](https://www.npmjs.com/package/skills) CLI auto-detects your installed agents and provides an interactive picker. Use `-g` for global (user-wide) or `-y` to install all skills.

Works with Claude Code, Cursor, Codex, OpenCode, GitHub Copilot, Antigravity, Roo Code, and more.

### Claude Code Marketplace

An alternative for Claude Code users:

```bash
/plugin marketplace add onmax/nuxt-skills
/plugin install nuxt-skills@nuxt-skills
```

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

| Skill                | Description                                                                     |
| -------------------- | ------------------------------------------------------------------------------- |
| **vue**              | Vue 3 Composition API, components, composables, testing                         |
| **nuxt**             | Nuxt 4+ server routes, routing, middleware, config                              |
| **nuxt-modules**     | Creating Nuxt modules with defineNuxtModule, Kit utilities, testing             |
| **nuxthub**          | NuxtHub v0.10 database, KV, blob, cache, multi-cloud                            |
| **nuxt-content**     | Nuxt Content v3 collections, queries, MDC rendering, NuxtStudio                 |
| **nuxt-ui**          | Nuxt UI v4 components, theming, forms, overlays, composables                    |
| **nuxt-better-auth** | Auth with @onmax/nuxt-better-auth, useUserSession, route protection, clientOnly |
| **reka-ui**          | Reka UI headless Vue components, accessible primitives, props/emits/slots       |
| **document-writer**  | Writing documentation for Nuxt ecosystem - MDC, style, structure, code examples |
| **ts-library**       | TypeScript library authoring - exports, tsdown, API patterns, type tricks, CI   |

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
| Auth/login/session   | `nuxt-better-auth`     |

## Structure

Follows [agentskills](https://github.com/agentskills/agentskills) standard format.

```
nuxt-skills/
├── skills/                 # Skills (agentskills format)
│   ├── vue/
│   │   ├── SKILL.md        # Entry point with frontmatter
│   │   └── references/     # Sub-files loaded on-demand
│   ├── nuxt/
│   ├── nuxt-modules/
│   ├── nuxthub/
│   ├── nuxt-content/
│   ├── nuxt-ui/
│   ├── nuxt-better-auth/
│   ├── reka-ui/
│   ├── document-writer/
│   └── ts-library/
└── .claude-plugin/
    └── marketplace.json    # Claude Code marketplace
```

## Automated Maintenance

Skills are kept up-to-date via GitHub Actions:

| Workflow                  | Schedule              | Purpose                                                            |
| ------------------------- | --------------------- | ------------------------------------------------------------------ |
| **update-skills.yml**     | Weekly (Monday)       | Regenerates reka-ui and nuxt-ui component docs from upstream       |
| **skill-maintenance.yml** | Biweekly (1st & 15th) | Claude analyzes upstream changelogs, creates PRs if updates needed |

The maintenance workflow uses [claude-code-action](https://github.com/anthropics/claude-code-action) to intelligently detect breaking changes, new features, and deprecations from upstream sources.

## Resources

- [Agent Skills Spec](https://agentskills.io) - Open format for extending AI agent capabilities
- [Claude Code Skills](https://code.claude.com/docs/en/skills) - Skills in Claude Code
- [VS Code Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills) - GitHub Copilot skills in VS Code
- [GitHub Agent Skills Docs](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) - About agent skills
- [OpenCode Skills](https://opencode.ai/docs/skills/) - Agent skills in OpenCode
- [awesome-copilot](https://github.com/github/awesome-copilot) - Community collection of custom agents and prompts

## License

MIT
