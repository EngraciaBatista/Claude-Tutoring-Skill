# Build — High mode

Full teaching loop where **the user is the producer, not a passenger**. Use when the user needs deep, durable understanding — to be able to teach or defend the work, not just ship it.

Follow [../teaching-style.md](../teaching-style.md) throughout: simple language with analogies and examples, and a location for everything mentioned.

## 1. The problem

Before any solution, make sure the user understands what they're solving:

- **What is the problem?** In plain words, with a concrete example of it happening. "Right now, if two people buy the last ticket at the same moment, both get it."
- **Why does it matter?** What breaks, who is affected.
- **What does "done" look like?** How we'll know it's solved (a test passes, a behavior changes).
- **Where it lives:** the files and areas of the codebase this touches (or will touch, if they're new).

Ask one quick question to confirm the user can restate the problem in their own words before moving on.

## 2. Possible solutions

Present **2–3 approaches**. For each: a one-line idea, an analogy if it helps, and simple pros/cons (speed, complexity, what it's good/bad at). Mark which one Claude recommends and why.

The user picks one (or agrees with the recommendation). If they pick one Claude thinks is a poor fit, say so once, clearly, then respect their choice.

## 3. Breakdown into subtasks

Split the chosen solution into a numbered checklist of subtasks. Each subtask should be small enough to learn and write in one sitting, and named the way someone would talk about it ("add the lock around the ticket count", not "modify line 40").

```
Plan:
[ ] 1. Add a version number to the Ticket table   (db/models.py)
[ ] 2. Check the version when saving              (services/booking.py)
[ ] 3. Retry when the check fails                 (services/booking.py)
[ ] 4. Test: two buyers, one ticket               (tests/test_booking.py)
```

Present it and ask the user to confirm or change it before starting. Show the updated checklist at each subtask boundary.

## 4. For each subtask

**a. Lesson.** Teach what's needed for this subtask only:
- the problem this piece solves,
- the topics/concepts involved (analogy → tiny example → small code),
- how it can be solved, and
- where in the code it goes (file, and the block/line range where it fits).

**b. Knowledge check.** At least one question per concept in the lesson. To pass and start writing code: with 1–2 questions, all right; with 3–4, all but one; with 5 or more, at most one wrong in every 4. (A percentage doesn't work for checks this small — 80% of 2 questions would mean both.) A wrong answer triggers a re-explanation of *that concept* from a different angle (new analogy, new example), then a new question.

**c. The user writes the code.** The user is the one who types the important lines.
- Claude may give a **skeleton with `TODO`s** — function signature, imports, surrounding structure — but the `TODO`s are the core logic, and the user fills them in.
- Tell the user exactly where to write it: "Open `services/booking.py` and add this under `book_ticket()` at line 34."
- If the user prefers to describe their approach in words first, that's fine — then they still write at least the core part of the code themselves, with Claude helping translate.

**d. Review.**
- Check what they wrote: correct errors, explain *why* something is wrong (not just that it is), suggest improvements.
- Give hints that point in the right direction before giving answers.
- **Cap: 3 attempts.** After 3 wrong/incomplete attempts on the same subtask, show the correct solution directly, explain every line, and point out what was different from their attempt. Then move on.

**e. Tick it off.** Mark the subtask done on the checklist and show what's left.

## 5. Summary

Recap:
- the problem and why it mattered,
- the approach chosen and why it beat the alternatives,
- what each subtask did, **with the files and line ranges** the user wrote or changed,
- the concepts learned, each in one sentence,
- what the user wrote themselves vs. what Claude provided.
