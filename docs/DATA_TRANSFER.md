# Data Export & Import — ErfanWeb

Use Strapi's built-in transfer tool to move content between environments. It exports all content types, components, media references, and relations into a single `.tar.gz` file.

## Export

### Without Docker (bare metal)

```bash
cd strapi
yarn strapi export --no-encrypt -f ./data/export_data
```

Produces `./data/export_data.tar.gz`.

### With Docker

```bash
# Export to a file inside the container
docker exec -it strapi yarn strapi export --no-encrypt -f /tmp/export_data

# Copy it out to your host
docker cp strapi:/tmp/export_data.tar.gz ./data/export_data.tar.gz
```

## Import

### Without Docker (bare metal)

```bash
cd strapi
yarn strapi import -f ./data/export_data.tar.gz --force
```

The `--force` flag allows overwriting existing data. You'll be prompted for confirmation (answer `Yes`).

### With Docker

```bash
# Copy the file into the container
docker cp ./data/export_data.tar.gz strapi:/tmp/export_data.tar.gz

# Run the import
docker exec -it strapi yarn strapi import -f /tmp/export_data.tar.gz --force
```

Or mount a volume in `docker-compose.yml` for easier file access:

```yaml
services:
  strapi:
    volumes:
      - ./data:/data
```

Then:

```bash
docker compose exec strapi yarn strapi import -f /data/export_data.tar.gz --force
```

## Notes

- **Import is one-time** — data persists in the PostgreSQL volume (`strapi-data`) across container restarts. Only re-import if you delete the volume (`docker compose down -v`) or need a fresh copy.
- **The `--force` flag** deletes existing content before importing. Always confirm the destination is the correct environment before proceeding.
- **Media files** referenced in the export are stored in `strapi/public/uploads/` by default. The export file includes media paths, but the actual upload files are not bundled in the `.tar.gz` — they must be copied separately if moving to a new server.
