# tutoring-mode

A Claude skill that turns Claude into a structured coding tutor instead of a code generator — built for anyone who needs to actually *understand* what they build, not just ship it. Useful if you have to explain or demo your code live (team standups, college project demos), or if you're learning to code while working on real tasks.

Three levels, chosen explicitly per task:

- **`--high`** — Full Socratic loop: Claude explains a concept, gives examples, quizzes you on it before you're allowed to write any code, then guides you through writing it with capped attempts before showing the answer. Use for topics you need to deeply understand and be able to teach or defend.
- **`--medium`** (default) — Claude codes and explains as it goes, breaking work into logical units, quizzing you after each one to confirm real understanding. Use for regular day-to-day work.
- **`--low`** — Claude codes the full solution with minimal interruption, then gives you a two-part summary: a short spoken-form version (for saying out loud in a demo/standup) and a full writeup with references. Use under real time pressure, when you need to move fast but still want the recap.

## Installing

### Claude.ai (web/desktop/mobile)

1. Download `tutoring-mode/SKILL.md` from this repo (or clone the whole repo).
2. In Claude.ai, go to **Customize → Skills → "+ Create skill" → Upload a skill**.
3. Upload the `tutoring-mode` folder (as a zip) or the `SKILL.md` file.
4. Toggle it on. It's now available in any chat.

> Requires Code execution and file creation to be enabled (Settings → Capabilities, or your org's Skills settings if you're on a Team/Enterprise plan).

### Claude Code

Clone or copy the `tutoring-mode/` folder into:

- `.claude/skills/` in your project root, for that project only, or
- `~/.claude/skills/` for all your projects.

Claude Code auto-discovers skills from those locations — no separate install step.

## Using it

Once installed, just type in any conversation or coding session:

```
/tutoring --high
/tutoring --medium
/tutoring --low
/tutoring          (defaults to --medium)
```

Claude will follow the structured loop for that level for the rest of the task. You can ask to switch levels mid-task at any point.

## Why

Built out of a very specific, very human problem: using an AI coding assistant so much that you stop understanding your own code well enough to explain it under pressure. This skill doesn't stop you from using Claude to code — it structures *how* you use it, so speed and understanding aren't fully at odds.

## License

[CC BY 4.0](./LICENSE) — you're free to use, modify, and share this (including publishing your own modified version, even commercially), as long as you credit Engracia and link back to this repository.
