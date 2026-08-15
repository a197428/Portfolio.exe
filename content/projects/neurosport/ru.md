---
slug: neurosport
locale: ru
title: Neurosport
eyebrow: Vue platform · realtime sports UX
status: mvp
roles: [frontend]
featured: true
priority: { ai: 0, frontend: 80 }
summary: Многостраничная спортивная платформа с публичной игрой прогнозов и кабинетами спортсмена, рекрутера, судьи и администратора.
task: Собрать связный интерфейс для разных ролей, live-событий, прогнозов, очков и операционных сценариев.
contribution:
  - Реализовал 30+ маршрутов и role-specific кабинеты на Vue Router
  - Собрал realtime prediction UI, состояния матчей и таблицы результатов
  - Связал i18n-клиент с Worker API, D1 и контуром авторизации
decisions:
  - Разделить публичный игровой путь и защищённые рабочие кабинеты
  - Централизовать API-доступ и синхронизацию времени игрока
  - Сохранять RU/EN parity на уровне маршрутов и данных интерфейса
capabilities:
  - Публичные матчи, прогнозы и скоринг
  - Кабинеты спортсмена, рекрутера, судьи и администратора
  - Профили, трансферы, рейтинги и адаптивная навигация
architecture:
  - Vue Router и route guards разделяют публичные и защищённые сценарии
  - Composables инкапсулируют API, время, состояния матча и авторизацию
  - Cloudflare Worker и D1 предоставляют типизированную backend-границу
verification:
  - Пинованный frontend проходит typecheck и production build
  - 168 frontend unit-тестов и 221 Worker unit-тест проходят
  - Публичный MVP доступен для интерактивной проверки
stack: [Vue 3, TypeScript, Vue Router, vue-i18n, Tailwind CSS, Cloudflare D1]
outcome: MVP объединяет сложную ролевую навигацию и событийный игровой интерфейс в одном адаптивном продукте.
roleFocus:
  ai: Интерфейс визуализирует prediction workflow и результаты модели без заявления о готовом production AI-контуре.
  frontend: Спроектировал маршруты, ролевые кабинеты, realtime-состояния, i18n, адаптивность и API-границы.
source:
  repository: https://github.com/a197428/Neurosport
  commit: bcea64bab9be538ef6d26d3af39a7a32f0db3a7c
  verifiedAt: '2026-08-15'
  visibility: private
links: [{ label: Live demo, href: https://dev.neurosport.pages.dev/, kind: demo }]
media: { poster: /media/neurosport.webp }
---

## Доказательный контекст

Локальный снимок и доступное демо подтверждают архитектуру MVP. Commit используется только как provenance и не публикуется в интерфейсе.
