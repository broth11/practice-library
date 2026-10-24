// Structured answers carry data, rather than HTML or layout encoded in prose.
const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

export function validChoice(choice) {
  if (typeof choice === 'string') return choice.trim().length > 0;
  return choice?.type === 'stem-and-leaf' && Array.isArray(choice.rows) && choice.rows.length > 0 &&
    choice.rows.every(row => typeof row.stem === 'string' && /^\d+$/.test(row.stem) &&
      Array.isArray(row.leaves) && row.leaves.every(leaf => typeof leaf === 'string' && /^\d$/.test(leaf)));
}

export function choiceText(choice) {
  if (typeof choice === 'string') return choice.replace(/<[^>]+>/g, ' ');
  return `Stem-and-leaf plot. ${choice.rows.map(row => `Stem ${row.stem}: ${row.leaves.length ? `leaves ${row.leaves.join(', ')}` : 'no leaves'}`).join('. ')}.`;
}

export function renderChoice(choice) {
  if (typeof choice === 'string') return choice;
  if (!validChoice(choice)) throw new Error('Invalid structured answer choice.');
  return `<span class="stem-leaf-plot" aria-hidden="true">${choice.rows.map(row => `<span class="stem-leaf-row"><span class="stem-leaf-stem">${escapeHtml(row.stem)}</span><span class="stem-leaf-leaves">${row.leaves.map(escapeHtml).join(' ') || ' '}</span></span>`).join('')}</span>`;
}
