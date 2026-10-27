# Unit 3 authoring review

The subsequent `READABLE-WORKING-REVIEW.md` supersedes the horizontal-scroll limitation below and records nine expression-choice conversions and fuller explanations.

27 October 2026. Exactly 130 original questions: 80 in 3.A and 50 in 3.B. The optional 3.A.0 opener is excluded; 3.A.6 Parts A and B share ten questions. The four pre-existing modules and their 420 questions are preserved.

## Coverage and calculator-pass inventory

| Lesson | Focus | Stable question IDs | Count |
| --- | --- | --- | --- |
| 3.A.1 | Sampling Distribution for a Proportion | u3a01 to u3a10 | 10 |
| 3.A.2 | Conditions for Sampling a Proportion | u3a11 to u3a20 | 10 |
| 3.A.3 | Intro to Confidence Intervals | u3a21 to u3a30 | 10 |
| 3.A.4 | Interval for a Proportion | u3a31 to u3a40 | 10 |
| 3.A.5 | Confidence & Margins of Error | u3a41 to u3a50 | 10 |
| 3.A.6 | Introduction to Hypothesis Tests | u3a51 to u3a60 | 10 |
| 3.A.7 | Hypothesis Test for One Proportion | u3a61 to u3a70 | 10 |
| 3.A.8 | Errors & Power | u3a71 to u3a80 | 10 |
| 3.B.1 | Sampling Distribution for Two Proportions | u3b01 to u3b10 | 10 |
| 3.B.2 | Interval for Two Proportions | u3b11 to u3b20 | 10 |
| 3.B.3 | Hypothesis Test for Two Proportions | u3b21 to u3b30 | 10 |
| 3.B.4 | Chi-Square Test for Homogeneity | u3b31 to u3b40 | 10 |
| 3.B.5 | Chi-Square Test for Independence | u3b41 to u3b50 | 10 |

Claude’s later calculator pass should edit only the calculator fields in `src/content/ap-statistics/units/3-a.json` (u3a01 to u3a80) and `src/content/ap-statistics/units/3-b.json` (u3b01 to u3b50), updating relevant checks and the review record when guidance is actually added. `scripts/unit-three-review.json` inventories every question’s reviewed answer, alternative reasoning, and independent numerical target. All 130 currently have exactly:

```json
{"needed":false,"status":"deferred","reason":"Deferred at Ben's request; Claude will add calculator guidance in a separate pass."}
```

No calculator guidance, routes, keypresses, distribution walkthroughs, or screenshots were authored. Deferred means unfinished support, not that a calculator is unnecessary. Existing Unit 2 guidance is preserved.

## Lesson boundaries and source exceptions

- 3.A.1 develops repeated-sample proportions with supplied/assumed model conditions. Explicit checks and unbiasedness start in 3.A.2.
- 3.A.3 uses interval geometry, interpretation, and an explicitly approximate two-SE interval. Full 95% construction is in 3.A.4; other confidence levels and minimum-n planning are in 3.A.5.
- 3.A.6 uses hypotheses, simulations, supplied p-values, and decisions. Standardized test statistics start in 3.A.7.
- 3.B.1 uses known population proportions. 3.B.2 uses separate observed proportions for interval SE. 3.B.3 uses the equality-null pooled estimate for tests, with no claim that pooled tests and unpooled Wald intervals are exact inverses.
- 3.B.4 uses homogeneity designs, assumed conditions, and supplied degrees of freedom. 3.B.5 introduces degrees-of-freedom calculation and full checks for both chi-square designs. Expected-count equality at five is avoided.

The completed private preparation audit, lesson map, profiles, cards, both semantic reviews, review resolutions, and pilot verification informed production. The 334-record source count includes duplicate filings. All new private cards remain pilot status. This production pass does not claim to re-audit all original worksheet calculations or to have inspected the missing 3.A.1 Part A.

Equivalent hypotheses in SG_3.14#21, narrower valid Type I cases, true/nonresponsive source options, and unresolved filler-number mechanisms were not reused. No source wording, data, figures, or private card contents are published. u3a07 checks strict integer cutoffs and exact binomial probabilities for both candidate sizes.

Every item records CED topics/learning objectives, the card or honest local label, variant where applicable, exemplar IDs supporting that reasoning family, and four option roles with specific local build evidence. T1/T2/T3 denote newly specified local recipes, not claims that identically numbered AP roles were observed. All such departures are flagged. Four local labels correctly distinguish sampling-distribution observations (u3a10), sampling-fraction independence (u3a13), central normal critical values (u3a41), and selected-population inference limits (u3b50). u3a53/u3a59 explicitly flag their tail-count/table variant departures. Word-length exceptions are recorded per question.

## Integration and verification

- Two independently loadable modules, thirteen lesson records, course-manifest entries, and registry links. Unit totals are 80 and 50, with ten per lesson in contiguous lesson order. Keys are balanced within one item across A/B/C/D in each unit.
- Six generated grayscale figures, including shared proportion-dotplot and chi-square-density support. Existing generated-diagram conventions are retained; no hand-edited SVGs. Chi-square tails are shaded without printing an answer probability. Near-overlapping cutoff ticks are suppressed.
- Substantial formulas use explicit display nodes. Multi-part work uses aligned lines. The shared math scanner now preserves hypothesis and indexed-proportion notation. Answer controls carry complete raw-text accessible names, retaining symbols that accessibility-label extraction could otherwise omit. KaTeX MathML remains present.
- `scripts/check-unit-three.mjs`, imported by the standard answer checker, independently recomputes 50 numerical/comparison/decision targets with JavaScript probability routines versus Python authoring arithmetic. Chi-square tail checks use numerical integration independent of the authored closed forms. It also checks exact deferrals, counts, ordering through the structural validator, all reviewed alternatives, key balance, figures, and inference notation. Other quantitative details, all 80 conceptual keys, and all 520 alternatives received a complete independent AI review against the lesson map and card logic.
- Review corrections include three distractor-method mismatches, a broad true-range distractor, four provenance-label mismatches, two simulation variant departures, and escaped TeX commands. No numerical keyed answer changed. The final source reflects these corrections.
- All 130 questions were opened with explanations at 1,440 × 900 and 390 × 844. No page-width or choice overflow, missing figures, or math-rendering errors were detected. After aligning longer work, 34 representative math/table/figure cases were checked again at phone width. Forty-eight button transitions passed: 22 across all eleven lesson boundaries and 26 within the thirteen lessons. Unit selection and module counts were checked in the interface.
- Required checks: `npm run check`, `npm run build`, all 102 reproducible generated diagrams, and the repository’s current-source/history private-source leak scan. The final release uses these checks, not cached screenshots or generated output as authoring source.

## Verification limits and publication

This is AI and tool verification, not human sign-off or physical-calculator verification. Dense questions and explanations can scroll vertically. Ten longer formulas retain horizontal scrolling inside their phone math panels; the page itself does not overflow. Small figure labels retain the established scaled-diagram presentation, supplemented by descriptive accessible text.

GitHub work uses `codex/unit-3-production` and the protected-main pull-request workflow. The Sites helper synchronizes the same application/content/build on the original Sites history and project, preserving the public audience. Neither Git history is replaced or force-pushed. Publication results are recorded by their native deployment/PR records; this review does not claim success before those records exist.
