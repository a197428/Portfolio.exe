---
key: llm-projects
locale: ru
title: Четыре проекта с LLM
href: /#projects
route: /#projects
roles: [ai, frontend]
relatedProjects: [local-ai-assistant, video-sut, neurosport-tma, read-close-bot]
---

## Подтверждённый список

LLM используются ровно в четырёх проектах портфолио: Local AI Assistant, Video Transcriber, Neurosport TMA и Read-Close-Bot. ShortSport AI Forge не вызывает LLM: его формулировка AI-assisted относится к управляемому workflow подготовки и рендера.

## Local AI Assistant

DeepSeek работает внутри LangGraph-агента. Модель отвечает по очищенному контексту активной вкладки и может выбрать инструменты EXA Search/Answer. FastAPI обслуживает WebSocket streaming и REST fallback. Это единственный из четырёх проектов с подтверждёнными agent graph и tool calling.

## Video Transcriber

Supadata извлекает русский транскрипт YouTube-видео, после чего RouterAI вызывает deepseek/deepseek-v3.2 для суммаризации. Модель формирует главную мысль, 3–7 тезисов и итог, восстанавливает читаемость и исключает рекламный шум. API применяет авторизацию, rate limit, списание кредита и cache на семь дней. Здесь нет agent architecture, tool calling, RAG, памяти или мультимодального анализа видео.

## Neurosport TMA

LLM вызывается только из Cloudflare Worker. Primary — бесплатная nvidia/nemotron-3-super-120b-a12b:free через OpenRouter; RouterAI с deepseek/deepseek-v3.2 используется только как технический fallback. Pipeline нормализует спортивные рынки в RU/EN-утверждения и критерии Yes/No при temperature=0, Zod-валидации, D1-аудите и backoff. Переводы спонсорских кампаний сохраняются как pending_review. Автоматизация реализована, но сейчас отключена kill switch; legacy Tavily-пилот не активен.

## Read-Close-Bot

Полностью рабочий Cloudflare Worker использует deepseek/deepseek-v3.2 через RouterAI для анализа, scoring и ответов по базе технических статей. Бот намеренно отключён, чтобы не расходовать платные токены; это не означает поломку или незавершённость проекта.
