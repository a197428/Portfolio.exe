---
key: llm-projects
locale: en
title: Four projects using LLMs
href: /#projects
route: /#projects
roles: [ai, frontend]
---

## Verified list

Exactly four portfolio projects use LLMs: Local AI Assistant, Video Transcriber, Neurosport TMA, and Read-Close-Bot. ShortSport AI Forge does not call an LLM; “AI-assisted” describes its controlled preparation and rendering workflow.

## Local AI Assistant

DeepSeek runs inside a LangGraph agent. The model answers from sanitized active-tab context and can select EXA Search/Answer tools. FastAPI serves WebSocket streaming and a REST fallback. It is the only one of the four with a verified agent graph and tool calling.

## Video Transcriber

Supadata extracts a Russian YouTube transcript, then RouterAI calls deepseek/deepseek-v3.2 for summarization. The model produces a main idea, 3–7 takeaways, and a conclusion while repairing readability and excluding promotional noise. The API applies authentication, rate limiting, credit charging, and a seven-day cache. It has no agent architecture, tool calling, RAG, memory, or multimodal video analysis.

## Neurosport TMA

The LLM is called only from the Cloudflare Worker. The free nvidia/nemotron-3-super-120b-a12b:free model through OpenRouter is primary; RouterAI with deepseek/deepseek-v3.2 is a technical fallback. The pipeline normalizes sports markets into RU/EN statements and Yes/No criteria with temperature=0, Zod validation, D1 auditing, and backoff. Sponsor translations remain pending_review. Automation is implemented but currently disabled by a kill switch; the legacy Tavily pilot is inactive.

## Read-Close-Bot

The fully working Cloudflare Worker uses deepseek/deepseek-v3.2 through RouterAI for article analysis, scoring, and answers over its technical-article database. The bot is intentionally paused to avoid paid token spend; it is neither broken nor unfinished.
