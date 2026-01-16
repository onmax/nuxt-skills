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

```bash
npx add-skill onmax/nuxt-skills
```

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

Skills are **auto-activated by AI agents** based on context - not manually invoked.

| You're working on... | Agent automatically uses... |
| -------------------- | --------------------------- |
| `.vue` file          | `vue` skill                 |
| `server/api/` route  | `nuxt` skill                |
| `nuxt.config.ts`     | `nuxt` skill                |
| NuxtHub storage      | `nuxthub` skill             |
| Auth/login/session   | `nuxt-better-auth` skill    |

The agent reads the skill's `description` field and decides when to load it. This follows the [Agent Skills](https://agentskills.io) open format.

## Installation

### add-skill (Recommended)

The simplest way to install skills. Works with Claude Code, Cursor, OpenCode, and Codex:

```bash
npx add-skill onmax/nuxt-skills
```

The interactive picker displays all available skills. Select the ones you need. Use `--global` for user-wide installation.

### Claude Code (Marketplace)

```bash
/plugin marketplace add onmax/nuxt-skills
/plugin install nuxt-skills@nuxt-skills
```

Installs all skills at once. Skills appear in `/skills` list and auto-activate based on context.

### GitHub Copilot & VS Code

**Official support** added December 18, 2025. Enable in VS Code settings:

```json
"chat.useAgentSkills": true
```

Copy skills to `.github/skills/`:

```bash
git clone https://github.com/onmax/nuxt-skills.git
cp -r nuxt-skills/skills/vue .github/skills/
cp -r nuxt-skills/skills/nuxt .github/skills/
cp -r nuxt-skills/skills/nuxt-modules .github/skills/
cp -r nuxt-skills/skills/nuxthub .github/skills/
cp -r nuxt-skills/skills/nuxt-content .github/skills/
cp -r nuxt-skills/skills/nuxt-ui .github/skills/
cp -r nuxt-skills/skills/nuxt-better-auth .github/skills/
cp -r nuxt-skills/skills/reka-ui .github/skills/
cp -r nuxt-skills/skills/document-writer .github/skills/
cp -r nuxt-skills/skills/ts-library .github/skills/
```

**Note:** If you have Claude Code skills in `.claude/skills/`, Copilot auto-detects them. No duplication needed.

### OpenAI Codex

Use the built-in skill installer:

```
$skill-installer https://github.com/onmax/nuxt-skills
```

Or copy skills to your `.codex/skills/` directory:

```bash
git clone https://github.com/onmax/nuxt-skills.git
cp -r nuxt-skills/skills/vue ~/.codex/skills/
cp -r nuxt-skills/skills/nuxt ~/.codex/skills/
cp -r nuxt-skills/skills/nuxt-modules ~/.codex/skills/
cp -r nuxt-skills/skills/nuxthub ~/.codex/skills/
cp -r nuxt-skills/skills/nuxt-content ~/.codex/skills/
cp -r nuxt-skills/skills/nuxt-ui ~/.codex/skills/
cp -r nuxt-skills/skills/nuxt-better-auth ~/.codex/skills/
cp -r nuxt-skills/skills/reka-ui ~/.codex/skills/
cp -r nuxt-skills/skills/document-writer ~/.codex/skills/
cp -r nuxt-skills/skills/ts-library ~/.codex/skills/
```

Invoke skills with `/skills` command or `$skill-name`.

### OpenCode

**Native support** included. OpenCode auto-discovers skills from:

- Project: `.opencode/skill/` and `.claude/skills/`
- Global: `~/.config/opencode/skill/` and `~/.claude/skills/`

Copy to global (OpenCode native):

```bash
git clone https://github.com/onmax/nuxt-skills.git
cp -r nuxt-skills/skills/vue ~/.config/opencode/skill/
cp -r nuxt-skills/skills/nuxt ~/.config/opencode/skill/
cp -r nuxt-skills/skills/nuxt-modules ~/.config/opencode/skill/
cp -r nuxt-skills/skills/nuxthub ~/.config/opencode/skill/
cp -r nuxt-skills/skills/nuxt-content ~/.config/opencode/skill/
cp -r nuxt-skills/skills/nuxt-ui ~/.config/opencode/skill/
cp -r nuxt-skills/skills/nuxt-better-auth ~/.config/opencode/skill/
cp -r nuxt-skills/skills/reka-ui ~/.config/opencode/skill/
cp -r nuxt-skills/skills/document-writer ~/.config/opencode/skill/
cp -r nuxt-skills/skills/ts-library ~/.config/opencode/skill/
```

**Note:** If you have Claude Code skills in `.claude/skills/`, OpenCode auto-detects them. No duplication needed.

### btca

[btca](https://github.com/davis7dotsh/better-context) searches repos locally to answer questions.

```bash
bun add -g btca
btca config repos add -n nuxt -u https://github.com/onmax/nuxt-skills -b main --notes "Nuxt 4, Vue 3, NuxtHub patterns. Check skills/ folder."
```

Ask questions:

```bash
btca ask -t nuxt -q "How do I create a server route with validation?"
btca chat -t nuxt  # interactive mode
```

### Manual (Claude Code)

```bash
git clone https://github.com/onmax/nuxt-skills.git
cp -r nuxt-skills/skills/vue ~/.claude/skills/
cp -r nuxt-skills/skills/nuxt ~/.claude/skills/
cp -r nuxt-skills/skills/nuxt-modules ~/.claude/skills/
cp -r nuxt-skills/skills/nuxthub ~/.claude/skills/
cp -r nuxt-skills/skills/nuxt-content ~/.claude/skills/
cp -r nuxt-skills/skills/nuxt-ui ~/.claude/skills/
cp -r nuxt-skills/skills/nuxt-better-auth ~/.claude/skills/
cp -r nuxt-skills/skills/reka-ui ~/.claude/skills/
cp -r nuxt-skills/skills/document-writer ~/.claude/skills/
cp -r nuxt-skills/skills/ts-library ~/.claude/skills/
```

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
