---
slug: read-close-bot
locale: en
title: Read-Close-Bot
eyebrow: AI agent · daily digest
status: active
roles: [ai]
featured: true
summary: An agent collects technical articles, scores relevance and depth, and delivers the strongest material through Telegram.
task: Reduce noise across professional sources and produce a useful daily digest.
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
stack: [Cloudflare Workers, D1, Cron, DeepSeek, Telegram Bot API]
outcome: An autonomous edge pipeline with digest commands and search over stored material.
roleFocus:
  ai: Agent processing, scoring, memory, and scheduled automation.
  frontend: Telegram interaction and concise result presentation.
links: [{ label: GitHub, href: https://github.com/a197428/Read_Cl_Bot }]
---
