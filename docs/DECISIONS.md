# Practice Library decision record

This record consolidates the decisions made while developing Units 2.A and 2.B. It is source context for future work, not a reconstruction from the rendered page.

## Content model

- A course contains units; a unit contains lessons; a lesson contains questions.
- The current unit pattern is five lessons with ten questions per lesson. This is a current content target, not a renderer limitation.
- An archetype is defined by answer logic and distractor misconceptions. A changed context, number set, or display is a variant when the logic and misconception map stay the same.
- Questions must be fresh and original. Existing exemplar questions are evidence for structure and style, never text to copy.
- Each authored question records its archetype and, when known, variant and option roles. Missing historical metadata stays explicitly unknown; do not invent it from the finished interface.
- Numerical answers are computed independently. AI/tool verification is not human sign-off, and review status must say so accurately.
- Visuals are included when they materially support the reasoning: tables, discrete/bar displays, shaded binomial or normal plots, and sampling histograms or dotplots.

## Learning experience

- Fresh load opens Courses and a text-only welcome screen. No course, unit, lesson, or question is assumed.
- The selection path is Courses → Units → Questions. Course selection reveals units; unit selection reveals lessons; lesson selection starts practice.
- Only one question is visible at a time. On desktop the practice workspace should fit without page scrolling.
- The question has a stable reading width and permanently reserved solution space so opening a solution does not resize the question.
- Explanations and calculator walkthroughs open alongside the question. The calculator view may collapse the route panel, but a visible route stub must let the user reopen it.
- Progress lasts for the current page visit only. There are no accounts, sign-in, database, or cross-device persistence.
- Answer choices default to a 2×2 layout, fall back to one column when long or cramped, and may use one row of four only for genuinely short choices. Mathematical expressions stay intact, at normal text size, with full-size fractions.
- Remove generic filler such as repeated invitations to read the reasoning. Use the space for the actual reasoning.
- The welcome screen uses the cream/green visual language and is the only place with deliberately enlarged display text.

## Calculator experience

- Preserve the fx-CG50's tall proportions (648:1348) and its 384:216 screen proportion. Use the original menu icons.
- Calculator mode gives the question, keypress explanation, and calculator meaningful full-height panes. Explanations and keypress directions use the question's reading size.
- A separate step is justified by a new calculator menu or screen. Typing an entire arithmetic expression and pressing EXE is one step.
- Navigation arrows sit above the calculator screen.
- Calculations are derived, not typed from a remembered answer. Distribution routes are checked against the supplied calculator guides.
- Physical fx-CG50 verification has not been recorded and must not be claimed.

## Architecture and hosting

- Keep the product a static SPA. A backend is unnecessary until the product needs accounts, synchronized progress, teacher dashboards, or protected content.
- Authoring truth lives in `src/`, never in generated `dist/` HTML or JavaScript.
- Course and unit content is split into JSON modules. The app loads the catalog first, a course manifest after course selection, and a unit only after unit selection.
- Shared renderers own the question card, stimuli, math, navigation, solutions, and calculator. A question is data consumed by those renderers, not a standalone copied HTML card.
- `dist/` is reproducible deployment output. GitHub stores the source, schemas, skill, workflow, and built static files together so Sites and GitHub-oriented hosting can use the same repository.
