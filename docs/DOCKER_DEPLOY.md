# Docker Build & Deploy — ErfanWeb

## Containers

| Container        | Image                    | Location  |
| ---------------- | ------------------------ | --------- |
| Next.js frontend | `web-blog:latest`        | `next/`   |
| Strapi CMS       | `strapi-erfanweb:latest` | `strapi/` |

## Environment variables — 3 tiers (Next.js)

| Var                      | Prefixed?      | Inlined at build? | Purpose                                              | Local (Docker)                     | Server                          |
| ------------------------ | -------------- | :---------------: | ---------------------------------------------------- | ---------------------------------- | ------------------------------- |
| `STRAPI_INTERNAL_URL`    | No             |     ❌ Runtime     | Server API calls (fetchContentType, auth, redirects) | `http://host.docker.internal:1337` | `https://studioarman.site:2087` |
| `NEXT_PUBLIC_API_URL`    | `NEXT_PUBLIC_` |       ✅ Yes       | Client auth calls (auth-context.tsx)                 | `http://localhost:1337`            | `https://studioarman.site:2087` |
| `NEXT_PUBLIC_STRAPI_URL` | `NEXT_PUBLIC_` |       ✅ Yes       | Browser-facing image URLs                            | `http://localhost:1337`            | `https://studioarman.site:2087` |

`NEXT_PUBLIC_*` vars are **baked into the JS bundle at build time** — changing them requires a rebuild.  
`STRAPI_INTERNAL_URL` is read from `process.env` at runtime — change it in `.env.local` and restart the container.

---

## Build & save images (local machine)

### Strapi

```bash
cd strapi

# Build the production image
docker compose -f docker-compose.yml build

# Save to tar (~6.7 GB)
docker save -o strapi-prod.tar strapi-prod:latest
```

### Next.js

```bash
cd next

# Build with production API URLs baked in
docker compose build

# Save to tar (~350 MB)
docker save -o web-blog.tar web-blog:latest
```

---

## Deploy to server

```bash
# bring down the images and delete them
sudo docker compose down
sudo docker rmi web-blog
sudo docker rmi strapi-erfanweb

# Copy both tar files to server (scp / rsync)

# Load images
docker load -i strapi-prod.tar
docker load -i web-blog.tar

# Start everything
docker compose up

# Check logs
docker compose logs -f
```

---

## Server docker-compose.yml

```yaml
services:
  strapi:
    image: strapi-erfanweb:latest
    container_name: strapi
    restart: unless-stopped
    env_file: ./strapi.env
    ports:
      - "127.0.0.1:1337:1337"   # only local, Nginx proxies public traffic
    volumes:
      # Persisted data — survives container restarts and image updates
      - strapi-data:/opt/app/.tmp        # SQLite database + session data
      - strapi-uploads:/opt/app/public/uploads  # uploaded media files

services:
  app:
    image: web-blog:latest
    container_name: web-blog
    ports:
      - "3000:4000"
    env_file:
      - .env
    dns:
      - 178.22.122.100
      - 185.51.200.2
      - 185.8.174.140
    extra_hosts:
      - "host.docker.internal:host-gateway"
      - "studioarman.site:185.239.3.14"

volumes:
  strapi-data:
  strapi-uploads:
```

> **Why `dns` is needed:** Without explicit DNS, the container may fail to resolve `studioarman.site` (`EAI_AGAIN`). The server's public IP `185.239.3.14` is reachable from inside the container only via DNS resolution of the domain.

---

## Volume persistence

Two named Docker volumes store all persistent data:

| Volume           | Container path            | Contains                                  |
| ---------------- | ------------------------- | ----------------------------------------- |
| `strapi-data`    | `/opt/app/.tmp`           | SQLite database (`data.db`), session data |
| `strapi-uploads` | `/opt/app/public/uploads` | Uploaded media files (images, documents)  |

These volumes **survive** container restarts (`docker compose restart`), teardown (`docker compose down`), and image updates.

### Initial data transfer (first deploy)

If you have existing data on your local machine:

```bash
# Transfer SQLite database
docker compose cp ./strapi/.tmp/data.db strapi:/opt/app/.tmp/data.db

# Transfer uploaded files
docker compose cp ./strapi/public/uploads strapi:/opt/app/public/uploads

# Restart Strapi to pick up the data
docker compose restart strapi
```

Or seed from the export file:

```bash
docker compose exec strapi yarn strapi import -f ./data/export_*.tar.gz --force
```

### Backup volumes

```bash
# Backup database
docker run --rm -v strapi-data:/source -v $(pwd):/backup alpine tar czf /backup/strapi-data-backup.tar.gz -C /source .

# Backup uploads
docker run --rm -v strapi-uploads:/source -v $(pwd):/backup alpine tar czf /backup/strapi-uploads-backup.tar.gz -C /source .
```

### Restore from backup

```bash
docker run --rm -v strapi-data:/target -v $(pwd):/backup alpine tar xzf /backup/strapi-data-backup.tar.gz -C /target
docker run --rm -v strapi-uploads:/target -v $(pwd):/backup alpine tar xzf /backup/strapi-uploads-backup.tar.gz -C /target
```

---

## Server env files

**`strapi.env`** :
```
HOST=0.0.0.0
PORT=1337
APP_KEYS="your-keys"
API_TOKEN_SALT=your-token-salt
ADMIN_JWT_SECRET=your-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-salt
JWT_SECRET=your-jwt-secret
CLIENT_URL=https://studioarman.com
PREVIEW_SECRET=your-preview-secret
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
NODE_ENV=production
PUBLIC_URL=https://studioarman.site:2087
```

**`next.env`** :
```
WEBSITE_URL=http://localhost:3000
PORT=4000
BACK_PORT=2087
DOMAIN=studioarman.site
STRAPI_INTERNAL_URL=https://studioarman.site:2087
NEXT_PUBLIC_API_URL=https://studioarman.site:2087
NEXT_PUBLIC_STRAPI_URL=https://studioarman.site:2087
PREVIEW_SECRET=tobemodified
IMAGE_HOSTNAME=studioarman.site:2087
```

---

## Architecture notes

- Strapi runs in Docker (container), bound to `127.0.0.1:1337` (not exposed publicly).
- Nginx on the host proxies `https://studioarman.site:2087` → `http://127.0.0.1:1337`.
- The Next.js container connects to Strapi via Nginx at `https://studioarman.site:2087`.
- DNS in the container resolves `studioarman.site` to the server's public IP `185.239.3.14`.
- `host.docker.internal` is mapped to the Docker bridge gateway for local dev only.

## Quick reference

| Step                 | Command                                                                    |
| -------------------- | -------------------------------------------------------------------------- |
| Build Strapi         | `cd strapi && docker compose -f docker-compose.prod.yml build`             |
| Save Strapi tar      | `cd strapi && docker save -o strapi-erfanweb.tar strapi-erfanweb:latest`   |
| Build Next.js        | `cd next && docker compose -f docker-compose.dev.yml build`                |
| Save Next.js tar     | `cd next && docker save -o web-blog.tar web-blog:latest`                   |
| Load on server       | `docker load -i <name>.tar`                                                |
| Start all            | `docker compose up -d`                                                     |
| Check data persisted | `docker compose down && docker compose up -d` — data should still be there |
