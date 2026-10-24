# Data contract

The repository is a static SPA with progressively loaded JSON:

1. `src/content/catalog.json` lists courses and their manifests.
2. A course manifest lists unit summaries and unit source paths.
3. Each unit file declares lessons and contains its questions.

Use `src/schemas/unit.schema.json` and `src/schemas/question.schema.json` as the portable contract. Existing fields include:

- unit: `schemaVersion`, `id`, `code`, `title`, `description`, `reviewStatus`, `lessons`, `questions`
- lesson: `id`, `title`, `intro`, `cedTopics`
- question: `id`, `lesson`, `archetype`, `variant`, `scenario`, `prompt`, `choices`, `answer`, optional `stimulus`/`solutionStimulus`, `solution`, `calculator`, `provenance`

Stimulus types supported by `src/app/stimulus.js`:

- `table`: `caption`, `headers`, `rows`. Write numbers that need trailing zeros (`"0.70"`) as strings; numeric cells are formatted with thousands separators.
- `image`: a generated figure. `src` (`assets/<file>.svg`), `alt`, optional `caption`, and `width`/`height` (kept in sync by `npm run diagrams`). Its data lives in `src/diagrams/<course>.json`; see `figures.md`.
- `html`: allowed but discouraged. No current question uses it.

Each archetype label must appear in `src/content/<course>/archetypes.json`. Provenance fields are defined in `src/schemas/question.schema.json`; `migratedFrom` or `original` records each item's origin.

## Mathematical content

The existing string fields and automatic prose scanner are a legacy convenience for simple statistics notation. They are not the long-term contract for matrices, vectors, calculus, aligned equations, or any expression whose layout matters.

Explicit math nodes are implemented for solution steps: a step may be a string or a math node, rendered by `renderStep()` in `src/app/math.js` and validated by `scripts/check-math.mjs`. Scenario, prompt, choice, and warning fields are still strings read by the legacy detector. Before authoring advanced mathematics in those fields, extend the schema and renderer to accept math nodes there too. The node format is:

```json
{ "type": "math", "mode": "inline", "tex": "P(A \\mid B)" }
{ "type": "math", "mode": "display", "tex": "\\begin{aligned} f'(x)&=2x+3 \\\\ f''(x)&=2 \\end{aligned}" }
```

Render `inline` with KaTeX `displayMode: false` and `display` with `displayMode: true`. Update `src/schemas/`, the shared renderer, validation, and representative browser tests together. Do not add question-specific parsing branches or place `<br>` inside an inline math span. See `math-authoring.md` for notation and QA requirements.

To add a unit, create one unit JSON module and one course-manifest entry. To add a course, create its directory, manifest, unit modules, and one catalog entry. Do not add question-specific branches to `src/app/app.js`; extend a shared renderer or data descriptor instead.

Run `npm run check` and `npm run build`. `dist/` is generated and must never become the source used to revise questions.
