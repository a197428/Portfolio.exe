---
slug: read-close-bot
locale: en
title: Read-Close-Bot
eyebrow: AI agent · daily digest
status: active
roles: [ai]
featured: true
priority: { ai: 30, frontend: 0 }
summary: An agent collects technical articles, scores relevance and depth, and delivers the strongest material through Telegram.
task: Select strong material from The New Stack, InfoWorld, and Towards Data Science every day while reducing information noise.
contribution:
  [
    Built ingestion,
    scoring,
    deduplication,
    and Telegram flows,
    Configured Cron and D1 persistence,
  ]
decisions:
  [
    Agent-first Understanding → Decision → Memory → Response pipeline,
    URL and hash deduplication,
  ]
capabilities:
  - Daily 10:00 MSK digest and an on-demand /digest command
  - Natural-language search across the accumulated article database
  - URL and hash deduplication before AI analysis
  - Source, relevance, and depth scoring with a five-point delivery threshold
architecture:
  - A Cron Trigger starts the Cloudflare Worker every day at 07:00 UTC
  - D1 stores seen URLs, AI analysis, and user query history
  - RouterAI routes analysis exclusively to deepseek/deepseek-v3.2
verification:
  - Base scores are 3 for The New Stack and InfoWorld and 2 for Towards Data Science
  - Scoring adds 2 points for relevance and 1 point for depth
  - The Telegram layer supports /digest, /help, and free-form search
stack: [Cloudflare Workers, D1, Cron Triggers, DeepSeek v3.2, Telegram Bot API]
outcome: A scheduled autonomous edge agent delivers a filtered digest and answers Telegram searches against accumulated articles.
roleFocus:
  ai: Agent processing, scoring, memory, and scheduled automation.
  frontend: Telegram interaction and concise result presentation.
links: [{ label: GitHub, href: https://github.com/a197428/Read_Cl_Bot }]
media:
  poster: /image/Read-Close-Bot.png
cardPreview: /image/preview/Read-Close-Bot.png
---
