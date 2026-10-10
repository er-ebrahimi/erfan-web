# Database Backup to Messenger (Bale / Telegram)

Backs up the Strapi SQLite database **plus** all uploaded media, zips them into one archive, splits the archive into chunks under the bot upload limit, and ships every chunk to your private chat on **Bale** and/or **Telegram** — whichever bot tokens you have configured. Designed to run unattended via cron.

Script: `scripts/db-backup.mjs` (plain Node, zero build step — no ts-node involved).

## Requirements

- Node.js ≥ 20 (tested on 22; needs native `fetch` + `FormData`)
- `archiver` (installed at repo root, see `package.json`)
- A Bale and/or Telegram bot token
- The target chat id (see below)

## Setup

### 1. Add your tokens to `strapi/.env`

`strapi/.env` is gitignored — never commit tokens. `.env.example` has the same keys as a reference.

```bash
# At least one of these. Any messenger with a token gets a full copy.
BALE_TOKEN=123456:AbC...
TELEGRAM_TOKEN=123456:AbC...

# Target chat: your private chat with the bot, or a channel the bot is admin of.
# The bot must have permission to post there.
BACKUP_CHAT_ID=424242
```

### 2. Find your chat id

Send any message to your bot, then read the chat id from the last `update`:

```bash
curl https://api.telegram.org/bot<TELEGRAM_TOKEN>/getUpdates
# or, for Bale:
curl https://tapi.bale.ai/bot<BALE_TOKEN>/getUpdates
```

The numeric `chat.id` in the response is your `BACKUP_CHAT_ID`. (Bots cannot message users who haven't started the bot first.)

## How to run

```bash
# One-shot, on demand
yarn backup
```

On success a local copy is kept in `strapi/.tmp/backups/` (retention `BACKUP_KEEP`, default 3). Exit code is `0` on success, `1` on any failure — so cron can alert you.

### Cron (every 24h)

```bash
crontab -e

# Run daily at 03:00, log output
0 3 * * * cd /path/to/ErfanWeb && yarn backup >> /var/log/strapi-backup.log 2>&1
```

If the repo lives elsewhere, set `BACKUP_DB_PATH` / `BACKUP_PUBLIC_DIR` (see config table).

## What it does (flow)

1. **Consistent snapshot** — opens the live SQLite DB read-only via `better-sqlite3` and uses its `backup()` API, so the copy is safe even while Strapi is running (no half-written pages).
2. **Zip** — `archiver` packs `data.db` + `public/` into `strapi-backup-<timestamp>.zip` (compression level 9).
3. **Split** — the zip is streamed into parts of `BACKUP_CHUNK_MB` each (default 44 MB), which stays safely under the 50 MB upload cap that Bale and Telegram both enforce. Each part is a byte-slice of the zip, not a zip itself. Every part gets a sha256.
4. **Upload per messenger** — for each messenger with a token:
   - a **manifest message** first: filename, total size, part count, and per-part sha256 (so you can verify integrity after download)
   - then each part as a `sendDocument` with caption `part i/N`
   - each request retries 3× with backoff; a failure on one messenger doesn't affect the other
5. **Cleanup** — on full success, the temp working dir is removed and the zip is moved into the keep folder (pruned to `BACKUP_KEEP`). On failure, nothing is deleted and the script exits non-zero so you can retry / inspect.

API notes: Bale (`https://tapi.bale.ai/bot<TOKEN>/…`) and Telegram (`https://api.telegram.org/bot<TOKEN>/…`) expose an identical Bot API, so the same request code serves both. Uploads use native `fetch` + `FormData`.

## Container deployment (server has Docker, no Node, flaky internet)

The server runs Docker but no Node, and its internet is unreliable at deploy time. So the backup container is **built on the dev machine** — it bundles Node + `archiver` + `better-sqlite3` — and shipped to the server as a `docker save`/`docker load` tar. Nothing is installed on the server and nothing is fetched at deploy time.

**Build + ship (dev machine):**

```bash
docker build -f Dockerfile.backup -t strapi-backup:latest .
docker save -o strapi-backup.tar strapi-backup:latest
```

Copy `strapi-backup.tar` (and `docker-compose.backup.yml`) to the server, then:

**On the server:**

```bash
docker load -i strapi-backup.tar
docker compose -f docker-compose.backup.yml up -d
```

**One-time setup:** add the bot credentials to `strapi/.env` (already gitignored — see the Setup section for the keys). `docker compose` reads `env_file: strapi/.env`, and the two mounts (`strapi/.tmp` → `/app/strapi/.tmp`, `strapi/public` → `/app/strapi/public`) match the script's expected paths (`strapi/.tmp/data.db`, `strapi/public`, `strapi/.tmp/backups`). `restart: unless-stopped` keeps the container alive.

It runs the backup immediately on start, then sleeps until the next 03:00 server-local and repeats — an in-container sleep loop, no cron.

**Local preflight test (dev machine) before shipping:**

```bash
docker run --rm \
  -e BACKUP_CHUNK_MB=2 \
  -v /absolute/path/to/ErfanWeb/strapi/.tmp:/app/strapi/.tmp \
  -v /absolute/path/to/ErfanWeb/strapi/public:/app/strapi/public \
  strapi-backup:latest node scripts/db-backup.mjs
```

> Mount **only** `.tmp` and `public` — never the whole `strapi` folder. Mounting the full folder shadows the image's Linux `better-sqlite3` with the host's `node_modules` (built for the host OS), which fails with `invalid ELF header`.

Expect snapshot + zip + split logs and exit code `0`. (If the whole zip fits in one chunk you'll see a single part — expected.)

**Real end-to-end check:** once, from the dev machine, run the same command with the real tokens in `strapi/.env` — confirm the manifest and all parts land in the chat.

The sleep-loop schedule is a deliberate simplification: no cron/supervisor in the image. The upgrade path is a fixed-time scheduler (systemd timer, k8s CronJob); the script and image stay unchanged.

## Restore

### 1. Download the parts

From the messenger chat, download **all** `part…` files into one folder. The bot sends them in order — first the manifest message, then `part 1/N`, `part 2/N`, … `part N/N`.

### 2. Reassemble the zip

> ⚠️ **A part is not a zip.** The zip's file index lives at the very end of the file, so no single `partNNNN.zip` can be opened on its own — Windows reports _"unexpected end of archive"_. Put **all** parts in one folder, reassemble them **in order**, then open the result.

**Linux / macOS:**

```bash
cat strapi-backup-20260808-200102.part*.zip > backup.zip
```

**Windows (Command Prompt):**

```bat
copy /b strapi-backup-20260808-200102.part*.zip backup.zip
```

**Windows (PowerShell 7+):**

```powershell
Get-Content strapi-backup-20260808-200102.part*.zip -AsByteStream -Raw | Set-Content backup.zip -AsByteStream
```

The parts are zero-padded (`.part0001.zip`, `.part0002.zip`, …), so sort-by-name order is the correct order. A missing or half-downloaded part is the usual cause of a broken result — check every part's size against the manifest.

### 3. Verify integrity (recommended)

Compare the hash to the manifest message (the first message the bot sends, titled "Backup: …").

**Linux / macOS / Git Bash:**

```bash
sha256sum backup.zip
```

**Windows:**

```bat
certutil -hashfile backup.zip SHA256
```

If they differ, one of the parts was corrupted or is missing — re-download and retry.

### 4. Open the zip

Only the **reassembled** `backup.zip` opens correctly. Never open a part file directly.

The zip contains `data.db` (the SQLite database) and `public/` (the media/static files).

- **GUI:** double-click `backup.zip` and extract — it opens with the built-in archive tool (Windows Explorer / macOS Archive Utility / your distro's file manager).
- **Terminal:** `unzip backup.zip` (Linux/macOS) or `Expand-Archive backup.zip` (PowerShell).

To restore into Strapi, stop Strapi, replace `strapi/.tmp/data.db` and `strapi/public/` with the extracted contents, and start Strapi again.

## Configuration

All settings are env vars, read from `strapi/.env` (via `--env-file-if-exists`) and/or the environment.

| Var                 | Default               | Purpose                                          |
| ------------------- | --------------------- | ------------------------------------------------ |
| `BALE_TOKEN`        | –                     | Bale bot token; if set, Bale gets a copy         |
| `TELEGRAM_TOKEN`    | –                     | Telegram bot token; if set, Telegram gets a copy |
| `BACKUP_CHAT_ID`    | –                     | Target chat for both messengers                  |
| `BACKUP_DB_PATH`    | `strapi/.tmp/data.db` | SQLite file to snapshot                          |
| `BACKUP_PUBLIC_DIR` | `strapi/public`       | Folder to include (media/static files)           |
| `BACKUP_KEEP_DIR`   | `strapi/.tmp/backups` | Where the last zip is kept locally               |
| `BACKUP_KEEP`       | `3`                   | How many local zips to keep                      |
| `BACKUP_CHUNK_MB`   | `44`                  | Chunk size per part (keep < 50)                  |

## Notes / gotchas

- The script targets a **SQLite** DB (Strapi default). If your Strapi uses MySQL/Postgres, this script won't find a `.db` file — set `BACKUP_DB_PATH` accordingly or extend it.
- Zip of a large media library can take a while; upload of N chunks is sequential on purpose to stay well under the 50 MB limit and avoid 429 rate-limit errors.
- The 50 MB limit is a _storage_ cap on Bale and an _upload_ cap on the Telegram Bot API. 44 MB default keeps multipart overhead clear of it.
