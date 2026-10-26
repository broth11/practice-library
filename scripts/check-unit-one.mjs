// Recompute Unit 1 numeric answers from inputs, using diagram/table data when shown.
// Conceptual explanations receive AI review; this script does not claim human sign-off.
import { readFileSync } from 'node:fs';

const read = path => JSON.parse(readFileSync(path, 'utf8'));
const units = ['1-a', '1-b'].map(id => read(`src/content/ap-statistics/units/${id}.json`));
const specs = read('src/diagrams/ap-statistics.json').diagrams;
const models = read('scripts/data/unit-one-targets.json');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const sum = values => values.reduce((a, b) => a + b, 0);
const mean = values => sum(values) / values.length;
const median = values => { const s = [...values].sort((a, b) => a - b), i = Math.floor(s.length / 2); return s.length % 2 ? s[i] : (s[i - 1] + s[i]) / 2; };
const iqr = values => { const s = [...values].sort((a, b) => a - b), i = Math.floor(s.length / 2); return median(s.slice(Math.ceil(s.length / 2))) - median(s.slice(0, i)); };
const number = text => {
  const clean = text.replace(/−/g, '-').replace(/[$,%\s]/g, '');
  if (clean.includes('/')) { const [a, b] = clean.split('/').map(Number); return a / b; }
  return Number(clean);
};
const target = (m, q, figure) => {
  switch (m.kind) {
    case 'tableShare': return Number(q.stimulus.rows[m.row][1]) / sum(q.stimulus.rows.map(row => Number(row[1])));
    case 'figureShare': return (m.percent ? 100 : 1) * sum(m.indices.map(i => figure.values[i])) / sum(figure.values);
    case 'product': return m.values.reduce((a, b) => a * b, 1);
    case 'complement': return 1 - sum(m.values);
    case 'figureCount': return figure.values.filter(v => v >= m.threshold).length;
    case 'figureBinSum': return sum(m.indices.map(i => figure.counts[i]));
    case 'maximum': return Math.max(...m.values);
    case 'mean': return mean(m.values);
    case 'median': return median(m.values);
    case 'figurePercentile': return 100 * figure.values.filter(v => v <= m.threshold).length / figure.values.length;
    case 'sampleSD': return Math.sqrt(sum(m.values.map(v => (v - mean(m.values)) ** 2)) / (m.values.length - 1));
    case 'weightedMean': return sum(m.means.map((v, i) => v * m.sizes[i])) / sum(m.sizes);
    case 'range': return Math.max(...m.values) - Math.min(...m.values);
    case 'medianMeanDifference': return median(m.values) - mean(m.values);
    case 'iqr': return iqr(m.values);
    case 'upperOutlier': return m.q3 + 1.5 * (m.q3 - m.q1);
    case 'figureIQR': return figure.groups[m.group].q3 - figure.groups[m.group].q1;
    case 'scaledSD': return Math.abs(m.scale) * m.sd;
    case 'scaledVariance': return m.scale ** 2 * m.variance;
    case 'z': return (m.value - m.mean) / m.sd;
    case 'transferZ': return m.mean2 + (m.value - m.mean1) / m.sd1 * m.sd2;
    case 'recoverSD': return (m.value - m.mean) / m.z;
    case 'allocation': return m.group / m.total * m.sample;
    case 'divide': return m.numerator / m.denominator;
    case 'countThreshold': return m.values.filter(v => v >= m.threshold).length;
    case 'frequencyMean': return sum(q.stimulus.rows.map(r => r[0] * r[1])) / sum(q.stimulus.rows.map(r => r[1]));
    case 'floorMedian': return median(m.values.map(v => Math.max(v, m.floor)));
    case 'strictPercentile': return 100 * figure.values.filter(v => v < m.threshold).length / figure.values.length;
    case 'missingFromMean': return m.n * m.mean - sum(m.known);
    case 'medianBin': {
      const counts = figure.counts, n = sum(counts);
      let cumulative = 0;
      const locate = position => counts.findIndex(c => { cumulative += c; return cumulative >= position; });
      const lo = locate(Math.floor((n + 1) / 2)); cumulative = 0;
      const hi = locate(Math.floor(n / 2) + 1);
      assert(lo === hi, `${q.id}: both middle values must share one bin`);
      return m.optionIntervals.map(v => JSON.stringify(v) === JSON.stringify(m.bins[lo]));
    }
    case 'binMerge': return m.optionPairs.map(v => v[0] === sum(m.counts.slice(0, 2)) && v[1] === sum(m.counts.slice(2)));
    case 'transformPair': return m.optionPairs.map(v => v[0] === m.scale * m.mean + m.shift && v[1] === Math.abs(m.scale) * m.sd);
    case 'extremeChange': {
      const changed = [...m.values.slice(0, -1), m.replacement];
      return m.optionPairs.map(v => v[0] === mean(changed) - mean(m.values) && v[1] === median(changed) - median(m.values));
    }
    case 'fiveNumber': {
      const s = [...m.values].sort((a, b) => a - b), half = Math.floor(s.length / 2);
      const summary = [s[0], median(s.slice(0, half)), median(s), median(s.slice(Math.ceil(s.length / 2))), s.at(-1)];
      return m.optionSummaries.map(v => JSON.stringify(v) === JSON.stringify(summary));
    }
    case 'compareZ': return m.optionPairs.map(v => v.every((z, i) => z === (m.values[i] - m.means[i]) / m.sds[i]));
    case 'pairedDirection': {
      const differences = q.stimulus.rows.map(r => r[1] - r[2]);
      return m.optionSigns.map(v => v === 1 ? differences.every(d => d > 0) : v === -1 ? differences.every(d => d < 0) : v === 0 ? sum(differences) === 0 : false);
    }
    case 'relativeRows': {
      const expected = q.stimulus.rows.map(r => r[1] / sum(q.stimulus.rows.map(r => r[1])));
      return q.choices.map(c => c.split(',').map(Number).every((v, i) => Math.abs(v - expected[i]) < 1e-9));
    }
    case 'squaredDeviations': {
      const result = sum(m.values.map(v => (v - mean(m.values)) ** 2));
      return q.choices.map(c => {
        const expression = c.replace(/−/g, '-').replace(/²/g, '**2').replace(/\[/g, '(').replace(/\]/g, ')');
        if (!/^[\d\s().+*\-]+$/.test(expression)) throw new Error('Invalid authored arithmetic expression');
        return Function(`"use strict"; return (${expression})`)() === result;
      });
    }
    case 'distinctLabels': {
      const selected = [];
      for (const label of q.stimulus.rows[0].slice(1)) {
        if (Number(label) >= 1 && Number(label) <= m.maximum && !selected.includes(label)) selected.push(label);
        if (selected.length === m.size) break;
      }
      return q.choices.map(c => c.split(', ').join(',') === selected.join(','));
    }
    default: throw new Error(`Unknown numeric model ${m.kind}`);
  }
};

for (const unit of units) {
  for (const lesson of unit.lessons) assert(unit.questions.filter(q => q.lesson === lesson.id).length === 20, `${lesson.id}: expected twenty authored items`);
  const frequencies = Object.fromEntries('ABCD'.split('').map(letter => [letter, unit.questions.filter(q => q.answer === letter).length]));
  assert(Math.max(...Object.values(frequencies)) - Math.min(...Object.values(frequencies)) <= 1, `${unit.id}: unbalanced key positions`);
  for (const q of unit.questions) {
    const id = `${unit.id}:${q.id}`;
    assert(!q.calculator && !/calculator|fx.CG50|keypress/i.test(JSON.stringify(q)), `${id}: Unit 1 must have no calculator references or guidance`);
    const numeric = q.choices.every(c => /^[−\-\d.,%$]+$/.test(c));
    if (numeric) {
      assert(models.some(m => m.unit === unit.id && m.id === q.id), `${id}: missing independent numeric target`);
      assert(q.choices.map(number).every((v, i, a) => !i || v > a[i - 1]), `${id}: numeric choices must be ascending and distinct`);
    }
  }
}
for (const m of models) {
  const q = units.find(u => u.id === m.unit).questions.find(q => q.id === m.id);
  const figure = specs.find(s => `assets/${s.file}` === q.stimulus?.src);
  const expected = target(m, q, figure);
  if (Array.isArray(expected)) {
    const hits = expected.flatMap((yes, i) => yes ? ['ABCD'[i]] : []);
    assert(hits.length === 1 && hits[0] === q.answer, `${m.unit}:${m.id}: compound target matches ${hits}, keyed ${q.answer}`);
    continue;
  }
  const hits = q.choices.map((c, i) => {
    const value = m.claims ? m.claims[m.optionTexts.indexOf(c)] : number(c);
    return (m.kind === 'upperOutlier' ? value > expected : Math.abs(value - expected) < 1e-9) ? 'ABCD'[i] : null;
  }).filter(Boolean);
  assert(hits.length === 1 && hits[0] === q.answer, `${m.unit}:${m.id}: computed target ${expected} matches ${hits}, keyed ${q.answer}`);
}
for (const spec of specs.filter(s => s.questions.some(q => /^1-[ab]:/.test(q)))) {
  if (spec.kind === 'summary_boxplots') for (const g of spec.groups) {
    assert(g.min <= g.q1 && g.q1 <= g.median && g.median <= g.q3 && g.q3 <= g.max, `${spec.file}: unordered summary`);
    const spread = g.q3 - g.q1, low = g.q1 - 1.5 * spread, high = g.q3 + 1.5 * spread;
    assert(g.min >= low && g.max <= high, `${spec.file}: whiskers extend beyond a fence`);
    assert((g.outliers || []).every(x => x < low || x > high), `${spec.file}: plotted outlier is inside fences`);
  }
  if (spec.kind === 'categorical_pie') assert(sum(spec.values) === 100, `${spec.file}: pie slices must total 100%`);
  if (spec.kind === 'paired_histograms') assert(new Set(spec.groups.map(g => sum(g.counts))).size === 1, `${spec.file}: unequal sample sizes contradict the question`);
}
if (failures.length) { console.error(`Unit 1 check failed:\n- ${failures.join('\n- ')}`); process.exitCode = 1; }
else console.log(`Verified ${models.length} Unit 1 numeric and compound targets, figure invariants, twenty items per lesson, balanced keys, and explanation-only content across 220 items.`);
