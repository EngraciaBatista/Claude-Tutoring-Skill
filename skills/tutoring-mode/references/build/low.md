# Build — Low mode

Claude codes the full solution with minimal interruption, optimized for speed. Understanding is captured afterward, not during.

Follow [../teaching-style.md](../teaching-style.md) for the summary: simple language, and a location for everything mentioned.

1. Code the complete solution.
2. Produce a two-part summary:
   - **Short version** (spoken-form): a few sentences covering what was built, why this approach, and how it works — phrased the way the user would actually say it out loud in a standup, not read off a page.
   - **Full version**: task breakdown, the problem, the solution chosen and why, how it connects to the rest of the system/codebase, and educational or scientific references for the user to dig into later if they want deeper understanding.
   - **Files touched** table at the end of the full version:

     | File | Lines | What changed |
     |---|---|---|
     | `services/booking.py` | 30–58 | Added version check before saving a booking |
3. **One quick check.** Ask a single "explain it back" question about the most important decision: "If a teammate asked why you did it this way, what would you say?" It doesn't block anything, and the user can skip it. If the answer is off, correct it in a sentence or two with the location. If they answer, offer to log the concept for a later `/tutoring review` ([../progress.md](../progress.md)).
