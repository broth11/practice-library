import fs from 'node:fs';import vm from 'node:vm';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),katex=require('../dist/katex.min.js');
const script=fs.readFileSync('dist/unit2b.js','utf8'),math=fs.readFileSync('dist/math-typography.js','utf8');
const questions=vm.runInNewContext(script.slice(0,script.indexOf('if(bQuestions.length'))+';bQuestions');
const rules=vm.runInNewContext(math.slice(0,math.indexOf("document.querySelectorAll('.card"))+';({probabilityLatex,mathSequence})');
let count=0;
for(const q of questions)for(const text of [q.scenario,q.ask,...q.options,...q.steps,q.trap]){
 rules.mathSequence.lastIndex=0;
 for(const m of text.matchAll(rules.mathSequence))if(/\b(?:P|E|Var|SD|C)\(|[μσΦ√²³⁴⁵⁶⁷⁸⁹≤≥≈=<>/]|\b(?:np|X|Z|G|x|z|n|p|k|c)\b|x̄/.test(m[0])){katex.renderToString(rules.probabilityLatex(m[0]),{throwOnError:true,strict:'error'});count++}
}
console.log('Verified '+count+' LaTeX math fragments across the Unit 2.B questions and worked solutions.');
