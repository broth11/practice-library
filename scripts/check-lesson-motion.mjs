// Verify moving and opening progress together on one controlled 600ms clock.
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
await step(300);
assert.equal(first.pane.scrollTop, 250, 'halfway through the 600ms slide');
assert.equal(first.dots.style.height, '78.5px', 'buttons are halfway open halfway through the move');
assert.equal(first.dots.style.opacity, '0.5', 'button fade shares the same progress');
await step(600);
assert.equal(first.pane.scrollTop, 500, 'lesson reaches the top after 600ms');
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
assert.equal(await animateLesson({ ...reduced.options, reducedMotion: true }), true);
assert.equal(reduced.pane.scrollTop, 500);
assert.equal(reduced.dots.inert, false);
assert.equal(frames.size, 0, 'reduced motion schedules no animation frames');
// Closing a previous grid above the chosen lesson changes the destination.
// Both grids and the scroll must still share the same progress without a snap.
const switching = fixture();
const oldDots = fixture().dots;
let oldOpen = false;
const retiringGroup = {
  classList: { add: () => { oldOpen = true; }, remove: () => { oldOpen = false; } },
  querySelector: selector => selector === '.question-dots' ? oldDots : { setAttribute() {} }
};
switching.options.group.getBoundingClientRect = () => ({
  top: 500 - (157 - (oldOpen ? oldDots.getBoundingClientRect().height : 0)) - switching.pane.scrollTop
});
const switched = animateLesson({ ...switching.options, retiringGroup });
await step(1600);
assert.equal(switching.dots.style.height, '78.5px');
assert.equal(oldDots.style.height, '78.5px', 'previous grid closes as the selected grid opens');
assert.equal(switching.pane.scrollTop, 210.75, 'scroll follows the changing destination');
await step(1900);
assert.equal(await switched, true);
assert.equal(oldOpen, false);
assert.equal(oldDots.inert, false);
assert.equal(switching.pane.scrollTop, 343, 'selected heading finishes at its updated top position');
assert.equal(switching.options.group.getBoundingClientRect().top, 0);
console.log('Verified simultaneous 600ms move and button reveal, cancellation, and reduced motion.');
