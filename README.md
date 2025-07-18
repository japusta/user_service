# Сервис управления пользователями

Простой REST‑сервис на Express + TypeScript + Prisma для работы с пользователями.

---

## Технологии и библиотеки

- **Node.js 20 (Alpine)**  
- **TypeScript** — строгая типизация
- **Express** — HTTP‑сервер
- **Prisma ORM** — работа с PostgreSQL, миграции, сиды
- **JWT** (`jsonwebtoken`) — токены для аутентификации
- **bcryptjs** — безопасное хеширование паролей
- **class‑validator / class‑transformer** — валидация и трансформация DTO
- **Swagger (OpenAPI)**  
  - `swagger-jsdoc` — генерация спецификации из JSDoc  
  - `swagger-ui-express` — веб‑интерфейс для документации  
- **Jest + Supertest** — unit‑ и E2E‑тесты
- **Docker + Docker Compose** — контейнеризация

---

## Структура проекта
├─ src
│ ├─ controllers # HTTP‑роверы — принимают запрос, вызывают service, отвечают

│ ├─ services # Бизнес‑логика

│ ├─ repositories # Доступ к данным через Prisma

│ ├─ middlewares # authMiddleware, adminMiddleware, errorHandler

│ ├─ dto # Data Transfer Objects + валидация class‑validator

│ ├─ prisma # Схема Prisma, сиды

│ ├─ routes # Объявление маршрутов

│ └─ utils # утилиты (например, центр ошибок)

├─ tests # unit + E2E

├─ Dockerfile

├─ docker-compose.yml

├─ tsconfig.json

└─ README.md



---

## API‑эндпоинты

| Метод | Путь                 | Описание                                                    | Доступ        |
|-------|----------------------|-------------------------------------------------------------|---------------|
| POST  | `/users/register`    | Регистрация (получает DTO, хеширует пароль, создаёт USER)   | Public        |
| POST  | `/users/login`       | Логин (email+пароль → JWT)                                  | Public        |
| GET   | `/users/:id`         | Получить данные пользователя по ID                          | ADMIN или own |
| GET   | `/users`             | Список всех пользователей                                   | ADMIN only    |
| POST  | `/users/:id/block`   | Заблокировать пользователя (или self‑block)                  | ADMIN или own |

---

## Документация Swagger (OpenAPI)

1. **URL**:  
   После старта сервера — **`http://localhost:3000/api-docs`**  
2. **Что там**:  
   - Описание всех эндпоинтов  
   - Примеры запросов/ответов  
   - Возможность «пробовать» API прямо из браузера  
3. **Где прописать новые пути**:  
   В контроллерах и/или в `src/routes/userRoutes.ts` используются JSDoc‑комментарии:
   ```ts
   /**
    * @openapi
    * /users/register:
    *   post:
    *     summary: Регистрация нового пользователя
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/RegisterDto'
    *     responses:
    *       201:
    *         description: Пользователь успешно создан
    */


## Запуск
### Локально
Скопировать и заполнить .env (см. пример в .env.example):
```bash
DATABASE_URL=postgresql://postgres:secret@localhost:5432/user_service?schema=public
JWT_SECRET=<любая_сложная_строка>
```
Установить зависимости и запустить:

```bash
npm ci
npm run dev      # сервер <http://localhost:3000>
```
Для миграций/сида вручную:

```bash
npm run prisma:migrate
npm run seed
```
В Docker
```bash
docker-compose up --build
```
# автоматически сделает миграции + сид + старт
# БД на localhost:5432, API на localhost:3000
✅ Тесты и покрытие
Unit‑тесты: npm run test

Запуск покрытия: npm run test -- --coverage

Итоговый отчёт лежит в папке coverage.

🎯 Что реализовано
Слоистая архитектура: чёткое разделение контроллеров, сервисов, репозиториев

DTO + валидация через class‑validator

JWT‑аутентификация + middleware для ролей

Prisma: миграции, сид для создания админа

Swagger-документация

Unit + E2E тесты

Docker: контейнеризация приложения и БД

🛡️ Лучшие практики
Чёткая типизация в TypeScript

Обработка ошибок через централизованный errorHandler

Вынесенные константы и enum (UserRole, UserStatus)

Токен-валидность 1 час + секрет из .env

ESLint и Prettier для единообразного стиля (по желанию)
