---
slug: neuralgrid-international
locale: en
title: NeuralGrid International
eyebrow: React design system · interactive canvas
status: active
roles: [frontend]
featured: true
priority: { ai: 0, frontend: 70 }
summary: A bilingual React technology site with a bespoke visual system, interactive Canvas scene, and controlled scroll motion.
task: Express a complex technology proposition through a fast, accessible, responsive interface without sacrificing readability.
contribution:
  - Built componentized sections and reusable UI primitives
  - Implemented Canvas visualization and lifecycle-aware animation
  - Prepared RU/EN content, responsive layouts, and accessibility checks
decisions:
  - Isolate Canvas and animation hooks from content components
  - Use GSAP for sequences and Lenis for controlled scrolling
  - Disable decorative movement under prefers-reduced-motion
capabilities:
  - Bilingual routing and complete product sections
  - Interactive Canvas scene and scroll reveals
  - Responsive navigation and accessible controls
architecture:
  - React Router owns locale-aware routes
  - Component sections share one design system
  - Hooks encapsulate Canvas, GSAP, and animation cleanup
verification:
  - The pinned snapshot passes production build and 26 unit tests
  - Playwright and accessibility scenarios are present in the repository
  - A public deployment is available as a live demo
stack: [React 19, TypeScript, Tailwind CSS, Canvas, GSAP, Lenis]
outcome: The visually rich experience remains structured, responsive, bilingual, and keyboard-operable.
roleFocus:
  ai: The visual language explains a technology product without unsupported model claims.
  frontend: Built the React section architecture, design system, Canvas, animation lifecycle, i18n, and accessibility behavior.
source:
  repository: https://github.com/a197428/NeuralGrid
  commit: caa45a33c5af7e9444aa442d50cefa3acb41921f
  verifiedAt: '2026-08-15'
  visibility: private
links: [{ label: Live demo, href: https://neuralgrid.pages.dev/, kind: demo }]
media: { poster: /media/neuralgrid-international.webp }
---

## Verified context

The local commit anchors verified capabilities while the UI exposes only the live demo, not the private source.
