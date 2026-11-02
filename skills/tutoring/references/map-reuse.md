# Reusing the codebase map

The map is the most expensive thing explore makes. These rules decide where it lives and whether it can still be trusted. Explore and Build both use them.

## Where maps live

- **Auto-saved copy:** `~/.claude/tutoring/<project key>/map.md`, outside the project.
- **Project copy:** `.tutoring/explore/map.md`, only if the user chose to save it.

**Project key:** take the project root's absolute path (`git rev-parse --show-toplevel`, or the current folder if it isn't a git repo), make it lowercase, and replace every run of characters other than a-z and 0-9 with one hyphen. `C:/Work/Client-A/app` becomes `c-work-client-a-app`. Don't hash it: a hash can differ between shells for the same path.

## Finding a map

Use the map from this session if there is one. Otherwise look at both copies. Ignore an auto-saved map whose `Repository:` line isn't this project. If both are left, use the one with the later `Updated:` line.

## Writing a map

Whenever a map is created or changed (after the first checks in orchestration step 4):

1. Set its `Updated:` line to the current date and time.
2. **Write the auto-saved copy,** without asking. If it holds other parts of this project, merge the new parts in instead of replacing it. If its `Repository:` line is a different project, don't touch it: say so once and carry on.
3. **If the project copy exists, write it too.** The user already chose to keep it, and the diagram agents read it, so it must never fall behind.
4. Tell the user once, in one line: "I saved the code map outside your project, at `<path>`, so later sessions can reuse it." If a write fails or is refused, say so once and carry on.

## What each component records

One commit can't describe a whole map, because parts get mapped at different times. Each component has its own:

```
- C1 Booking — src/booking/ — takes and saves bookings — depth: deep — commit: 4ad3202
  dirty: src/booking/new.py=9f2c41ab, src/booking/old.py=deleted
```

- **`commit:`** — `git rev-parse HEAD` just before that component was mapped, or `unknown` if that failed (not a git repo, or no git).
- **`dirty:`** — the uncommitted and untracked files in that component when it was mapped, because the commit alone doesn't describe them. Right after the explorer returns, run `git status --porcelain -- <component paths>`. For each file listed, record the first 8 characters of `git hash-object <file>`, or `deleted`. Leave the line out if there are none.

Updating or merging changes only the components involved. Every other component keeps its own `commit:` and `dirty:`.

## Is a component still current?

Run this for each component the task needs, not for the whole map:

1. **`commit: unknown`** → you can't tell. Say so, and treat its locations as hints.
2. **List what changed:** `git diff --name-only <commit> -- <component paths>` and `git ls-files -o --exclude-standard -- <component paths>`. These also catch uncommitted edits and new files. If the diff fails (e.g. the commit is gone after a rebase), you can't tell, as in step 1.
3. **Correct it with `dirty:`.** A listed file with the same hash now → take it off the list: the map already saw that version. A listed file with a different hash, or missing now → add it to the list, even if step 2 didn't show it.
4. **Nothing on the list** → the component is current. Anything on it → those files have changed since the map was made.
