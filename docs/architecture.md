# Architecture

## Runtime shape

Vite builds a React SPA and a Cloudflare Worker in one project. Cloudflare Static Assets serves
the client; requests under `/api/*` run through the Worker. SPA navigation falls back to
`index.html`.

The client is divided by responsibility:

- `app/` — providers, router, and application shell.
- `components/` — reusable UI and future installed Kokonut UI source.
- `features/` — role, locale, projects, vacancy matching, and chat slices.
- `lib/` — framework-neutral utilities and API access.
- `locales/` — complete RU and EN message resources.

TanStack Query owns asynchronous API state. Zustand stores only durable interface preferences.
Forms use React Hook Form and Zod. API validation happens again in the Worker.

## Design and motion

Liquid-glass variables define color, translucent surfaces, borders, blur, shadows, and focus rings.
Components consume semantic variables rather than one-off colors. Kokonut UI components will be
installed from its shadcn registry after visual references are approved, then customized in place.

Anime.js owns custom timelines and scroll observers. Every animation is scoped to a component root,
cleaned up on unmount, and bypassed when `prefers-reduced-motion` is active. Motion remains only as
an internal dependency of selected Kokonut components.

## Content and grounded retrieval

Verified knowledge is authored as Markdown in `content/profile`, `content/projects`, and
`content/resume`, and `content/facts`. `npm run content:build` validates localized content and
creates stable knowledge chunks. `npm run knowledge:index` requests 1024-dimensional GigaChat
`Embeddings`, idempotently upserts them into the `portfolio-knowledge` Vectorize V2 index, and
removes obsolete IDs only after a successful upsert.

The current build already validates localized profile and project frontmatter with Zod through
`npm run content:build`, then generates the typed client dataset in `src/generated/content.json`.
Every project must have matching RU and EN documents before it is publishable.

Profiles contain role-specific positioning and skill groups. Projects carry independent AI and
Frontend priorities, so a shared case can move between lenses without duplicating pages or relying
on the broad `featured` flag.

Project evidence can pin a repository, commit SHA, verification date, and source visibility in
metadata. Private/local provenance is never rendered; it exists for review and future RAG. Demo
links remain public independently from source visibility.
This provenance is retained for future RAG citations but is not automatically rendered as a public
link. Product status describes the verified implementation boundary: for example, a production UI
must not imply that its public snapshot contains a connected production API.

The `/api/chat` request path is:

1. Validate the question or vacancy description.
2. Retrieve relevant verified chunks from Vectorize.
3. Build a provider-neutral prompt with explicit citations and uncertainty rules.
4. Call OpenRouter's Nemotron free endpoint through the provider boundary and stream its grounded answer.
5. Stream the answer and evidence to the client.

Provider credentials and the Turnstile secret remain Worker secrets. GigaChat OAuth tokens used by
the transitional embedding path are shared inside a Worker isolate and refreshed before expiry. Vectorize metadata contains the small source
chunk and citation fields, so D1 is not part of this MVP. Messages remain in React state for the
current tab and are neither persisted nor included in observability logs.
The GigaChat query-embedding path is opt-in through `GIGACHAT_EMBEDDINGS_ENABLED=true`;
without it, Bob uses deterministic lexical retrieval and never contacts GigaChat at runtime.

Production setup is explicit: create the V2 index with `npm run knowledge:create`, store
`OPENROUTER_API_KEY`, optional `GIGACHAT_AUTH_KEY`, and `TURNSTILE_SECRET_KEY` using `wrangler secret put`, configure the public
`TURNSTILE_SITE_KEY`/expected hostname as Worker variables, and run `npm run knowledge:index` only
after the publication-approved RU/EN resume and facts are complete. Never place provider secrets in
Vite variables or generated content. The build removes Cloudflare's local `.dev.vars` copy from
`dist`; production deployments receive secrets only from Worker secret bindings.

## AI boundary

The OpenRouter generation adapter and GigaChat embedding adapter are isolated from the Hono route. UI components consume portfolio-specific
SSE events, never provider objects. The contract distinguishes validation, missing evidence, rate
limits, Turnstile challenge, provider authentication, provider availability, and interrupted
streams. Generation-provider failover remains deferred.
