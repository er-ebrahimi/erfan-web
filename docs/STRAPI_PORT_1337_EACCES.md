# 🚨 Strapi "bind EACCES 0.0.0.0:1337" — Windows Fix

## The Problem

Strapi fails to start with:

```
[2026-08-09 21:18:47.457] error: bind EACCES 0.0.0.0:1337
Error: bind EACCES 0.0.0.0:1337
    at listenOnPrimaryHandle (node:net:2021:18)
    ...
```

This happens even though **nothing is listening** on port 1337 (`netstat -ano | findstr :1337` returns nothing).

## The Root Cause

On Windows, Hyper-V / WSL2 / Docker Desktop (the `winnat` service) dynamically reserves ranges of ports at boot. When Strapi's port falls inside an excluded range, Windows refuses to hand it over with `EACCES`.

Check it yourself:

```powershell
netsh interface ipv4 show excludedportrange protocol=tcp
```

If you see a range like `1254-1353` covering 1337, that's the culprit.

## 🛠️ Fix (Immediate)

Run as **administrator**:

```powershell
net stop winnat
net start winnat
```

This clears the dynamic exclusion ranges and frees port 1337 immediately.

## 🛠️ Fix (Permanent)

The ranges come back after every reboot. Reserve port 1337 permanently so Windows never dynamically grabs it — do this **while winnat is stopped** (right after `net stop winnat`):

```powershell
# as administrator, after net stop winnat
netsh int ipv4 add excludedportrange protocol=tcp startport=1337 numberofports=1
```

After this, 1337 shows up in the excluded list with a `*` (administered exclusion) and Strapi can always bind it.

## Notes

- Docker Desktop / WSL2 / Hyper-V is what creates these reservations at boot.
- If port 1337 is already inside an active dynamic range, you must stop `winnat` **before** adding the static exclusion, or the command fails.
