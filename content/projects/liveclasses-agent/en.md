---
slug: liveclasses-agent
locale: en
title: LiveClasses AI Agent
eyebrow: Event-driven agent · Cloudflare
status: active
roles: [ai]
featured: false
summary: An edge service tracks live-stream schedules, filters AI-related topics, and notifies users through Telegram.
task: Automate monitoring of educational broadcasts and timely alerts.
contribution:
  [
    Built the parser,
    scheduler,
    Telegram webhook,
    and D1 state,
    Added filtering and administrator notifications,
  ]
decisions:
  [Separated fetch and scheduled handlers, Event-driven processing, Edge persistence]
stack: [Cloudflare Workers, D1, Cron, Workers AI, Telegram Bot API, Cheerio]
outcome: A compact serverless agent with parsing, subscriptions, and pre-stream notifications.
roleFocus:
  ai: AI filtering, event-driven agent behavior, and scheduled automation.
  frontend: Telegram command and notification experience.
links: []
---
