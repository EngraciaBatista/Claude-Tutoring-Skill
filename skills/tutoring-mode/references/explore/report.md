# Explore — report

A written explanation of how an existing codebase works. Built from the codebase map and diagrams (see [orchestration.md](orchestration.md)), written in the teaching style ([../teaching-style.md](../teaching-style.md)): simple language, analogies, real examples, and a clickable location for everything.

Two sizes. No quizzes — the user reads and asks questions whenever they want. At the end, offer the next step (`/tutoring explore tour` to be walked through it, or a specific diagram).

## `report --low` — short overview

One page. For a quick picture: before a meeting, on day one of a project.

1. **What it is** — 2–3 sentences with an analogy. "This app is like a ticket counter: people ask for seats, it checks what's free, and it saves who bought what."
2. **The main parts** — 3–7 bullets: name, one line on what it does, where it lives.
3. **Component diagram** — with its "How to read it" bullets.
4. **Where it starts** — the entry point(s), with location, and what happens first.
5. **Read these first** — the 5 files from the map's reading guide, one line each.
6. **What I couldn't confirm** — only if the map has Unverified items.

## `report --high` — full report

For real understanding: maintaining, presenting, or defending the code.

1. **In a few sentences** — a spoken-form summary the user could say out loud in a standup.
2. **What it does and for whom** — the problem this software solves, with a concrete example of someone using it.
3. **Where things live** — a folder-by-folder tour of the top levels: what each folder is for.
4. **The main parts** — component diagram, then one subsection per component:
   - what it does (analogy + example),
   - why it exists (what would go wrong without it),
   - where it lives (files + key line ranges),
   - what it talks to (other components, external services).
5. **Where it starts** — every entry point, with location.
6. **Key classes and functions** — the ones that carry the main logic: what each does, where it is, how it's used. Group them by component.
7. **The main flow, step by step** — sequence diagram for the main flow, then a numbered walk-through: each step names the function and its location. Mention the other important flows in a line each, and offer their diagrams.
8. **Data** — what is stored and where (tables/models, files, caches), with locations. If there's a database, offer the ER diagram.
9. **Outside services** — databases, APIs, queues: what they're used for and where they're configured and called.
10. **Words to know** — a small glossary of the jargon used in this report and in this codebase (framework names, patterns, domain terms), each explained in one plain sentence.
11. **Read these first** — the reading guide, with why for each file.
12. **What I couldn't confirm** — Unverified items, plainly.
