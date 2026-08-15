# Decision log

| Status   | Decision                                              | Rationale                                                                             |
| -------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Accepted | React 19 + Vite instead of Next.js                    | Keeps the familiar Vite workflow and fits Cloudflare's first-party full-stack plugin. |
| Accepted | One Worker deployment with Static Assets              | Keeps frontend and `/api/*` versioned and deployed together.                          |
| Accepted | RU and EN have feature parity                         | Supports local and international hiring audiences.                                    |
| Accepted | AI Developer and Frontend Developer are equal lenses  | One portfolio can reorder emphasis without duplicating the product.                   |
| Accepted | Tailwind v4 + shadcn + Kokonut UI source components   | Enables fast composition while retaining ownership of component code.                 |
| Accepted | Anime.js owns custom motion                           | Provides scoped React animation and scroll orchestration.                             |
| Accepted | Markdown in Git is the verified knowledge source      | Makes claims reviewable, versioned, and easy to index.                                |
| Accepted | Provider-neutral AI boundary                          | GigaChat is expected first; OpenRouter is the planned fallback.                       |
| Deferred | Exact GigaChat and OpenRouter models                  | Decide during the AI vertical slice using quality, latency, and cost tests.           |
| Accepted | External live demos for available projects            | Makes interfaces testable without exposing private repositories.                      |
| Deferred | Chat retention and analytics                          | Requires a privacy and product-value decision before adding storage.                  |
| Accepted | Kokonut background, liquid card, bento, and AI prompt | Registry source is adapted in place for React/Vite and the portfolio design system.   |
| Accepted | Bitrix24 suite is one case with three products        | Preserves the shared industrial context while exposing product-specific decisions.    |
| Accepted | Product-specific presentations are Static Assets      | Three small MP4 files provide deterministic product navigation below asset limits.    |
| Accepted | Repository evidence is pinned to a commit             | Provenance keeps future RAG answers traceable without forcing source links into UI.   |
| Accepted | Role-specific profile and project priority            | One content model supports distinct AI and Frontend narratives without duplication.   |
| Accepted | Private source and public demo are separate           | A deployment can be public while its provenance remains hidden from the interface.    |
| Accepted | Frontend evidence order is explicit                   | Bitrix24 leads, followed by ShortSport, Neurosport, NeuralGrid, and EnergoAI.         |
| Out      | Code generation in MVP                                | Chat and vacancy matching are the primary proof of value.                             |
| Out      | Public "vibe coding" positioning                      | The portfolio communicates verified engineering work and outcomes only.               |
