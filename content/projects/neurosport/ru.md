---
slug: neurosport
locale: ru
title: Neurosport
eyebrow: Vue platform · прогнозы нового вида спорта
status: mvp
roles: [frontend]
featured: true
priority: { ai: 0, frontend: 80 }
summary: Двуязычный публичный сайт нового вида спорта, где участники зарабатывают очки на прогнозах исходов матчей и микрособытий — от online-отбора до финалов страны, континента и мира.
task: Объяснить формат спорта и будущую институциональную структуру через убедительный публичный прототип без операционных backend-контуров.
contribution:
  - Собрал двуязычные маршруты правил, соревнований, федераций, академии, data room и новостей
  - Построил нарратив от online-отбора до финалов карточками событий и спортсменов
  - Реализовал Three.js hero-сцену и типизированный локализованный content layer
decisions:
  - Показывать кабинеты, auth и backend только как концепт, а не как реализованные заявления
  - Хранить публичный demo-материал локально и типизированно вместо живого API
  - Строить навигацию вокруг будущей модели федераций и академии
capabilities:
  - Публичное демо нового вида спорта со скорингом глобальных исходов матчей
  - Прогнозы микрособытий — пас, гол, дриблинг, направление, удар и аут
  - Путь от online-отбора до финалов страны, континента и мира
  - Секции правил, соревнований, федераций, академии, data room и новостей
architecture:
  - Vue Router сопоставляет RU/EN маршруты страницам спорта, соревнований и федераций
  - Типизированный content layer отделяет demo-материал от компонентов
  - Three.js рендерит анимированную hero-сцену с fallback для reduced-motion
  - vue-i18n предоставляет эквивалентные RU/EN тексты интерфейса
verification:
  - Пинованный commit проходит typecheck, lint и production build
  - Типизированный content spec покрывает двуязычный слой данных
  - Шесть Playwright-сценариев покрывают основные пользовательские пути на пинованном commit
  - Операционные backend-контуры и личные кабинеты представлены только как концепт
stack: [Vue 3, TypeScript, Vue Router, vue-i18n, Three.js, Tailwind CSS]
outcome: MVP-прототип объясняет формат спорта, модель прогнозов и институциональный roadmap в одном адаптивном двуязычном сайте.
roleFocus:
  ai: Модель прогнозов и скоринга представлена как продуктовый текст без заявления о готовом production AI-контуре.
  frontend: Спроектировал маршруты, Three.js hero, типизированный контент, i18n и адаптивный прототип.
source:
  repository: https://github.com/a197428/Neurosport
  commit: 7d4fdef4191d2be96e564902af768b26001a136b
  verifiedAt: '2026-08-18'
  visibility: public
links:
  [
    { label: Live demo, href: https://dev.neurosport.pages.dev/, kind: demo },
    { label: GitHub, href: https://github.com/a197428/Neurosport, kind: source },
  ]
media: { poster: /media/neurosport.webp }
cardPreview: /image/preview/Neurosport.png
---

## Доказательный контекст

Пинованный публичный commit подтверждает demo pivot: двуязычный прототип с типизированным контентом, Three.js-сценой и явной границей между концептом и реализованными заявлениями.
