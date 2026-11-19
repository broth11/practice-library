// Independent JavaScript computations; authored numerical values used Python/SciPy.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {choiceText} from '../src/app/choices.js';
import {Phi,invPhi} from './lib/stats.mjs';
const load=p=>JSON.parse(readFileSync(p,'utf8'));
const review=load('scripts/expansion-review.json');
const us=['3-a','3-b','4-a','4-b','5'].map(id=>load(`src/content/ap-statistics/units/${id}.json`));
function logGammaHalf(x){let s=0;while(x>1){x-=1;s+=Math.log(x);}return s+(x===.5?Math.log(Math.PI)/2:0);}
function tSF(x,df){
 const c=Math.exp(logGammaHalf((df+1)/2)-logGammaHalf(df/2))/Math.sqrt(df*Math.PI);
 const den=z=>c*(1+z*z/df)**(-(df+1)/2);const n=10000,h=Math.abs(x)/n;
 let area=den(0)+den(Math.abs(x));for(let i=1;i<n;i++)area+=(i%2?4:2)*den(i*h);
 return .5-(x<0?-1:1)*h*area/3;
}
const ops={identity:([x])=>x,meanSE:([s,n])=>s/Math.sqrt(n),normalSF:([z])=>1-Phi(z),multiply:([x,y])=>x*y,subtract:([x,y])=>x-y,add:([x,y])=>x+y,divide:([x,y])=>x/y,endpoint:([m,sign,c,se])=>m+sign*c*se,midpoint:([a,b])=>(a+b)/2,halfwidth:([a,b])=>(b-a)/2,twoSE:([a,n,b,m])=>Math.hypot(a/Math.sqrt(n),b/Math.sqrt(m)),twoVariance:([a,n,b,m])=>a*a/n+b*b/m,tstat:([est,mu,se])=>(est-mu)/se,tSF:([x,df,k])=>k*tSF(x,df),inverseRoot:([n])=>1/Math.sqrt(n),prediction:([a,b,x])=>a+b*x,inversePrediction:([y,a,b])=>(y-a)/b,residual:([y,a,b,x])=>y-(a+b*x),square:([r])=>r*r,propSE:([p,n])=>Math.sqrt(p*(1-p)/n),propMargin:([p,n,z])=>z*Math.sqrt(p*(1-p)/n),propN:([z,p,e])=>Math.ceil(z*z*p*(1-p)/(e*e)),normalQuantile:([p])=>invPhi(p),propZ:([ph,p,n])=>(ph-p)/Math.sqrt(p*(1-p)/n),twoPropSE:([p,n,q,m])=>Math.sqrt(p*(1-p)/n+q*(1-q)/m),pooled:([a,n,b,m])=>(a+b)/(n+m),twoPropZ:([a,n,b,m])=>{const p=(a+b)/(n+m);return(a/n-b/m)/Math.sqrt(p*(1-p)*(1/n+1/m));},chiDF:([r,c])=>(r-1)*(c-1),expected:([r,c,n])=>r*c/n,chiContribution:([o,e])=>(o-e)**2/e};
let numeric=0,concept=0;
for(const u of us){
 for(const l of u.lessons)assert.equal(u.questions.filter(q=>q.lesson===l.id).length,20,l.id);
 const counts='ABCD'.split('').map(k=>u.questions.filter(q=>q.answer===k).length);assert(Math.max(...counts)-Math.min(...counts)<=1,u.id+' key balance');
 for(const q of u.questions.filter(q=>q.id.startsWith('x'))){
  const key=u.id+':'+q.id,r=review[key];assert(r,key);assert.deepEqual(q.calculator,{needed:false,status:'deferred',reason:"Deferred at Ben's request; Claude will add calculator guidance in a separate pass."});
  assert.equal(choiceText(q.choices['ABCD'.indexOf(q.answer)]),r.correctText,key+' reviewed choice');
  assert.equal(new Set(q.choices.map(choiceText)).size,4,key+' distinct alternatives');assert.equal(Object.keys(r.optionReasons).length,4);
  if(r.calculation){const {op,values}=r.calculation;assert(ops[op],op);const target=ops[op](values);const hits=q.choices.map((c,i)=>Math.abs(Number(c)-target)<=.000050001?'ABCD'[i]:null).filter(Boolean);assert.deepEqual(hits,[q.answer],key+' computed target '+target);numeric++;}
  else concept++;
 }
 if(u.id.startsWith('3-')){
  const expected=load('scripts/unit-three-original-hashes.json')[u.id];
  const actual=createHash('sha256').update(JSON.stringify(u.questions.filter(q=>!q.id.startsWith('x')))).digest('hex');
  assert.equal(actual,expected,u.id+' original questions preserved');
 }
}
assert.equal(Object.keys(review).length,430);assert.equal(us.reduce((s,u)=>s+u.questions.filter(q=>q.id.startsWith('x')).length,0),430);
assert(Math.abs(tSF(0,15)-.5)<1e-10);assert(Math.abs(tSF(2.1314495456,15)-.025)<1e-8);
console.log(`Expansion: ${numeric} numerical keys independently recomputed; ${concept} conceptual items have author rationale records; 430 calculator deferrals; 28 lessons at twenty questions; original Unit 3 questions preserved.`);
