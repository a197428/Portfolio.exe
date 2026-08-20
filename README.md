# Portfolio.exe

A bilingual, interactive portfolio foundation for AI Developer and Frontend Developer roles.
The first milestone delivers the React/Cloudflare application shell, role-aware content,
localization, liquid-glass design tokens, and accessible animation primitives.

## Local development

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the URL printed by Vite. The health endpoint is available at `/api/health`.

Portfolio content lives in `content/profile` and `content/projects`. Run
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
