# Practice Library instructions

Before adding or revising questions, use the `practice-library-question-author` skill in `.claude/skills/practice-library-question-author/` and read the references it routes you to.

Treat `src/` as the only authoring source of truth. Never reconstruct content or design rules from `dist/`, because `dist/` is generated deployment output. Preserve the static SPA, course manifest, unit module, and shared-renderer architecture unless the user explicitly chooses a different system.

After any content or application change, run:

```sh
npm run check
npm run build
```

Do not claim human or physical-calculator verification unless it actually occurred and is recorded.
