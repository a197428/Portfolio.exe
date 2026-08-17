---
slug: neurosport-tma
locale: en
title: Neurosport TMA
eyebrow: Telegram Mini App · prediction game platform
status: mvp
roles: [ai, frontend]
featured: true
priority: { ai: 35, frontend: 75 }
summary: A Telegram Mini App for binary predictions, attempts, NPAI rating, and social competition without monetary betting.
task: Build a cohesive game inside Telegram where every prediction and server-side reward remains traceable and verifiable.
contribution:
  - Built the React Telegram Mini App interface and role-aware product flows
  - Connected predictions, attempts, NPAI, duels, and rankings to a transactional Worker API
  - Built an AI-assisted card preparation pipeline with diagnostics and controlled publication
decisions:
  - Keep game points and attempts separate from monetary stakes and withdrawals
  - Record balances and rewards through a server-side ledger and idempotent operations
  - Separate synchronous API work, realtime coordination, and background jobs at the edge
capabilities:
  - Vertical feed of binary Yes or No predictions
  - Attempts, NPAI, daily top, leagues, and achievements
  - Card creation, duels, teams, referrals, and crowd verification
  - AI-assisted card discovery and preparation with human control
architecture:
  - The React 19 Telegram Mini App communicates with a Hono API through shared Zod contracts
  - Cloudflare Worker and D1 own domain state while R2 serves media
  - Durable Objects, WebSockets, Queues, and Cron separate realtime and background processing
verification:
  - The public commit pins the frontend, Worker, shared contracts, and forward-only D1 migrations
  - The repository includes unit and Worker tests for core prediction and social workflows
  - The presentation demonstrates the real mobile workflow inside Telegram
stack: [React 19, TypeScript, Hono, Cloudflare Workers, D1, Zod]
outcome: The MVP combines a mobile-first game experience with a verifiable edge architecture and controlled AI-assisted content preparation.
roleFocus:
  ai: Designed AI-assisted card preparation, diagnostics, and a human publication boundary inside a verifiable prediction system.
  frontend: Built the React 19 Telegram Mini App, mobile-first feed, predictions, duels, teams, profile, and typed API boundary.
source:
  repository: https://github.com/a197428/Neurosport-TMA
  commit: 55b50a797b8552e5430130b67cb6703fff567d30
  verifiedAt: '2026-08-17'
  visibility: public
links: [{ label: GitHub, href: https://github.com/a197428/Neurosport-TMA, kind: source }]
media:
  poster: /media/neurosport-tma-poster.webp
  video: /media/neurosport-tma.mp4
cardPreview: /image/preview/Neurosport TMA.png
---

## Verified context

This card describes the standalone Telegram Mini App and does not reuse claims from the Vue-based Neurosport project. Capabilities are tied to the public `dev` branch commit.
