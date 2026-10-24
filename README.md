# Practice Library

Original AP Statistics practice with worked solutions and Casio fx-CG50 walkthroughs. A static single-page application: courses, units, lessons, and questions are authored as JSON, and the browser loads the catalog first, then the selected course, then only the selected unit.

No accounts, no tracking, and no install step for students. Progress lasts for the current page visit.

## For contributors and coding agents

Start with [`AGENTS.md`](AGENTS.md). It holds the rules for everyone, including Claude and Codex. Then read [`HANDOFF.md`](HANDOFF.md) for the current state and [`CONTRIBUTING.md`](CONTRIBUTING.md) for the workflow.

## Commands

```sh
npm run check            # structure, provenance, answer keys, calculator walkthroughs, math
npm run build            # regenerate dist/ from src/
npm run diagrams         # re-render figures from src/diagrams/ (Python + pinned matplotlib)
npm run check:diagrams   # confirm committed figures match their specs
npm run preview          # serve dist/ at http://127.0.0.1:4173/
```

Node 20 or later. Figures also need `pip install -r scripts/diagrams/requirements.txt`.

## Project structure

- `src/content/catalog.json`: the list of courses
- `src/content/<course>/course.json`: a course's unit manifest
- `src/content/<course>/units/*.json`: independently loadable units
- `src/content/<course>/archetypes.json`: every archetype label and its link status
- `src/diagrams/<course>.json`: data for every generated figure
- `src/app/`: shared renderers for navigation, questions, stimuli, math, and the calculator
- `src/assets/`: generated figures and calculator artwork
- `src/schemas/`: JSON schemas for authored content
- `scripts/`: build, checks, figure renderer, and leak scan
- `docs/DECISIONS.md`: product and architecture decisions
- `docs/PROVENANCE.md`: where everything came from and how it was checked
- `.claude/skills/practice-library-question-author/`: the authoring method (plain Markdown; applies to every contributor)
- `dist/`: generated site output. Never edit it by hand.

## Hosting

The primary site is deployed from `dist/`. This repository also has an optional GitHub Pages workflow that builds a second copy from `src/`; see `docs/DECISIONS.md`.

## License

MIT for the project's own code and content. KaTeX and the Casio menu icons are third-party; see [`NOTICE.md`](NOTICE.md). AP is a trademark of the College Board, which is not affiliated with this project.
