# Build step
FROM node:20 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Serve step with nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
