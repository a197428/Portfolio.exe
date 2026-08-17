---
slug: shortsport-ai-forge
locale: en
title: ShortSport AI Forge
eyebrow: Vue SPA · human-in-the-loop video workflow
status: mvp
roles: [ai, frontend]
featured: true
priority: { ai: 45, frontend: 90 }
summary: A controlled vertical sports-video interface spanning asset upload, storyboard editing, preview, rendering, and manual approval.
task: Bring five-scene preparation, audio, preview, and server rendering into one transparent workflow.
contribution:
  - Built the Vue SPA and a recoverable Pinia workflow
  - Implemented the storyboard editor, browser preview, and approve/reject loop
  - Defined Zod data boundaries and connected the UI to Cloudflare APIs
decisions:
  - Keep final publication decisions with a human reviewer
  - Use five fixed scene roles for predictable composition
  - Separate fast browser preview from final server rendering
capabilities:
  - Source image and audio upload for each project
  - Copy, timing, and visual editing across five scenes
  - Preview, render, approve/reject, and a result library
architecture:
  - Vue Router separates the sequential workflow stages
  - Pinia owns project state and restores persisted sessions defensively
  - Zod validates contracts while Workers, R2, and Workflows support delivery
verification:
  - The pinned snapshot passes typecheck, lint, and production build
  - 43 unit tests and 3 Playwright scenarios pass at the verified commit
  - A public development deployment is available as an interactive demo
stack: [Vue 3, TypeScript, Pinia, Zod, Tailwind CSS, Cloudflare]
outcome: The MVP exposes every production stage while retaining an explicit human approval gate.
roleFocus:
  ai: Designed a verifiable human-in-the-loop flow around AI-assisted content preparation and server rendering.
  frontend: Built the multi-step Vue UI, Pinia state, storyboard editor, preview/render feedback, and typed API contracts.
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

## Verified context

The public snapshot substantiates the client workflow and Cloudflare delivery path. It is a controlled MVP with manual approval, not a claim of autonomous publishing.
