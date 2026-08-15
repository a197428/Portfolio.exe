---
slug: shortsport-ai-forge
locale: en
title: ShortSport-AI-Forge
eyebrow: Agent pipeline · sports video
status: mvp
roles: [ai]
featured: false
summary: An AI-agent pipeline for moment detection, micro-predictions, post-event validation, and short sports video rendering.
task: Automate vertical video production from events in real matches.
contribution:
  [
    Designed the modular pipeline and coordinator,
    Defined validation,
    scoring,
    rendering,
    and QA stages,
  ]
decisions:
  [Specialized agent per stage, Retry-aware orchestration, Stateless workers for scale]
stack: [Python, LangGraph, FFmpeg, Remotion, Computer Vision, LLM agents]
outcome: An MVP architecture with frame-accurate synchronization of successful predictions and overlays.
roleFocus:
  ai: Multi-agent pipeline, validation, orchestration, and computer vision integration.
  frontend: Rendered overlays and vertical-video presentation.
links: [{ label: GitHub, href: https://github.com/a197428/ShortSport-AI-Forge }]
---
