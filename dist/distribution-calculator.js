/* Guided fx-CG50 screens, checked against the supplied Oxford and Haese guides.
   This extends the existing walkthrough; it is not a live Casio emulator. */
function dcPhi(z){
 if(z<=-10)return 0;if(z>=10)return 1;
 const n=1000,h=Math.abs(z)/n,f=x=>Math.exp(-x*x/2)/Math.sqrt(2*Math.PI);
 let sum=f(0)+f(Math.abs(z));for(let i=1;i<n;i++)sum+=(i%2?4:2)*f(i*h);
 return .5+Math.sign(z)*sum*h/3;
}
function dcInv(p){let a=-9,b=9;for(let i=0;i<60;i++){const m=(a+b)/2;if(dcPhi(m)<p)a=m;else b=m}return(a+b)/2;}
const dcNumber=n=>Number(n).toFixed(8).replace(/0+$/,'').replace(/\.$/,'');
function dcKeys(value){
 const s=String(value);if(s.includes('10⁹⁹'))return [...(s.startsWith('−')?['NEG']:[]),'1','EXP','9','9','EXE'];
 return [...s.split('').map((c,i)=>({'-':i===0?'NEG':'SUB','−':'NEG','.':'DOT','+':'ADD','*':'MUL','/':'DIV','(':'LP',')':'RP'}[c]||c)),'EXE'];
}
function dcResult(name,fields){
 const f=Object.fromEntries(fields),bound=x=>String(x).includes('10⁹⁹')?(String(x).startsWith('−')?-Infinity:Infinity):Number(x);
 if(name==='Inverse Normal')return Number(f['μ'])+Number(f['σ'])*dcInv(Number(f.Area));
 if(name==='Normal CD')return dcPhi((bound(f.Upper)-f['μ'])/f['σ'])-dcPhi((bound(f.Lower)-f['μ'])/f['σ']);
 return bBin(Number(f.Numtrial),Number(f.p),Number(f.x??f.Lower),Number(f.x??f.Upper));
}
function dcSequence(name,fields,repeat=false){
 const bin=name.startsWith('Binomial'),inverse=name==='Inverse Normal',code=bin?(name==='Binomial PD'?'Bpd':'Bcd'):(inverse?'InvN':'Ncd');
 const title=bin?(name==='Binomial PD'?'Binomial P.D':'Binomial C.D'):(inverse?'Inverse Normal':'Normal C.D');
 const rows=[['Data','Variable'],...fields,['Save Res','None'],['Execute','']];
 const frame=(selected)=>({type:'form',title,rows,selected});
 const step=(label,keys,screen,note)=>({title:label,keys,mode:'distribution',input:label,result:'',note,frame:screen});
 const steps=repeat?[step('Return to the template',['EXIT'],frame(0),'EXIT returns to the distribution template. Enter the next set of values.')]:[
  step('Open the main menu',['MENU'],{type:'main'},'Choose Statistics, item 2.'),
  step('Open Statistics',['2'],{type:'stat'},'Press 2 for Statistics. Open DIST with F5.'),
  step('Open DIST',['F5'],{type:'dist'},'The Distribution menu has NORM on F1 and BINOMIAL on F5.'),
  step('Choose '+(bin?'BINOMIAL':'NORM'),[bin?'F5':'F1'],{type:bin?'binomial':'normal'},'Choose '+code+' with '+(inverse?'F3':name==='Binomial PD'?'F1':'F2')+'.'),
  step('Open '+code,[inverse?'F3':name==='Binomial PD'?'F1':'F2'],frame(0),'On the Data row, choose F2 (Var) for a single set of values.')
 ];
 steps.push(step('Select Data: Variable',['F2'],frame(0),'Use the arrow keys to select each named row. Pressing EXE confirms an entry.'));
 fields.forEach(([field,value],i)=>steps.push(step('Select '+field+'; enter '+value,field==='Tail'?['F1']:dcKeys(value),frame(i+1),field==='Tail'?'Select the Tail row, then F1 (Left). Area is measured to the left of the cutoff.':'Use the arrow keys to select '+field+', type '+value+', then press EXE.'+(String(value).includes('10⁹⁹')?' Use the ×10ˣ key for the exponent; this bound approximates infinity.':''))));
 steps.push(step('Select Save Res: None',['F1'],frame(rows.length-2),'Select Save Res with the arrow keys, then F1 (None). No list is needed.'));
 const result=dcResult(name,fields);
 steps.push(step('Select Execute; calculate',['DOWN','EXE'],{type:'result',title,name,fields,value:result},'Move down to Execute and press EXE. Result: '+dcNumber(result)+'. Keep extra digits until the final answer.'));
 return {steps,result};
}
function dcArithmetic(entry,result,note){
 return [{title:'Open the main menu',keys:['MENU'],mode:'menu',input:'',result:'',note:'Choose Run-Matrix to combine the results.'},
 {title:'Open Run-Matrix',keys:['1'],mode:'run',input:'',result:'',note:'Press 1 for Run-Matrix.'},
 {title:'Calculate using the retained digits',keys:['AC',...dcKeys(entry)],entry,mode:'result',input:entry,result:dcNumber(result),note}];
}
for(const [id,guide] of Object.entries(calculatorData)){
 if(!guide.distribution)continue;
 const d=guide.distribution,fields=d.fields.map(([k,v])=>[k.replace(/^First (calculation|cutoff): /,''),v]);
 const first=dcSequence(d.name,fields);guide.needed=true;guide.steps=first.steps;
 if(id==='b34'){
  const second=dcSequence(d.name,[['Lower',20.8],['Upper','1 × 10⁹⁹'],['σ',.4],['μ',20]],true);
  guide.steps.push(...second.steps,...dcArithmetic(dcNumber(first.result)+'+'+dcNumber(second.result),first.result+second.result,'Add the disjoint tail probabilities. Approximately 0.1814 of the rings are rejected.'));
 }else if(id==='b37'){
  guide.steps.push(...dcSequence(d.name,[['Tail','Left'],['Area',.9],['σ',20],['μ',1000]],true).steps);
  guide.steps.at(-1).note='The two cutoffs are approximately 974.37 g and 1025.63 g. These enclose the middle 80%.';
 }else if(id==='b38')guide.steps.push(...dcArithmetic('42-('+dcNumber(first.result)+')*5',42-first.result*5,'Solve μ = 42 − z × 5. The mean is approximately 48.41 cm.'));
 else if(id==='b39')guide.steps.push(...dcArithmetic('(84-75)/'+dcNumber(first.result),9/first.result,'Solve σ = (84 − 75) ÷ z. The standard deviation is approximately 7.02 points.'));
 else if(id==='b40')guide.steps.push(...dcArithmetic(dcNumber(first.result)+'*800',first.result*800,'Multiply the tail probability by 800. Predict approximately 53 packages.'));
}
function dcSoft(labels){return '<div class="dc-soft">'+Array.from({length:6},(_,i)=>'<span>'+esc(labels[i]||'')+'</span>').join('')+'</div>';}
function dcScreen(frame){
 const head=title=>'<div class="dc-title">'+esc(title)+'</div>';
 if(frame.type==='stat')return head('Statistics')+'<div class="dc-lists"><div>List 1<br>1<br>2<br>3<br>4<br>5</div><div>List 2<br><br><br><br><br><br></div><div>List 3<br><br><br><br><br><br></div></div>'+dcSoft(['','','','','DIST','']);
 if(['dist','normal','binomial'].includes(frame.type))return head('Statistics · Distribution')+'<div class="dc-menu-name">'+esc({dist:'Choose distribution',normal:'Normal',binomial:'Binomial'}[frame.type])+'</div>'+dcSoft(frame.type==='dist'?['NORM','','','','BINOMIAL','']:frame.type==='normal'?['Npd','Ncd','InvN','','','']:['Bpd','Bcd','','','','']);
 if(frame.type==='form'){
  const start=Math.max(0,frame.selected-5),visible=frame.rows.slice(start,start+6);
  const selectedName=frame.rows[frame.selected][0];
  return head(frame.title)+'<div class="dc-fields">'+visible.map(([label,value],i)=>'<div class="dc-field '+(start+i===frame.selected?'selected':'')+'"><span>'+esc(label)+'</span><span>'+esc(value)+'</span></div>').join('')+'</div>'+dcSoft(selectedName==='Data'?['List','Var','','','','']:selectedName==='Tail'?['Left','Right','Central','','','']:selectedName==='Save Res'?['None','List','','','','']:[]);
 }
 if(frame.type==='result'){
  let lines=[[frame.name==='Inverse Normal'?'xInv':'p',dcNumber(frame.value)]];
  if(frame.name==='Normal CD'){
   const f=Object.fromEntries(frame.fields),z=x=>String(x).includes('10⁹⁹')?((String(x).startsWith('−')?-1e99:1e99)/f['σ']).toExponential(5):dcNumber((Number(x)-f['μ'])/f['σ']);
   lines.push(['z:Low',z(f.Lower)],['z:Up',z(f.Upper)]);
  }
  return head(frame.title)+'<div class="dc-results">'+lines.map(([k,v])=>'<div>'+esc(k)+' = '+esc(v)+'</div>').join('')+'</div>'+dcSoft([]);
 }
 return '';
}
renderCalculator=function(){
 originalRenderCalculator();
 const guide=calculatorData[data[current].id];if(!guide.distribution)return;
 const frame=guide.steps[calcStep].frame;if(!frame)return;
 const lcd=calcView.querySelector('.mini-lcd'),glass=lcd.querySelector('.lcd-glass');
 if(frame.type==='main'){
  glass.innerHTML='<div class="lcd-status menu-status"><span class="lcd-battery"></span>MAIN MENU</div><div class="lcd-menu">'+casioIcons.map((icon,i)=>'<div class="lcd-icon '+(i===1?'selected':'')+'"><img src="'+icon.src+'" alt=""><span>'+esc(icon.label)+'</span></div>').join('')+'</div>';
 }else glass.innerHTML=dcScreen(frame);
 lcd.setAttribute('aria-label','Guided calculator screen: '+(frame.title||frame.type)+(frame.type==='result'?', result '+dcNumber(frame.value):''));
};
