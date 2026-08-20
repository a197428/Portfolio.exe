---
slug: video-sut
locale: en
title: Video Transcriber
eyebrow: LLM pipeline · YouTube transcription
status: mvp
roles: [ai, frontend]
featured: true
priority: { ai: 40, frontend: 85 }
summary: A service extracts a Russian YouTube transcript and summarizes it with DeepSeek v3.2 before presenting the result in a bento dashboard.
task: Turn a YouTube URL into a readable expert brief with a main idea, key takeaways, conclusion, and timestamps.
contribution:
  [
    Designed the user AI scenario from URL input to structured output,
    Built the Next.js/React interface and processing states,
    Integrated Supadata and RouterAI/DeepSeek into a protected API pipeline,
    Developed the responsive bento-dashboard and interaction flows,
    Defined typed application states and the structured result model,
  ]
decisions:
  [
    Limit the LLM to summarizing an existing transcript without agent architecture,
    tool calling,
    RAG,
    or memory,
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
    'Authentication, rate limiting, credit charging, and a seven-day result cache',
  ]
architecture:
  [
    Next.js App Router owns the application shell and client entry point,
    React 19 local state models idle / processing / success / error transitions,
    Typed AppState and VideoResult contracts keep the UI flow explicit,
    Tailwind CSS v4 and Radix-based components form the responsive interface,
    'Dedicated components isolate URL input, progress feedback, examples, and results',
    'Supadata returns the Russian transcript; RouterAI calls deepseek/deepseek-v3.2 with temperature 0.3 and top_p 0.95',
  ]
verification:
  [
    The pinned source snapshot contains the typed four-state UI flow,
    'The verified pipeline extracts a transcript and sends it to the LLM after auth, rate-limit, and credit checks',
    'The LLM returns Markdown with a main idea, 3–7 takeaways, and a conclusion without promotional noise',
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
    Supadata,
    DeepSeek v3.2,
    RouterAI,
  ]
outcome: The MVP combines real transcription, narrowly scoped LLM summarization, and a responsive result experience.
roleFocus:
  ai: Designed a controlled Supadata → RouterAI/DeepSeek → cached-summary pipeline with explicit boundaries on LLM use.
  frontend: Built the Next.js dashboard, processing states, responsive bento layout, typed result model, and interactive components.
source:
  repository: https://github.com/a197428/Video_Transcriber
  commit: 18d998f2fe6ea441ccd2aa15dad9dd4b8bc9e5e8
  verifiedAt: '2026-08-16'
  visibility: private
media:
  poster: /media/video-transcriber-poster.webp
  video: /media/video-transcriber.mp4
cardPreview: /image/preview/Video Transcriber.png
---
