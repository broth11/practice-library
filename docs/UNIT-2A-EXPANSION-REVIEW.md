# Unit 2.A expansion review

2026-10-26. Original q01–q50 preserved exactly; q51–q100 are original additions. Each of the five lessons now has twenty items. No human sign-off is recorded. Calculator guides on the fifty additions were added on 2026-10-26: 37 Run-Matrix arithmetic guides and 13 reasoning-only explanations (tool checked; no physical fx-CG50 verification). Existing guides remain as authored.

## Coverage decisions

| Lesson | Previously thin or absent | Additions |
|---|---|---|
| 2.A.1 | Simple conditional frequency variant, equal-rate comparison, count-to-proportion conversion, grouped bars, mosaic area | Conditional and marginal denominators, unequal-size comparisons, equal rates, grouped count/relative bars, and mosaic area/height |
| 2.A.2 | Complete sample space, single-event complement, varied empirical events | Full ordered space, cross-product counting, two-digit simulation design, exact/tail events, and long-run reasoning |
| 2.A.3 | Complement conditioning and graphical conditions | Venn/mosaic conditions, combined categories, reversed condition, and sufficient missing input |
| 2.A.4 | Reverse conditional variant absent, sequence comparison absent, one tree only | Two reverse conditionals, four new trees, at-least-one paths, matching colors, neither, and sequence reasoning |
| 2.A.5 | Unknown marginal under independence absent, no figures | Unknown marginal, two Venn diagrams, a mosaic, independence comparisons, overlap, and sufficient missing input |

No entirely new archetype label was needed. Gaps were primarily variants and representations of the existing card families. Each item records its variant, exemplar ids only, explicit extensions, and length exceptions. Distractor code lineage is not asserted; misconception explanations are given per item.

## Display balance

| Stimulus | Before | After |
|---|---:|---:|
| table | 13 | 21 |
| image | 5 | 24 |
| prose | 32 | 55 |

The nineteen new figures comprise three grouped bar charts (one count, two relative), four mosaics, two simulation distributions, one categorical count chart, three Venn diagrams in the conditional lesson plus two in the union lesson, and four trees. Figures appear only where their data support the question. Prose remains appropriate for event-rule reasoning.

## Validation

- `npm run check`: 33 new numeric keys recomputed from inputs; graphical claim inputs, twenty-per-lesson coverage, key positions (25 each), calculator deferral, content links, and KaTeX parsing pass. Seventeen conceptual keys received AI review of every option; mathematical inputs are asserted where applicable.
- All 63 figures are byte-reproducible using the pinned matplotlib version, including the nineteen additions.
- Leak scan against the private source library and existing Git history passes (longest shared run 11 words, failure threshold 12). No source question text, images, or private library files are published.
- Local browser review: grouped bars, mosaic, reverse conditional tree with explanation, and Venn display. Narrow layout checked at 390 CSS pixels with no page-level horizontal overflow. The new solution tabs show Explanation only.
- Existing q01–q50 compare exactly equal to the pre-expansion source.

Independent checks are tool checks, not human review or physical calculator verification.

Figure counts from source: categorical_bars: 1, grouped_bars: 3, mosaic: 4, relative_frequency_bars: 2, tree: 4, venn: 5.

## Archetype counts

| Archetype | Before | After |
|---|---:|---:|
| `assign_digits_for_simulation` | 2 | 3 |
| `association_from_conditional_proportions` | 2 | 6 |
| `choose_display_for_two_categorical_variables` | 1 | 1 |
| `claim_from_two_group_counts` | 1 | 2 |
| `claim_from_two_group_relative_display` | 2 | 4 |
| `compare_likelihoods_from_two_way_table` | 1 | 2 |
| `complement_probability` | 2 | 4 |
| `conditional_probability_and_multiplication_rule` | 6 | 11 |
| `conditional_probability_from_equally_likely_outcomes` | 2 | 4 |
| `identify_law_of_large_numbers` | 1 | 2 |
| `interpret_probability_as_long_run_frequency` | 1 | 2 |
| `missing_information_for_probability` | 2 | 4 |
| `mutually_exclusive_events_and_joint_probability` | 4 | 8 |
| `probability_from_simulation_results` | 2 | 5 |
| `probability_of_independent_trials` | 3 | 6 |
| `relative_frequency_from_two_way_table` | 7 | 14 |
| `sample_space_and_equally_likely_outcomes` | 2 | 4 |
| `total_probability_and_reverse_conditional` | 2 | 6 |
| `union_probability_addition_rule` | 4 | 7 |
| `use_independence_to_find_or_check_probability` | 1 | 2 |
| `value_for_no_association` | 2 | 3 |

## Follow-up: traversal and accuracy

The source records are now grouped by lesson so arrows finish all twenty items. Browser checks passed 10→11→10 in all five lessons and 20→next lesson 1→20. No numeric key correction was needed: 64 numeric and 36 conceptual answer checks pass. A separate audit verified 131 explicit numeric equations in 73 explanations, with symbolic and conceptual work reviewed by AI. One independence distractor (q96 D) was clarified; key A is unchanged. Stable question links are preserved.
