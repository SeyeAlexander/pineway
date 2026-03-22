# Fullstack Engineer Hiring Project

Hello! This is a hiring project for our Fullstack Engineer role. If you apply, we'll ask you to do this project so we can see how you work through the type of work you'd do at Pineway.

## Hiring Project: Technical Challenge

Our customers are coaches. They prefer simplicity and expect things to always work. As such, we're building a system that should ideally not lead to too many support requests as that could be time spent working with their clients.

For this technical challenge, we want you to add a new page to our existing fullstack application.

### The Stack

Here's what you'll be working with:

- **Backend:** Hono routes (`src/app/actions/{domain}/{domain}.routes.ts`) + service functions (`{domain}.service.ts` with `'use server'`)
- **Database:** Drizzle ORM — all queries wrap in `rls(async (tx) => tx.transaction(...))`
- **Service pattern:** Every service function returns `Result<T>` using `success(data)` / `failure({ code, message })`
- **Frontend:** React Query hooks using `httpClient` (we never import services directly) with `parseResponse()` from `hono/client`

### What You Need to Build

The code is mostly ready to go. You are to implement this design [from Figma](https://www.figma.com/design/EIoExSAonXoWQXwYTCZKQI/Dev-test?node-id=917-472&m=dev) in the project. When you are done, we expect to be able to:

- Log in or create a new account
- View and update profile fields while authenticated
  - Coaches should be able to save a private note on their own profile. This is just a freeform text field, only visible to the owner. You'll need to add support for the profile note field on the backend
- View public user profiles on your-deployed-url/@username
  - This just needs to display a user's public profile details to unauthenticated users.

## What We Care About

We get that you have a life outside of work, so we've scoped this to roughly 4 hours. What we're looking for is:

* **TypeScript & React fluency**: You write clean, idiomatic TypeScript and have strong React instincts. Types aren't an afterthought.
* **Full-stack ownership**: You can move across the stack: wire up a Hono route, write a Drizzle query, and connect it to a polished frontend without getting stuck at any layer.
* **UI polish**: You care about the details. A working feature and a good feature are different things, and you know the difference.
* **Code clarity**: Your code is easy to read and follow. We value simplicity over cleverness.
* **Bias toward action**: You figure things out and move. You don't wait for perfect specs or hand-holding.

## Getting Set Up

See [CONTRIBUTING.md](CONTRIBUTING.md) for instructions on installing dependencies, configuring environment variables, and running the app locally.

## Deployment

Deploy your application before submitting. You can use any hosting provider (Vercel, Railway, Fly.io, etc.) paired with a hosted Supabase instance. Include the live URL in your [RESPONSES.md](RESPONSES.md).

## Submitting Your Work

We'll invite you to a GitHub repo based on this template.

Do all of your work in the `main` branch. Don't bother with PRs, branches, or spend time on tidy commits — we have software to help us review. Just don't force push over the initial commit or we can't generate a diff of only your work.

Add your written responses and any notes about your implementation in [RESPONSES.md](RESPONSES.md).

When you're ready, let us know and we'll schedule it for review.

We review submissions as soon as we receive them. You'll hear back from us no matter in no more than 48 hours.
