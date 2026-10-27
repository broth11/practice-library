// Independent JS probability calculations; authoring arithmetic used Python.
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {Phi,invPhi,binom} from './lib/stats.mjs';
const load=p=>JSON.parse(readFileSync(p,'utf8'));
const review=load('scripts/unit-three-review.json');
const units=['3-a','3-b'].map(id=>load(`src/content/ap-statistics/units/${id}.json`));
const tuple=s=>[...s.replaceAll('−','-').replace(/(\d),(?=\d{3}(?:\D|$))/g,'$1').matchAll(/-?\d+(?:\.\d+)?/g)].map(x=>+x[0]);
// Numerical integration is independent of the closed-form Python authoring values.
function chiSF(x,df){
 assert([2,4].includes(df));
 const density=t=>df===2?.5*Math.exp(-t/2):t*Math.exp(-t/2)/4;
 const n=12000,h=(100-x)/n;let total=density(x)+density(100);
 for(let i=1;i<n;i++)total+=(i%2?4:2)*density(x+i*h);
 return total*h/3;
}
let numeric=0,conceptual=0;
for(const u of units){
 assert.equal(u.questions.length,u.id==='3-a'?80:50);
 assert.equal(u.lessons.length,u.id==='3-a'?8:5);
 for(const l of u.lessons)assert.equal(u.questions.filter(q=>q.lesson===l.id).length,10,l.id);
 for(const q of u.questions){
  const id=u.id+':'+q.id,r=review[id];assert(r,id);
  assert.deepEqual(q.calculator,{needed:false,status:'deferred',reason:"Deferred at Ben's request; Claude will add calculator guidance in a separate pass."},id);
  assert.equal(q.choices['ABCD'.indexOf(q.answer)],r.correctText,id+' reviewed key');
  assert.equal(Object.keys(r.optionReasons).length,4);q.choices.forEach(c=>assert(r.optionReasons[c],id+' alternative review'));
  if(r.kind==='concept'){conceptual++;continue;}
  const t=Function('Phi','invPhi','binom','chiSF',`return (${r.target});`)(Phi,invPhi,binom,chiSF);
  if(r.kind==='numeric'){
   const hits=q.choices.map((s,i)=>Math.abs(+s.replaceAll('−','-')-t)<=.50001*10**(-(s.split('.')[1]||'').length)?'ABCD'[i]:null).filter(Boolean);
   assert.deepEqual(hits,[q.answer],id+' scalar '+t);
  }else if(r.kind==='interval'){
   const hits=q.choices.map((s,i)=>{const ns=tuple(s),ps=[...s.matchAll(/\d+\.(\d+)/g)].map(x=>x[1].length);return ns.length===2&&ns.every((x,j)=>Math.abs(x-t[j])<=.5001*10**-(ps[j]??0)+1e-9)?'ABCD'[i]:null;}).filter(Boolean);
   assert.deepEqual(hits,[q.answer],id+' interval '+t);
  }else if(r.kind==='decision')assert(t<r.alpha,id+' rejection threshold');
  else if(r.kind==='comparison')assert.equal(t,r.expected,id+' exact binomial ordering');
  else if(r.kind==='pair')assert(t.every((x,i)=>Math.abs(x-r.expected[i])<1e-10));
  else assert.fail(id+' unknown kind');
  numeric++;
 }
}
const z=[[400,.55],[900,.52],[100,.58],[100,.45]].map(([n,p])=>Math.abs((p-.5)/Math.sqrt(.25/n)));
assert.equal(z.indexOf(Math.max(...z)),0);
assert.deepEqual([80*.51,80*.49,120*.51,120*.49].map(x=>+x.toFixed(1)),[40.8,39.2,61.2,58.8]);
assert(Math.sqrt(.25/100)>Math.sqrt(.16/100));assert((2.576/1.96)*Math.sqrt(400/1600)<1);
const figs=load('src/diagrams/ap-statistics.json').diagrams.filter(d=>d.file.startsWith('u3'));
assert.equal(figs.length,6);for(const d of figs){assert.equal(d.questions.length,1);assert(!d.area);}
assert.equal(Object.keys(review).length,130);
console.log(`Unit 3: ${numeric} numerical/decision targets independently recomputed; ${conceptual} conceptual keys and all 520 alternatives reviewed; 13 lessons × 10; six figures; 130 exact deferrals.`);
// The new notation must remain semantic KaTeX input, never escaped line breaks.
const { probabilityLatex, mathSequence } = await import('../src/app/math.js');
assert.equal(probabilityLatex('p-hat-A'),String.raw`\hat{p}_{\mathrm{A}}`);
assert.equal(probabilityLatex('H0: pA = pB'),String.raw`H_0: p_{\mathrm{A}} = p_{\mathrm{B}}`);
assert.equal([...('p-hat-A'.matchAll(mathSequence))][0][0],'p-hat-A');
for(const u of units)for(const q of u.questions)for(const step of q.solution.steps){
 if(typeof step!=='string')assert(!/\\\\[A-Za-z]/.test(step.tex),q.id+' escaped TeX command');
}
const keys=units.map(u=>Object.fromEntries('ABCD'.split('').map(k=>[k,u.questions.filter(q=>q.answer===k).length])));
for(const counts of keys)assert(Math.max(...Object.values(counts))-Math.min(...Object.values(counts))<=1,'balanced unit keys');

assert(Math.abs(chiSF(9.2,4)-.05629028)<1e-7);
assert(Math.abs(chiSF(10.5,2)-.00524752)<1e-7);
