import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'src');
const output = resolve(root, 'dist');

// Stable source fingerprint keeps browsers from mixing old modules with new content.
const fingerprint = createHash('sha256');
async function hashSource(directory, prefix = '') {
  for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    const relative = `${prefix}${entry.name}`;
    if (entry.isDirectory()) await hashSource(resolve(directory, entry.name), `${relative}/`);
    else { fingerprint.update(relative); fingerprint.update(await readFile(resolve(directory, entry.name))); }
  }
}
await hashSource(source);
fingerprint.update(await readFile(fileURLToPath(import.meta.url)));
const version = fingerprint.digest('hex').slice(0, 12);

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await mkdir(resolve(output, 'assets'), { recursive: true });

await Promise.all([
  cp(resolve(source, 'app'), resolve(output, 'app'), { recursive: true }),
  cp(resolve(source, 'content'), resolve(output, 'content'), { recursive: true }),
  cp(resolve(source, 'styles'), resolve(output, 'styles'), { recursive: true }),
  cp(resolve(source, 'assets', 'diagrams'), resolve(output, 'assets'), { recursive: true })
]);
await Promise.all([
  cp(resolve(source, 'assets', 'casio-icons'), resolve(output, 'assets', 'casio-icons'), { recursive: true })
]);

await Promise.all([
  cp(resolve(source, 'index.html'), resolve(output, 'index.html')),
  cp(resolve(source, 'vendor-katex.min.js'), resolve(output, 'katex.min.js'))
]);

const build = {
  schemaVersion: 1,
  version,
  source: 'src/',
  note: 'Generated output. Edit src/ and rebuild.'
};
await writeFile(resolve(output, 'build.json'), `${JSON.stringify(build, null, 2)}\n`);

for (const file of (await readdir(resolve(output, 'app'))).filter(file => file.endsWith('.js'))) {
  const path = resolve(output, 'app', file);
  const code = await readFile(path, 'utf8');
  await writeFile(path, code.replace(/from (['"])(\.\/[^'"]+\.js)\1/g, (_, quote, path) => `from ${quote}${path}?v=${version}${quote}`));
}
const html = (await readFile(resolve(output, 'index.html'), 'utf8')).replace(/((?:src|href)="(?:app\/app\.js|katex\.min\.js|styles\/[^"?]+\.css))"/g, `$1?v=${version}"`);
await writeFile(resolve(output, 'index.html'), html);
if (!html.includes(`type="module" src="app/app.js?v=${version}"`)) throw new Error('Build did not produce the versioned modular application shell.');
console.log('Built dist/ from modular source.');
