# Decision log

| Status   | Decision                                             | Rationale                                                                             |
| -------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Accepted | React 19 + Vite instead of Next.js                   | Keeps the familiar Vite workflow and fits Cloudflare's first-party full-stack plugin. |
| Accepted | One Worker deployment with Static Assets             | Keeps frontend and `/api/*` versioned and deployed together.                          |
| Accepted | RU and EN have feature parity                        | Supports local and international hiring audiences.                                    |
| Accepted | AI Developer and Frontend Developer are equal lenses | One portfolio can reorder emphasis without duplicating the product.                   |
| Accepted | Tailwind v4 + shadcn + Kokonut UI source components  | Enables fast composition while retaining ownership of component code.                 |
| Accepted | Anime.js owns custom motion                          | Provides scoped React animation and scroll orchestration.                             |
| Accepted | Markdown in Git is the verified knowledge source     | Makes claims reviewable, versioned, and easy to index.                                |
| Accepted | Provider-neutral AI boundary                         | GigaChat is expected first; OpenRouter is the planned fallback.                       |
| Deferred | Exact GigaChat and OpenRouter models                 | Decide during the AI vertical slice using quality, latency, and cost tests.           |
| Deferred | Project live-demo format                             | Decide when real projects and hosting constraints are available.                      |
| Deferred | Chat retention and analytics                         | Requires a privacy and product-value decision before adding storage.                  |
| Deferred | Specific Kokonut components                          | Select after receiving visual references from the owner.                              |
| Out      | Code generation in MVP                               | Chat and vacancy matching are the primary proof of value.                             |
