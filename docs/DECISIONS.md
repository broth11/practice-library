# Practice Library decision record

This record consolidates the decisions made while developing Units 2.A and 2.B. It is source context for future work, not a reconstruction from the rendered page.

Where the decisions came from: the earlier ones were made in prior development sessions and consolidated from those session records, which live outside this repository. Several are corroborated by the Unit 2.A trial package's README and browser-verification records (2×2 answer layout, reserved solution space, calculator proportions, arrows above the screen, per-visit progress). Decisions dated 2026-10-24 were made with the author in the public-release session. See `docs/PROVENANCE.md`.

## Content model

- A course contains units; a unit contains lessons; a lesson contains questions.
- The current unit pattern is five lessons with ten questions per lesson. This is a current content target, not a renderer limitation.
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
