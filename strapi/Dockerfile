# Multi-stage build for the staging Strapi image.
# The existing production image is built outside this repo and is not replaced by this file.

FROM node:22-alpine AS base
RUN apk add --no-cache \
    build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev python3

FROM base AS deps
WORKDIR /opt/app
# postinstall reads ./scripts/updateUuid.js, so the folder must exist before yarn install.
COPY package.json yarn.lock ./
COPY scripts ./scripts
RUN yarn config set network-timeout 600000 -g && yarn install --frozen-lockfile

FROM deps AS build
ENV NODE_ENV=production
WORKDIR /opt/app
COPY . .
RUN yarn build

FROM base AS prod-deps
WORKDIR /opt/app
COPY package.json yarn.lock ./
COPY scripts ./scripts
RUN yarn config set network-timeout 600000 -g && yarn install --frozen-lockfile --production

FROM node:22-alpine AS runtime
RUN apk add --no-cache vips
ENV NODE_ENV=production
ENV PATH=/opt/app/node_modules/.bin:$PATH
ENV HOME=/tmp
WORKDIR /opt/app

COPY --from=prod-deps /opt/app/node_modules ./node_modules
COPY --from=build /opt/app/package.json ./package.json
COPY --from=build /opt/app/dist ./dist
# The import CLI loads ./config and ./src at runtime; use the compiled JS, not the TS source.
COPY --from=build /opt/app/dist/config ./config
COPY --from=build /opt/app/dist/src ./src
COPY --from=build /opt/app/public ./public
COPY --from=build /opt/app/database ./database

# UID/GID 1002 matches the host's `deploy` user, which owns the bind-mounted data dirs.
# Files in /opt/app stay root-owned and read-only; only these runtime dirs are writable.
RUN addgroup -g 1002 -S deploy \
    && adduser -S -u 1002 -G deploy -h /tmp deploy \
    && mkdir -p /opt/app/database/migrations /opt/app/.cache /opt/app/.strapi \
    && ln -s /opt/app/dist/build /opt/app/node_modules/@strapi/admin/dist/server/server/build \
    && chown -R 1002:1002 /opt/app/database /opt/app/.cache /opt/app/.strapi /opt/app/public
USER deploy
EXPOSE 1337
CMD ["yarn", "start"]
