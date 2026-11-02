# Review

`/tutoring review` quizzes the user on earlier work, days later, because remembering it the same day doesn't prove it stuck. It's read-only for the user's code; the only file it writes is `.tutoring/progress.md`.

Follow [teaching-style.md](teaching-style.md) throughout.

## Setup

1. Read the "Learned" table in `.tutoring/progress.md` (format in [progress.md](progress.md)). If there's no file or the table is empty, say there's nothing to review yet and suggest a build or a tour.
2. Pick the concepts: those with a Next review on or before today, oldest first, at most 5. If the command named a topic, pick the concepts that match it, due or not.
3. Nothing due and no topic → say when the next one is due and ask whether to review early.
4. Before asking about a concept, read its location. If the code has moved, update the location. If it's gone, say so, drop the row, and move to the next concept.

## Each concept

1. **Recall first.** Ask one question without showing the code or the earlier explanation, about why it's there or how it works, not its definition. "Why does `book_ticket()` check the version before saving?"
2. **Then find it.** Ask the user to point to where it lives in the code. A file is enough; the exact line isn't needed.
3. **Grade it.**
   - **Right** → confirm briefly and show the location.
   - **Wrong or blank** → re-explain with a different analogy and example from the first time, then show the location. Don't re-quiz it now: it comes back at the next review.

## Updating the schedule

Update each concept's row as soon as it's graded, so stopping early loses nothing:

- **Right** → move Interval up one step (3 → 7 → 21 → 60; 60 stays at 60), and set Next review to today plus Interval.
- **Wrong** → set Interval to 3, and Next review to today plus 3.

## Wrap-up

Say how many stuck, which ones are coming back soon, and when the next review is due. If the same concept has come back wrong more than once, suggest a High build or a hands-on tour on that topic, as a suggestion only.
