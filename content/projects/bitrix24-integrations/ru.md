---
slug: bitrix24-integrations
locale: ru
title: Industrial Bitrix24 integrations
eyebrow: SatelAB · три production-приложения
status: production
roles: [ai, frontend]
featured: true
summary: Единая система из трёх встроенных приложений для эквайринга, недвижимости и умных замков, модернизированная на Vue 3 и TypeScript.
task: Перевести legacy-интерфейсы на современный стек и подготовить устойчивые интеграционные приложения для работы внутри Bitrix24.
contribution:
  - Спроектировал компонентную структуру и централизованные API-слои
  - Реализовал prod/dev контекст, моки, состояния загрузки и обработку ошибок
  - Подготовил сложные бизнес-интерфейсы для ежедневных операций
decisions:
  - Изолировал Bitrix24 context в composables вместо распространения SDK-деталей по UI
  - Сохранил одинаковые клиентские контракты для production API и локальных моков
  - Разделил сложные домены на самостоятельные страницы и компоненты
stack: [Vue 3, TypeScript, Vite, Tailwind CSS, Bitrix24 UI, Vitest]
outcome: Три интеграционных интерфейса получили современную тестируемую основу и готовы к развитию вместе с backend-контрактами.
roleFocus:
  ai: Системная модернизация, интеграционные границы, устойчивость и доведение решений до production.
  frontend: Vue 3, composables, сложные состояния, формы, таблицы, фильтры, пагинация, моки и unit-тесты.
links: []
media:
  poster: /media/bitrix24-acquiring-poster.webp
chapters:
  - id: acquiring
    title: Acquiring & Robots
    video: /media/bitrix24-acquiring.mp4
    poster: /media/bitrix24-acquiring-poster.webp
    task: Управление банковскими обработчиками, подпиской и роботами автоматизации.
    contribution:
      [
        Bitrix SDK context с URL/env fallback,
        централизованный API composable,
        install/uninstall состояния,
      ]
    decisions:
      [Строгий production-режим, dev mocks, параллельная загрузка данных и явные ошибки]
  - id: apartsharing
    title: ApartSharing
    video: /media/bitrix24-apartsharing.mp4
    poster: /media/bitrix24-apartsharing-poster.webp
    task: Синхронизация CRM с платформой управления недвижимостью.
    contribution:
      [
        CRUD аккаунтов,
        сопоставление полей и источников,
        квартиры с фильтрами и пагинацией,
      ]
    decisions: [Модульные вкладки, централизованные helpers, локальная работа через моки]
  - id: ttlock
    title: TTLock Connector
    video: /media/bitrix24-ttlock.mp4
    poster: /media/bitrix24-ttlock-poster.webp
    task: Управление аккаунтами, умными замками, тарифами и транзакциями.
    contribution:
      [Мультиаккаунтность, фильтрация замков, расчёт тарифов, проверки баланса]
    decisions:
      [Разделение Settings/Tariffs, тестируемые компоненты, минимальная связность с API]
---

Один промышленный кейс показывает работу сразу с тремя предметными областями и общими ограничениями встроенных Bitrix24-приложений.
