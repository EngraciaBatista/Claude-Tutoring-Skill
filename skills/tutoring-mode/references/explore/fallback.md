# Explore — fallback (no subagents)

Use this when there's no Agent/Task tool to launch subagents (for example in Claude.ai), or when the explore agents aren't installed (only the skill folder was copied). The steps and outputs are the same as [orchestration.md](orchestration.md); the difference is that Claude does every role itself, one after another, instead of handing them to parallel agents.

Tell the user once, at the start: "I can't run the explore helpers here, so I'll do the mapping and each diagram one after another. For big projects this works best in Claude Code with the agents installed."

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

   - **component** — `flowchart LR`. At most 15 nodes; components as boxes `Id["…"]`, databases `Id[("…")]`, outside services `Id(["…"])`; arrows mean "uses", with 1–3 word labels: `A -->|"calls"| B`.
   - **class** — `classDiagram`. At most 12 classes, 6 members each. Relationships:
     ```
     Parent <|-- Child          inherits
     Interface <|.. Impl        implements
     Whole *-- Part             composition
     Whole o-- Part             aggregation
     A --> B                    association
     A ..> B                    dependency
     ```
   - **sequence** — `sequenceDiagram`. One flow, at most 8 participants; `A->>B: call` for calls, `B-->>A: result` for returns; `alt` / `opt` / `loop` blocks closed with `end`; participant aliases after `as` are not quoted.
   - **activity** — `flowchart TD`. One process; start/end `Id(["…"])`, actions `Id["…"]`, decisions `Id{"…?"}` with `yes`/`no` edge labels; never name a node `end`.
   - **er** — `erDiagram`. At most 12 entities; attributes as `type name PK` / `FK`; relationships with a verb label:
     ```
     CUSTOMER ||--o{ ORDER : places
     ORDER ||--|{ ORDER_LINE : contains
     USER ||--|| PROFILE : has
     ```
   - **state** — `stateDiagram-v2`. One entity; `[*] --> First` to start; `A --> B : event`; include error/cancel paths.

   For every diagram: no styling or colors, no file paths inside the diagram, nothing that isn't backed by the map. Follow each with "How to read it" (3–5 simple bullets) and a Traceability table (element → `path:line` → map ID). If a diagram type doesn't apply, say so in one line instead of drawing it.
4. **Verify** — re-open a few of the most important locations you cited and confirm they're right. Then check every diagram's syntax: if you can run code and the Mermaid CLI (`mmdc`) or the `mermaid` package is available, parse each diagram with it; otherwise check by eye against the rules above (operators typed exactly as shown with no backslashes, every `alt`/`opt`/`loop`/`subgraph` closed with `end`, no double quotes inside labels, no node named `end`). Fix any problem before presenting.
5. **Present** — same as orchestration step 5, then the report or tour steps ([report.md](report.md), [tour.md](tour.md)).
6. **Save** — if there's no local project folder (e.g. Claude.ai), offer the map, report, and diagrams as downloadable Markdown files instead of writing to `.tutoring/explore/`. If there is one, follow orchestration step 6 (ask about `.gitignore` first).
