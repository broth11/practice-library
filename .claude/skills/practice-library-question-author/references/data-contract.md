# Data contract

The repository is a static SPA with progressively loaded JSON:

1. `src/content/catalog.json` lists courses and their manifests.
2. A course manifest lists unit summaries and unit source paths.
3. Each unit file declares lessons and contains its questions.

Use `src/schemas/unit.schema.json` and `src/schemas/question.schema.json` as the portable contract. Existing fields include:

- unit: `schemaVersion`, `id`, `code`, `title`, `description`, `reviewStatus`, `lessons`, `questions`
- lesson: `id`, `title`, `intro`, `cedTopics`
- question: `id`, `lesson`, `archetype`, `variant`, `scenario`, `prompt`, `choices`, `answer`, optional `stimulus`/`solutionStimulus`, `solution`, `calculator`, `provenance`

Use structured stimulus types already supported by `src/app/stimulus.js`: tables, segmented displays, simulation histograms, Venn diagrams, trees, images, and carefully controlled authored HTML. Prefer structured data. Put diagram files in `src/assets/diagrams/` and reference them as `assets/<filename>`.

## Mathematical content

The existing string fields and automatic prose scanner are a legacy convenience for simple statistics notation. They are not the long-term contract for matrices, vectors, calculus, aligned equations, or any expression whose layout matters.

When adding advanced mathematics, extend the shared schema and renderer with explicit math nodes before authoring that content. The portable target is:

```json
{ "type": "math", "mode": "inline", "tex": "P(A \\mid B)" }
{ "type": "math", "mode": "display", "tex": "\\begin{aligned} f'(x)&=2x+3 \\\\ f''(x)&=2 \\end{aligned}" }
```

Render `inline` with KaTeX `displayMode: false` and `display` with `displayMode: true`. Update `src/schemas/`, the shared renderer, validation, and representative browser tests together. Do not add question-specific parsing branches or place `<br>` inside an inline math span. See `math-authoring.md` for notation and QA requirements.

To add a unit, create one unit JSON module and one course-manifest entry. To add a course, create its directory, manifest, unit modules, and one catalog entry. Do not add question-specific branches to `src/app/app.js`; extend a shared renderer or data descriptor instead.

Run `npm run check` and `npm run build`. `dist/` is generated and must never become the source used to revise questions.
