---
slug: todo-app
locale: ru
title: Todo App
eyebrow: Frontend system · Nuxt 3
status: active
roles: [frontend]
featured: false
priority: { ai: 0, frontend: 30 }
summary: Приложение управления задачами с ролевым доступом, CRUD, поиском, фильтрацией, сортировкой и пагинацией.
task: Реализовать полноценный тестируемый frontend для разных пользовательских ролей и состояний задач.
contribution:
  [Собрал Nuxt/Vue интерфейс и composables, Подготовил API mocks, unit и e2e проверки]
decisions:
  [
    Ролевая модель admin/user,
    MSW для development API,
    Разделение состояния и UI через composables,
  ]
stack: [Nuxt 3, Vue 3, TypeScript, Tailwind CSS, Axios, MSW, Vitest, Playwright]
outcome: Responsive-интерфейс с аутентификацией, статусами и полным циклом управления задачами.
roleFocus:
  ai: Structured application architecture and verification.
  frontend: Nuxt/Vue composables, role-aware UX, CRUD, filters, pagination, unit and e2e tests.
links: []
---
