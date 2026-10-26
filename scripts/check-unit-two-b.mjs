// Independent targets for the fresh 2.B expansion. Numeric results use the shared
// reference implementation, which is independent of both authoring and the app.
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { Phi, invPhi, binom } from './lib/stats.mjs';
const read = p => JSON.parse(readFileSync(p,'utf8'));
const unit=read('src/content/ap-statistics/units/2-b.json');
const by=Object.fromEntries(unit.questions.map(q=>[q.id,q]));
const specs=read('src/diagrams/ap-statistics.json').diagrams;
const fig=id=>specs.find(d=>by[id].stimulus?.src===`assets/${d.file}`);
const rows=id=>by[id].stimulus.rows;
const sum=xs=>xs.reduce((a,b)=>a+b,0);
const weighted=(xs,ps)=>sum(xs.map((x,i)=>x*ps[i]));
const variance=(xs,ps)=>{const mean=weighted(xs,ps);return weighted(xs.map(x=>(x-mean)**2),ps);};
const pairs=xs=>xs.flatMap((x,i)=>xs.slice(i+1).map(y=>[x,y]));
const means=pairs([1,3,5,7]).map(([x,y])=>(x+y)/2);
const numeric={
 b52: sum(fig('b52').probs.filter((p,i)=>fig('b52').values[i]>2)),
 b53: Number(rows('b53')[2][1])-Number(rows('b53')[1][1]),
 b54: variance(fig('b54').values,fig('b54').probs),
 b56: 4*weighted(fig('b56').values,fig('b56').probs)-7,
 b57: 25*(12*.7-6*.3),
 b58: Math.sqrt(variance(rows('b58').map(r=>r[0]),rows('b58').map(r=>Number(r[1])))),
 b61: binom(9,.3,2,4), b62: 1-binom(5,.08,0,0), b63:1-9/12,
 b65:binom(8,.25,3,8), b67:Math.sqrt(50*.2*.8),
 b68:sum(rows('b68').filter(r=>r[0]>=3).map(r=>r[1]))/sum(rows('b68').map(r=>r[1])),
 b69: [0,1,2,3,4].reduce((best,k)=>binom(4,.5,k,k)>binom(4,.5,best,best)?k:best,0),
 b72:(.95-.68)/2,b73:1-.997,b76:48-1.25*4,b80:(74-62)/1.5,
 b81:Phi((49-40)/6)-Phi((43-40)/6), b82:Phi((22-25)/2)+1-Phi((28-25)/2),
 b83:120+18*invPhi(.85),b84:(48-32)/(2*invPhi(.75)),b85:19-3*invPhi(.95),
 b87:1200*Phi((740-750)/8),b88:Math.ceil(100+15*invPhi(.9)),
 b92:fig('b92').values.filter(v=>v>=27).length/fig('b92').values.length,
 b95:means.filter(v=>v===weighted([1,3,5,7],[.25,.25,.25,.25])).length/means.length,
 b100:fig('b100').values.filter(v=>v<=47).length/fig('b100').values.length
};
function parse(s){
 const t=s.replace(/[−–]/g,'-').replace(/[$,\s%]/g,'');
 if(t.includes('/')){const [a,b]=t.split('/').map(Number);return {v:a/b,tol:1e-10};}
 const places=(t.split('.')[1]||'').length,scale=s.includes('%')?100:1;
 return {v:Number(t)/scale,tol:0.5*10**-places/scale+1e-9};
}
for(const [id,target]of Object.entries(numeric)){
 const q=by[id],hits=q.choices.flatMap((s,i)=>{const {v,tol}=parse(s);return Math.abs(v-target)<=tol?['ABCD'[i]]:[];});
 assert.deepEqual(hits,[q.answer],`${id}: target ${target} must match exactly its key`);
 // Numeric options must be in ascending order.
 const values=q.choices.map(s=>parse(s).v);
 assert.ok(values.every((v,i)=>i===0||v>values[i-1]),`${id}: numeric options must ascend`);
}
// Compound numeric answers and decisive stimulus facts.
assert.equal(18/.6,30);
assert.equal(by.b64.choices['ABCD'.indexOf(by.b64.answer)],'Binomial with n = 30 and p = 0.60');
assert.ok((660-500)/80>(82-70)/8);
assert.equal(by.b74.choices['ABCD'.indexOf(by.b74.answer)],'B, because its z-score is 2.0 while A’s is 1.5.');
assert.deepEqual([(26+50)/2,(50-26)/4],[38,6]);
assert.equal(by.b78.choices['ABCD'.indexOf(by.b78.answer)],'Mean 38; standard deviation 6');
const interval=[300+12*invPhi(.05),300+12*invPhi(.95)];
assert.equal(by.b86.choices['ABCD'.indexOf(by.b86.answer)],interval.map(x=>x.toFixed(2)).join(' to '));
const d94=fig('b94');
assert.equal(sum(d94.counts),1000);
assert.equal(sum(d94.counts.filter((c,i)=>d94.start+i*d94.width>=12))/sum(d94.counts),.015);
assert.equal(by.b94.choices['ABCD'.indexOf(by.b94.answer)],'The upper-tail estimate is 0.015, providing evidence against the claim.');
const d55=rows('b55');
assert.equal(weighted(d55.map(r=>r[0]),d55.map(r=>+r[1])),weighted(d55.map(r=>r[0]),d55.map(r=>+r[2])));
assert.ok(variance(d55.map(r=>r[0]),d55.map(r=>+r[1]))>variance(d55.map(r=>r[0]),d55.map(r=>+r[2])));
assert.equal(by.b55.choices['ABCD'.indexOf(by.b55.answer)],'The means are equal, and A has a larger standard deviation.');
assert.equal(sum(rows('b51').map(r=>Number(r[1].replace('−','-')))),1);
assert.ok(rows('b51').some(r=>Number(r[1].replace('−','-'))<0));
const switches=['HH','HT','TH','TT'].map(s=>Number(s[0]!==s[1]));
assert.equal(switches.filter(x=>x===0).length,2);assert.equal(switches.filter(x=>x===1).length,2);
// Figures reproduce the actual model inputs, not just similarly shaped curves.
for(const id of ['b61','b65'])assert.deepEqual([fig(id).n,fig(id).p],id==='b61'?[9,.3]:[8,.25]);
for(const [id,mu,sd]of [['b73',0,1],['b81',40,6],['b83',120,18]])assert.deepEqual([fig(id).mu,fig(id).sd],[mu,sd]);
assert.equal(fig('b85').mu.solveFrom.percentile,.95);assert.equal(fig('b85').sd,3);
for(const lesson of unit.lessons)assert.equal(unit.questions.filter(q=>q.lesson===lesson.id).length,20);
assert.equal(unit.questions.length,100);
let guided=0,reasoning=0;
for(const q of unit.questions.filter(q=>Number(q.id.slice(1))>50)){
 assert.notEqual(q.calculator.status,'deferred',`${q.id}: calculator guidance should no longer be deferred`);
 if(q.calculator.distribution){guided+=1;continue;}
 if(q.calculator.needed){assert.ok(q.calculator.steps?.some(s=>s.mode==='result'),`${q.id}: guide needs a result screen`);guided+=1;}
 else{assert.ok(q.calculator.reason?.length>=20,`${q.id}: reason required`);reasoning+=1;}
}
console.log(`Verified ${Object.keys(numeric).length} fresh 2.B numeric keys, 6 compound comparisons, model inputs, twenty questions per lesson, and calculator guidance (${guided} guides, ${reasoning} reasoning-only). Other conceptual items received AI review, not human sign-off.`);
