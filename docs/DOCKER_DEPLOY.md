# Docker Build & Deploy — ErfanWeb

## Environment variables — 3 tiers

| Var | Prefixed? | Inlined at build? | Purpose | Local (Docker) | Server |
|-----|-----------|:-:|---------|----------------|--------|
| `STRAPI_INTERNAL_URL` | No | ❌ Runtime | Server API calls (fetchContentType, auth, redirects) | `http://host.docker.internal:1337` | `<your-strapi-url>` |
| `NEXT_PUBLIC_API_URL` | `NEXT_PUBLIC_` | ✅ Yes | Client auth calls (auth-context.tsx) | `http://localhost:1337` | `<your-strapi-url>` |
| `NEXT_PUBLIC_STRAPI_URL` | `NEXT_PUBLIC_` | ✅ Yes | Browser-facing image URLs | `http://localhost:1337` | `<your-strapi-url>` |

`NEXT_PUBLIC_*` vars are **baked into the JS bundle at build time** — changing them requires a rebuild.  
`STRAPI_INTERNAL_URL` is read from `process.env` at runtime — change it in `.env.local` and restart the container.

## Build & save image (local machine)

```bash
cd next
docker compose -f docker-compose.dev.yml build
docker save -o armanstudio-blog.tar armanstudio-blog:latest
```

> Only `.env` is needed — Docker Compose reads it automatically.  
> For local development, create a `.env.local` with overrides (Next.js reads it automatically, Docker uses `--env-file .env.local`).

## Deploy to server

```bash
# Copy the tar to the server, then:
docker load -i armanstudio-blog.tar
docker compose up -d   # start
docker compose down    # stop
```

## Server docker-compose.yml

```yaml
services:
  app:
    image: armanstudio-blog:latest
    container_name: armanstudio-blog
    ports:
      - "3000:4000"
    env_file:
      - .env
    dns:
      - <your-dns-server-1>
      - <your-dns-server-2>
      - <your-dns-server-3>
    extra_hosts:
      - "host.docker.internal:host-gateway"
```

> **Why `dns` is needed:** Without explicit DNS, the container may fail to resolve your Strapi domain (`EAI_AGAIN`). The server's public IP is reachable from inside the container only via DNS resolution of the domain.

## Server .env (same file, just with real values)

```
WEBSITE_URL=http://localhost:3000
PORT=4000
BACK_PORT=<your-backend-port>
DOMAIN=<your-domain>
STRAPI_INTERNAL_URL=https://<your-domain>:<your-backend-port>
NEXT_PUBLIC_API_URL=https://<your-domain>:<your-backend-port>
NEXT_PUBLIC_STRAPI_URL=https://<your-domain>:<your-backend-port>
PREVIEW_SECRET=<your-preview-secret>
IMAGE_HOSTNAME=<your-domain>:<your-backend-port>
```

## Architecture notes (Docker)

- Strapi runs directly on the host (not in Docker), bound to `127.0.0.1:1337`.
- Nginx on the host proxies `https://<your-domain>:<your-backend-port>` → `http://127.0.0.1:1337`.
- The Next.js container connects to Strapi via Nginx at `https://<your-domain>:<your-backend-port>`.
- DNS in the container resolves `<your-domain>` to the server's public IP.
- `host.docker.internal` is mapped to the Docker bridge gateway for local dev only.
