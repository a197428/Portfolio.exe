---
slug: energo-ai
locale: en
title: EnergoAI
eyebrow: Vue product site · energy intelligence
status: active
roles: [frontend]
featured: true
priority: { ai: 0, frontend: 60 }
summary: A bilingual Vue interface for an energy AI product, built around a Tailwind v4 design system, SVG infrastructure, and an interactive model catalog.
task: Present a complex energy platform through clear structure, expressive visualization, and responsive product journeys.
contribution:
  - Built the section architecture and typed RU/EN content layer
  - Implemented the SVG neural sphere and infrastructure diagram
  - Developed the solution accordion, model carousel, and responsive navigation
decisions:
  - Keep localized content separate from visual components
  - Build complex illustrations as controllable SVG rather than raster assets
  - Respect reduced motion and clean up effects on unmount
capabilities:
  - Bilingual routing with equivalent product pages
  - Interactive diagrams, accordion, and model carousel
  - Responsive UI with scrollspy and keyboard navigation
architecture:
  - Vue Router owns locale-aware routes
  - Composables encapsulate i18n, scrollspy, and user preferences
  - Tailwind v4 tokens provide a unified design system
verification:
  - Full verification passes typecheck, lint, formatting, and production build
  - 16 unit tests and 15 Playwright scenarios pass at the pinned commit
  - A public deployment is available as a live demo
stack: [Vue 3, TypeScript, Tailwind CSS v4, Vue Router, SVG, Vitest]
outcome: The product site turns a technically complex subject into a coherent bilingual and responsive experience.
roleFocus:
  ai: Product copy explains AI capabilities without replacing the verifiable UI implementation with unsupported technical claims.
  frontend: Built the Vue composition, typed content layer, SVG visualization, interactive sections, and complete test pipeline.
source:
  repository: https://github.com/a197428/EnergoAI
  commit: 2fe165e50e1354180c094b8a08ce86a755dc4506
  verifiedAt: '2026-08-15'
  visibility: private
links: [{ label: Live demo, href: https://energoai.pages.dev/, kind: demo }]
media: { poster: /media/energo-ai.webp }
---

## Verified context

The local repository was used to verify architecture and tests. Only the live demo is exposed in the public interface.
