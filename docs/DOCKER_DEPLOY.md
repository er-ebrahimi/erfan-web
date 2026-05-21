# Docker Build & Deploy — ErfanWeb

## Environment variables — 3 tiers

| Var | Prefixed? | Inlined at build? | Purpose | Local (Docker) | Server |
|-----|-----------|:-:|---------|----------------|--------|
| `STRAPI_INTERNAL_URL` | No | ❌ Runtime | Server API calls (fetchContentType, auth, redirects) | `http://host.docker.internal:1337` | `https://studioarman.site:2087` |
| `NEXT_PUBLIC_API_URL` | `NEXT_PUBLIC_` | ✅ Yes | Client auth calls (auth-context.tsx) | `http://localhost:1337` | `https://studioarman.site:2087` |
| `NEXT_PUBLIC_STRAPI_URL` | `NEXT_PUBLIC_` | ✅ Yes | Browser-facing image URLs | `http://localhost:1337` | `https://studioarman.site:2087` |

`NEXT_PUBLIC_*` vars are **baked into the JS bundle at build time** — changing them requires a rebuild.  
`STRAPI_INTERNAL_URL` is read from `process.env` at runtime — change it in `.env.local` and restart the container.

## Build & save image (local machine)

```bash
cd next
docker compose -f docker-compose.dev.yml build
docker save -o armanstudio-blog.tar armanstudio-blog:latest
```

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
      - .env.local
    dns:
      - 178.22.122.100
      - 185.51.200.2
      - 185.8.174.140
    extra_hosts:
      - "host.docker.internal:host-gateway"
```

> **Why `dns` is needed:** Without explicit DNS, the container may fail to resolve `studioarman.site` (`EAI_AGAIN`). The public IP `185.239.3.14` is reachable from inside the container only via DNS resolution of the domain.

## Server .env.local

```
WEBSITE_URL=http://localhost:3000
PORT=4000
BACK_PORT=2087
DOMAIN=studioarman.site
STRAPI_INTERNAL_URL=https://studioarman.site:2087
NEXT_PUBLIC_API_URL=https://studioarman.site:2087
NEXT_PUBLIC_STRAPI_URL=https://studioarman.site:2087
BACKEND_URL=https://studioarman.site:2087
PREVIEW_SECRET=tobemodified
IMAGE_HOSTNAME=studioarman.site:2087
```

## Architecture notes (Docker)

- Strapi runs directly on the host (not in Docker), bound to `127.0.0.1:1337`.
- Nginx on the host proxies `https://studioarman.site:2087` → `http://127.0.0.1:1337`.
- The Next.js container connects to Strapi via Nginx at `https://studioarman.site:2087`.
- DNS in the container resolves `studioarman.site` to the server's public IP `185.239.3.14`.
- `host.docker.internal` is mapped to the Docker bridge gateway for local dev only.
