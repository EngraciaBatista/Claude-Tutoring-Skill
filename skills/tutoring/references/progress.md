# Progress file

`.tutoring/progress.md` in the user's project is what lets a session be picked up later (`/tutoring resume`) and what `/tutoring review` quizzes from. Used by Build, Explore tour, Review, and Drill. Reports and diagrams don't touch it.

## At the start of a session

If `.tutoring/progress.md` exists, read it before doing anything else:

- **"Current session" holds something unfinished, and the user started something else** → ask whether to resume it or drop it. Dropping it never touches "Queued" or "Learned". Build Low only asks if it would replace that session; it doesn't keep one of its own.
- **"Queued" has items** → mention them in one line.

## Asking first

Ask once, before the first write in a project (for Build High, Build Medium, and tours, that's as soon as the plan or first unit is agreed): **"Want me to keep your progress in `.tutoring/progress.md`, so you can resume this later and review it in a few days?"**

- **Yes** → if the project is a git repo and `.tutoring/` isn't already ignored, ask whether to add it to `.gitignore`. Do what they answer.
- **No** → carry on without it, and don't ask again this session. Resume and review won't have this session to work from.
- **The file already exists** → they've already agreed. Don't ask.

This file is the only thing a tour, a review, or a drill may write, apart from what they'd already be allowed to save. No local project folder (e.g. Claude.ai) → skip the file, and at the end offer the same content as a download the user can upload next time.

## Format

```
# Tutoring progress

## Current session
Mode: <e.g. build --high, explore tour --medium>
Task: <what is being built or toured>
Experience: <new | some | comfortable — see teaching-style.md>
Started: <YYYY-MM-DD>   Last worked on: <YYYY-MM-DD>
Plan:
[x] 1. Add a version number to the Ticket table   (db/models.py)
[ ] 2. Check the version when saving              (services/booking.py)
Next: <the exact next step, e.g. "user is on attempt 2 of the TODO in book_ticket()">

## Queued
- <concept, deep-dive, or skipped unit to come back to> (from: <task>, <YYYY-MM-DD>)

## Learned
| Concept | Where | Learned | Next review | Interval (days) | Missed |
|---|---|---|---|---|---|
| Optimistic locking | `services/booking.py:30-58` | 2026-11-02 | 2026-11-05 | 3 | 0 |
```

Use the date from the session; if there isn't one, run `date`.

## When to write

Write at boundaries only, never every turn:

- **The plan or first unit is agreed** → write "Current session", so a session that stops during the first step can still be resumed.
- **A subtask or unit is ticked off** → update Plan and Next, and add what it taught to "Learned" (one row per concept, next review in 3 days, interval 3, missed 0).
- **The user stops partway** → update Next so the session can restart from the exact spot.
- **Something gets queued or skipped** → add it to "Queued".
- **The task or tour is finished** → remove "Current session", and list anything in "Queued" that came from it, offering to do it now. Keep "Queued" and "Learned".
- **A queued item is dealt with, or the user drops it** → remove it from "Queued".

A concept the user skipped with "I know this" doesn't go in "Learned" — it wasn't taught.

Build Low doesn't keep a "Current session": it adds to "Learned" only.

## `/tutoring resume`

1. Read `.tutoring/progress.md`. If it's missing or has no "Current session", say there's nothing to resume, and offer `/tutoring review` if "Learned" or "Queued" has anything in it.
2. Say in two lines where things stand: the task, what's done, and what's next.
3. Read the file for that mode and level as usual, and pick up at Next. Don't redo finished subtasks or units. Reuse Experience instead of asking again.
4. Line numbers in the file may be out of date. Re-check any location before quoting it (see "Line numbers must be real" in [teaching-style.md](teaching-style.md)).
