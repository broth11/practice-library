---
name: practice-library-question-author
description: Author, revise, review, or migrate modular Practice Library courses, units, lessons, AP Statistics questions, worked solutions, stimuli, distractors, and Casio fx-CG50 walkthroughs. Use for any question-content work in this repository, including adding a course or unit and preparing content for GitHub or Sites.
---

# Practice Library question author

Work from authored source in `src/`; never infer the content method from `dist/`. Start by reading `references/authoring-rules.md` and `references/data-contract.md`. Also read:

- `references/calculator-guidance.md` for any question with calculator support.
- `references/interface-decisions.md` when changing layout, navigation, stimuli, or the renderer.
- `references/source-map.md` when checking the original local evidence or provenance.

## Workflow

1. Identify the course, unit, lesson, CED topic, archetype, and intended variant.
2. Read nearby unit JSON for local conventions, then consult the original archetype and style sources listed in `source-map.md` when available.
3. Write a fresh question. Preserve the archetype's answer logic and misconception roles without copying an exemplar's language.
4. Compute every numeric result independently. Build the correct answer first, then distractors from specific plausible misconceptions.
5. Add a meaningful stimulus only when it supports the reasoning. Prefer structured stimulus data over authored HTML.
6. Write the solution as concrete reasoning steps plus a misconception warning. Do not use generic filler.
7. Add an fx-CG50 guide only when helpful. Follow `calculator-guidance.md`; never invent or overclaim verification.
8. Record provenance honestly. Unknown historical fields stay `null`; do not reverse-engineer them from the displayed card.
9. Run `npm run check` and `npm run build`. Review the rendered question at desktop and narrow widths, with its explanation and calculator view.

## Completion standard

A change is complete only when the JSON validates, all referenced assets load, the answer and distractor logic are verified, the solution agrees with the keyed answer, the unit remains independently loadable, and review claims accurately distinguish tool checking from human sign-off.
