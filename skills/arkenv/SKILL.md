---
name: arkenv
description: "Answer questions about ArkEnv and help implement environment variable validation. Use when developers: (1) Ask about environment variable validation or typesafety, (2) Want to setup ArkEnv in a project, (3) Need to define or update schemas using ArkType or Standard Schema, (4) Are integrating with Vite, Bun, or other runtimes. Triggers on: 'ArkEnv', 'env validation', 'typesafe env', 'createEnv', 'env.ts', '@arkenv/cli'."
---

# ArkEnv

ArkEnv is a typesafe environment variable validator for modern JavaScript runtimes. It uses `ArkType` by default for schema definition but supports any `Standard Schema` validator (like `Zod` or `Valibot`).

## Capabilities

### Core usage

- Define typesafe schemas using `ArkType` notation or any `Standard Schema` validator.
- Implement complex types, arrays, and unions.
- Configure automatic coercion and default values.
- Follow best practices for schema organization.

### Framework integration

- **Next.js**: Build-time/runtime validation and `process.env` type augmentation via `@arkenv/nextjs`. Supports automatic codegen (`env.gen.ts`) using the `withArkEnv` configuration wrapper in `next.config.ts`.
- **Vite**: Build-time validation and `import.meta.env` type augmentation via `@arkenv/vite-plugin`.
- **Bun**: Build-time/Runtime validation and `process.env` type augmentation via `@arkenv/bun-plugin`.
- **Node.js**: Standard `process.env` validation and coercion.

### CLI (setup & DevOps)

- Initialize ArkEnv in new or existing projects using `pnpm dlx @arkenv/cli@latest init`.
- Scaffold schema files and detect framework-specific configurations (`Next.js`, `Vite`, `Bun`, etc.).
- Support layout selection (`--strict` for 3-file split vs `--simple` for a single file).
- Support option to skip codegen (`--no-codegen`).
- Automatically configure `tsconfig.json` and environment types for optimal typesafety.

### Agent setup (machine-readable)

AI agents SHOULD always use the CLI for project initialization to ensure consistency and reliability. Use the `--agent` flag for a fully automated, machine-readable experience.

- **Command**: `pnpm dlx @arkenv/cli@latest init --agent`
- **Behavior**: The `--agent` flag automatically enables the following behaviors:
  - **`--yes`**: Bypasses all interactive prompts and uses recommended defaults.
  - **`--quiet`**: Suppresses spinners and ANSI formatting for cleaner terminal logs.
  - **`--json`**: Emits a structured JSON summary to `stdout` upon completion (all other output is sent to `stderr`).
- **Success Verification**: Parse the JSON output to verify `status: "success"` and retrieve details like the scaffolded file path.

#### Handling refusals (`status: "error"`)

`--agent` **never** implies `--force`. When a safety check trips, the CLI refuses and emits a machine-actionable JSON payload to `stdout`:

```json
{
  "status": "error",
  "code": "GIT_TREE_DIRTY",
  "message": "Git working tree is not clean.",
  "retryWith": ["--force"]
}
```

- **`code`**: a stable identifier you can branch on. Refusal codes: `REQUIREMENTS_NOT_MET`, `GIT_TREE_DIRTY`, `NON_EMPTY_DIR`. A `code` of `INTERNAL` means the CLI *broke* rather than *refused* - retrying with flags will not help.
- **`retryWith`**: the flag(s) that would bypass the check (e.g. `["--force"]`). Empty (`[]`) means the refusal is not bypassable.

**Escalation pattern**: always run `init --agent` **without** `--force` first. If you get `status: "error"`, inspect `code` and `retryWith`. Only re-run with the flag(s) from `retryWith` (e.g. append `--force`) once you have deliberately decided the refusal is safe to bypass - do not add `--force` pre-emptively.

## Operational logic

1. **Detection**:
   - Look for `env.ts` (simple layout) or an `env/` directory containing split files: `env/client.ts`, `env/server.ts`, and `env/internal/shared.ts` (strict layout).
   - Check for framework config files (`next.config.ts`, `next.config.js`, `vite.config.ts`, `bunfig.toml`, `package.json` scripts) to recommend appropriate plugins.
2. **Setup**:
   - If ArkEnv is not present or a fresh setup is requested, trigger the **Setup Workflow**.
   - Prefer using the CLI for initialization: `pnpm dlx @arkenv/cli@latest init`.
   - If the CLI cannot be used or fails, fall back to manual configuration.

## Setup workflow

When setting up ArkEnv, follow these steps:

1. **Initialize**: Run `pnpm dlx @arkenv/cli@latest init --agent` (optionally appending `--strict` or `--simple` based on layout preference). This will detect the environment, install dependencies, and scaffold schemas.
2. **Review & Refine Schemas**:
   - **Simple Layout**: Inspect and refine the generated `env.ts`. Ensure it captures the required environment variables.
   - **Strict Layout**: Inspect and refine the generated files under the `env/` directory: `client.ts` (client-only variables), `server.ts` (server-only variables), and `internal/shared.ts` (variables shared between client and server).
   - Refine types (e.g., change `string` to `number.port` or specific union types).
3. **Manual Plugin Configuration**:
   - The CLI installs plugins but might not update config files.
   - **Next.js**: Wrap `next.config.ts` (or `next.config.js`) using the `withArkEnv` configuration helper from `@arkenv/nextjs/config`. (Skip if scaffolded with `--no-codegen`).
   - **Vite**: Update `vite.config.ts` to import and include the `@arkenv/vite-plugin` plugin.
   - **Bun**: Configure `bunfig.toml` or add the plugin to the runtime if necessary.
4. **Typesafety & Augmentation**:
   - **Next.js (Codegen)**: Import `createEnv` from `./generated/env.gen` instead of core `@arkenv/nextjs`. The codegen file automatically handles the runtime mapping and type definitions.
   - **Vite**: Add type augmentation to `src/vite-env.d.ts` or a new `env.d.ts`.
     ```ts
     interface ImportMetaEnv extends import("@arkenv/vite-plugin").ImportMetaEnvAugmented<typeof import("./env").Env> {}
     ```
   - **Bun**: Create a `bun-env.d.ts` file (or update an existing one) with the following pattern:
     ```ts
     /// <reference types="bun-types" />
     type ProcessEnvAugmented = import("@arkenv/bun-plugin").ProcessEnvAugmented<typeof import("./src/env").default>;
     declare namespace NodeJS {
       interface ProcessEnv extends ProcessEnvAugmented {}
     }
     ```
   - Ensure `tsconfig.json` has `strict: true` (the CLI tries to do this, but verify).
5. **Usage Update**: Scan the codebase for existing environment variable usage (`process.env` or `import.meta.env`) and ensure they are now typesafe via the augmentations.
6. **Validation**: Run `pnpm check` (or equivalent) or a build to confirm everything is typesafe and valid.

## Core concepts

### Defining a schema

#### Simple Layout

The best practice is to export a schema definition using `type`.

```ts
import { type } from 'arkenv';

export const Env = type({
  NODE_ENV: "'development' | 'production' | 'test' = 'development'",
  VITE_API_URL: "string",
  PORT: "number.port = 3000"
});
```

#### Strict Layout (split-file)

Split files isolate environment variable definitions to prevent server secrets from leaking to client-side.

- **`env/internal/shared.ts`** (Shared):
  ```ts
  import { type } from "arkenv";
  export const SharedSchema = type({
    NODE_ENV: "'development' | 'production' | 'test' = 'development'",
  });
  ```
- **`env/client.ts`** (Client-side, prefixed with `NEXT_PUBLIC_` for Next.js):
  ```ts
  import arkenv from "./internal/shared";
  export const env = arkenv({
    NEXT_PUBLIC_API_URL: "string",
  });
  ```
- **`env/server.ts`** (Server-side):
  ```ts
  import arkenv from "./client";
  export const env = arkenv({
    DATABASE_URL: "string",
  });
  export default env;
  ```

### Usage: Next.js (with Codegen)

Wrap `next.config.ts` to enable automatic `env.gen.ts` generation:

```ts
import { withArkEnv } from "@arkenv/nextjs/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default withArkEnv(nextConfig);
```

Then import and use the generated `env` object:

```ts
import env from "./env/generated/env.gen"; // For strict layout baseDir
// or import env from "./generated/env.gen"; for simple layout
```

### Usage: Node.js (standard)

In Node.js, you validate the environment at runtime and export the result.

```ts
import arkenv from 'arkenv';
import { Env } from './env';

export const env = arkenv(Env);

// Usage
const port = env.PORT; // typed as number
```

### Usage: Vite (frontend)

Vite requires build-time injection. Use the plugin in `vite.config.ts` and augment `ImportMetaEnv`.

```ts
// vite.config.ts
import arkenv from '@arkenv/vite-plugin';
import { Env } from './env';

export default defineConfig({
  plugins: [arkenv(Env)]
});
```

```ts
// src/vite-env.d.ts
import type { ImportMetaEnvAugmented } from "@arkenv/vite-plugin";
import type { Env } from "../env";

interface ImportMetaEnv extends ImportMetaEnvAugmented<typeof Env> {}
```

### Usage: Bun

Bun can use either runtime validation or a plugin for type augmentation.

```ts
// src/env.d.ts
import type { ProcessEnvAugmented } from "@arkenv/bun-plugin";
import type { Env } from "./env";

declare global {
  namespace NodeJS {
    interface ProcessEnv extends ProcessEnvAugmented<typeof Env> {}
  }
}
```

## CLI commands

### `init`

Set up ArkEnv in your project. It detects your framework and configures the appropriate plugin and type augmentations.

```bash
pnpm dlx @arkenv/cli@latest init [options]
```

#### Options:

- `--strict`: Use strict 3-file split layout.
- `--simple`: Use simple 1-file layout (default).
- `--no-codegen`: Disable Next.js codegen/`withArkEnv` configuration setup.

## Best practices

1. **Prefer Native Primitives**: To leverage the full power of ArkEnv plugins, you should access environment variables through the runtime's native primitives.
   - **Vite**: Use `import.meta.env`.
   - **Bun**: Use `process.env`.
   - This ensures that build-time validation, static replacement (Vite), and runtime optimizations (Bun) work as intended while remaining fully typesafe via type augmentation.
2. **Avoid `import { env }` in Plugin-managed Projects**: In projects using `@arkenv/vite-plugin` or `@arkenv/bun-plugin`, you should generally avoid importing a runtime-validated `env` object. Using native primitives is the "cleanest" way to get typesafety and ensures consistency with framework-specific behavior.
3. **Use Codegen in Next.js**: For Next.js projects, prefer using the `withArkEnv` wrapper and importing `createEnv` / `env` from the generated `generated/env.gen.ts` file. This automates the destructuring of `runtimeEnv` to allow static inlining on the client side without leaking secrets.
4. **Commit Generated Code for CI/CD**: Commit `generated/env.gen.ts` to source control to ensure compatibility with CI/CD pipelines.
5. **Use Type Augmentation**: This is the recommended way to make `import.meta.env` or `process.env` typesafe. It connects your schema definition to the native primitives without adding runtime overhead to your application logic.
6. **Re-use Schema**: Define your schema once and use it for both the plugin (build-time/config) and runtime validation if needed.
7. **Coercion**: ArkEnv automatically coerces strings from `.env` files (e.g., `"3000"` becomes `3000`).
