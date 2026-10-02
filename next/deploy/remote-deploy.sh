#!/bin/sh
# Replace studioarman-web-blog in place and roll back if it does not become healthy.
# Expects GHCR_USERNAME, GHCR_PULL_TOKEN, and STUDIOARMAN_IMAGE_TAG.
# Does not delete /root/studioarman/next and does not touch other containers.
set -eu

DEPLOY_DIR=/home/ai-bot/studioarman-web
COMPOSE_FILE=$DEPLOY_DIR/docker-compose.prod.yml
CONTAINER=studioarman-web-blog
IMAGE_REPO=ghcr.io/er-ebrahimi/erfan-web

: "${GHCR_USERNAME:?GHCR_USERNAME is required}"
: "${GHCR_PULL_TOKEN:?GHCR_PULL_TOKEN is required}"
: "${STUDIOARMAN_IMAGE_TAG:?STUDIOARMAN_IMAGE_TAG is required}"

IMAGE="$IMAGE_REPO:$STUDIOARMAN_IMAGE_TAG"

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required on the deploy host" >&2
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "docker compose plugin is required" >&2
  exit 1
fi

if [ ! -f "$COMPOSE_FILE" ]; then
  echo "Missing $COMPOSE_FILE" >&2
  exit 1
fi

cd "$DEPLOY_DIR"

cleanup() {
  docker logout ghcr.io >/dev/null 2>&1 || true
}
trap cleanup EXIT

PREV_IMAGE_ID=""
if docker inspect "$CONTAINER" >/dev/null 2>&1; then
  PREV_IMAGE_ID=$(docker inspect -f '{{.Image}}' "$CONTAINER")
  PREV_IMAGE_REF=$(docker inspect -f '{{.Config.Image}}' "$CONTAINER")
  echo "Previous container image: $PREV_IMAGE_REF ($PREV_IMAGE_ID)"
  printf '%s\n' "$PREV_IMAGE_ID" >"$DEPLOY_DIR/previous-image-id"
else
  echo "No existing $CONTAINER container"
fi

printf '%s\n' "$GHCR_PULL_TOKEN" | docker login ghcr.io -u "$GHCR_USERNAME" --password-stdin

# Pull before removing the running container so a registry failure leaves the site up.
docker pull "$IMAGE"

rollback() {
  echo "Health check failed; rolling back $CONTAINER" >&2
  docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
  if [ -z "$PREV_IMAGE_ID" ]; then
    echo "No previous image was recorded; $CONTAINER was not restarted" >&2
    return 0
  fi
  docker run -d \
    --name "$CONTAINER" \
    --restart unless-stopped \
    --memory 384m \
    --dns 178.22.122.100 \
    --dns 185.51.200.2 \
    --dns 185.8.174.140 \
    --log-opt max-size=10m \
    --log-opt max-file=3 \
    -p 3001:4000 \
    "$PREV_IMAGE_ID"
  echo "Restored previous image $PREV_IMAGE_ID"
}

# The live container may belong to the root-owned project in /root/studioarman/next.
# ai-bot can remove it by name via the docker group. Do not delete that directory.
docker rm -f "$CONTAINER" >/dev/null 2>&1 || true

if ! docker compose -f "$COMPOSE_FILE" -p studioarman-web up -d --no-build --force-recreate; then
  rollback
  exit 1
fi

health_ok=0
i=0
while [ "$i" -lt 12 ]; do
  i=$((i + 1))
  meta=$(curl -sS -o /dev/null -w '%{http_code} %{url_effective}' -L --max-redirs 5 --max-time 10 http://127.0.0.1:3001/ || true)
  code=${meta%% *}
  url=${meta#* }
  if [ "$code" = "$url" ]; then
    url=""
  fi
  echo "Health attempt $i: HTTP ${code:-000} ${url}"
  case "$code" in
    2* | 3*)
      case "$url" in
        http://127.0.0.1:3001 | http://127.0.0.1:3001/*)
          health_ok=1
          break
          ;;
      esac
      ;;
  esac
  if [ "$i" -lt 12 ]; then
    sleep 5
  fi
done

if [ "$health_ok" -ne 1 ]; then
  rollback
  exit 1
fi

printf '%s\n' "$IMAGE" >"$DEPLOY_DIR/current-image-ref"
docker image prune -f
echo "Deployed $IMAGE"
