# Explore — fallback (no subagents)

Use this when there's no Agent/Task tool to launch subagents — for example in Claude.ai. The steps and outputs are the same as [orchestration.md](orchestration.md); the difference is that Claude does every role itself, one after another, instead of handing them to parallel agents.

Tell the user once, at the start: "Here I can't run several helpers in parallel, so I'll do the mapping and each diagram one after another. For big projects this works best in Claude Code."

## Where the code comes from

Work with whatever the user has given access to: uploaded files or a zip, pasted code, or a connected repository. If nothing is available, ask for it. Never describe code you haven't seen.

## Steps

1. **Scope** — same as orchestration step 1.
2. **Map** — explore the code and write the map yourself, using this structure (every item with a real `path:line`, inferences under Unverified):
   ```
   Overview · Entry points (E*) · Components (C*, with depends-on + evidence)
   Key classes and functions (K*: purpose, fields, methods, relations + evidence)
   Flows (F*: numbered call-by-call steps with locations and branches)
   Data model (D*: fields, keys, relations) · State machines (S*: states, transitions)
   External dependencies (X*) · Reading guide (5 files) · Unverified
   ```
   For a large codebase, map one area at a time and merge as you go.
3. **Diagrams** — draw each needed diagram one at a time (same "which diagrams" table as orchestration step 3), in Mermaid:

   | Type | Mermaid | Key rules |
   |---|---|---|
   | component | `flowchart LR` | ≤15 nodes; components as boxes, databases `[("…")]`, outside services `(["…"])`; arrows = "uses" with 1–3 word labels |
   | class | `classDiagram` | ≤12 classes, ≤6 members; `<\|--` inherits, `<\|..` implements, `*--` composition, `o--` aggregation, `-->` association, `..>` dependency |
   | sequence | `sequenceDiagram` | one flow, ≤8 participants; `->>` call, `-->>` return; `alt`/`opt`/`loop` closed with `end` |
   | activity | `flowchart TD` | one process; start/end `(["…"])`, actions `["…"]`, decisions `{"…?"}` with yes/no labels; never name a node `end` |
   | er | `erDiagram` | ≤12 entities; `type name PK/FK`; `\|\|--o{` style cardinality with a verb label |
   | state | `stateDiagram-v2` | one entity; `[*] -->` start; `A --> B : event`; include error/cancel paths |

   For every diagram: no styling or colors, no file paths inside the diagram, nothing that isn't backed by the map. Follow each with "How to read it" (3–5 simple bullets) and a Traceability table (element → `path:line` → map ID). If a diagram type doesn't apply, say so in one line instead of drawing it.
4. **Verify** — re-open a few of the most important locations you cited and confirm they're right.
5. **Present** — same as orchestration step 5, then the report or tour steps ([report.md](report.md), [tour.md](tour.md)).
6. **Save** — if there's no local project folder (e.g. Claude.ai), offer the map, report, and diagrams as downloadable Markdown files instead of writing to `.tutoring/explore/`. If there is one, follow orchestration step 6 (ask about `.gitignore` first).
