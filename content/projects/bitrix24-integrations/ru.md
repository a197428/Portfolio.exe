---
slug: bitrix24-integrations
locale: ru
title: Industrial Bitrix24 integrations
eyebrow: SatelAB · три production-приложения
status: production
roles: [ai, frontend]
featured: true
priority: { ai: 100, frontend: 100 }
summary: Три встроенных Bitrix24-приложения для эквайринга, управления апартаментами и умными замками, модернизированные на Vue 3 и TypeScript.
task: Перевести три legacy-интерфейса на современный стек, не потеряв контракты доменных API и особенности работы в iframe Bitrix24.
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
    task: Дать администратору Bitrix24 единый iframe-интерфейс для эквайринг-обработчиков, срока подписки и роботов автоматизации.
    capabilities:
      - Контроль срока подписки, доступности и статуса обработчиков
      - Установка и удаление банковских и платёжных обработчиков с учётом карт, СБП, холдирования и чеков
      - Установка и удаление роботов автоматизации Bitrix24
    architecture:
      - Инициализация через Bitrix24 SDK с URL и безопасным dev fallback
      - Типизированный API composable добавляет portal и member_id в query или JSON-body семи REST-операций
      - Параллельная загрузка подписки, обработчиков и роботов; отдельные loading, error, retry и operation states
    contribution:
      - Собрал типизированные таблицы обработчиков и роботов с бейджами, fallback-логотипами и operation feedback
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
    task: 'Настроить внутри Bitrix24 синхронизацию CRM с ApartSharing: аккаунты, поля сделок, источники бронирований, квартиры и события.'
    capabilities:
      - Добавление, выбор и удаление аккаунтов ApartSharing внутри Bitrix24
      - Mapping CRM-полей сделок, источников бронирований и квартир, включая текстовые и списочные поля
      - Управление автосинхронизацией событий и настройками выбранного аккаунта
      - Поиск, фильтрация и пагинация каталога квартир
    architecture:
      - SDK-first контекст с таймаутом, URL fallback и dev-окружением
      - Единый API-слой для backend HTTP и Bitrix24 REST; нормализация object/array ответов и CRM-полей
      - Дедупликация запросов, защита от гонок и очистка lifecycle-эффектов
    contribution:
      - Разделил аккаунты, поля, источники, квартиры и sync settings на самостоятельные модули
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
    task: 'Собрать production-ready UI для Bitrix24–TTLock: аккаунты, активные и резервные замки, общие зоны, тарифы и транзакции; доменно система различает online-доступ и разовые offline-коды.'
    capabilities:
      - Мультиаккаунтные настройки и выбор CRM-поля для фиксации первого ввода
      - Поиск, редактирование, активация и деактивация замков, battery/status и управление общей зоной
      - Выбор тарифа, дополнительные пакеты, динамический расчёт, баланс и пагинация истории транзакций
    architecture:
      - Разделение Settings и Tariffs через Vue Router
      - Компонентные контракты на props/emits и вычисляемое состояние
      - Виртуализация от 20 элементов с fallback, keyboard-управление и prefers-reduced-motion
    contribution:
      - Собрал Production UI двух операционных разделов
      - Реализовал фильтры, copy feedback, активацию, деактивацию, редактирование и общие зоны
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

Проверенный снимок содержит семь REST-операций: получение срока подписки, обработчиков и роботов, а также их install/uninstall-операции. Контекст Bitrix24 читается через SDK или URL; production не использует dev env fallback.

### ApartSharing

Проверенный снимок охватывает аккаунты, квартиры, CRM-поля, источники и настройки синхронизации. Интеграционный слой объединяет backend HTTP и Bitrix24 REST, нормализует object/array-ответы, дедуплицирует часть GET-запросов и отменяет устаревшую асинхронную работу.

### TTLock

Проверенный снимок подтверждает production-ready UI настроек и тарифов, мультиаккаунтные сценарии, списки замков, тарифный расчёт и 11 тестов зафиксированного commit. Текущий источник не подтверждает backend, TTLock API и реальную выдачу online/offline-кодов.
