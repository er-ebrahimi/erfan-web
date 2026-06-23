#!/usr/bin/env bash
# =============================================================================
# One-command production deploy for aiunpacked.ir (run ON the server, as root).
#
#   git clone <repo> erfan-web && cd erfan-web
#   git checkout feat/ai-solutions-page
#   sudo bash deploy/server-bootstrap.sh
#
# It: installs Docker, generates secrets (kept only on this server), builds the
# images, brings up Postgres + Strapi, imports all content (incl. the 20 posts +
# fa locale + media), then starts Next.js + Caddy (automatic HTTPS).
#
# DNS: before/while running, point these A-records at this server's IP:
#   aiunpacked.ir   www.aiunpacked.ir   cms.aiunpacked.ir
# (Caddy needs them to issue TLS certs; it will keep retrying until they resolve.)
# =============================================================================
set -euo pipefail

DOMAIN_SITE="aiunpacked.ir"
DOMAIN_CMS="cms.aiunpacked.ir"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPLOY_DIR="$REPO_ROOT/deploy"
CONTENT="$REPO_ROOT/strapi/data/aiunpacked-content.tar.gz"
cd "$DEPLOY_DIR"

log(){ printf "\n\033[1;36m> %s\033[0m\n" "$*"; }

# ---------------------------------------------------------------- 1. Docker
if ! command -v docker >/dev/null 2>&1; then
  log "Installing Docker..."
  curl -fsSL https://get.docker.com | sh
fi
docker compose version >/dev/null 2>&1 || { echo "docker compose plugin missing"; exit 1; }

DC="docker compose -f docker-compose.prod.yml"

# ---------------------------------------------------------------- 2. Secrets
if [ ! -f .env ] || [ ! -f strapi.env ] || [ ! -f web.env ]; then
  log "Generating secrets (stored only on this server)..."
  gen(){ openssl rand -base64 "${1:-24}" | tr -d '\n='; }
  DB_PASSWORD="$(openssl rand -hex 18)"

  printf 'DB_PASSWORD=%s\n' "$DB_PASSWORD" > .env

  cat > strapi.env <<EOF
HOST=0.0.0.0
PORT=1337
PUBLIC_URL=https://$DOMAIN_CMS
NODE_ENV=production
APP_KEYS=$(gen 16),$(gen 16),$(gen 16),$(gen 16)
API_TOKEN_SALT=$(gen 16)
ADMIN_JWT_SECRET=$(gen 24)
TRANSFER_TOKEN_SALT=$(gen 16)
JWT_SECRET=$(gen 24)
STRAPI_ADMIN_CLIENT_URL=https://$DOMAIN_SITE
STRAPI_ADMIN_CLIENT_PREVIEW_SECRET=$(gen 24)
DATABASE_CLIENT=postgres
DATABASE_HOST=strapiDB
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=$DB_PASSWORD
DATABASE_SSL=false
DATABASE_SCHEMA=public
EOF

  cat > web.env <<EOF
PORT=4000
NODE_ENV=production
STRAPI_INTERNAL_URL=http://strapi:1337
NEXT_PUBLIC_API_URL=https://$DOMAIN_CMS
NEXT_PUBLIC_STRAPI_URL=https://$DOMAIN_CMS
DOMAIN=$DOMAIN_CMS
EOF
  echo "  secrets written to deploy/{.env,strapi.env,web.env}"
else
  log "Secrets already present - reusing."
fi

# ---------------------------------------------------------------- 3. Build
log "Building images (first run can take 5-15 min)..."
$DC build

# ---------------------------------------------------------------- 4. DB + Strapi
log "Starting Postgres..."
$DC up -d strapiDB
until docker exec "$($DC ps -q strapiDB)" pg_isready -U strapi -d strapi >/dev/null 2>&1; do
  echo "  ...waiting for Postgres"; sleep 3
done

log "Starting Strapi (first boot builds the schema)..."
$DC up -d strapi
ok=0
for i in $(seq 1 60); do
  if $DC logs strapi 2>&1 | grep -q "Strapi started"; then ok=1; break; fi
  echo "  ...waiting for Strapi to boot ($i)"; sleep 5
done
[ "$ok" = 1 ] || { echo "Strapi did not report 'started' in time - check: $DC logs strapi"; exit 1; }

# ---------------------------------------------------------------- 5. Import content
log "Importing content (24 articles incl. the 20 new posts, fa locale, media)..."
[ -f "$CONTENT" ] || { echo "Content archive missing: $CONTENT"; exit 1; }
SID="$($DC ps -q strapi)"
docker cp "$CONTENT" "$SID":/tmp/content.tar.gz
$DC exec -T strapi node ./node_modules/.bin/strapi import -f /tmp/content.tar.gz --force

# ---------------------------------------------------------------- 6. Full stack
log "Starting Next.js + Caddy (automatic HTTPS)..."
$DC up -d
$DC ps

cat <<DONE

Deploy finished.

Next:
  1. Make sure DNS A-records point here:  $DOMAIN_SITE, www.$DOMAIN_SITE, $DOMAIN_CMS
  2. Watch TLS issuance:                   $DC logs -f caddy
  3. Create the CMS admin user at:         https://$DOMAIN_CMS/admin
  4. Visit the site:                       https://$DOMAIN_SITE
     (home = AI solutions page, blog = /fa/category/blog)

The English/French demo content is invisible to visitors (Persian-only site);
delete it in the admin if you want a tidy back-office.
DONE
