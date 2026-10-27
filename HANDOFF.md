# Handoff

## Fuller Unit 1 and 2 explanations (2026-10-27, Codex)

- Reviewed and expanded all 420 earlier solutions with question-specific reasoning, interpretation or limits. Preserved all question fields outside solutions, all warnings and all calculator guidance. Unit 3 is unchanged. Removed repeated introductions, a duplicate sentence and b34’s misleading rounded intermediate sum.
- Increased unit and lesson title sizes in the route pane, including unit-selection card titles. Navigation collapse and visible question panes are preserved.
- See `docs/UNIT-1-2-EXPLANATION-REVIEW.md` for scope and verification. Tool and AI review are not human or physical-calculator sign-off. Publish matching source/build to the original public Sites project and GitHub Pages through the PR workflow.

## Navigation collapse correction (2026-10-27, Codex)

- Ben clarified that Courses/Units/Questions navigation should collapse when an explanation or calculator opens. The question card must remain visible. Both views now call the shared navigation-collapse action; the three narrow navigation handles remain available to reopen a list.
- Removed the previous question-hiding/full-width-solution behavior and restored shared question/solution and question/keypress/calculator layouts. Automatic vertical explanation scrolling and keyboard access are retained. Closing a solution leaves navigation collapsed until the user reopens it.
- This supersedes the previous full-workspace interpretation. No question content, keys or calculator guides changed.

## Readable working and fuller explanations (2026-10-27, Codex)

- Hypothesis answers now put H0 and Ha on separate rows. Symbolic rows keep label and expression together, allowing a one-column phone layout. Nine Unit 3 items assess the correct working, and all 130 Unit 3 explanations include specific method justification and interpretation. Counts, stable IDs, keys, and calculator deferrals are preserved.
- Reworked display mathematics across the bank into aligned lines; long sums and interval endpoints use intermediate steps. Working no longer depends on a horizontal scrollbar. The shared answer fitter measures nested math, and ordinary panes stack at narrow desktop widths.
- All 550 questions were audited at phone width; all 130 Unit 3 questions and older explicit-math cases were checked on desktop. Identified cases were fixed and rechecked at 390, 787, and 1,107 CSS pixels. Standard checks and independent expression checks pass. See `docs/READABLE-WORKING-REVIEW.md` for exact scope and limits.
- Corrected leak-scan field boundaries and untracked-file coverage. Exact stock ask frames have narrow documented S16 exceptions, with regression tests that retain true within-field leak detection. No source contexts/data were copied and no history was rewritten.
- Publish the same source/build to the original Sites artifact and GitHub Pages through the PR workflow. No human or physical-calculator sign-off is claimed.

## Unit 3 production (2026-10-27, Codex)

- Added 130 original questions in two modules: 80 in 3.A.1–3.A.8 and 50 in 3.B.1–3.B.5, ten per lesson. 3.A.6 combines both parts; 3.A.0 is excluded. The latest Unit 1 expansion and all Unit 2 guidance are retained.
- All new calculator fields use Ben’s exact deferred contract. Claude’s complete ID/file inventory is in `docs/UNIT-3-AUTHORING-REVIEW.md`. No calculator guidance was created.
- Six generated figures add shared proportion-dotplot and chi-square-curve support. Display/aligned math, indexed proportion notation, and complete accessible answer labels use shared renderers.
- Standard checks independently recompute 50 numerical/decision targets; all 130 keys and 520 alternatives received independent AI review. Desktop/phone review covers all questions and explanations, with 34 follow-up pattern checks and 48 navigation transitions. Ten long phone formulas pan inside their math panels; dense cards can scroll vertically.
- See the Unit 3 review and provenance ledger for local archetype labels, flagged extensions, source exclusions, and the pilot-card limitation. No human or physical-calculator sign-off is claimed.
- Publication uses the GitHub task branch/PR and the original Sites project through its source helper, preserving each history and the existing public audience. Consult the PR and native deployment records for final live status.


## Unit 1 GitHub synchronization (2026-10-27, Codex)

- Ben explicitly requested “push to main” after the successful Sites version 23 publication. This authorizes a direct GitHub main update for this synchronization, overriding the branch-only rule for this action.
- Applied the completed 1.A/1.B expansion onto the current GitHub main. Its source tree matched the pre-expansion Sites baseline, so the content and interface changes applied without conflict. All 420 questions and the existing Unit 2 calculator guidance are retained.
- Unit 1 has twenty questions per lesson, 110 additions, 21 new diagrams, and 10 new tables. It is explanation-only, with no calculator references. The original Sites publication remains live. This follow-up supersedes the earlier GitHub publication-scope limit.
- Structure/answer checks, all 96 reproducible diagrams, current-source and history leak scans, and the regenerated build pass in this GitHub checkout. Browser QA from the completed Sites pass covers this same application and content. No human sign-off is claimed.

## Unit 1.A and 1.B expansion (2026-10-27, Codex)

- Each Unit 1 lesson now has twenty questions: 120 in 1.A and 100 in 1.B, with 110 fresh additions, 21 generated figures, and 10 tables. Existing question content and stable ids are preserved. Coverage decisions and verification limits are in `docs/UNIT-1-EXPANSION-REVIEW.md`.
- Unit 1 is explanation-only by Ben's explicit request. All 220 questions omit calculator metadata and references. The shared renderer hides an absent optional guide, and the generic welcome note no longer promises keypresses. Other units retain their guides. This supersedes the historical deferral language below.
- The standard checks recompute 50 Unit 1 numeric/compound targets, including 26 additions, enforce twenty items per lesson, balanced keys, and no Unit 1 calculator references. New shared diagram kinds are comparison_dotplots, study_flow, and sampling_grid.
- Local authoring branch: `codex/expand-unit-1a-1b`. Publication scope is the selected Sites project and its separate source remote. GitHub and Pages are outside this request. Standard checks, all 96 reproducible figures, source leak scan, and browser review pass. All 110 additions were opened with explanations at desktop and phone widths; 31 navigation transitions passed. Source is ready for the native Sites publication step; consult that deployment result for live status.

## Reading width and compact answer fitting (2026-10-26, Codex)

- Increased the desktop reading share from 59% to 64%. At 1,440 by 834 the card is 642px wide, up from 592px. This width remains fixed across navigation expansion/collapse and question, explanation, and calculator modes. Rail positions and calculator height containment are retained.
- The shared fitter now tries four columns for single-line compact choices, two columns for prose or structured choices, and one column when needed. It measures with the matching grid-specific styles. Long prose can occupy three lines per choice in a two-column grid.
- Start at 16px. If needed, shrink diagrams by at most 25%, with a 160px floor for larger images, before reducing text. Preserve aspect ratio. If scrolling remains unavoidable at every fitting font, keep the largest font that fits horizontally and the shortest valid grid. Refit after image load and ignore detached cards.
- Isolated browser audits rendered all 310 questions at 1,440 by 834, 2,048 by 1,195, 1,024 by 768, and 390 by 844. No option or page-width overflow. At the reference desktop size, 303 questions retain 16px; all 310 do on wide desktop. Unit 2.A #16 and #58 use four columns at 16px without scrolling, and #16 uses a fitting two-column phone layout.
- All six previously flagged questions now use compact grids. Unit 1.A #58 retains 16px and a two-column grid with vertical scrolling because its full content still exceeds the available height. Dense questions can still need smaller type or scrolling.
- Browser checks cover all six navigation/view combinations, calculator top alignment, equal side columns, height limits, and smooth explanation return. Standard checks/build pass. Synchronize Sites and GitHub Pages; question content is unchanged.

## Solution transition endpoint fix (2026-10-26, Codex)

- Removed the legacy 180ms `reveal-content` animation from the live solution shell. It applied a 10px offset while the new view transition captured its target, leaving an offset snapshot that snapped to the live position at handoff.
- The shared view transition now owns the complete slide; its live target has no animation or transform. Browser checks confirm identical immediate/settled desktop bounds (x 999.3125, y 85, width 409.453125 at 1,440 by 834) and no transform after calculator-to-explanation switching.
- Standard checks/build pass. Publish the same correction to Sites and GitHub Pages. Content and layout proportions are unchanged.

## Panel transitions (2026-10-26, Codex)

- Navigation panes, course/unit selections, lesson selection, solution reveal/close, and explanation/calculator switching now use shared view transitions. Outgoing panels slide away; the rail stays fixed.
- Card fitting runs synchronously before capture. New actions skip active transitions. Initial route restoration does not animate; network loading finishes before capture. Reduced-motion and unsupported browsers update directly.
- Calculator step notes and screen changes use a brief 180ms reveal and preserve list scroll.
- Browser checks cover all three tabs, repeated toggles, solution open/close, calculator entry/return, step advancement, and phone use. Desktop question width stays 592px and tab tops stay 16, 146, and 276px at 1,440 by 834. Phone width stays 318px and tab tops stay 12, 132, and 252px at 390 by 844. No horizontal overflow; calculator height containment is retained. No app errors/warnings recorded.
- Standard checks/build and syntax checks pass. A helper check confirms reduced-motion/unsupported-browser bypass and active-transition replacement. Synchronize both hosting targets; no content changes.

## Background image loading (2026-10-26, Codex)

- All 75 diagrams and 12 calculator menu icons preload and decode after startup. The selected unit's question/solution figures have priority. Four low-priority downloads run at once; the interface and navigation never await completion.
- The build generates `dist/image-preloads.json`; its URLs match the build-versioned diagram and calculator image renderer URLs. Unit question JSON remains loaded on selection.
- `scripts/check-image-preload.mjs` covers bounded concurrency, duplicate URLs, selected-unit priority, decoding, failure recovery, and retry behavior. It runs in the standard checks.
- Browser/server QA on a fresh local origin recorded 87 distinct asset requests while still on the welcome screen, with no unit question data fetched. Navigating to two unseen normal-diagram questions and opening the calculator produced zero additional asset requests; the diagram images were already complete. Checks and build pass.
- Publish the same source/build to Sites and GitHub Pages. No content or layout changes.

## Reading width and navigation rail follow-up (2026-10-26, Codex)

- The sidebar-open reading width now applies to all desktop practice views, fixing enlargement in question and explanation mode as well as calculator mode.
- Removed calculator-only sidebar centering and ensured the rail stretches with top-anchored tabs. The tab positions remain identical when navigation opens/closes and when switching solution modes.
- Browser checks compared all six open/closed question/explanation/calculator combinations at 1,440 by 834: question width stayed 592px, and tab top coordinates stayed 16, 146, and 276px. Also checked 1,024px, 850px, and 390px views: question widths and tab positions match across normal/calculator views, with no page-width overflow and the calculator height cap retained.
- Standard checks and build pass. Publish the same source/build to Sites and GitHub Pages. Content and calculator instructions are unchanged.

## Stable calculator proportions (2026-10-26, Codex)

- Removed the state-dependent question-width capture. Desktop now derives the calculator question width from the sidebar-open reading layout using shared navigation dimensions; the two remaining columns divide the released space equally.
- At a 1,440 by 834 viewport, both sidebar-open and already-collapsed entry paths produce the same 592px question and two 347px side columns. The question matches its sidebar-open reference width.
- Browser checks also cover short/wide desktop, 1,024px desktop, phone stacking, and a diagram question. Equal side columns, top alignment, the calculator height limit, and no page-width overflow are retained. Standard content/calculator checks and build pass.
- Synchronize the same correction to Sites and GitHub Pages. No question content or calculator instructions changed.

## Calculator pane sizing (2026-10-26, Codex)

- Calculator entry now collapses navigation on every visit, while retaining all three rail tabs for manual reopening.
- Desktop keeps the question's entry width and splits the remaining space equally between instructions and hardware. The calculator is top aligned, keeps its 648:1348 proportions, and cannot exceed the keypress pane's height. The phone layout stays stacked.
- Browser measurements passed at 2,048 by 1,195, 2,048 by 800, 1,440 by 900, 1,024 by 768, and 390 by 844: equal desktop side columns, no horizontal page overflow, matching top edges, and calculator height within the keypress pane. Reopening navigation then reentering instructions collapses it again. Content and calculator calculations are unchanged.
- Based on the latest GitHub main with both units' calculator-guidance updates. Publish the same source/build to GitHub Pages and Sites, preserving their existing access.

## Unit 2.B calculator guidance (2026-10-26, Claude)

- b51–b100 (items 11–20 in each 2.B lesson) now have fx-CG50 guidance. 21 items have guides: 10 Run-Matrix arithmetic items (b54, b56, b57, b58, b62, b64, b67, b68, b74, b76, b80) and 11 distribution walkthroughs using the shared descriptors and followUps (b61, b65 Binomial CD; b81, b82, b87 Normal CD; b83, b84, b85, b86, b88 Inverse Normal). The other 29 are marked `needed: false` with a specific reason because they are definition, interpretation, read-off, or mental-arithmetic tasks.
- `scripts/check-unit-two-b.mjs` no longer requires deferral for b51–b100; it requires a result screen, a distribution descriptor, or a reason. Every guide's final screen was also compared with the keyed choice.
- Tool verification only. No browser review of the new keypress panes and no physical fx-CG50 check are recorded.
- Pushed directly to main at Ben's explicit request in chat, overriding the branch-only rule for this change.

## Unit 2.B GitHub synchronization (2026-10-26, Codex)

- Ben explicitly requested pushing the new 2.B questions to GitHub main. This authorizes the direct main update for this synchronization.
- Applied the completed Sites expansion onto current GitHub main, preserving the newer 2.A calculator guidance. Unit 2.B now has 100 questions, twenty per lesson, with twelve new figures and nine new tables. The original fifty 2.B items are unchanged.
- The fifty added 2.B calculator guides remain deferred. Numeric and model checks are in `scripts/check-unit-two-b.mjs`; coverage, provenance, and review limits are in `docs/UNIT-2B-EXPANSION-REVIEW.md`.
- Sites version 14 already contains the 2.B expansion. This synchronization updates GitHub and its existing Pages workflow without changing Sites hosting or access.

## Unit 2.A calculator guidance (2026-10-26, Claude)

- q51–q100 (items 11–20 in each 2.A lesson) now have fx-CG50 guidance. 37 items use Run-Matrix arithmetic screens (48 result screens in all), following the q01–q50 pattern. 13 items are marked `needed: false` with a reason because they are counting, interpretation, or read-off tasks: q59, q61, q63, q66, q67, q68, q74, q75, q77, q80, q85, q95, q99.
- `scripts/check-unit-two-a.mjs` no longer requires deferral for q51–q100; it now requires either a result screen or a reason. `npm run check` recomputes every screen exactly and confirms the keys spell each entry.
- Tool verification only. No browser review of the new keypress panes and no physical fx-CG50 check are recorded.
- Pushed directly to main at Ben's explicit request in chat, overriding the branch-only rule for this change.

## GitHub synchronization (2026-10-26)

- Ben explicitly authorized pushing the expansion and navigation/accuracy follow-up directly to GitHub main. The two Sites changes were applied on top of the existing GitHub history without replacing or rewriting it.
- The 100-question 2.A set, nineteen diagrams, corrected question ordering, answer checks, worked-equation audit, and regenerated dist are included. Local validation passes.

## Navigation and accuracy follow-up (2026-10-26)

- Reordered 2.A into lesson order, preserving within-lesson order and every id. Arrows now finish 1–20 before moving lessons. A structural check rejects interleaved lesson order in every unit.
- All 100 2.A keys now have numeric or conceptual checks: 64 numeric and 36 conceptual, including the previously unported original conceptual items.
- Rechecked worked explanations. `npm run check:working` verifies 131 explicit numeric equations in 73 explanations; symbolic and conceptual working received AI review. No incorrect numeric key was found.
- Browser regression checks passed forward and backward at 10↔11 in all five lessons and at 20↔1 across lessons.
- q96’s fourth comparison was clarified to an explicitly false equality, making the intended independence comparison unambiguous. Key A is unchanged.

## Latest change (2026-10-26, Codex, `codex/expand-unit-2a`)

- Unit 2.A now has 100 questions, twenty per lesson. q01–q50 are unchanged; q51–q100 have questions, explanations, and nineteen generated figures. Calculator guidance is deferred on all additions by Ben’s request.
- Underrepresented variants and representations are documented in `docs/UNIT-2A-EXPANSION-REVIEW.md`. New reusable diagram kinds: grouped bars and mosaic.
- Checks pass: 33 new numeric keys, figure inputs, balanced unit keys, per-lesson counts, deferrals, KaTeX, all 63 reproducible figures, and source leak scan. Conceptual review is AI review; no human sign-off. Browser review covered desktop and 390px layouts.
- Publication scope: update the selected Sites artifact through its native source workflow. The repository’s no-direct-main rule governs GitHub collaboration; the Sites connector supplies a separate source remote on main and its required workflow synchronizes that remote. Local authoring remains on the named Codex branch. GitHub/Pages has not been changed in this pass.


The current state of the project, for whichever agent or person works on it next. Update this before you stop. Keep it short: what is true now, not a history (that is what Git is for).

## Current state (2026-10-24, Codex, `codex/unit-1a-1b`)

- Four units authored: AP Statistics 1.A (60 questions), 1.B (50), 2.A (50), and 2.B (50). Unit 1 calculator keypresses and screenshots are deferred by Ben; its calculator tabs are hidden.
- Unit 1 adds 13 generated figures, 24 independently recomputed numeric targets, and per-question provenance. Coverage and review limits are in `docs/UNIT-1-REVIEW.md`. There is no recorded human sign-off.
- `npm run check` covers structure, provenance, the archetype registry, 85 independently recomputed answer keys, 58 calculator screens, 14 distribution walkthroughs, 110 calculator deferrals, and KaTeX parsing. `npm run check:diagrams` confirms all 44 figures are reproducible.
- All 44 figures are generated by `scripts/diagrams/build_diagrams.py` from `src/diagrams/ap-statistics.json` in AP print style.
- Repository prepared for public release on GitHub (`broth11`). The site at the existing host stays authoritative. GitHub Pages is an optional second copy, off until the repository variable `PAGES_ENABLED` is `true`.

## Open questions for Ben

1. **b42** archetype label: `statistic_from_description` does not decide a parameter-versus-statistic item. Relink to `normal_distribution_parameter_notation`, make it a local label, or keep it? (Recorded as `review` in `archetypes.json`.)
2. **b49** tail direction: it counts simulated means at or above an observed mean that sits below the claim. The key is right either way. Reword, or leave it?
3. Physical fx-CG50 check of the `Select Save Res: None` step and the ±1×10⁹⁹ entry, then record it in `docs/PROVENANCE.md`.

## Known gaps

- Original 2.A conceptual keys are now covered by `scripts/check-unit-two-a-concepts.mjs` (2026-10-26 follow-up).
- Math nodes exist for solution steps only. Scenario, prompt, choice, and warning fields still use the legacy detector.
- Upstream pedagogical provenance for Unit 2.B (variants, option roles, distractor rationale) was never recorded.
- At phone width the b48 histogram's tick labels are small (about 7px). It is legible but tight.

## Next steps

- Port the remaining 2.A truth assertions into `scripts/check-answers.mjs`.
- Extend math nodes to prompts and choices before any matrix, vector, or calculus content.
- Units beyond 2.B: start from the archetype library's cards for those topics.

## In progress

The a27 key is now one literal field, `1|2 = 12 centimeters`, in a consistent inherited font. The `codex/consistent-notation-key` publication also synchronizes the current four-unit tree to the original Sites artifact. Preserve both hosting targets on subsequent releases; updating GitHub Pages alone does not update Sites. The Sites source has its original Git lineage; GitHub has the documented rewritten lineage, so the release synchronizes file contents without replacing either history.

Content work is complete on `codex/structured-answer-choices`: a27 uses reusable stem-and-leaf answer objects with aligned rows, screen-reader labels, and an independently reconstructed answer check. Other questions keep their existing text choices. Desktop uses a 2-by-2 grid; phone width uses one column. Unit 1 calculator support remains deferred. Publication uses the PR and GitHub Pages workflows.

The follow-up `codex/version-static-assets` makes builds fingerprint their source and version JavaScript/CSS URLs, including module imports. Course and unit JSON is revalidated when fetched so a browser cannot keep showing old text choices after deployment. The build remains deterministic.
