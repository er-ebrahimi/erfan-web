import * as os from 'node:os';
import * as path from 'node:path';
// CJS interop via createRequire — sidesteps ESM/CJS default-export friction.
import { ZipArchive } from 'archiver';
import { createHash } from 'node:crypto';
import {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { rename } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const requireStrapi = createRequire(
  path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
    'strapi',
    'package.json'
  )
);
const Database = requireStrapi('better-sqlite3');

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);

const env = (name, fallback) => process.env[name] ?? fallback;

/**
 * @typedef {{ name: string; path: string; size: number; sha256: string }} BackupPart
 * @typedef {{ name: 'bale' | 'telegram'; base: string; token: string; chatId: string }} Messenger
 */

function resolveMessengers() {
  const chatId = env('BACKUP_CHAT_ID', '').trim();
  const messengers = [];

  const baleToken = env('BALE_TOKEN', '').trim();
  if (baleToken) {
    messengers.push({
      name: 'bale',
      base: 'https://tapi.bale.ai',
      token: baleToken,
      chatId,
    });
  }

  const telegramToken = env('TELEGRAM_TOKEN', '').trim();
  if (telegramToken) {
    messengers.push({
      name: 'telegram',
      base: 'https://api.telegram.org',
      token: telegramToken,
      chatId,
    });
  }

  return messengers;
}

async function request(base, token, method, init, attempts = 3) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`${base}/bot${token}/${method}`, init);
    const json = await res.json();
    if (res.ok && json.ok) return json.result;
    if (attempt >= attempts) {
      throw new Error(
        `${method} failed: ${json.description ?? res.statusText} (${res.status})`
      );
    }
    const delay = 3000 * attempt;
    console.warn(
      `[backup] ${method} failed (${json.description}). Retrying in ${delay}ms…`
    );
    await new Promise((r) => setTimeout(r, delay));
  }
}

async function sendMessage(m, text) {
  await request(m.base, m.token, 'sendMessage', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: m.chatId, text }),
  });
}

async function sendDocument(m, part, caption) {
  const form = new FormData();
  form.append('chat_id', m.chatId);
  form.append('caption', caption);
  form.append('document', new Blob([readFileSync(part.path)]), part.name);
  await request(m.base, m.token, 'sendDocument', {
    method: 'POST',
    body: form,
  });
}

function sha256File(file) {
  const hash = createHash('sha256');
  return new Promise((resolve, reject) => {
    const stream = createReadStream(file);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

async function snapshotDb(dbPath, outDir) {
  const dest = path.join(outDir, 'data.db');
  const db = new Database(dbPath, { readonly: true });
  try {
    await db.backup(dest);
  } finally {
    db.close();
  }
  return dest;
}

async function zipFiles(zipPath, dbSnapshot, publicDir) {
  const output = createWriteStream(zipPath);
  const archive = new ZipArchive({ zlib: { level: 9 } });
  const done = new Promise((resolve, reject) => {
    output.on('close', resolve);
    archive.on('error', reject);
  });
  archive.pipe(output);
  archive.file(dbSnapshot, { name: 'data.db' });
  if (existsSync(publicDir) && statSync(publicDir).isDirectory()) {
    archive.directory(publicDir, 'public');
  }
  await archive.finalize();
  await done;
}

async function splitFile(zipPath, chunkBytes) {
  // highWaterMark = chunk size, so every 'data' event is exactly one part.
  const parts = [];
  const stem = path.basename(zipPath).replace(/\.zip$/, '');
  const dir = path.dirname(zipPath);
  const read = createReadStream(zipPath, { highWaterMark: chunkBytes });
  let index = 0;
  for await (const chunk of read) {
    index++;
    const name = `${stem}.part${String(index).padStart(4, '0')}.zip`;
    const partPath = path.join(dir, name);
    writeFileSync(partPath, chunk);
    parts.push({
      name,
      path: partPath,
      size: chunk.length,
      sha256: createHash('sha256').update(chunk).digest('hex'),
    });
  }
  return parts;
}

function buildManifest(zipName, zipSize, zipHash, parts) {
  const lines = [
    `Backup: ${zipName}`,
    `Size: ${(zipSize / 1024 / 1024).toFixed(2)} MB · Parts: ${parts.length}`,
    `SHA256: ${zipHash}`,
    `Part hashes:`,
    ...parts.map((p) => `${p.name}  ${p.sha256}  (${p.size} B)`),
  ];
  if (lines.join('\n').length > 3500) {
    return lines.slice(0, 4).join('\n');
  }
  return lines.join('\n');
}

function pruneKeepDir(keepDir, keep) {
  if (!existsSync(keepDir)) return;
  const zips = readdirSync(keepDir)
    .filter((f) => f.endsWith('.zip'))
    .map((f) => path.join(keepDir, f))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
  for (const old of zips.slice(keep)) {
    rmSync(old, { force: true });
  }
}

async function main() {
  const dbPath = env(
    'BACKUP_DB_PATH',
    path.join(repoRoot, 'strapi', '.tmp', 'data.db')
  );
  const publicDir = env(
    'BACKUP_PUBLIC_DIR',
    path.join(repoRoot, 'strapi', 'public')
  );
  const keepDir = env(
    'BACKUP_KEEP_DIR',
    path.join(repoRoot, 'strapi', '.tmp', 'backups')
  );
  const keep = Number(env('BACKUP_KEEP', '3'));
  const chunkBytes = Number(env('BACKUP_CHUNK_MB', '44')) * 1024 * 1024;

  if (!existsSync(dbPath)) {
    throw new Error(
      `Database file not found at ${dbPath}. Set BACKUP_DB_PATH to the SQLite file (strapi/.tmp/data.db by default).`
    );
  }

  const messengers = resolveMessengers();
  if (messengers.length === 0) {
    throw new Error(
      'No messenger configured. Set BALE_TOKEN and/or TELEGRAM_TOKEN (and BACKUP_CHAT_ID).'
    );
  }

  const stamp = new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d+Z$/, '')
    .replace('T', '-');
  const zipName = `strapi-backup-${stamp}.zip`;
  const outDir = path.join(os.tmpdir(), 'strapi-backup');
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  const zipPath = path.join(outDir, zipName);

  console.log(`[backup] Snapshotting ${dbPath}`);
  const dbSnapshot = await snapshotDb(dbPath, outDir);

  console.log(`[backup] Zipping data.db + ${publicDir} → ${zipName}`);
  await zipFiles(zipPath, dbSnapshot, publicDir);

  const zipHash = await sha256File(zipPath);
  const zipSize = statSync(zipPath).size;

  console.log(`[backup] Splitting into ${chunkBytes / 1024 / 1024} MB parts`);
  const parts = await splitFile(zipPath, chunkBytes);
  console.log(
    `[backup] ${parts.length} part(s), total ${(zipSize / 1024 / 1024).toFixed(2)} MB`
  );

  for (const m of messengers) {
    console.log(`[backup] Sending to ${m.name} (chat ${m.chatId})`);
    await sendMessage(m, buildManifest(zipName, zipSize, zipHash, parts));
    let sent = 0;
    for (const [i, part] of parts.entries()) {
      await sendDocument(m, part, `part ${i + 1}/${parts.length}`);
      sent++;
      console.log(
        `[backup]   ${m.name}: uploaded ${part.name} (${sent}/${parts.length})`
      );
    }
  }

  mkdirSync(keepDir, { recursive: true });
  const kept = path.join(keepDir, zipName);
  await rename(zipPath, kept);
  pruneKeepDir(keepDir, keep);
  rmSync(outDir, { recursive: true, force: true });
  console.log(`[backup] Done. Kept local copy: ${kept}`);
}

main().then(
  () => {
    process.exitCode = 0;
  },
  (err) => {
    console.error(`[backup] FAILED: ${err.message}`);
    process.exitCode = 1;
  }
);
