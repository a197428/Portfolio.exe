# Portfolio.exe agent guide

## Product intent

Portfolio.exe is a bilingual interactive portfolio for AI Developer and Frontend Developer
roles. The product must demonstrate skill through its behavior and finish, not through inflated
claims. The central future experience is a grounded AI persona that answers questions about the
owner's verified experience and matches vacancy descriptions to relevant evidence.

## Current phase

The repository currently contains the foundation and design system only. Do not imply that chat,
RAG, code generation, vacancy matching, or embedded project demos are implemented. Decisions
marked `Deferred` in `docs/decisions.md` must remain open until the owner supplies the required
inputs.

## Stack and boundaries

- React 19, Vite, TypeScript strict, React Router.
- Tailwind CSS v4 with liquid-glass tokens in `src/styles.css`.
- Kokonut UI components are installed as source through the shadcn registry and customized in
  place. Check the official component before inventing an equivalent.
- Anime.js owns custom animation orchestration. Motion is allowed only where an imported Kokonut
  component already needs it.
- TanStack Query owns remote state; Zustand owns small persistent UI preferences. Do not duplicate
  server data in Zustand.
- The Cloudflare Worker owns `/api/*`; the React SPA owns page routes.
- User-visible copy belongs in i18next resources. Russian and English must stay feature-equivalent.
- Verified portfolio knowledge belongs in Markdown under `content/` and must distinguish facts
  from model-generated interpretation.

## Commands

- `npm run dev` — local React + Worker development.
- `npm run verify` — formatting, lint, typecheck, unit tests, and production build.
- `npm run test:e2e` — Playwright smoke tests.
- `npm run deploy` — verified production build and Cloudflare deployment.

## Engineering rules

- Preserve accessibility, keyboard behavior, responsive layout, and `prefers-reduced-motion`.
- Scope Anime.js work to a React ref and call `revert()` during cleanup.
- Validate API inputs and outputs with Zod at trust boundaries.
- Never expose provider keys to client code or commit `.dev.vars`.
- Add tests for changed behavior and update documentation when an architectural decision changes.
- Run `npm run verify` before handing off a change.

## Git workflow

- `dev` is the integration branch for implementation, verification, and testing.
- `main` contains only release-ready work promoted from a verified `dev` branch.
- Start feature work from an up-to-date `dev`; use focused commits with descriptive messages.
- Before promoting to `main`, run `npm run verify` and `npm run test:e2e` on `dev`.
- Merge `dev` into `main` without rewriting published history. Never force-push either shared branch.
- Push work-in-progress only to `dev` or a short-lived feature branch, never directly to `main`.
