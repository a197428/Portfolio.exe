---
slug: shortsport-ai-forge
locale: ru
title: ShortSport-AI-Forge
eyebrow: Agent pipeline · sports video
status: mvp
roles: [ai]
featured: false
summary: Конвейер AI-агентов для поиска моментов, микро-прогнозов, post-factum валидации и рендера коротких спортивных видео.
task: Автоматизировать создание вертикальных роликов на основе событий реальных матчей.
contribution:
  [
    Спроектировал модульный pipeline и coordinator,
    Определил validation,
    scoring,
    rendering и QA stages,
  ]
decisions:
  [
    Специализированный агент на этап,
    Retry-aware orchestration,
    Stateless workers для масштабирования,
  ]
stack: [Python, LangGraph, FFmpeg, Remotion, Computer Vision, LLM agents]
outcome: Архитектура MVP с frame-accurate синхронизацией успешных прогнозов и оверлеев.
roleFocus:
  ai: Multi-agent pipeline, validation, orchestration, and computer vision integration.
  frontend: Rendered overlays and vertical-video presentation.
links: [{ label: GitHub, href: https://github.com/a197428/ShortSport-AI-Forge }]
---
