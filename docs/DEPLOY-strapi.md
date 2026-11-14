# Strapi staging CI/CD

CI/CD for the Strapi app in `strapi/`, targeting a **staging** instance only:
`https://strapi-dev.studioarman.com` → `127.0.0.1:1338`.

Workflow: `.github/workflows/strapi-cicd.yml`.
Deploy artifacts: `strapi/deploy/`.

## Red lines

The production Strapi is out of scope and must never be touched by this pipeline:

| Production                  | Staging                      |
| --------------------------- | ---------------------------- |
| `/root/strapi-docker`       | `/home/deploy/strapi-dev`    |
| container `strapi`          | container `strapi-dev`       |
| `127.0.0.1:1337`            | `127.0.0.1:1338`             |
| `strapi.studioarman.com`    | `strapi-dev.studioarman.com` |
| project `strapi-docker`     | project `strapi-dev`         |
| production SQLite + uploads | `data/.tmp` + `data/public`  |

Never run `docker compose` in `/root/strapi-docker`, never use `--remove-orphans`,
never use `docker system prune`, and never mount the production `.tmp`/`public`
volumes into `strapi-dev`. `strapi/deploy/remote-deploy.sh` refuses to run unless the
container name is `strapi-dev` and the user is `deploy`.

## What runs when

| Event                          | Typecheck + build | Docker image | Push image | Deploy |
| ------------------------------ | ----------------- | ------------ | ---------- | ------ |
| PR into `studioarman/v0.0`     | yes               | yes          | no         | no     |
| Push to `studioarman/v0.0`     | yes               | yes          | yes        | no     |
| Push to `ci/strapi-cicd`       | yes               | yes          | no         | no     |
| Manual run, `deploy` unchecked | yes               | yes          | yes        | no     |
| Manual run, `deploy` checked   | yes               | yes          | yes        | yes    |

The server is **not touched** until someone runs the workflow manually with
`deploy` checked. This is deliberate: the staging container, directory, and nginx
block must exist first.

Image: `ghcr.io/er-ebrahimi/erfan-web`

Tags:

- `strapi-<full git sha>`
- `strapi-latest` (convenience tag; the running container is pinned to the sha)

The image is built only on the GitHub runner. The host pulls; it never builds.

## Image

`strapi/Dockerfile` is multi-stage:

1. build deps → install all dependencies
2. build → `yarn build`
3. production deps → `yarn install --production`
4. runtime → `node:22-alpine` + vips + production `node_modules`, `dist`, compiled
   `config`/`src` (for CLI commands and production start), `public`, and `database`

The runtime user is UID/GID `1002`, matching the host's `deploy` user. The server's
bind-mounted `data/` directories are owned by `deploy`, so SQLite and uploads are
writable without `chmod 777`.

`.dockerignore` keeps `node_modules`, `dist`, `.tmp`, `.env*`, `archive/`, `data/`,
and upload backups out of the build context. No database or uploads are baked into
the image. The admin build is linked into the `@strapi/admin` package so `/admin`
works in production mode.

## Data and snapshots

The database and uploads are **not** created by the pipeline. They are host bind
mounts, exactly like production:

| Host path                             | Container path    |
| ------------------------------------- | ----------------- |
| `/home/deploy/strapi-dev/data/.tmp`   | `/opt/app/.tmp`   |
| `/home/deploy/strapi-dev/data/public` | `/opt/app/public` |

Every deploy replaces only the `strapi-dev` container. The paths above survive, so
the new image opens the same SQLite database and uploads. The pipeline never imports
or deletes content; it only copies `data.db*` to a backup before starting the new
image.

To initialise staging, put your snapshot in place before the first deploy. Stop
`strapi-dev` first if it is already running, so SQLite is not being written during the
copy.

```text
/home/deploy/strapi-dev/data/.tmp/data.db
/home/deploy/strapi-dev/data/public/uploads/...
```

`remote-deploy.sh` creates the directories, backs up `data.db*` to
`data/.tmp/backups/<timestamp>/`, stops the old container, and starts the new image
against the existing data. If `data.db` is absent, Strapi creates an empty database.

The snapshot is independent from production; never point both instances at the same
SQLite file.

If the snapshot has no admin user (`hasAdmin: false`), create one:

```bash
docker exec -it strapi-dev yarn strapi admin:create-user \
  --firstname=Staging --lastname=Admin \
  --email=you@example.com --password='<strong-password>'
```

## GitHub secrets

Set these on the repository. The deploy secrets are the same ones the Next.js
pipeline already uses.

| Secret             | Required       | Value                                                           |
| ------------------ | -------------- | --------------------------------------------------------------- |
| `STRAPI_ENV_LOCAL` | yes, to deploy | Full staging env file (see below), multiple lines               |
| `DEPLOY_HOST`      | yes, to deploy | `109.122.250.34`                                                |
| `DEPLOY_USER`      | yes, to deploy | `deploy`                                                        |
| `DEPLOY_SSH_KEY`   | yes, to deploy | Private key whose public key is in `deploy`'s `authorized_keys` |
| `DEPLOY_PORT`      | no             | SSH port; empty means 22                                        |
| `GHCR_USERNAME`    | yes, to deploy | GitHub user that can read the package                           |
| `GHCR_PULL_TOKEN`  | yes, to deploy | PAT with `read:packages` access to `erfan-web`                  |

Image push uses the workflow `GITHUB_TOKEN` (`packages: write`). The server receives
only `GHCR_PULL_TOKEN`.

### `STRAPI_ENV_LOCAL` template

Generate fresh values; do not reuse the production secrets.

```env
HOST=0.0.0.0
PORT=1337
NODE_ENV=production
PUBLIC_URL=https://strapi-dev.studioarman.com
APP_KEYS=<four comma-separated `openssl rand -base64 32` values>
API_TOKEN_SALT=<openssl rand -base64 32>
ADMIN_JWT_SECRET=<openssl rand -base64 32>
TRANSFER_TOKEN_SALT=<openssl rand -base64 32>
JWT_SECRET=<openssl rand -base64 32>
CLIENT_URL=https://studioarman.com
STRAPI_ADMIN_CLIENT_URL=https://studioarman.com
STRAPI_ADMIN_CLIENT_PREVIEW_SECRET=<openssl rand -base64 32>
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
STRAPI_TELEMETRY_DISABLED=true
```

`PUBLIC_URL`, `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`,
`TRANSFER_TOKEN_SALT`, and `JWT_SECRET` are validated by both the workflow and the
deploy script.

The deploy job writes the secret to `strapi/deploy/.env.runtime`, copies it to the
server, and the deploy script sets it to mode `600`. The file is gitignored and is
never baked into the image.

## One-time server setup

Do this only when you are ready to deploy. Nothing below runs automatically.

As `deploy`:

```bash
mkdir -p /home/deploy/strapi-dev/data/.tmp /home/deploy/strapi-dev/data/public/uploads
chmod 775 /home/deploy/strapi-dev/data/.tmp /home/deploy/strapi-dev/data/public
```

Place the snapshot at the paths above before the first deploy. The pipeline does not
download or import it.

As root, add a **new** nginx file. Do not edit the production
`/etc/nginx/sites-available/studioarman.conf`.

```nginx
# /etc/nginx/sites-available/strapi-dev.conf
server {
    listen 80;
    server_name strapi-dev.studioarman.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    http2 on;
    server_name strapi-dev.studioarman.com;

    ssl_certificate     /etc/letsencrypt/live/studioarman.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/studioarman.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    client_max_body_size 200M;

    location / {
        proxy_pass http://127.0.0.1:1338;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/strapi-dev.conf /etc/nginx/sites-enabled/strapi-dev.conf
nginx -t && systemctl reload nginx
```

The existing wildcard certificate covers `*.studioarman.com`. It expires
**2026-11-29**; renewal is handled outside this pipeline. The nginx step is separate
from CI/CD and is not performed by the workflow.

## Deploy

1. Push to `studioarman/v0.0` (or merge the PR). CI runs and publishes
   `strapi-<sha>` to GHCR.
2. When the server is prepared, open **Actions → Strapi CI/CD → Run workflow**,
   choose the branch, and check `deploy`.
3. The deploy job writes `.env.runtime`, creates the data directories, copies the
   compose file, script, and env file, then runs `remote-deploy.sh` as `deploy`.

The script:

1. Logs in to GHCR and pulls the image **before** stopping the running container.
2. Copies `public/robots.txt` from the image if the bind-mounted public dir is empty.
3. Records `previous-image-id` and `current-image-ref`.
4. Gracefully stops and removes only `strapi-dev`.
5. Backs up `data/.tmp/data.db*` to `data/.tmp/backups/<timestamp>/`.
6. Starts `docker compose -p strapi-dev -f docker-compose.prod.yml up -d --no-build`.
7. Health-checks `http://127.0.0.1:1338/_health` (204) and `/admin` (200) for up to
   120 seconds.
8. On failure, restores the database backup, starts the previous image with the same
   env/mounts/port/user/memory/DNS, and fails the job.
9. On success, writes `current-image-ref`.

Container settings: `127.0.0.1:1338` → `1337`, `restart: unless-stopped`,
`mem_limit: 384m`, `memswap_limit: 768m`, Node heap `256m`, DNS
`178.22.122.100`/`185.51.200.2`/`185.8.174.140`, json-file logs capped at 10m × 3.

No global `docker image prune` is run. Old `strapi-<sha>` images stay for rollback.
Remove old tags manually when disk is tight.

## Verify

```bash
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:1338/_health
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:1338/admin
curl -sS -o /dev/null -w '%{http_code}\n' https://strapi-dev.studioarman.com/_health
docker stats --no-stream
df -h /
```

Expected: `204`, `200`, `204`, and memory/disk within the numbers above.

Confirm production is untouched:

```bash
docker inspect -f '{{.Id}} {{.State.StartedAt}} {{.RestartCount}}' strapi
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:1337/_health
```

The production container ID, start time, and restart count must match the values
recorded before the deploy. The production health check must stay `204`.

## Rollback

Automatic rollback restores the pre-deploy DB backup. If a previous image exists, it
also starts that image using `/home/deploy/strapi-dev/previous-image-id`.

Manual rollback:

```bash
cd /home/deploy/strapi-dev
PREV=$(cat previous-image-id)
docker rm -f strapi-dev
docker run -d --name strapi-dev --restart unless-stopped \
  --memory 384m --memory-swap 768m -u 1002:1002 \
  -e HOST=0.0.0.0 -e PORT=1337 -e NODE_ENV=production \
  -e DATABASE_CLIENT=sqlite -e DATABASE_FILENAME=.tmp/data.db \
  -e NODE_OPTIONS=--max-old-space-size=256 -e HOME=/tmp \
  --env-file .env.runtime \
  -p 127.0.0.1:1338:1337 \
  -v "$PWD/data/.tmp:/opt/app/.tmp" \
  -v "$PWD/data/public:/opt/app/public" \
  --dns 178.22.122.100 --dns 185.51.200.2 --dns 185.8.174.140 \
  --log-opt max-size=10m --log-opt max-file=3 \
  "$PREV"
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:1338/_health
```

Image rollback does not undo Strapi schema migrations. Restore the matching
`data/.tmp/backups/<timestamp>/` files if the old image cannot start.

## Monitoring and backups

The host runs `/usr/local/bin/server-monitor.sh` from `/etc/cron.d/server-monitor`
every 5 minutes. It checks disk, RAM, load, the new containers
(`studioarman-web-blog`, `strapi-dev`, `strapi-backup-dev`) and the two local HTTP
endpoints, then alerts to Bale only when the state changes.

- Source of truth: `scripts/server-monitor.sh`
- Full documentation: [SERVER-MONITOR.md](./SERVER-MONITOR.md)
- New data backup: `strapi-backup-dev` runs daily at 03:00 (and on container
  start), keeps 3 local copies in `data/.tmp/backups`, and uploads the archive
  in 44 MB parts to Bale. The old `strapi-backup` only covers
  `/root/strapi-docker`.

## Risks

- The host has about 418 MB RAM available. The staging container is capped at 384 MB
  with swap; `docker stop strapi-dev` is the kill switch and does not affect
  production. Monitor memory during the first deploy.
- The staging admin panel is internet-facing. Use a strong password; add nginx IP
  allow-listing or basic auth if needed.
- The wildcard certificate expires 2026-11-29.
- The pipeline does not create data. If the data paths are empty on the first deploy,
  Strapi starts with an empty database; put your snapshot in place first.
- The pre-deploy DB backup lives in `data/.tmp/backups`; it is a copy, not a full
  media backup.
- The new data is backed up daily by `strapi-backup-dev` (Bale + 3 local copies);
  the pre-deploy DB copies are still only a rollback aid.
- The old `.github/workflows/ci-cd.yaml` on `main` is a separate legacy pipeline. This
  workflow does not change it. Do not merge this Strapi workflow to `main` without
  removing the old Strapi/Docker-Hub workflow there too.
