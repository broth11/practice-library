# Contributing

Contributions are welcome, from people and from coding agents. Every contributor follows `AGENTS.md`.

## Setup

- Node 20 or later. No `npm install` is needed; the app and checks have no dependencies.
- Python 3.10 or later, only if you change figures: `pip install -r scripts/diagrams/requirements.txt`.

## Before you open a pull request

```sh
npm run diagrams         # only if src/diagrams/ changed
npm run check
npm run build
```

Commit the rebuilt `dist/` and any re-rendered SVGs with your change. CI runs the same commands and fails if either is stale.

## What a content change needs

- A question that follows `.claude/skills/practice-library-question-author/` (the method applies to every contributor, not just Claude).
- Its archetype registered in `src/content/<course>/archetypes.json`.
- An independent answer target in `scripts/check-answers.mjs` when its key is numeric.
- Honest `provenance`, with unknown fields left `null`.
- No claim of human or physical-calculator verification unless it is recorded in `docs/PROVENANCE.md`.

## Keeping AP text out

This repository is public. AP Classroom scoring-guide text and the private archetype library must never be committed.

If you wrote content with the private library open, run the leak scan on a machine that has it before pushing:

```sh
python3 scripts/leak-scan.py "~/Documents/Courses/AP Statistics/AP Question Archetypes" --history
```

It fails on any run of 12 or more words shared with an AP item. Shorter runs are usually stock ask frames, which style rule S16 allows.

## Branches

Use `<who>/<topic>`, for example `claude/unit-2c`, `codex/math-nodes`, or `ben/typo-fixes`. Open a pull request into `main`; `main` is protected and requires the validate workflow to pass.
