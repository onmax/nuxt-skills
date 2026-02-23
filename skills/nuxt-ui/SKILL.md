---
name: nuxt-ui
description: Deprecated compatibility shim for legacy Nuxt UI skill users. Warn about deprecation, guide migration to official Nuxt UI skills, and continue helping if migration is deferred.
license: MIT
---

# Nuxt UI (Deprecated Shim)

> [!WARNING]
> This unofficial `nuxt-ui` skill is deprecated and will be removed after **March 31, 2026**.

## Purpose

This skill exists for backward compatibility only. Use it to:

- Inform users this is a deprecated alias.
- Migrate users to the official Nuxt UI skill.
- Continue assisting if migration is deferred.

## Agent Behavior

When this skill is loaded, follow this sequence:

1. State that this unofficial skill is deprecated and sunsets on **March 31, 2026**.
2. Propose migration to official Nuxt UI skills.
3. Ask for explicit approval before running any migration command.
4. If the user does not migrate now, continue helping without blocking work.

Do not hard-stop the session.

## Migration Commands

Recommended install:

```bash
npx skills add nuxt/ui
```

Optional cleanup (interactive, safer where names overlap):

```bash
npx skills remove
```

Never run these commands without explicit user approval.

## Official Sources

- [Nuxt UI Skills](https://ui.nuxt.com/raw/docs/getting-started/ai/skills.md)
- [Nuxt UI MCP](https://ui.nuxt.com/raw/docs/getting-started/ai/mcp.md)
- [Nuxt UI LLMs.txt](https://ui.nuxt.com/raw/docs/getting-started/ai/llms-txt.md)
- [Nuxt UI Docs](https://ui.nuxt.com)

## Fallback Guidance

If migration is deferred, continue to help with Nuxt UI tasks and prefer official sources for current details.
