// Free, repeatable checks: run `node evals/check.mjs` from the repo root.
// Token counts are estimates (bytes / 3.7). Budgets are the sizes at the time of writing plus a small margin,
// so a failure means "this got bigger: was that on purpose?".
import fs from 'node:fs';
import path from 'node:path';

const SKILL = 'skills/tutoring';
const R = `${SKILL}/references`;
const S = `${SKILL}/SKILL.md`;
const STYLE = `${R}/teaching-style.md`;
const PROG = `${R}/progress.md`;
const ORCH = `${R}/explore/orchestration.md`;

const COMMANDS = {
  'build low': { files: [S, STYLE, PROG, `${R}/build/low.md`], budget: 5750 },
  'build medium': { files: [S, STYLE, PROG, `${R}/build/medium.md`], budget: 5800 },
  'build high': { files: [S, STYLE, PROG, `${R}/build/high.md`], budget: 6600 },
  'explore diagram': { files: [S, STYLE, ORCH], budget: 8800 },
  'explore report': { files: [S, STYLE, ORCH, `${R}/explore/report.md`], budget: 9600 },
  'explore tour': { files: [S, STYLE, PROG, ORCH, `${R}/explore/tour.md`], budget: 10950 },
  review: { files: [S, STYLE, PROG, `${R}/review.md`], budget: 5900 },
  drill: { files: [S, STYLE, PROG, `${R}/drill.md`], budget: 5950 },
};

const failures = [];
const read = (f) => fs.readFileSync(f, 'utf8');
const tokens = (f) => Math.round(fs.statSync(f).size / 3.7);
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(`${d}/${e.name}`) : e.name.endsWith('.md') ? [`${d}/${e.name}`] : []);

// Token budget per command
for (const [name, { files, budget }] of Object.entries(COMMANDS)) {
  const total = files.reduce((sum, f) => sum + tokens(f), 0);
  console.log(`${name.padEnd(18)}${String(total).padStart(6)} / ${budget}`);
  if (total > budget) failures.push(`${name}: ${total} tokens is over its budget of ${budget}`);
}

// Skill name and frontmatter (Claude.ai's validator rejects other keys)
const front = read(S).split('---')[1];
if (!/^name: tutoring\r?$/m.test(front)) failures.push('SKILL.md name must be "tutoring"');
for (const m of front.matchAll(/^([a-z-]+):/gm)) {
  if (!['name', 'description', 'license', 'allowed-tools', 'metadata', 'compatibility'].includes(m[1])) {
    failures.push(`SKILL.md frontmatter key "${m[1]}" isn't accepted by Claude.ai`);
  }
}

// Internal links
for (const f of walk(SKILL)) {
  for (const m of read(f).matchAll(/\]\(([^)#\s]+\.md)\)/g)) {
    if (!fs.existsSync(path.join(path.dirname(f), m[1]))) failures.push(`${f}: broken link ${m[1]}`);
  }
}

// Freshness checks must catch uncommitted edits
for (const f of walk(SKILL)) {
  if (/git diff --name-only <[^>]+> HEAD/.test(read(f))) failures.push(`${f}: "git diff ... HEAD" misses uncommitted edits`);
}

// Rules found the hard way: plugin agents have a prefix, and subagents can't always read outside the project
if (!read(S).includes('tutoring-mode:codebase-explorer')) failures.push('SKILL.md lost the plugin agent name rule');
if (!read(ORCH).includes('CANNOT READ MAP')) failures.push('orchestration.md lost the CANNOT READ MAP rule');

// Every agent stays read-only
const agents = fs.readdirSync('agents').map((f) => `agents/${f}`);
for (const f of agents) {
  const tools = read(f).match(/^tools: (.*)$/m)?.[1] ?? '';
  if (/Write|Edit|Bash/.test(tools)) failures.push(`${f}: agents must stay read-only (tools: ${tools})`);
}

// The diagram agents' shared rules stay identical. (diagram-activity's "Work from the map" and
// "Nothing invented" rules differ on purpose, because it also reads source.)
const diagrams = agents.filter((f) => f.startsWith('agents/diagram-'));
const SHARED = [
  /^1\. \*\*Read-only\.\*\* /,
  /^4\. \*\*Not applicable is a valid answer\.\*\* /,
  /^- No styling, colors/,
  /^- Don't put file paths or line numbers inside the diagram/,
];
for (const rule of SHARED) {
  const lines = new Set(diagrams.map((f) => read(f).split(/\r?\n/).find((l) => rule.test(l))));
  if (lines.size > 1) failures.push(`diagram agents disagree on: ${rule}`);
}

if (failures.length) {
  console.error(`\n${failures.length} failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log('\nAll checks passed.');
