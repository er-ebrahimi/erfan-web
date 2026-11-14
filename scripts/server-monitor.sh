#!/bin/sh
# Host watchdog for the Studioarman stack.
# Installed at /usr/local/bin/server-monitor.sh and run by /etc/cron.d/server-monitor
# every 5 minutes as root.
# Secrets live in /etc/monitor/bale.env (BALE_TOKEN, BALE_CHAT_ID) and must never
# be committed. Edge-triggered: alerts on state change, repeats hourly, and sends
# RECOVERED once the checks pass again.
ENVF=/etc/monitor/bale.env
[ -r "$ENVF" ] || exit 0
. "$ENVF"
send() { curl -fsS -m 10 "https://tapi.bale.ai/bot$BALE_TOKEN/sendMessage" \
  --data-urlencode "chat_id=$BALE_CHAT_ID" --data-urlencode "text=$1" >/dev/null 2>&1; }

[ "$1" = "--test" ] && { send "TEST $(hostname): watchdog online"; exit 0; }

alert=""
add() { alert="$alert
$1"; }

disk=$(df -P / | awk 'NR==2{sub("%","",$5);print $5}')
mem=$(awk '/MemTotal/{t=$2}/MemAvailable/{a=$2}END{if(t>0)printf "%d",(t-a)*100/t}' /proc/meminfo)
load=$(awk '{printf "%d",$1*100}' /proc/loadavg)

[ "${disk:-0}" -gt 85 ] && add "DISK ${disk}% on /"
[ "${mem:-0}"  -gt 90 ] && add "RAM used ${mem}%"
[ "${load:-0}" -gt 300 ] && add "LOAD ${load}/100 (1m)"

for c in studioarman-web-blog strapi-dev strapi-backup-dev; do
  [ "$(docker inspect -f '{{.State.Running}}' "$c" 2>/dev/null)" = "true" ] || add "CONTAINER $c not running"
done

# A running container can still crash-loop or return 5xx, so check the two entrypoints too.
curl -fsS -m 5 -o /dev/null http://127.0.0.1:1338/_health \
  || add "STRAPI http://127.0.0.1:1338/_health failed"
curl -fsSL -m 10 -o /dev/null http://127.0.0.1:3001/ \
  || add "SITE http://127.0.0.1:3001/ failed"

systemctl is-active --quiet ssh || add "sshd DOWN"
systemctl is-active --quiet fail2ban || add "fail2ban DOWN"
systemctl is-active --quiet nginx || add "nginx DOWN"

STATE=/run/server-monitor.state
LAST=/run/server-monitor.last
prev=$(cat "$STATE" 2>/dev/null)
lastsent=$(cat "$LAST" 2>/dev/null || echo 0)
now=$(date +%s)

if [ -n "$alert" ]; then
  if [ "$alert" != "$prev" ] || [ $((now-lastsent)) -gt 3600 ]; then
    send "PROBLEM $(hostname):$alert"
    echo "$now" > "$LAST"
  fi
  printf '%s' "$alert" > "$STATE"
elif [ -n "$prev" ]; then
  send "RECOVERED $(hostname): all checks OK"
  : > "$STATE"
fi
exit 0
