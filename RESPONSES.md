# Responses

## Live URL

https://pineway-zeta.vercel.app/

## Implementation Notes

### Approach

I tried to treat this as both an implementation exercise and a product exercise. The prompt was specific about the main flows, but there were a few places where the Figma, schema, and existing backend did not line up perfectly. In those cases, I chose the path that felt most consistent with the intended user experience and public profile model.

### Product / UX Decisions

**Sign-up and verification flow.** I reworked the sign-up confirmation experience to be more explicit and user-friendly. After sign-up, the user gets a clearer message to check their email for the confirmation link. When they click the link, `/auth/confirm` verifies the token, signs them in, ensures a profile exists, and sends them into the app. That avoids a dead-end verification experience and reduces friction right after registration.

**Name field added to the backend.** The Figma included a name field, but the backend did not yet support it and the written instructions did not explicitly call out adding it. I still added it because it is a valid profile field, and it improves the public profile experience by allowing a display name alongside the username-based URL.

**Bio included in the settings form.** `bio` already existed in the backend schema, but it was missing from the Figma form. I added it because it is meaningful profile data for the public `@username` page and felt like an intentional omission worth filling in rather than ignoring.

**Private note support.** I added the coach-only private note field end to end on the backend and exposed it in the authenticated settings form only, matching the prompt requirement and keeping it out of the public profile surface.

**Avatar upload guardrails.** I added a 5MB max size check before upload. That keeps the flow responsive, avoids avoidable storage/network failures, and gives the user immediate feedback.

**Public profile polish.** No Figma was provided for the public `@username` page, so I designed and implemented that surface from scratch. I added a more complete profile presentation, subtle visual treatment around the avatar, and small authenticated-context touches like a signed-in indicator, branding, and a direct way back to profile settings when the owner is viewing a public page.

**Feedback and motion.** I added light animation to the submit button, route loading states with `loading.tsx`, and adjusted toast spacing so it sits more cleanly above the bottom action area on the settings page. The goal there was polish without turning the UI into something noisy.

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
- Displays name, username, avatar, and bio
- Handles both `/@username` and `/username` URL formats by stripping the leading `@`
- Shows a custom error state for missing profiles instead of a generic 404
- Authenticated users see contextual navigation back to profile settings and logout
- Unauthenticated users clicking the Pineway logo are routed to the login page

**Email verification flow** (`src/app/auth/confirm/route.ts`)
- After sign-up, the user sees a clearer success message prompting them to check their email
- The verification link hits `/auth/confirm`, verifies the OTP, creates the user's profile if needed, signs them in, and redirects to `/app`

**Username change cooldown**
- Added `username_updated_at` timestamp column to the profiles table
- Backend enforces a 14-day cooldown between username changes with a clear error message

### Schema Changes

Added profile data to better support the intended UX:
- `name` (text, nullable) — added to support the display-name field shown in the Figma and used on the public profile
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
- `src/app/actions/profile/profile.service.ts` — Added `createProfile`, username cooldown logic, name/bio/note support, and email in profile response
- `src/components/ui/input/input.tsx` — Added static content (left addon) rendering
- `src/components/ui/toast/toast.tsx` — Improved wrapping/layout for longer toast content
- `db/schema/profiles.ts` — Added `name`, `note`, and `usernameUpdatedAt` columns
- `db/index.ts` — Fixed connection pooling for development (globalThis caching)
- `src/lib/result.ts` — Removed extra `console.error` noise from `failure()`
