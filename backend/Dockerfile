FROM node:20-bookworm-slim

WORKDIR /app/shared
COPY shared/package.json shared/package-lock.json ./
RUN npm ci
COPY shared ./

WORKDIR /app/backend
RUN apt-get update -y && apt-get install -y openssl
COPY backend/package.json backend/package-lock.json ./
RUN npm ci
COPY backend ./
COPY tsconfig.base.json ../tsconfig.base.json

RUN npx prisma generate
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
