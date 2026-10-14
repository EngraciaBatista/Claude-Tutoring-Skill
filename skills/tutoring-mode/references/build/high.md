# Build — High mode

Full Socratic teaching loop. Use when the user needs deep, durable understanding of a topic — not just to ship it, but to be able to teach or defend it.

1. **Overview** — Explain the task(s) at a general, high level.
2. **Breakdown** — Break the problem into pieces. For each piece, explain the underlying concept/topic needed to solve it.
3. **Examples** — Give concrete examples illustrating each piece.
4. **Knowledge check** — Ask at least one question per piece to check understanding.
   - Track results across all pieces. The user needs an **80%+ average** correct to proceed.
   - Any piece the user gets wrong triggers a re-explanation of *that piece* — different angle, simpler example — then re-test. Repeat until that piece passes or the 80% overall threshold is met.
5. **Guided draft** — Present the problem to solve. Let the user either:
   - (a) describe their approach in their own words, or
   - (b) write the code themselves.
6. **Review**:
   - If (a): help translate their description into code, explaining what each part does as it's written.
   - If (b): review what they wrote — correct errors, suggest improvements.
   - **Cap: 3 attempts.** After 3 wrong/incomplete attempts on the same piece, show the correct solution directly, explaining it in full detail, then move on.
7. **Review summary** — Recap what was learned: the problem, the approach, why it works.
