// Governance gate per RULES.md: adapters reference the law, never restate it,
// and every skill's lockfile hash matches its content.
import { createHash } from 'crypto';
import { readFileSync, readdirSync } from 'fs';

let failures = 0;
const fail = (msg) => { failures++; console.error('GOVERNANCE FAIL:', msg); };

const claude = readFileSync('CLAUDE.md', 'utf8');
if (!claude.includes('RULES.md')) fail('CLAUDE.md does not reference RULES.md');
if (/## Absolute requirements|## Hard guardrails/.test(claude))
    fail('CLAUDE.md restates normative rule sections owned by RULES.md');

const rules = readFileSync('RULES.md', 'utf8');
for (const section of ['## Absolute requirements', '## Hard guardrails', '## Skill governance', '## Verification law'])
    if (!rules.includes(section)) fail(`RULES.md missing section: ${section}`);

const lock = JSON.parse(readFileSync('skills-lock.json', 'utf8'));
const skillDirs = readdirSync('.agents/skills');
for (const name of skillDirs) {
    const hash = createHash('sha256').update(readFileSync(`.agents/skills/${name}/SKILL.md`)).digest('hex');
    const pinned = lock.skills[name]?.computedHash;
    if (!pinned) fail(`skill "${name}" is not pinned in skills-lock.json`);
    else if (pinned !== hash) fail(`skill "${name}" hash drifted from skills-lock.json`);
}
for (const name of Object.keys(lock.skills))
    if (!skillDirs.includes(name)) fail(`lockfile pins missing skill "${name}"`);

if (failures) process.exit(1);
console.log(`governance OK: ${skillDirs.length} skills pinned, adapters clean`);
