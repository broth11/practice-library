import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { choiceText, renderChoice, validChoice } from '../src/app/choices.js';

// Reconstruct the correct plot from the raw measurements, not from the answer key.
const values = [23, 17, 25, 12, 31, 24, 18, 35];
const stems = new Map();
for (const value of [...values].sort((a, b) => a - b)) {
  const stem = String(Math.floor(value / 10));
  if (!stems.has(stem)) stems.set(stem, []);
  stems.get(stem).push(String(value % 10));
}
const expected = { type: 'stem-and-leaf', rows: [...stems].map(([stem, leaves]) => ({ stem, leaves })) };
const unit = JSON.parse(readFileSync('src/content/ap-statistics/units/1-a.json', 'utf8'));
const question = unit.questions.find(q => q.id === 'a27');
assert.equal(question.notationKey, '1|2 = 12 centimeters', 'The complete key must remain one literal notation field.');
assert(question.choices.every(validChoice));
const matches = question.choices.flatMap((choice, i) => JSON.stringify(choice) === JSON.stringify(expected) ? ['ABCD'[i]] : []);
assert.deepEqual(matches, [question.answer], 'Exactly one plot must preserve all eight measurements in order.');
for (const choice of question.choices) {
  const html = renderChoice(choice);
  assert.equal((html.match(/class="stem-leaf-row"/g) || []).length, 3, 'Every option needs three visible stem rows.');
  assert(!html.includes(';'), 'Semicolons must not substitute for rows.');
  assert(choiceText(choice).includes('Stem 1:'), 'Screen readers need the actual stems and leaves.');
}
assert(validChoice('An ordinary text choice'));
assert.equal(renderChoice('An ordinary text choice'), 'An ordinary text choice');
assert(!validChoice({ type: 'stem-and-leaf', rows: [{ stem: '1', leaves: ['12'] }] }));
assert(!validChoice({ type: 'stem-and-leaf', rows: [] }));
console.log('Verified structured choices, screen-reader labels, and the independently reconstructed stem-and-leaf answer.');

// Structured hypotheses retain both statements, order, and an accessible full pair.
const hypotheses={type:'hypotheses',null:'p = 0.30',alternative:'p < 0.30'};
assert(validChoice(hypotheses));
assert.equal(choiceText(hypotheses),'H0: p = 0.30; Ha: p < 0.30');
assert(renderChoice(hypotheses).includes('<span>H0: p = 0.30</span><span>Ha: p &lt; 0.30</span>'));
assert(!validChoice({...hypotheses,alternative:''}));
const working={type:'math',tex:String.raw`\frac{0.25}{400}`,ariaLabel:'0.25 divided by 400'};
assert(validChoice(working));
assert.equal(choiceText(working),'0.25 divided by 400');
assert(renderChoice(working).includes('math-display'));
assert(!validChoice({...working,ariaLabel:''}));
