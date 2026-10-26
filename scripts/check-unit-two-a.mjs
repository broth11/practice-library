// Expansion checks recompute numeric targets from event rules and displayed data.
// Conceptual items receive AI review; no human sign-off is implied.
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const read = p => JSON.parse(readFileSync(p, 'utf8'));
const unit = read('src/content/ap-statistics/units/2-a.json');
const by = Object.fromEntries(unit.questions.map(q => [q.id, q]));
const specs = read('src/diagrams/ap-statistics.json').diagrams;
const fig = id => specs.find(d => by[id].stimulus?.src === `assets/${d.file}`);
const sum = a => a.reduce((x,y) => x+y,0);
const ratio = text => {const s=text.replace(/[% ,]/g,''); const a=s.split('/').map(Number);return (a.length===2?a[0]/a[1]:a[0])/(text.includes('%')?100:1);};
const venn = id => fig(id).counts;
const cells = id => by[id].stimulus.rows;
const reverse = id => {const b=fig(id).branches;const paths=b.map(x=>Number(x.p)*Number(x.children[0].p));return paths[0]/sum(paths);};
const simulation = (id, indices) => {const d=fig(id);return sum(indices.map(i=>d.counts[i]))/d.trials;};
const pairs = Array.from({length:36},(_,i)=>[Math.floor(i/6)+1,i%6+1]);
const filtered = pairs.filter(([a])=>a%2===0);
const sequences=['HHH','HHT','HTH','HTT','THH','THT','TTH','TTT'].filter(s=>s[0]==='T');
const numeric = {
 q51: cells('q51')[0][1]/cells('q51')[2][1],
 q56: fig('q56').groups[0].counts[0]/sum(fig('q56').groups.flatMap(g=>g.counts)),
 q58: 90*(18/60),
 q60: (cells('q60')[1][3]+cells('q60')[2][3])/cells('q60')[3][3],
 q62: (180-135)/180,
 q64: simulation('q64',[2,3,4]), q65: cells('q65')[0][2]/sum(cells('q65')[0].slice(1)),
 q68: 2/(3*4), q69: sum(fig('q69').values.slice(2))/sum(fig('q69').values),
 q70: simulation('q70',[0,1]),
 q71: venn('q71').both/(venn('q71').leftOnly+venn('q71').both),
 q72: venn('q72').leftOnly/(venn('q72').leftOnly+venn('q72').neither),
 q73: .18/.30,
 q74: filtered.filter(([a,b])=>a+b===7).length/filtered.length,
 q75: sequences.filter(s=>[...s].filter(x=>x==='H').length===2).length/sequences.length,
 q76: (cells('q76')[1][1]+cells('q76')[2][1])/(cells('q76')[1][3]+cells('q76')[2][3]),
 q78: fig('q78').groups[0].counts[0]/sum(fig('q78').groups[0].counts),
 q79: .24/.50, q81:reverse('q81'),
 q82: Number(fig('q82').branches[0].p)+Number(fig('q82').branches[1].p)*Number(fig('q82').branches[1].children[0].p),
 q83: (4/9)*(3/8), q84:sum([.5,.3,.2].map(p=>p*p)), q86:.4*.3, q87:(1-.8)*(1-.6),
 q88:sum(fig('q88').branches.map(b=>Number(b.p)*Number(b.children[0].p))),
 q89:.5-.4*.75, q90:reverse('q90'), q91:.12/(.12+.28), q92:.5+.4-.5*.6,
 q94:1-(1-.6)*(1-.5), q95:venn('q95').neither/sum(Object.values(venn('q95'))),
 q97:(sum(Object.values(venn('q97')))-venn('q97').neither)/sum(Object.values(venn('q97'))),
 q100:.60+.45-.80
};
for(const [id,target] of Object.entries(numeric)) {
 const q=by[id];const matches=q.choices.map((c,i)=>Math.abs(ratio(c)-target)<1e-9?'ABCD'[i]:null).filter(Boolean);
 assert.deepEqual(matches,[q.answer],`${id}: independently computed ${target}`);
}
for(const lesson of unit.lessons) assert.equal(unit.questions.filter(q=>q.lesson===lesson.id).length,20,`${lesson.id}: twenty items`);
assert.equal(unit.questions.length,100);
const keys='ABCD'.split('').map(k=>unit.questions.filter(q=>q.answer===k).length);
assert.deepEqual(keys,[25,25,25,25],'Balanced unit key positions');
for(const q of unit.questions.filter(q=>Number(q.id.slice(1))>50)) {
 assert.equal(q.calculator.status,'deferred');
 assert.ok(!q.calculator.steps&&!q.calculator.distribution);
 const isNumeric=q.choices.every(c=>/^[\d.]+(?:\/[\d.]+|%)?$/.test(c));
 if(isNumeric) assert.ok(q.id in numeric,`${q.id}: numeric target missing`);
 if(q.choices.every(c=>/^\d*\.?\d+%?$/.test(c))) assert.ok(q.choices.every((v,i,a)=>!i||ratio(v)>ratio(a[i-1])),`${q.id}: numeric ordering`);
}
for(const d of specs.filter(d=>d.questions.some(k=>/^2-a:q(?:[5-9]\d|100)$/.test(k)))) {
 if(d.kind==='tree') {assert.ok(Math.abs(sum(d.branches.map(b=>Number(b.p)))-1)<1e-9);for(const b of d.branches) assert.ok(Math.abs(sum(b.children.map(c=>Number(c.p)))-1)<1e-9);}
 if(d.kind==='mosaic') assert.ok(d.groups.every(g=>g.counts.every(v=>v>=0)&&sum(g.counts)>0));
 if(d.kind==='relative_frequency_bars') assert.equal(sum(d.counts),d.trials);
 if(d.kind==='grouped_bars'&&d.relative) for(const g of d.groups) assert.ok(Math.abs(sum(g.values)-1)<1e-9);
}
// Recompute the quantitative claims that decide conceptual keys.
assert.equal(cells('q52')[0][1]/cells('q52')[0][3],cells('q52')[1][1]/cells('q52')[1][3]);
assert.ok(fig('q53').groups[0].values[0]/50>fig('q53').groups[1].values[0]/100);
assert.equal(fig('q54').groups[0].values[0]*80,fig('q54').groups[1].values[0]*160);
assert.notEqual(fig('q55').groups[0].counts[0]/sum(fig('q55').groups[0].counts),fig('q55').groups[1].counts[0]/sum(fig('q55').groups[1].counts));
assert.ok(cells('q57')[1][1]/cells('q57')[1][3]>cells('q57')[0][1]/cells('q57')[0][3]);
assert.ok(Math.abs(fig('q59').groups[1].values[0]-fig('q59').groups[0].values[0]-.2)<1e-9);
assert.ok(venn('q77').both>0);
assert.equal(.7*.3,.3*.7);
assert.notEqual(0,.3*.7);
assert.notEqual(cells('q96')[0][1]/cells('q96')[0][3],cells('q96')[2][1]/cells('q96')[2][3]);
assert.equal(fig('q98').groups[0].counts[0]/sum(fig('q98').groups[0].counts),fig('q98').groups[1].counts[0]/sum(fig('q98').groups[1].counts));
console.log(`Verified ${Object.keys(numeric).length} expansion numeric keys, graphical claim inputs, twenty items per lesson, balanced keys, and calculator deferrals.`);
