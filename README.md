
# Сервис управления пользователями
Простой REST‑сервис на Express + TypeScript + Prisma для работы с пользователями.

---

## Технологии и библиотеки

- **Node.js**  
- **TypeScript**
- **Express**
- **Prisma ORM** - работа с PostgreSQL, миграции, сиды
- **JWT** (`jsonwebtoken`) - токены для аутентификации
- **bcryptjs** - хэширование паролей
- **class‑validator / class‑transformer** - валидация и трансформация DTO
- **Swagger (OpenAPI)**  
  - `swagger-jsdoc` - генерация спецификации из JSDoc  
  - `swagger-ui-express` - веб‑интерфейс для документации  
- **Jest + Supertest** - unit и E2E‑тесты
- **Docker + Docker Compose** - контейнеризация

---

## API‑эндпоинты

| Метод | Путь                 | Описание                                                    | Доступ        |
|-------|----------------------|-------------------------------------------------------------|---------------|
| POST  | `/users/register`    | Регистрация (получает DTO, хеширует пароль, создаёт USER)   | Public        |
| POST  | `/users/login`       | Логин (email+пароль => JWT)                                  | Public        |
| GET   | `/users/:id`         | Получить данные пользователя по ID                          | ADMIN или текущий USER |
| GET   | `/users`             | Список всех пользователей                                   | ADMIN    |
| POST  | `/users/:id/block`   | Заблокировать пользователя (или блок себя)                  | ADMIN или текущий USER |

---

## Документация Swagger (OpenAPI)

1. **URL**:  
   После старта сервера - **`http://localhost:3000/api-docs`**  
2. **Что там**:  
   - Описание всех эндпоинтов  
   - Примеры запросов/ответов  
   - Возможность протестировать API из браузера  
3. **Где прописать новые пути**:  
   В контроллерах и в `src/routes/userRoutes.ts` используются JSDoc‑комментарии:
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
JWT_SECRET=af390eaa428957099d1759d0a1260f46762583d0df3e6c9d254b1782113db158
```
Установить зависимости и запустить:

```bash
npm ci
npm run dev      # сервер <http://localhost:3000>
```
Для миграций/сида вручную:

был реализован сид для создания админской учетной записи

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
Unit‑тесты: 
```bash
npm run test
```
Запуск покрытия:
```bash
npm run test -- --coverage
```
Итоговый отчёт лежит в папке coverage.

Что реализовано
Слоистая архитектура: чёткое разделение контроллеров, сервисов, репозиториев

DTO + валидация через class‑validator

JWT‑аутентификация + middleware для ролей

Prisma: миграции, сид для создания админа

Swagger-документация

Unit + E2E тесты

Docker: контейнеризация приложения и БД

Чёткая типизация в TypeScript

Обработка ошибок через централизованный errorHandler

Вынесенные константы и enum (UserRole, UserStatus)

Токен-валидность 1 час + секрет из .env

ESLint и Prettier для единообразного стиля 


## Результаты проверки эндпоинтов

использовал для тестирования Insomnia

<img width="1232" height="484" alt="image" src="https://github.com/user-attachments/assets/cc7873aa-3d42-4417-a371-e4e136dc6535" />

<img width="1227" height="454" alt="image" src="https://github.com/user-attachments/assets/d55068dc-7458-4fb0-8449-cc9bc1408042" />

<img width="1213" height="419" alt="image" src="https://github.com/user-attachments/assets/28e25783-25e0-481b-bd5d-94c6cbab9f9b" />

<img width="1228" height="433" alt="image" src="https://github.com/user-attachments/assets/06ab6114-84db-4823-9f34-a337c1c9640d" />

<img width="1244" height="689" alt="image" src="https://github.com/user-attachments/assets/14e70a90-ebb9-4c54-9ce9-9d7b9f9ceebf" />

<img width="1221" height="441" alt="image" src="https://github.com/user-attachments/assets/2cd4033d-1180-4905-96d1-2527b7f0773e" />

<img width="1232" height="528" alt="image" src="https://github.com/user-attachments/assets/bb25e0e6-bbbf-4eae-be44-5b8ca07a10f3" />

<img width="1221" height="430" alt="image" src="https://github.com/user-attachments/assets/22d77e22-5fa3-4eee-ab3e-d47561c48f53" />

<img width="1228" height="464" alt="image" src="https://github.com/user-attachments/assets/6d5d2024-7978-439d-bd1e-7024145dd3e8" />

<img width="1244" height="689" alt="image" src="https://github.com/user-attachments/assets/e56ae259-5a58-49bc-a1b3-ae621ffd37b9" />


### Результаты тестов

<img width="899" height="732" alt="image" src="https://github.com/user-attachments/assets/83e12ba5-a492-42df-b57f-d2709049a2a1" />


### Работа сервиса в контейнере

<img width="1240" height="852" alt="image" src="https://github.com/user-attachments/assets/0390967b-f901-4a4b-a246-b172378a1202" />

<img width="1551" height="848" alt="image" src="https://github.com/user-attachments/assets/5bf50e58-c281-42bb-8dc7-e926c136f7ff" />
