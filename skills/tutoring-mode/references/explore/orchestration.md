# Explore — orchestration

In explore mode, Claude (running this skill in the main session) is the **orchestrator**. It doesn't read the whole codebase itself. It hands the reading to specialist subagents, merges what they return, checks it, and teaches from it.

```
orchestrator (this skill)
  │ 1. scope            → ask what to focus on
  │ 2. map             → reuse / update, or codebase-explorer  (skeleton first for big repos)
  │ 3. diagrams        → diagram-component | -class | -sequence | -activity | -er | -state  (in parallel)
  │ 4. verify          → spot-check locations, check Mermaid syntax
  │ 5. present         → chat first
  └ 6. save (optional) → .tutoring/explore/  (only after the user says yes)
```

Subagents can't launch other subagents, which is why the orchestrator is this skill and not a separate agent. If there's no Agent/Task tool available, use [fallback.md](fallback.md) instead.

## 0. Read-only contract

- Never edit, create, or delete the user's source files in explore mode.
- All subagents are read-only (Read, Grep, Glob at most; most diagram agents only have Read).
- The only writes ever allowed are in step 6, inside `.tutoring/explore/` (and `.gitignore`, if the user agrees), after the user says yes.
- If the user asks for a code change during explore, say that explore is read-only and offer to switch to `/tutoring build`.

## 1. Scope

- **Target:** the current working directory, unless the user gave a path.
- **Focus:** if the command didn't include one, ask one short question:
  - report / tour: "The whole project, or one part of it (a folder, a feature like 'login', a flow like 'placing an order')?"
  - diagram: "Which part should the diagram focus on?" — for `sequence` and `activity`, suggest the flow; for `class`, suggest a component; for `state`, suggest an entity. "You pick for me" is an acceptable answer — then use the most central one.
- Ask what questions matter to the user ("anything specific you want to understand?"). Optional — don't push if they say no.

## 2. Map (codebase-explorer)

The map is the expensive step, and its cost grows with the codebase. The rules below are about not paying for the same reading twice and not reading more than the user needs.

**Get the commit first.** Run `git rev-parse HEAD` in the target. If it works, pass that hash to every explorer in its prompt (they copy it into the map's `Commit:` line — they can't run git themselves). If it fails (not a git repo, or git isn't available), the commit is `unknown`.

**Reuse or update — don't redo.** Check for an existing map for the same scope (from earlier in this session, or saved at `.tutoring/explore/map.md`) and compare its `Commit:` with the current hash:
- **Same** → reuse it as is.
- **Different** → run `git diff --name-only <map commit> HEAD`, keeping only source files in scope:
  - none of the changed files are in scope → reuse the map and say it's still current for this scope;
  - some are → tell the user which areas changed and offer an **update**: dispatch an explorer in `update` depth for each affected component, with its old map sections and its changed files, then patch those sections into the map (keep IDs stable, drop items listed as removed). Update the map's `Commit:` line;
  - more than ~40% of the in-scope source files changed, or the diff fails (e.g. the old commit no longer exists after a rebase) → offer a full refresh instead.
- **Either side `unknown`** → you can't tell if it's out of date. Say so and ask whether to reuse it or refresh. Don't call it outdated.

**Size check.** Count the source files in scope with a quick command (e.g. `git ls-files` filtered by source extensions, or Glob), excluding dependencies, build output, vendored and generated code, lockfiles, and tests.

- **Small/medium** (under ~150 source files in scope — even if spread across several apps): dispatch **one** explorer, `deep`, budget 60 tool calls.
- **Large** (over ~150): **skeleton first.**
  1. Dispatch one explorer with depth `skeleton` for the whole scope (budget 40). This is cheap: no class bodies, no flow tracing.
  2. Show the user the skeleton (overview + component list, or a component diagram) and ask which part to go deep on — unless the command already named one. A `report --low` can often be answered from the skeleton alone.
  3. Dispatch `deep` explorers only for the chosen parts. If the user really wants everything deep, split it into 2–5 areas of similar size and dispatch one explorer per area **in the same message** so they run in parallel. Tell each explorer its area and to note — not explore — connections to the other areas.
  4. During a tour, go deep one unit at a time, as the tour reaches it, instead of all up front.

**Budgets.** Always give each explorer a tool-call budget in its prompt (defaults above). If an explorer reports "Not explored: …", tell the user what's missing and offer to map it next.

**Merging parallel maps:**
1. Prefix IDs with the area to keep them unique (`api.C1`, `web.K3`).
2. Join cross-area connections: where one map says "calls `X` in another area", find `X` in the other map and add the dependency.
3. Write one combined Overview and Reading guide.
4. Keep all `Unverified` items.

Tell the user briefly what's happening while agents run ("Mapping the code in 3 parts at the same time: api, web, workers…").

## 3. Diagrams

| Type | Shows | Agent | Model | Needs from the map |
|---|---|---|---|---|
| `component` | The big parts and how they connect | `diagram-component` | haiku | Overview, Entry points, Components, External dependencies |
| `class` | Classes, what they hold and do, and how they relate | `diagram-class` | haiku | Key classes for the focus component and its direct neighbors |
| `sequence` | Who calls whom, in order, during one flow | `diagram-sequence` | haiku | The chosen flow + the E/C/K/X items it mentions |
| `activity` | Steps and yes/no decisions in one process | `diagram-activity` | sonnet | The chosen flow + the K items it mentions (it also reads those functions' source) |
| `er` | Database tables and how they link | `diagram-er` | haiku | Data model |
| `state` | The states one thing moves through | `diagram-state` | haiku | The chosen state machine |

Diagram agents turn a map into Mermaid — a small, well-defined job — so most run on a small fast model. The explorer runs on a mid-size model. The orchestrator (this session) does the checking and teaching.

**Which agents to run:**

| Command | Agents after the explorer |
|---|---|
| `report --low` | `diagram-component` |
| `report --high` | `diagram-component` + `diagram-sequence` (main flow) |
| `diagram <type>` | that one agent |
| `diagram all` | every type that applies, in parallel |
| `tour` | `diagram-component` (plus others on request during the tour) |

**Skip what can't apply — before dispatching.** Don't start an agent just to hear "not applicable":
- `er` → skip if the map's Data model says "None found"
- `state` → skip if State machines says "None found"
- `sequence` / `activity` → skip if there are no Flows
- `class` → skip if Key classes has no classes, interfaces, or structs (only plain functions)

Tell the user in one line why each skipped diagram was skipped (e.g. "No ER diagram: this project doesn't store data in a database"). If an agent still returns `NOT APPLICABLE`, don't retry.

**Dispatching:** launch all needed diagram agents **in one message** so they run in parallel. Each prompt contains:
- **only the map sections that agent needs** (table above), not the whole map. Paste them in, or — when several agents share large sections — write them once to temporary files **outside the user's repo** (e.g. the session's scratch/temp directory) and give each agent its path,
- the focus (the flow/component/entity), if any,
- the repository root,
- "Return exactly the output format in your instructions."

**Present as they arrive.** Agents finish at different times. Verify and show each diagram as soon as it comes back instead of waiting for all of them — same cost, much shorter wait.

## 4. Verify

Before showing each diagram:

0. **Check coverage.** From the size check you already know which top-level folders contain source files. If one of them isn't covered by any component in the map (and isn't listed under "Not explored"), the explorer missed it — dispatch one more explorer for just that folder and merge it in before going on.
1. **Check the map once, against the code.** The first time a map is used (new or updated), open the lines for 5 of its most important items (entry points, central classes, a flow step). Is the named thing actually there? Wrong → fix it or move it to Unverified.
2. **Check each diagram against the map — no file reading needed.** Diagram agents cite map IDs, so check that every ID in the Traceability table exists in the map and that the element matches it (name, relation, field). The exception is `activity`, which reads source: also open up to 3 of its non-map locations.
   - More than 1 mismatch in a diagram → send that agent back once with the corrections; if it's still wrong, show the diagram with a clear warning.
3. **Check the Mermaid.** If the Mermaid CLI (`mmdc`) or the `mermaid` package is available, parse each diagram in a temporary location **outside the user's repo**. Fix small syntax errors yourself; otherwise send the agent back once. If neither is available, check against the agent's syntax rules by eye (closed `end` blocks, no quotes inside labels, no reserved `end` id).

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
