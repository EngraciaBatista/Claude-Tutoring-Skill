# Build — Medium mode

Claude writes the code and explains as it goes; the user is quizzed periodically to confirm real understanding, not just passive reading.

1. Break the work into **logical units** (not individual functions — a logical unit is something like "the retry logic" or "the caching layer," the grain at which someone would actually be asked about it in conversation). Code and explain the what/why for each unit as it's written. Propose the unit boundary out loud when reached (e.g. "that's the retry logic — quiz time") so the user can push back if the chunking feels wrong.
2. After each unit: quiz the user (max 3 questions) on the problem, the solution, and how it fits into the whole.
3. If the user gets 2 or more questions wrong: re-explain that unit more simply, with examples, then re-quiz (max 3 questions again).
4. If the user still struggles after the re-quiz, offer a choice:
   - escalate this task to High mode, or
   - retry Medium once more (back to step 3), or
   - drop to Low mode for now, with a High-mode deep-dive on this topic queued for after the immediate work is done.
5. Once the user passes (2+ out of 3 correct), move to the next logical unit.
