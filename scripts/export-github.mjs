import { access, mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const requested = process.argv[2] || 'practice-library-github.tar.gz';
const destination = resolve(root, requested);
await mkdir(dirname(destination), { recursive: true });

for (const command of [['node', ['scripts/check.mjs']], ['node', ['scripts/build.mjs']]]) {
  const result = spawnSync(command[0], command[1], { cwd: root, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}

const listed = spawnSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { cwd: root, encoding: 'utf8' });
if (listed.status !== 0) process.exit(listed.status || 1);
const files = [];
for (const file of listed.stdout.split('\n').filter(Boolean)) {
  if (resolve(root, file) === destination) continue;
  if (await access(resolve(root, file)).then(() => true, () => false)) files.push(file);
}
const archive = spawnSync('tar', ['-czf', destination, '-C', root, ...files], { cwd: root, stdio: 'inherit' });
if (archive.status !== 0) process.exit(archive.status || 1);
console.log(`Created GitHub-ready archive at ${destination}`);
