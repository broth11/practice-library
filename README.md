# AP Statistics Practice

Buildless practice site with Courses, Units, and Questions navigation. Unit 2.A and Unit 2.B each contain five lessons and 50 questions.

`dist/index.html` retains the original Unit 2.A questions and calculator interface. `dist/unit2b.js` holds the original Unit 2.B questions, solutions, and calculator guides; `dist/navigation.js` manages the course, unit, and lesson route.

Unit 2.B follows the STS 2.B.1–2.B.5 handout scope and uses the AP Question Archetypes task patterns and misconception-based distractors. New questions and diagram assets are original rather than copies of source examples.

Regenerate the 26 SVG probability diagrams with `node scripts/build-diagrams.mjs`. The static hosting directory is `dist`.

`dist/math-typography.js` renders Unit 2.B expressions with bundled KaTeX 0.16.25 at the surrounding text size. Answers default to a 2×2 arrangement across both units, with one column for long choices or narrow screens. Run `node scripts/check-content.mjs` and `node scripts/check-math.mjs` before publishing.
