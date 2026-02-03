FROM node:20-bookworm AS builder

WORKDIR /app

# Chỉ copy frontend manifest
COPY frontend/package.json frontend/package-lock.json ./

# Install frontend deps ONLY
RUN npm ci

# Copy source
COPY frontend ./
COPY shared ../shared

# Build
RUN npm run build

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
