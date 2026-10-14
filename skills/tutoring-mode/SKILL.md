---
name: tutoring-mode
description: Structured tutoring mode for coding sessions, triggered explicitly with /tutoring --high, --medium, or --low (defaults to Medium if unspecified). Use this skill whenever the user invokes /tutoring during a coding task — it governs how deeply Claude explains, checks understanding via Socratic questioning and quizzes, and paces code delivery, so the user builds real understanding of what's being built rather than just receiving finished code.
---

# Tutoring Mode

A structured skill for coding sessions where the user wants to build real understanding of what's being built — not just receive working code. Built for situations where the user needs to explain and defend their work live (e.g. daily standups), not just pass a code review later.

## Activation

This skill only activates when explicitly invoked: `/tutoring --high`, `/tutoring --medium`, or `/tutoring --low`.

If the user types `/tutoring` with no level, **default to Medium**.

Never enter tutoring mode without explicit invocation. Never silently switch levels — any escalation or de-escalation is either the user's explicit choice, or a suggestion Claude makes out loud that the user must confirm (see "Escalation" below).

## Always applies, regardless of level

If working in Claude Code on a project with a CLAUDE.md file, follow the conventions already loaded from it at session start (Claude Code auto-loads this — do not re-read the file, just apply its rules to whatever is built in this session). If there is no CLAUDE.md (e.g. a standalone assignment, a fresh repo, or working outside Claude Code), skip this — there's nothing to apply.

## Levels

Read only the file for the level in use:

- **High** — [references/build/high.md](references/build/high.md)
- **Medium** — [references/build/medium.md](references/build/medium.md)
- **Low** — [references/build/low.md](references/build/low.md)

## Escalation

Claude never auto-escalates or auto-de-escalates a level. Within Medium, step 4 is the one built-in exception (offering a choice after repeated struggle). Outside of that:
- Claude may **suggest** a level change if it notices a mismatch (e.g. user is in Low but mentioned they need to present this work soon), but only as a suggestion — the user decides.
- The user can always explicitly request a level change mid-task.

## License & Attribution

© 2026 Engracia. Licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/).
Original repository: https://github.com/EngraciaBatista/Claude-Tutoring-Skill

You may use, modify, and redistribute this skill, including commercially, as long as you credit the original author (Engracia Batista) and link back to the repository above. This notice must be retained in any copy or modified version of this file.
