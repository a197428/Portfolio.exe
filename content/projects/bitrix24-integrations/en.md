---
slug: bitrix24-integrations
locale: en
title: Industrial Bitrix24 integrations
eyebrow: SatelAB · three production applications
status: production
roles: [ai, frontend]
featured: true
priority: { ai: 100, frontend: 100 }
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
    status: production-integration
    video: /media/bitrix24-acquiring.mp4
    poster: /media/bitrix24-acquiring-poster.webp
    task: Manage bank handlers, subscription state, and automation robots.
    capabilities:
      - Track subscription validity and handler availability
      - Install and remove acquiring integrations for banks and payment systems
      - Install and remove Bitrix24 automation robots
    architecture:
      - Bitrix24 SDK initialization with URL and development-only fallback
      - API composable injects portal and member_id into query parameters or request bodies
      - Parallel initial loading with operation-level pending states
    contribution:
      - Built typed interfaces for acquiring handlers and robots
      - Connected the UI to production and development API environments
      - Implemented loading, failure, retry, and per-operation feedback
    decisions:
      - Never use environment context as a production fallback
      - Load subscription, handlers, and robots in parallel
      - Update installation state only after a successful API response
    verification:
      - The repository defines real contracts for seven API operations
      - A production build was reproduced from the pinned commit
    roleFocus:
      ai: Isolated integration context and API contracts while accounting for environments and explicit failure paths.
      frontend: Built handler and robot tables, parallel loading, and granular install/uninstall feedback.
    source:
      repository: https://github.com/a197428/acquiring_frontend
      commit: fb1e7824c368c605af504aec994f65c7679fc836
      verifiedAt: '2026-08-15'
  - id: apartsharing
    title: ApartSharing
    status: production-integration
    video: /media/bitrix24-apartsharing.mp4
    poster: /media/bitrix24-apartsharing-poster.webp
    task: Synchronize CRM data with a property management platform.
    capabilities:
      - Manage ApartSharing accounts from inside Bitrix24
      - Map CRM fields, lead sources, and apartments
      - Search, filter, and paginate the apartment catalog
    architecture:
      - SDK-first context with timeout, URL fallback, and development environment
      - Boundary normalization for multiple API response and CRM field shapes
      - Request deduplication, race protection, and lifecycle cleanup
    contribution:
      - Split accounts, apartments, and mappings into focused modules
      - Centralized endpoints, types, normalization, and API access
      - Prepared production/development builds and local workflows through mocks
    decisions:
      - Keep one client contract for real APIs and mocks
      - Deduplicate repeated settings requests
      - Cancel stale loading work when accounts change or components unmount
    verification:
      - Six unit tests for API and Bitrix24 CRM field normalization pass
      - A production build was reproduced from the pinned commit
    roleFocus:
      ai: Built a resilient boundary between Bitrix24, ApartSharing, and heterogeneous API responses, including race protection.
      frontend: Delivered accounts, complex mapping forms, selects, filters, pagination, and coordinated interface states.
    source:
      repository: https://github.com/a197428/apartsharing-b24_front
      commit: 04c33c1f9d615abb9c341fd788bfb4b2715b6544
      verifiedAt: '2026-08-15'
  - id: ttlock
    title: TTLock Connector
    status: production-ui
    video: /media/bitrix24-ttlock.mp4
    poster: /media/bitrix24-ttlock-poster.webp
    task: Manage accounts, smart locks, tariffs, and transactions.
    capabilities:
      - Configure an account and its first-entry field
      - Search active and available locks and manage common-zone state
      - Calculate tariffs and inspect balance, lock packages, and transaction history
    architecture:
      - Settings and Tariffs separation through Vue Router
      - Component contracts based on props, emits, and computed state
      - Long-list virtualization with a safe fallback when ScrollArea is unavailable
    contribution:
      - Built the Production UI for two operational areas
      - Implemented lock search, activation, deactivation, and editing
      - Covered key component behavior with unit tests
    decisions:
      - Separate integration settings from billing workflows
      - Enable virtualization only for sufficiently large lists
      - Keep UI contracts ready to replace local fixtures with an API
    verification:
      - All 11 component tests in the public snapshot pass
      - The public snapshot uses local data and does not claim a connected TTLock API
    roleFocus:
      ai: Designed the Production UI as a verifiable future integration boundary, separating domain workflows from the data source.
      frontend: Built responsive settings and tariffs, filtering and virtualization, modal workflows, and component tests.
    source:
      repository: https://github.com/a197428/TTLock_Connector_Frontend
      commit: 9b8a91ad48c9ebf7540180ea1b941f5843b4714d
      verifiedAt: '2026-08-15'
---

## Evidence dossier

### Acquiring

The pinned snapshot defines contracts for retrieving subscription validity, handlers, and robots, plus installing and removing handlers and robots. Bitrix24 context comes from the SDK, URL parameters, or development configuration; production does not use an environment fallback.

### ApartSharing

The pinned snapshot covers accounts, apartments, CRM fields, sources, and synchronization settings. Its integration layer normalizes heterogeneous responses, deduplicates selected GET requests, and protects the UI from stale asynchronous results.

### TTLock

The pinned snapshot verifies the Settings and Tariffs Production UI, lock-list behavior, and 11 passing component tests. Its public implementation uses local data; this source does not verify a connected TTLock API.
