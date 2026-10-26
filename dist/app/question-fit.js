// Prefer readable text, compact choices, and modest diagram reduction in that order.
export function fitQuestion(card, room) {
  const inner = card.querySelector('.question-inner');
  const field = card.querySelector('fieldset');
  const options = [...card.querySelectorAll('.option-text')];
  const diagrams = [...card.querySelectorAll('figure.diagram img')];
  const layouts = field.clientWidth < 340 ? [2, 1] : [4, 2, 1];
  const preferredFont = 16;
  let readableFallback;

  const apply = candidate => {
    card.style.setProperty('--q-font', `${candidate.font}px`);
    card.style.setProperty('--answer-columns', candidate.columns);
    card.dataset.answerColumns = candidate.columns;
    diagrams.forEach((image, index) => {
      image.style.maxHeight = candidate.heights[index] === null ? 'none' : `${candidate.heights[index]}px`;
    });
  };

  for (let font = preferredFont; font >= 13; font -= .25) {
    for (const columns of layouts) {
      const candidate = { font, columns, heights: diagrams.map(() => null) };
      apply(candidate);
      const overflow = options.some(option => option.scrollWidth > option.clientWidth + 1);
      const cramped = columns > 1 && options.some(option => {
        if (option.classList.contains('structured-choice')) return columns === 4;
        const lines = option.getBoundingClientRect().height / parseFloat(getComputedStyle(option).lineHeight);
        return lines > (columns === 4 ? 1.7 : 3.2);
      });
      if (overflow || cramped) continue;

      const naturalHeights = diagrams.map(image => image.getBoundingClientRect().height);
      // At most a quarter smaller; very small diagrams keep their original size.
      const minimumHeights = naturalHeights.map(height => Math.min(height, Math.max(160, height * .75)));
      const availableReduction = naturalHeights.reduce((sum, height, index) => sum + height - minimumHeights[index], 0);
      const neededReduction = Math.max(0, inner.scrollHeight - room + 2);
      if (neededReduction > 0 && availableReduction > 0) {
        const fraction = Math.min(1, neededReduction / availableReduction);
        candidate.heights = naturalHeights.map((height, index) => height - fraction * (height - minimumHeights[index]));
        apply(candidate);
      }
      const excess = Math.max(0, inner.scrollHeight - room);
      if (!readableFallback || font === readableFallback.font && excess < readableFallback.excess) {
        readableFallback = { ...candidate, excess };
      }
      if (excess <= 0) return candidate;
    }
  }

  // If scrolling is unavoidable, retain readable text and the shortest valid grid.
  const chosen = readableFallback || { font: 13, columns: 1, heights: diagrams.map(() => null) };
  apply(chosen);
  return chosen;
}
