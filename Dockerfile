FROM node:24.13.0-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm i
# container won't build if we dont set vite cache directory permissions
RUN mkdir -p node_modules/.vite && chmod -R 777 node_modules/.vite
COPY . .
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
CMD ["node", "build"]