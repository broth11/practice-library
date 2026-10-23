import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const unit=fs.readFileSync('dist/unit2b.js','utf8');
const questions=vm.runInNewContext(unit.slice(0,unit.indexOf('if(bQuestions.length'))+';bQuestions');
const calculatorData=Object.fromEntries(questions.map((q,i)=>['b'+String(i+1).padStart(2,'0'),q.guide]));
const context=vm.createContext({calculatorData,originalRenderCalculator(){},bBin:(n,p,a,b)=>{let sum=0;for(let k=a;k<=b;k++){let choose=1;for(let i=1;i<=k;i++)choose=choose*(n-i+1)/i;sum+=choose*p**k*(1-p)**(n-k);}return sum;}});
vm.runInContext(fs.readFileSync('dist/distribution-calculator.js','utf8'),context);
let count=0;
for(const [id,guide] of Object.entries(calculatorData)){
 if(!guide.distribution)continue;count++;
 assert.ok(guide.needed,id+' enables hardware layout');
 assert.ok(guide.steps.length>=10);
 assert.equal(guide.steps[0].frame.type,'main');
 assert.equal(guide.steps[1].keys[0],'2');
 assert.ok(guide.steps.some(s=>s.title==='Select Data: Variable'));
 assert.ok(guide.steps.some(s=>s.title==='Select Save Res: None'));
 for(const step of guide.steps)assert.ok(step.keys.length&&step.note);
}
assert.equal(count,14);
for(const [id,value] of [['b14',.201326592],['b15',.55177381],['b31',.2266273524],['b35',95.37861879],['b36',95.3271956]]){
 const actual=calculatorData[id].steps.find(s=>s.frame?.type==='result').frame.value;
 assert.ok(Math.abs(actual-value)<1e-7,id+' accurate result');
}
assert.equal(calculatorData.b34.steps.filter(s=>s.frame?.type==='result').length,2);
assert.ok(Math.abs(Number(calculatorData.b34.steps.at(-1).result)-.1814053859)<1e-8);
assert.equal(calculatorData.b37.steps.filter(s=>s.frame?.type==='result').length,2);
assert.ok(Math.abs(Number(calculatorData.b38.steps.at(-1).result)-48.4077578)<1e-7);
assert.ok(Math.abs(Number(calculatorData.b39.steps.at(-1).result)-7.0227373)<1e-7);
assert.ok(Math.abs(Number(calculatorData.b40.steps.at(-1).result)-53.4457610)<1e-7);
assert.equal(calculatorData.b03.steps.length,3,'Existing arithmetic walkthrough retained');
const html=fs.readFileSync('dist/index.html','utf8');
assert.ok(html.indexOf('src="distribution-calculator.js')<html.indexOf('src="math-typography.js'));
console.log('Verified 14 distribution walkthroughs, menu keys, parameters, numerical results, multi-stage calculations, and retained arithmetic.');
