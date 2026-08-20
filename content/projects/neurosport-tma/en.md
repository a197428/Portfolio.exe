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
  - Built a backend-only LLM normalization pipeline with failover, auditing, and controlled publication
decisions:
  - Keep game points and attempts separate from monetary stakes and withdrawals
  - Record balances and rewards through a server-side ledger and idempotent operations
  - Separate synchronous API work, realtime coordination, and background jobs at the edge
  - Call a free OpenRouter primary and paid RouterAI fallback only from the Worker
capabilities:
  - Vertical feed of binary Yes or No predictions
  - Attempts, NPAI, daily top, leagues, and achievements
  - Card creation, duels, teams, referrals, and crowd verification
  - LLM normalization of sports markets into RU/EN statements and deterministic Yes/No criteria
  - Sponsor-campaign translation saved as pending_review for manual publication
architecture:
  - The React 19 Telegram Mini App communicates with a Hono API through shared Zod contracts
  - Cloudflare Worker and D1 own domain state while R2 serves media
  - Durable Objects, WebSockets, Queues, and Cron separate realtime and background processing
  - 'The Worker calls nvidia/nemotron-3-super-120b-a12b:free through OpenRouter and uses deepseek/deepseek-v3.2 through RouterAI only after a technical failure'
  - 'temperature=0, Zod output validation, D1 auditing of model, latency, tokens, and errors, plus 1/3/6/12/24-hour backoff'
verification:
  - The public commit pins the frontend, Worker, shared contracts, and forward-only D1 migrations
  - The repository includes unit and Worker tests for core prediction and social workflows
  - The presentation demonstrates the real mobile workflow inside Telegram
  - AI_CARD_AUTOMATION_ENABLED is false in development and production; the legacy Tavily + RouterAI pilot is not an active feature
stack: [React 19, TypeScript, Hono, Cloudflare Workers, D1, Zod, OpenRouter, RouterAI]
outcome: The MVP combines a mobile-first game experience with a verifiable edge architecture and controlled AI-assisted content preparation.
roleFocus:
  ai: Designed backend-only LLM failover, strict structured output, D1 auditing, backoff, and a human publication boundary.
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

This card describes the standalone Telegram Mini App and does not reuse claims from the Vue-based Neurosport project. LLM calls are backend-only, so the React client never receives provider secrets. The automation is implemented but currently disabled by a kill switch.
