---
slug: local-ai-assistant
locale: en
title: Local AI Assistant
eyebrow: Chrome Extension · contextual AI agent
status: active
roles: [ai]
featured: true
priority: { ai: 90, frontend: 0 }
summary: A browser AI assistant uses the active page as context, keeps the conversation in a Side Panel, and invokes web research when the page is not enough.
task: Build a locally controlled AI agent beside the content being viewed, without tab switching or covering the page.
contribution:
  - Designed the Chrome Extension → FastAPI → LangGraph client-server flow
  - Built the React Side Panel, content script, and background service worker
  - Implemented an agent graph with an LLM and EXA Search / Answer tools
  - Added WebSocket streaming, REST fallback, conversation history, and export
decisions:
  - Use the Side Panel API as persistent workspace beside the active page
  - Send cleaned and bounded page context rather than the full DOM
  - Keep the backend local and provider credentials outside the extension
  - Model thinking, searching, responding, token, done, and error as explicit states
capabilities:
  - Contextual answers grounded in the active browser tab
  - Web research and direct answers through EXA tools
  - Streaming response and agent-status feedback
  - Session history and Markdown conversation export
architecture:
  - A Chrome MV3 Side Panel requests context through the background service worker
  - The content script extracts text, metadata, and a safe description of forms
  - FastAPI exposes WebSocket and REST conversation contracts
  - LangGraph routes between a model response and search-tool execution
verification:
  - Protected browser URLs are blocked before context extraction
  - Form values are never collected; sensitive types and names are excluded
  - The implementation bounds message, context, WebSocket payload, history, and session lifetime
  - 15 component tests cover WebSocket lifecycle, failures, REST fallback, streaming, and privacy indicators
stack:
  [Chrome MV3, React 19, TypeScript, FastAPI, LangGraph, DeepSeek, EXA API, WebSockets]
outcome: A working agent prototype combines tab context, tool calling, streaming conversation, web research, and explicit privacy boundaries.
roleFocus:
  ai: Designed the complete agent loop—from context preparation and tool routing to the streaming protocol, transport fallback, and safety limits.
  frontend: Chrome Side Panel, React state, content scripts, streaming UX, and export flows.
source:
  repository: https://github.com/a197428/local-ai-assistant-extension
  commit: 3e76a56162d9d56c3f22014c4c786de1a2d7a8f5
  verifiedAt: '2026-08-15'
  visibility: public
links:
  [
    {
      label: GitHub,
      href: https://github.com/a197428/local-ai-assistant-extension,
      kind: source,
    },
  ]
media:
  poster: /media/local-ai-assistant-poster.webp
  video: /media/local-ai-assistant.mp4
---

## Evidence context

The public snapshot demonstrates the architecture of an active prototype. It verifies the browser client, local API, agent graph, and safety constraints, but is not used to claim production-ready status.
