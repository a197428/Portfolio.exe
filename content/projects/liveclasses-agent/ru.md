---
slug: liveclasses-agent
locale: ru
title: LiveClasses AI Agent
eyebrow: Event-driven agent · Cloudflare
status: active
roles: [ai]
featured: false
summary: Edge-сервис отслеживает расписание трансляций, фильтрует AI-тематику и уведомляет пользователей в Telegram.
task: Автоматизировать мониторинг образовательных эфиров и своевременные уведомления.
contribution:
  [
    Реализовал parser,
    scheduler,
    Telegram webhook и D1 state,
    Добавил фильтрацию и административные уведомления,
  ]
decisions:
  [Разделение fetch и scheduled handlers, Event-driven обработка, Edge-хранение состояния]
stack: [Cloudflare Workers, D1, Cron, Workers AI, Telegram Bot API, Cheerio]
outcome: Компактный serverless-агент с парсингом, подписками и уведомлениями перед эфиром.
roleFocus:
  ai: AI filtering, event-driven agent behavior, and scheduled automation.
  frontend: Telegram command and notification experience.
links: []
---
