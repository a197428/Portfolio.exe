---
slug: neurosport
locale: en
title: Neurosport
eyebrow: Vue platform · realtime sports UX
status: mvp
roles: [frontend]
featured: true
priority: { ai: 0, frontend: 80 }
summary: A multi-route sports platform combining a public prediction game with athlete, recruiter, judge, and admin workspaces.
task: Create one coherent interface for distinct roles, live events, predictions, points, and operational workflows.
contribution:
  - Built 30+ routes and role-specific workspaces with Vue Router
  - Implemented realtime prediction states, match flows, and result tables
  - Connected the i18n client to Worker APIs, D1, and the authentication boundary
decisions:
  - Separate the public game from protected operational workspaces
  - Centralize API access and player-time synchronization in composables
  - Maintain RU/EN parity across routes and interface data
capabilities:
  - Public matches, predictions, and scoring
  - Athlete, recruiter, judge, and administrator workspaces
  - Profiles, transfers, rankings, and responsive navigation
architecture:
  - Vue Router and guards separate public and protected journeys
  - Composables encapsulate APIs, timing, match state, and authentication
  - A Cloudflare Worker and D1 form the typed backend boundary
verification:
  - The pinned frontend passes typecheck and production build
  - 168 frontend unit tests and 221 Worker unit tests pass
  - The public MVP is available for interactive review
stack: [Vue 3, TypeScript, Vue Router, vue-i18n, Tailwind CSS, Cloudflare D1]
outcome: The MVP unifies complex role navigation and an event-driven game interface in one responsive product.
roleFocus:
  ai: The interface exposes prediction flows and model results without claiming a production-ready AI system.
  frontend: Designed routes, role workspaces, realtime state, i18n, responsive behavior, and API boundaries.
source:
  repository: https://github.com/a197428/Neurosport
  commit: bcea64bab9be538ef6d26d3af39a7a32f0db3a7c
  verifiedAt: '2026-08-15'
  visibility: private
links: [{ label: Live demo, href: https://dev.neurosport.pages.dev/, kind: demo }]
media: { poster: /media/neurosport.webp }
---

## Verified context

The local snapshot and live demo substantiate the MVP architecture. The commit remains hidden provenance rather than a public repository claim.
