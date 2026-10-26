# Unit 2.B expansion review

Authored on 2026-10-26. Each of the five lessons now contains twenty questions, for 100 total. The fifty existing questions b01 to b50, including their calculator guides, are unchanged. Fresh questions b51 to b100 include only question content, stimuli, and worked explanations. Calculator guidance is explicitly deferred.

## Coverage decisions

Balance follows instructional coverage, rather than equal counts for unrelated archetypes. Calculating a normal probability and identifying a population do not need equal weight in these lessons.

| Lesson | Gaps in the original ten | Added reasoning and representations |
|---|---|---|
| 2.B.1 | Four expected-value items, but only one variance/SD calculation and one cumulative-table item; validity only tested a missing probability | Negative-probability validity, strict-tail reading, differencing a cumulative table, variance, spread comparison, linear profit, total expectation, SD, noninteger expected values, and constructing a distribution by enumeration. Three new discrete plots and four tables. |
| 2.B.2 | Basic one-sided calculations dominated; no reverse parameter recovery or simulation estimate | A bounded interval, a complement, recovering p from mean/variance, recovering n from the mean, a strict upper tail, a stopping-rule failure, SD, simulation frequencies, modal counts, and constructing an exact-probability expression. Two new binomial plots and one simulation table. |
| 2.B.3 | Five empirical-rule items but only one standardization item; little model-limitation reasoning | Endpoint equivalence for a continuous variable, an off-center empirical-rule slice, both extreme tails, comparing standardized positions, separating location from spread, reversing a z-score, rejecting an unjustified normal percentile, recovering both parameters, unbounded tails, and recovering SD. One normal plot and two parameter tables. |
| 2.B.4 | Many canonical shaded curves; no whole-number threshold decision or two-percentile parameter recovery | An interval on one side of the mean, symmetric rejection tails, upper-15% cutoff, SD from quartiles, mean from an upper percentile, middle 90%, expected counts, ceiling a qualification cutoff, symbolic tail composition, and identifying a standardized area. Three new curves; the remaining additions use prose or expressions to avoid redundant diagrams. |
| 2.B.5 | Definitions and CLT statements dominated; only one plotted simulation probability and no randomization distinction | Sampling medians, reading repeated dots, sample size versus repetitions, directional simulation evidence, exact finite-population means, designing a simulation, exact versus simulated distributions, randomization by reassignment, repetition stability, and a lower-tail median probability. Two dotplots, one histogram, and two tables. |

Across the additions there are twelve generated figures, nine structured tables, and twenty-nine prose/expression items. The figures include three discrete probability plots, two binomial plots, four normal plots, two sampling dotplots, and a simulation histogram. Normal curves made up sixteen of the original twenty-six figure specifications; only four of the twelve additions are normal curves. Figures are grayscale and generated from synthetic data in the shared spec. No shared renderer or application layout changed.

The full unit has 28 A, 26 B, 24 C, and 22 D keys. Numeric choices retain ascending order. New local archetype labels are registered honestly; the existing b42 label remains marked for review rather than silently reclassified.

## Verification and limits

- `scripts/check-unit-two-b.mjs`, imported by the standard answer check, recomputes all 27 new scalar numeric keys from inputs, using an independent statistical implementation. It checks six compound numeric/comparison answers, additional distribution facts, model inputs, per-lesson counts, and all fifty calculator deferrals.
- All fifty new questions received AI review of their key, distractors, units, boundaries, and worked explanation. A draft variance error was corrected before publication. This is not human sign-off.
- The original fifty question objects were compared with the pre-expansion source and are unchanged.
- All 75 figures in the repository are reproducible with the pinned matplotlib renderer. The twelve new linked images have generated dimensions and descriptive alt text. Hidden normal cutoffs and means remain symbolic in their figures.
- Browser QA opened all fifty new questions and explanations at desktop width. Every item displayed four answer choices, loaded its figure where applicable, and had no KaTeX error or page-width overflow. Every addition showed only the Explanation tab.
- Representative table, discrete plot, binomial plot, standardized comparison, percentile, histogram, and dotplot questions were also checked at a narrow phone width. The observed content viewports were 1,107 pixels on desktop and 300 pixels on phone, after the browser's scaling. Longer cards use the existing internal scrolling behavior.
- Forward navigation was checked at 10 to 11 in all five lessons and at 20 to 1 across all four lesson boundaries. Source order is contiguous by lesson.
- The private-source leak scan passed with a longest shared run of eleven words, below its twelve-word failure threshold.
- No human sign-off or physical calculator verification is recorded. Existing b42 and b49 questions were preserved and remain documented review topics.

Publication scope is the selected Practice Library Sites artifact, using its existing public audience and native source workflow. This pass does not change the separate GitHub repository or Pages publication.

## GitHub synchronization follow-up

Ben subsequently requested pushing the completed expansion to GitHub main. The 2.B source changes were applied onto current GitHub history, preserving the newer 2.A calculator guidance. Validation, diagram reproducibility, the source leak scan, and the build were rerun for this combined source. The original Sites version 14 remains published.
