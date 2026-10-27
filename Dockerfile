# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm install -g pnpm@12
WORKDIR /app

FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm prisma generate && pnpm build

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Schema and config go in before `pnpm install` so `prisma generate` (postinstall)
# can rebuild the client for production.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml prisma.config.ts next.config.ts ./
COPY prisma ./prisma
COPY src/lib/database.ts ./src/lib/database.ts
RUN pnpm install --frozen-lockfile --prod

COPY --from=build /app/.next ./.next

EXPOSE 3000

# Apply pending migrations, then serve. Both are idempotent.
CMD ["sh", "-c", "pnpm prisma migrate deploy && exec pnpm next start"]
