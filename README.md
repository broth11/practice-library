# Practice Library

Practice Library is a static single-page application whose courses, units, lessons, and questions are authored as modular JSON. The browser first loads the small catalog, then the selected course manifest, then only the selected unit.

## Project structure

- `src/content/catalog.json` — list of courses
- `src/content/<course>/course.json` — unit manifest for a course
- `src/content/<course>/units/*.json` — independently loadable unit modules
- `src/app/` — reusable navigation, question, stimulus, math, and calculator renderers
- `src/assets/` — diagrams and calculator artwork
- `src/schemas/` — portable JSON schemas for authored content
- `.claude/skills/practice-library-question-author/` — the complete Claude authoring method
- `dist/` — generated static site deployed by Sites

## Commands

```sh
npm run check
npm run build
npm run preview
npm run export:github -- releases/practice-library.tar.gz
```

No install step or framework is required. Node 20+ is used only for validation, building, previewing, and export. The deployed site remains a static SPA and can be hosted by Sites, GitHub Pages, or any static host.

## Add content

1. Add a unit JSON file under the appropriate course's `units/` directory.
2. Add its metadata and source path to the course manifest.
3. Run `npm run check` and `npm run build`.

For a new course, add its manifest and units, then register the course in `src/content/catalog.json`. Follow the bundled Claude skill for question-authoring and review rules.

For nontrivial notation, the bundled skill distinguishes explicit inline TeX from display TeX. Matrices, vectors, calculus, aligned working, and multi-line fractions must use the shared KaTeX contract rather than the legacy prose auto-detector.
