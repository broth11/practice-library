# Readable working and explanation revision

27 October 2026. This revision addresses the author’s screenshots and supersedes the earlier allowance for horizontal scrolling in mathematical working.

## Changes

- All four hypothesis-choice sets use separate null and alternative rows, including the two prose sets. The shared `hypotheses` descriptor retains complete accessible names.
- Reworked the existing display working across Units 1, 2, and 3 into short lines aligned at relation signs. Long sums use defined intermediate quantities; interval bounds are calculated separately where needed. Two further legacy inline equations in Unit 2A became explicit display working. The final bank has 89 solution display nodes and 36 explicit mathematical answer choices.
- Mathematical working no longer owns a horizontal scroll container. The answer fitter measures nested math before choosing columns, so a formula that needs the full width receives a one-column answer layout rather than an internal scrollbar. At narrow desktop widths up to 1,100 CSS pixels, ordinary question and explanation panes stack before the solution column becomes cramped. Calculator mode keeps its established layout.
- Converted nine original questions from rounded-result choices to correct-working choices: u3a05, u3a34, u3a35, u3a36, u3a42, u3a63, u3b12, u3b13, and u3b24. Inputs, question IDs, answer letters, lesson coverage, and the mathematical targets are preserved. All four expressions are independently evaluated for each question, including interval endpoints. No equivalent correct expression is used as a false choice.
- Expanded all 130 Unit 3 explanations with question-specific method justification and interpretation. Numerical explanations identify the statistic from the data, explain the appropriate model or formula, substitute the values, and interpret the result. Concept explanations explain why the stated evidence supports the conclusion. Misconception warnings remain focused on the actual alternatives.
- Existing Unit 2 calculator descriptors are unchanged. Every Unit 3 descriptor still uses the exact requested deferred contract. No calculator instructions were added.

## AP evidence and originality

Eight original scoring-guide pages were rendered and visually inspected for expression-choice and explanation patterns: SG_3.2#1, SG_3.3#6/#33/#41, SG_3.7#5, SG_3.10#20/#21, and SG_3.13#6. Six contain gray explanation boxes; two provide expression choices without such a box. Their useful pattern is derivation from raw counts, a justified general procedure, and a substituted expression. This pattern informed fresh explanations, not copied prose. The original synthetic contexts and numbers remain.

The known pooled-interval explanation error in SG_3.10#19 is excluded. Interval variance still uses separate observed proportions; a test of equality uses the null-pooled estimate. Source IDs supporting the nine conversions are recorded without source text in provenance. u3a05 now links the expression-selection variant V1 rather than its earlier numeric-probability variant V3.

## Verification

- Complete AI review of all 130 revised explanations and all nine four-choice expression sets. The review found and corrected an option-role mismatch, incomplete spoken variance definitions, two wording ambiguities, and dangling mathematical continuations. Numeric claims and unique keys were independently checked.
- Standard checks validate all 550 questions and 102 linked figures; all pre-existing answer checks pass. Unit 3 remains 80 plus 50, ten per lesson, with balanced keys and unchanged calculator deferrals. All 125 explicit solution/choice math nodes parse with KaTeX.
- The new working-format check rejects one-line hypothesis pairs, missing spoken working, and dangling relation rows. Structured-choice tests preserve hypothesis order and complete accessible names. Numerical expression tests evaluate all 36 choices and require exactly one matching target per item.
- Browser inspection opened all 550 questions with explanations at 390 CSS-pixel phone width. Identified long math was corrected and rechecked. All 130 Unit 3 questions were also opened in the narrow desktop layout, including a 1,107-pixel side-by-side viewport. All older explicit-math examples were checked too. Final regression cases at 787 pixels verify the stacked desktop layout; at 390 pixels they verify the final expression, hypothesis, and long-working patterns. No horizontal math, answer, or page overflow remains in the checked layouts. Browser zoom limited some requested viewport dimensions, so these are the observed CSS widths, not assumed dimensions.
- `npm run check`, `npm run build`, `npm run check:working`, source/history leak scanning, and scanner regression tests are release checks. The working-equation audit reports no mismatches. Diagrams themselves were not changed.

## Publication scan correction

The scan previously omitted untracked files and could concatenate separate JSON fields into a supposed copied sentence. It now includes new files and checks each JSON string independently. A synthetic regression test confirms that a real copied run within one field is still detected, while a fabricated cross-choice sentence is not.

The historical Unit 3 build contains two exact 12-word context-free ask frames that are permitted under originality rule S16. Those two frames have narrow explicit exceptions; a longer match including context or data still fails. Neighboring procedure labels are checked separately, not waived as a combined passage. History is preserved rather than rewritten. Source and history scans pass with only those stock-frame matches at the threshold.

## Limits

AI and tool verification only, with no human sign-off or physical-calculator check. Expanded explanations can require vertical scrolling. They are authored to avoid horizontal scrolling at the tested widths, without hiding mathematical content or shrinking it to unreadable type. Future questions must follow the updated authoring references and repeat the width checks.
