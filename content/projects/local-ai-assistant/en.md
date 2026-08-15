---
slug: local-ai-assistant
locale: en
title: Local AI Assistant
eyebrow: Chrome Extension · contextual agent
status: active
roles: [ai, frontend]
featured: true
summary: A browser assistant understands the active page, answers against its context, and augments responses with web search.
task: Place an AI tool beside the content being viewed without covering the page.
contribution:
  [
    Built the React Side Panel and content scripts,
    Implemented a FastAPI/LangGraph backend and streaming,
  ]
decisions:
  [
    WebSocket with REST fallback,
    Local backend and sensitive-data filtering,
    EXA as a search tool,
  ]
stack: [Chrome MV3, React, TypeScript, FastAPI, LangGraph, DeepSeek, EXA API, WebSockets]
outcome: A client-server agent with tab context, web search, conversation history, and Markdown export.
roleFocus:
  ai: LangGraph orchestration, tools, context handling, streaming, and safety boundaries.
  frontend: Chrome Side Panel, React state, content scripts, streaming UX, and export flows.
links: [{ label: GitHub, href: https://github.com/a197428/local-ai-assistant-extension }]
---
