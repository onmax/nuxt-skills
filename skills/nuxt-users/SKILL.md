---
name: nuxt-users
description: Configure and use the nuxt-users module for Nuxt 3 and Nuxt 4. Use when adding authentication, user management, roles, password reset, database setup (SQLite/MySQL/PostgreSQL), or CLI commands (migrate, create-user). Covers nuxt.config (nuxtUsers), composables (useAuthentication, useUsers, usePublicPaths, usePasswordValidation, useNuxtUsersLocale), components (NUsersLoginForm, NUsersLogoutLink, etc.), and authorization (whitelist, permissions).
license: MIT
metadata:
  author: rrd108
  version: "1.0"
---

# Nuxt Users skill

## Initial setup

1. **Install the module and peer dependencies**
   ```bash
   npm install nuxt-users
   npm install db0 better-sqlite3 bcrypt nodemailer
   ```
   For MySQL or PostgreSQL, install the corresponding driver (`mysql2` or `pg`) instead of or in addition to `better-sqlite3` as required.

2. **Register the module in `nuxt.config.ts`**
   ```ts
   export default defineNuxtConfig({
     modules: ['nuxt-users']
   })
   ```

3. **Run migrations**
   From the project root (where `nuxt.config.ts` lives):
   ```bash
   npx nuxt-users migrate
   ```

4. **Create at least one user**
   ```bash
   npx nuxt-users create-user -e admin@example.com -n "Admin User" -p password123 -r admin
   ```
   Flags: `-e` email, `-n` name, `-p` password, `-r` role (optional).

5. **Configure permissions**
   ```ts
   export default defineNuxtConfig({
     modules: ['nuxt-users'],
     nuxtUsers: {
       auth: {
         permissions: {
           admin: ['*'],
           user: ['/profile', '/api/nuxt-users/me']
         }
       }
     }
   })
   ```

6. **Use login in a page**
   - Use the `NUsersLoginForm` component and handle `@success` by calling `login(user)` from `useAuthentication()`.
   - Optionally redirect after login (e.g. `navigateTo('/')`).

## Configuration reference (nuxt.config.ts)

All options live under `nuxtUsers` in `nuxt.config.ts`.

| Area | Key | Notes |
|------|-----|--------|
| Database | `connector.name` | `'sqlite' \| 'mysql' \| 'postgresql'` |
| Database | `connector.options` | `path` (SQLite), or `host`, `port`, `user`, `password`, `database` (MySQL/PostgreSQL) |
| API | `apiBasePath` | Default `'/api/nuxt-users'` |
| Tables | `tables.users`, `tables.personalAccessTokens`, `tables.passwordResetTokens`, `tables.migrations` | Custom table names |
| Mailer | `mailer` | Nodemailer config for password reset emails |
| URLs | `passwordResetUrl`, `emailConfirmationUrl` | Paths for redirects |
| Auth | `auth.whitelist` | Public routes (e.g. `['/register']`); `/login` is always public |
| Auth | `auth.tokenExpiration` | Minutes (default 1440) |
| Auth | `auth.rememberMeExpiration` | Days (default 30) |
| Auth | `auth.permissions` | Role → paths (e.g. `admin: ['*']`, `user: ['/profile']`) |
| Auth | `auth.google` | Google OAuth: `clientId`, `clientSecret`, `callbackUrl`, etc. |
| Password | `passwordValidation` | `minLength`, `requireUppercase`, `requireLowercase`, `requireNumbers`, `requireSpecialChars`, `preventCommonPasswords` |
| Data | `hardDelete` | `true` = hard delete, `false` = soft delete (default) |
| Locale | `locale.default`, `locale.texts`, `locale.fallbackLocale` | Localization |

Runtime config is also supported: use `runtimeConfig.nuxtUsers` for env-based or server-only settings.

## CLI commands

Run from the project root so `nuxt.config.ts` (and optionally `.env`) are found.

- **Migrations**
  ```bash
  npx nuxt-users migrate
  ```

- **Create user**
  ```bash
  npx nuxt-users create-user -e <email> -n "<name>" -p <password> [-r <role>]
  ```

- **Legacy/table creation**
  ```bash
  npx nuxt-users create-users-table
  npx nuxt-users create-personal-access-tokens-table
  npx nuxt-users create-password-reset-tokens-table
  npx nuxt-users create-migrations-table
  ```

> **Production:** The CLI requires `nuxt-users` (and peers) installed where Node runs — it is not bundled inside `.output/`. Full config needs the app root with `nuxt.config`; build-only or `--omit=dev` deploys fall back to `DB_*` env vars. See `docs/user-guide/configuration.md`.

## Composables (auto-imported)

- **useAuthentication()** — `user`, `isAuthenticated`, `login(user, rememberMe?)`, `logout()`, `fetchUser(useSSR?)`, `initializeUser()`
- **useUsers()** — Admin: `users`, `pagination`, `loading`, `error`, `fetchUsers(page?, limit?)`, `updateUser`, `addUser`, `removeUser(userId)`
- **usePublicPaths()** — `getPublicPaths()`, `getAccessiblePaths()`, `isPublicPath(path)`, `isAccessiblePath(path, method?)`
- **usePasswordValidation(moduleOptions?, options?)** — `validate(password)`, `isValid`, `errors`, `strength`, `score`, `clearValidation()`
- **useNuxtUsersLocale()** — `t(key, params?)`, `currentLocale`, `fallbackLocale`

## Components

- `NUsersLoginForm` — Login form; use `@success` to call `login(user)` from `useAuthentication()`
- `NUsersLogoutLink` — Logout link/button
- `NUsersProfileInfo` — Display profile
- `NUsersResetPasswordForm` — Password reset form
- `NUsersList` — List users (admin)
- `NUsersUserForm` — Create/edit user form

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Redirected to login on protected routes | Set `auth.permissions` so each role has access to needed routes |
| CLI config not found / wrong tables | Run CLI from the directory containing `nuxt.config`; see production note above |
| Migrations table missing | Run `npx nuxt-users migrate` from project root |
| Database driver errors | Install correct peer: SQLite → `better-sqlite3`, MySQL → `mysql2`, PostgreSQL → `pg` |

## File references

- Project LLM context and config types: [llms.txt](../../llms.txt) in the repo root
- Full docs: [https://nuxt-users.webmania.cc/](https://nuxt-users.webmania.cc/)
- Getting started and examples: `../../docs/user-guide/getting-started.md`, `../../docs/examples/basic-setup.md`
- Authorization: `../../docs/user-guide/authorization.md`
- Configuration details: `../../docs/user-guide/configuration.md`

Keep `nuxtUsers` config and permissions in sync with the app’s roles and routes; use guard clauses and early returns when implementing custom auth logic.
