---
slug: video-sut
locale: ru
title: ВидеоСуть
eyebrow: AI SaaS · YouTube summaries
status: active
roles: [ai, frontend]
featured: false
summary: SaaS генерирует структурированные текстовые саммари YouTube-видео с кредитами, аутентификацией и кэшированием.
task: Превратить длинное видео в быстро читаемую главную мысль, тезисы и вывод.
contribution:
  [Собрал full-stack приложение и AI flow, Реализовал auth, credits, cache и validation]
decisions:
  [Единый Next.js App Router, Redis TTL и rate limiting, Supabase RLS и API fallbacks]
stack: [Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Supabase, Redis, Gemini, Zod]
outcome: Архитектура монетизируемого AI-сервиса с ежедневными бесплатными кредитами.
roleFocus:
  ai: LLM summarization, validation, caching, fallbacks, and usage controls.
  frontend: Full-stack React UX, authentication, credits, and structured summary views.
links: []
---
