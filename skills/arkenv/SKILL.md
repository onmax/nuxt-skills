---
name: arkenv
description: "Answer questions about ArkEnv and help implement environment variable validation. Use when developers: (1) Ask about environment variable validation or typesafety, (2) Want to setup ArkEnv in a project, (3) Need to define or update schemas using ArkType or Standard Schema, (4) Are integrating with Next.js, Nuxt, Vite, Bun, or Node.js runtimes. Triggers on: 'ArkEnv', 'env validation', 'typesafe env', 'createEnv', 'env.ts', 'arkenv'."
---

# ArkEnv

ArkEnv is a typesafe environment variable validation library for modern JavaScript and TypeScript frameworks. It provides a **single canonical surface across all frameworks: `import { env } from "./env"`**.

In v1, ArkEnv offers two first-class validation engines:

- **`@arkenv/core`**: Built-in ArkType DSL engine for high-performance schema definition and automatic coercion.
- **`@arkenv/standard`**: Standard Schema engine supporting any compliant validator (Zod, Valibot, etc.).

---

## Capabilities

### Core usage

- Define typesafe schemas using `@arkenv/core` ArkType DSL strings or `@arkenv/standard` with Zod / Valibot.
- Automatic coercion (`string.numeric`, `number.port`, booleans, JSON objects, arrays) and default values (`"boolean = true"`).
- Single, uniform developer experience: import `env` directly across frontend and backend code.

### Framework integration

- **Vite** (`@arkenv/vite-plugin`): Plugin operates in transform mode, rewriting imports from `env.ts` in the client graph to inline public `VITE_*` literals and replacing private server keys with throwing runtime guards.
- **Bun** (`@arkenv/bun-plugin`): Plugin intercepts `env.ts` imports in `Bun.build` / `Bun.serve` to inline public `BUN_PUBLIC_*` values while guarding server secrets.
- **Next.js** (`@arkenv/nextjs`): Build-time and runtime validation with automatic client/server isolation proxy.
- **Nuxt** (`@arkenv/nuxt`): Nuxt module with Nitro boot validation and runtime proxy guard.
- **Node.js**: Direct boot-time validation via `@arkenv/core` or `@arkenv/standard`.

### CLI (setup & DevOps)

- Initialize ArkEnv in new or existing projects using `pnpm dlx arkenv init` (or `npx arkenv init`).
- Automatically detect frameworks (`Next.js`, `Nuxt`, `Vite`, `Bun`, etc.) and scaffold `env.ts`.
- Select hosting provider preset during init (`--preset, -P <provider>` or `--host-preset, -H <provider>`).
- Automatically configure `tsconfig.json` when needed. Schema discovery for CLI commands uses `--schema` or convention paths (`env.ts`, `src/env.ts`, …) — not a `package.json` `"arkenv"` field.

### Hosting presets

ArkEnv is **code-first**. You can select a hosting provider preset during initial project setup (`--preset vercel`, `netlify`, `cloudflare`, `railway`, `render`, `fly`) or copy-paste provider fields directly into `./env.ts` from the documentation (`/docs/core-concepts/hosting-presets`). There are no machine-managed comment blocks or CLI mutation commands.

### Agent setup (machine-readable)

AI agents SHOULD always use the CLI for project initialization to ensure consistency and reliability. Use the `--agent` flag for a fully automated, machine-readable experience.

- **Command**: `pnpm dlx arkenv init --agent`
- **Behavior**: The `--agent` flag automatically enables the following behaviors:
  - **`--yes`**: Bypasses all interactive prompts and uses recommended defaults.
  - **`--quiet`**: Suppresses spinners and ANSI formatting for cleaner terminal logs.
  - **`--json`**: Emits a structured JSON summary to `stdout` upon completion (all other output is sent to `stderr`).
- **Success Verification**: Parse the JSON settlement envelope on `stdout`. Success is `ok: true` with `commandId: "init"`; details (e.g. scaffolded paths) live under `result`.

#### Handling refusals (`ok: false`)

`--agent` **never** implies `--force`. When a safety check trips, the CLI refuses and emits an errored settlement envelope to `stdout`:

```json
{
  "ok": false,
  "commandId": "init",
  "error": {
    "code": "CLI.GIT_TREE_DIRTY",
    "severity": "error",
    "summary": "Git working tree is not clean.",
    "why": "Commit or stash your changes before running arkenv init.",
    "nextActions": [
      {
        "kind": "run-command",
        "label": "Re-run with --force to bypass git working tree check",
        "command": "arkenv init --force"
      }
    ]
  },
  "diagnostics": [],
  "nextActions": [
    {
      "kind": "run-command",
      "label": "Re-run with --force to bypass git working tree check",
      "command": "arkenv init --force"
    }
  ]
}
```

- **`error.code`**: a stable dotted identifier you can branch on (`CLI.REQUIREMENTS_NOT_MET`, `CLI.GIT_TREE_DIRTY`, `CLI.NON_EMPTY_DIR`, …). `CLI.INTERNAL_ERROR` means the CLI _broke_ rather than _refused_ — retrying with flags will not help.
- **`nextActions`**: remediation steps. A `run-command` action that includes `--force` means the refusal is bypassable; empty `nextActions` means it is not. Prefer `nextActions` over any legacy `retryWith` field.

**Escalation pattern**: always run `init --agent` **without** `--force` first. If you get `ok: false`, inspect `error.code` and `nextActions`. Only re-run with `--force` (or the command from a `run-command` action) once you have deliberately decided the refusal is safe to bypass — do not add `--force` pre-emptively.

---

## CLI commands

### `init`

Set up ArkEnv in your project. It detects your framework and configures the appropriate plugin and schema.

```bash
pnpm dlx arkenv init [options]
```

#### Options:

- `--preset, -P <preset>`: Specify hosting provider preset (none, vercel, netlify, cloudflare, railway, render, fly).
- `--no-codegen`: Disable Next.js codegen configuration setup.
- `--force, -f`: Bypass clean git working tree safety check.

### `check`

Validate the environment against your schema file.

```bash
pnpm arkenv check [options]
```

#### Options:

- `--schema, -s <path>`: Explicit path to the schema module (overrides convention discovery).
- `--verify-example [file]`: Verify that all declared schema keys are present in `.env.example` (or a custom example file path) without mutating files.
- `--env-file <path>`: Specify one or more custom environment files to load.
- `--json`: Output structured JSON diagnostics to stdout.

---

## Defining Schemas & Importing `env`

### `@arkenv/core` (ArkType DSL)

```ts title="src/env.ts"
import arkenv from "@arkenv/core";

export const env = arkenv({
  PORT: "number.port = 3000",
  DATABASE_URL: "string",
  VITE_API_URL: "string",
  NODE_ENV: "'development' | 'production' | 'test' = 'development'",
});
```

### `@arkenv/standard` (Standard Schema: Zod, Valibot)

```ts title="src/env.ts"
import arkenv from "@arkenv/standard";
import * as z from "zod";

export const env = arkenv({
  PORT: z.number().default(3000),
  DATABASE_URL: z.string(),
  VITE_API_URL: z.url(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});
```

Valibot uses the `/valibot` subpath (install `@valibot/to-json-schema` as well):

```ts title="src/env.ts"
import { arkenv } from "@arkenv/standard/valibot";
import * as v from "valibot";

export const env = arkenv({
  PORT: v.optional(v.number(), 3000),
  DATABASE_URL: v.pipe(v.string(), v.url()),
});
```

### Consuming `env` in Application Code

Always import and read properties directly from the canonical `env` object:

```tsx title="src/App.tsx"
import { env } from "./env";

export default function App() {
  const apiUrl = env.VITE_API_URL; // string
  return <div>API URL: {apiUrl}</div>;
}
```

---

## Framework Setup Patterns

### 1. Vite (`@arkenv/vite-plugin`)

Register the plugin in `vite.config.ts` without schema arguments:

```ts title="vite.config.ts"
import { defineConfig } from "vite";
import arkenv from "@arkenv/vite-plugin";

export default defineConfig({
  plugins: [arkenv()],
});
```

If you need environment variables inside `vite.config.ts` itself (e.g. `server.port`), validate them with `loadEnv`:

```ts title="vite.config.ts"
import { defineConfig, loadEnv } from "vite";
import arkenvPlugin from "@arkenv/vite-plugin";
import arkenv, { type } from "@arkenv/core";

export const Env = type({
  PORT: "number.port = 5173",
  VITE_API_URL: "string",
});

export default defineConfig(({ mode }) => {
  const env = arkenv(Env, { env: loadEnv(mode, process.cwd(), "") });
  return {
    plugins: [arkenvPlugin()],
    server: { port: env.PORT },
  };
});
```

### 2. Bun (`@arkenv/bun-plugin`)

In `bunfig.toml`:

```toml
[serve.static]
plugins = ["@arkenv/bun-plugin"]
```

In `Bun.build`:

```ts
import arkenv from "@arkenv/bun-plugin";

await Bun.build({
  entrypoints: ["./src/index.tsx"],
  outdir: "./dist",
  plugins: [arkenv()],
});
```

---

## Security Boundaries & Layouts

- **Flat layout (default)**: `src/env.ts` contains all keys. Server graph runs full validation at boot; client graph receives inlined public literals while access to private server keys throws a runtime error.
- **Optional two-module recipe**: When secret names/types must stay off the client type graph, use two modules (client + server) with two imports and optional `extends: [clientEnv]`. Next can use `import "server-only"` + `@arkenv/core` for the server module. Nuxt: never import the server module from client code. Not a CLI `--strict` flag or package `/client` `/server` surface.

---

## Best Practices & Rules

1. **Always use `import { env } from "./env"`**: Never use `import.meta.env` or `process.env` directly for application environment variables in v1.
2. **Never create ambient `.d.ts` augmentations**: `ImportMetaEnvAugmented` and `ProcessEnvAugmented` are legacy v0 patterns dropped in v1.
3. **Keep secrets on the server**: Never prefix server secrets (`DATABASE_URL`, `API_SECRET_KEY`) with client prefixes (`VITE_`, `NEXT_PUBLIC_`, `BUN_PUBLIC_`, `NUXT_PUBLIC_`).
