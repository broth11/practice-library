# Provenance ledger

This file records where every part of the Practice Library came from, what was done to it, and how it was checked. It exists so that an audit can be repeated from the repository alone, without anyone's chat history.

Verification words are used exactly:

- **Tool verified**: a script in `scripts/` checks it, and `npm run check` runs that script.
- **Inspected**: a person or agent opened the primary file and compared it. The date and method are recorded here.
- **Reported**: someone stated it and it has not been independently inspected.
- **Human sign-off** and **physical fx-CG50 verification** are separate from all of the above. Neither has been recorded for any question in this repository.

Paths outside the repository are written relative to the author's home folder (`~/`). They are private and are not published.

## 1. External authority

These are the primary sources. None is stored in this repository.

| Source | Role | Location |
|---|---|---|
| AP Classroom scoring-guide PDFs | Authority for every archetype, exemplar, and key | `~/Documents/Courses/AP Statistics/AP Classroom Questions/Scoring Guides by CED PDF/` (private, College Board material) |
| AP Statistics CED, effective Fall 2026 | Topic, learning objective, and essential knowledge alignment | `~/Documents/Courses/AP Statistics/ap-statistics-course-and-exam-description-effective-fall-2026.pdf` (private) |
| Casio fx-CG50 behavior | Authority for keypress routes and screens | The physical calculator. Not yet used to verify any walkthrough here. |

The PDF and CED locations are as documented in the archetype library's `HANDOFF.md`. They were not opened during the 2026-10-24 audit; the audit checked the library's transcriptions instead.

## 2. Local instructional interpretation

Derived from the external sources by the author's own projects. Private because they contain verbatim AP text.

| Source | What it holds | Location |
|---|---|---|
| AP Question Archetypes library | `sources/SG_*.json` verbatim transcriptions, `cards/` archetype cards with exemplars and distractor builds, `topic_profiles/`, `style_guide.json` (rules S1 to S24), `registry.md`, blind-test `pilot/` | `~/Documents/Courses/AP Statistics/AP Question Archetypes/` |
| fx-CG50 Skill Finder master copy | Keypress cards (`app/data/cards.json`), step renderer (`app/src/page.html`), menu icons (`app/icons/`), teacher-check ticks (`SEED_VERIFY` in `page.html`) | `~/Documents/RIS Secondary Math Content/03-diagram-library/_casio_guide/` |

The repository carries a public paraphrase of the style rules in `.claude/skills/practice-library-question-author/references/ap-style.md` and the archetype labels in `src/content/ap-statistics/archetypes.json`. Neither contains AP text.

## 3. Project implementation history

| Record | What it is | Location |
|---|---|---|
| Git history `7664343` to current | All Practice Library commits. `7664343` is the original Unit 2.A site snapshot. Commits through `8077d4a` carry the message "Update Site source". | This repository |
| Commit `9abb4fc9c9106c9b821b7f59bfe113d2f21b1a23` | Contains the legacy `dist/unit2b.js` (the Unit 2.B source before JSON migration) and `dist/distribution-calculator.js` | This repository |
| Unit 2.A trial package | Editable source for Unit 2.A: `questions.json`, `expand_questions.py`, `calculator_data.py`, `stimulus_html.py`, `verify_questions.py`, `verification.json`, `novelty-review.json`, `expansion-verification.json`, browser and layout records | `~/.codex/.chatgpt-projects/<project-id>/outputs/ap-statistics-unit-2a-trial/` (private; inside a ChatGPT project mirror whose synced files may be replaced) |
| Prior development sessions | Decisions on layout, navigation, calculator restoration, `Save Res: None`, the ±1×10⁹⁹ bound, and the 648:1348 body proportion | Session records held by the author outside this repository. Summarized in `docs/DECISIONS.md`. **Reported**, not inspected. |

### History rewrite (2026-10-24)

Before the repository was made public, its history was rewritten with `git filter-repo` to replace a machine-specific author email with the author's GitHub noreply address and to change two absolute home paths in early versions of `source-map.md` into `~/` paths. No other content changed: the legacy `dist/unit2b.js` at `9abb4fc` is byte-identical to the original at `183e715`. Session records and audits made before that date cite the old hashes. The original history is kept, unpublished, in the author's local checkout under `refs/archive/pre-rewrite/`.

| Old | New | Commit |
|---|---|---|
| `c0cc7be` | `7664343` | Original Unit 2.A site snapshot |
| `052954b` | `7131972` | Update Site source |
| `68b6d3e` | `86376c1` | Update Site source |
| `dad21ef` | `8e63552` | Update Site source |
| `921b774` | `395fed9` | Update Site source |
| `f1c7242` | `b938e9b` | Update Site source |
| `d633b98` | `56aa4e7` | Update Site source |
| `469c349` | `82d27eb` | Update Site source |
| `183e715` | `9abb4fc` | Update Site source (contains `dist/unit2b.js` and `dist/distribution-calculator.js`) |
| `865fb33` | `04c07b7` | Update Site source |
| `e42566c` | `8077d4a` | Update Site source (last commit before the public-release work) |
| `bfb7ff0` | `1175b38` | Generate figures from data in AP style; add display math; restore provenance |
| `3e81f4e` | `ed96644` | Replace stale checks with independent answer, calculator, and math checks |
| `5b6dfc4` | `8fe8b68` | Prepare for public release |
| `200dcbd` | `c63b309` | leak-scan: strip only HTML tags |

## 4. Question ledger

| Items | Text came from | How the migration was checked | Pedagogical provenance | Confidence |
|---|---|---|---|---|
| 2.A q01 to q25 | Trial `questions.json`, authored earlier with `build_page_v1.py` | **Inspected** 2026-10-24: all 50 2.A items identical to the trial in scenario, prompt, choices, key, solution, stimulus, archetype, variant, and roles | Archetype, variant, and option roles were recorded at authoring time. No exemplar or CED record (`provenance.original` is `null`). | High for migration; medium for authoring method |
| 2.A q26 to q50 | Generated by `expand_questions.py` from built cards, `style_guide.json`, and topic profiles 2.1 to 2.7 | Same inspection | `provenance.original` lists exemplar ids. **Inspected**: all 38 resolve to real transcribed items, none quarantined; every distractor role is an observed build on its variant. | High |
| 2.B b01 to b50 | Legacy `dist/unit2b.js` at commit `9abb4fc` | **Inspected** 2026-10-24: 50 of 50 identical in scenario, prompt, choices, key, steps, warning, and archetype. The legacy file had no variant or role fields, so their `null` values are faithful. | Upstream sources, distractor rationale, and variant lineage are not recorded. 6 archetype labels have no card; 1 needs review (see `archetypes.json`). | High for migration; low to medium for pedagogy |
| 1.A a01 to a60 and 1.B c01 to c50 | Fresh original items authored by Codex on 2026-10-24, not migrated | 24 numeric targets independently recomputed by `scripts/check-unit-one.mjs`, which runs from `npm run check`. All 110 items received AI review of the key, alternatives, and explanation. No human sign-off. | Private built cards' answer logic, variants, builds, measured lengths, and CED topic profiles 1.1 to 1.13 were consulted. Each linked item records variant exemplar ids only, option roles, and extensions. Exact tasks absent from the available cards use documented `local` archetypes. | Tool verified for the recorded numeric targets and figure invariants; AI reviewed for conceptual logic |

Each question's `provenance.migratedFrom` names its source record.

Fresh Unit 1 items use `provenance.original` instead. The Skew the Script Unit 1 handout headings and the 1.B.2 post-activity notes were inspected only to map the six 1.A and five 1.B lesson titles and topic boundaries. These files are in the author's private `~/Documents/Courses/AP Statistics/STS/Unit 1/` folder. No STS question text, images, or data were copied. See `docs/UNIT-1-REVIEW.md` for coverage and review limits.

On 2026-10-24, a27's existing semicolon-separated choices were converted to structured stem-and-leaf rows without changing their values, leaf order, missing leaves, or keyed letter. `scripts/check-choices.mjs` independently reconstructs the correct plot from the eight raw measurements and confirms that exactly one displayed choice matches it. It also checks that all four choices render as three rows and have descriptive screen-reader labels. This check runs in `npm run check`.

## 5. Figure ledger

| Figures | Source | Method |
|---|---|---|
| All 44 question figures (`src/assets/diagrams/*.svg`) | `src/diagrams/ap-statistics.json` | Rendered by `scripts/diagrams/build_diagrams.py` with pinned matplotlib in AP print style (S14). **Tool verified**: `npm run check:diagrams` confirms every SVG is byte-reproducible; `npm run check` confirms every figure links to its questions both ways. |
| 2.B figure values | Transcribed on 2026-10-24 from the retired `scripts/build-diagrams.mjs` | Percentile cutoffs (b35 to b39) are now computed from the stated percentiles instead of hand-typed decimals. |
| 2.A figure values (q04, q15, q20, q30, q33) | The stimulus data and the hard-coded SVG in the earlier `src/app/stimulus.js`, which came from trial `stimulus_html.py` | Moved into the spec on 2026-10-24. q33's counts also feed the answer check, so a changed figure fails `npm run check`. |
| 1.A figures (13, a17 through a59) | Fresh synthetic category counts, dotplot values, histogram bins, and boxplot summaries authored with the new items | Data is in `src/diagrams/ap-statistics.json`. Four reusable chart kinds were added to the existing AP print-style renderer. `npm run check:diagrams` checks reproducibility; numeric checks consume displayed values where applicable. |

## 6. Calculator ledger

| Element | Origin | Status |
|---|---|---|
| Menu routes and field order for Binomial PD/CD, Normal CD, Inverse Normal | Skill Finder cards `binomial-probability`, `normal-probability`, `inverse-normal` | **Inspected** 2026-10-24 and **tool verified** by `scripts/check-calculator.mjs` |
| Whole expression plus EXE as one step | Ben's later instruction, superseding the Skill Finder's older per-key guidance (trial README) | Project convention |
| `Select Save Res: None` step | Practice Library calculator restoration (session records) | Project convention, **not** in the Skill Finder cards; awaiting physical verification |
| ±1×10⁹⁹ for an unbounded normal tail | Practice Library calculator restoration (session records) | Project convention, **not** in the Skill Finder cards; awaiting physical verification |
| 648:1348 calculator body proportion | Explicit design requirement from a prior session | External measurement source not recorded |
| 384:216 screen proportion | Skill Finder LCD styling (`page.html`) | **Inspected** |
| Menu icons (12 PNGs) | Skill Finder `app/icons/` | **Inspected**: byte-identical by SHA-256. Casio artwork; see `NOTICE.md`. |
| Displayed arithmetic results | Computed from each typed entry | **Tool verified**: 58 screens, exact rational arithmetic |
| Distribution results | Computed by the app's `prepareGuide()` | **Tool verified** against an independent implementation for all 14 walkthroughs |

## 7. Verification ledger

| Kind | Coverage | Record |
|---|---|---|
| Tool | 85 answer keys recomputed independently (24 in Unit 1, 31 in 2.A, 30 in 2.B); 58 arithmetic screens; 14 distribution walkthroughs; 11 math nodes and every detected math fragment parsed by KaTeX; 44 figures reproducible | `npm run check`, `npm run check:diagrams` |
| AI review | The remaining 2.A keys were checked by AI reasoning with supporting assertions in the trial's `verify_questions.py` (q03 to q07, q13, q21, q24 to q26, q29 to q31, q34, q35, q39, q40, q46, q47). Those assertions are not yet ported to this repository. | Trial `verification.json` |
| Human sign-off | None recorded | |
| Physical fx-CG50 | None recorded for these walkthroughs | |
| Skill Finder teacher tick | `normal-probability`, Way 1 (Statistics, DIST), all six steps, 2026-10-20. Covers that Skill Finder card only, not these questions. The record does not say whether a physical calculator was used. | `SEED_VERIFY` in the Skill Finder's `page.html` |
| Unit 1 calculator support | All 110 items have `status: deferred`, with no keypress guide or calculator screenshot, by Ben's explicit instruction on 2026-10-24 | Checked by `scripts/check-calculator.mjs` and `scripts/check-unit-one.mjs` |

To record a sign-off, add a row here with who, when, what was checked, and how. Then update the unit's `reviewStatus`.

## 8. Fields intentionally left `null`

- 2.B, all 50: `variant`, `optionRoles`, `keyBuild`, `sourceReview`, `original`.
- 2.A q01 to q25: `original` and `sourceReview`.
- `keyBuild` everywhere except 2.A q29 (D6) and q34 (D5).

They stay `null` until primary authoring evidence supports a value.

## 9. Open questions for the author

- **b42** is labelled `statistic_from_description`, whose answer logic (matching the standard deviation or median to its description) does not decide a parameter-versus-statistic item. Nearest card: `normal_distribution_parameter_notation`.
- **b49** matches `simulated_p_value_decision` in answer logic, but it counts simulated means at or above an observed mean that is below the claim. The key stands either way; the tail direction is worth a look before relinking.
- Six 2.B labels are local, with no card: `valid_probability_distribution`, `normal_distribution_shape`, `sampling_distribution_definition`, `sampling_distribution_shape`, `simulation_based_claim_evaluation`, `sampling_distribution_exact_small_population`.
- The physical-calculator check of the `Save Res: None` step and the ±1×10⁹⁹ entry.

## Unit 2.A expansion (2026-10-26)

Original items q51–q100 were authored from the existing private card answer logic and CED profiles 2.1–2.7. The SG_2.6 Markdown transcription was inspected to check conditional and path reasoning. No source prose, original images, or private card files were copied. Variant extensions and source exemplar ids only are recorded per question; option build codes remain null rather than overclaiming source lineage. The 33 numeric answers are recomputed by `scripts/check-unit-two-a.mjs`, which is imported by the standard checks. New figures have synthetic data in the shared diagram spec. Calculator guidance is explicitly deferred for all fifty additions. See `docs/UNIT-2A-EXPANSION-REVIEW.md` for coverage, display counts, browser inspection, and verification limits.

### Accuracy follow-up (2026-10-26)

The full 100-item 2.A set was reviewed again for keyed answers, reference populations, path probabilities, complements, overlap, rounding, and consistency of worked explanations. No numeric key correction was needed. All 36 conceptual keys now have explicit checks in `scripts/check-unit-two-a-concepts.mjs`, complementing the 64 recomputed numeric keys. `npm run check:working` additionally verifies 131 parseable numeric equations across 73 explanations; symbolic and conceptual working was AI reviewed. q96’s fourth distractor is now an explicitly false equality; its key remains A. This is tool and AI review, with no human sign-off.
