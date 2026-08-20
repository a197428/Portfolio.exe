---
slug: read-close-bot
locale: ru
title: Read-Close-Bot
eyebrow: AI-агент · ежедневный дайджест
status: active
roles: [ai]
featured: true
priority: { ai: 30, frontend: 0 }
summary: Агент собирает технические статьи, оценивает их релевантность и глубину и отправляет лучшие материалы в Telegram.
task: Ежедневно отбирать сильные материалы The New Stack, InfoWorld и Towards Data Science, сокращая информационный шум.
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
capabilities:
  - Ежедневный дайджест в 10:00 МСК и команда /digest
  - Свободные поисковые запросы к накопленной базе статей
  - Дедупликация по URL и hash перед AI-анализом
  - Scoring по источнику, релевантности и глубине с порогом 5 баллов
architecture:
  - Cron Trigger запускает Cloudflare Worker ежедневно в 07:00 UTC
  - D1 хранит просмотренные URL, AI-анализ и историю запросов
  - RouterAI направляет анализ только в deepseek/deepseek-v3.2
verification:
  - Базовый score равен 3 для The New Stack и InfoWorld и 2 для Towards Data Science
  - К score добавляется 2 балла за релевантность и 1 за глубину
  - Telegram-слой поддерживает /digest, /help и свободный поиск
stack: [Cloudflare Workers, D1, Cron Triggers, DeepSeek v3.2, Telegram Bot API]
outcome: Полностью рабочий edge-агент готовит дайджест и отвечает на поисковые запросы; сейчас бот намеренно отключён, чтобы не расходовать платные токены.
roleFocus:
  ai: Агентная обработка, scoring, память и автоматизация по расписанию.
  frontend: Telegram-интерфейс и ясное представление результатов.
links: [{ label: GitHub, href: https://github.com/a197428/Read_Cl_Bot }]
media:
  poster: /image/Read-Close-Bot.png
cardPreview: /image/preview/Read-Close-Bot.png
---
