# Progress file

`.tutoring/progress.md` in the user's project is what lets a session be picked up later (`/tutoring resume`) and what `/tutoring review` quizzes from. Used by Build, Explore tour, Review, and Drill. Reports and diagrams don't touch it.

## Asking first

Before the first write in a project, ask once: **"Want me to keep your progress in `.tutoring/progress.md`, so you can resume this later and review it in a few days?"**

- **Yes** → if the project is a git repo and `.tutoring/` isn't already ignored, ask whether to add it to `.gitignore`. Do what they answer.
- **No** → carry on without it, and don't ask again this session. Resume and review won't have this session to work from.
- **The file already exists** → they've already agreed. Don't ask.

This file is the only thing a tour, a review, or a drill may write, apart from what they'd already be allowed to save. No local project folder (e.g. Claude.ai) → skip the file, and at the end offer the same content as a download the user can upload next time.

## Format

```
# Tutoring progress
Level of experience: <new | some | comfortable — see teaching-style.md>

## Current session
Mode: <e.g. build --high, explore tour --medium>
Task: <what is being built or toured>
Started: <YYYY-MM-DD>   Last worked on: <YYYY-MM-DD>
Plan:
[x] 1. Add a version number to the Ticket table   (db/models.py)
[ ] 2. Check the version when saving              (services/booking.py)
Next: <the exact next step, e.g. "user is on attempt 2 of the TODO in book_ticket()">
Queued: <deep-dives or skipped units to come back to, or "None">

## Learned
| Concept | Where | Learned | Next review | Interval (days) |
|---|---|---|---|---|
| Optimistic locking | `services/booking.py:30-58` | 2026-11-02 | 2026-11-05 | 3 |
```

Use the date from the session; if there isn't one, run `date`.

## When to write

Write at boundaries only, never every turn:

- **A subtask or unit is ticked off** → update Plan and Next in "Current session", and add what it taught to "Learned" (one row per concept, next review in 3 days, interval 3).
- **The user stops partway** → update Next so the session can restart from the exact spot.
- **Something gets queued or skipped** → add it to Queued.
- **The task or tour is finished** → remove "Current session". Keep "Learned".

A concept the user skipped with "I know this" doesn't go in "Learned" — it wasn't taught.

Starting new work while "Current session" holds something unfinished → ask whether to resume it or drop it. Dropping it never touches "Learned".

## `/tutoring resume`

1. Read `.tutoring/progress.md`. If it's missing or has no "Current session", say there's nothing to resume and offer `/tutoring review` if "Learned" has rows.
2. Say in two lines where things stand: the task, what's done, and what's next.
3. Read the file for that mode and level as usual, and pick up at Next. Don't redo finished subtasks or units.
4. Line numbers in the file may be out of date. Re-check any location before quoting it (see "Line numbers must be real" in [teaching-style.md](teaching-style.md)).
