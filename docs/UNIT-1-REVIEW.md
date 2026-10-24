# Unit 1 authoring and review

Authored 2026-10-24 by Codex at Ben's request. Includes all question content and figures; fx-CG50 keypresses and calculator screenshots are explicitly deferred.

## Coverage

| Lesson | Items | Targets |
|---|---|---|
| 1.A.1 | a01 to a10 | Population, sample, unit, variable type, parameter, statistic, datum, investigative question |
| 1.A.2 | a11 to a20 | Categorical counts, shares, displays, comparisons, and missing relative frequency |
| 1.A.3 | a21 to a30 | Shape, dotplot counts, gaps, potential outliers, histogram intervals, and stemplots |
| 1.A.4 | a31 to a40 | Mean, median, standard deviation, percentile rank, weighted mean, and range |
| 1.A.5 | a41 to a50 | Quartiles, IQR, outlier fences, boxplots, resistance, and linear transformations |
| 1.A.6 | a51 to a60 | Distribution comparisons, standardized position, z-score calculation, and interpretation |
| 1.B.1 | c01 to c10 | Study types, investigative questions, generalization, and causal limits |
| 1.B.2 | c11 to c20 | SRS, stratified, cluster, systematic, and convenience sampling; design justification and allocation |
| 1.B.3 | c21 to c30 | Undercoverage, nonresponse, voluntary response, response bias, sample size, and direction of bias |
| 1.B.4 | c31 to c40 | Experiment components, treatment combinations, random assignment, replication, confounding, placebo, and blinding |
| 1.B.5 | c41 to c50 | Completely randomized, blocked, and paired designs; randomized order; selection versus assignment |

Each lesson has ten original questions, four choices per question, worked reasoning, and a misconception warning. Unit 1.A keys are balanced 15/15/15/15; Unit 1.B keys are balanced 13/12/13/12.

## Sources and originality

The private AP archetype library's operating rules, style guide, topic profiles, answer logic, variants, and distractor builds guided authoring. Exemplar identifiers are recorded without exporting AP prose. Skew the Script handout headings supply lesson boundaries only. All scenarios, numbers, category names, and figure data were newly authored.

The course registry documents local archetypes where the exact reasoning or option format is absent from the available AP cards. A local label is not a claim that a corresponding AP archetype card exists. Other departures from variant evidence are flagged in each item's `extensions`. Concise text below a card's observed word range is recorded in `lengthReview`; no item exceeds its permitted upper range.

## Verification and limits

- `scripts/check-unit-one.mjs` independently recomputes 24 numeric targets from inputs and, where applicable, the actual displayed table or figure. It also checks numerical choice order, unique matching keys, lesson coverage, key balance, calculator deferral, boxplot fence consistency, pie totals, and equal sample sizes in the paired histograms.
- The remaining conceptual keys and distractors received AI review against their recorded reasoning. This is not independent tool verification of every conceptual claim and is not human sign-off.
- All 13 new figures are generated from `src/diagrams/ap-statistics.json`. Reproducibility uses the project's pinned matplotlib version. No existing figure data was changed.
- Every new chart was checked for loading, four choices, descriptive alt text, and absence of page-level horizontal overflow at 390 by 844. Representative boxplot and mathematical explanations were visually inspected at desktop and phone widths.
- Calculator tabs are hidden for deferred items. There are no new keypress sequences, simulated calculator screens, or physical-device verification claims.

Before adding calculator support, work through the calculator guidance and record guide-level verification separately. Do not replace the current `deferred` status with a claim of physical verification without testing the device.
