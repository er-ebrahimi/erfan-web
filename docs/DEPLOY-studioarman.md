# Studioarman Next.js deploy

CI/CD for the Next.js app in `next/`, on branch `studioarman/v0.0`.

Workflow: `.github/workflows/studioarman-cicd.yml`.

`.github/workflows/ci-cd.yaml` triggers only on `main`. It is unchanged. Pushes and pull requests for `studioarman/v0.0` do not run that workflow. `strapi/` and `.github/workflows/strapi-cicd.yml` are not part of this pipeline.

## What runs when

| Event                                | Lint, typecheck, `next build` | Docker build (`linux/amd64`) | Push image | Deploy |
| ------------------------------------ | ----------------------------- | ---------------------------- | ---------- | ------ |
| Pull request into `studioarman/v0.0` | yes                           | yes                          | no         | no     |
| Push to `ci/studioarman-cicd`        | yes                           | yes                          | no         | no     |
| Push to `studioarman/v0.0`           | yes                           | yes                          | yes        | yes    |

The image is built only on the GitHub-hosted runner. The server only pulls.

Image: `ghcr.io/er-ebrahimi/erfan-web`

Tags, only when publishing from `studioarman/v0.0`:

- `studioarman-<full git sha>`
- `studioarman-latest`

The running container is always pinned to the sha tag. `studioarman-latest` is a convenience tag.

Base image stays `node:22-alpine`. `output: 'standalone'`. The container listens on port 4000 (`ENV PORT=4000`). `sharp` is unchanged (`^0.33.5`, lockfile `0.33.5`) because the server CPU has SSE2/SSE3 only (no AVX, not x86-64-v2).

## Package manager

Quality checks use Yarn 1 and `next/yarn.lock`:

```bash
cd next && yarn install --frozen-lockfile
```

`package.json` `resolutions` are Yarn-specific. The existing main workflow uses the same install.

The image build is still the Dockerfile's `npm install --legacy-peer-deps` against `package-lock.json`. That is the install that already produces an Alpine image which runs on this CPU. Do not switch the base image or the `sharp` version to make the two lockfiles match. Direct `sharp` is `0.33.5` in both lockfiles. If the lockfiles drift, CI and the image can disagree; update them together when dependencies change.

`next/.dockerignore` excludes `node_modules` and `.next`. The Dockerfile copies the Alpine `node_modules` and then copies the build context. Without that ignore, a context that already contains `node_modules` would replace the musl `sharp` binaries with the host install.

## Environment variables

`NEXT_PUBLIC_*` values are inlined into the client bundle at `next build`. Changing them requires a new image.

`next/next.config.mjs` fetches redirects at build time from `${NEXT_PUBLIC_API_URL}/api/redirections`. A failed fetch is ignored and the build continues with no CMS redirects. A wrong `NEXT_PUBLIC_API_URL` is baked in.

The Dockerfile copies `next/.env.local` into the build and into the final image (`/usr/src/app/.env.local`). Next's standalone server loads that file at runtime. The production compose file does not pass a host env file.

Before `docker build`, CI writes `next/.env.local` from the secret `STUDIOARMAN_ENV_LOCAL` (full multi-line env file). That file is gitignored. Do not commit it.

On a production push the secret must be non-empty and must set `NEXT_PUBLIC_API_URL`. Pull requests and the feature branch may build with an empty `.env.local`. Committed `next/.env.production` still loads for those builds.

Next loads `.env.production` and then `.env.local`. Keys present in `.env.local` win. Keys only in `.env.production` remain. The secret should set every production value, not only secrets, because `next/.env.production` currently points at `studioarman.com`.

Variables read by the Next app (from code, `next/.env.example`, and `next/.env.production`):

| Variable                         | When it matters                                  | Used for                                                                                                                        |
| -------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`            | Build (inlined) and server runtime               | Strapi origin, auth calls, image URLs, redirect fetch `${NEXT_PUBLIC_API_URL}/api/redirections`                                 |
| `NEXT_PUBLIC_SITE_URL`           | Build (`next-sitemap`)                           | Sitemap site URL. Falls back to `DOMAIN`, then `https://example.com`                                                            |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Build (inlined into the contact form)            | Cloudflare Turnstile site key                                                                                                   |
| `DOMAIN`                         | Build (`next.config.mjs` image `remotePatterns`) | Strapi upload hostname                                                                                                          |
| `BACK_PORT`                      | Build (image `remotePatterns`)                   | Strapi upload port                                                                                                              |
| `IMAGE_HOSTNAME`                 | Build (`allowedDevOrigins`)                      | Dev origin allow-list                                                                                                           |
| `BACKEND_URL`                    | Build (`allowedDevOrigins`) and server render    | Media URLs in `components/dynamic-zone/media.tsx`                                                                               |
| `WEBSITE_URL`                    | Server runtime via `config.ts`                   | If set, `host` becomes `https://${WEBSITE_URL}` (the code adds `https://` itself). Nothing else in `next/` imports `host` today |
| `PORT`                           | Runtime                                          | `config.ts` fallback host. The image sets `PORT=4000`                                                                           |
| `PREVIEW_SECRET`                 | Server runtime                                   | `app/api/preview`                                                                                                               |
| `TURNSTILE_SECRET_KEY`           | Server runtime                                   | Contact route Turnstile verify                                                                                                  |
| `CONTACT_EMAIL_ACCESS_KEY`       | Server runtime                                   | Web3Forms access key                                                                                                            |
| `CONTACT_EMAIL`                  | Server runtime                                   | Contact form recipient. Falls back to `your-email@example.com`                                                                  |
| `NODE_ENV`                       | Build and runtime                                | Set to `production` in the image                                                                                                |

`next/.env.example` lists the same names for local use. It is not copied into the image by itself.

## GitHub secrets

Set these on the repository (or an environment used by this workflow). They are not in git.

| Secret                  | Required                 | Value                                                                           |
| ----------------------- | ------------------------ | ------------------------------------------------------------------------------- |
| `DEPLOY_HOST`           | yes, for deploy          | `202.133.88.169`                                                                |
| `DEPLOY_USER`           | yes, for deploy          | `ai-bot` (in the `docker` group, no sudo)                                       |
| `DEPLOY_SSH_KEY`        | yes, for deploy          | Private key whose public key is in `ai-bot`'s `authorized_keys`                 |
| `DEPLOY_PORT`           | no                       | SSH port. Empty means 22                                                        |
| `GHCR_USERNAME`         | yes, for deploy          | GitHub username that can read the package                                       |
| `GHCR_PULL_TOKEN`       | yes, for deploy          | PAT with `read:packages` (classic) or fine-grained Packages read on `erfan-web` |
| `STUDIOARMAN_ENV_LOCAL` | yes, to publish an image | Full `next/.env.local` contents, multiple lines                                 |

Image push from Actions uses the workflow `GITHUB_TOKEN` (`packages: write`). The server uses `GHCR_PULL_TOKEN` and does not receive `GITHUB_TOKEN`.

After the first publish, open the `erfan-web` package on GHCR and grant the pull user read access if the package is private.

## One-time server setup

As `ai-bot`:

```bash
mkdir -p /home/ai-bot/studioarman-web
docker login ghcr.io
```

`docker login` in that step is optional. The deploy script logs in with `GHCR_PULL_TOKEN` on each run and logs out when it finishes.

Confirm:

- `ai-bot` can run `docker` and `docker compose` without sudo
- `curl` is installed
- host port `3001` is the Studioarman Next app (container `4000`)
- nothing else should be bound to `3001`

Do not create this app under `/root/studioarman/next`. That tree is root-owned and `ai-bot` cannot read it. Do not delete it.

## Deploy

On a push to `studioarman/v0.0`, after the image push:

1. SSH to `DEPLOY_HOST` as `DEPLOY_USER`.
2. Copy `next/deploy/docker-compose.prod.yml` and `next/deploy/remote-deploy.sh` to `/home/ai-bot/studioarman-web/`.
3. `docker login ghcr.io` with `GHCR_USERNAME` and `GHCR_PULL_TOKEN`.
4. Record the current `studioarman-web-blog` image id, if the container exists.
5. `docker pull` the new `studioarman-<sha>` tag. If the pull fails, the existing container is left running.
6. `docker rm -f studioarman-web-blog`. This is required the first time because the current container was created by another compose project. It does not delete `/root/studioarman/next`.
7. `docker compose -f docker-compose.prod.yml -p studioarman-web up -d --no-build` from `/home/ai-bot/studioarman-web`.

Container settings:

- name: `studioarman-web-blog`
- host `3001` to container `4000`
- `restart: unless-stopped`
- memory limit `384m`
- DNS `178.22.122.100`, `185.51.200.2`, `185.8.174.140`
- json-file logs capped at 10m × 3

8. Health check: `curl -L` `http://127.0.0.1:3001/` for about 60 seconds (12 tries, 5 seconds apart). Success is a final HTTP 2xx or 3xx whose URL is still `http://127.0.0.1:3001...`. A redirect to the public site does not count.
9. On failure, remove the new container and `docker run` the previous image id with the same name, port, restart policy, memory, DNS, and log cap. Then fail the job.
10. On success, `docker image prune -f` (dangling images only). Never `docker system prune`.

Other containers on the host are out of scope: `web-blog` on port 3000, `kodom-*`, Strapi containers, and host nginx.

There is no blue/green deploy and no extra nginx container. The host has roughly 170 MB free RAM and no swap, so two copies of this app must not run at once. The replace stops the site until the new container passes the health check.

## Rollback

Automatic rollback runs only inside the failed deploy, and only if a previous image id was recorded. It does not copy env files out of `/root/studioarman/next`.

Manual rollback to the image recorded in `/home/ai-bot/studioarman-web/previous-image-id`:

```bash
cd /home/ai-bot/studioarman-web
PREV=$(cat previous-image-id)
docker rm -f studioarman-web-blog
docker run -d \
  --name studioarman-web-blog \
  --restart unless-stopped \
  --memory 384m \
  --dns 178.22.122.100 \
  --dns 185.51.200.2 \
  --dns 185.8.174.140 \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  -p 3001:4000 \
  "$PREV"
```

Or start an older published tag (still on GHCR, and still present locally if it was not dangling):

```bash
cd /home/ai-bot/studioarman-web
export STUDIOARMAN_IMAGE_TAG=studioarman-<full-sha>
docker pull "ghcr.io/er-ebrahimi/erfan-web:${STUDIOARMAN_IMAGE_TAG}"
docker rm -f studioarman-web-blog
docker compose -f docker-compose.prod.yml -p studioarman-web up -d --no-build
```

Check:

```bash
curl -sS -o /dev/null -w '%{http_code} %{url_effective}\n' -L --max-redirs 5 http://127.0.0.1:3001/
```

## Risks

- `STUDIOARMAN_ENV_LOCAL` is stored in the image layers. Anyone who can pull `ghcr.io/er-ebrahimi/erfan-web` can read those values. Keep the package private and rotate credentials if the package is exposed.
- Changing `NEXT_PUBLIC_*` or redirects requires a rebuild. Restarting the container is not enough for client-side values.
- The first successful health check is followed by `docker image prune -f`. Dangling images go away. Tagged `studioarman-<sha>` images stay. If the pre-pipeline container's image had no remaining tag, prune can remove it after a successful deploy, and automatic rollback is then impossible.
- Rollback starts the previous image id. It does not restore extra mounts, networks, or a host env file from the old compose project. Images built by this pipeline carry `.env.local` inside the image.
- If the first deploy has no previous container and the health check fails, the script does not start a replacement. The site stays down and the job fails.
- `docker rm -f` drops the container the root compose project created. That project will show the container as missing. The directory `/root/studioarman/next` is not removed.
- Host RAM is shared. The 384m limit bounds this container. It does not reserve memory. A pull while the old container is still running uses disk more than RAM; a full disk fails the pull before the swap. An OOM killer can still stop processes on the host.
- SSH host-key checking is not pinned. `appleboy/ssh-action` is used without a fingerprint secret. Confirm `DEPLOY_HOST` and protect `DEPLOY_SSH_KEY`.
- The server must have `curl` and the `docker compose` plugin. The script stops before removing the container if either is missing.
- Quality CI and the Docker image install dependencies with different lockfiles (`yarn.lock` vs `package-lock.json`). Keep `sharp` on the 0.33.x line that already runs on this CPU.
- Deploy is not run in pull-request CI. It is gated to `push` on `refs/heads/studioarman/v0.0`. Missing deploy secrets only fail that job.
- This pipeline does not reload host nginx. Port `3001` must already be what nginx (or clients) use for this app.
