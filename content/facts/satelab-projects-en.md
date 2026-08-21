---
key: satelab-projects
locale: en
title: SatelAB — verified context for three Bitrix24 projects
href: /projects/bitrix24-integrations
route: /projects/bitrix24-integrations
roles: [ai, frontend]
relatedProjects: [bitrix24-integrations]
---

## Commercial context

Alexander has worked as a Frontend Developer at SatelAB since December 2025. While modernizing three legacy applications, he developed embedded Bitrix24 interfaces with Vue 3, TypeScript, Vite, Tailwind CSS, and Bitrix24 UI. His verified scope covers frontend delivery, component architecture, typed API interaction, Bitrix24 integration context, interface states, mocks, and tests. This evidence does not establish authorship of the backend or business metrics.

## Acquiring & Robots

The iframe SPA lets a portal administrator inspect subscription validity, bank and payment handlers, and automation robots and install or remove them. It distinguishes availability from installation state and presents handler support for cards, SBP, holding, and receipt workflows. Seven REST contracts cover subscription, handler, and robot retrieval plus install/remove operations. Portal/member_id context comes from the Bitrix24 SDK or URL, while development mocks are never a production fallback.

Alexander's contribution: typed tables and models, an API composable, production/development environments, parallel loading, loading/error/retry flows, and granular operation feedback.

## ApartSharing

The application connects Bitrix24 with an apartment-management service. Administrators manage ApartSharing accounts, map CRM deal fields, booking sources, and apartments, toggle event synchronization, and search and paginate apartments. The integration layer spans backend HTTP and Bitrix24 REST, normalizes object/array field and source shapes, deduplicates selected requests, and prevents stale asynchronous results from replacing current UI state.

Alexander's contribution: decomposition of accounts, mappings, and synchronization settings; centralized endpoints and types; complex selects and forms; filters, pagination, mocks, and production/development builds.

## TTLock Connector

The product domain covers smart-lock access from Bitrix24, including online workflows and one-time offline codes. The pinned public commit verifies a production-ready UI, not a connected backend or real code issuance. The UI covers multiple accounts, first-entry field configuration, active and reserve locks, search, editing, activation/deactivation, battery and status display, common zones, tariffs, extra packages, balance, and paginated transactions. Long lists are virtualized, and interactive controls support keyboards and reduced motion.

Alexander's contribution: Settings/Tariffs architecture, typed props/emits, lock-list operations, tariff UI, UX states, and component tests. The pinned commit verifies 11 tests; broader assessments and roadmap items are not treated as delivered work.
