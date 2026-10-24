export function probabilityLatex(source) {
  let value = source.trim().replace(/X\s*~\s*Binomial/g, 'X \\sim \\operatorname{Binomial}');
  value = value.replace(/C\((\d+),\s*(\d+)\)/g, '\\binom{$1}{$2}');
  value = value.replace(/√\[([^\]]+)\]/g, '\\sqrt{$1}').replace(/√(\d+(?:\.\d+)?)/g, '\\sqrt{$1}').replace(/√/g, '\\surd ');
  value = value.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, run => `^{${[...run].map(character => '⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(character)).join('')}}`);
  value = value.replace(/\(([^()]*)\)\s*\/\s*([σμ](?:²)?|\d+(?:\.\d+)?)/g, '\\dfrac{$1}{$2}');
  value = value.replace(/\b(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/g, '\\dfrac{$1}{$2}');
  value = value.replace(/\b(Var|SD)\(/g, '\\operatorname{$1}(').replace(/x̄/g, '\\bar{x}');
  const symbols = { μ: '\\mu ', σ: '\\sigma ', Φ: '\\Phi ', '≤': '\\leq ', '≥': '\\geq ', '≈': '\\approx ', '−': '-', '×': '\\times ', '²': '^{2}', '³': '^{3}', '⁴': '^{4}', '⁵': '^{5}', '⁶': '^{6}', '⁷': '^{7}', '⁸': '^{8}', '⁹': '^{9}', '%': '\\%' };
  value = value.replace(/[μσΦ≤≥≈−×²³⁴⁵⁶⁷⁸⁹%]/g, character => symbols[character]);
  return value.replace(/\bn\s*p\b/g, 'np');
}

const atom = '(?:X\\s*~\\s*Binomial\\([^)]*\\)|(?:P|E|Var|SD|Φ)\\([^)]*\\)|C\\(\\d+,\\s*\\d+\\)|x̄|[μσ]|\\b(?:np|X|Z|G|x|z|n|p|k|c)\\b|\\d+(?:\\.\\d+)?|[=<>≤≥≈+−×*/√²³⁴⁵⁶⁷⁸⁹%()\\[\\]−-])';
const sequence = new RegExp(`${atom}(?:\\s*${atom})*`, 'g');

export function typesetMath(root) {
  if (!root || !window.katex) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let node;
  while ((node = walker.nextNode())) {
    if (!node.parentElement.closest('.katex,script,style,.letter,.question-badge,.within,.eyebrow,.lcd-glass,.mini-keypad,.kc')) nodes.push(node);
  }
  for (const textNode of nodes) {
    const text = textNode.textContent;
    sequence.lastIndex = 0;
    const matches = [...text.matchAll(sequence)].filter(match => /\b(?:P|E|Var|SD|C)\(|[μσΦ√²³⁴⁵⁶⁷⁸⁹≤≥≈=<>/]|\b(?:np|X|Z|G|x|z|n|p|k|c)\b|x̄/.test(match[0]));
    if (!matches.length) continue;
    const fragment = document.createDocumentFragment();
    let end = 0;
    for (const match of matches) {
      const raw = match[0];
      const leading = raw.match(/^\s*/)[0];
      const trailing = raw.match(/\s*$/)[0];
      fragment.append(document.createTextNode(text.slice(end, match.index) + leading));
      const span = document.createElement('span');
      span.className = 'math-inline';
      span.dataset.latex = probabilityLatex(raw);
      try {
        span.innerHTML = window.katex.renderToString(span.dataset.latex, { throwOnError: true, strict: 'error', output: 'htmlAndMathml', displayMode: false });
      } catch {
        span.textContent = raw.trim();
      }
      fragment.append(span, document.createTextNode(trailing));
      end = match.index + raw.length;
    }
    fragment.append(document.createTextNode(text.slice(end)));
    textNode.replaceWith(fragment);
  }
}
