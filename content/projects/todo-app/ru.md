---
slug: todo-app
locale: ru
title: Todo App
eyebrow: Frontend system · Nuxt 3
status: active
roles: [frontend]
featured: true
priority: { ai: 0, frontend: 30 }
summary: Приложение управления задачами с ролевым доступом, CRUD, поиском, фильтрацией, сортировкой и пагинацией.
task: Реализовать полноценный тестируемый frontend для разных пользовательских ролей и состояний задач.
contribution:
  - Собрал Nuxt/Vue интерфейс и общие composables
  - Подготовил API mocks, unit и e2e проверки
  - Реализовал ролевое управление задачами с CRUD, поиском, фильтрацией, сортировкой и пагинацией
decisions:
  - Ролевая модель admin/user
  - MSW для development API
  - Разделение состояния и UI через composables
capabilities:
  - Ролевой доступ с правами admin и user
  - Полный цикл задач — создание, чтение, обновление, удаление и статусы
  - Поиск, фильтрация, сортировка и пагинация по состояниям задач
  - Аутентификация с состоянием сессии и защищёнными маршрутами
architecture:
  - Страницы и layouts Nuxt 3 разделяют данные, UI и состояние
  - Composables инкапсулируют запросы и изменения задач
  - MSW перехватывает API-запросы при разработке и в тестах
  - Vitest и Playwright проверяют юниты, сценарии и ролевые сценарии
verification:
  - Unit-тесты покрывают composables, фильтры, сортировку и пагинацию
  - MSW-моки делают тесты компонентов детерминированными и офлайн
  - Playwright e2e покрывает вход, ролевой доступ и полный цикл задач
  - TypeScript strict включён по всей кодовой базе
stack: [Nuxt 3, Vue 3, TypeScript, Tailwind CSS, Axios, MSW, Vitest, Playwright]
outcome: Responsive-интерфейс с аутентификацией, статусами и полным циклом управления задачами.
roleFocus:
  ai: Structured application architecture and verification.
  frontend: Nuxt/Vue composables, role-aware UX, CRUD, filters, pagination, unit and e2e tests.
links: []
media:
  poster: /media/todo-app-poster.webp
  video: /media/todo-app.mp4
cardPreview: /image/preview/Todo App.png
---
