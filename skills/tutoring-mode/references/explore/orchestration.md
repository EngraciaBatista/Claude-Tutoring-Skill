# Explore — orchestration

In explore mode, Claude (running this skill in the main session) is the **orchestrator**. It doesn't read the whole codebase itself. It hands the reading to specialist subagents, merges what they return, checks it, and teaches from it.

```
orchestrator (this skill)
  │ 1. scope            → ask what to focus on
  │ 2. map             → codebase-explorer  (×1, or ×N in parallel for big repos)
  │ 3. diagrams        → diagram-component | -class | -sequence | -activity | -er | -state  (in parallel)
  │ 4. verify          → spot-check locations, check Mermaid syntax
  │ 5. present         → chat first
  └ 6. save (optional) → .tutoring/explore/  (only after the user says yes)
```

Subagents can't launch other subagents, which is why the orchestrator is this skill and not a separate agent. If there's no Agent/Task tool available, use [fallback.md](fallback.md) instead.

## 0. Read-only contract

- Never edit, create, or delete the user's source files in explore mode.
- All subagents are read-only (Read, Grep, Glob).
- The only writes ever allowed are in step 6, inside `.tutoring/explore/` (and `.gitignore`, if the user agrees), after the user says yes.
- If the user asks for a code change during explore, say that explore is read-only and offer to switch to `/tutoring build`.

## 1. Scope

- **Target:** the current working directory, unless the user gave a path.
- **Focus:** if the command didn't include one, ask one short question:
  - report / tour: "The whole project, or one part of it (a folder, a feature like 'login', a flow like 'placing an order')?"
  - diagram: "Which part should the diagram focus on?" — for `sequence` and `activity`, suggest the flow; for `class`, suggest a component; for `state`, suggest an entity. "You pick for me" is an acceptable answer — then use the most central one.
- Ask what questions matter to the user ("anything specific you want to understand?"). Optional — don't push if they say no.

## 2. Map (codebase-explorer)

**Reuse first.** Skip exploring if a map for the same scope already exists:
- from earlier in this session, or
- saved at `.tutoring/explore/map.md`. Compare its `Commit:` line with the current git HEAD. If they differ, tell the user the code has changed since the map was made and ask: refresh, or use the old map?

**Size check.** Glob the source files in scope (exclude dependencies, build output, vendored code, lockfiles).
- **Small/medium** (under ~150 source files, one app): dispatch **one** `codebase-explorer` with the scope.
- **Large** (more, or several apps/services in one repo): split the scope into 2–5 areas along top-level directories or services. Dispatch **one explorer per area, all in the same message** so they run in parallel. Tell each explorer its area and to note — not explore — connections to the other areas.

**Merging parallel maps:**
1. Prefix IDs with the area to keep them unique (`api.C1`, `web.K3`).
2. Join cross-area connections: where one map says "calls `X` in another area", find `X` in the other map and add the dependency.
3. Write one combined Overview and Reading guide.
4. Keep all `Unverified` items.

Tell the user briefly what's happening while agents run ("Mapping the code in 3 parts at the same time: api, web, workers…").

## 3. Diagrams

| Type | Shows | Agent |
|---|---|---|
| `component` | The big parts and how they connect | `diagram-component` |
| `class` | Classes, what they hold and do, and how they relate | `diagram-class` |
| `sequence` | Who calls whom, in order, during one flow | `diagram-sequence` |
| `activity` | Steps and yes/no decisions in one process | `diagram-activity` |
| `er` | Database tables and how they link | `diagram-er` |
| `state` | The states one thing moves through | `diagram-state` |

**Which agents to run:**

| Command | Agents after the explorer |
|---|---|
| `report --low` | `diagram-component` |
| `report --high` | `diagram-component` + `diagram-sequence` (main flow) |
| `diagram <type>` | that one agent |
| `diagram all` | all six, in parallel |
| `tour` | `diagram-component` (plus others on request during the tour) |

**Dispatching:** launch all needed diagram agents **in one message** so they run in parallel. Each prompt contains:
- the full merged codebase map,
- the focus (the flow/component/entity), if any,
- the repository root,
- "Return exactly the output format in your instructions."

**NOT APPLICABLE:** if an agent returns `NOT APPLICABLE`, don't retry. Tell the user in one line why that diagram was skipped (e.g. "No ER diagram: this project doesn't store data in a database").

## 4. Verify

Before showing anything:

1. **Spot-check locations.** For each diagram, pick up to 5 rows from its Traceability table (prefer the most important elements) and open those lines. Is the named thing actually there? Do the same for 5 items in the map.
   - Wrong row → fix it or move the item to Unverified.
   - More than 1 wrong out of 5 for one diagram → send that agent back once with the corrections; if it's still wrong, show the diagram with a clear warning.
2. **Check the Mermaid.** If the Mermaid CLI is available (`mmdc --version` works), render each diagram to a temporary file **outside the user's repo** (e.g. the system temp directory) to confirm it parses. Fix syntax errors yourself if small; otherwise send the agent back once. If `mmdc` isn't available, check against the agent's syntax rules by eye (closed `end` blocks, no quotes inside labels, no reserved `end` id).
3. **Check the merge.** Nothing in a diagram should contradict the map.

## 5. Present (chat first)

- Follow [../teaching-style.md](../teaching-style.md): simple language, and locations as clickable links.
- For each diagram: the Mermaid block, then its "How to read it" bullets, then the traceability table (collapsed or short if it's long).
- List anything Unverified at the end, plainly: "I couldn't confirm these: …".
- Offer the natural next step: another diagram, a tour, or a deeper report.

## 6. Save (optional)

After presenting, ask once: **"Want me to save this to `.tutoring/explore/` in this project?"**

If yes:
1. **First, ask about `.gitignore`** — if the project is a git repo and `.tutoring/` isn't already ignored: "Should I add `.tutoring/` to `.gitignore` so these files don't get committed?" Do what they answer.
2. If any of the files below already exist, list them and confirm before overwriting.
3. Write:
   ```
   .tutoring/explore/
     map.md                  ← the merged codebase map (with the Commit: line) — lets tours and later runs reuse it
     report.md               ← for report --high (or report-short.md for --low)
     diagrams/<type>.md      ← one file per diagram: Mermaid block + How to read it + Traceability
   ```
4. Tell the user what was written, as clickable links.
