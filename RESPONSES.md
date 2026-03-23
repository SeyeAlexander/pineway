# Responses

## Live URL

<!-- Replace with your deployed URL once deployed -->
> **TODO**: Deploy and paste URL here.

## Implementation Notes

### Architecture Decisions

**Server-first rendering.** The profile settings page (`/app`) is a React Server Component. It fetches the user's profile on the server and passes it as `initialProfile` to a Client Component (`ProfileSettingsForm`) that handles all interactivity. This gives us instant first paint with zero client-side loading spinners for the initial data.

**Public profiles are fully public.** The `[username]` route uses `dbWithoutRLS` to query profiles without requiring authentication. The middleware skips auth checks entirely for these routes, so unauthenticated visitors see profiles instantly.

**Result pattern throughout.** Every service function returns `Result<T>` — either `success(data)` or `failure({ code, message, userMessage })`. This keeps error handling explicit and avoids thrown exceptions leaking across the server/client boundary.

### What I Built

**Profile settings page** (`src/app/app/(home)/page.tsx`)
- Server Component that fetches profile data via `getUserProfile()` and renders `ProfileSettingsForm`
- Auto-provisions a profile if the user is authenticated but doesn't have one (handles edge case where email verification completes outside the app)
- Form validation with Zod: name format, username format (lowercase + numbers + underscores), bio/note character limits
- Avatar upload to Supabase Storage with a 5MB size limit
- Save button maintains fixed width, shows animated "Saving..." state with undulating dots

**Public profile page** (`src/app/[username]/page.tsx`)
- Displays name, username, avatar (with a violet gradient ring), and bio
- Handles both `/@username` and `/username` URL formats by stripping the leading `@`
- Shows a styled error state for missing profiles instead of a generic 404
- Authenticated users see a floating breadcrumb nav (bottom-right) with "Profile settings" and "Logout" actions
- Unauthenticated users clicking the Pineway logo are routed to the login page

**Email verification flow** (`src/app/auth/confirm/route.ts`)
- When a user signs up, they see a success toast prompting them to check their email
- Clicking the verification link hits `/auth/confirm`, which verifies the OTP, auto-creates the user's profile, and redirects to `/app`

**Username change cooldown**
- Added `username_updated_at` timestamp column to the profiles table
- Backend enforces a 14-day cooldown between username changes with a clear error message

### Schema Changes

Added two columns to the `profiles` table:
- `note` (text, nullable) — private freeform text field, only visible to the profile owner
- `username_updated_at` (timestamp, nullable) — tracks when the username was last changed for the 14-day cooldown

### Files Added/Modified

**New files:**
- `src/app/app/(home)/profile-settings-form.tsx` — Client Component for the profile form
- `src/app/app/(home)/loading.tsx` — Loading boundary with pulsing purple glow
- `src/app/[username]/loading.tsx` — Skeleton loader for public profiles
- `src/app/[username]/floating-header.tsx` — Authenticated user nav (logout, settings link)
- `src/app/auth/confirm/route.ts` — Email verification callback
- `src/app/loading.tsx` — Global loading boundary

**Modified files:**
- `src/app/app/(home)/page.tsx` — Converted to Server Component
- `src/app/app/(home)/hooks.ts` — Added `initialData` support to `useProfile`
- `src/app/[username]/page.tsx` — Built the public profile UI
- `src/app/(auth)/sign-up/SignUpForm.tsx` — Added email verification flow
- `src/app/actions/profile/profile.service.ts` — Added `createProfile`, username cooldown logic, email in profile response
- `src/components/ui/input/input.tsx` — Added static content (left addon) rendering
- `db/schema/profiles.ts` — Added `note` and `usernameUpdatedAt` columns
- `db/index.ts` — Fixed connection pooling for development (globalThis caching)
- `src/lib/result.ts` — Removed noisy `console.error` from `failure()`
