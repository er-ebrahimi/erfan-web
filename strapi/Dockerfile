# Stage 1: Install all deps + build
FROM node:20-alpine AS builder
RUN --mount=type=cache,target=/var/cache/apk \
    apk add build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev git python3

WORKDIR /opt
COPY package.json yarn.lock ./
COPY scripts ./scripts
RUN --mount=type=cache,id=yarn-builder,target=/root/.yarn \
    YARN_CACHE_FOLDER=/root/.yarn \
    yarn install --frozen-lockfile --network-timeout 600000

WORKDIR /opt/app
COPY . .

ENV NODE_OPTIONS="--max-old-space-size=2048"
ENV PATH=/opt/node_modules/.bin:$PATH
RUN yarn build

# Stage 2: Production deps (runs in parallel with builder)
FROM node:20-alpine AS prod-deps
RUN --mount=type=cache,target=/var/cache/apk \
    apk add build-base vips-dev python3 bash

WORKDIR /opt/prod-deps
COPY package.json yarn.lock ./
RUN --mount=type=cache,id=yarn-prod,target=/root/.yarn \
    YARN_CACHE_FOLDER=/root/.yarn \
    yarn install --production --network-timeout 600000

# Stage 3: Runtime
FROM node:20-alpine
RUN --mount=type=cache,target=/var/cache/apk \
    apk add --no-cache vips

WORKDIR /opt/app

COPY --from=prod-deps /opt/prod-deps/node_modules ./node_modules
COPY --from=builder /opt/app/dist ./dist
COPY --from=builder /opt/app/.strapi ./.strapi
COPY --from=builder /opt/app/public ./public
COPY --from=builder /opt/app/dist/config ./config
COPY --from=builder /opt/app/package.json ./package.json

RUN mkdir -p .tmp && chmod 777 .tmp

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=2048"
ENV PATH=/opt/app/node_modules/.bin:$PATH

EXPOSE 1337
CMD ["yarn", "start"]