# Explore — tour

A guided walk through an existing codebase, one piece at a time, checking understanding as it goes. Read-only: the user explores and answers, nothing in the code changes.

Follow [../teaching-style.md](../teaching-style.md) throughout — simple language with analogies and examples, find-it-first prompts, and a location for everything.

## Setup (both levels)

1. **Get the map.** Reuse an existing one if possible (from this session, or `.tutoring/explore/map.md` — see [orchestration.md](orchestration.md) step 2). Otherwise run the explorer and `diagram-component`. For a large codebase, start from a `skeleton` map and go `deep` on each unit only when the tour reaches it (orchestration step 2) — the user may stop before the end, and unvisited units never get paid for.
2. **Show the big picture.** The component diagram with its "How to read it" bullets.
3. **Plan the tour.** Split it into **units** — usually one per component, or one per flow if the user's focus is a feature. Order them the way someone should learn them: start where requests come in, follow the data, end at storage/outside services (the map's reading guide helps). Present it as a checklist and let the user change it:
   ```
   Tour:
   [ ] 1. How requests come in      (src/api/)
   [ ] 2. The booking logic         (src/services/booking.py)
   [ ] 3. How data is saved         (src/db/)
   ```
4. Show the updated checklist at each unit boundary.

## Each unit (both levels)

1. **Where this lives** — files and what each is for. Point to the box on the component diagram.
2. **Find it first** — ask the user to open the main file and find the key block before explaining it.
3. **Explain** — what it does, why it exists, how it works (analogy → tiny example → the real code with line ranges), and how it connects to the units before and after.
4. Offer a diagram if it would help this unit (e.g. a sequence diagram for a flow, a class diagram for a component with many classes) — dispatch the diagram agent on request.

Then the check, which depends on the level.

## `tour --medium` — guided tour with quizzes (default)

5. **Quiz** — up to 3 questions on what the unit does, where it lives, and how it connects to the rest. **Pass:** with 3 questions, 2 or more right; with 1–2 questions, all right.
6. **Didn't pass** → re-explain the unit more simply, with a **different** analogy and example, then quiz again (up to 3 questions).
7. **Still struggling** → offer a choice:
   - switch this unit to High (hands-on tasks, which sometimes click better than questions),
   - try Medium once more, or
   - skip it for now and come back to it at the end of the tour.
8. **Pass** (as defined in step 5) → tick the unit off, move on.

## `tour --high` — hands-on tour

5. **Hands-on tasks** — 2–4 per unit, done in the real code, from these kinds:
   - **Predict, then check** — "What happens if the password is empty? Guess first, then find the line that decides." The user commits to a guess before looking.
   - **Trace it** — "Follow a booking from the endpoint to the database. List each file and function it passes through."
   - **Find it** — "Where is the ticket price calculated? Give me the file and line."
   - **Explain it back** — "Explain this unit to me as if I'm a new teammate on my first day."
6. **Review each answer** — confirm what's right, explain what's off and why, give a hint that points in the right direction before giving the answer.
7. **Cap: 3 attempts** per task. After 3, show the answer with its location and explain it fully, then move on.
8. **Pass** — with 3–4 tasks, all but one right; with 2 tasks, both right (each within its 3 attempts) → tick it off. A percentage doesn't work at this size (80% of 4 tasks would mean all 4). Below that, re-explain the parts that were missed with a different angle and give one new task on them.

## Wrap-up (both levels)

- **What you now know** — one line per unit.
- **Your map of the code** — the key files and line ranges covered, as a list the user can come back to.
- **Still open** — skipped units and any questions the user had that weren't answered.
- Offer to save (see [orchestration.md](orchestration.md) step 6) so the map and diagrams can be reused next time.
