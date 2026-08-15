---
slug: neuralgrid-international
locale: ru
title: NeuralGrid International
eyebrow: React design system · interactive canvas
status: active
roles: [frontend]
featured: true
priority: { ai: 0, frontend: 70 }
summary: Двуязычный React-сайт технологической компании с собственной визуальной системой, интерактивным Canvas и управляемой scroll-анимацией.
task: Передать сложный технологический образ через быстрый, доступный и адаптивный интерфейс без потери читаемости.
contribution:
  - Собрал компонентные секции и переиспользуемые UI-примитивы
  - Реализовал Canvas-визуализацию и lifecycle-aware анимации
  - Подготовил RU/EN контент, responsive layout и accessibility-проверки
decisions:
  - Изолировать Canvas и animation hooks от контентных компонентов
  - Использовать GSAP для последовательностей, Lenis — для контролируемого scroll
  - Отключать декоративное движение при prefers-reduced-motion
capabilities:
  - Двуязычная маршрутизация и полноценные продуктовые секции
  - Интерактивная Canvas-сцена и scroll reveal
  - Адаптивная навигация и доступные интерактивные элементы
architecture:
  - React Router управляет locale-маршрутами
  - Компонентные секции используют общую дизайн-систему
  - Хуки инкапсулируют Canvas, GSAP и cleanup анимаций
verification:
  - Проверенный снимок проходит production build и 26 unit-тестов
  - Репозиторий содержит Playwright и accessibility-сценарии
  - Публичная сборка доступна как live demo
stack: [React 19, TypeScript, Tailwind CSS, Canvas, GSAP, Lenis]
outcome: Визуально насыщенный интерфейс остаётся структурным, адаптивным, двуязычным и управляемым с клавиатуры.
roleFocus:
  ai: Визуальный язык объясняет технологический продукт без неподтверждённых утверждений о моделях.
  frontend: Реализовал React-архитектуру секций, дизайн-систему, Canvas, анимационный lifecycle, i18n и accessibility.
source:
  repository: https://github.com/a197428/NeuralGrid
  commit: caa45a33c5af7e9444aa442d50cefa3acb41921f
  verifiedAt: '2026-08-15'
  visibility: private
links: [{ label: Live demo, href: https://neuralgrid.pages.dev/, kind: demo }]
media: { poster: /media/neuralgrid-international.webp }
---

## Доказательный контекст

Локальный commit закрепляет проверенные возможности, а интерфейс показывает только доступное live demo — без ссылки на непубличный источник.
