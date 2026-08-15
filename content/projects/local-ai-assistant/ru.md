---
slug: local-ai-assistant
locale: ru
title: Local AI Assistant
eyebrow: Chrome Extension · контекстный AI-агент
status: active
roles: [ai]
featured: true
summary: Браузерный AI-помощник использует контекст активной страницы, ведёт диалог в Side Panel и подключает web-поиск, когда данных страницы недостаточно.
task: Создать локально управляемого AI-агента рядом с просматриваемым контентом — без переключения вкладок и перекрытия страницы.
contribution:
  - Спроектировал клиент-серверный контур Chrome Extension → FastAPI → LangGraph
  - Реализовал React Side Panel, content script и background service worker
  - Собрал агентный граф с LLM и инструментами EXA Search / Answer
  - Реализовал WebSocket-поток, REST fallback, историю и экспорт диалога
decisions:
  - Использовать Side Panel API как постоянный рабочий контекст рядом со страницей
  - Передавать очищенный и ограниченный контекст вместо полного DOM
  - Оставить backend локальным и хранить ключи провайдеров вне расширения
  - Разделить статусы thinking, searching, responding, token, done и error
capabilities:
  - Ответы по содержимому активной вкладки
  - Web-поиск и готовый ответ через инструменты EXA
  - Потоковое отображение ответа и статуса работы агента
  - История сессии и экспорт разговора в Markdown
architecture:
  - Chrome MV3 Side Panel запрашивает контекст через background service worker
  - Content script извлекает текст, метаданные и безопасное описание форм
  - FastAPI предоставляет WebSocket и REST-контракты для диалога
  - LangGraph выбирает между ответом модели и вызовом поисковых инструментов
verification:
  - Защищённые browser URL блокируются до извлечения контекста
  - Значения полей форм не собираются; чувствительные типы и имена исключаются
  - В коде заданы лимиты сообщения, контекста, WebSocket payload, истории и времени жизни сессии
  - 15 компонентных тестов покрывают WebSocket lifecycle, ошибки, REST fallback, streaming и privacy indicators
stack:
  [Chrome MV3, React 19, TypeScript, FastAPI, LangGraph, DeepSeek, EXA API, WebSockets]
outcome: Рабочий агентный прототип объединяет контекст вкладки, tool calling, потоковый диалог, web-поиск и контролируемые privacy-границы.
roleFocus:
  ai: Спроектировал полный агентный цикл — от подготовки контекста и маршрутизации инструментов до streaming-протокола, деградации транспорта и ограничений безопасности.
  frontend: Chrome Side Panel, React state, content scripts, streaming UX, and export flows.
source:
  repository: https://github.com/a197428/local-ai-assistant-extension
  commit: 3e76a56162d9d56c3f22014c4c786de1a2d7a8f5
  verifiedAt: '2026-08-15'
links: [{ label: GitHub, href: https://github.com/a197428/local-ai-assistant-extension }]
media:
  poster: /media/local-ai-assistant-poster.webp
  video: /media/local-ai-assistant.mp4
---

## Доказательный контекст

Публичный снимок показывает архитектуру активного прототипа. Он подтверждает реализацию браузерного клиента, локального API, агентного графа и защитных ограничений, но не используется как основание для заявления о production-ready статусе.
