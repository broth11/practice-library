# AP multiple-choice style rules

A public paraphrase of the archetype library's `style_guide.json` (rules S1 to S24). The private original also cites the AP items that evidence each rule; those citations and all AP text are left out here. Rule numbers match the original so the two can be cross-checked.

## Item shape

- **S1** Exactly four options, A to D, one correct.
- **S2** Never "all of the above", "none of the above", or combined options.
- **S3** Order: scenario, then the stimulus (if any), then the ask as its own paragraph, then an optional glossary line, then the options.
- **S4** When there is a stimulus, the scenario ends with a sentence that points to it ("The results are shown in the table.").
- **S5** A glossary line defines an everyday or domain word a multilingual student may not know, never a statistical term. Form: `term: definition`, lowercase, no final period.
- **S6** Underline negations and narrowing quantifiers (not, least, at least; occasionally must, cannot, false). Record them in `emphasis`. Do not emphasize most or best.
- **S7** Use the standard ask forms: "Which of the following ...?", "Which statement is (not) supported by the ...?", "What proportion of ...?", "Which of the following is closest to ...?".

## Options

- **S8** Options are grammatically parallel. Sentences end with a period, noun phrases do not.
- **S9** Decimal and integer options in ascending order. Fraction options are grouped by shared numerator or denominator rather than sorted.
- **S10** Comma thousands separators. Spell out a unit with its abbreviation on first use, then abbreviate. Money as "$1.50 per gallon".
- **S11** Proportions are unreduced fractions built from table values (20/320, not 1/16), or decimals to two places when the ask says approximately or closest to.
- **S17** Balance key positions across a set. With ascending numeric options, choose the data to place the key.
- **S23** One build may fill two options when they differ in substance.
- **S24** A card's ordering note fixes option order only when it says so; otherwise key letters follow S17.

## Rationale

- **S12** The rationale names the values or reasoning that make the key correct. For a "not supported" key, it gives the value that contradicts the statement.
- **S18** A rounded decimal may use = or ≈. Be consistent within an item.

## Context and novelty

- **S13** Realistic, neutral, school-appropriate contexts. A named individual is optional.
- **S16** A generated item needs a new context, new numbers, and new category names. Ask templates and the stimulus-pointer sentence may follow an exemplar's frame, as AP itself reuses frames. Scenario sentences must not be close paraphrases of an exemplar.
- **S21** A build outside a variant's observed builds, or marked `ced_derived`, is allowed but must be flagged (here, in `provenance.extensions`).
- **S22** A card's measured length ranges govern. Thin ranges (fewer than five exemplars) may be exceeded by up to 20 percent when a build needs the words; flag it (here, in `provenance.lengthReview`).

## Graphs and tables

- **S14** Print-friendly graphs: grayscale fills (black, light gray, dark gray, white, hatched) or a single blue family; a bold title above when present; axis titles on both axes; a boxed legend to the right or below for several series. Relative-frequency axes use decimals or percents, never both. Density curves carry no vertical axis. `scripts/diagrams/build_diagrams.py` applies this style.
- **S15** Two-way tables label totals "Total" and may carry a centered title and variable names over the headers.
- **S19** Every value that decides an option sits on a gridline or is decidable with bounds at the grid resolution. Where the variant allows, place at least one deciding value between gridlines to match AP difficulty. Record the check in `provenance.boundsCheck`.
- **S20** "Positive" or "negative" association applies only to ordered explanatory categories with a yes/no response. With a nominal explanatory variable, a direction claim is a distractor.
