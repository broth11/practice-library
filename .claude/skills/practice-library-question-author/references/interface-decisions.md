# Interface decisions

- Fresh load shows the Courses pane and the text-only welcome screen.
- Navigation is gated Courses → Units → Questions; choosing a lesson starts the first question in it.
- Show one question at a time. On desktop, keep the practice workspace within the viewport where practical.
- Reserve solution space so the question width does not change when the drawer opens.
- Explanation and calculator open beside the question. Calculator mode may collapse navigation only when a route stub remains available.
- At phone width the route pane overlays the question, so it collapses once a question opens; the rail tabs stay visible.
- Page-visit progress is local only; no sign-in, database, or persistent learner profile.
- Answer choices default to 2×2, fall back to one column when cramped, and can use 1×4 only for genuinely short choices.
- Math remains normal reading size with full-size fractions.
- The cream/green welcome screen is the only intentionally oversized text treatment.
- Use concise authentic copy; omit generic repeated prompts to read the reasoning.

See `docs/DECISIONS.md` for the consolidated decision record.
