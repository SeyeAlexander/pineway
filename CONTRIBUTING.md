# Getting Started

This is a [Next.js 15](https://nextjs.org) app (App Router) backed by [Supabase](https://supabase.com) (Postgres + auth), [Drizzle ORM](https://orm.drizzle.team), and [Hono](https://hono.dev) for API routing.

## Prerequisites

1. **Node.js and Corepack**: Make sure you have Node.js installed. This project uses corepack for package management. If you are on a recent LTS release of Node, corepack should be installed already. If not, please install it first with npm.

```bash
# Install corepack (if not already installed)
npm install --global corepack@latest
```

```bash
# Enable corepack
corepack enable

# Install the configured package manager (pnpm)
corepack install
```

2. **Dependencies**: Install project dependencies using pnpm:

```bash
pnpm install
```

> If you encounter post-install script security errors, approve the scripts first:
>
> ```bash
> pnpm approve-builds
> pnpm install
> ```

3. **Docker**: The local Supabase stack runs in Docker. Make sure [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine on Linux) is installed and running before starting the local database.

## Local Supabase Setup

The project includes a Supabase configuration for local development. This spins up a full Supabase stack locally.

### Start the local stack

```bash
pnpm supabase start
```

The first run will pull Docker images, which may take a few minutes. Once running, the CLI will print your local credentials.

### Configure environment variables

Copy `.env.example` to `.env` and fill in the values using the output from `pnpm supabase start`:

```bash
cp .env.example .env
```

| Variable | Value (local) |
|---|---|
| `DATABASE_URL` | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` |
| `NEXT_PUBLIC_SUPABASE_URL` | `http://127.0.0.1:54321` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | The `anon key` from `supabase start` output |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` |

### Apply migrations

```bash
pnpm supabase migration up
```

This applies all migrations in `supabase/migrations/` to the local database.

### Local services

| Service | URL |
|---|---|
| App | http://localhost:3000 |
| Supabase Studio | http://127.0.0.1:54323 |
| Email inbox (Inbucket) | http://127.0.0.1:54324 |

### Stop the local stack

```bash
pnpm supabase stop
```

## Running the Dev Server

```bash
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (auth)/             # Login and sign-up pages
│   ├── app/                # Authenticated dashboard
│   ├── actions/            # API layer (Hono routes + services)
│   │   ├── [[...routes]]/  # Single catch-all route entry point
│   │   └── {domain}/       # Domain-specific routes and services
│   └── query-client-provider/
├── components/ui/          # Shared UI primitives (Radix + Tailwind)
└── lib/                    # Utilities, HTTP client, result helpers
db/
├── index.ts                # Drizzle client
└── schema/                 # Table definitions
```

## Frontend Development

### Styling

This project uses **Tailwind v4** with a CSS-only configuration (no `tailwind.config.js`). All theme tokens are defined as CSS custom properties in `src/app/theme/`:

```
src/app/theme/
├── colors.css
├── typography.css
├── shadows.css
├── layout.css
└── animations.css
```

These are imported in `src/app/globals.css`, which also sets up the `@theme` block that maps CSS variables to Tailwind utilities.

Use `cn()` from `@/lib/utils` to merge Tailwind classes conditionally:

```typescript
import { cn } from '@/lib/utils';

<div className={cn('base-class', isActive && 'active-class')} />
```

### Component structure

Shared UI primitives live in `src/components/ui/`, organized one component per folder. Each folder contains the component file and its story:

```
src/components/ui/
├── button/
│   ├── button.tsx
│   └── button.stories.tsx
├── input/
│   ├── input.tsx
│   └── input.stories.tsx
└── ...
```

Components are built using shadcn with [Radix UI](https://www.radix-ui.com) primitives and styled with Tailwind. Default to React Server Components; add `'use client'` only when interactivity is needed.

### Developing with Storybook

Storybook is used to develop and review UI components in isolation, without needing the full app and auth flow.

```bash
pnpm storybook
```

The workshop runs at [http://localhost:6006](http://localhost:6006).

Stories use `@storybook/nextjs-vite` and are colocated with their component:

```typescript
// button.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";

const meta = {
  title: "ui/Button",
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { label: "Button" },
};
```

When adding a new component, create a story alongside it. Each story should cover the distinct visual states the component supports (variants, sizes, loading/error states, etc.).

## Key Patterns

### API layer

Routes live in `src/app/actions/{domain}/{domain}.routes.ts` and are registered in `src/app/actions/[[...routes]]/route.ts`. Business logic goes in `{domain}.service.ts` with a `'use server'` directive.

```typescript
// profile.service.ts
'use server';
import { success, failure } from '@/lib/result';

export async function getProfile(userId: string) {
  try {
    const profile = await db.query.profilesTable.findFirst(/* ... */);
    return success(profile);
  } catch (err) {
    return captureAndReturnError(err);
  }
}
```

Every service function returns `Result<T>` — `{ success: true; data: T }` or `{ success: false; error: AppError }`.

### HTTP client (frontend)

You should never import service functions directly on the frontend.

```typescript
// In a 'use client' component or React Query hook
import { httpClient } from '@/lib/http/client';
import { parseResponse } from 'hono/client';

const res = await httpClient.actions.profile.$get();
const data = await parseResponse(res);
```

### Database

Schema files live in `db/schema/{domain}.ts`. After any schema change:

1. Generate a new migration:
   ```bash
   pnpm db:generate
   ```
2. Apply it to the local database:
   ```bash
   pnpm supabase migration up
   ```

Never edit files in `supabase/migrations/` directly.

## Available Commands

```bash
pnpm dev                  # Next.js dev server (Turbopack) on port 3000
pnpm build                # Production build
pnpm lint                 # ESLint
pnpm storybook            # Component workshop on port 6006
pnpm db:generate          # Generate Drizzle migrations after schema changes
```
