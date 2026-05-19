# Install dependencies only when needed
FROM node:22-alpine AS deps
WORKDIR /usr/src/app
COPY package*.json ./
COPY .npmrc[c] ./
RUN npm install -g npm@11.6.2 \
    && npm cache clean --force \
    && npm config set fund false \
    && npm config set audit false \
    && npm install --legacy-peer-deps --verbose

# Rebuild the source code only when needed
FROM node:22-alpine AS builder
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=4000

# bring in your built standalone server
COPY --from=builder /usr/src/app/.next/standalone ./
# static assets
COPY --from=builder /usr/src/app/.next/static ./.next/static
COPY --from=builder /usr/src/app/public ./public

EXPOSE 4000
CMD ["node", "server.js"]
