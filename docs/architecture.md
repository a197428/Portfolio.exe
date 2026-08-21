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

Verified knowledge is authored as Markdown in `content/profile`, `content/projects`,
`content/resume`, and `content/facts`. `npm run content:build` validates localized content and
creates content-addressed knowledge chunks. `npm run knowledge:index` requests 1024-dimensional
GigaChat `Embeddings`, idempotently upserts them into the `portfolio-knowledge` Vectorize V2
index, removes obsolete IDs only after a successful upsert, and verifies that every current ID is
present.

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
2. Classify the question, its requested evidence types, role focus, completeness requirement, and
   whether recent conversation context is needed.
3. Combine deterministic lexical retrieval with Vectorize ranking. Vectorize returns IDs only;
   the Worker hydrates them from its current built-in corpus and ignores stale or unknown IDs.
4. Build a provider-neutral prompt with grounding, coverage, and uncertainty rules.
5. Start the response with OpenRouter's Nemotron free endpoint.
6. If OpenRouter cannot start the response, retry once through RouterAI with DeepSeek V4 Flash.
7. Stream clean text and a separate structured evidence list to the client.

Questions are classified into skills, resume, experience, education, availability, projects,
implementation details, comparisons, and LLM topics. Hyphens and Russian word forms are
normalized before ranking. Project names and technology terms are discovered from the corpus.
The AI/Frontend lens is a ranking preference, never an information filter. Broad project questions
receive a deterministic complete set based on project `roles`; focused questions receive a bounded
hybrid result. Recent history is included for short referential follow-ups.

Retrieval passes explicit coverage metadata to the generation prompt. Bob may describe a list as
complete only when deterministic retrieval marked it complete, and must not interpret absence from
a focused result as absence from the portfolio. Project role membership comes only from `roles`,
not from descriptive `roleFocus` text. Citations are deduplicated by source route before streaming.

Provider credentials and the Turnstile secret remain Worker secrets. GigaChat OAuth tokens used by
the transitional embedding path are shared inside a Worker isolate and refreshed before expiry. Vectorize metadata contains the small source
chunk and citation fields, so D1 is not part of this MVP. Messages remain in React state for the
current tab and are neither persisted nor included in observability logs.
The GigaChat query-embedding path is opt-in through `GIGACHAT_EMBEDDINGS_ENABLED=true`;
without it, Bob uses deterministic lexical retrieval and never contacts GigaChat at runtime.

Production setup is explicit: create the V2 index with `npm run knowledge:create`, store
`OPENROUTER_API_KEY`, `ROUTERAI_API_KEY`, optional `GIGACHAT_AUTH_KEY`, and
`TURNSTILE_SECRET_KEY` using `wrangler secret put`, configure the public
`TURNSTILE_SITE_KEY`/expected hostname as Worker variables, and run `npm run knowledge:index` after
reviewing the publication-approved RU/EN resume and facts. Never place provider secrets in
Vite variables or generated content. The build removes Cloudflare's local `.dev.vars` copy from
`dist`; production deployments receive secrets only from Worker secret bindings.

## AI boundary

The OpenRouter and RouterAI generation adapters and GigaChat embedding adapter are isolated from
the Hono route. UI components consume portfolio-specific
SSE events, never provider objects. The contract distinguishes validation, missing evidence, rate
limits, Turnstile challenge, provider authentication, provider availability, and interrupted
streams. Generation-provider failover remains deferred.
