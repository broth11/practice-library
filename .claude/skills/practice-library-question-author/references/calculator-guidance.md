# fx-CG50 calculator guidance

Add a guide only when it makes the reasoning or execution clearer. If mental or definitional reasoning is the point, set `needed: false` and explain why.

## Step boundaries

- A new menu or meaningfully different screen deserves its own step.
- Entering one complete arithmetic expression and pressing EXE is one step.
- Do not split a number into one step per key.
- Put navigation arrows above the calculator screen.
- Use retained digits through intermediate work and round only at the requested endpoint.

## Accuracy

Calculate the displayed results from the inputs. Never type a remembered result into the simulation. For distribution work, check routes and field order against the fx-CG50 Skill Finder master cards (`source-map.md`) before authoring. `scripts/check-calculator.mjs` enforces the routes and field orders those cards record, recomputes every arithmetic screen exactly, and compares every distribution result with an independent implementation.

## Project conventions not taken from the Skill Finder

These come from earlier Practice Library sessions. They are deliberate, and each still awaits a physical-calculator check:

- A `Select Save Res: None` step before Execute.
- `−1 × 10⁹⁹` and `1 × 10⁹⁹` (keys NEG 1 EXP 9 9) for an unbounded normal tail.
- One step per field selection in a distribution form, since each selection is a distinct screen state. The shared renderer supports arithmetic steps, distribution descriptors, and data-driven `followUps` for a second distribution or arithmetic operation. Extend those shared descriptors instead of hard-coding a question ID.

Preserve the calculator's tall 648:1348 body proportion (an explicit design requirement; its measurement source is not recorded), the 384:216 screen proportion (from the Skill Finder's LCD), and the original menu icons (copied byte-for-byte from the Skill Finder). Directions and explanations use the same reading size as the question.

Physical fx-CG50 verification is still unrecorded. Do not claim it. Record tool validation separately from human or device sign-off.
