#!/bin/bash
set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

PREBUILT_IMAGE=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --image)
            PREBUILT_IMAGE="$2"
            shift 2
            ;;
        *)
            echo "Usage: $0 [--image <docker-image-tag>]"
            exit 1
            ;;
    esac
done

# Function to check if nginx proxy is running
ensure_nginx_running() {
    if ! docker ps --format '{{.Names}}' | grep -q "armanstudio-proxy"; then
        echo -e "${BLUE}🔧 Nginx proxy is not running. Starting it...${NC}"
        docker compose up -d nginx
        sleep 3
        
        # Verify it started
        if docker ps --format '{{.Names}}' | grep -q "armanstudio-proxy"; then
            echo -e "${GREEN}✅ Nginx proxy started successfully!${NC}"
        else
            echo -e "${RED}❌ Failed to start Nginx proxy!${NC}"
            exit 1
        fi
    else
        echo -e "${GREEN}✅ Nginx proxy is already running.${NC}"
    fi
}

# Detect current active container
get_active_color() {
    if grep -q "app-blue" ./upstream.conf 2>/dev/null; then
        echo "blue"
    else
        echo "green"
    fi
}

# Ensure upstream.conf exists (remove directory if it somehow exists)
if [ -d "./upstream.conf" ]; then
    rm -rf ./upstream.conf
fi
if [ ! -f "./upstream.conf" ]; then
    echo -e "${BLUE}📄 Creating upstream.conf...${NC}"
    echo "server app-blue:4000;" > ./upstream.conf
fi

# Ensure nginx is running
ensure_nginx_running

ACTIVE=$(get_active_color)

if [ "$ACTIVE" = "blue" ]; then
    NEW="green"
    NEW_PORT="4002"
else
    NEW="blue"
    NEW_PORT="4001"
fi

echo -e "${BLUE}🚀 Starting deployment...${NC}"
echo -e "Currently active: ${ACTIVE} | New: ${NEW}"

# 1. Pull pre-built image or build locally
if [ -n "$PREBUILT_IMAGE" ]; then
    echo -e "${BLUE}📦 Pulling pre-built image: ${PREBUILT_IMAGE}...${NC}"
    docker pull "${PREBUILT_IMAGE}"
    docker tag "${PREBUILT_IMAGE}" "armanstudio-blog-i:${NEW}"
else
    echo -e "${BLUE}📦 Building new image...${NC}"
    docker build -t "armanstudio-blog-i:${NEW}" .
fi

# 2. Start new container
echo -e "${BLUE}🔄 Starting ${NEW} container...${NC}"
docker compose up -d app-${NEW}

# 3. Wait for healthy status
echo -e "${BLUE}⏳ Waiting for container to be healthy...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:${NEW_PORT} > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Container ${NEW} is ready!${NC}"
        break
    fi
    echo "Attempt $i/30..."
    sleep 2
done

# Final health check
if ! curl -s http://localhost:${NEW_PORT} > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: New container failed health check!${NC}"
    docker compose stop app-${NEW}
    exit 1
fi

# 4. Switch traffic
echo -e "${BLUE}🔀 Switching traffic to ${NEW}...${NC}"

# Update host file (for persistence)
echo "server app-${NEW}:4000;" > ./upstream.conf

# Update container file directly (to ensure immediate effect)
# docker exec armanstudio-proxy sh -c "echo 'server app-${NEW}:4000;' > /etc/nginx/upstream.conf"

docker compose restart nginx

sleep 2

# 5. Stop old container after a few seconds
echo -e "${BLUE}🛑 Stopping ${ACTIVE} container...${NC}"
sleep 5
docker compose stop app-${ACTIVE}
docker compose rm -f app-${ACTIVE}

echo -e "${BLUE}🧹 Cleaning up old images...${NC}"
docker image prune -f
docker system prune -f
echo -e "${GREEN}✅ Deployment complete! Service is now running on ${NEW}.${NC}"