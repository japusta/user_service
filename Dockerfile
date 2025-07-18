FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# 1) Копируем package.json отдельно для кеширования
COPY package*.json ./

# 2) Ставим все зависимости (prod+dev) с повторами
RUN npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm ci || npm ci || npm ci

# 3) Копируем остальные файлы
COPY . .

# 4) Генерируем Prisma-клиент
RUN npx prisma generate --schema=src/prisma/schema.prisma

# 5) Билдим TS в папку dist/
RUN npm run build

# 6) Удаляем dev-зависимости
RUN npm prune --production

# ─── STAGE 2: Production ─────────────────────────
FROM node:20-alpine
WORKDIR /usr/src/app

# 1) Копируем только production-зависимости
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

# 2) Копируем билд и схему Prisma
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/src/prisma ./prisma

EXPOSE 3000

# 3) Запускаем приложение
CMD ["sh", "-c", "npm run prisma:migrate && npm run seed:prod && npm run start"]

