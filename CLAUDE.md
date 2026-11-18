# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

Claude Code skills for Vue 3, Nuxt 4+, NuxtHub v0.10, and Nuxt module development.

The skills are documentation. `packages/nuxt-skill-hub` is the Nuxt module that ships them into Nuxt projects: on `nuxt prepare` it detects agents, collects skills, and writes one skill tree. Test with `pnpm --filter nuxt-skill-hub dev:prepare && pnpm --filter nuxt-skill-hub test`.

`docs/` is the site at nuxt-skill.onmax.me, built on `@vite-hub/docs` (ViteHub from a pkg.pr.new build pinned in `pnpm-workspace.yaml`). Pages are Markdown in `docs/content/`. The skills catalog page is generated from `skills/*/SKILL.md` on build (`docs/modules/skill-catalog.ts`), and `docs/modules/hosted-skill.ts` serves the `nuxt` skill at `/.well-known/skills` for `npx skills add https://nuxt-skill.onmax.me/`. Check it with `pnpm --filter nuxt-skills-docs build`.

When a skill should reach Nuxt apps that install a module, map it to the module's package in `packages/nuxt-skill-hub/src/bundled-skills.json`.

## Deploy the docs site

CI does not deploy the docs. Run these steps from `docs/` on a local machine to deploy the Cloudflare Worker `nuxt-skills-docs` and apply migrations to its D1 database of the same name.

1. Log in with `npx --package=wrangler@4.158.0 -- wrangler login`. Set `CLOUDFLARE_ACCOUNT_ID` if you have multiple Cloudflare accounts.
2. Before the first deploy, add the Console **public** key to `nitro.cloudflare.wrangler.vars` in `docs/nuxt.config.ts`. If you don't have a key from Console yet, run `pnpm exec vitehub secret console-key BOOTSTRAP` and add only the `VITEHUB_CONSOLE_KEY_BOOTSTRAP` name and value. Never commit or deploy the private key. Without a public key, deployment stops before applying migrations or uploading the Worker, even with `--yes`.
3. Before each subsequent deploy, export all existing Worker secrets locally from your secret manager, including `VITEHUB_GITHUB_TOKEN` once configured. Having the secrets stored only on the Worker does not satisfy the CLI's deploy check. Do not commit the secret values.
4. Run `npx --package=wrangler@4.158.0 -- pnpm exec vitehub deploy --host cloudflare`. The `npx` wrapper puts Wrangler on the deploy process's PATH so ViteHub can use the saved OAuth login. On the first deploy, after the Worker exists, set the CMS token with `npx --package=wrangler@4.158.0 -- wrangler secret put VITEHUB_GITHUB_TOKEN --name nuxt-skills-docs`.
5. When linking the site in Console, replace the bootstrap Wrangler variable with the Console-issued public key and redeploy with the local secrets set. Use **Check connection** in Console to verify the new key works. ViteHub deploys with `--keep-vars`, so if `VITEHUB_CONSOLE_KEY_BOOTSTRAP` is still listed in the Worker's Cloudflare settings, remove it there too.

## Structure

Follows [agentskills](https://github.com/agentskills/agentskills) standard format.

- `skills/<name>/SKILL.md` - Entry point (frontmatter with name/description/license)
- `skills/<name>/references/*.md` - Sub-files loaded on-demand
- `packages/nuxt-skill-hub` - Nuxt module, with the Nuxt rule packs in `nuxt-best-practices/`
- `docs/` - the docs site
- `plugin.json` and `mcp.json` - Portable Agent Plugins manifest and Nuxt MCP configuration
- `.claude-plugin/plugin.json` - Claude Code plugin manifest
- `.claude-plugin/marketplace.json` - Claude Code marketplace manifest
- `.codex-plugin/plugin.json` - Codex compatibility manifest

## MANDATORY: Before Starting Work

**Always run `git pull`** before making any changes. CI auto-commits lint fixes, so your local branch may be behind.

**After making changes, sync to `~/.claude/skills/`** by running `./sync-skills.sh` so Claude Code uses latest versions.

## MANDATORY: When Working on Skills

**Always use the `example-skills:skill-creator` skill** when creating or editing any skill content. This ensures skills follow best practices.

### Checklist When Changing Skills

When adding/editing/removing a skill, update ALL of these:

1. `skills/<name>/SKILL.md` - Main skill entry point
2. `skills/<name>/references/*.md` - Sub-files if applicable
3. `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json` - Add/update plugin entry
4. `.claude-plugin/marketplace.json` - Bump `plugins[0].version` for any installed plugin change (`skills/**`, `.claude-plugin/**`, or install docs)
5. `README.md` - Update skills table and installation commands

**Do not skip any of these.** All must stay in sync.

## Skill Design Pattern

Skills use progressive loading - main SKILL.md is small (~300 tokens), references sub-files that users load based on context. Keeps context usage minimal.
