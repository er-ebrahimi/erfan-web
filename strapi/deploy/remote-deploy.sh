#!/bin/sh
# Deploy the staging Strapi image to /home/deploy/strapi-dev only.
# It must never touch /root/strapi-docker or the production `strapi` container.
set -eu

DEPLOY_DIR=/home/deploy/strapi-dev
COMPOSE_FILE=$DEPLOY_DIR/docker-compose.prod.yml
ENV_FILE=$DEPLOY_DIR/.env.runtime
CONTAINER=strapi-dev
IMAGE_REPO=ghcr.io/er-ebrahimi/erfan-web
HOST_PORT=1338
DB_DIR=$DEPLOY_DIR/data/.tmp
DB_FILE=$DB_DIR/data.db
BACKUP_ROOT=$DB_DIR/backups

: "${GHCR_USERNAME:?GHCR_USERNAME is required}"
: "${GHCR_PULL_TOKEN:?GHCR_PULL_TOKEN is required}"
: "${STRAPI_IMAGE_TAG:?STRAPI_IMAGE_TAG is required}"

if [ "$CONTAINER" != "strapi-dev" ]; then
  echo "Refusing to run: unexpected container $CONTAINER" >&2
  exit 1
fi

if [ "$(id -un)" != "deploy" ]; then
  echo "Run this script as the deploy user, not $(id -un)" >&2
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE" >&2
  exit 1
fi

chmod 600 "$ENV_FILE"

for key in PUBLIC_URL APP_KEYS API_TOKEN_SALT ADMIN_JWT_SECRET TRANSFER_TOKEN_SALT JWT_SECRET; do
  if ! grep -q "^$key=." "$ENV_FILE"; then
    echo "Missing $key in $ENV_FILE" >&2
    exit 1
  fi
done

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required" >&2
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

mkdir -p "$DB_DIR" "$DEPLOY_DIR/data/public/uploads"

export STRAPI_IMAGE_TAG
IMAGE="$IMAGE_REPO:$STRAPI_IMAGE_TAG"

cleanup() {
  docker logout ghcr.io >/dev/null 2>&1 || true
}
trap cleanup EXIT

health_check() {
  label=$1
  tries=$2
  i=0
  while [ "$i" -lt "$tries" ]; do
    i=$((i + 1))
    health=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "http://127.0.0.1:$HOST_PORT/_health" || true)
    admin=$(curl -s -L -o /dev/null -w '%{http_code}' --max-time 5 "http://127.0.0.1:$HOST_PORT/admin" || true)
    echo "$label attempt $i: /_health=$health /admin=$admin"
    if [ "$health" = "204" ] && [ "$admin" = "200" ]; then
      return 0
    fi
    if [ "$i" -lt "$tries" ]; then
      sleep 5
    fi
  done
  return 1
}

PREV_IMAGE_ID=""
PREV_IMAGE_REF=""
if docker inspect "$CONTAINER" >/dev/null 2>&1; then
  PREV_IMAGE_ID=$(docker inspect -f '{{.Image}}' "$CONTAINER")
  PREV_IMAGE_REF=$(docker inspect -f '{{.Config.Image}}' "$CONTAINER")
  echo "Previous container image: $PREV_IMAGE_REF ($PREV_IMAGE_ID)"
  printf '%s\n' "$PREV_IMAGE_ID" >"$DEPLOY_DIR/previous-image-id"
else
  echo "No existing $CONTAINER container"
fi

rollback() {
  echo "Rolling back $CONTAINER" >&2
  docker logs --tail 200 "$CONTAINER" >&2 || true
  docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
  if [ -n "$DB_BACKUP" ] && [ -d "$DB_BACKUP" ]; then
    echo "Restoring database backup $DB_BACKUP" >&2
    rm -f "$DB_FILE" "$DB_FILE-wal" "$DB_FILE-shm"
    cp -a "$DB_BACKUP/." "$DB_DIR/"
  fi
  if [ -z "$PREV_IMAGE_ID" ]; then
    echo "No previous image; staging is stopped" >&2
    return 0
  fi
  docker run -d \
    --name "$CONTAINER" \
    --restart unless-stopped \
    --memory 384m \
    --memory-swap 768m \
    -u 1002:1002 \
    -e HOST=0.0.0.0 -e PORT=1337 -e NODE_ENV=production \
    -e DATABASE_CLIENT=sqlite -e DATABASE_FILENAME=.tmp/data.db \
    -e NODE_OPTIONS=--max-old-space-size=256 -e HOME=/tmp \
    --env-file "$ENV_FILE" \
    -p "127.0.0.1:$HOST_PORT:1337" \
    -v "$DB_DIR:/opt/app/.tmp" \
    -v "$DEPLOY_DIR/data/public:/opt/app/public" \
    --dns 178.22.122.100 --dns 185.51.200.2 --dns 185.8.174.140 \
    --log-opt max-size=10m --log-opt max-file=3 \
    "$PREV_IMAGE_ID"
  if health_check "Rollback" 12; then
    echo "Rollback succeeded" >&2
  else
    echo "Rollback health check failed; manual intervention required" >&2
    docker logs --tail 200 "$CONTAINER" >&2 || true
  fi
}

printf '%s\n' "$GHCR_PULL_TOKEN" | docker login ghcr.io -u "$GHCR_USERNAME" --password-stdin

# Pull before stopping the old container so a registry failure leaves staging up.
docker pull "$IMAGE"

# The public dir is a bind mount, so the image's robots.txt is hidden. Restore it once.
if [ ! -f "$DEPLOY_DIR/data/public/robots.txt" ]; then
  docker run --rm --entrypoint cat "$IMAGE" /opt/app/public/robots.txt \
    >"$DEPLOY_DIR/data/public/robots.txt" || true
fi

# Stop gracefully; SQLite needs a clean shutdown.
if docker inspect "$CONTAINER" >/dev/null 2>&1; then
  docker stop -t 30 "$CONTAINER" || true
  docker rm "$CONTAINER" >/dev/null 2>&1 || docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
fi

# Backup the pre-deploy database so a failed schema migration can be rolled back.
DB_BACKUP=""
if [ -f "$DB_FILE" ]; then
  DB_BACKUP="$BACKUP_ROOT/$(date +%Y%m%d-%H%M%S)"
  mkdir -p "$DB_BACKUP"
  cp -a "$DB_FILE" "$DB_BACKUP/data.db"
  [ ! -f "$DB_FILE-wal" ] || cp -a "$DB_FILE-wal" "$DB_BACKUP/data.db-wal"
  [ ! -f "$DB_FILE-shm" ] || cp -a "$DB_FILE-shm" "$DB_BACKUP/data.db-shm"
  echo "Database backup: $DB_BACKUP"
fi

cd "$DEPLOY_DIR"

if ! docker compose -f "$COMPOSE_FILE" -p strapi-dev up -d --no-build; then
  echo "Compose start failed" >&2
  rollback
  exit 1
fi

if ! health_check "Health" 24; then
  rollback
  exit 1
fi

printf '%s\n' "$IMAGE" >"$DEPLOY_DIR/current-image-ref"
echo "Deployed $IMAGE"
