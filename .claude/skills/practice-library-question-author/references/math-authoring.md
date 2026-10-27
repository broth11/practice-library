# Mathematical notation and KaTeX

Use KaTeX for the library's mathematical typesetting. It covers the expected curriculum, including fractions, roots, probability notation, matrices and determinants, vectors, limits, derivatives, partial derivatives, integrals, summations, piecewise definitions, and aligned systems. Before depending on an unusual TeX command, check the official [supported-functions reference](https://katex.org/docs/supported) or [support table](https://katex.org/docs/support_table).

## Choose the content mode

Use **inline math** only for a compact expression that belongs inside a sentence, such as `P(A \\mid B)=0.4`, `\\vec v`, or `f'(x)`.

Use **display math** when the expression is a complete line or when its vertical layout carries meaning. This includes:

- full-size fractions presented as working;
- two or more aligned calculation lines;
- matrices, determinants, and column vectors;
- systems of equations and piecewise functions;
- limits, sums, and integrals with prominent bounds;
- derivations that use alignment points.

Never place `<br>` inside an inline math container. A line break does not change KaTeX from inline to display layout, so tall fractions can collide with the next line. Use one display block with `aligned`, or separate display blocks when the lines are independent.

For example, prefer:

```tex
\\begin{aligned}
\\text{East: } & \\frac{18}{60}=0.30 \\\\
\\text{West: } & \\frac{42}{70}=0.60
\\end{aligned}
```

over two inline fractions separated by an HTML break.

## Status

Display math nodes are implemented for solution steps and checked by `scripts/check-math.mjs`, which also rejects `<br>` inside an inline math span. Other fields still use the legacy prose detector; see `data-contract.md`.

## Authoring contract

- Store TeX explicitly for nontrivial notation. Do not ask the prose auto-detector to infer matrices, vector notation, calculus, or aligned work.
- Keep prose outside TeX unless words are structurally part of the expression; use `\\text{...}` sparingly inside a display.
- Use semantic commands: `\\frac`, `\\vec` or `\\mathbf`, `\\begin{bmatrix}`, `\\lim`, `\\sum`, `\\int`, `\\partial`, `\\begin{cases}`, and `\\begin{aligned}`.
- Prefer standard supported KaTeX commands over custom macros. If a repeated house macro becomes necessary, define and document it centrally rather than inside one question.
- Keep the original TeX in authored JSON. Generated KaTeX HTML is deployment output, never source content.
- Treat a KaTeX parse error as validation failure. Do not silently publish unrendered TeX or replace it with a screenshot.

## Rendering and accessibility

Render through the shared math component with KaTeX's HTML and MathML output. Inline expressions remain part of the surrounding sentence; display expressions receive their own block spacing and overflow handling. Long working must be authored as several short lines aligned at the equals or other relation sign. Do not rely on horizontal scrolling, clipping, or tiny type. Define intermediate quantities for long variance sums and calculate interval endpoints on separate lines when needed. Verify the narrow desktop solution column as well as phone width.

Review representative content at desktop and narrow widths. Check fraction clearance, matrix delimiters, alignment, integral and summation bounds, wrapping around inline expressions, and the MathML/accessibility tree. The source TeX, visible result, keyed answer, and solution must agree.
