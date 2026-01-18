FROM node:24.13.0-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm i
RUN mkdir -p node_modules/.vite && chmod -R 777 node_modules/.vite
COPY . .
ENV DATABASE_URL=postgres://postgres:mysecretpassword@db:5432/postgres
RUN npm run build
RUN npm prune --production

FROM node:24.13.0-alpine AS runner
WORKDIR /app
USER node:node
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
EXPOSE 3000 
ENV PORT=3000
ENV NODE_ENV=production
ENV DATABASE_URL=postgres://postgres:mysecretpassword@db:5432/postgres
ENV ORIGIN=http://localhost:3000
CMD ["node", "build"]