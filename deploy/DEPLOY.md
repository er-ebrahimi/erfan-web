# Deploy — fresh server, Postgres, automatic HTTPS

This stack runs four containers behind **Caddy** (which gets free TLS certificates automatically):

```
Internet ──▶ Caddy (:80/:443)
               ├── aiunpacked.ir, www  ──▶ web  (Next.js, :4000)
               └── cms.aiunpacked.ir   ──▶ strapi (:1337) ──▶ strapiDB (Postgres)
```

- `web` talks to Strapi **internally** at `http://strapi:1337` (fast, no public hop) for server-side rendering.
- The **browser** loads Strapi images/auth from the public `https://cms.aiunpacked.ir`.
- All data lives in Docker **volumes** (`pgdata`, `strapi-uploads`) — survives restarts and image rebuilds.

> Files with real secrets (`deploy/.env`, `deploy/strapi.env`, `deploy/web.env`) and `deploy/strapi-content.tar.gz` are **git-ignored**. Copy them to the server manually (scp), don't commit them.

---

## 0. Prerequisites

- A Linux server (Ubuntu 22.04+ recommended), 2 GB RAM minimum (4 GB comfortable for the Strapi build).
- **DNS A-records** pointing to the server's public IP — all three:
  - `aiunpacked.ir`, `www.aiunpacked.ir`, `cms.aiunpacked.ir`
- Ports **80** and **443** open in the firewall (Caddy needs them for TLS + traffic).

---

## 1. Install Docker on the server

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER     # log out/in so `docker` works without sudo
docker compose version            # confirm the compose plugin is present
```

## 2. Get the code + secrets onto the server

```bash
# the repo (without secrets — they're git-ignored):
git clone <your-repo-url> erfan-web
cd erfan-web

# then copy the 4 secret/content files from your machine into deploy/ :
#   deploy/.env  deploy/strapi.env  deploy/web.env  deploy/strapi-content.tar.gz
# e.g. from your local machine:
#   scp deploy/.env deploy/strapi.env deploy/web.env deploy/strapi-content.tar.gz user@SERVER:~/erfan-web/deploy/
```

## 3. Set your domains

Edit these to your real domains (currently `aiunpacked.ir` / `cms.aiunpacked.ir`):
- `deploy/Caddyfile` — the email + the three hostnames
- `deploy/docker-compose.prod.yml` — the `web` build `args` (NEXT_PUBLIC_* + DOMAIN)
- `deploy/strapi.env` — `PUBLIC_URL` and `STRAPI_ADMIN_CLIENT_URL`
- `deploy/web.env` — the `NEXT_PUBLIC_*` + `DOMAIN`

> The `NEXT_PUBLIC_*` and `DOMAIN` values are **baked into the Next.js bundle at build time** — if you change them later you must rebuild the `web` image.

## 4. Build the images

From the `deploy/` folder (so it picks up `deploy/.env`):

```bash
cd deploy
docker compose -f docker-compose.prod.yml build      # builds strapi + web (first time ~5-15 min)
```

> **If the server can't reach npm/registries** (e.g. network restrictions), build the two images on your **local machine** instead, then transfer them:
> ```bash
> # local:
> docker compose -f docker-compose.prod.yml build
> docker save strapi-erfanweb:latest | gzip > strapi.tar.gz
> docker save armanstudio-blog:latest | gzip > web.tar.gz
> scp strapi.tar.gz web.tar.gz user@SERVER:~/erfan-web/deploy/
> # server:
> gunzip -c strapi.tar.gz | docker load
> gunzip -c web.tar.gz   | docker load
> ```

## 5. Start the database + Strapi, then import the content

```bash
cd deploy

# 1) database first
docker compose -f docker-compose.prod.yml up -d strapiDB

# 2) Strapi — first boot runs migrations and builds the schema
docker compose -f docker-compose.prod.yml up -d strapi
docker compose -f docker-compose.prod.yml logs -f strapi      # wait for "Strapi started", then Ctrl-C

# 3) import all content (24 articles incl. the 20 new posts, pages, fa locale, 115 media assets)
docker compose -f docker-compose.prod.yml cp strapi-content.tar.gz strapi:/tmp/import.tar.gz
docker compose -f docker-compose.prod.yml exec strapi \
  node ./node_modules/.bin/strapi import -f /tmp/import.tar.gz --force
```

> The export was made un-encrypted, so no key is needed. `--force` is fine here because the DB is fresh.
> (Alternative to import: set `SEED_AI_SOLUTIONS=true` in `strapi.env` and the bootstrap seed recreates everything from code — but import is exact and includes uploads, so prefer it.)

## 6. Bring up the whole stack

```bash
docker compose -f docker-compose.prod.yml up -d        # starts web + caddy too
docker compose -f docker-compose.prod.yml ps
```

Caddy will now request TLS certificates for your three domains (this needs DNS already pointing here + ports 80/443 open). Watch it:

```bash
docker compose -f docker-compose.prod.yml logs -f caddy
```

## 7. Create the admin user + verify

1. Open `https://cms.aiunpacked.ir/admin` → register the **first admin** (this is the CMS login).
2. In **Content Manager → Article**, switch the locale dropdown to **Persian (fa)** → you should see all 24 articles.
3. Open `https://aiunpacked.ir` → the site loads and `/fa/category/blog` lists the posts.

---

## Day-2 operations

**Logs:** `docker compose -f docker-compose.prod.yml logs -f [strapi|web|caddy|strapiDB]`

**Update after new commits:**
```bash
git pull
cd deploy
docker compose -f docker-compose.prod.yml build strapi web
docker compose -f docker-compose.prod.yml up -d
```

**Backup the database (run on a schedule):**
```bash
docker compose -f docker-compose.prod.yml exec strapiDB \
  pg_dump -U strapi strapi | gzip > backup-$(date +%F).sql.gz
```

**Backup uploads:**
```bash
docker run --rm -v erfan-web_strapi-uploads:/src -v "$PWD":/out alpine \
  tar czf /out/uploads-$(date +%F).tar.gz -C /src .
```

**Restore the database:**
```bash
gunzip -c backup-YYYY-MM-DD.sql.gz | \
  docker compose -f docker-compose.prod.yml exec -T strapiDB psql -U strapi -d strapi
```

---

## Notes

- The import also brings the original English/French demo articles. The public site is Persian-only (routing), so they're harmless, but you can delete them in the admin if you prefer a clean list.
- Don't set `SEED_AI_SOLUTIONS=true` **and** import — pick one. Import is recommended.
- If you later move the CMS to a different host/port, rebuild the `web` image (the URLs are baked in).
