---
slug: energo-ai
locale: ru
title: EnergoAI
eyebrow: Vue product site · energy intelligence
status: active
roles: [frontend]
featured: true
priority: { ai: 0, frontend: 60 }
summary: Двуязычный Vue-интерфейс энергетического AI-продукта с Tailwind v4 дизайн-системой, SVG-инфраструктурой и интерактивным каталогом моделей.
task: Представить сложную энергетическую платформу через ясную структуру, выразительную визуализацию и адаптивные продуктовые сценарии.
contribution:
  - Собрал секционную архитектуру и типизированный RU/EN content layer
  - Реализовал SVG neural sphere и схему инфраструктуры
  - Разработал accordion решений, model carousel и responsive navigation
decisions:
  - Хранить локализованный контент отдельно от визуальных компонентов
  - Строить сложные иллюстрации как управляемый SVG, а не растровый asset
  - Уважать reduced motion и очищать эффекты при размонтировании
capabilities:
  - Двуязычная маршрутизация и согласованные продуктовые страницы
  - Интерактивные схемы, accordion и карусель моделей
  - Адаптивный интерфейс с scrollspy и клавиатурной навигацией
architecture:
  - Vue Router управляет locale-маршрутами
  - Composables инкапсулируют i18n, scrollspy и пользовательские предпочтения
  - Tailwind v4 tokens формируют единую дизайн-систему
verification:
  - Полный verify проходит typecheck, lint, format и production build
  - 16 unit-тестов и 15 Playwright-сценариев проходят на pinned commit
  - Публичный deployment доступен как live demo
stack: [Vue 3, TypeScript, Tailwind CSS v4, Vue Router, SVG, Vitest]
outcome: Продуктовый сайт превращает технически сложную тему в цельный двуязычный и адаптивный опыт.
roleFocus:
  ai: Контент объясняет AI-возможности продукта, не подменяя техническими заявлениями проверяемую UI-реализацию.
  frontend: Реализовал Vue-композицию, типизированный content layer, SVG-визуализации, интерактивные секции и полный тестовый контур.
source:
  repository: https://github.com/a197428/EnergoAI
  commit: 2fe165e50e1354180c094b8a08ce86a755dc4506
  verifiedAt: '2026-08-18'
  visibility: public
links:
  [
    { label: Live demo, href: https://energoai.pages.dev/, kind: demo },
    { label: GitHub, href: https://github.com/a197428/EnergoAI, kind: source },
  ]
media: { poster: /media/energo-ai.webp }
---

## Доказательный контекст

Пинованный публичный commit подтверждает типизированный content layer, SVG-визуализации, интерактивные секции и 16 unit-тестов с 15 Playwright-сценариями.
