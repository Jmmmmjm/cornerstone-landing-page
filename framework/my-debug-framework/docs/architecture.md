# Architecture: How the Skill System Works

Extracted from `src/skills/loadSkillsDir.ts` and `src/skills/bundledSkills.ts`.

## Skill Loading Order

Skills are loaded from multiple directories in priority order. Higher priority wins on name conflicts:

1. **Managed/policy** (`<managed-path>/.claude/skills/`) — admin-enforced
2. **User-global** (`~/.claude/skills/`) — personal skills
3. **Project** (`.claude/skills/` up to home dir) — project-specific
4. **Additional dirs** (via `--add-dir`) — extra mounted paths
5. **Legacy commands** (`.claude/commands/`) — deprecated format

Bundled skills (compiled into the binary) are registered separately at startup.

## Directory Format

Skills in `skills/` directories **must** use the directory format:

```
my-skill/
└── SKILL.md     ← required name, case-insensitive
```

The skill's name is taken from the **directory name**, not the file name. Single `.md` files are NOT supported in `skills/` directories (only in legacy `commands/` directories).

## SKILL.md Parsing Flow

```
loadSkillsFromSkillsDir(basePath)
  → readdir(basePath)
  → for each directory entry:
      → read SKILL.md
      → parseFrontmatter(content)            # extract YAML header
      → parseSkillFrontmatterFields(...)     # validate all fields
      → parseSkillPaths(frontmatter)         # path-conditional activation
      → createSkillCommand(...)              # build Command object
```

### Key: `createSkillCommand`

The returned `Command` object has a `getPromptForCommand(args)` method that:
1. Prepends `Base directory for this skill: <dir>` so the model can `Read`/`Grep` sibling files
2. Substitutes `$argument` placeholders with invocation `args`
3. Replaces `${CLAUDE_SKILL_DIR}` with the skill's own directory path
4. Replaces `${CLAUDE_SESSION_ID}` with the current session ID
5. Executes inline shell commands (`` !`cmd` `` syntax) if `loadedFrom !== 'mcp'`

## Frontmatter Parser (key fields)

From `parseSkillFrontmatterFields()`:

```typescript
{
  description:              string     // Required for listing
  'allowed-tools':          string[]   // Tool names allowed during skill execution
  'argument-hint':          string     // Shown to user (e.g. "[issue description]")
  when_to_use:              string     // Model guidance on invocation
  'user-invocable':         boolean    // Default: true
  'disable-model-invocation': boolean  // Default: false
  model:                    string     // 'inherit' or specific model ID
  arguments:                string[]   // Named argument placeholders
  version:                  string     // Semver for the skill
  context:                  'fork'     // Run as background fork subagent
  agent:                    string     // Delegate to a named agent type
  effort:                   string     // 'low'|'medium'|'high' or integer
  paths:                    string[]   // Activate only when matching files are touched
  hooks:                    HooksSettings  // Shell commands triggered by events
}
```

## Conditional Skills (paths frontmatter)

Skills with a `paths:` field are **not loaded into context by default**. They are stored in a `conditionalSkills` map and only activated when the model touches a file matching those patterns.

## Deduplication

Skills are deduplicated by **resolved real path** (symlinks resolved via `realpath`). First-loaded wins. This prevents duplicate skills when `--add-dir` overlaps with project dirs.

## Bundled Skills vs File-Based Skills

| | Bundled | File-Based |
|---|---|---|
| Source | TypeScript, compiled into binary | `SKILL.md` files on disk |
| Registration | `registerBundledSkill()` at startup | `loadSkillsFromSkillsDir()` |
| `baseDir` | Extracted to `~/.claude/bundled-skills/<name>/` on first invoke | Skill directory on disk |
| `loadedFrom` | `'bundled'` | `'skills'` |
| Trust | Always trusted for shell injection | Trusted unless `loadedFrom === 'mcp'` |

## Verification Agent Contract (from verificationAgent.ts)

The verification agent is a **built-in agent** (not a skill), registered as `agentType: 'verification'`.

Key constraints:
- `disallowedTools`: `[Agent, ExitPlanMode, FileEdit, FileWrite, NotebookEdit]` — read-only except tmp
- `background: true` — runs as a background fork
- `criticalSystemReminder`: injected every turn reminding it cannot modify the project

The caller (main agent) is responsible for:
- Spawning verifier after non-trivial work (3+ file edits, backend/API, infra)
- On `VERDICT: FAIL`: fixing, then resuming verifier with findings + fix
- On `VERDICT: PASS`: spot-checking 2–3 commands from the report
- On `VERDICT: PARTIAL`: reporting what passed and what could not be verified
