---
slug: bitrix24-integrations
locale: en
title: Industrial Bitrix24 integrations
eyebrow: SatelAB · three production applications
status: production
roles: [ai, frontend]
featured: true
priority: { ai: 100, frontend: 100 }
summary: Three embedded Bitrix24 applications for acquiring, apartment operations, and smart locks, modernized with Vue 3 and TypeScript.
task: Move three legacy interfaces to a modern stack without losing domain API contracts or the constraints of running inside a Bitrix24 iframe.
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
cardPreview: /image/preview/Industrial Bitrix24 integrations.png
chapters:
  - id: acquiring
    title: Acquiring & Robots
    status: production-integration
    video: /media/bitrix24-acquiring.mp4
    poster: /media/bitrix24-acquiring-poster.webp
    task: Give Bitrix24 administrators one iframe interface for acquiring handlers, subscription validity, and automation robots.
    capabilities:
      - Track subscription validity, availability, and installation state
      - Install and remove bank and payment handlers covering cards, SBP, holding, and receipt-related capabilities
      - Install and remove Bitrix24 automation robots
    architecture:
      - Bitrix24 SDK initialization with URL and development-only fallback
      - A typed API composable injects portal and member_id into query parameters or JSON bodies across seven REST operations
      - Subscription, handlers, and robots load in parallel with separate loading, failure, retry, and operation states
    contribution:
      - Built typed handler and robot tables with badges, logo fallbacks, and operation feedback
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
    task: 'Configure the Bitrix24-to-ApartSharing synchronization for accounts, deal fields, booking sources, apartments, and events.'
    capabilities:
      - Add, select, and remove ApartSharing accounts from inside Bitrix24
      - Map CRM deal fields, booking sources, and apartments, including text and enumerated fields
      - Manage event auto-synchronization and settings for the selected account
      - Search, filter, and paginate the apartment catalog
    architecture:
      - SDK-first context with timeout, URL fallback, and development environment
      - One API layer spans backend HTTP and Bitrix24 REST while normalizing object/array responses and CRM field shapes
      - Request deduplication, race protection, and lifecycle cleanup
    contribution:
      - Split accounts, fields, sources, apartments, and synchronization settings into focused modules
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
    task: 'Build a production-ready Bitrix24–TTLock UI for accounts, active and reserve locks, common zones, tariffs, and transactions; the wider domain distinguishes online access from one-time offline codes.'
    capabilities:
      - Configure multiple accounts and select the CRM field used for first-entry tracking
      - Search, rename, activate, and deactivate locks; inspect battery/status and manage common-zone state
      - Select tariffs and extra packages, calculate cost, inspect balance, and paginate transaction history
    architecture:
      - Settings and Tariffs separation through Vue Router
      - Component contracts based on props, emits, and computed state
      - Virtualization from 20 items with a safe fallback, keyboard interaction, and reduced-motion support
    contribution:
      - Built the Production UI for two operational areas
      - Implemented filters, copy feedback, lock activation/deactivation/editing, and common-zone controls
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

The pinned snapshot defines seven REST operations for retrieving subscription validity, handlers, and robots and for installing or removing handlers and robots. Bitrix24 context comes from the SDK or URL parameters; production does not use a development environment fallback.

### ApartSharing

The pinned snapshot covers accounts, apartments, CRM fields, sources, and synchronization settings. One integration layer spans backend HTTP and Bitrix24 REST, normalizes object/array response shapes, deduplicates selected GET requests, and cancels stale asynchronous work.

### TTLock

The pinned snapshot verifies the production-ready Settings and Tariffs UI, multi-account workflows, lock lists, tariff calculations, and 11 tests in the pinned commit. It does not verify the backend, a connected TTLock API, or real online/offline code issuance.
