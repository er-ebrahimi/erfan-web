# Server monitor (Bale watchdog)

Host-level watchdog for the Studioarman stack. It runs on the VPS, checks disk,
memory, load, containers and HTTP endpoints, and sends a Bale message when
something breaks. It is edge-triggered, so it does not spam: it alerts on a
state change, repeats an unchanged problem once an hour, and sends one
`RECOVERED` message when everything is healthy again.

## Files and schedule

| Path | Purpose |
| --- | --- |
| `scripts/server-monitor.sh` | Source of truth in this repo |
| `/usr/local/bin/server-monitor.sh` | Installed copy on the server, `root:root 755` |
| `/etc/cron.d/server-monitor` | `*/5 * * * * root /usr/local/bin/server-monitor.sh >/dev/null 2>&1` |
| `/etc/monitor/bale.env` | `BALE_TOKEN` and `BALE_CHAT_ID`, `root:root 600` |
| `/run/server-monitor.state` | Current alert text; empty means healthy |
| `/run/server-monitor.last` | Epoch of the last sent alert (hourly repeat) |

The cron entry already exists on the server; installing a new version of the
script does not require touching cron.

## Checks

| Check | Condition | Alert line |
| --- | --- | --- |
| Disk `/` | usage > 85 % | `DISK <n>% on /` |
| RAM | used > 90 % of `MemAvailable`/`MemTotal` | `RAM used <n>%` |
| Load | 1-minute load > 3.0 (stored as `load*100`) | `LOAD <n>/100 (1m)` |
| Containers | `docker inspect .State.Running` is not `true` | `CONTAINER <name> not running` |
| Strapi | `GET http://127.0.0.1:1338/_health` fails | `STRAPI http://127.0.0.1:1338/_health failed` |
| Frontend | `GET http://127.0.0.1:3001/` fails | `SITE http://127.0.0.1:3001/ failed` |
| SSH | `systemctl is-active ssh` fails | `sshd DOWN` |
| fail2ban | `systemctl is-active fail2ban` fails | `fail2ban DOWN` |
| nginx | `systemctl is-active nginx` fails | `nginx DOWN` |

The HTTP checks catch a container that is "running" but crash-looping or
returning 5xx, which a `docker inspect` check alone would miss.

## Watched containers

```sh
for c in studioarman-web-blog strapi-dev strapi-backup-dev; do
```

- `studioarman-web-blog` — Next.js frontend.
- `strapi-dev` — Strapi on `127.0.0.1:1338`, public at `strapi.studioarman.com`.
- `strapi-backup-dev` — daily Bale backup of `/home/deploy/strapi-dev/data`.

Intentionally **not** watched:

- `strapi` — the old production container on 1337. Stopped after the cutover
  and kept only as a rollback fallback.
- `strapi-backup` — the old backup for `/root/strapi-docker`. Still running as a
  safety net for the pre-cutover data, but not part of the live service. Add it
  to the loop if you want alerts while it is still around.

## Environment

`/etc/monitor/bale.env`:

```env
BALE_TOKEN=<bot token>
BALE_CHAT_ID=<chat id>
```

- Mode `600`, owner `root`, never committed.
- If the file is missing or unreadable, the script exits silently — no alerts.
- The script itself contains no secrets.

## Install or update the script

```bash
scp scripts/server-monitor.sh agent109:/tmp/server-monitor.sh

ssh agent109 "docker run --rm \
  -v /usr/local/bin:/dst \
  -v /tmp/server-monitor.sh:/src:ro \
  alpine sh -c 'cp /src /dst/server-monitor.sh && chown 0:0 /dst/server-monitor.sh && chmod 755 /dst/server-monitor.sh'"
```

This uses the `agent` account's Docker access, so no sudo is needed. With a
sudo-capable account the equivalent is:

```bash
scp scripts/server-monitor.sh deploy@109.122.250.34:/tmp/
ssh deploy109-key 'sudo install -m 755 -o root -g root /tmp/server-monitor.sh /usr/local/bin/server-monitor.sh'
```

No cron or env change is needed for a script-only update.

## Test and verify

Send a test message:

```bash
ssh deploy109-key 'sudo /usr/local/bin/server-monitor.sh --test'
```

Expected in Bale: `TEST <hostname>: watchdog online`.

Run the real checks manually:

```bash
ssh deploy109-key 'sudo /usr/local/bin/server-monitor.sh'
ssh deploy109-key 'sudo cat /run/server-monitor.state'
```

An empty state file means every check passed. When the state changes from an
alert to empty, the next run sends `RECOVERED <hostname>: all checks OK`.

## Troubleshooting

- **No Bale message at all** — `/etc/monitor/bale.env` is missing or not
  readable, or the token/chat ID is wrong. Run `--test` first.
- **`CONTAINER <name> not running` after a rename** — update the container list
  in the script and reinstall it.
- **`sshd DOWN` / `fail2ban DOWN` when running the script inside a plain
  container** — `systemctl` needs the host's systemd. Run the script on the host
  (cron does) or via `chroot /host`.
- **Cron output is discarded** (`>/dev/null 2>&1`). To see what a run produced,
  execute the script manually and inspect `/run/server-monitor.state`.

## Security

- Never put `BALE_TOKEN` or `BALE_CHAT_ID` in this repository, in the script, or
  in a workflow.
- Keep `/etc/monitor/bale.env` at mode `600` owned by `root`.
- The bot only needs permission to send messages to the admin chat.
