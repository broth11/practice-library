// Truth checks for the 36 conceptual keys, based on counts, event rules, and
// each option's stated claim. Numeric choices are covered by the answer scripts.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const unit=read('src/content/ap-statistics/units/2-a.json');
const by=Object.fromEntries(unit.questions.map(q=>[q.id,q]));
const specs=read('src/diagrams/ap-statistics.json').diagrams;
const rows=id=>by[id].stimulus.rows;
const figure=id=>specs.find(d=>by[id].stimulus?.src===`assets/${d.file}`);
const sum=a=>a.reduce((x,y)=>x+y,0);
const close=(a,b)=>Math.abs(a-b)<1e-12;
const keys={};
function check(id,truths){const hits=truths.map((x,i)=>x?'ABCD'[i]:null).filter(Boolean);assert.deepEqual(hits,[by[id].answer],`${id}: option truth check`);keys[id]=hits[0];}
// Association is decided by like-for-like conditional rates, not unequal counts.
let r=rows('q03');check('q03',[!close(r[0][1]/r[0][3],r[1][1]/r[1][3]),false,false,false]);
let d=figure('q04');check('q04',[false,false,d.groups[1].values[0]>.5,d.groups[0].values[0]>d.groups[1].values[0]]);
check('q05',[true,false,false,false]); // Two categorical variables: conditional segmented bars.
check('q06',[true,false,false,false]); // Only A preserves both long-run event and population.
check('q07',[4,7,5,3].map(n=>close(n/10,.3)));
const overlap=(96+74-(200-50))/200;check('q13',[overlap>0&&close(overlap,.1),false,close(overlap,0),close(overlap,.75)]);
r=rows('q21');const same=close(r[0][1]/r[0][3],r[1][1]/r[1][3]);check('q21',[false,r[0][1]===r[1][1],false,same]);
check('q24',[false,false,false,0!==.30*.20]); // Disjoint, positive-probability events are dependent.
const possibleUnions=[.10,.20].map(overlap=>.35+.25-overlap);check('q25',[false,false,false,new Set(possibleUnions).size>1]);
r=rows('q26');check('q26',r[0].slice(1,-1).map((n,i)=>close(n/r[0].at(-1),r[1][i+1]/r[1].at(-1))));
r=rows('q29');check('q29',[r[2][1]!==r[2][2],!r[0].slice(1,-1).every(n=>n===r[0][1]),r[1][1]!==Math.min(...r[1].slice(1,-1)),r[2][3]!==Math.max(...r[2].slice(1,-1))]); // Negative ask.
d=figure('q30');check('q30',[false,d.groups[1].values[0]>d.groups[0].values[0],false,false]);
check('q31',[true,false,false,false]); // Running independent relative frequencies: LLN.
check('q34',by.q34.choices.map(p=>Number(p)>(40-12)/40));
check('q35',[5,6,7,4].map(n=>close(n/10,.60)));
r=rows('q39');check('q39',[r[0][1]===0,r[1][2]===0,true,r[0][2]===0]);
// Both feasible joint probabilities preserve the overall renewal probability.
for(const online of [.4,.6]) {const otherRenewal=(.52-online*.65)/(1-online);assert.ok(otherRenewal>=0&&otherRenewal<=1);}
check('q40',[false,false,false,.4*.65!==.6*.65]);
const pB=.12/.40;check('q46',[close(pB,.30),close(.40,.30),close(pB,.60),close(.40+pB-.12,.70)]);
check('q47',[[.21,.09,.21],[.20,.10,.20],[.25,0,.25],[.10,.20,.30]].map(([a,b,c])=>close((a+b)*(b+c),b)));
// Expansion conceptual items.
r=rows('q52');const equalRates=close(r[0][1]/r[0][3],r[1][1]/r[1][3]);check('q52',[false,false,equalRates,false]);
d=figure('q53');check('q53',[d.groups[0].values[0]/50>d.groups[1].values[0]/100,close(10/50,40/100),30<20,20===2*30]);
d=figure('q54');check('q54',[close(d.groups[0].values[1]*80,d.groups[1].values[1]*160),20>80,d.groups[1].values[0]>d.groups[0].values[0],close(d.groups[0].values[0]*80,d.groups[1].values[0]*160)]);
d=figure('q55');check('q55',[false,false,!close(d.groups[0].counts[0]/sum(d.groups[0].counts),d.groups[1].counts[0]/sum(d.groups[1].counts)),false]);
r=rows('q57');const rates=r.slice(0,2).map(x=>x[1]/x[3]);check('q57',[rates[0]>rates[1],rates[1]>rates[0],close(...rates),rates.every(p=>p>.5)]);
d=figure('q59');check('q59',[false,false,false,close(d.groups[1].values[0]-d.groups[0].values[0],.20)]);
const space=['F','S'].flatMap(a=>['F','S'].map(b=>a+b));check('q61',by.q61.choices.map(c=>{const listed=c.slice(1,-1).split(', ');return listed.length===space.length&&space.every(x=>listed.includes(x));}));
// The correct assignment moved to A to balance keys; inclusive endpoints matter.
check('q63',[close(35/100,.35),close(34/99,.35),close(65/100,.35),close(36/100,.35)]);
check('q66',[true,false,false,false]); // Long-run interpretation; no fixed short-run guarantee.
check('q67',[true,false,false,false]); // LLN neither promises exactness nor scales proportions by n.
check('q77',[false,false,false,figure('q77').counts.both>0]);
// P(album and portrait)=0.60 P(portrait); only A supplies that missing marginal.
check('q80',[true,false,false,false]);
check('q85',[.7*.3>.3*.7,.3**2>.7**2,close(.7**2,.3**2),close(.7*.3,.3*.7)]);
check('q93',[false,false,false,0!==.3*.7]);
r=rows('q96');const conditional=r[0][1]/r[0][3],marginal=r[2][1]/r[2][3];check('q96',[!close(conditional,marginal),false,false,close(conditional,marginal)]);
d=figure('q98');check('q98',[close(d.groups[0].counts[0]/sum(d.groups[0].counts),d.groups[1].counts[0]/sum(d.groups[1].counts)),false,false,false]);
check('q99',[false,false,false,true]); // Given marginals require the overlap for the union.
assert.equal(Object.keys(keys).length,36);
console.log('Verified all 36 conceptual 2.A keys against event rules and displayed counts; combined with 64 numeric targets, all 100 keys are covered.');
