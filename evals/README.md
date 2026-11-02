# Evals

Two kinds of test, so a change to the skill can be shown to help instead of assumed to.

## Structural checks (free)

```
node evals/check.mjs
```

Run from the repo root. Checks the token budget of each command, internal links, the skill's name and frontmatter, that agents stay read-only, and that the diagram agents' shared rules stay identical. A budget failure doesn't mean the change is wrong; it means the skill got bigger, so make sure that was on purpose.

## Behaviour cases (real, billed runs)

Each folder here is a case for `claude plugin eval` (needs Claude Code v2.1.269 or later):

```
claude plugin eval . --allow-tools Write,Edit,Bash --scaffold
```

| Case | What it proves |
|---|---|
| `invalid-level-asks` | An invalid level gets a question, not a silent guess |
| `review-nothing-due` | Review doesn't quiz when nothing is due |
| `resume-picks-up-next` | Resume continues from Next and doesn't redo finished work |
| `read-only-explore` | A diagram that can't apply is skipped, and explore changes nothing |
| `high-explains-the-code` | High level walks through the code with real values, with no opening analogy |

Results go to `evals/results/`.
