FROM node:20-slim
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    autoconf \
    automake \
    zlib1g-dev \
    libpng-dev \
    nasm \
    bash \
    libvips-dev \
    git && \
    rm -rf /var/lib/apt/lists/*
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY package.json yarn.lock ./
COPY scripts ./scripts
RUN yarn install --frozen-lockfile
ENV PATH=/opt/node_modules/.bin:$PATH

WORKDIR /opt/app
COPY . .
RUN mkdir -p /opt/app/.tmp && chmod 777 /opt/app/.tmp
RUN chown -R node:node /opt/app
USER node
RUN ["yarn", "build"]
EXPOSE 1337
CMD ["yarn", "develop"]
