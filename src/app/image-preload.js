// Warm the browser's image and decode caches without blocking the practice UI.
const images = new Map();
const queue = [];
const concurrency = 4;
let active = 0;
const version = new URL(import.meta.url).searchParams.get('v');

export function imageSource(source) {
  const url = new URL(source, document.baseURI);
  if (version) url.searchParams.set('v', version);
  return url.href;
}

function pump() {
  while (active < concurrency && queue.length) {
    const entry = queue.shift();
    entry.state = 'loading';
    active += 1;
    const image = new Image();
    entry.image = image; // Retain decoded images for the current page visit.
    image.decoding = 'async';
    image.fetchPriority = 'low';
    const finish = success => {
      if (success) entry.state = 'ready';
      else images.delete(entry.url); // A later selection can retry a failed asset.
      active -= 1;
      pump();
    };
    image.onload = () => {
      // A decode failure must not stall unrelated preloads or normal navigation.
      image.decode().catch(() => {}).then(() => finish(true));
    };
    image.onerror = () => finish(false);
    image.src = entry.url;
  }
}

export function preloadImages(sources, priority = false) {
  const pending = [];
  for (const url of new Set(sources.map(imageSource))) {
    let entry = images.get(url);
    if (entry) {
      if (!priority || entry.state !== 'queued') continue;
      queue.splice(queue.indexOf(entry), 1);
    } else {
      entry = { url, state: 'queued' };
      images.set(url, entry);
    }
    pending.push(entry);
  }
  if (priority) queue.unshift(...pending);
  else queue.push(...pending);
  pump();
}

export function preloadUnitImages(unit) {
  preloadImages(unit.questions.flatMap(question => [question.stimulus, question.solutionStimulus]
    .filter(stimulus => stimulus?.type === 'image').map(stimulus => stimulus.src)), true);
}

export async function preloadLibraryImages() {
  const url = new URL('../image-preloads.json', import.meta.url);
  if (version) url.searchParams.set('v', version);
  const response = await fetch(url, { cache: 'no-cache' });
  if (!response.ok) throw new Error('Image preload index unavailable.');
  const manifest = await response.json();
  preloadImages(manifest.images);
}
