---
slug: neurosport-tma
locale: ru
title: Neurosport TMA
eyebrow: Telegram Mini App · prediction game platform
status: mvp
roles: [ai, frontend]
featured: true
priority: { ai: 35, frontend: 75 }
summary: Telegram Mini App с бинарными прогнозами, попытками, NPAI-рейтингом и социальными механиками без денежных ставок.
task: Построить цельный игровой продукт внутри Telegram, где каждый прогноз и серверное начисление остаются проверяемыми.
contribution:
  - Реализовал React-интерфейс Telegram Mini App и ролевые продуктовые сценарии
  - Связал прогнозы, попытки, NPAI, дуэли и рейтинги с транзакционным Worker API
  - Собрал AI-assisted контур подготовки карточек с диагностикой и контролируемой публикацией
decisions:
  - Отделить игровые очки и попытки от денежных ставок и вывода средств
  - Фиксировать балансы и награды серверным ledger и идемпотентными операциями
  - Разделить синхронный API, realtime-координацию и фоновые задачи на edge-уровне
capabilities:
  - Вертикальная лента бинарных прогнозов «Да» или «Нет»
  - Попытки, NPAI, дневной топ, лиги и достижения
  - Создание карточек, дуэли, команды, рефералы и крауд-верификация
  - AI-assisted поиск и подготовка карточек с ручным контролем
architecture:
  - React 19 Telegram Mini App общается с Hono API через общие Zod-контракты
  - Cloudflare Worker и D1 хранят доменное состояние, R2 обслуживает медиа
  - Durable Objects, WebSockets, Queues и Cron разделяют realtime и фоновую обработку
verification:
  - Публичный commit фиксирует frontend, Worker, shared-контракты и forward-only D1-миграции
  - Репозиторий содержит unit- и Worker-тесты для ключевых прогнозных и социальных сценариев
  - Видеопрезентация показывает реальный mobile workflow в Telegram
stack: [React 19, TypeScript, Hono, Cloudflare Workers, D1, Zod]
outcome: MVP объединяет mobile-first игровой UX и проверяемую edge-архитектуру с контролируемой AI-assisted подготовкой контента.
roleFocus:
  ai: Спроектировал AI-assisted подготовку карточек, диагностику и ручную границу публикации внутри проверяемой игровой системы.
  frontend: Реализовал React 19 Telegram Mini App, mobile-first ленту, прогнозы, дуэли, команды, профиль и типизированную API-границу.
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

## Проверенный контекст

Карточка описывает отдельную Telegram Mini App и не использует факты из Vue-проекта Neurosport. Возможности привязаны к публичному commit ветки `dev`.
