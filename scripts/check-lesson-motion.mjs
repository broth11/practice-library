// Verify the requested sequence against a controlled animation clock: the
// buttons must remain closed throughout the slide, then reveal at the top.
import assert from 'node:assert/strict';
import { animateLesson } from '../src/app/lesson-motion.js';
let now = 0, nextFrame = 0;
const frames = new Map();
Object.defineProperty(globalThis, 'performance', { value: { now: () => now }, configurable: true });
globalThis.requestAnimationFrame = callback => { frames.set(++nextFrame, callback); return nextFrame; };
globalThis.cancelAnimationFrame = id => frames.delete(id);
globalThis.getComputedStyle = () => ({ paddingTop: '10px', paddingBottom: '10px' });
async function step(time) {
  now = time;
  const callbacks = [...frames.values()]; frames.clear();
  callbacks.forEach(callback => callback(now));
  for (let i = 0; i < 5; i++) await Promise.resolve();
}
function fixture() {
  const style = { get cssText() { return ''; }, set cssText(value) {
    assert.equal(value, '');
    for (const key of ['height', 'paddingTop', 'paddingBottom', 'opacity', 'overflow']) delete this[key];
  } };
  const dots = { style, inert: false, getBoundingClientRect: () => ({ height: style.height === undefined ? 157 : parseFloat(style.height) }) };
  const pane = { scrollTop: 0, isConnected: true, getBoundingClientRect: () => ({ top: 0 }) };
  const group = { querySelector: () => dots, getBoundingClientRect: () => ({ top: 500 - pane.scrollTop }) };
  const controller = new AbortController();
  return { dots, pane, controller, options: { pane, group, startOffset: 500, reserveSpace: () => {}, signal: controller.signal } };
}
const first = fixture();
const completed = animateLesson(first.options);
await step(150);
assert.equal(first.pane.scrollTop, 250, 'halfway through the 300ms slide');
assert.equal(first.dots.style.height, '0px', 'buttons stay hidden during the slide');
await step(300);
assert.equal(first.pane.scrollTop, 500, 'lesson reaches the top after 300ms');
assert.equal(first.dots.style.height, '0px', 'reveal starts only after arrival');
await step(450);
assert.equal(first.pane.scrollTop, 500, 'heading stays at the top during reveal');
assert.equal(first.dots.style.height, '78.5px', 'halfway through the separate 300ms reveal');
await step(600);
assert.equal(await completed, true);
assert.equal(first.dots.inert, false, 'buttons become interactive after the reveal');
assert.equal(first.dots.style.height, undefined, 'natural grid sizing is restored');
assert.equal(frames.size, 0);
const interrupted = fixture();
const canceled = animateLesson(interrupted.options);
await step(700);
interrupted.controller.abort();
assert.equal(await canceled, false);
const stoppedAt = interrupted.pane.scrollTop;
await step(1300);
assert.equal(interrupted.pane.scrollTop, stoppedAt, 'canceled animation cannot resume');
assert.equal(interrupted.dots.inert, false);
const reduced = fixture();
assert.equal(await animateLesson({ ...reduced.options, duration: 0 }), true);
assert.equal(reduced.pane.scrollTop, 500);
assert.equal(reduced.dots.inert, false);
assert.equal(frames.size, 0, 'reduced motion schedules no animation frames');
console.log('Verified sequential 300ms slide and 300ms reveal, cancellation, and reduced motion.');
