import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const script=fs.readFileSync('dist/unit2b.js','utf8');
const questions=vm.runInNewContext(script.slice(0,script.indexOf('if(bQuestions.length'))+';bQuestions');
assert.equal(questions.length,50);
for(let lesson=1;lesson<=5;lesson++)assert.equal(questions.filter(q=>q.lesson===lesson).length,10);
const used=new Set();
for(const [i,q] of questions.entries()){
 assert.equal(new Set(q.options).size,4,'Distinct choices for question '+(i+1));
 assert.ok(q.key>=0&&q.key<4);assert.ok(q.steps.length>=2);assert.ok(q.trap);
 for(const m of ((q.visual||'')+(q.solutionVisual||'')).matchAll(/src="([^"]+)"/g)){assert.ok(fs.existsSync('dist/'+m[1]),m[1]);used.add(m[1]);}
}
assert.equal(used.size,26);
for(const [i,key] of [[2,'1.55'],[4,'−1.00'],[5,'1.02'],[13,'0.2013'],[14,'0.5518'],[15,'0.3512'],[16,'0.3823'],[30,'0.2266'],[31,'0.1056'],[32,'0.7865'],[33,'0.1814'],[34,'95.38'],[35,'95.33'],[37,'48.41'],[39,'53'],[47,'0.028']])assert.equal(questions[i].options[questions[i].key],key,'Numerical answer '+(i+1));
const hosting=JSON.parse(fs.readFileSync('.openai/hosting.json','utf8'));assert.equal(hosting.project_id,'appgprj_6adaecda56d481918de99766599388ad');assert.equal(hosting.static.directory,'dist');
console.log('Verified 50 questions, five lessons, unique choices, 26 linked diagrams, and numerical answer checks.');
