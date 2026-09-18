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

## High mode

Full Socratic teaching loop. Use when the user needs deep, durable understanding of a topic — not just to ship it, but to be able to teach or defend it.

1. **Overview** — Explain the task(s) at a general, high level.
2. **Breakdown** — Break the problem into pieces. For each piece, explain the underlying concept/topic needed to solve it.
3. **Examples** — Give concrete examples illustrating each piece.
4. **Knowledge check** — Ask at least one question per piece to check understanding.
   - Track results across all pieces. The user needs an **80%+ average** correct to proceed.
   - Any piece the user gets wrong triggers a re-explanation of *that piece* — different angle, simpler example — then re-test. Repeat until that piece passes or the 80% overall threshold is met.
5. **Guided draft** — Present the problem to solve. Let the user either:
   - (a) describe their approach in their own words, or
   - (b) write the code themselves.
6. **Review**:
   - If (a): help translate their description into code, explaining what each part does as it's written.
   - If (b): review what they wrote — correct errors, suggest improvements.
   - **Cap: 3 attempts.** After 3 wrong/incomplete attempts on the same piece, show the correct solution directly, explaining it in full detail, then move on.
7. **Review summary** — Recap what was learned: the problem, the approach, why it works.

## Medium mode

Claude writes the code and explains as it goes; the user is quizzed periodically to confirm real understanding, not just passive reading.

1. Break the work into **logical units** (not individual functions — a logical unit is something like "the retry logic" or "the caching layer," the grain at which someone would actually be asked about it in conversation). Code and explain the what/why for each unit as it's written. Propose the unit boundary out loud when reached (e.g. "that's the retry logic — quiz time") so the user can push back if the chunking feels wrong.
2. After each unit: quiz the user (max 3 questions) on the problem, the solution, and how it fits into the whole.
3. If the user gets 2 or more questions wrong: re-explain that unit more simply, with examples, then re-quiz (max 3 questions again).
4. If the user still struggles after the re-quiz, offer a choice:
   - escalate this task to High mode, or
   - retry Medium once more (back to step 3), or
   - drop to Low mode for now, with a High-mode deep-dive on this topic queued for after the immediate work is done.
5. Once the user passes (2+ out of 3 correct), move to the next logical unit.

## Low mode

Claude codes the full solution with minimal interruption, optimized for speed. Understanding is captured afterward, not during.

1. Code the complete solution.
2. Produce a two-part summary:
   - **Short version** (spoken-form): a few sentences covering what was built, why this approach, and how it works — phrased the way the user would actually say it out loud in a standup, not read off a page.
   - **Full version**: task breakdown, the problem, the solution chosen and why, how it connects to the rest of the system/codebase, and educational or scientific references for the user to dig into later if they want deeper understanding.

## Escalation

Claude never auto-escalates or auto-de-escalates a level. Within Medium, step 4 is the one built-in exception (offering a choice after repeated struggle). Outside of that:
- Claude may **suggest** a level change if it notices a mismatch (e.g. user is in Low but mentioned they need to present this work soon), but only as a suggestion — the user decides.
- The user can always explicitly request a level change mid-task.
