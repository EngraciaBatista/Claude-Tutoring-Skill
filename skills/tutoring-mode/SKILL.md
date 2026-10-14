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
| `/tutoring --high` / `--medium` / `--low` | Ask the same question. If the answer is build, use the level they typed. If explore, ask "A report, a diagram, or a tour?" and carry the level over when that sub-command has it (report: `--high`/`--low`; tour: `--high`/`--medium`). If it doesn't (e.g. `--medium` → report, `--low` → tour), follow the invalid-level rule below. Diagrams have no levels — ignore it. |
| `/tutoring build` | Build at **Medium**. |
| `/tutoring build --high` / `--medium` / `--low` | Build at that level. |
| `/tutoring explore` | Ask: **"A report, a diagram, or a tour?"** |
| `/tutoring explore report --high` / `--low` | Explore report. No level given → ask "Full report or short overview?" |
| `/tutoring explore diagram <type>` | Explore diagram. Types: `component`, `class`, `sequence`, `activity`, `er`, `state`, `all`. No type given → list the types with one line each and ask. |
| `/tutoring explore tour --high` / `--medium` | Explore tour. No level given → **Medium**. |
| A level the sub-command doesn't have (`explore report --medium`, `explore tour --low`, a level on `explore diagram`) | Don't pick one silently. Say which levels exist for it and ask, e.g. "Reports come in `--high` (full) or `--low` (short) — which one?" For a diagram, say diagrams have no levels and continue. |

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

**Every level — keep the session lean.** Build sessions get expensive by growing, since every turn re-reads the whole conversation. So:

1. **Finding code (in this order):**
   - **Use the explore map if it covers the area.** If `.tutoring/explore/map.md` exists, use its locations instead of searching — but only for components marked `depth: deep` that cover the area of this task. A skeleton part, or an area the map doesn't include, is only a hint about where to look: find the exact lines another way (below).
     - Commit known → run `git diff --name-only <map commit> HEAD`; re-read only the changed files before quoting their lines.
     - `Commit: unknown`, or the diff fails (not a git repo, rebased history) → you can't tell what changed, so treat every map location as a hint and re-check each line before quoting it.
   - **Otherwise send `code-locator`** (if installed) with the question ("where is login handled?", "where would a new endpoint go?") and any map locations you have. It returns file:line locations only, so the search itself never enters this conversation.
   - **Otherwise search narrowly yourself:** Grep first, then read only the line ranges you need.
2. **Let tools check the code.** After the user writes code (High) or after each unit (Medium), run the project's relevant tests and linter if it has them, and review with their results instead of reasoning through every line by hand.
3. **Compact at boundaries.** Keep the subtask/unit checklist as the running state. When a session gets long, suggest `/compact` (Claude Code) at a subtask or unit boundary — never mid-explanation — and carry the checklist and the files touched forward.

## Explore mode

Explore never edits, creates, or deletes the user's source files. The only thing it may ever write is the saved report in `.tutoring/explore/`, and only after the user says yes.

1. Read [references/explore/orchestration.md](references/explore/orchestration.md) first — it covers scoping, which subagents to run, how to merge and verify their output, diagrams, and saving.
2. Then, for the sub-command:
   - **report** — also read [references/explore/report.md](references/explore/report.md)
   - **diagram** — the orchestration file is enough
   - **tour** — also read [references/explore/tour.md](references/explore/tour.md)
3. **Use the fallback** — follow [references/explore/fallback.md](references/explore/fallback.md) instead of dispatching agents — when either:
   - there is no Agent/Task tool to launch subagents (e.g. Claude.ai), or
   - the agents aren't installed: `codebase-explorer` and the `diagram-*` agents don't appear in the available agent types, or a dispatch fails because the agent type is unknown (e.g. only the skill folder was copied). Tell the user once that the agents weren't found and explore will run without them.

## Escalation

Claude never auto-escalates or auto-de-escalates a level. The built-in exceptions are the "still struggling" choices in Build Medium (step 4) and Explore tour Medium. Outside of those:
- Claude may **suggest** a level or mode change if it notices a mismatch (e.g. the user is in Build Low but mentioned they need to present this work soon, or is building on top of code they clearly don't understand yet and might benefit from `/tutoring explore tour` first), but only as a suggestion — the user decides.
- The user can always explicitly request a level or mode change mid-task.

## License & Attribution

© 2026 Engracia. Licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/).
Original repository: https://github.com/EngraciaBatista/Claude-Tutoring-Skill

You may use, modify, and redistribute this skill, including commercially, as long as you credit the original author (Engracia Batista) and link back to the repository above. This notice must be retained in any copy or modified version of this file.
