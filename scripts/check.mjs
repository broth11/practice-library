import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const readJson = async relative => JSON.parse(await readFile(resolve(root, relative), 'utf8'));
const exists = async relative => access(resolve(root, relative)).then(() => true, () => false);
const fail = message => errors.push(message);

const catalog = await readJson('src/content/catalog.json');
if (catalog.schemaVersion !== 1) fail('catalog.json must use schemaVersion 1.');
if (!Array.isArray(catalog.courses) || !catalog.courses.length) fail('catalog.json must contain courses.');

let questionTotal = 0;
const globalQuestionIds = new Set();
for (const course of catalog.courses || []) {
  if (!course.id || !course.title || !course.manifest) fail('Every course needs id, title, and manifest.');
  const manifestPath = `src/${course.manifest}`;
  if (!await exists(manifestPath)) { fail(`${course.id}: missing ${manifestPath}.`); continue; }
  const manifest = await readJson(manifestPath);
  if (manifest.id !== course.id) fail(`${course.id}: course manifest id does not match catalog.`);
  for (const unitMeta of manifest.units || []) {
    const unitPath = `src/${unitMeta.source}`;
    if (!await exists(unitPath)) { fail(`${unitMeta.id}: missing ${unitPath}.`); continue; }
    const unit = await readJson(unitPath);
    const lessons = new Set((unit.lessons || []).map(lesson => lesson.id));
    const localIds = new Set();
    if (unit.id !== unitMeta.id) fail(`${unitMeta.id}: unit id does not match its manifest entry.`);
    if (unitMeta.lessonCount !== unit.lessons?.length) fail(`${unit.id}: lessonCount is stale.`);
    if (unitMeta.questionCount !== unit.questions?.length) fail(`${unit.id}: questionCount is stale.`);
    for (const question of unit.questions || []) {
      questionTotal += 1;
      const label = `${unit.id}/${question.id || '(missing id)'}`;
      if (!question.id || localIds.has(question.id)) fail(`${label}: question id must be present and unique within the unit.`);
      localIds.add(question.id);
      const globalId = `${unit.id}:${question.id}`;
      if (globalQuestionIds.has(globalId)) fail(`${label}: duplicate global question id.`);
      globalQuestionIds.add(globalId);
      if (!lessons.has(question.lesson)) fail(`${label}: lesson ${question.lesson} is not declared by the unit.`);
      if (!question.archetype) fail(`${label}: archetype is required.`);
      if (!question.scenario || !question.prompt) fail(`${label}: scenario and prompt are required.`);
      if (!Array.isArray(question.choices) || question.choices.length !== 4) fail(`${label}: exactly four choices are required.`);
      if (!['A', 'B', 'C', 'D'].includes(question.answer)) fail(`${label}: answer must be A, B, C, or D.`);
      if (!Array.isArray(question.solution?.steps) || !question.solution.steps.length || !question.solution?.warning) fail(`${label}: solution steps and warning are required.`);
      if (question.stimulus?.type === 'image') {
        const image = question.stimulus.src.replace(/^assets\//, '');
        if (!await exists(`src/assets/diagrams/${image}`)) fail(`${label}: missing diagram ${image}.`);
      }
      if (question.calculator?.needed && !question.calculator.steps && !question.calculator.distribution) fail(`${label}: calculator is marked needed but has no guide.`);
      for (const followUp of question.calculator?.followUps || []) {
        if (!['distribution', 'arithmetic'].includes(followUp.type)) fail(`${label}: unsupported calculator follow-up type.`);
        if (followUp.type === 'distribution' && (!followUp.name || !Array.isArray(followUp.fields))) fail(`${label}: distribution follow-up needs a name and fields.`);
        if (followUp.type === 'arithmetic' && (!['add', 'multiply', 'divide', 'subtractProduct'].includes(followUp.operation) || !Array.isArray(followUp.values) || !followUp.entry)) fail(`${label}: arithmetic follow-up is incomplete.`);
      }
    }
  }
}

const appFiles = (await readdir(resolve(root, 'src/app'))).filter(file => file.endsWith('.js'));
for (const file of appFiles) {
  const source = await readFile(resolve(root, 'src/app', file), 'utf8');
  if (source.includes('dist/')) fail(`src/app/${file}: source code must not depend on generated dist/.`);
}

if (errors.length) {
  console.error(`Validation failed with ${errors.length} issue${errors.length === 1 ? '' : 's'}:\n- ${errors.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(`Validated ${catalog.courses.length} course, ${questionTotal} questions, and ${appFiles.length} application modules.`);
}
