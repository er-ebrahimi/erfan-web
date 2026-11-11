import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from 'vitest';

const SOURCE_DIRS = ['app', 'lib'];

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      return name === '__tests__' ? [] : sourceFiles(full);
    }
    return /\.(ts|tsx)$/.test(name) ? [full] : [];
  });
}

describe('environment rules', () => {
  it('never falls back when FRONT_URL is missing', () => {
    const offenders = SOURCE_DIRS.flatMap((dir) =>
      sourceFiles(join(process.cwd(), dir))
    ).filter((file) =>
      /process\.env\.FRONT_URL\s*\|\|/.test(readFileSync(file, 'utf8'))
    );

    expect(offenders).toEqual([]);
  });

  it('never emits the template placeholder domain', () => {
    const placeholder = ['website', 'com'].join('.');
    const offenders = SOURCE_DIRS.flatMap((dir) =>
      sourceFiles(join(process.cwd(), dir))
    ).filter((file) => readFileSync(file, 'utf8').includes(placeholder));

    expect(offenders).toEqual([]);
  });
});
