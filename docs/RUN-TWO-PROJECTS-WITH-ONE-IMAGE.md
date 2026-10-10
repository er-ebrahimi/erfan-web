That works. You do not need two physical copies of the image. Docker can start many independent containers from one image.

Important limitation: because `COPY . .` places the application code inside the image, both projects will have the same Strapi code, content types, plugins, and admin build. Their databases, uploads, environment variables, ports, and containers can be independent.

## 1. Transfer the image to the server

On your local computer:

```bash
docker compose build strapi
docker image save -o strapi-prod.tar strapi-prod:latest
```

Transfer `strapi-prod.tar` to the server, then run:

```bash
docker image load -i strapi-prod.tar
```

Verify:

```bash
docker image ls strapi-prod
```

The image exists globally inside the server’s Docker daemon. It does not need to be copied into each project directory.

## 2. Give the same image two aliases

On the server:

```bash
docker tag strapi-prod:latest studioarman-strapi-prod:latest
docker tag strapi-prod:latest painfools-strapi-prod:latest
```

Verify that all names have the same image ID:

```bash
docker image ls | grep strapi
```

These are three names pointing to the same image—not three image copies.

## 3. Use separate project directories

```text
/root/studioarman/strapi/
├── compose.yaml
├── .env.production
├── public/
└── .tmp/
    └── data.db

/root/painfoolsstudio/strapi/
├── compose.yaml
├── .env.production
├── public/
└── .tmp/
    └── data.db
```

The two `.tmp/data.db` files and `public` directories are independent.

Remember: `docker image save` does not include bind-mounted data. If you need existing data, copy `.tmp`, `public`, and `.env.production` separately.

## 4. StudioArman Compose

```yaml
name: studioarman

services:
  studioarman-strapi:
    container_name: studioarman-strapi
    image: studioarman-strapi-prod:latest
    pull_policy: never
    restart: unless-stopped

    env_file:
      - .env.production

    environment:
      DATABASE_CLIENT: sqlite
      DATABASE_FILENAME: .tmp/data.db
      NODE_ENV: production

    volumes:
      - ./public:/opt/app/public
      - ./.tmp:/opt/app/.tmp

    ports:
      - '127.0.0.1:1338:1337'

    networks:
      - studioarman-net

networks:
  studioarman-net:
    external: true
```

## 5. PainFools Compose

```yaml
name: painfools

services:
  painfools-strapi:
    container_name: painfools-strapi
    image: painfools-strapi-prod:latest
    pull_policy: never
    restart: unless-stopped

    env_file:
      - .env.production

    environment:
      DATABASE_CLIENT: sqlite
      DATABASE_FILENAME: .tmp/data.db
      NODE_ENV: production

    volumes:
      - ./public:/opt/app/public
      - ./.tmp:/opt/app/.tmp

    ports:
      - '127.0.0.1:1337:1337'

    networks:
      - painfools-net

networks:
  painfools-net:
    external: true
```

Create the two networks once:

```bash
docker network create studioarman-net
docker network create painfools-net
```

Separate networks prevent service-name and DNS collisions. If web containers need to communicate with Strapi, connect each web container to its corresponding network.

## 6. Start both projects

From the StudioArman directory:

```bash
cd /root/studioarman/strapi
docker compose up -d
```

From the PainFools directory:

```bash
cd /root/painfoolsstudio/strapi
docker compose up -d
```

Verify:

```bash
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}"
```

Expected result:

```text
studioarman-strapi   studioarman-strapi-prod:latest   127.0.0.1:1338->1337
painfools-strapi     painfools-strapi-prod:latest     127.0.0.1:1337->1337
```
