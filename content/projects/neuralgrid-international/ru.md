---
slug: neuralgrid-international
locale: ru
title: NeuralGrid International
eyebrow: React landing · двуязычный canvas-сайт
status: active
roles: [frontend]
featured: true
priority: { ai: 0, frontend: 70 }
summary: Двуязычный React 19 технологический лендинг с фиксированной Canvas-сценой, GSAP-скроллом и локализованными SEO-данными.
task: Представить сложное технологическое предложение как быстрый двуязычный одностраничный опыт с управляемой скролл-анимацией.
contribution:
  - Собрал компонентные секции поверх общей дизайн-системы React
  - Реализовал фиксированную Canvas-сцену и хореографию скролла GSAP/Lenis
  - Добавил RU/EN маршруты с локализованными SEO-метаданными
decisions:
  - Держать Canvas-сцену фиксированной, пока GSAP анимирует скролл-раскрытия
  - Использовать Lenis для плавного скролла и React Router для locale-маршрутов
  - Локализовать SEO-данные вместе с текстами интерфейса
capabilities:
  - Двуязычный лендинг с маршрутами / и /ru
  - Фиксированная анимированная Canvas-сцена и GSAP ScrollTrigger-раскрытия
  - Плавный скролл Lenis и адаптивная навигация
  - Локализованные SEO-метаданные для каждого locale
architecture:
  - React 19 с компонентными секциями поверх одной дизайн-системы
  - Отдельный Canvas-компонент владеет фиксированной фоновой сценой
  - Хуки инкапсулируют GSAP ScrollTrigger, Lenis и очистку
  - i18n-провайдер владеет словарями и SEO-хуком
verification:
  - Пинованный commit проходит production build
  - Тестовый suite отсутствует, поэтому заявления ограничены подтверждёнными build-фактами
  - Locale-маршрут также матчит неизвестные односегментные пути — задокументированный долг
  - Поведение wordmark в навигации задокументировано как непроверенное
stack: [React 19, TypeScript, Tailwind CSS, GSAP, Lenis, Canvas]
outcome: Визуально насыщенный двуязычный лендинг, который остаётся адаптивным при честной фиксации production build и известного долга.
roleFocus:
  ai: Визуальный язык объясняет технологическое предложение без модельных заявлений.
  frontend: Построил React-архитектуру секций, Canvas-сцену, GSAP/Lenis-анимацию, i18n и локализованный SEO.
source:
  repository: https://github.com/a197428/NeuralGrid
  commit: 86258e72e362d648c6129aeb6a4c0e0b35b0f7b1
  verifiedAt: '2026-08-18'
  visibility: public
links:
  [
    { label: Live demo, href: https://neuralgrid.pages.dev/, kind: demo },
    { label: GitHub, href: https://github.com/a197428/NeuralGrid, kind: source },
  ]
media: { poster: /media/neuralgrid-international.webp }
---

## Доказательный контекст

Пинованный публичный commit показывает компонентный React 19 лендинг: фиксированную Canvas-сцену, GSAP ScrollTrigger-раскрытия со сглаживанием Lenis, RU/EN маршруты и локализованные SEO-данные. Production build проходит; отсутствие тестового suite и известный routing-долг задокументированы честно, без преувеличений.
