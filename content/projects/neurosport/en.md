---
slug: neurosport
locale: en
title: Neurosport
eyebrow: Vue platform · new sport predictions
status: mvp
roles: [frontend]
featured: true
priority: { ai: 0, frontend: 80 }
summary: A bilingual public site for a new sport where participants score on predictions of match outcomes and micro-events, from online selection to national, continental, and world finals.
task: Explain the sport format and future institutional structure through a credible public prototype without operational backends.
contribution:
  - Built bilingual routes for rules, competitions, federations, academy, data room, and news
  - Composed the online-selection-to-finals narrative with event and athlete cards
  - Implemented the Three.js hero scene and a typed localized content layer
decisions:
  - Present working cabinets, auth, and backend only as concept content, not claims
  - Keep public demo material local and typed instead of fetching a live API
  - Structure navigation around the future federation and academy model
capabilities:
  - Public demo of a new sport with scoring on global match outcomes
  - Micro-event predictions for pass, goal, dribbling, direction, shot, and out
  - Journey from online selection to national, continental, and world finals
  - Sections for rules, competitions, federations, academy, data room, and news
architecture:
  - Vue Router maps RU/EN routes to sport, competition, and federation pages
  - A typed content layer keeps demo material separated from components
  - Three.js renders the animated hero scene with a reduced-motion fallback
  - vue-i18n provides equivalent RU/EN interface copy
verification:
  - The pinned commit passes typecheck, lint, and the production build
  - A typed content spec covers the bilingual data layer
  - Six Playwright scenarios cover the main user journeys at the pinned commit
  - Operational backends and personal offices are presented as concept content only
stack: [Vue 3, TypeScript, Vue Router, vue-i18n, Three.js, Tailwind CSS]
outcome: The MVP prototype explains the sport format, prediction model, and institutional roadmap in one responsive bilingual site.
roleFocus:
  ai: The prediction and scoring model is presented as product copy without claiming a production-ready AI system.
  frontend: Designed routes, the Three.js hero, typed content, i18n, and the responsive prototype experience.
source:
  repository: https://github.com/a197428/Neurosport
  commit: 7d4fdef4191d2be96e564902af768b26001a136b
  verifiedAt: '2026-08-18'
  visibility: public
links:
  [
    { label: Live demo, href: https://dev.neurosport.pages.dev/, kind: demo },
    { label: GitHub, href: https://github.com/a197428/Neurosport, kind: source },
  ]
media: { poster: /media/neurosport.webp }
cardPreview: /image/preview/Neurosport.png
---

## Verified context

The pinned public commit substantiates the demo pivot: a bilingual prototype with typed content, a Three.js scene, and an explicit boundary between concept material and implemented claims.
