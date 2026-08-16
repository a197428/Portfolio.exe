---
slug: video-sut
locale: en
title: Video Transcriber
eyebrow: Frontend prototype · YouTube contextualization
status: mvp
roles: [ai, frontend]
featured: true
priority: { ai: 40, frontend: 85 }
summary: An interactive frontend prototype for a YouTube video transcription and summarization service, demonstrating complex processing states and bento-style dashboard.
task: Present a professional AI-assisted workflow for extracting structured knowledge from video content.
contribution:
  [
    Designed the user AI scenario from URL input to structured output,
    Built the Next.js/React interface and processing states,
    Developed the responsive bento-dashboard and interaction flows,
    Defined typed application states and the structured result model,
  ]
decisions:
  [
    Focus on high-fidelity frontend states rather than backend complexity for the prototype,
    Use explicit processing stages to build user trust during async operations,
    'Separate input, processing, and result views into focused components',
    'Present summaries, takeaways, timestamps, and actions in a responsive bento layout',
  ]
capabilities:
  [
    YouTube URL input and validation,
    Example prompt presets for quick testing,
    Rich processing states (idle / processing / success / error),
    Five-stage visual processing feedback,
    'Summary, key points, time-codes, and recommendations output',
    Individual block and full result copying,
    Deep links to specific YouTube timestamps,
    Responsive bento-style results dashboard,
  ]
architecture:
  [
    Next.js App Router owns the application shell and client entry point,
    React 19 local state models idle / processing / success / error transitions,
    Typed AppState and VideoResult contracts keep the UI flow explicit,
    Tailwind CSS v4 and Radix-based components form the responsive interface,
    'Dedicated components isolate URL input, progress feedback, examples, and results',
  ]
verification:
  [
    The pinned source snapshot contains the typed four-state UI flow,
    The source renders five simulated processing stages before a structured result,
    'The presentation demonstrates URL input, processing feedback, and the result dashboard',
  ]
stack:
  [
    Next.js 16,
    React 19,
    TypeScript,
    Tailwind CSS v4,
    shadcn/ui,
    Radix UI,
    Vercel Analytics,
  ]
outcome: A high-fidelity interactive prototype that validates the user experience for a video transcription service.
roleFocus:
  ai: Designed the user AI journey—from context extraction and stage orchestration to structured output presentation.
  frontend: Built the Next.js dashboard, processing states, responsive bento layout, typed result model, and interactive components.
source:
  repository: https://github.com/a197428/Video_Transcriber
  commit: 18d998f2fe6ea441ccd2aa15dad9dd4b8bc9e5e8
  verifiedAt: '2026-08-16'
  visibility: private
media:
  poster: /media/video-transcriber-poster.webp
  video: /media/video-transcriber.mp4
---
