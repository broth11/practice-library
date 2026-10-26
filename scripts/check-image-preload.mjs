// Exercise the asynchronous queue with controlled image completions, including
// failure recovery, duplicate requests, priority changes, and prior decoding.
import assert from 'node:assert/strict';
const started = [];
const pending = new Map();
let live = 0, maxLive = 0, decoded = 0;
globalThis.document = { baseURI: 'https://example.test/library/' };
globalThis.Image = class {
  set src(url) {
    this.url = url;
    started.push(url);
    pending.set(url, this);
    live += 1;
    maxLive = Math.max(maxLive, live);
  }
  async decode() { decoded += 1; }
};
const { preloadImages, preloadUnitImages, preloadLibraryImages, imageSource } = await import('../src/app/image-preload.js');
const url = file => `https://example.test/library/${file}`;
assert.equal(imageSource('assets/graph.svg'), url('assets/graph.svg'));
const complete = async (file, fail = false) => {
  const key = url(file), image = pending.get(key);
  assert.ok(image, `${file} should have started`);
  pending.delete(key); live -= 1;
  if (fail) image.onerror(); else image.onload();
  await new Promise(resolve => setImmediate(resolve));
};
preloadImages(['a.svg','b.svg','c.svg','d.svg','e.svg','f.svg']);
assert.equal(started.length,4,'initial downloads must be bounded');
preloadImages(['a.svg','b.svg','./a.svg',url('a.svg')]);
assert.equal(started.length,4,'loading duplicates must be coalesced');
preloadUnitImages({ questions: [{ stimulus: { type: 'image', src: 'f.svg' }, solutionStimulus: { type: 'image', src: 'g.svg' } }] });
await complete('a.svg');
assert.equal(started.at(-1),url('f.svg'),'selecting a unit promotes its queued figure');
await complete('b.svg',true);
assert.equal(started.at(-1),url('g.svg'),'a failed asset must not block the queue');
await complete('c.svg');
assert.equal(started.at(-1),url('e.svg'));
preloadImages(['a.svg']);
assert.equal(started.filter(x=>x===url('a.svg')).length,1,'decoded images must not be reloaded');
preloadImages(['b.svg']); // Failed assets can retry on a later selection.
await complete('d.svg');
assert.equal(started.filter(x=>x===url('b.svg')).length,2);
for (const file of ['f.svg','g.svg','e.svg','b.svg']) await complete(file);
assert.equal(maxLive,4);
assert.equal(decoded,7,'all successful assets should be decoded');
globalThis.fetch = async () => ({ ok: true, json: async () => ({ images: ['a.svg','h.svg'] }) });
await preloadLibraryImages();
assert.equal(started.at(-1),url('h.svg'));
await complete('h.svg');
console.log('Verified image preload concurrency, deduplication, selected-unit priority, decoding, and failure recovery.');
