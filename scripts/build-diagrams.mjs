import fs from 'node:fs';
import path from 'node:path';
const out=path.resolve('dist/assets');fs.mkdirSync(out,{recursive:true});
const ink='#3b5148',green='#266c5c',pale='#e6ece7',shaded='#95bfa7',line='#9bada1';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;');
function save(name,title,body,height=210){fs.writeFileSync(path.join(out,name+'.svg'),'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 '+height+'" role="img" aria-labelledby="title"><title id="title">'+esc(title)+'</title><style>text{font-family:system-ui,-apple-system,sans-serif;fill:'+ink+';font-size:12px} .small{font-size:10px}</style>'+body+'</svg>')}
const txt=(x,y,s,extra='')=>'<text x="'+x+'" y="'+y+'" text-anchor="middle" '+extra+'>'+esc(s)+'</text>';
const tick=(x,y,s)=>'<path d="M'+x+' '+y+'v5" stroke="'+line+'"/>'+txt(x,y+20,s);
function normal(name,{mu=0,sd=1,lo=-Infinity,hi=Infinity,label='Value',marks=[],area='',outside=false,meanLabel,sdLabel=true}){
 const x=z=>240+z*56,y=z=>147-107*Math.exp(-z*z/2);
 const pts=(a,b)=>Array.from({length:121},(_,i)=>{const z=a+(b-a)*i/120;return[x(z),y(z)]});
 const lines=p=>p.map(v=>v.map(n=>n.toFixed(3)).join(',')).join(' L');
 const fill=(a,b)=>'<path d="M'+x(a)+',147 L'+lines(pts(a,b))+' L'+x(b)+',147 Z" fill="'+shaded+'"/>';
 const a=Math.max(-3.7,(lo-mu)/sd),b=Math.min(3.7,(hi-mu)/sd);
 let s=outside?fill(-3.7,a)+fill(b,3.7):fill(a,b);
 s+='<path d="M'+lines(pts(-3.7,3.7))+'" fill="none" stroke="'+green+'" stroke-width="2.2"/><path d="M24 147H456" stroke="'+line+'"/>';
 s+=tick(x(0),147,meanLabel??('μ = '+mu));
 for(const m of marks){const v=typeof m==='number'?{value:m,text:m}:m;if(Math.abs(v.value-mu)>.000001)s+=tick(x((v.value-mu)/sd),147,v.text)}
 if(area)s+=txt(240,22,area,'font-weight="600"');
 s+=txt(240,199,label);
 if(sdLabel)s+=txt(438,38,'σ = '+sd,'class="small"');
 save(name,'Normal probability model: '+label+(area?'; '+area:''),s);
}
function bars(name,{values,probs,selected=()=>false,label='Count, x',probLabels=false,title='Discrete probability distribution'}){
 const left=48,right=459,base=153,width=right-left,step=width/values.length,max=Math.max(...probs)*1.18;
 let s='<path d="M48 27V153H459" fill="none" stroke="'+line+'"/>'+txt(67,15,'P(X = x)','font-size="11"');
 for(let j=0;j<=3;j++){const p=max*j/3,y=base-p/max*113;s+='<path d="M45 '+y+'H459" stroke="'+(j?'#e8ede7':line)+'"/>'+txt(24,y+4,p.toFixed(max<.1?3:2),'class="small"')}
 values.forEach((v,i)=>{const x=left+i*step+step*.15,h=probs[i]/max*113;s+='<rect x="'+x+'" y="'+(base-h)+'" width="'+step*.7+'" height="'+Math.max(h,.02)+'" fill="'+(selected(v)?green:pale)+'" stroke="'+(selected(v)?green:line)+'" stroke-width=".7"/>';if(values.length<=16||i%5===0||i===values.length-1)s+=txt(x+step*.35,172,v,'class="small"');if(probLabels)s+=txt(x+step*.35,base-h-7,Number(probs[i].toFixed(3)))});
 s+=txt(250,198,label);
 save(name,title,s);
}
function bin(name,n,p,lo,hi){const choose=(n,k)=>{let r=1;for(let i=1;i<=k;i++)r=r*(n-i+1)/i;return r};const vs=Array.from({length:n+1},(_,k)=>k);bars(name,{values:vs,probs:vs.map(k=>choose(n,k)*p**k*(1-p)**(n-k)),selected:k=>lo!==undefined&&k>=lo&&k<=hi,label:'Number of successes, x',title:'Binomial distribution, n = '+n+', p = '+p+(lo!==undefined?'; highlighted counts '+lo+' through '+hi:'')})}
bars('b03-discrete',{values:[0,1,2,3],probs:[.15,.35,.3,.2],probLabels:true,label:'Repair calls per day, x'});
bars('b06-discrete',{values:[0,1,2,3],probs:[.2,.4,.2,.2],probLabels:true,label:'Returned packages per day, x'});
bin('b14-binomial',10,.2,3,3);bin('b15-binomial',8,.3,0,2);bin('b16-binomial',12,.25,4,12);bin('b17-binomial',10,.4,0,3);bin('b20-binomial',6,.9);
normal('b23-normal',{mu:180,sd:12,lo:168,hi:192,marks:[168,192],label:'Fruit mass (g)'});
normal('b24-normal',{mu:40,sd:3,lo:46,marks:[46],label:'Lifetime (hours)'});
normal('b25-normal',{mu:100,sd:8,lo:92,marks:[92],label:'Flight duration (minutes)'});
normal('b26-normal',{mu:54,sd:6,lo:42,hi:66,marks:[42,66],label:'Measurement (cm)',area:'Middle 95% (approximately)',sdLabel:false});
normal('b28-normal',{mu:0,sd:1,lo:-1,hi:2,marks:[-1,2],label:'Standard normal value, z'});
normal('b30-normal',{mu:54,sd:6,hi:48,marks:[{value:48,text:'c'}],label:'Finishing time (minutes)',area:'Lower 16% (approximately)'});
normal('b31-normal',{mu:50,sd:8,hi:44,marks:[44],label:'Waiting time (hours)'});
normal('b32-normal',{mu:50,sd:8,lo:60,marks:[60],label:'Rod length (cm)'});
normal('b33-normal',{mu:30,sd:5,lo:25,hi:38,marks:[25,38],label:'Travel time (minutes)'});
normal('b34-normal',{mu:20,sd:.4,lo:19.6,hi:20.8,marks:[19.6,20.8],outside:true,label:'Ring diameter (mm)'});
normal('b35-normal',{mu:80,sd:12,hi:95.3786,marks:[{value:95.3786,text:'c'}],label:'Delivery distance (km)',area:'Area to the left of c = 0.90'});
normal('b36-normal',{mu:120,sd:15,hi:95.3272,marks:[{value:95.3272,text:'c'}],label:'Completion time (seconds)',area:'Area to the left of c = 0.05'});
normal('b37-normal',{mu:1000,sd:20,lo:974.369,hi:1025.631,marks:[{value:974.369,text:'a'},{value:1025.631,text:'b'}],label:'Package mass (g)',area:'Middle 80%'});
normal('b38-normal',{mu:48.4078,sd:5,hi:42,marks:[42],meanLabel:'μ',label:'Measurement (cm)',area:'Area to the left of 42 = 0.10'});
normal('b39-normal',{mu:75,sd:9/1.2816,hi:84,marks:[84],label:'Score (points)',area:'Area to the left of 84 = 0.90',sdLabel:false});
normal('b40-normal',{mu:2,sd:.3,lo:2.45,marks:[2.45],label:'Parcel mass (kg)'});
// Comparing two densities: height changes while both areas remain one.
{
 const x=v=>40+(v-20)/60*400,y=(v,sd)=>150-100*(4/sd)*Math.exp(-.5*((v-50)/sd)**2);let s='<path d="M35 150H450" stroke="'+line+'"/>';
 for(const [sd,color,dash] of [[4,green,''],[10,'#8c7651','stroke-dasharray="5 4"']]){const ps=Array.from({length:201},(_,i)=>{const v=20+i*.3;return x(v)+','+y(v,sd)});s+='<path d="M'+ps.join(' L')+'" fill="none" stroke="'+color+'" stroke-width="2.5" '+dash+'/>'}
 s+=tick(x(50),150,'50')+txt(240,20,'A: σ = 4 (solid)     B: σ = 10 (dashed)')+txt(240,198,'Measurement');save('b29-normal-comparison','Two normal curves with the same mean and different standard deviations',s);
}
// Simulation histogram: all 1,000 repetitions accounted for, with 28 in the tail.
{
 const counts=[65,180,290,260,125,52,20,8],base=151,left=49,step=50;let s='<path d="M49 32V151H449" stroke="'+line+'" fill="none"/>'+txt(85,18,'Frequency','class="small"');
 counts.forEach((v,i)=>{const h=v/300*110,x=left+i*step;s+='<rect x="'+x+'" y="'+(base-h)+'" width="50" height="'+h+'" fill="'+(i>=6?green:pale)+'" stroke="'+line+'"/>'+txt(x+25,base-h-6,v,'class="small"')});
 for(let i=0;i<=8;i++)s+=tick(left+i*step,base,(13.8+i*.4).toFixed(1));
 s+=txt(250,198,'Sample mean service time (minutes)');save('b48-simulation','Histogram of 1,000 simulated sample means; the two bars at or above 16.2 minutes have counts 20 and 8.',s);
}
{
 let s='<path d="M48 140H437" stroke="'+line+'"/>';const xs=[3,4,5,5,6,7],seen={};for(const v of xs){const y=126-((seen[v]||0)*18);seen[v]=(seen[v]||0)+1;s+='<circle cx="'+(65+(v-3)*85)+'" cy="'+y+'" r="6" fill="'+(v>=6?green:'#a8bbae')+'"/>'}for(let v=3;v<=7;v++)s+=tick(65+(v-3)*85,140,v);s+=txt(240,48,'One dot per equally likely sample')+txt(240,198,'Sample mean, x̄');save('b50-sampling','Sampling distribution of six equally likely sample means: 3, 4, 5, 5, 6, 7. The dots at 6 and 7 are shaded.',s);
}
console.log('Built '+fs.readdirSync(out).filter(f=>f.endsWith('.svg')).length+' probability diagrams.');
