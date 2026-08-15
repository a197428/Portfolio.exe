---
slug: local-ai-assistant
locale: ru
title: Local AI Assistant
eyebrow: Chrome Extension · контекстный агент
status: active
roles: [ai, frontend]
featured: true
summary: Браузерный помощник анализирует текущую страницу, отвечает по её контексту и дополняет ответы web-поиском.
task: Дать пользователю AI-инструмент рядом с просматриваемым контентом, не перекрывая страницу.
contribution:
  [
    Создал React Side Panel и content scripts,
    Реализовал FastAPI/LangGraph backend и streaming,
  ]
decisions:
  [
    WebSocket с REST fallback,
    Локальный backend и фильтрация чувствительных данных,
    EXA как search tool,
  ]
stack: [Chrome MV3, React, TypeScript, FastAPI, LangGraph, DeepSeek, EXA API, WebSockets]
outcome: Клиент-серверный агент с контекстом вкладки, web-поиском, историей и экспортом в Markdown.
roleFocus:
  ai: LangGraph orchestration, tools, context handling, streaming, and safety boundaries.
  frontend: Chrome Side Panel, React state, content scripts, streaming UX, and export flows.
links: [{ label: GitHub, href: https://github.com/a197428/local-ai-assistant-extension }]
---
