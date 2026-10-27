import { renderMathNode } from './math.js';
// Structured answers carry data, rather than HTML or layout encoded in prose.
const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

export function validChoice(choice) {
  if (typeof choice === 'string') return choice.trim().length > 0;
  if (choice?.type === 'math') return typeof choice.tex === 'string' && !!choice.tex.trim() && typeof choice.ariaLabel === 'string' && !!choice.ariaLabel.trim();
  if (choice?.type === 'hypotheses') return ['null','alternative'].every(k => typeof choice[k] === 'string' && !!choice[k].trim());
  return choice?.type === 'stem-and-leaf' && Array.isArray(choice.rows) && choice.rows.length > 0 &&
    choice.rows.every(row => typeof row.stem === 'string' && /^\d+$/.test(row.stem) &&
      Array.isArray(row.leaves) && row.leaves.every(leaf => typeof leaf === 'string' && /^\d$/.test(leaf)));
}

export function choiceText(choice) {
  if (typeof choice === 'string') return choice.replace(/<[^>]+>/g, ' ');
  if (choice.type === 'math') return choice.ariaLabel;
  if (choice.type === 'hypotheses') return `H0: ${choice.null}; Ha: ${choice.alternative}`;
  return `Stem-and-leaf plot. ${choice.rows.map(row => `Stem ${row.stem}: ${row.leaves.length ? `leaves ${row.leaves.join(', ')}` : 'no leaves'}`).join('. ')}.`;
}

export function renderChoice(choice) {
  if (typeof choice === 'string') return choice;
  if (choice.type === 'math') return renderMathNode({ type:'math', mode:'display', tex:choice.tex });
  if (choice.type === 'hypotheses') {
    const symbolic = /[=<>≠≤≥]/.test(choice.null) && /[=<>≠≤≥]/.test(choice.alternative);
    return `<span class="hypothesis-pair ${symbolic ? 'symbolic' : ''}"><span>H0: ${escapeHtml(choice.null)}</span><span>Ha: ${escapeHtml(choice.alternative)}</span></span>`;
  }
  if (!validChoice(choice)) throw new Error('Invalid structured answer choice.');
  return `<span class="stem-leaf-plot" aria-hidden="true">${choice.rows.map(row => `<span class="stem-leaf-row"><span class="stem-leaf-stem">${escapeHtml(row.stem)}</span><span class="stem-leaf-leaves">${row.leaves.map(escapeHtml).join(' ') || ' '}</span></span>`).join('')}</span>`;
}
