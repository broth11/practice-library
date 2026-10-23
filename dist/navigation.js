const routeApp=document.querySelector('.app'),routeContent=document.getElementById('route-content'),routeSidebar=document.querySelector('.sidebar');
let routePane='questions',routeExpanded=!matchMedia('(max-width:760px)').matches,selectedUnit='2A';
const unitLastQuestion={'2A':0,'2B':50};
const unitInfo={
 '2A':{name:'Unit 2.A',description:'Categorical data & probability',start:0,end:50,lessons:sections.slice(0,5)},
 '2B':{name:'Unit 2.B',description:'Random variables, normal models & sampling',start:50,end:100,lessons:unitBSections}
};
const questionPane=document.createElement('section');questionPane.id='route-questions';questionPane.className='route-pane';questionPane.setAttribute('role','tabpanel');questionPane.setAttribute('aria-labelledby','route-tab-questions');questionPane.tabIndex=0;
while(routeContent.firstChild)questionPane.appendChild(routeContent.firstChild);
questionPane.querySelector('.route-label').textContent='Lessons & questions';
questionPane.querySelector('.side-note').innerHTML='Progress lasts for this page visit.<br>Original AP-style practice · 10 per lesson';
const coursePane=document.createElement('section');coursePane.id='route-courses';coursePane.className='route-pane';coursePane.setAttribute('role','tabpanel');coursePane.setAttribute('aria-labelledby','route-tab-courses');coursePane.tabIndex=0;coursePane.hidden=true;
coursePane.innerHTML='<span class="eyebrow">Practice library</span><h1>Courses</h1><p class="pane-description">Choose a course, then a unit and lesson.</p><button type="button" class="nav-choice" id="choose-statistics" aria-current="true"><span class="eyebrow">Your course</span><strong>AP Statistics</strong><small>2 units · 10 lessons<br>100 practice questions</small><span class="choice-link">Explore units →</span></button><p class="unit-context">One question at a time.<br>Worked solutions when you’re ready.</p>';
const unitsPane=document.createElement('section');unitsPane.id='route-units';unitsPane.className='route-pane';unitsPane.setAttribute('role','tabpanel');unitsPane.setAttribute('aria-labelledby','route-tab-units');unitsPane.tabIndex=0;unitsPane.hidden=true;
unitsPane.innerHTML='<span class="eyebrow">AP Statistics</span><h1>Units</h1><p class="pane-description">Choose your next practice route.</p>'+Object.entries(unitInfo).map(([id,u])=>'<button type="button" class="nav-choice" data-unit="'+id+'" aria-current="'+(id===selectedUnit)+'"><span class="eyebrow">5 lessons · 50 questions</span><strong>'+u.name+'</strong><small>'+u.description+'</small><span class="choice-link">Choose a lesson →</span></button>').join('')+'<p class="unit-context">Selected: <b id="selected-unit-label">Unit 2.A</b></p>';
routeContent.append(coursePane,unitsPane,questionPane);
const rail=document.createElement('div');rail.className='route-rail';rail.setAttribute('role','tablist');rail.setAttribute('aria-label','Practice library');rail.setAttribute('aria-orientation','vertical');
rail.innerHTML=['courses','units','questions'].map(p=>'<button type="button" role="tab" class="route-tab" id="route-tab-'+p+'" aria-controls="route-'+p+'" aria-selected="'+(p===routePane)+'" tabindex="'+(p===routePane?'0':'-1')+'" data-route-pane="'+p+'"><span class="tab-arrow" aria-hidden="true">▶</span><span>'+p[0].toUpperCase()+p.slice(1)+'</span></button>').join('');
routeSidebar.prepend(rail);
const routePanes={courses:coursePane,units:unitsPane,questions:questionPane};
function applyRouteState(){
 routeApp.classList.toggle('nav-collapsed',!routeExpanded);routeApp.classList.toggle('route-open',routeExpanded);
 routeContent.inert=!routeExpanded;routeContent.setAttribute('aria-hidden',String(!routeExpanded));
 for(const [p,el] of Object.entries(routePanes))el.hidden=p!==routePane;
 rail.querySelectorAll('[role=tab]').forEach(b=>{const selected=b.dataset.routePane===routePane;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;b.setAttribute('aria-expanded',String(selected&&routeExpanded));b.querySelector('.tab-arrow').textContent=selected&&routeExpanded?'◀':'▶'});
 document.getElementById('route-toggle').setAttribute('aria-expanded',String(routeExpanded));
}
updateRoute=applyRouteState;
function openRoutePane(p){routePane=p;routeExpanded=true;applyRouteState();fit()}
rail.querySelectorAll('[role=tab]').forEach(b=>{
 b.onclick=()=>animateLayout(()=>{if(routePane===b.dataset.routePane)routeExpanded=!routeExpanded;else{routePane=b.dataset.routePane;routeExpanded=true}applyRouteState()});
 b.onkeydown=e=>{const tabs=[...rail.querySelectorAll('[role=tab]')],i=tabs.indexOf(b);let j;if(e.key==='ArrowDown')j=(i+1)%3;else if(e.key==='ArrowUp')j=(i+2)%3;else if(e.key==='Home')j=0;else if(e.key==='End')j=2;if(j!==undefined){e.preventDefault();e.stopPropagation();openRoutePane(tabs[j].dataset.routePane);tabs[j].focus()}};
});
document.getElementById('choose-statistics').onclick=()=>animateLayout(()=>openRoutePane('units'));
function renderLessonRoute(){
 const u=unitInfo[selectedUnit];questionPane.querySelector('.brand .eyebrow').textContent='AP Statistics';questionPane.querySelector('.brand h1').textContent=u.name;questionPane.querySelector('.brand p').textContent=u.description;
 const nav=questionPane.querySelector('nav');nav.setAttribute('aria-label',u.name+' lessons and questions');
 nav.innerHTML=u.lessons.map(s=>{const indices=data.flatMap((q,i)=>q.section===s.id?[i]:[]);return'<div class="nav-group"><button type="button" class="section-link" data-index="'+indices[0]+'" aria-expanded="false" aria-controls="lesson-'+s.id.replaceAll('.','-')+'"><span class="section-number">Lesson '+s.id+'</span><span class="section-label">'+s.title+'</span></button><div class="question-dots" id="lesson-'+s.id.replaceAll('.','-')+'" aria-label="Questions in lesson '+s.id+'">'+indices.map((i,n)=>'<button type="button" class="question-dot" data-index="'+i+'" aria-label="Lesson '+s.id+', question '+(n+1)+'">'+(n+1)+'</button>').join('')+'</div></div>'}).join('');
 nav.querySelectorAll('.section-link').forEach(b=>b.onclick=()=>animateLayout(()=>{const group=b.closest('.nav-group');if(group.classList.contains('lesson-open')&&data[current].section===data[Number(b.dataset.index)].section){group.classList.remove('lesson-open');b.setAttribute('aria-expanded','false')}else show(Number(b.dataset.index))}));
 nav.querySelectorAll('.question-dot').forEach(b=>b.onclick=()=>animateLayout(()=>{show(Number(b.dataset.index));if(matchMedia('(max-width:760px)').matches){routeExpanded=false;applyRouteState()}}));
 unitsPane.querySelectorAll('[data-unit]').forEach(b=>b.setAttribute('aria-current',String(b.dataset.unit===selectedUnit)));
 document.getElementById('selected-unit-label').textContent=u.name;
}
const originalShowQuestion=show;
show=function(index){
 if(index<0||index>=data.length)return;
 const target=index<50?'2A':'2B';if(target!==selectedUnit){selectedUnit=target;renderLessonRoute()}
 originalShowQuestion(index);unitLastQuestion[selectedUnit]=index;
 const u=unitInfo[selectedUnit],local=index-u.start+1,lesson=data[index].section;
 document.getElementById('breadcrumb').textContent='AP Statistics / '+u.name+' / Lesson '+lesson;
 document.getElementById('page-position').textContent='Question '+local+' of '+(u.end-u.start);
 drawerTitle.textContent='Question '+String(local).padStart(2,'0');
 prev.disabled=index===u.start;next.disabled=index===u.end-1;
 prev.setAttribute('aria-label',prev.disabled?'Previous question (first question in unit)':'Previous question');next.setAttribute('aria-label',next.disabled?'Next question (last question in unit)':'Next question');
 document.getElementById('next-label').textContent=!next.disabled&&data[index+1].section!==lesson?'Next lesson':'Next';
 questionPane.querySelectorAll('.nav-group').forEach(g=>{const active=data[Number(g.querySelector('.section-link').dataset.index)].section===lesson;g.classList.toggle('lesson-open',active);g.querySelector('.section-link').setAttribute('aria-expanded',String(active))});
 updateProgress();
};
updateProgress=function(){const u=unitInfo[selectedUnit],unitCards=cards.slice(u.start,u.end),answers=unitCards.filter(c=>c.querySelector('input:checked')).length,opened=[...viewed].filter(i=>i>=u.start&&i<u.end).length;document.getElementById('answered').textContent=answers;document.getElementById('viewed').textContent=opened;document.getElementById('progress-fill').style.width=answers/(u.end-u.start)*100+'%';document.getElementById('answer-progress').setAttribute('aria-valuenow',answers);questionPane.querySelectorAll('.question-dot').forEach(d=>d.classList.toggle('answered',!!cards[Number(d.dataset.index)].querySelector('input:checked')))};
const originalOpenSolution=openSolution;
openSolution=function(){originalOpenSolution();drawerTitle.textContent='Question '+String(current-unitInfo[selectedUnit].start+1).padStart(2,'0')};
const originalCalculatorMode=calculatorMode;
calculatorMode=function(on){if(on)routeExpanded=false;originalCalculatorMode(on);applyRouteState()};
unitsPane.querySelectorAll('[data-unit]').forEach(b=>b.onclick=()=>animateLayout(()=>{const target=b.dataset.unit;selectedUnit=target;renderLessonRoute();show(unitLastQuestion[target]);openRoutePane('questions')}));
prev.onclick=()=>{if(!prev.disabled)animateLayout(()=>show(current-1))};next.onclick=()=>{if(!next.disabled)animateLayout(()=>show(current+1))};
// Keep keyboard paging inside the current unit; tab controls own their arrow keys.
document.addEventListener('keydown',e=>{if(e.target.closest('.route-rail'))return;if(!e.altKey&&!e.ctrlKey&&!e.metaKey&&!e.target.closest('input,textarea,select,[contenteditable],#calculator-view,.solution-tabs')){if((e.key==='ArrowLeft'&&current===unitInfo[selectedUnit].start)||(e.key==='ArrowRight'&&current===unitInfo[selectedUnit].end-1)){e.preventDefault();e.stopImmediatePropagation()}}if(e.key==='Escape'&&routeExpanded&&matchMedia('(max-width:760px)').matches){routeExpanded=false;applyRouteState();rail.querySelector('[aria-selected=true]').focus()}},true);
renderLessonRoute();applyRouteState();show(0);
