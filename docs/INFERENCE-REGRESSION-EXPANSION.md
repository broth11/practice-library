# Inference and regression expansion

19 November 2026. Ben requested ten additional questions per existing Unit 3 lesson, twenty questions per CED topic in Units 4 and 5, and deferred calculator guidance. GitHub is now the source of truth; the older Sites synchronization instructions are superseded.

## Inventory

| Module | Topics or lessons | Added | Final |
| --- | --- | ---: | ---: |
| 3.A | Eight existing lessons | 80 | 160 |
| 3.B | Five existing lessons | 50 | 100 |
| 4.A | CED 4.1–4.5 | 100 | 100 |
| 4.B | CED 4.6–4.10 | 100 | 100 |
| 5 | CED 5.1–5.5 | 100 | 100 |

Exactly 430 additions; the complete bank has 980 questions across 49 lessons. Every lesson has twenty questions. New stable IDs are x3a001–x3a080, x3b001–x3b050, x4a001–x4a100, x4b001–x4b100, and x5001–x5100. IDs are stable identifiers, not display order; source order is grouped by lesson.

Unit 4.A includes one-mean and paired-mean inference; Unit 4.B includes independent two-mean inference. The new lessons follow the Fall 2026 CED topics directly, because no local STS Unit 4 map was available. Existing Unit 3 lesson names and boundaries are retained. New labels are local CED-derived reasoning builds. There are no claims that these labels correspond to observed AP exemplar cards.

## Authorship and coverage

The questions combine conceptual selection, calculation, design and condition checks, interpretation, error diagnosis, and graphical reasoning. New Units 4 and 5 use two contextual sets of ten reasoning builds per CED topic. These are deliberately paired practice variants; they do not claim twenty distinct archetypes per topic. Each item records its correct option and three distractor roles, with local build evidence. Numeric choices are ascending; conceptual choices are allocated to balance unit keys.

Unit 3 additions reinforce sampling distributions, confidence intervals, hypothesis tests, errors and power, two-proportion inference, and the two chi-square sampling designs. Original questions, keys, explanations, calculator descriptors, and IDs remain unchanged. SHA-256 fixtures preserve the original Unit 3 question objects from commit 83900a9 without requiring Git history in shallow CI checkouts.

All 430 additions carry the existing exact deferred calculator contract. There are now 560 deferred guides across Units 3–5. Deferred support does not imply that a calculator is unnecessary. No calculator routes or screenshots were authored in this pass.

## Figures and mathematical layout

Twenty-two new generated SVGs support scatterplot construction and description, linear strength, curved relationships, clusters, unusual observations, and residual patterns. Their exact coordinates and question links live in `src/diagrams/ap-statistics.json`; the reusable `scatter_points` renderer lives in `scripts/diagrams/build_diagrams.py`. It accepts paired coordinates, optional comparison groups, and an optional residual-zero line.

The local diagram library's gallery and scatter-template guidance were consulted. The established project AP grayscale style and pinned Matplotlib 3.10.9 renderer remain the implementation. No external diagram image or private template code was imported. This document is the project usage record for these figures; no IB lesson use is asserted. A new shared renderer capability was added, but no untested change to the general diagram-authoring method is claimed.

Hypothesis choices use the existing two-row descriptor. Sample means use x̄ rather than the unsupported prose spelling x-bar. Numerical working uses explicit display math nodes. All figures have exact-coordinate alternative text, and the calculator tab stays hidden for deferred items.

## Verification

- Standard structure, provenance, answer, calculator, KaTeX, choice, image-preload, and working-format checks pass for all 980 questions.
- `scripts/check-expansion.mjs`, imported by the standard answer checker, independently recomputes 107 new numerical keys in JavaScript against values authored with Python/SciPy. Student-t tail areas use numerical integration with independently computed density constants, not SciPy results. The checker also enforces twenty questions per lesson, balanced unit keys, exact original Unit 3 content, unique alternatives, review records, and calculator deferrals.
- The other 323 additions have author reasoning and distractor records. These are author/AI rationale records, not a separate independent semantic review and not human sign-off. Some short conceptual options contain numbers but are classified as conceptual tasks rather than independently recomputed numerical targets.
- Browser inspection opened a representative new question and explanation in every one of the 28 affected lessons at desktop and 390-pixel phone widths. An additional complete phone rendering audit opened all 430 additions with explanations: four answer controls each, no page-width overflow, and no KaTeX errors. The final 140-question batch also checked for completed broken images; none were found. Representative hypotheses, mathematical workings, and residual figures were visually inspected.
- All 124 generated figures match their data specs under pinned Matplotlib. Source/history private-source leak scanning passes, with only the scanner's existing narrow stock-ask exceptions. The build is regenerated from source and checked for determinism.

## Limits

This is author reasoning and tool verification. No human approval or physical fx-CG50 verification is recorded. Dense questions and explanations can scroll vertically. Phone-scale plot labels retain the established scaled AP figure presentation, with descriptive alternative text. Browser checks do not establish pedagogical validity of every conceptual alternative; the per-item rationale records support subsequent review.

GitHub publication uses a review branch and the existing pull-request workflow. No Sites publication is needed for this request. Deployment to the public GitHub Pages site follows the repository's existing enabled Pages workflow after a merge; a branch push alone does not change the live site.
