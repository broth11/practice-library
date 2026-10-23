/* Render actual LaTeX with the same KaTeX version and embedded fonts as Unit 2.A. */
function probabilityLatex(source){
 let s=source.trim().replace(/X\s*~\s*Binomial/g,'X \\sim \\operatorname{Binomial}');
 s=s.replace(/C\((\d+),\s*(\d+)\)/g,'\\binom{$1}{$2}');
 s=s.replace(/√\[([^\]]+)\]/g,'\\sqrt{$1}').replace(/√(\d+(?:\.\d+)?)/g,'\\sqrt{$1}');
 s=s.replace(/\(([^()]*)\)\s*\/\s*([σμ](?:²)?|\d+(?:\.\d+)?)/g,'\\frac{$1}{$2}');
 s=s.replace(/\b(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/g,'\\frac{$1}{$2}');
 s=s.replace(/\b(Var|SD)\(/g,'\\operatorname{$1}(');
 s=s.replace(/\b(prize|reject|event)\b/g,'\\text{$1}');
 const symbols={'μ':'\\mu ','σ':'\\sigma ','Φ':'\\Phi ','≤':'\\leq ','≥':'\\geq ','≈':'\\approx ','−':'-','×':'\\times ','²':'^{2}','³':'^{3}','⁴':'^{4}','⁵':'^{5}','⁶':'^{6}','⁷':'^{7}','⁸':'^{8}','⁹':'^{9}','%':'\\%'};
 s=s.replace(/x̄/g,'\\bar{x}').replace(/[μσΦ≤≥≈−×²³⁴⁵⁶⁷⁸⁹%]/g,c=>symbols[c]);
 s=s.replace(/\bn\s*p\b/g,'np');
 return s;
}
const mathAtom='(?:X\\s*~\\s*Binomial\\([^)]*\\)|(?:P|E|Var|SD|Φ)\\([^)]*\\)|C\\(\\d+,\\s*\\d+\\)|x̄|[μσ]|\\b(?:np|X|Z|G|x|z|n|p|k|c)\\b|\\d+(?:\\.\\d+)?|[=<>≤≥≈+−×*/√²³⁴⁵⁶⁷⁸⁹%()\\[\\]−-])';
const mathSequence=new RegExp(mathAtom+'(?:\\s*'+mathAtom+')*','g');
function typesetProbability(root){
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];let node;
 while(node=walker.nextNode()){if(!node.parentElement.closest('.katex,script,style,.letter,.question-badge,.within,.eyebrow'))nodes.push(node)}
 for(const node of nodes){
  const text=node.textContent;mathSequence.lastIndex=0;const matches=[...text.matchAll(mathSequence)].filter(m=>/\b(?:P|E|Var|SD|C)\(|[μσΦ√²³⁴⁵⁶⁷⁸⁹≤≥≈=<>/]|\b(?:np|X|Z|G|x|z|n|p|k|c)\b|x̄/.test(m[0]));
  if(!matches.length)continue;
  const frag=document.createDocumentFragment();let end=0;
  for(const m of matches){const raw=m[0],leading=raw.match(/^\s*/)[0],trailing=raw.match(/\s*$/)[0];frag.append(document.createTextNode(text.slice(end,m.index)+leading));const span=document.createElement('span');span.className='math-inline';span.dataset.latex=probabilityLatex(raw);span.innerHTML=katex.renderToString(span.dataset.latex,{throwOnError:true,strict:'error',output:'htmlAndMathml',displayMode:false});frag.append(span,document.createTextNode(trailing));end=m.index+raw.length;}
  frag.append(document.createTextNode(text.slice(end)));node.replaceWith(frag);
 }
}
document.querySelectorAll('.card[id^="b"] .option').forEach(option=>option.querySelector('input').setAttribute('aria-label',option.querySelector('.letter').textContent+': '+option.querySelector('.option-text').textContent));
document.querySelectorAll('.card[id^="b"] .question-inner,.solution-panel[id^="b"] .solution-inner').forEach(typesetProbability);
const unformattedCalculator=renderCalculator;
renderCalculator=function(){unformattedCalculator();if(current>=50)typesetProbability(calcView)};
/* Prefer four readable rows whenever they fit at the normal reading size.
   Dense questions may use two columns to retain a readable font, never four. */
fitAnswers=function(card,inner,room){
 const options=[...card.querySelectorAll('.option-text')],field=card.querySelector('fieldset');
 const formulaOptions=options.some(el=>/P\(|\\frac|\\sigma|\\mu|\\leq|\\geq/.test([...el.querySelectorAll('[data-latex],annotation')].map(x=>x.dataset.latex||x.textContent).join(' ')));
 const layouts=formulaOptions||field.clientWidth<340?[1]:[1,2];
 let chosen=null;
 for(let font=innerHeight<760?15:16;font>=13;font-=.25){
  card.style.setProperty('--q-font',font+'px');
  for(const columns of layouts){card.style.setProperty('--answer-columns',columns);const overflow=options.some(el=>el.scrollWidth>el.clientWidth+1);if(!overflow){chosen={font,columns};if(inner.scrollHeight<=room){card.dataset.answerColumns=columns;return}}}
 }
 chosen=chosen||{font:13,columns:1};card.style.setProperty('--q-font',chosen.font+'px');card.style.setProperty('--answer-columns',chosen.columns);card.dataset.answerColumns=chosen.columns;
};
fit();
