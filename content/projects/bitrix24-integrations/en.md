---
slug: bitrix24-integrations
locale: en
title: Industrial Bitrix24 integrations
eyebrow: SatelAB · three production applications
status: production
roles: [ai, frontend]
featured: true
summary: A three-product suite for acquiring, property operations, and smart locks, modernized with Vue 3 and TypeScript.
task: Replace legacy interfaces with a modern stack and prepare resilient integration applications running inside Bitrix24.
contribution:
  - Designed component boundaries and centralized API layers
  - Implemented production and development context, mocks, loading, and error states
  - Built business interfaces for operational workflows
decisions:
  - Isolated Bitrix24 context in composables instead of leaking SDK details into UI
  - Kept identical client contracts for production APIs and local mocks
  - Split complex domains into focused pages and components
stack: [Vue 3, TypeScript, Vite, Tailwind CSS, Bitrix24 UI, Vitest]
outcome: Three integration interfaces gained a modern, testable foundation ready to evolve with backend contracts.
roleFocus:
  ai: System modernization, integration boundaries, resilience, and production delivery.
  frontend: Vue 3, composables, complex states, forms, tables, filters, pagination, mocks, and unit tests.
links: []
media:
  poster: /media/bitrix24-acquiring-poster.webp
chapters:
  - id: acquiring
    title: Acquiring & Robots
    video: /media/bitrix24-acquiring.mp4
    poster: /media/bitrix24-acquiring-poster.webp
    task: Manage bank handlers, subscription state, and automation robots.
    contribution:
      [
        Bitrix SDK context with URL/env fallback,
        centralized API composable,
        install/uninstall states,
      ]
    decisions:
      [Strict production mode, development mocks, parallel loading, and explicit errors]
  - id: apartsharing
    title: ApartSharing
    video: /media/bitrix24-apartsharing.mp4
    poster: /media/bitrix24-apartsharing-poster.webp
    task: Synchronize CRM data with a property management platform.
    contribution:
      [Account CRUD, field and source mapping, apartment filters and pagination]
    decisions: [Modular tabs, centralized helpers, local development through mocks]
  - id: ttlock
    title: TTLock Connector
    video: /media/bitrix24-ttlock.mp4
    poster: /media/bitrix24-ttlock-poster.webp
    task: Manage accounts, smart locks, tariffs, and transactions.
    contribution:
      [Multi-account flows, lock filtering, tariff calculation, balance checks]
    decisions: [Settings/Tariffs separation, testable components, minimal API coupling]
---

One industrial case demonstrates delivery across three domains under the shared constraints of embedded Bitrix24 applications.
