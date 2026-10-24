# Original source map

`docs/PROVENANCE.md` is the full ledger. This page is the short version for authoring: where to look on the author's machine, in priority order. All paths are private, relative to the home folder, and absent from this public repository.

## Evidence hierarchy

1. **External authority**: AP Classroom scoring-guide PDFs, the Fall 2026 CED, and the physical fx-CG50. When they disagree with anything below, they win.
2. **Local interpretation** (layered, no single file is the specification):
   - Archetype library: `~/Documents/Courses/AP Statistics/AP Question Archetypes/`
     - `CLAUDE.md` (collapse rule, card fields) and `HANDOFF.md` (status, workflow, batch notes)
     - `style_guide.json` (rules S1 to S24; paraphrased publicly in `ap-style.md`)
     - `topic_profiles/<topic>.json` (CED content)
     - `cards/<archetype_id>.json` (built cards: `answer_logic`, `distractors`, `variants`, `exemplars` with `option_roles`). Read `cards/`, never edit it; edits go in `cards_src/`.
     - `sources/SG_<topic>.json` (verbatim transcriptions: evidence for exemplar ids)
   - fx-CG50 Skill Finder master: `~/Documents/RIS Secondary Math Content/03-diagram-library/_casio_guide/`
     - `app/data/cards.json` (routes; cards `binomial-probability`, `normal-probability`, `inverse-normal` back the distribution walkthroughs)
     - `app/src/page.html` (step renderer, LCD styling, `SEED_VERIFY` teacher ticks)
     - `app/icons/` (menu icon originals)
3. **Project history**:
   - This repository's Git history. Unit 2.B's pre-migration source is `dist/unit2b.js` at commit `9abb4fc`.
   - Unit 2.A trial package: `~/.codex/.chatgpt-projects/<project-id>/outputs/ap-statistics-unit-2a-trial/` (`questions.json`, `expand_questions.py`, `calculator_data.py`, `verify_questions.py`, `verification.json`).
   - Prior session decisions, summarized in `docs/DECISIONS.md`.

## In this repository

- Questions: `src/content/<course>/units/*.json`
- Archetype labels and their link status: `src/content/<course>/archetypes.json`
- Figure specs: `src/diagrams/<course>.json`, rendered by `scripts/diagrams/build_diagrams.py`
- Checks: `scripts/check*.mjs`

## Rules

- Do not infer provenance from `dist/`, the deployed site, or finished HTML.
- Unit 2.B has no recorded variant or option-role metadata. Those fields stay `null` until primary evidence supports them.
- Never copy text from `sources/` or `cards/` exemplars into this repository. Exemplar ids are fine.
