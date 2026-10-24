// Structural and provenance validation. Runs first in `npm run check`.
import { access, readFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validChoice, choiceText } from '../src/app/choices.js';

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
const imageUses = new Map(); // svg file -> question keys that display it

for (const course of catalog.courses || []) {
  if (!course.id || !course.title || !course.manifest) fail('Every course needs id, title, and manifest.');
  const manifestPath = `src/${course.manifest}`;
  if (!await exists(manifestPath)) { fail(`${course.id}: missing ${manifestPath}.`); continue; }
  const manifest = await readJson(manifestPath);
  if (manifest.id !== course.id) fail(`${course.id}: course manifest id does not match catalog.`);

  const registryPath = `src/content/${course.id}/archetypes.json`;
  const registry = await exists(registryPath) ? await readJson(registryPath) : { archetypes: [] };
  if (!registry.archetypes.length) fail(`${course.id}: missing ${registryPath}.`);
  const registered = new Map(registry.archetypes.map(entry => [entry.id, entry]));
  const used = new Map();

  for (const unitMeta of manifest.units || []) {
    const unitPath = `src/${unitMeta.source}`;
    if (!await exists(unitPath)) { fail(`${unitMeta.id}: missing ${unitPath}.`); continue; }
    const unit = await readJson(unitPath);
    const lessons = new Set((unit.lessons || []).map(lesson => lesson.id));
    const localIds = new Set();
    if (unit.id !== unitMeta.id) fail(`${unitMeta.id}: unit id does not match its manifest entry.`);
    if (unitMeta.lessonCount !== unit.lessons?.length) fail(`${unit.id}: lessonCount is stale.`);
    if (unitMeta.questionCount !== unit.questions?.length) fail(`${unit.id}: questionCount is stale.`);
    if (!/no recorded human sign-off|human sign-off recorded/.test(unit.reviewStatus || '')) fail(`${unit.id}: reviewStatus must state human sign-off status explicitly.`);

    for (const question of unit.questions || []) {
      questionTotal += 1;
      const key = `${unit.id}:${question.id}`;
      const label = `${unit.id}/${question.id || '(missing id)'}`;
      if (!question.id || localIds.has(question.id)) fail(`${label}: question id must be present and unique within the unit.`);
      localIds.add(question.id);
      if (globalQuestionIds.has(`${course.id}:${key}`)) fail(`${label}: duplicate global question id.`);
      globalQuestionIds.add(`${course.id}:${key}`);
      if (!lessons.has(question.lesson)) fail(`${label}: lesson ${question.lesson} is not declared by the unit.`);
      if (!question.archetype) fail(`${label}: archetype is required.`);
      else {
        if (!registered.has(question.archetype)) fail(`${label}: archetype ${question.archetype} is not registered in ${registryPath}.`);
        used.set(question.archetype, [...(used.get(question.archetype) || []), key]);
      }
      if (!question.scenario || !question.prompt) fail(`${label}: scenario and prompt are required.`);
      if (question.notationKey !== undefined && (typeof question.notationKey !== 'string' || !question.notationKey.trim())) fail(`${label}: notationKey must be a nonempty literal string.`);
      if (!Array.isArray(question.choices) || question.choices.length !== 4) fail(`${label}: exactly four choices are required.`);
      else {
        if (!question.choices.every(validChoice)) fail(`${label}: each choice must be text or a valid structured stem-and-leaf plot.`);
        else if (new Set(question.choices.map(choiceText)).size !== 4) fail(`${label}: choices must be distinct.`);
      }
      if (!['A', 'B', 'C', 'D'].includes(question.answer)) fail(`${label}: answer must be A, B, C, or D.`);
      const steps = question.solution?.steps;
      if (!Array.isArray(steps) || !steps.length || !question.solution?.warning) fail(`${label}: solution steps and warning are required.`);
      for (const step of steps || []) {
        if (typeof step === 'string') { if (!step.trim()) fail(`${label}: empty solution step.`); }
        else if (step?.type !== 'math' || !['inline', 'display'].includes(step.mode) || !step.tex) fail(`${label}: a non-text step must be a math node {type, mode, tex}.`);
      }

      for (const slot of ['stimulus', 'solutionStimulus']) {
        const stimulus = question[slot];
        if (!stimulus) continue;
        if (!['image', 'table', 'html'].includes(stimulus.type)) fail(`${label}: ${slot} type ${stimulus.type} is not supported.`);
        if (stimulus.type === 'image') {
          const file = stimulus.src.replace(/^assets\//, '');
          if (!await exists(`src/assets/diagrams/${file}`)) { fail(`${label}: missing diagram ${file}.`); continue; }
          if (!stimulus.alt || stimulus.alt.length < 20) fail(`${label}: ${file} needs descriptive alt text.`);
          const head = (await readFile(resolve(root, 'src/assets/diagrams', file), 'utf8')).slice(0, 800);
          const size = head.match(/width="([\d.]+)pt" height="([\d.]+)pt"/);
          if (!size) fail(`${label}: ${file} was not produced by the diagram builder.`);
          else if (Math.abs(stimulus.height / stimulus.width - size[2] / size[1]) > 0.01) fail(`${label}: ${file} width/height do not match the SVG; rerun the content migration or update them.`);
          imageUses.set(file, [...(imageUses.get(file) || []), key]);
        }
        if (stimulus.type === 'table' && (!Array.isArray(stimulus.headers) || !stimulus.rows?.every(row => row.length === stimulus.headers.length))) fail(`${label}: table rows must match the header length.`);
      }

      if (question.calculator?.needed && !question.calculator.steps && !question.calculator.distribution) fail(`${label}: calculator is marked needed but has no guide.`);
      for (const followUp of question.calculator?.followUps || []) {
        if (!['distribution', 'arithmetic'].includes(followUp.type)) fail(`${label}: unsupported calculator follow-up type.`);
        if (followUp.type === 'distribution' && (!followUp.name || !Array.isArray(followUp.fields))) fail(`${label}: distribution follow-up needs a name and fields.`);
        if (followUp.type === 'arithmetic' && (!['add', 'multiply', 'divide', 'subtractProduct'].includes(followUp.operation) || !Array.isArray(followUp.values) || !followUp.entry)) fail(`${label}: arithmetic follow-up is incomplete.`);
      }

      const provenance = question.provenance;
      if (!provenance) fail(`${label}: provenance is required (use null for unknown fields).`);
      else {
        if (!provenance.migratedFrom && !provenance.original) fail(`${label}: provenance must record where the item came from (migratedFrom or original).`);
        const roles = provenance.optionRoles;
        if (roles !== null && roles !== undefined) {
          if (!Array.isArray(roles) || roles.length !== 4) fail(`${label}: optionRoles must list four roles or be null.`);
          else if (roles.filter(role => role === 'KEY').length !== 1 || roles['ABCD'.indexOf(question.answer)] !== 'KEY') fail(`${label}: optionRoles must mark exactly the keyed choice as KEY.`);
        }
        if (provenance.variant !== undefined && provenance.variant !== question.variant) fail(`${label}: provenance.variant disagrees with variant.`);
        if (provenance.original?.human_verified === true) fail(`${label}: human verification is claimed; record who and when in docs/PROVENANCE.md before setting it.`);
      }
    }
  }

  for (const entry of registry.archetypes) {
    if (!['card', 'local', 'review'].includes(entry.status)) fail(`${registryPath}: ${entry.id} has unknown status ${entry.status}.`);
    if (entry.status === 'card' && entry.card !== entry.id) fail(`${registryPath}: ${entry.id} is status card but card is ${entry.card}.`);
    if (entry.status !== 'card' && !entry.note) fail(`${registryPath}: ${entry.id} needs a note explaining its status.`);
    const actual = (used.get(entry.id) || []).sort();
    if (JSON.stringify(actual) !== JSON.stringify([...entry.questions].sort())) fail(`${registryPath}: ${entry.id} lists ${entry.questions.join(', ') || 'no questions'} but is used by ${actual.join(', ') || 'none'}.`);
  }

  // Generated figures: every spec renders a file a question uses, and every used file has a spec.
  const specPath = `src/diagrams/${course.id}.json`;
  if (await exists(specPath)) {
    const specs = (await readJson(specPath)).diagrams;
    const byFile = new Map(specs.map(spec => [spec.file, spec]));
    for (const spec of specs) {
      const shown = (imageUses.get(spec.file) || []).sort();
      if (JSON.stringify(shown) !== JSON.stringify([...spec.questions].sort())) fail(`${specPath}: ${spec.file} lists ${spec.questions.join(', ')} but is displayed by ${shown.join(', ') || 'no question'}.`);
    }
    for (const file of imageUses.keys()) if (!byFile.has(file)) fail(`${file} is displayed but has no entry in ${specPath}.`);
    for (const file of await readdir(resolve(root, 'src/assets/diagrams'))) if (file.endsWith('.svg') && !byFile.has(file)) fail(`src/assets/diagrams/${file} has no spec; delete it or add it to ${specPath}.`);
  }
}

const appFiles = (await readdir(resolve(root, 'src/app'))).filter(file => file.endsWith('.js'));
for (const file of appFiles) {
  const source = await readFile(resolve(root, 'src/app', file), 'utf8');
  if (source.includes('dist/')) fail(`src/app/${file}: source code must not depend on generated dist/.`);
}

// Publication guard: this repository is public. Personal machine paths and the
// private archetype library's folder names must not appear in tracked text.
let tracked = [];
try { tracked = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean); } catch { /* not a git checkout */ }
const privatePatterns = [/\/Users\/[a-z0-9._-]+\//i, /\/home\/[a-z0-9._-]+\//i, /C:\\Users\\/i];
for (const file of tracked) {
  if (/\.(png|jpg|gif|woff2?|ttf)$/i.test(file) || file.startsWith('dist/') || file.endsWith('.min.js')) continue;
  const text = await readFile(resolve(root, file), 'utf8').catch(() => '');
  for (const pattern of privatePatterns) if (pattern.test(text)) fail(`${file}: contains a personal machine path (${pattern}); use a ~/ relative description instead.`);
}

if (errors.length) {
  console.error(`Validation failed with ${errors.length} issue${errors.length === 1 ? '' : 's'}:\n- ${errors.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(`Validated ${catalog.courses.length} course, ${questionTotal} questions, ${imageUses.size} linked figures, and ${appFiles.length} application modules.`);
}
