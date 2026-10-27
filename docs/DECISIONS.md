# Practice Library decision record

## Reading width and fitter priorities (2026-10-26)

- Ben approved increasing the desktop question share from 59% to 64% of the sidebar-open workspace. Preserve this reading width when navigation collapses and across solution modes; calculator instructions and hardware share the remaining space equally.
- Keep the preferred question font at 16px. Try compact four-column answers where each choice fits on one line, two-column answers for longer prose or structured plots, and one column when needed. Diagram size can decrease modestly before reducing text; preserve aspect ratio and limit reduction to 25% with a 160px floor for larger diagrams.
- If the content requires scrolling at every tested font, prefer readable text and the shortest horizontally fitting answer grid. Do not switch to a taller single-column grid simply because the available height was exceeded.

## Panel motion (2026-10-26)

- The live solution shell must not run its own entry animation. View transition snapshots must capture final target geometry and opacity; a second transform animation leaves a visible endpoint jump when the snapshot hands back to the live DOM.

- Use shared native view transitions for entering and departing panels. Keep the rail fixed, and preserve the question width and calculator height limits.
- Layout movement takes 360ms with gentle easing. Calculator step details use a shorter 180ms reveal. Initial route restoration does not animate; network loading finishes before capture.
- Reduced-motion preferences bypass animation. Unsupported browsers update directly. Fit cards synchronously before capture because awaiting an animation frame inside the update would stall capture.

This record consolidates the decisions made while developing Units 2.A and 2.B. It is source context for future work, not a reconstruction from the rendered page.

Where the decisions came from: the earlier ones were made in prior development sessions and consolidated from those session records, which live outside this repository. Several are corroborated by the Unit 2.A trial package's README and browser-verification records (2×2 answer layout, reserved solution space, calculator proportions, arrows above the screen, per-visit progress). Decisions dated 2026-10-24 were made with the author in the public-release session. See `docs/PROVENANCE.md`.

## Content model

- A course contains units; a unit contains lessons; a lesson contains questions.
- Unit 2.A now has five lessons with twenty questions per lesson (2026-10-26). Other unit counts are recorded in their manifests; counts are content targets, not renderer limitations.
- An archetype is defined by answer logic and distractor misconceptions. A changed context, number set, or display is a variant when the logic and misconception map stay the same.
- Questions must be fresh and original. Existing exemplar questions are evidence for structure and style, never text to copy.
- Each authored question records its archetype and, when known, variant and option roles. Missing historical metadata stays explicitly unknown; do not invent it from the finished interface.
- Numerical answers are computed independently. AI/tool verification is not human sign-off, and review status must say so accurately.
- Visuals are included when they materially support the reasoning: tables, discrete/bar displays, shaded binomial or normal plots, and sampling histograms or dotplots.
- (2026-10-24) Every figure is generated from a data spec in `src/diagrams/` by one pinned matplotlib script, in AP print style (S14): grayscale, axis titles, boxed legends. No figure is hand-drawn or hard-coded in a renderer. Figure text is sized to match the question's reading size on desktop.
- (2026-10-24) Archetype labels are registered with an honest link status. Labels without a card stay as local course labels; they are not renamed or called invented.

## Learning experience

- Fresh load opens Courses and a text-only welcome screen. No course, unit, lesson, or question is assumed.
- The selection path is Courses → Units → Questions. Course selection reveals units; unit selection reveals lessons; lesson selection starts practice.
- Only one question is visible at a time. On desktop the practice workspace should fit without page scrolling.
- The question has a stable reading width and permanently reserved solution space so opening a solution does not resize the question.
- Explanations and calculator walkthroughs open alongside the question. The calculator view may collapse the route panel, but a visible route stub must let the user reopen it.
- (2026-10-24) At phone width (760px and below) the route pane overlays the question, so it collapses when a question opens. The rail tabs remain as the route stub.
- Progress lasts for the current page visit only. There are no accounts, sign-in, database, or cross-device persistence.
- Answer choices default to a 2×2 layout, fall back to one column when long or cramped, and may use one row of four only for genuinely short choices. Mathematical expressions stay intact, at normal text size, with full-size fractions.
- Remove generic filler such as repeated invitations to read the reasoning. Use the space for the actual reasoning.
- The welcome screen uses the cream/green visual language and is the only place with deliberately enlarged display text.

## Mathematical notation

- KaTeX is the shared typesetting engine. Its supported notation is sufficient for the intended statistics, matrices, vectors, and calculus content.
- Automatic detection in prose is a legacy convenience for simple expressions, not the authoring model for advanced mathematics.
- Inline and display mathematics are explicit, distinct content modes. Use display mode for multi-line work, matrices, systems, prominent fractions, and calculus expressions with substantial vertical structure.
- Never construct multi-line mathematics by putting `<br>` inside inline math. Use an aligned display or separate display blocks so fractions and other tall notation receive correct vertical spacing.
- (2026-10-24) Solution steps accept explicit math nodes. The three steps that used `<br>` inside inline math (2.A q03, q20, q21) are now display nodes, and `npm run check` rejects the pattern.
- Future advanced-math content must use explicit TeX stored in the authored JSON and rendered by a shared component. Schema, renderer, validation, and responsive QA evolve together; do not add per-question parsing exceptions.
- Preserve KaTeX's MathML output for accessibility. A parse failure blocks publication rather than silently becoming plain text or an image.

## Calculator experience

- Preserve the fx-CG50's tall proportions (648:1348) and its 384:216 screen proportion. Use the original menu icons.
- Calculator mode gives the question, keypress explanation, and calculator meaningful full-height panes. Explanations and keypress directions use the question's reading size.
- A separate step is justified by a new calculator menu or screen. Typing an entire arithmetic expression and pressing EXE is one step.
- Navigation arrows sit above the calculator screen.
- Calculations are derived, not typed from a remembered answer. Distribution routes are checked against the fx-CG50 Skill Finder master cards, and `npm run check` enforces those routes and field orders.
- `Select Save Res: None` and the ±1×10⁹⁹ unbounded-tail entry are Practice Library conventions from the calculator restoration, not transcriptions of the Skill Finder cards. They stand pending a physical-calculator check.
- The 648:1348 body proportion is an explicit design requirement. Its measurement source is not recorded.
- Physical fx-CG50 verification has not been recorded and must not be claimed.

## Architecture and hosting

- Keep the product a static SPA. A backend is unnecessary until the product needs accounts, synchronized progress, teacher dashboards, or protected content.
- Authoring truth lives in `src/`, never in generated `dist/` HTML or JavaScript.
- Course and unit content is split into JSON modules. The app loads the catalog first, a course manifest after course selection, and a unit only after unit selection.
- Shared renderers own the question card, stimuli, math, navigation, solutions, and calculator. A question is data consumed by those renderers, not a standalone copied HTML card.
- `dist/` is reproducible deployment output. GitHub stores the source, schemas, skill, workflow, and built static files together so Sites and GitHub-oriented hosting can use the same repository.

## Publication and collaboration (2026-10-24)

- The repository is public on GitHub under the author's personal account, pushed from the existing local repository with its full history.
- The existing site stays authoritative. GitHub Pages is a secondary copy built by Actions from `src/`, switched on with the repository variable `PAGES_ENABLED`.
- The private archetype library, scoring-guide transcriptions, and any verbatim AP text never enter this repository. `npm run check` blocks personal machine paths, and `CONTRIBUTING.md` describes the leak scan.
- Code is MIT licensed. Contributions are welcome. Casio menu icons are third-party and excluded from that license (`NOTICE.md`).
- Claude and Codex share one rulebook, `AGENTS.md`, work on separate `<agent>/<topic>` branches, and hand off through `HANDOFF.md`.

## Unit 1 and GitHub Pages (2026-10-24)

- Ben requested Units 1.A and 1.B with all question content, figures, and explanations, while deferring calculator keypresses and screenshots. Unit 1.A contains ten items per lesson across six lessons; Unit 1.B contains ten per lesson across five lessons.
- Deferred calculator support is an explicit data status. The shared renderer hides its tab instead of claiming that a calculator is never useful.
- Ben subsequently requested the live GitHub-hosted site. GitHub Pages uses the existing Actions workflow, with `PAGES_ENABLED=true`, at `https://broth11.github.io/practice-library/`.

## Structured answer displays (2026-10-24)

- Answer choices that are statistical displays use structured data. A stem-and-leaf answer stores its rows, stems, and leaves explicitly and uses a shared renderer with aligned columns and a continuous divider.
- The renderer preserves the authored row and leaf order, including errors intentionally used as distractors. It never sorts or repairs an answer during display.
- The answer grid can retain two columns for compact structured plots and uses one column when narrow. Screen readers receive the stem and leaf values as the radio's accessible name. These displays bypass automatic prose math detection.
- Builds fingerprint their source and use that version in JavaScript, imported-module, and stylesheet URLs. Course and unit JSON is revalidated when fetched. This prevents cached runtime files or content from hiding a published rendering fix.
- Literal notation keys are stored in `notationKey` and rendered as escaped text in a single inherited font. A stem-and-leaf key such as `1|2 = 12 centimeters` must not be partly processed as an arithmetic expression.
- Ben confirmed that the original Sites address must also receive updates. Publish the same source and build to GitHub Pages and the original Sites project, retaining both addresses and the existing Sites audience.

## Unit 2.A expansion (2026-10-26)

- Expand ten to twenty questions in each of the five lessons. Preserve existing items and calculator walkthroughs. Defer calculator guidance for every added item.
- Use shared generated grouped-bar and mosaic displays to cover two-variable representations absent from the original set. Preserve the current app layout and navigation.

## Question traversal (2026-10-26)

Question source arrays follow declared lesson order, with each lesson contiguous. Keyboard and button traversal share this sequence. New questions belong inside their lesson block. The structural validator enforces this for every unit. Stable ids and deep links are preserved.

## Unit 2.B expansion (2026-10-26)

- Expand each of the five lessons from ten to twenty questions. Preserve b01 to b50 and defer calculator keypress guidance on b51 to b100.
- Give underrepresented reasoning variants and representations more space. Add twelve generated figures and nine tables while retaining the established shared renderers and lesson traversal order.
- Publish to the selected original Sites artifact with its existing audience. The separate GitHub and Pages copies are outside this pass.

- Follow-up: Ben explicitly requested the completed 2.B additions on GitHub main. Apply them onto current GitHub history, preserve newer changes in other units, and include the regenerated static build. This follow-up supersedes the earlier publication-scope limit for GitHub synchronization.

## Calculator pane sizing (2026-10-26)

- Entering the calculator view collapses the active navigation pane every time. The three rail tabs remain available to reopen navigation.
- On desktop, preserve the question card's width when entering the view. Divide the remaining workspace, after gaps, equally between the keypress pane and the hardware column. The captured question share scales with later window resizing.
- Align the calculator's top with the keypress pane. Fit its whole 648:1348 body within both its allocated width and that pane's height. Retain the stacked phone layout with a calculator shorter than its minimum 330px keypress pane.
- This layout change starts from current GitHub main, retaining the later 2.A and 2.B calculator guidance, and synchronizes both hosting targets.

## Stable calculator question width (2026-10-26)

The calculator question uses the reading width of the normal sidebar-open desktop layout. Its width is derived from the shared expanded and collapsed navigation sizes, rather than captured from whichever state happened to precede calculator entry. The released navigation space goes equally to the keypress and calculator columns. This supersedes the entry-width capture above and remains consistent after resizing or revisiting the calculator. Top alignment, height containment, and phone stacking are retained.

## Fixed reading width and rail positions (2026-10-26)

- Use the sidebar-open question width in every desktop practice view, including unrevealed questions and explanations. Collapsing navigation releases space to the right-hand panels instead of enlarging the question.
- Keep the same main padding in normal and calculator views. The keypress and hardware columns still share their remaining space equally.
- Keep the rail stretched and its tabs anchored at the top. Remove the legacy calculator-only sidebar centering rule so Courses, Units, and Questions never move when a pane collapses or the solution view changes.

## Background image preload (2026-10-26)

- Begin preloading all diagrams and calculator menu icons on page startup, including the welcome screen, without waiting for those assets before rendering the interface. Selecting a unit promotes its question and solution diagrams in the queue.
- Use four low-priority requests at a time, retain image objects, and decode completed downloads. Duplicate URLs coalesce; an individual failure does not stall other images or navigation and can retry on later selection.
- Build a static image index from the generated asset directories. Do not fetch all question modules just to discover images. Displayed and preloaded assets use the same build-versioned URLs so they share cache entries and changed releases cannot reuse outdated images.

## Unit 1 expansion and explanation-only content (2026-10-27)

- Ben requested twenty questions per lesson throughout 1.A and 1.B, with underrepresented archetypes and diagram styles given more space. Original question ids, choices, solutions, and provenance are retained.
- Ben specified no calculator references in these units. Omit the optional calculator descriptor from every Unit 1 item, including original items; show only the explanation tab. An absent descriptor is an intentional explanation-only choice, rather than deferred guidance. Other units keep their existing descriptors.
- Comparative dotplots, study flows, and intact-cluster grids are reusable generated diagram kinds, not branches in the application renderer. Preserve the current layout and navigation.
- Publish this pass to the selected Sites project with its existing public access. The separate GitHub and Pages copies are outside this pass.

## Unit 1 GitHub synchronization (2026-10-27)

Ben explicitly requested pushing the completed expansion to main after Sites publication. Synchronize the same source and regenerated build to GitHub main, preserving its history and existing Pages workflow. This follow-up supersedes the earlier GitHub scope limit and authorizes a direct main push for this synchronization.


## Unit 3 production (2026-10-27)

Add thirteen core lessons in two progressively loaded modules, with ten original questions per lesson and no optional opener. Treat 3.A.6 Parts A/B as one lesson. Follow the audited STS boundaries, especially known-p versus unpooled versus pooled formulas and the staged chi-square conditions/df instruction. Calculator guidance is explicitly deferred for all new items at Ben’s request. Preserve existing modules, calculator guides, audience, and both hosting histories.

Use explicit display/aligned working and shared inference-notation support. Give every radio answer a complete text label so MathML-bearing hypothesis symbols do not disappear from its accessible name. Add generated proportion-dotplot and chi-square-density diagram kinds to the existing AP grayscale pipeline.


## Readable mathematical working (2026-10-27)

The author explicitly requested separate null/alternative lines, no horizontal scrolling to read mathematical working, more expression-selection questions, and fuller explanations. Use structured hypothesis pairs and explicit display-math choices. Align short working at relation signs, defining intermediate quantities rather than forcing a wide formula into one line. Measure nested choice mathematics when fitting grids. At ordinary narrow-desktop widths up to 1,100 CSS pixels, stack the question and explanation panes; preserve calculator-mode layout. This supersedes the earlier math-scroll allowance.

Keep a mixture of expression selection and numerical answers. Explanations must justify the procedure and connect the data to the formula and contextual conclusion. AP scoring-guide boxes inform that method but are not text to copy.


## Full workspace for the active solution (2026-10-27)

Ben reported clipped explanation content and requested collapsing the question whenever a solution or calculator is viewed. Hide the question from layout and accessibility while either view is open. Let the explanation use the full workspace with automatic vertical scrolling. Keep calculator steps and hardware together, with a direct Question return. Closing, Escape or changing questions restores the question. This supersedes stable question-width and question/solution stacking rules above.


## Clarified navigation collapse (2026-10-27)

Ben clarified that the Courses/Units/Questions navigation should collapse, not the question card. Opening either explanation or calculator collapses the expanded navigation content through the shared route control. The narrow navigation handles remain available. Keep the question visible alongside the explanation or calculator panes; retain responsive stacking and automatic vertical explanation scrolling. Closing a solution does not reopen navigation automatically. This supersedes the full-workspace decision immediately above.


## Earlier-unit explanations and navigation typography (2026-10-27)

Ben requested the fuller Unit 3 explanation style for Units 1 and 2. Add question-specific method justification, reference-group reasoning, interpretation and relevant limits while retaining concise existing working. Keep warnings focused and preserve all question targets and calculator guidance. Increase the route pane’s unit and lesson title sizes with natural wrapping and vertical list scrolling. Preserve the clarified navigation-collapse behavior.
