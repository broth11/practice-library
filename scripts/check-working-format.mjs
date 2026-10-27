import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
const dir='src/content/ap-statistics/units';
let pairs=0,expressions=0,displays=0;
for(const file of readdirSync(dir)){
 const u=JSON.parse(readFileSync(`${dir}/${file}`,'utf8'));
 for(const q of u.questions){
  for(const c of q.choices){
   if(typeof c==='string')assert(!/H0:.*;\s*Ha:/.test(c),q.id+' hypothesis pair must be separate rows');
   else if(c.type==='hypotheses'){pairs++;assert(c.null&&c.alternative);}
   else if(c.type==='math'){expressions++;assert(c.ariaLabel&&c.tex.includes('aligned'),q.id+' complete accessible working');}
  }
  for(const s of q.solution.steps){
   if(typeof s==='string')continue;
   displays++;
   // Catch dangling equality rows introduced by a bad line break. A rendered
   // KaTeX block can parse while still being mathematically incomplete.
   for(const row of s.tex.replace(/\\(?:begin|end)\{aligned\}/g,'').split('\\\\')){
    assert(!/(?:=|\\approx|\\le|\\ge)\s*$/.test(row),q.id+' dangling relation in working');
   }
  }
 }
}
assert.equal(pairs,16,'four complete four-choice hypothesis questions');
assert.equal(expressions,36,'nine four-choice working questions');
const css=readFileSync('src/styles/app.css','utf8');
assert(!/\.math-display\{[^}]*overflow-x:auto/.test(css),'math must use authored lines rather than a scroll container');
console.log(`Verified ${pairs} hypothesis pairs, ${expressions} expression choices, and ${displays} complete display workings.`);
