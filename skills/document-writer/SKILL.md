---
name: document-writer
description: Use when writing blog posts or documentation for Nuxt ecosystem. Covers writing style, content structure, and component patterns. Links to nuxt-content for MDC syntax and nuxt-ui for component details.
---

# Documentation Writer for Nuxt Ecosystem

Writing guidance for blog posts and documentation following patterns from official Nuxt websites.

## When to Use

- Writing blog posts for Nuxt ecosystem projects
- Creating or editing documentation pages
- Ensuring consistent writing style across content

## Writing Standard

**Override**: When writing documentation, maintain proper grammar and complete sentences. The "sacrifice grammar for brevity" rule does NOT apply here.

Documentation must be:
- Grammatically correct
- Clear and unambiguous
- Properly punctuated
- Complete sentences (not fragments)

Brevity is still valued, but never at the cost of clarity or correctness.

## Related Skills

For component and syntax details, use these skills:

| Skill | Use For |
|-------|---------|
| **nuxt-content** | MDC syntax, prose components, code highlighting |
| **nuxt-ui** | Component props, theming, UI patterns |

```bash
# MDC syntax help
cat ~/.claude/skills/nuxt-content/rendering.md

# Component details
cat ~/.claude/skills/nuxt-ui/components.md
```

## Available References

| Reference | Purpose |
|-----------|---------|
| `writing-style.md` | Voice, tone, sentence structure |
| `content-patterns.md` | Blog frontmatter, structure, component patterns |

```bash
# Writing prose
cat ~/.claude/skills/document-writer/references/writing-style.md

# Blog structure and patterns
cat ~/.claude/skills/document-writer/references/content-patterns.md
```

## Quick Reference

### Writing Patterns

| Pattern | Example |
|---------|---------|
| Subject-first | "The `useFetch` composable handles data fetching." |
| Imperative | "Add the following to `nuxt.config.ts`." |
| Contextual | "When using authentication, configure..." |

### Modal Verbs

| Verb | Meaning |
|------|---------|
| `can` | Optional |
| `should` | Recommended |
| `must` | Required |

### Component Patterns (WHEN to use)

| Need | Component |
|------|-----------|
| Info aside | `::note` |
| Suggestion | `::tip` |
| Caution | `::warning` |
| Required | `::important` |
| CTA | `:u-button{to="..." label="..."}` |
| Multi-source code | `::code-group` |

> For component props: see **nuxt-ui** skill

## Checklist

- [ ] Active voice (85%+)
- [ ] Present tense
- [ ] 2-4 sentences per paragraph
- [ ] Explanation before code
- [ ] File path labels on code blocks
- [ ] Appropriate callout types
