---
slug: video-sut
locale: en
title: VideoSut
eyebrow: AI SaaS · YouTube summaries
status: active
roles: [ai, frontend]
featured: false
summary: A SaaS product creates structured YouTube summaries with credits, authentication, and caching.
task: Turn long videos into a quickly readable main idea, key points, and conclusion.
contribution:
  [
    Built the full-stack application and AI flow,
    Implemented auth,
    credits,
    cache,
    and validation,
  ]
decisions:
  [
    Unified Next.js App Router,
    Redis TTL and rate limiting,
    Supabase RLS and API fallbacks,
  ]
stack: [Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Supabase, Redis, Gemini, Zod]
outcome: An architecture for a monetizable AI service with daily free credits.
roleFocus:
  ai: LLM summarization, validation, caching, fallbacks, and usage controls.
  frontend: Full-stack React UX, authentication, credits, and structured summary views.
links: []
---
