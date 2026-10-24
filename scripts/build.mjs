import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'src');
const output = resolve(root, 'dist');

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
  source: 'src/',
  note: 'Generated output. Edit src/ and rebuild.'
};
await writeFile(resolve(output, 'build.json'), `${JSON.stringify(build, null, 2)}\n`);

const html = await readFile(resolve(output, 'index.html'), 'utf8');
if (!html.includes('type="module" src="app/app.js"')) throw new Error('Build did not produce the modular application shell.');
console.log('Built dist/ from modular source.');
