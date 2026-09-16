FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Copy workspace files
COPY . .

# Install all dependencies
RUN pnpm install --no-frozen-lockfile

# Build frontend (React Vite) then API server (Express)
RUN BASE_PATH=/ pnpm --filter @workspace/veylora-global run build
RUN pnpm --filter @workspace/api-server run build

ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "--enable-source-maps", "artifacts/api-server/dist/index.mjs"]
