---
slug: bitrix24-integrations
locale: ru
title: Industrial Bitrix24 integrations
eyebrow: SatelAB · три production-приложения
status: production
roles: [ai, frontend]
featured: true
priority: { ai: 100, frontend: 100 }
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
cardPreview: /image/preview/Industrial Bitrix24 integrations.png
chapters:
  - id: acquiring
    title: Acquiring & Robots
    status: production-integration
    video: /media/bitrix24-acquiring.mp4
    poster: /media/bitrix24-acquiring-poster.webp
    task: Управление банковскими обработчиками, подпиской и роботами автоматизации.
    capabilities:
      - Контроль срока подписки и доступности обработчиков
      - Установка и удаление эквайринга для банков и платёжных систем
      - Установка и удаление роботов автоматизации Bitrix24
    architecture:
      - Инициализация через Bitrix24 SDK с URL и безопасным dev fallback
      - API composable добавляет portal и member_id в query или тело запроса
      - Параллельная начальная загрузка и независимые состояния операций
    contribution:
      - Собрал типизированный интерфейс обработчиков и роботов
      - Связал UI с production/dev API-контурами
      - Реализовал загрузку, ошибки, повторный запрос и состояние каждой операции
    decisions:
      - Не использовать env-контекст как production fallback
      - Загружать подписку, обработчики и роботов параллельно
      - Обновлять install-состояние только после успешного API-ответа
    verification:
      - В репозитории присутствуют реальные контракты семи API-операций
      - Production-сборка воспроизведена на зафиксированном commit
    roleFocus:
      ai: Изолировал интеграционный контекст и API-контракты, предусмотрел разные среды и явные сценарии отказа.
      frontend: Реализовал таблицы обработчиков и роботов, параллельную загрузку и точечные состояния install/uninstall.
    source:
      repository: https://github.com/a197428/acquiring_frontend
      commit: fb1e7824c368c605af504aec994f65c7679fc836
      verifiedAt: '2026-08-15'
  - id: apartsharing
    title: ApartSharing
    status: production-integration
    video: /media/bitrix24-apartsharing.mp4
    poster: /media/bitrix24-apartsharing-poster.webp
    task: Синхронизация CRM с платформой управления недвижимостью.
    capabilities:
      - CRUD аккаунтов ApartSharing внутри Bitrix24
      - Сопоставление CRM-полей, источников лидов и квартир
      - Поиск, фильтрация и пагинация каталога квартир
    architecture:
      - SDK-first контекст с таймаутом, URL fallback и dev-окружением
      - Нормализация разных форматов API и CRM-полей на границе
      - Дедупликация запросов, защита от гонок и очистка lifecycle-эффектов
    contribution:
      - Разделил аккаунты, квартиры и mappings на самостоятельные модули
      - Централизовал endpoints, типы, нормализацию и API-доступ
      - Подготовил production/dev сборки и локальную работу через моки
    decisions:
      - Сохранять единый клиентский контракт для реального API и моков
      - Дедуплицировать повторные запросы настроек
      - Отменять устаревшие загрузки при смене аккаунта или размонтировании
    verification:
      - Шесть unit-тестов нормализации API и Bitrix24 CRM-полей проходят
      - Production-сборка воспроизведена на зафиксированном commit
    roleFocus:
      ai: Сформировал устойчивую границу между Bitrix24, ApartSharing и неоднородными API-ответами, включая защиту от гонок.
      frontend: Реализовал аккаунты, сложные mapping-формы, селекты, фильтры, пагинацию и связанные состояния интерфейса.
    source:
      repository: https://github.com/a197428/apartsharing-b24_front
      commit: 04c33c1f9d615abb9c341fd788bfb4b2715b6544
      verifiedAt: '2026-08-15'
  - id: ttlock
    title: TTLock Connector
    status: production-ui
    video: /media/bitrix24-ttlock.mp4
    poster: /media/bitrix24-ttlock-poster.webp
    task: Управление аккаунтами, умными замками, тарифами и транзакциями.
    capabilities:
      - Настройки аккаунта и поля первого ввода
      - Активные и доступные замки с поиском и управлением общей зоной
      - Тарифный расчёт, баланс, пакеты замков и история транзакций
    architecture:
      - Разделение Settings и Tariffs через Vue Router
      - Компонентные контракты на props/emits и вычисляемое состояние
      - Виртуализация длинных списков с безопасным fallback без ScrollArea
    contribution:
      - Собрал Production UI двух операционных разделов
      - Реализовал поиск, активацию, деактивацию и редактирование замков
      - Покрыл ключевые компоненты поведения unit-тестами
    decisions:
      - Отделить настройки интеграции от тарификации
      - Включать виртуализацию только для больших списков
      - Сохранить UI-контракты готовыми к замене локальных данных на API
    verification:
      - Все 11 component-тестов публичного снимка проходят
      - Публичный снимок использует локальные данные и не имитирует подключённый TTLock API
    roleFocus:
      ai: Спроектировал Production UI как проверяемую границу будущей интеграции, отделив доменные сценарии от источника данных.
      frontend: Реализовал адаптивные настройки и тарифы, фильтрацию и виртуализацию списков, модальные сценарии и component-тесты.
    source:
      repository: https://github.com/a197428/TTLock_Connector_Frontend
      commit: 9b8a91ad48c9ebf7540180ea1b941f5843b4714d
      verifiedAt: '2026-08-15'
---

## Evidence dossier

### Acquiring

Проверенный снимок содержит контракты получения срока подписки, обработчиков и роботов, а также установки и удаления обработчиков и роботов. Контекст Bitrix24 читается через SDK, URL-параметры или dev-конфигурацию; production не использует env fallback.

### ApartSharing

Проверенный снимок охватывает аккаунты, квартиры, CRM-поля, источники и настройки синхронизации. Интеграционный слой нормализует неоднородные ответы, дедуплицирует часть GET-запросов и защищает интерфейс от устаревших асинхронных результатов.

### TTLock

Проверенный снимок подтверждает Production UI настроек и тарифов, работу со списками замков и 11 component-тестов. Данные в публичной версии локальные; подключение к реальному TTLock API этим источником не подтверждается.
