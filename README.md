# Portfolio.exe

A bilingual, interactive portfolio for AI Developer and Frontend Developer roles. It combines a
React/Cloudflare experience with role-aware verified content and Bob, an evidence-grounded AI
representative for candidate questions and vacancy analysis.

Share a specific lens with `/?role=frontend` (Frontend-vacancy outreach) or `/?role=ai`
(AI-vacancy outreach). A valid `role` query always wins over the saved preference; the page falls
back to the saved role (or `ai`) when the value is missing or invalid.

## Local development

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the URL printed by Vite. The health endpoint is available at `/api/health`.

Verified portfolio knowledge lives in `content/profile`, `content/resume`, `content/facts`, and
`content/projects`. Run
`npm run content:build` after editing Markdown; normal development and build commands run this
validation automatically.

## Quality checks

```bash
npm run verify
npx playwright install chromium
npm run test:e2e
```

## Deployment

Authenticate Wrangler, choose a unique Worker name in `wrangler.jsonc`, then run:

```bash
npm run deploy
```

Secrets must be stored with Wrangler and never added to `.dev.vars` in Git.
Bob uses `OPENROUTER_API_KEY` as the primary generator and `ROUTERAI_API_KEY` as the
secondary generator. Configure both as Wrangler secrets in production.

## Git workflow

Development and testing happen on `dev`. Release-ready changes are promoted from `dev` to
`main` only after both quality gates pass:

```bash
npm run verify
npm run test:e2e
```

Do not force-push shared branches or commit work directly to `main`.

## Project context

- [Product definition](docs/product.md)
- [Architecture](docs/architecture.md)
- [Decision log](docs/decisions.md)
- [Agent guide](AGENTS.md)
