---
slug: todo-app
locale: en
title: Todo App
eyebrow: Frontend system · Nuxt 3
status: active
roles: [frontend]
featured: true
priority: { ai: 0, frontend: 30 }
summary: A task-management application with role-based access, CRUD, search, filtering, sorting, and pagination.
task: Build a complete testable frontend for different user roles and task states.
contribution:
  - Built the Nuxt/Vue interface and shared composables
  - Prepared API mocks, unit tests, and e2e checks
  - Implemented role-aware task management with CRUD, search, filtering, sorting, and pagination
decisions:
  - Admin/user role model
  - MSW for development APIs
  - State/UI separation through composables
capabilities:
  - Role-based access with admin and user permissions
  - Complete task lifecycle with create, read, update, delete, and status handling
  - Search, filtering, sorting, and pagination across task states
  - Authentication flow with session state and protected routes
architecture:
  - Nuxt 3 pages and layouts separate data, UI, and state
  - Composable functions encapsulate task queries and mutations
  - MSW intercepts API calls during development and testing
  - Vitest and Playwright verify units, flows, and role scenarios
verification:
  - Unit tests cover composables, filters, sorting, and pagination logic
  - MSW mocks keep component tests deterministic and offline
  - Playwright e2e covers login, role-based access, and the full task cycle
  - TypeScript strict mode is enabled across the codebase
stack: [Nuxt 3, Vue 3, TypeScript, Tailwind CSS, Axios, MSW, Vitest, Playwright]
outcome: A responsive interface with authentication, status handling, and a complete task-management cycle.
roleFocus:
  ai: Structured application architecture and verification.
  frontend: Nuxt/Vue composables, role-aware UX, CRUD, filters, pagination, unit and e2e tests.
links: []
media:
  poster: /media/todo-app-poster.webp
  video: /media/todo-app.mp4
cardPreview: /image/preview/Todo App.png
---
