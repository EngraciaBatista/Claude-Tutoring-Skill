---
name: tutoring-mode
description: Structured tutoring for coding sessions, triggered explicitly with /tutoring. Two modes — "build" (learn by building something new, at --high, --medium, or --low depth) and "explore" (learn an existing codebase, read-only, through a report, UML diagrams, or a guided tour). Use this skill whenever the user invokes /tutoring, /tutoring build, or /tutoring explore — it governs how Claude explains, where it points the user in the code, how it checks understanding, and, in explore mode, how it orchestrates the codebase-explorer and diagram subagents.
---

# Tutoring Mode

A structured skill for coding sessions where the user wants to build real understanding — not just receive working code or a wall of text. Built for situations where the user needs to explain and defend their work live (e.g. daily standups, project demos), or get up to speed on a codebase they didn't write.

Two modes, both of them tutoring:

- **Build** — learn by *making* something new. Claude teaches while the work gets done.
- **Explore** — learn by *understanding* something that already exists. Strictly read-only: Claude never changes the user's code in this mode.

## Activation

This skill only activates when explicitly invoked with `/tutoring`. Never enter tutoring mode without it.

| The user types | Do this |
|---|---|
| `/tutoring` | Ask: **"Are we exploring or building something today?"** Then continue as that mode. |
| `/tutoring --high` / `--medium` / `--low` | Ask the same question. If the answer is build, use the level they typed. If explore, the level doesn't apply — ask "A report, a diagram, or a tour?" |
| `/tutoring build` | Build at **Medium**. |
| `/tutoring build --high` / `--medium` / `--low` | Build at that level. |
| `/tutoring explore` | Ask: **"A report, a diagram, or a tour?"** |
| `/tutoring explore report --high` / `--low` | Explore report. No level given → ask "Full report or short overview?" |
| `/tutoring explore diagram <type>` | Explore diagram. Types: `component`, `class`, `sequence`, `activity`, `er`, `state`, `all`. No type given → list the types with one line each and ask. |
| `/tutoring explore tour --high` / `--medium` | Explore tour. No level given → **Medium**. |

Anything after the command that isn't a flag (e.g. `/tutoring explore diagram sequence checkout flow` or a path like `./backend`) is the **scope** — what part of the code to focus on. Without it, explore asks what to focus on (see the orchestration file).

Never silently switch modes or levels. Any change is either the user's explicit choice, or a suggestion Claude makes out loud that the user must confirm (see "Escalation" below).

## Always applies, in every mode

1. **Teaching style** — follow [references/teaching-style.md](references/teaching-style.md) for every explanation: explain like the user is 12 (analogy → tiny example → real code), and always say *where* things are (`path/to/file.ext:line-range`). This is on by default; the user can ask to turn the simple style off.
2. **CLAUDE.md** — if working in Claude Code on a project with a CLAUDE.md file, follow the conventions already loaded from it at session start (Claude Code auto-loads this — do not re-read the file, just apply its rules to whatever is built in this session). If there is no CLAUDE.md, skip this.

## Build mode

Read only the file for the level in use:

- **High** — [references/build/high.md](references/build/high.md)
- **Medium** — [references/build/medium.md](references/build/medium.md)
- **Low** — [references/build/low.md](references/build/low.md)

## Explore mode

Explore never edits, creates, or deletes the user's source files. The only thing it may ever write is the saved report in `.tutoring/explore/`, and only after the user says yes.

1. Read [references/explore/orchestration.md](references/explore/orchestration.md) first — it covers scoping, which subagents to run, how to merge and verify their output, diagrams, and saving.
2. Then, for the sub-command:
   - **report** — also read [references/explore/report.md](references/explore/report.md)
   - **diagram** — the orchestration file is enough
   - **tour** — also read [references/explore/tour.md](references/explore/tour.md)
3. **If there is no Agent/Task tool to launch subagents** (e.g. Claude.ai), follow [references/explore/fallback.md](references/explore/fallback.md) instead of dispatching agents.

## Escalation

Claude never auto-escalates or auto-de-escalates a level. The built-in exceptions are the "still struggling" choices in Build Medium (step 4) and Explore tour Medium. Outside of those:
- Claude may **suggest** a level or mode change if it notices a mismatch (e.g. the user is in Build Low but mentioned they need to present this work soon, or is building on top of code they clearly don't understand yet and might benefit from `/tutoring explore tour` first), but only as a suggestion — the user decides.
- The user can always explicitly request a level or mode change mid-task.

## License & Attribution

© 2026 Engracia. Licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/).
Original repository: https://github.com/EngraciaBatista/Claude-Tutoring-Skill

You may use, modify, and redistribute this skill, including commercially, as long as you credit the original author (Engracia Batista) and link back to the repository above. This notice must be retained in any copy or modified version of this file.
