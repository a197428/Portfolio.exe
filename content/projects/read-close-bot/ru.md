---
slug: read-close-bot
locale: ru
title: Read-Close-Bot
eyebrow: AI-агент · ежедневный дайджест
status: active
roles: [ai]
featured: true
summary: Агент собирает технические статьи, оценивает их релевантность и глубину и отправляет лучшие материалы в Telegram.
task: Сократить шум в профессиональных источниках и формировать полезный ежедневный дайджест.
contribution:
  [
    Реализовал ingestion,
    scoring,
    дедупликацию и Telegram-интерфейс,
    Настроил Cron и хранение в D1,
  ]
decisions:
  [
    Agent-first pipeline Understanding → Decision → Memory → Response,
    Дедупликация по URL и hash,
  ]
stack: [Cloudflare Workers, D1, Cron, DeepSeek, Telegram Bot API]
outcome: Автономный edge-пайплайн с командами дайджеста и поиском по накопленной базе.
roleFocus:
  ai: Агентная обработка, scoring, память и автоматизация по расписанию.
  frontend: Telegram-интерфейс и ясное представление результатов.
links: [{ label: GitHub, href: https://github.com/a197428/Read_Cl_Bot }]
---
