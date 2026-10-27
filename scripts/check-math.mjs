// Mathematical notation check (see .claude/skills/practice-library-question-author/references/math-authoring.md).
// - Every explicit math node parses in the bundled KaTeX, strictly.
// - Every fragment the legacy prose detector would typeset also parses.
// - No <br> inside an inline math span: multi-line work must be a display node.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { probabilityLatex, mathSequence, looksMathematical } from '../src/app/math.js';

// The bundled KaTeX is a UMD script; load it in a sandbox because this package is ESM.
const sandbox = { module: { exports: {} } };
sandbox.exports = sandbox.module.exports;
vm.runInNewContext(readFileSync('src/vendor-katex.min.js', 'utf8'), sandbox);
const katex = sandbox.module.exports.default || sandbox.module.exports;
const render = (tex, displayMode) => katex.renderToString(tex, { throwOnError: true, strict: 'error', displayMode });
const strip = html => html.replace(/<[^>]+>/g, ' ');
const failures = [];
let nodes = 0, fragments = 0;

const prose = (id, where, text) => {
  if (/<span class="math"[^>]*>(?:(?!<\/span>)[\s\S])*<br/i.test(text)) failures.push(`${id} ${where}: <br> inside an inline math span; use a display math node`);
  for (const match of strip(text).matchAll(mathSequence)) {
    if (!looksMathematical(match[0])) continue;
    fragments += 1;
    try { render(probabilityLatex(match[0]), false); } catch (error) { failures.push(`${id} ${where}: "${match[0].trim()}" ${error.message}`); }
  }
};
const node = (id, where, value) => {
  if (value.type !== 'math' || !['inline', 'display'].includes(value.mode) || !value.tex) { failures.push(`${id} ${where}: malformed math node`); return; }
  nodes += 1;
  try { render(value.tex, value.mode === 'display'); } catch (error) { failures.push(`${id} ${where}: ${error.message}`); }
};

const manifest = JSON.parse(readFileSync('src/content/ap-statistics/course.json', 'utf8'));
for (const { id: unit } of manifest.units) {
  for (const q of JSON.parse(readFileSync(`src/content/ap-statistics/units/${unit}.json`, 'utf8')).questions) {
    const id = `${unit}:${q.id}`;
    prose(id, 'scenario', q.scenario);
    prose(id, 'prompt', q.prompt);
    q.choices.forEach((choice, i) => { if (typeof choice === 'string') prose(id, `choice ${'ABCD'[i]}`, choice); else if (choice.type === 'math') node(id, `choice ${'ABCD'[i]}`, {type:'math',mode:'display',tex:choice.tex}); else if (choice.type === 'hypotheses') {prose(id,'null hypothesis',choice.null); prose(id,'alternative hypothesis',choice.alternative);} });
    q.solution.steps.forEach((step, i) => (typeof step === 'string' ? prose(id, `step ${i + 1}`, step) : node(id, `step ${i + 1}`, step)));
    prose(id, 'warning', q.solution.warning);
  }
}
if (failures.length) { console.error(`Math check failed:\n- ${failures.join('\n- ')}`); process.exitCode = 1; }
else console.log(`Verified ${nodes} explicit math nodes and ${fragments} detected math fragments with KaTeX.`);
