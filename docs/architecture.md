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

## Content and future RAG

Verified knowledge is authored as Markdown in `content/profile`, `content/projects`, and
`content/facts`. A later ingestion command will chunk text, attach locale,
role, source, and project metadata, create embeddings, and upsert them into Vectorize.

The current build already validates localized profile and project frontmatter with Zod through
`npm run content:build`, then generates the typed client dataset in `src/generated/content.json`.
Every project must have matching RU and EN documents before it is publishable.

The planned request path is:

1. Validate the question or vacancy description.
2. Retrieve relevant verified chunks from Vectorize.
3. Build a provider-neutral prompt with explicit citations and uncertainty rules.
4. Call GigaChat through an `LLMProvider`; retry an eligible provider failure through OpenRouter.
5. Stream the answer and evidence to the client.

Provider credentials remain Worker secrets. D1 is introduced only if structured metadata, consented
history, or analytics create a concrete relational requirement.

## Future AI boundary

`LLMProvider` will expose provider-neutral generation and streaming contracts. UI components will
consume portfolio-specific API responses, never provider SDK objects. Failure categories must
distinguish invalid input, rate limiting, provider unavailability, and exhausted fallback.
