---
slug: shortsport-ai-forge
locale: ru
title: ShortSport AI Forge
eyebrow: Vue SPA · human-in-the-loop video workflow
status: mvp
roles: [ai, frontend]
featured: true
priority: { ai: 45, frontend: 90 }
summary: Интерфейс управляемого производства вертикальных спортивных роликов — от загрузки материалов и storyboard до preview, рендера и ручного approve/reject.
task: Соединить подготовку пяти сцен, аудио, предпросмотр и серверный рендер в одном прозрачном рабочем процессе.
contribution:
  - Реализовал Vue SPA и Pinia workflow с восстановлением состояния
  - Собрал редактор storyboard, browser preview и цикл approve/reject
  - Типизировал границы данных Zod-схемами и связал UI с Cloudflare API
decisions:
  - Оставить окончательное решение за человеком вместо автоматической публикации
  - Использовать фиксированные роли пяти сцен для предсказуемого монтажа
  - Разделить быстрый browser preview и финальный серверный render
capabilities:
  - Загрузка исходных изображений и аудио для проекта
  - Редактирование текста, таймингов и визуальных параметров пяти сцен
  - Preview, render, approve/reject и библиотека готовых результатов
architecture:
  - Vue Router разделяет последовательные стадии пользовательского workflow
  - Pinia хранит проект и безопасно восстанавливает сохранённое состояние
  - Zod валидирует контракты, Cloudflare Workers/R2/Workflows обслуживают delivery
verification:
  - Зафиксированный снимок проходит typecheck, lint и production build
  - 43 unit-теста и 3 Playwright-сценария проходят на проверенном commit
  - Публичная dev-сборка доступна как интерактивное демо
stack: [Vue 3, TypeScript, Pinia, Zod, Tailwind CSS, Cloudflare]
outcome: Цельный MVP делает каждый этап производства видимым и управляемым, сохраняя ручной контроль перед публикацией.
roleFocus:
  ai: Спроектировал проверяемый human-in-the-loop контур вокруг AI-assisted подготовки контента и серверного рендера.
  frontend: Реализовал многошаговый Vue-интерфейс, Pinia-состояние, storyboard editor, preview/render feedback и типизированные API-контракты.
source:
  repository: https://github.com/a197428/ShortSport-AI-Forge
  commit: 7d5ce1059231bcff89d1917e2fd71c49e4ec8017
  verifiedAt: '2026-08-15'
  visibility: public
links:
  - { label: Live demo, href: https://dev.shortsport-ai-forge.pages.dev/, kind: demo }
  - { label: GitHub, href: https://github.com/a197428/ShortSport-AI-Forge, kind: source }
media: { poster: /media/shortsport-ai-forge.webp }
cardPreview: /image/preview/ShortSport AI Forge.png
---

## Проверенный контекст

Публичный снимок подтверждает клиентский workflow и Cloudflare-контур. Это управляемый MVP с ручным подтверждением результата, а не заявление об автономной публикации.
