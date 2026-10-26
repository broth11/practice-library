import { transitionPanels as runPanelTransition } from './panel-motion.js?v=31ae20218cd0';
import { fitQuestion } from './question-fit.js?v=31ae20218cd0';
import { renderStimulus } from './stimulus.js?v=31ae20218cd0';
import { preloadLibraryImages, preloadUnitImages } from './image-preload.js?v=31ae20218cd0';
import { renderStep, typesetMath } from './math.js?v=31ae20218cd0';
import { mountCalculator } from './calculator.js?v=31ae20218cd0';
import { renderChoice, choiceText } from './choices.js?v=31ae20218cd0';

const app = document.getElementById('practice-app');
const rail = document.getElementById('route-rail');
const routeContent = document.getElementById('route-content');
const questionArea = document.getElementById('question-area');
const explanation = document.getElementById('explanation-panels');
const calculatorView = document.getElementById('calculator-view');
const solutionShell = document.getElementById('solution-shell');
const drawer = document.getElementById('solution-drawer');
const workspace = document.getElementById('workspace');
const welcome = document.getElementById('welcome-screen');
const previous = document.getElementById('previous');
const next = document.getElementById('next');
const answers = new Map();
const viewed = new Set();

const state = {
  catalog: null,
  course: null,
  courseManifest: null,
  unit: null,
  current: 0,
  routePane: 'courses',
  routeExpanded: true,
  solutionOpen: false,
  solutionView: 'explanation'
};

const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const fetchJson = async source => {
  const response = await fetch(new URL(source, document.baseURI), { cache: 'no-cache' });
  if (!response.ok) throw new Error(`Could not load ${source} (${response.status})`);
  return response.json();
};
const answerKey = question => `${state.unit.id}:${question.id}`;

function transitionPanels(update) {
  return runPanelTransition(() => {
    update();
    // View transition capture pauses animation frames, so fit synchronously.
    fit(true);
  });
}

function routeHash() {
  const values = new URLSearchParams();
  if (state.course) values.set('course', state.course.id);
  if (state.unit) values.set('unit', state.unit.id);
  if (state.unit?.questions[state.current]) values.set('question', state.unit.questions[state.current].id);
  history.replaceState(null, '', values.size ? `#${values}` : `${location.pathname}${location.search}`);
}

function setWelcome() {
  app.classList.remove('practice-started', 'calculator-mode');
  welcome.hidden = false;
  closeSolution();
  if (state.unit) {
    document.getElementById('welcome-title').textContent = state.unit.title;
    document.getElementById('welcome-prompt').textContent = 'Choose a lesson';
    document.getElementById('welcome-direction').textContent = 'Choose a lesson from the sidebar to begin your practice.';
    document.getElementById('welcome-eyebrow').textContent = `${state.course.title} · ${state.unit.description}`;
  } else if (state.course) {
    document.getElementById('welcome-title').textContent = state.course.title;
    document.getElementById('welcome-prompt').textContent = 'Choose a unit';
    document.getElementById('welcome-direction').textContent = 'Explore the units in the sidebar, then select a lesson to begin.';
    document.getElementById('welcome-eyebrow').textContent = 'Practice Library';
  } else {
    document.getElementById('welcome-title').innerHTML = 'Welcome to the <br>Practice Library';
    document.getElementById('welcome-prompt').textContent = 'What would you like to practice today?';
    document.getElementById('welcome-direction').textContent = 'Choose a course from the sidebar, then explore its units and lessons.';
    document.getElementById('welcome-eyebrow').textContent = 'A little practice. A deeper understanding.';
  }
}

function setRoutePane(pane, expanded = true) {
  state.routePane = pane;
  state.routeExpanded = expanded;
  app.classList.toggle('nav-collapsed', !expanded);
  renderNavigation();
}

async function selectCourse(course, updateHash = true) {
  const manifest = await fetchJson(course.manifest);
  const update = () => {
    state.course = course;
    state.courseManifest = manifest;
    state.unit = null;
    state.current = 0;
    setWelcome();
    setRoutePane('units');
    if (updateHash) routeHash();
  };
  if (updateHash) await transitionPanels(update);
  else update();
}

async function selectUnit(unitMeta, updateHash = true) {
  const unit = await fetchJson(unitMeta.source);
  const update = () => {
    state.unit = unit;
    preloadUnitImages(state.unit);
    state.current = 0;
    setWelcome();
    setRoutePane('questions');
    if (updateHash) routeHash();
  };
  if (updateHash) await transitionPanels(update);
  else update();
}

function selectLesson(lessonId) {
  const index = state.unit.questions.findIndex(question => question.lesson === lessonId);
  if (index >= 0) showQuestion(index);
}

function progressForUnit() {
  if (!state.unit) return { answered: 0, opened: 0 };
  const prefix = `${state.unit.id}:`;
  return {
    answered: [...answers.keys()].filter(key => key.startsWith(prefix)).length,
    opened: [...viewed].filter(key => key.startsWith(prefix)).length
  };
}

function renderNavigation() {
  const panes = ['courses', 'units', 'questions'];
  rail.innerHTML = panes.map(pane => `<button type="button" role="tab" class="route-tab" aria-selected="${pane === state.routePane}" ${pane === 'units' && !state.course || pane === 'questions' && !state.unit ? 'disabled' : ''} data-pane="${pane}"><span class="tab-arrow" aria-hidden="true">${pane === state.routePane && state.routeExpanded ? '◀' : '▶'}</span><span>${pane[0].toUpperCase() + pane.slice(1)}</span></button>`).join('');
  rail.querySelectorAll('[data-pane]').forEach(button => button.onclick = () => transitionPanels(() => setRoutePane(button.dataset.pane, state.routePane === button.dataset.pane ? !state.routeExpanded : true)));
  if (!state.routeExpanded) { routeContent.innerHTML = ''; return; }

  if (state.routePane === 'courses') {
    routeContent.innerHTML = `<section class="route-pane"><span class="eyebrow">Practice library</span><h1>Courses</h1><p class="pane-description">Choose a course, then a unit and lesson.</p>${state.catalog.courses.map(course => `<button type="button" class="nav-choice" data-course="${course.id}" aria-current="${state.course?.id === course.id}"><span class="eyebrow">Available course</span><strong>${escapeHtml(course.title)}</strong><small>${escapeHtml(course.description)}</small><span class="choice-link">Explore units →</span></button>`).join('')}</section>`;
    routeContent.querySelectorAll('[data-course]').forEach(button => button.onclick = () => selectCourse(state.catalog.courses.find(course => course.id === button.dataset.course)));
    return;
  }
  if (state.routePane === 'units') {
    routeContent.innerHTML = `<section class="route-pane"><span class="eyebrow">${escapeHtml(state.course.title)}</span><h1>Units</h1><p class="pane-description">Choose your next practice route.</p>${state.courseManifest.units.map(unit => `<button type="button" class="nav-choice" data-unit="${unit.id}" aria-current="${state.unit?.id === unit.id}"><span class="eyebrow">${unit.lessonCount} lessons · ${unit.questionCount} questions</span><strong>${escapeHtml(unit.title)}</strong><small>${escapeHtml(unit.description)}</small><span class="choice-link">Choose a lesson →</span></button>`).join('')}<p class="unit-context">Selected: <b>${escapeHtml(state.unit?.title || 'No unit selected')}</b></p></section>`;
    routeContent.querySelectorAll('[data-unit]').forEach(button => button.onclick = () => selectUnit(state.courseManifest.units.find(unit => unit.id === button.dataset.unit)));
    return;
  }
  const currentQuestion = state.unit.questions[state.current];
  const progress = progressForUnit();
  routeContent.innerHTML = `<section class="route-pane"><header class="brand"><div class="eyebrow">${escapeHtml(state.course.title)}</div><h1>${escapeHtml(state.unit.title)}</h1><p>${escapeHtml(state.unit.description)}</p></header><p class="route-label">Lessons &amp; questions</p><nav aria-label="${escapeHtml(state.unit.title)} lessons and questions">${state.unit.lessons.map(lesson => { const indices = state.unit.questions.flatMap((question, index) => question.lesson === lesson.id ? [index] : []); const open = currentQuestion?.lesson === lesson.id && app.classList.contains('practice-started'); return `<div class="nav-group ${open ? 'lesson-open' : ''}"><button type="button" class="section-link" data-lesson="${lesson.id}" aria-expanded="${open}"><span class="section-number">Lesson ${lesson.id}</span><span class="section-label">${escapeHtml(lesson.title)}</span></button><div class="question-dots" aria-label="Questions in lesson ${lesson.id}">${indices.map((index, local) => { const question = state.unit.questions[index]; const selected = index === state.current && app.classList.contains('practice-started'); return `<button type="button" class="question-dot ${selected ? 'current' : ''} ${answers.has(answerKey(question)) ? 'answered' : ''}" data-index="${index}" ${selected ? 'aria-current="step"' : ''}>${local + 1}</button>`; }).join('')}</div></div>`; }).join('')}</nav><footer class="side-footer"><span>${progress.answered}</span> / ${state.unit.questions.length} answers selected<div class="track" role="progressbar" aria-valuemin="0" aria-valuemax="${state.unit.questions.length}" aria-valuenow="${progress.answered}"><span style="width:${progress.answered / state.unit.questions.length * 100}%"></span></div><span>${progress.opened}</span> / ${state.unit.questions.length} solutions opened</footer></section>`;
  routeContent.querySelectorAll('[data-lesson]').forEach(button => button.onclick = () => transitionPanels(() => selectLesson(button.dataset.lesson)));
  routeContent.querySelectorAll('[data-index]').forEach(button => button.onclick = () => showQuestion(Number(button.dataset.index)));
}

function renderQuestion(question) {
  const lessonQuestions = state.unit.questions.filter(item => item.lesson === question.lesson);
  const local = lessonQuestions.indexOf(question) + 1;
  const selected = answers.get(answerKey(question));
  questionArea.innerHTML = `<article class="card" id="${question.id}" data-archetype="${escapeHtml(question.archetype || '')}" aria-labelledby="${question.id}-ask"><header class="card-top"><span class="question-badge">Question ${String(state.current + 1).padStart(2, '0')}</span><span class="within">Lesson ${escapeHtml(question.lesson)} · ${local} of ${lessonQuestions.length}</span></header><div class="question-content"><div class="question-inner"><p class="scenario">${question.scenario}</p>${renderStimulus(question.stimulus)}<p class="ask" id="${question.id}-ask">${question.prompt}</p>${question.notationKey ? `<p class="notation-key">Key: <span class="literal-notation">${escapeHtml(question.notationKey)}</span></p>` : ''}<fieldset aria-labelledby="${question.id}-ask">${question.choices.map((choice, index) => { const letter = 'ABCD'[index]; return `<label class="option ${typeof choice === 'string' ? '' : 'structured-option'}"><input type="radio" name="${question.id}" value="${letter}" ${typeof choice === 'string' ? '' : `aria-label="${escapeHtml(`${letter}. ${choiceText(choice)}`)}"`} ${selected === letter ? 'checked' : ''}><span class="letter">${letter}</span><span class="option-text ${typeof choice === 'string' ? '' : 'structured-choice'}">${renderChoice(choice)}</span></label>`; }).join('')}</fieldset></div></div><footer class="card-footer"><span class="choice-status" aria-live="polite">${selected ? `Answer ${selected} selected. Ready to check?` : 'Select an answer, then check your reasoning.'}</span><button class="solution-trigger" type="button" aria-expanded="false">Solution <span aria-hidden="true">↗</span></button></footer></article>`;
  const card = questionArea.firstElementChild;
  typesetMath(card);
  card.querySelectorAll('img').forEach(image => image.addEventListener('load', () => fit(), { once: true }));
  card.onchange = event => { answers.set(answerKey(question), event.target.value); card.querySelector('.choice-status').textContent = `Answer ${event.target.value} selected. Ready to check?`; renderNavigation(); fit(); };
  card.querySelector('.solution-trigger').onclick = () => transitionPanels(() => state.solutionOpen ? closeSolution(true) : openSolution());
  fit();
}

function renderExplanation(question) {
  const selected = answers.get(answerKey(question));
  explanation.innerHTML = `<div class="solution-panel"><div class="solution-inner"><div class="answer-block"><span class="eyebrow">Correct answer</span><strong>${question.answer}</strong><p class="feedback" aria-live="polite" ${selected ? '' : 'hidden'}>${selected ? selected === question.answer ? 'Your choice was correct.' : `You chose ${selected}. Compare it with the reasoning below.` : ''}</p></div><h3>Work it through</h3>${renderStimulus(question.solutionStimulus)}<ol>${question.solution.steps.map(step => `<li>${renderStep(step)}</li>`).join('')}</ol><div class="trap"><h3>Watch the reasoning</h3><p>${question.solution.warning}</p></div></div></div>`;
  typesetMath(explanation);
}

function openSolution() {
  const question = state.unit.questions[state.current];
  state.solutionOpen = true;
  viewed.add(answerKey(question));
  solutionShell.hidden = false;
  drawer.dataset.revealed = 'true';
  document.getElementById('solution-title').textContent = `Question ${String(state.current + 1).padStart(2, '0')}`;
  questionArea.querySelector('.solution-trigger').setAttribute('aria-expanded', 'true');
  questionArea.querySelector('.solution-trigger').innerHTML = 'Hide solution <span aria-hidden="true">↗</span>';
  setSolutionView('explanation');
  renderNavigation();
}

function closeSolution(focus = false) {
  state.solutionOpen = false;
  state.solutionView = 'explanation';
  solutionShell.hidden = true;
  drawer.dataset.revealed = 'false';
  app.classList.remove('calculator-mode');
  const trigger = questionArea.querySelector('.solution-trigger');
  if (trigger) { trigger.setAttribute('aria-expanded', 'false'); trigger.innerHTML = 'Solution <span aria-hidden="true">↗</span>'; if (focus) trigger.focus(); }
}

function setSolutionView(view) {
  if (view === 'calculator') setRoutePane(state.routePane, false);
  state.solutionView = view;
  const question = state.unit.questions[state.current];
  document.querySelectorAll('.solution-tab').forEach(button => {
    button.hidden = button.dataset.view === 'calculator' && question.calculator?.status === 'deferred';
    const selected = button.dataset.view === view;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  explanation.hidden = view !== 'explanation';
  calculatorView.hidden = view !== 'calculator';
  app.classList.toggle('calculator-mode', view === 'calculator' && Boolean(question.calculator?.needed || question.calculator?.distribution));
  if (view === 'explanation') renderExplanation(question);
  else mountCalculator(calculatorView, question, () => transitionPanels(() => setSolutionView('explanation')));
  fit();
}

function showQuestion(index, updateHash = true) {
  if (!state.unit || index < 0 || index >= state.unit.questions.length) return;
  closeSolution();
  state.current = index;
  app.classList.add('practice-started');
  welcome.hidden = true;
  const question = state.unit.questions[index];
  const lesson = state.unit.lessons.find(item => item.id === question.lesson);
  document.getElementById('breadcrumb').textContent = `${state.course.title} / ${state.unit.title} / Lesson ${question.lesson}`;
  document.getElementById('section-title').textContent = lesson.title;
  document.getElementById('page-position').textContent = `Question ${index + 1} of ${state.unit.questions.length}`;
  previous.disabled = index === 0;
  next.disabled = index === state.unit.questions.length - 1;
  document.getElementById('next-label').textContent = !next.disabled && state.unit.questions[index + 1].lesson !== question.lesson ? 'Next lesson' : 'Next';
  // At phone width the route pane overlays the question, so close it once a
  // question is chosen. The rail tabs stay visible to reopen it.
  if (state.routeExpanded && matchMedia('(max-width: 760px)').matches) {
    state.routeExpanded = false;
    app.classList.add('nav-collapsed');
  }
  renderQuestion(question);
  renderNavigation();
  if (updateHash) routeHash();
}

function fit(immediate = false) {
  const card = questionArea.querySelector('.card');
  if (!card) return;
  const measure = () => {
    if (!card.isConnected) return;
    const content = card.querySelector('.question-content');
    const inner = card.querySelector('.question-inner');
    const room = content.clientHeight - parseFloat(getComputedStyle(content).paddingTop) - parseFloat(getComputedStyle(content).paddingBottom);
    if (room <= 0) return;
    fitQuestion(card, room);
    content.classList.toggle('needs-scroll', inner.scrollHeight > room);
    workspace.style.setProperty('--reading-font', getComputedStyle(inner).fontSize);
  };
  if (immediate) measure();
  else requestAnimationFrame(measure);
}

async function restoreRoute() {
  const params = new URLSearchParams(location.hash.slice(1));
  const course = state.catalog.courses.find(item => item.id === params.get('course'));
  if (!course) { setWelcome(); renderNavigation(); return; }
  await selectCourse(course, false);
  const unitMeta = state.courseManifest.units.find(item => item.id === params.get('unit'));
  if (!unitMeta) return;
  await selectUnit(unitMeta, false);
  const questionIndex = state.unit.questions.findIndex(item => item.id === params.get('question'));
  if (questionIndex >= 0) showQuestion(questionIndex, false);
}

document.getElementById('close-drawer').onclick = () => transitionPanels(() => closeSolution(true));
document.querySelectorAll('.solution-tab').forEach(button => button.onclick = () => transitionPanels(() => setSolutionView(button.dataset.view)));
previous.onclick = () => showQuestion(state.current - 1);
next.onclick = () => showQuestion(state.current + 1);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && state.solutionOpen) { event.preventDefault(); transitionPanels(() => closeSolution(true)); return; }
  if (!app.classList.contains('practice-started') || event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input,textarea,select,[contenteditable],#calculator-view,.solution-tabs,.route-rail')) return;
  if (event.key === 'ArrowRight' && !next.disabled) { event.preventDefault(); showQuestion(state.current + 1); }
  if (event.key === 'ArrowLeft' && !previous.disabled) { event.preventDefault(); showQuestion(state.current - 1); }
});
window.addEventListener('resize', () => fit());
window.addEventListener('hashchange', restoreRoute);

// Start alongside catalog/route loading, including direct links to a question.
// Image warming never gates the welcome screen or question navigation.
preloadLibraryImages().catch(() => {});

try {
  state.catalog = await fetchJson('content/catalog.json');
  await restoreRoute();
} catch (error) {
  routeContent.innerHTML = `<section class="route-pane"><h1>Could not load the library</h1><p>${escapeHtml(error.message)}</p></section>`;
  console.error(error);
}
