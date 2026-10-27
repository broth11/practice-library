import { imageSource } from './image-preload.js?v=3aed6f13bcdb';

const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

export function renderStimulus(stimulus) {
  if (!stimulus) return '';
  const caption = escapeHtml(stimulus.caption || 'Question diagram');
  if (stimulus.type === 'image') return `<figure class="diagram probability-diagram"><img src="${escapeHtml(imageSource(stimulus.src))}" width="${Number(stimulus.width) || 480}" height="${Number(stimulus.height) || 210}" alt="${escapeHtml(stimulus.alt || '')}">${stimulus.caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
  if (stimulus.type === 'html') return stimulus.html;
  if (stimulus.type === 'table') {
    const heads = stimulus.headers.map(value => `<th scope="col">${escapeHtml(value)}</th>`).join('');
    const rows = stimulus.rows.map(row => `<tr class="${row[0] === 'Total' ? 'total' : ''}"><th scope="row">${escapeHtml(row[0])}</th>${row.slice(1).map(value => `<td>${escapeHtml(typeof value === 'number' ? value.toLocaleString('en-US') : value)}</td>`).join('')}</tr>`).join('');
    return `<div class="table-scroll" tabindex="0" role="region" aria-label="${caption}"><table><caption>${caption}</caption><thead><tr>${heads}</tr></thead><tbody>${rows}</tbody></table></div>`;
  }
  return '';
}
