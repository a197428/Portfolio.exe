---
slug: video-sut
locale: ru
title: Video Transcriber
eyebrow: LLM pipeline · YouTube transcription
status: mvp
roles: [ai, frontend]
featured: true
priority: { ai: 40, frontend: 85 }
summary: Сервис извлекает русскоязычный транскрипт YouTube-видео и суммаризует его через DeepSeek v3.2, выводя результат в bento-дашборде.
task: Превратить YouTube URL в читаемый экспертный конспект с главной мыслью, тезисами, выводом и тайм-кодами.
contribution:
  [
    Проектирование пользовательского AI-сценария от URL до структурированного результата,
    Реализация Next.js/React-интерфейса и состояний обработки,
    Интеграция Supadata и RouterAI/DeepSeek в защищённый API pipeline,
    Разработка адаптивного bento-дашборда и логики взаимодействия,
    Определение типизированных состояний приложения и модели результата,
  ]
decisions:
  [
    Ограничить LLM суммаризацией готового транскрипта без agent architecture,
    tool calling,
    RAG и памяти,
    Использование явных стадий обработки для формирования доверия пользователя при асинхронных операциях,
    'Разделение ввода, обработки и результата на сфокусированные компоненты',
    'Представление саммари, тезисов, тайм-кодов и действий в адаптивной bento-раскладке',
  ]
capabilities:
  [
    Ввод и валидация YouTube URL,
    Предустановленные примеры запросов для быстрого тестирования,
    Насыщенные состояния обработки (idle / processing / success / error),
    Пятиступенчатый визуальный фидбек процесса обработки,
    'Вывод summary, ключевых тезисов, тайм-кодов и рекомендаций',
    Копирование отдельных блоков и всего результата целиком,
    Переходы к соответствующим тайм-кодам YouTube,
    Адаптивный bento-дашборд результатов,
    'Авторизация, rate limit, списание кредита и cache результата на 7 дней',
  ]
architecture:
  [
    Next.js App Router формирует оболочку приложения и клиентскую точку входа,
    Локальное состояние React 19 моделирует переходы idle / processing / success / error,
    Типы AppState и VideoResult явно фиксируют контракт интерфейсного сценария,
    Tailwind CSS v4 и компоненты на основе Radix формируют адаптивный интерфейс,
    'Отдельные компоненты изолируют ввод URL, прогресс, примеры и результат',
    'Supadata возвращает русский транскрипт; RouterAI вызывает deepseek/deepseek-v3.2 с temperature 0.3 и top_p 0.95',
  ]
verification:
  [
    Закреплённый снимок исходного кода содержит типизированный сценарий из четырёх состояний,
    Проверенный pipeline извлекает транскрипт и отправляет его в LLM после auth/rate-limit/credit проверок,
    LLM возвращает Markdown с главной мыслью 3–7 тезисами и итогом без рекламного шума,
    'Презентация демонстрирует ввод URL, обратную связь обработки и дашборд результата',
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
outcome: MVP объединяет реальную транскрибацию, узко ограниченную LLM-суммаризацию и адаптивное представление результата.
roleFocus:
  ai: Спроектировал контролируемый pipeline Supadata → RouterAI/DeepSeek → cached summary с явными границами применения LLM.
  frontend: Реализация Next.js дашборда, состояний обработки, адаптивной bento-раскладки, типизированной модели результата и интерактивных компонентов.
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
