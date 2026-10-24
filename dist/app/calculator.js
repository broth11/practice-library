const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const keyInfo = { F1: ['F1', 'fn'], F2: ['F2', 'fn'], F3: ['F3', 'fn'], F4: ['F4', 'fn'], F5: ['F5', 'fn'], F6: ['F6', 'fn'], SHIFT: ['SHIFT', 'shift'], OPTN: ['OPTN', ''], VARS: ['VARS', ''], MENU: ['MENU', ''], ALPHA: ['ALPHA', 'alpha'], SQR: ['x²', ''], POW: ['^', ''], EXIT: ['EXIT', ''], XTT: ['X,θ,T', ''], LOG: ['log', ''], LN: ['ln', ''], SIN: ['sin', ''], COS: ['cos', ''], TAN: ['tan', ''], FRAC: ['▫⁄▫', ''], SD: ['S⇔D', ''], LP: ['(', ''], RP: [')', ''], COMMA: [',', ''], STO: ['→', ''], DEL: ['DEL', 'blue'], AC: ['AC/ON', 'blue'], MUL: ['×', 'num'], DIV: ['÷', 'num'], ADD: ['+', 'num'], SUB: ['−', 'num'], DOT: ['.', 'num'], EXP: ['×10ˣ', 'num'], NEG: ['(−)', 'num'], EXE: ['EXE', 'exe'], UP: ['▲', ''], LEFT: ['◀', ''], RIGHT: ['▶', ''], DOWN: ['▼', ''] };
for (let number = 0; number < 10; number += 1) keyInfo[number] = [String(number), 'num'];
const secondary = { F1: ['Trace', ''], F2: ['Zoom', ''], F3: ['V-Window', ''], F4: ['Sketch', ''], F5: ['G-Solv', ''], F6: ['G↔T', ''], MENU: ['SET UP', ''], VARS: ['PRGM', ''], ALPHA: ['A-LOCK', ''], SQR: ['√', 'r'], POW: ['ˣ√', 'θ'], EXIT: ['QUIT', ''], XTT: ['∠', 'A'], LOG: ['10ˣ', 'B'], LN: ['eˣ', 'C'], SIN: ['sin⁻¹', 'D'], COS: ['cos⁻¹', 'E'], TAN: ['tan⁻¹', 'F'], FRAC: ['a b/c', 'G'], SD: ['a b/c↔d/c', 'H'], LP: ['∛', 'I'], RP: ['x⁻¹', 'J'], COMMA: ['', 'K'], STO: ['', 'L'], 7: ['CAPTURE', 'M'], 8: ['CLIP', 'N'], 9: ['PASTE', 'O'], DEL: ['INS UNDO', ''], AC: ['OFF', ''], 4: ['CATALOG', 'P'], 5: ['FORMAT', 'Q'], 6: ['', 'R'], MUL: ['{', 'S'], DIV: ['}', 'T'], 1: ['List', 'U'], 2: ['Mat', 'V'], 3: ['', 'W'], ADD: ['[', 'X'], SUB: [']', 'Y'], 0: ['i', 'Z'], DOT: ['= SPACE', ''], EXP: ['π', ''], NEG: ['Ans', ''] };
const icons = [['RUN', 'Run-Matrix'], ['STAT', 'Statistics'], ['EACT', 'eActivity'], ['SSHT', 'Spreadsheet'], ['GRAPH', 'Graph'], ['DYNA', 'Dyna Graph'], ['TABLE', 'Table'], ['RECUR', 'Recursion'], ['CONIC', 'Conic Graphs'], ['EQUA', 'Equation'], ['PRGM', 'Program'], ['FIN', 'Financial']];

const chip = key => { const info = keyInfo[key] || [String(key), '']; return `<span class="kc ${info[1]}">${escapeHtml(info[0])}</span>`; };
function keyboard(active = []) {
  const key = id => { const info = keyInfo[id] || [String(id), '']; const labels = secondary[id] || ['', '']; const order = active.flatMap((entry, index) => String(entry) === String(id) ? [index + 1] : []); return `<span class="mini-key ${info[1]}${active.map(String).includes(String(id)) ? ' lit' : ''}" aria-hidden="true"><span class="key-secondary"><span>${escapeHtml(labels[0])}</span><i>${escapeHtml(labels[1])}</i></span><span class="key-face">${escapeHtml(info[0])}</span>${order.length ? `<span class="key-badge">${order.length > 3 ? `${order[0]}…×${order.length}` : order.join(',')}</span>` : ''}</span>`; };
  const row = (ids, className = 'six') => `<div class="key-row ${className}">${ids.map(key).join('')}</div>`;
  return row(['F1', 'F2', 'F3', 'F4', 'F5', 'F6']) + `<div class="key-row top-keys">${['SHIFT', 'OPTN', 'VARS', 'MENU'].map(key).join('')}<div class="mini-dpad">${['UP', 'LEFT', 'RIGHT', 'DOWN'].map(key).join('')}</div>${['ALPHA', 'SQR', 'POW', 'EXIT'].map(key).join('')}</div>` + row(['XTT', 'LOG', 'LN', 'SIN', 'COS', 'TAN']) + row(['FRAC', 'SD', 'LP', 'RP', 'COMMA', 'STO']) + row(['7', '8', '9', 'DEL', 'AC'], 'five') + row(['4', '5', '6', 'MUL', 'DIV'], 'five') + row(['1', '2', '3', 'ADD', 'SUB'], 'five') + row(['0', 'DOT', 'EXP', 'NEG', 'EXE'], 'five');
}

function phi(z) { if (z <= -10) return 0; if (z >= 10) return 1; const n = 1000; const h = Math.abs(z) / n; const f = x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI); let sum = f(0) + f(Math.abs(z)); for (let index = 1; index < n; index += 1) sum += (index % 2 ? 4 : 2) * f(index * h); return .5 + Math.sign(z) * sum * h / 3; }
function inverseNormal(probability) { let low = -9; let high = 9; for (let index = 0; index < 60; index += 1) { const middle = (low + high) / 2; if (phi(middle) < probability) low = middle; else high = middle; } return (low + high) / 2; }
function choose(n, k) { let value = 1; for (let index = 1; index <= k; index += 1) value = value * (n - index + 1) / index; return value; }
function binomial(n, p, low, high) { let value = 0; for (let k = low; k <= high; k += 1) value += choose(n, k) * p ** k * (1 - p) ** (n - k); return value; }
const numberText = value => Number(value).toFixed(8).replace(/0+$/, '').replace(/\.$/, '');
function keysFor(value) { const text = String(value); if (text.includes('10⁹⁹')) return [...(text.startsWith('−') ? ['NEG'] : []), '1', 'EXP', '9', '9', 'EXE']; return [...text.split('').map((character, index) => ({ '-': index === 0 ? 'NEG' : 'SUB', '−': 'NEG', '.': 'DOT', '+': 'ADD', '*': 'MUL', '/': 'DIV', '(': 'LP', ')': 'RP' })[character] || character), 'EXE']; }
function distributionResult(name, fields) { const values = Object.fromEntries(fields); const bound = value => String(value).includes('10⁹⁹') ? (String(value).startsWith('−') ? -Infinity : Infinity) : Number(value); if (name === 'Inverse Normal') return Number(values['μ']) + Number(values['σ']) * inverseNormal(Number(values.Area)); if (name === 'Normal CD') return phi((bound(values.Upper) - values['μ']) / values['σ']) - phi((bound(values.Lower) - values['μ']) / values['σ']); return binomial(Number(values.Numtrial), Number(values.p), Number(values.x ?? values.Lower), Number(values.x ?? values.Upper)); }
function distributionSequence(name, fields, repeat = false) {
  const isBinomial = name.startsWith('Binomial'); const inverse = name === 'Inverse Normal'; const code = isBinomial ? (name === 'Binomial PD' ? 'Bpd' : 'Bcd') : (inverse ? 'InvN' : 'Ncd'); const title = isBinomial ? (name === 'Binomial PD' ? 'Binomial P.D' : 'Binomial C.D') : (inverse ? 'Inverse Normal' : 'Normal C.D'); const rows = [['Data', 'Variable'], ...fields, ['Save Res', 'None'], ['Execute', '']]; const frame = selected => ({ type: 'form', title, rows, selected }); const step = (label, keys, screen, note) => ({ title: label, keys, mode: 'distribution', input: label, result: '', note, frame: screen });
  const steps = repeat ? [step('Return to the template', ['EXIT'], frame(0), 'EXIT returns to the distribution template. Enter the next set of values.')] : [step('Open the main menu', ['MENU'], { type: 'main' }, 'Choose Statistics, item 2.'), step('Open Statistics', ['2'], { type: 'stat' }, 'Press 2 for Statistics. Open DIST with F5.'), step('Open DIST', ['F5'], { type: 'dist' }, 'The Distribution menu has NORM on F1 and BINOMIAL on F5.'), step(`Choose ${isBinomial ? 'BINOMIAL' : 'NORM'}`, [isBinomial ? 'F5' : 'F1'], { type: isBinomial ? 'binomial' : 'normal' }, `Choose ${code}.`), step(`Open ${code}`, [inverse ? 'F3' : name === 'Binomial PD' ? 'F1' : 'F2'], frame(0), 'On the Data row, choose F2 (Var) for a single set of values.')];
  steps.push(step('Select Data: Variable', ['F2'], frame(0), 'Use the arrow keys to select each named row. Press EXE to confirm an entry.'));
  fields.forEach(([field, value], index) => steps.push(step(`Select ${field}; enter ${value}`, field === 'Tail' ? ['F1'] : keysFor(value), frame(index + 1), field === 'Tail' ? 'Choose Left. Area is measured to the left of the cutoff.' : `Select ${field}, enter ${value}, then press EXE.`)));
  steps.push(step('Select Save Res: None', ['F1'], frame(rows.length - 2), 'Choose None; no list is needed.'));
  const result = distributionResult(name, fields);
  steps.push(step('Select Execute; calculate', ['DOWN', 'EXE'], { type: 'result', title, name, fields, value: result }, `Press EXE. Result: ${numberText(result)}. Keep extra digits until the final answer.`));
  return { steps, result };
}
const arithmetic = (entry, result, note) => [{ title: 'Open the main menu', keys: ['MENU'], mode: 'menu', input: '', result: '', note: 'Choose Run-Matrix.' }, { title: 'Open Run-Matrix', keys: ['1'], mode: 'run', input: '', result: '', note: 'Press 1 for Run-Matrix.' }, { title: 'Calculate using retained digits', keys: ['AC', ...keysFor(entry)], entry, mode: 'result', input: entry, result: numberText(result), note }];

export function prepareGuide(question) {
  const guide = structuredClone(question.calculator || { needed: false, reason: 'Use the reasoning in the explanation; no calculator is needed.' });
  if (!guide.distribution) return guide;
  const descriptor = guide.distribution;
  const fields = descriptor.fields.map(([key, value]) => [key.replace(/^First (calculation|cutoff): /, ''), value]);
  const first = distributionSequence(descriptor.name, fields);
  guide.needed = true; guide.steps = first.steps;
  const results = [first.result];
  const resolveValue = value => value === '$first' ? results[0] : value === '$previous' ? results.at(-1) : Number(value);
  for (const followUp of guide.followUps || []) {
    if (followUp.type === 'distribution') {
      const sequence = distributionSequence(followUp.name, followUp.fields, true);
      guide.steps.push(...sequence.steps);
      results.push(sequence.result);
      continue;
    }
    const values = followUp.values.map(resolveValue);
    const result = ({
      add: () => values.reduce((sum, value) => sum + value, 0),
      multiply: () => values.reduce((product, value) => product * value, 1),
      divide: () => values[0] / values[1],
      subtractProduct: () => values[0] - values[1] * values[2]
    })[followUp.operation]?.();
    if (!Number.isFinite(result)) throw new Error(`Unsupported calculator follow-up for ${question.id}`);
    const entry = followUp.entry.replaceAll('$first', numberText(results[0])).replaceAll('$previous', numberText(results.at(-1)));
    guide.steps.push(...arithmetic(entry, result, followUp.note));
    results.push(result);
  }
  return guide;
}

function distributionScreen(frame) {
  const soft = labels => `<div class="dc-soft">${Array.from({ length: 6 }, (_, index) => `<span>${escapeHtml(labels[index] || '')}</span>`).join('')}</div>`;
  const head = title => `<div class="dc-title">${escapeHtml(title)}</div>`;
  if (frame.type === 'stat') return `${head('Statistics')}<div class="dc-lists"><div>List 1<br>1<br>2<br>3<br>4<br>5</div><div>List 2</div><div>List 3</div></div>${soft(['', '', '', '', 'DIST', ''])}`;
  if (['dist', 'normal', 'binomial'].includes(frame.type)) return `${head('Statistics · Distribution')}<div class="dc-menu-name">${escapeHtml({ dist: 'Choose distribution', normal: 'Normal', binomial: 'Binomial' }[frame.type])}</div>${soft(frame.type === 'dist' ? ['NORM', '', '', '', 'BINOMIAL', ''] : frame.type === 'normal' ? ['Npd', 'Ncd', 'InvN', '', '', ''] : ['Bpd', 'Bcd', '', '', '', ''])}`;
  if (frame.type === 'form') { const start = Math.max(0, frame.selected - 5); const visible = frame.rows.slice(start, start + 6); const selectedName = frame.rows[frame.selected][0]; return `${head(frame.title)}<div class="dc-fields">${visible.map(([label, value], index) => `<div class="dc-field ${start + index === frame.selected ? 'selected' : ''}"><span>${escapeHtml(label)}</span><span>${escapeHtml(value)}</span></div>`).join('')}</div>${soft(selectedName === 'Data' ? ['List', 'Var', '', '', '', ''] : selectedName === 'Tail' ? ['Left', 'Right', 'Central', '', '', ''] : selectedName === 'Save Res' ? ['None', 'List', '', '', '', ''] : [])}`; }
  if (frame.type === 'result') return `${head(frame.title)}<div class="dc-results"><div>${frame.name === 'Inverse Normal' ? 'xInv' : 'p'} = ${numberText(frame.value)}</div></div>${soft([])}`;
  return '';
}

function screen(step) {
  if (step.frame) {
    if (step.frame.type === 'main') return `<div class="lcd-status menu-status"><span class="lcd-battery"></span>MAIN MENU</div><div class="lcd-menu">${icons.map(([file, label], index) => `<div class="lcd-icon ${index === 1 ? 'selected' : ''}"><img src="assets/casio-icons/${file}.png" alt=""><span>${escapeHtml(label)}</span></div>`).join('')}</div>`;
    return distributionScreen(step.frame);
  }
  if (step.mode === 'menu') return `<div class="lcd-status menu-status"><span class="lcd-battery"></span>MAIN MENU</div><div class="lcd-menu">${icons.map(([file, label], index) => `<div class="lcd-icon ${index === 0 ? 'selected' : ''}"><img src="assets/casio-icons/${file}.png" alt=""><span>${escapeHtml(label)}</span></div>`).join('')}</div>`;
  return `<div class="lcd-status"><span class="lcd-battery"></span><b>Math</b><b>Norm1</b><b>d/c</b><b>Real</b></div><div class="lcd-input">${escapeHtml(step.input || '').replaceAll('*', '×').replaceAll('/', '÷').replaceAll('-', '−')}${step.mode === 'result' ? '' : '<span class="cursor">▏</span>'}</div><div class="lcd-result">${escapeHtml(step.result || '')}</div>`;
}

export function mountCalculator(root, question, onBack) {
  const guide = prepareGuide(question);
  if (!guide.needed) {
    root.innerHTML = `<div class="no-calculator"><span class="eyebrow">Reasoning first</span><h3>No calculator needed</h3><p>${escapeHtml(guide.reason || 'Use the definition and reasoning in the explanation.')}</p><button type="button" id="back-explanation">Back to explanation</button></div>`;
    root.querySelector('#back-explanation').onclick = onBack;
    return;
  }
  let current = 0;
  const draw = () => {
    const step = guide.steps[current];
    root.innerHTML = `<section class="keypress-pane" aria-label="Calculator keypresses"><header class="keypress-header"><div><span class="eyebrow">fx-CG50 walkthrough</span><h2 id="keypress-title" tabindex="-1">Key presses</h2></div><button id="back-explanation" type="button">← Explanation</button></header><p class="keypress-position">Step ${current + 1} of ${guide.steps.length} · Click a step</p><div class="keypress-list">${guide.steps.map((entry, index) => `<button type="button" class="keypress-row ${index === current ? 'active' : ''}" data-step="${index}" aria-current="${index === current ? 'step' : 'false'}"><span class="step-number">${index + 1}</span><span class="step-label">${entry.entry ? `Press ${chip('AC')}, enter <span class="calc-entry">${escapeHtml(entry.entry.replaceAll('*', '×').replaceAll('/', '÷'))}</span>, then ${chip('EXE')}.` : `${(entry.keys || []).map(chip).join(' ')} ${escapeHtml(entry.title)}`}</span></button>`).join('')}</div><div class="keypress-footer"><p class="keypress-note">${escapeHtml(step.note || '')}</p>${step.decimal_tip ? `<p class="decimal-tip">Fraction shown? Press ${chip('SD')} for a decimal.</p>` : ''}</div></section><section class="calculator-stage" aria-label="Calculator"><div class="mini-calculator"><div class="calc-top"><button id="calc-previous" class="calc-arrow" type="button" ${current === 0 ? 'disabled' : ''}>◀</button><span class="calc-position">Step ${current + 1} of ${guide.steps.length}</span><button id="calc-next" class="calc-arrow" type="button" ${current === guide.steps.length - 1 ? 'disabled' : ''}>▶</button></div><div class="mini-lcd" role="img" aria-label="Guided calculator screen"><div class="lcd-glass">${screen(step)}</div></div><div class="mini-keypad">${keyboard(step.keys || [])}</div></div></section>`;
    root.querySelector('#back-explanation').onclick = onBack;
    root.querySelectorAll('[data-step]').forEach(button => button.onclick = () => { current = Number(button.dataset.step); draw(); });
    root.querySelector('#calc-previous').onclick = () => { current = Math.max(0, current - 1); draw(); };
    root.querySelector('#calc-next').onclick = () => { current = Math.min(guide.steps.length - 1, current + 1); draw(); };
  };
  draw();
}
