# Responses

## Live URL

https://pineway-zeta.vercel.app/

## Implementation Notes

### Architecture Decisions

**Server-first rendering.** The profile settings page (`/app`) is a React Server Component. It fetches the user's profile on the server and passes it to `ProfileSettingsForm`, which handles the interactive parts on the client. This keeps the initial load fast and avoids a client-side loading state for the first render.

**Public profiles are fully public.** The `[username]` route uses `dbWithoutRLS` to load public profile data without requiring authentication. Middleware skips auth checks for these routes, so unauthenticated visitors can load them directly.

**Result pattern throughout.** Service functions return `Result<T>` using either `success(data)` or `failure({ code, message, userMessage })`. That keeps error handling explicit and avoids exceptions leaking across the server/client boundary.

### What I Built

**Profile settings page** (`src/app/app/(home)/page.tsx`)
- Server Component that fetches profile data via `getUserProfile()` and renders `ProfileSettingsForm`
- Auto-creates a profile if the user is authenticated but does not have one yet
- Form validation with Zod for name format, username format, and bio/note character limits
- Avatar upload to Supabase Storage with a 5MB size limit
- Save button keeps a fixed width and shows an animated "Saving..." state

**Public profile page** (`src/app/[username]/page.tsx`)
- Displays name, username, avatar (with a violet gradient ring), and bio
- Handles both `/@username` and `/username` URL formats by stripping the leading `@`
- Shows a custom error state for missing profiles instead of a generic 404
- Authenticated users see a floating breadcrumb nav (bottom-right) with "Profile settings" and "Logout" actions
- Unauthenticated users clicking the Pineway logo are routed to the login page

**Email verification flow** (`src/app/auth/confirm/route.ts`)
- After sign-up, the user sees a success toast prompting them to check their email
- The verification link hits `/auth/confirm`, verifies the OTP, creates the user's profile if needed, and redirects to `/app`

**Username change cooldown**
- Added `username_updated_at` timestamp column to the profiles table
- Backend enforces a 14-day cooldown between username changes with a clear error message

### Schema Changes

Added two columns to the `profiles` table:
- `note` (text, nullable) — private freeform text field, only visible to the profile owner
- `username_updated_at` (timestamp, nullable) — tracks the last username change for the 14-day cooldown

### Files Added/Modified

**New files:**
- `src/app/app/(home)/profile-settings-form.tsx` — Client Component for the profile form
- `src/app/app/(home)/loading.tsx` — Loading boundary for the profile settings page
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
- `src/lib/result.ts` — Removed extra `console.error` noise from `failure()`
