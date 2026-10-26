// Independent answer-key check. Every target below is computed from the problem's
// inputs (event counts, enumeration, or distribution parameters), never read from
// the keyed answer. Exactly one choice must match each target, and it must be the key.
//
// Unit 2.A targets port the trial package's verify_questions.py; Unit 2.B targets
// extend the legacy check-content.mjs assertions from commit 9abb4fc.
import { readFileSync } from 'node:fs';

import { Q, q, sum, Phi, invPhi, binom } from './lib/stats.mjs';
import './check-unit-one.mjs';
import './check-unit-two-a.mjs';
import './check-unit-two-a-concepts.mjs';
import './check-unit-two-b.mjs';

// ---------- combinatorics helpers ----------
const product = (values, repeat) => repeat === 0 ? [[]] : product(values, repeat - 1).flatMap(rest => values.map(v => [...rest, v]));
const range = n => Array.from({ length: n }, (_, i) => i);
const pairs = n => range(n).flatMap(a => range(n).filter(b => b > a).map(b => [a, b]));
const ordered = n => range(n).flatMap(a => range(n).filter(b => b !== a).map(b => [a, b]));
const count = (xs, test) => xs.filter(test).length;

// ---------- content ----------
const load = unit => JSON.parse(readFileSync(`src/content/ap-statistics/units/${unit}.json`, 'utf8'));
const units = { '2-a': load('2-a'), '2-b': load('2-b') };
const byId = Object.fromEntries(Object.entries(units).flatMap(([u, unit]) => unit.questions.map(x => [`${u}:${x.id}`, x])));
const diagram = file => JSON.parse(readFileSync('src/diagrams/ap-statistics.json', 'utf8')).diagrams.find(d => d.file === file);

const coins = product(['H', 'T'], 3);
const twoHeads = coins.filter(x => count(x, c => c === 'H') >= 2);
const dice = product([1, 2, 3, 4, 5, 6], 2);
const withSix = dice.filter(v => v.includes(6));
const q27rows = byId['2-a:q27'].stimulus.rows;
const q33 = diagram('q33-relative-frequency.svg');

// Exact targets (rational). Option text must equal the target, within half a unit
// in its last printed place for decimals.
const exact = {
  '2-a:q01': q(36, 200), '2-a:q02': q(18 + 42, 100),
  '2-a:q08': q(count(product([1, 2, 3, 4], 2), ([a, b]) => a + b === 5)),
  '2-a:q09': q(1).sub(q(22, 100)).sub(q(31, 100)),
  '2-a:q10': q(40 + 10, 20 + 50 + 80 + 40 + 10),
  '2-a:q11': q(42, 42 + 18), '2-a:q12': q(15, 75),
  '2-a:q14': q(count(twoHeads, x => count(x, c => c === 'H') === 3), twoHeads.length),
  '2-a:q15': q(36, 36 + 28), '2-a:q16': q(35, 100).mul(q(60, 100)),
  '2-a:q17': q(count(ordered(12), ([a, b]) => a < 5 && b < 5), ordered(12).length),
  '2-a:q18': q(80, 100).mul(q(90, 100)).mul(q(95, 100)),
  '2-a:q19': q(1).sub(q(4, 5).mul(q(4, 5)).mul(q(4, 5))),
  '2-a:q20': q(30, 100).mul(q(90, 100)).add(q(70, 100).mul(q(60, 100))),
  '2-a:q22': q(50, 100).add(q(40, 100)).sub(q(50, 100).mul(q(30, 100))),
  '2-a:q23': q(1).sub(q(75, 100).mul(q(60, 100))),
  '2-a:q27': q(q27rows[1][1] + q27rows[2][1], q27rows[1].at(-1) + q27rows[2].at(-1)),
  '2-a:q28': q(150 * 160, 400),
  '2-a:q32': q(count(pairs(6), ([a, b]) => a === 0 && b === 5), pairs(6).length),
  '2-a:q33': q(q33.counts[0] + q33.counts[1], q33.trials),
  '2-a:q36': q(18, 48), '2-a:q37': q(54, 54 + 16),
  '2-a:q38': q(count(withSix, ([a, b]) => a + b === 8), withSix.length),
  '2-a:q41': q(1, 4).mul(q(3, 5)).add(q(3, 4).mul(q(2, 5))),
  '2-a:q42': q(count(ordered(13), ([a, b]) => a < 5 && b < 5), ordered(13).length),
  '2-a:q43': q(55, 100).sub(q(40, 100).mul(q(80, 100))),
  '2-a:q44': q(1, 4).mul(q(2, 5)).add(q(3, 4).mul(q(4, 5))),
  '2-a:q45': q(24, 100).div(q(60, 100)),
  '2-a:q48': q(55, 100).add(q(40, 100)).sub(q(75, 100)),
  '2-a:q49': q(1).sub(q(3, 10).mul(q(1, 2))),
  '2-a:q50': q(200).mul(q(60, 100)),
  '2-b:b02': q(1).sub(Q.of('0.45')).sub(Q.of('0.35')),
  '2-b:b03': sum([[0, '0.15'], [1, '0.35'], [2, '0.30'], [3, '0.20']].map(([x, p]) => q(x).mul(p))),
  '2-b:b05': sum([[0, '0.70'], [5, '0.20'], [20, '0.10']].map(([x, p]) => q(x).mul(p))).sub(4),
  '2-b:b08': q(12).mul(Q.of('0.25')),
  '2-b:b09': Q.of('0.85').sub(Q.of('0.45')),
  '2-b:b10': Q.of('1.7').sub(Q.of('0.50')).div(Q.of('0.30')),
  '2-b:b50': q(count(pairs(4).map(([a, b]) => ([2, 4, 6, 8][a] + [2, 4, 6, 8][b]) / 2), m => m >= 6), pairs(4).length),
  // Empirical rule (68-95-99.7) values are exact by definition.
  '2-b:b23': q(68), '2-b:b24': Q.of('2.5'), '2-b:b25': q(84), '2-b:b26': q(66 - 42, 4),
  '2-b:b28': Q.of('0.34').add(Q.of('0.475')), '2-b:b30': q(54 - 6),
  '2-b:b27': q(60 - 72, 8)
};

// Real-valued targets (binomial and normal), compared at the printed precision.
const real = {
  '2-b:b06': Math.sqrt([[0, 0.2], [1, 0.4], [2, 0.2], [3, 0.2]].reduce((s, [x, p]) => s + p * (x - 1.4) ** 2, 0)),
  '2-b:b14': binom(10, 0.2, 3, 3), '2-b:b15': binom(8, 0.3, 0, 2), '2-b:b16': binom(12, 0.25, 4, 12), '2-b:b17': binom(10, 0.4, 0, 3),
  '2-b:b19': Math.sqrt(60 * 0.4 * 0.6),
  '2-b:b31': Phi((44 - 50) / 8), '2-b:b32': 1 - Phi((60 - 50) / 8), '2-b:b33': Phi((38 - 30) / 5) - Phi((25 - 30) / 5),
  '2-b:b34': Phi((19.6 - 20) / 0.4) + 1 - Phi((20.8 - 20) / 0.4),
  '2-b:b35': 80 + 12 * invPhi(0.90), '2-b:b36': 120 + 15 * invPhi(0.05), '2-b:b38': 42 - 5 * invPhi(0.10),
  '2-b:b40': 800 * (1 - Phi((2.45 - 2) / 0.3)),
  '2-b:b48': (diagram('b48-simulation.svg').counts.slice(6).reduce((a, b) => a + b, 0)) / 1000
};
// Discrete "least likely" item: compare every listed value's probability.
const leastLikely = { '2-b:b20': { n: 6, p: 0.9 } };

const parse = text => {
  const t = text.replace(/[−–]/g, '-').replace(/[$,\s]/g, '');
  if (t.includes('/')) { const [a, b] = t.split('/'); return { value: q(Number(a), Number(b)), places: null }; }
  const percent = t.endsWith('%');
  const body = percent ? t.slice(0, -1) : t;
  return { value: Q.of(body), places: (body.split('.')[1] || '').length, percent };
};
const failures = [];
let checked = 0;
const matchOne = (id, isMatch) => {
  const question = byId[id];
  if (!question) { failures.push(`${id}: question not found`); return; }
  const hits = question.choices.map((choice, i) => isMatch(parse(choice)) ? 'ABCD'[i] : null).filter(Boolean);
  checked += 1;
  if (hits.length !== 1 || hits[0] !== question.answer) failures.push(`${id}: target matched ${JSON.stringify(hits)}, key is ${question.answer}`);
};
for (const [id, target] of Object.entries(exact)) {
  matchOne(id, ({ value, places }) => places === null || places === 0 ? value.eq(target) : Math.abs(value - target) <= 0.5 * 10 ** -places + 1e-12);
}
for (const [id, target] of Object.entries(real)) {
  matchOne(id, ({ value, places }) => Math.abs(value - target) <= 0.5 * 10 ** -(places ?? 0) + 1e-9);
}
for (const [id, { n, p }] of Object.entries(leastLikely)) {
  matchOne(id, ({ value }) => { const listed = byId[id].choices.map(c => Number(c)); const probs = listed.map(k => binom(n, p, k, k)); return Number(value) === listed[probs.indexOf(Math.min(...probs))]; });
}

if (process.env.PRINT_TARGETS) console.log(JSON.stringify(Object.fromEntries(Object.entries(exact).map(([k, v]) => [k, String(v)]))));
if (failures.length) { console.error(`Answer check failed:\n- ${failures.join('\n- ')}`); process.exitCode = 1; }
else console.log(`Verified ${checked} answer keys against independently computed targets.`);
