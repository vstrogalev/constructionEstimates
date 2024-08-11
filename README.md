# Таблица сметы на СМР 
Задача: реализовать страницу по шаблону фигма, где реактивным компонентом должна быть только таблица. Остальная часть реализуется без логики

## Стек: TypeScript, React, SASS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/assets/ — папка с материалами
- src/common/ — папка с константами и общим кодом
- src/components/ — папка с компонентами
- src/pages/ — папка со страницами
- src/sass/ — папка со стилями и шрифтами

Важные файлы:
- src/components/App/App.tsx - корневое приложение

## Установка и запуск
**Важно** Запросы бэк принимает только по http, поэтому в dev режиме прекрасно работает, а с github pages запросы блокируются. 
Для полноценной работы приложения необходимо запускать на локальном сервере.

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
