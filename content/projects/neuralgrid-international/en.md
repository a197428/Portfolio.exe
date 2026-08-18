---
slug: neuralgrid-international
locale: en
title: NeuralGrid International
eyebrow: React landing · bilingual canvas site
status: active
roles: [frontend]
featured: true
priority: { ai: 0, frontend: 70 }
summary: A bilingual React 19 technology landing with a fixed Canvas scene, GSAP scroll motion, and localized SEO data.
task: Present a complex technology proposition as a fast, bilingual, single-page experience with controlled scroll motion.
contribution:
  - Built componentized sections over a shared React design system
  - Implemented the fixed Canvas scene and GSAP/Lenis scroll choreography
  - Added RU/EN routes with localized SEO metadata
decisions:
  - Keep the Canvas scene fixed while GSAP animates the scroll reveals
  - Use Lenis for smooth scrolling and React Router for locale-aware routes
  - Localize SEO data alongside the interface copy
capabilities:
  - Bilingual landing with / and /ru routes
  - Fixed animated Canvas scene and GSAP ScrollTrigger reveals
  - Lenis smooth scrolling and responsive navigation
  - Localized SEO metadata per locale
architecture:
  - React 19 with component sections over one design system
  - A dedicated Canvas component owns the fixed background scene
  - Hooks encapsulate GSAP ScrollTrigger, Lenis, and cleanup
  - An i18n provider owns dictionaries and the SEO hook
verification:
  - The pinned commit passes the production build
  - No test suite is present, so claims are limited to verified build facts
  - The locale route also matches unknown one-segment paths, which is documented debt
  - The navigation wordmark behavior is documented as unverified
stack: [React 19, TypeScript, Tailwind CSS, GSAP, Lenis, Canvas]
outcome: A visually rich bilingual landing that stays responsive while the production build and known debt are honestly documented.
roleFocus:
  ai: The visual language explains the technology proposition without model claims.
  frontend: Built the React section architecture, Canvas scene, GSAP/Lenis motion, i18n, and localized SEO.
source:
  repository: https://github.com/a197428/NeuralGrid
  commit: 86258e72e362d648c6129aeb6a4c0e0b35b0f7b1
  verifiedAt: '2026-08-18'
  visibility: public
links:
  [
    { label: Live demo, href: https://neuralgrid.pages.dev/, kind: demo },
    { label: GitHub, href: https://github.com/a197428/NeuralGrid, kind: source },
  ]
media: { poster: /media/neuralgrid-international.webp }
cardPreview: /image/preview/NeuralGrid International.png
---

## Verified context

The pinned public commit shows a componentized React 19 landing: a fixed Canvas scene, GSAP ScrollTrigger reveals with Lenis smoothing, RU/EN routes, and localized SEO data. The production build passes; the absence of a test suite and the known routing debt are documented honestly rather than overstated.
