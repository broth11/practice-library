# Unit 1 expansion review

Authored 2026-10-27. Unit 1.A now has 120 questions across six lessons; Unit 1.B has 100 across five lessons. Every lesson contains twenty questions. Original ids a01 to a60 and c01 to c50, their wording, choices, keys, explanations, figures, and historical provenance are preserved. The original questions' calculator metadata was removed at Ben's request, and all additions are explanation-only.

## Coverage decisions

The audit compared the original ten questions in every lesson with the private archetype cards' reasoning, misconception maps, and CED topic objectives. Balance means covering missing reasoning and useful representations, rather than assigning equal counts to every card. Local extensions are registered honestly instead of forcing an inexact card match.

| Lesson | Underrepresented in the original ten | Added coverage |
|---|---|---|
| 1.A.1 | Statistical question criteria, reasons to sample, fixed quantities, measurement variation, numeric category codes, and recorded precision | Statistical versus nonstatistical questions, destructive testing, fixed collection size versus variables, repeated measurements, data-table observational units, categorical codes, quantitative amounts, selected versus responding samples, census parameters, and rounded continuous measurements |
| 1.A.2 | Graph validity and information limits; four original claims used tables, with only one bar and one pie chart | Relative-frequency construction, two new pie charts, two bar charts, zero baselines, overlapping response categories, unequal denominators, recovering a total, majority versus plurality, and category reordering |
| 1.A.3 | Exact-value versus grouped-data limits, median positions in bins, combining bins, and combined distributions | Three histograms/dotplots, two stem-and-leaf tables, locating a binned median, exact-statistic limits, right-tail interpretation, separated clusters, bin aggregation, threshold counting, value-preserving displays, combining separated groups, and cautious gap inference |
| 1.A.4 | Measures were mostly separate calculations, without squared-deviation construction, tied-percentile conventions, or equal-range spread comparisons | Squared-deviation expression, frequency-weighted mean, median after flooring, correction effects, percentile convention with ties, zero SD, comparative dotplots with equal ranges, a missing observation from the mean, and a histogram median |
| 1.A.5 | Transformations occupied three original questions; quartile shares and boxplot information limits had little direct coverage | Quartile interpretation, exact fence equality, five-number construction, negative scaling, adding a mean-valued observation, unknown boxplot means/gaps, resistant spread, outlier classification, and median/IQR transformation |
| 1.A.6 | Six original items involved standardization, with little exact-value comparison or caution about shape assumptions | Three actual dotplot/boxplot comparisons, matching histogram-bin limits, negative standardized positions, lower-is-better responses, z-scores without normality, unchanged z under positive scaling, equivalent standardized heights, and summary-statistic limits |
| 1.B.1 | Method labels and basic conclusions dominated; no visual selection-versus-assignment plan | An investigative question, census versus observational coverage, passive observation versus survey, imposed treatments, frame scope, observational association, volunteer experiments, a selection/assignment flow, self-selection explanations, and a changed investigative question |
| 1.B.2 | Six of ten questions primarily named or implemented sampling methods; no displayed selection mechanism | Equal individual probability versus SRS, stratified flow, intact-cluster diagram, random starts, periodicity, stratification precision, cluster travel/precision tradeoff, proportional allocation, and random labels without replacement |
| 1.B.3 | Bias names were well represented; repairs, method-level bias, and ordinary sampling error had less space | Mechanism-specific diagnosis, a neutral wording repair, bias direction, larger biased samples, alternative sampling plans, inaccurate responses, following up original nonrespondents, and sampling variability versus systematic bias |
| 1.B.4 | Mostly component/principle identification, without assignment implementation or nested units | Factorial treatment table, exact-size random assignment, room-level experimental units, repeated readings versus replication, placebo purpose, feasible assessor blinding, confounding repair, controlled conditions, self-selection flow, and chance imbalance after randomization |
| 1.B.5 | Basic design recognition and causal scope were present; little comparison of actual allocation actions | Within-block representation of all treatments, matched-pairs flow, randomized order, pairing justification, three-grade blocking, strata-versus-blocks comparison table, confounded crossover, volunteer blocked-experiment scope, paired differences, and a justified completely randomized plan |

The additions include 21 generated figures and 10 structured tables. Unit 1.A adds 16 figures: two categorical bar charts, two pie charts, three single histograms, two single dotplots, three comparative dotplots, three boxplot displays, and one pair of histograms. Unit 1.B adds four study-flow diagrams and one intact-cluster sampling diagram. Its displays describe selection and allocation rather than introducing unrelated quantitative graphs. Stem-and-leaf displays remain structured tables or the existing structured answer choices.

All new graphs use synthetic values, labelled scales, and the existing grayscale AP print style. Comparative dotplots use a shared scale; flow diagrams state where selection or assignment occurs; selected clusters contain all their observed units. The existing figure specs and assets are unchanged.

Unit 1.A keys are 30 A, 30 B, 30 C, and 30 D. Unit 1.B keys are 25 of each, with five of each in every lesson. Unit 1.A lesson frequencies are kept near five per letter while retaining original choices and ascending numeric option order. All question arrays follow lesson order, with stable deep links and twenty-question traversal.

## Explanation-only behavior

No Unit 1 question contains calculator metadata, calculator references, keypress steps, or screens. The shared renderer hides the calculator tab when the optional descriptor is absent and redirects an unsupported calculator-view request to the explanation. This is a completed content choice, not a deferral. Other units retain their existing guidance. The generic welcome note now invites a worked explanation without promising keypresses for every unit.

## Verification and limits

- The standard check recomputes 50 Unit 1 numeric or compound targets, including 26 added targets. Inputs come from the displayed tables, figure data, raw values, or transformations. Exactly one option must match each target. The checks also enforce twenty questions per lesson, key balance, figure invariants, ascending scalar options, and no Unit 1 calculator references.
- Every addition received AI review of the intended answer, distractors, explanation, reference group, units, endpoint conventions, and scope. Conceptual review is not an independent mathematical proof or human sign-off.
- All 96 repository diagrams are reproducible with the pinned matplotlib version. New stimuli have generated dimensions and descriptive alternative text. Existing SVGs were compared against the source baseline.
- Original question objects were compared with their pre-expansion versions after removing only calculator metadata; all other fields match. Unit 2 content is unchanged.
- Browser QA opened all 110 added questions and explanations at 1,440 by 900 and 390 by 844. All displayed four choices, loaded their images, had no page-width overflow or math-rendering error, and showed no calculator tab. Dense phone cards retain the established internal scrolling behavior. Representative flow, cluster, comparative-dotplot, pie, histogram, boxplot, and table layouts were visually inspected. The new flow/grid fonts were enlarged following the phone review.
- Thirty-one browser navigation checks passed: forward and backward at 10/11 in every lesson, plus forward at every 20/next-lesson boundary. No browser console errors or warnings were recorded.
- The current-source scan and historical scan passed against 56,919 source shingles, with a longest shared run of eleven words below the twelve-word failure threshold. No human sign-off is recorded.

## Publication scope

Update the selected Practice Library Sites project with its existing public audience. The separate GitHub repository and GitHub Pages publication are outside this request. Author locally on `codex/expand-unit-1a-1b`; the Sites workflow pushes to its separately configured source branch, as documented in the earlier Sites expansion handoff.

## GitHub synchronization follow-up

Ben subsequently requested pushing the completed expansion to GitHub main. The additions were applied onto the latest GitHub main without replacing its history or changing the original Sites publication. That explicit instruction authorizes the direct main push for this action. The same content and application passed the Sites browser review; standard checks, diagram reproducibility, source leak scanning, and the build are rerun in the GitHub checkout.
