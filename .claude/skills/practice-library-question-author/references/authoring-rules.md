# Authoring rules

## Archetypes and originality

An archetype is stable when the correct-answer logic and the distractor misconception map are stable. Context, names, numerical values, display choice, and surface wording form variants. If the required reasoning or misconception map changes, create a new archetype.

Use the project style guide, CED topic profiles, archetype records, existing authored cards, and prior review notes as layered evidence. Do not treat any single finished card as the specification. Every new question must be fresh and original; do not copy an exemplar's prose or simply swap nouns and numbers.

## Construction order

1. State the learning target and archetype.
2. Choose a coherent context and numerical structure.
3. Compute the correct result independently.
4. Write the correct option.
5. Create three distractors, each tied to a named misconception or procedural error.
6. Check that only one option is defensible and that no wording cue reveals it.
7. Write the explanation from the reasoning, not by paraphrasing the option.
8. Add the warning by contrasting the correct logic with the actual distractor traps.

Record `archetype`, `variant`, and `provenance.optionRoles` when the source evidence supports them. Preserve `null` for unknown migrated metadata.

## Wording and display

- Use concise AP-style prose and define the reference population clearly.
- Put necessary information in the scenario, prompt, or structured stimulus; avoid ornamental data.
- Keep units and rounding instructions consistent.
- Use four answer choices. Default visual layout is 2×2, but the renderer may switch to one column for long choices.
- Keep mathematical expressions intact and follow `math-authoring.md`. Inline and display mathematics are different content modes; do not use HTML line breaks to turn inline math into multi-line working.
- Tables, plots, diagrams, and simulations must be readable, labelled, and instructionally meaningful.

## Solutions and review

Solutions use ordered reasoning steps plus a focused `warning`. Remove repeated filler phrases. Verify all arithmetic independently from the displayed answer, and check alignment among the keyed letter, option text, solution, stimulus, and calculator result.

Tool or AI checks do not constitute human approval. Use precise review language such as “AI and tool verified; no recorded human sign-off.”
