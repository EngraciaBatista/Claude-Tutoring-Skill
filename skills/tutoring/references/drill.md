# Drill

`/tutoring drill` is practice for being asked about the work out loud. Claude plays a sceptical teammate and the user defends what they built. It's read-only for the user's code; the only file it writes is `.tutoring/progress.md`.

| Command | Practice for |
|---|---|
| `/tutoring drill` or `/tutoring drill --standup` | A quick update, with short follow-ups from the team |
| `/tutoring drill --demo` | Showing the work, with harder questions about why it was built this way |

Anything else after the command is the topic, e.g. `/tutoring drill --demo retry logic`.

## Setup

1. **Find the topic.** Use the one in the command. Otherwise use recent work: "Current session" and "Learned" in `.tutoring/progress.md` if they exist, then `git log --oneline -5`. Confirm it in one line.
2. **Read just enough.** Read the code behind the topic, by line range, using the explore map if it has this area. Every challenge must come from real code: never invent a bug, a requirement, or something a teammate "said".

## The drill

1. **Opening.** Ask the user to give their update as they'd say it out loud. Standup: about 30 seconds. Demo: what it does and how it works.
2. **Follow-ups, staying in character.** Ask one question at a time, and base each on what they just said. Standup: 2–3 questions. Demo: 4–5, getting harder. Don't teach or correct during the drill.
   - Why this approach? What else did you consider?
   - What happens if this fails, or two of these happen at once?
   - How do you know it works? What did you test?
   - Where's that in the code?
   - What would you do differently next time?

   Be sceptical, not unkind: push on the work, never on the person.
3. **Stopping.** The user can say "stop" or "help" at any point to step out of character.

## Feedback (out of character)

- **What landed** — the answers that were clear and correct.
- **What was shaky** — each weak answer, what a strong answer would have included, and where that lives in the code.
- **A better version** — their opening, rewritten the way they'd say it out loud.

There's no pass mark. Offer one more round on the weakest answer. If the file exists, add each shaky concept to "Learned" (next review in 3 days, interval 3, missed 1). If it's already there, set Interval to 3, Next review to today plus 3, and add 1 to Missed.
