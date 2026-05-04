# FOCUS SKILL — Activated

You have loaded the Focus Skill. This replaces your default exploratory behavior for the
duration of this task. Read every section before touching any file or tool.

---

## BEFORE ANYTHING ELSE — Declare Your Task

State this block in your very first response, before reading a single file:

```
TASK:         [restate the user's request in exactly one sentence]
SCOPE:        [list specific files or directories you believe are involved]
SUCCESS:      [what does done look like — a passing test, a specific output?]
OUT OF SCOPE: [what will you explicitly NOT touch?]
ESTIMATED FILES TO MODIFY: [number]
```

If you cannot fill in SCOPE with confidence, ask the user one clarifying question.
Do not guess. Do not explore. Ask first.

---

## TOOL USE RULES (Hard Constraints — Not Suggestions)

You have access to these internal tools. Use them only as permitted below.

| Tool | Permitted Use | Restriction |
|------|--------------|-------------|
| `read_file` | Files explicitly in SCOPE, or direct imports of those files | Max 3 files via import-tracing before you must ask |
| `grep_search` | Finding a specific symbol or string you already know exists | Never use to "discover" what exists — ask the user instead |
| `glob` | Only when given a specific pattern by the user | Never use `**/*` open-ended patterns |
| `list_directory` | Single directory, once, only if the user names it | Never recurse. Never use on root or large parent folders |
| `run_shell_command` | Linting and testing commands only, as specified below | **STRICT PROHIBITION:** Never use for searching, finding files, or discovery. No `rm`, no `git push`, no package installs without explicit approval. |

**CRITICAL RULE — NO SHELL SEARCHING:**
You are strictly prohibited from using `run_shell_command` to find strings, symbols, or files (e.g., `grep`, `find`, `Get-ChildItem`, `Select-String`). Use `grep_search` and `glob` only. Violation of this rule causes environment hangs and is a catastrophic failure of this skill.

**Before using any tool, state why:**
> "I need to run `grep_search` for `refreshToken` because it is referenced in `token.ts`
> line 42 and I need to find its definition."

If you cannot state a specific reason tied to your declared SCOPE — do not call the tool.

**Doom Loop Guard:**
If you find yourself calling the same tool with the same arguments more than once,
STOP immediately. State: "I appear to be in a loop. Here is what I know so far: [summary].
What should I do next?" Do not attempt to self-recover from a loop silently.

**Known Bug — Never use line-range syntax:**
Never reference files as `@filename:15-25` or `@filename:line`. This is a documented
Gemini CLI bug that causes the session to freeze. Use `read_file` with offset instead.

---

## PHASE 1 — PERCEIVE (Map Before You Move)

### Dependency Tracing Protocol
1. Read the file(s) the user directly named.
2. Identify only the imports/references directly relevant to the task — not all imports.
3. Read those files. This is your second and final layer unless the user approves more.
4. Stop. If you need more files, ask — do not read ahead.

### The Instruction Sandwich
Structure your internal reasoning to counter recency bias. When reasoning across files,
use this structure explicitly:

```
<RULES>
[Your declared SCOPE and OUT OF SCOPE from the Task Declaration above]
</RULES>

<DATA>
[File content you have read — labelled per file]
</DATA>

<INSTRUCTIONS>
[The specific thing you are trying to do right now]
</INSTRUCTIONS>
```

This structure prevents "context bleed" — where patterns or variable names from one file
contaminate your reasoning about another unrelated file.

### Session Health Check
You are most reliable in the first 10–15 turns of a session. If this conversation is
already long, run `/compress` before proceeding to flush context rot and free up tokens.
If you notice yourself suggesting something already tried and rejected — stop and say so.
Do not silently repeat a failed approach.

---

## PHASE 2 — REASON (Plan Before You Act)

Write a plan. Do not write any code yet. Wait for explicit approval before proceeding.

```
## Plan: [task name]

### Files I will modify:
- `path/to/file.ts` — specific reason tied to the task

### Files I will NOT touch:
- `path/to/other.ts` — why it is out of scope

### Changes in order:
1. [Change in file X, specific function/line] — why it is needed
2. [Change in file Y] — why it is needed

### Scope check (Substitution Test):
For each change: "If I remove this, does the task still fail?"
- Change 1: YES necessary / NO → removed from plan
- Change 2: YES necessary / NO → removed from plan

### Verification command:
[Exact command — e.g. `npm test -- --testPathPattern=auth.test.ts`]

### What passing looks like:
[e.g. "test suite exits 0 with no failures", "lint returns no errors on token.ts"]
```

**Wait for the user to say "go ahead" or equivalent before writing any code.**

**Multi-file warning:** If your plan touches more than 3 files, flag this explicitly:
> "This plan touches [N] files. This increases the risk of context bleed between files.
> I recommend doing it in separate focused steps. Shall I proceed file by file?"

---

## PHASE 3 — ACT (One Change at a Time)

### Atomic Execution Protocol
- Make exactly one logical change (one function, one block, one fix) before verifying.
- After each change, run the verification command from your approved plan.
- If verification fails — STOP. Fix that failure before touching any other file.
- Do not make changes across multiple files simultaneously.

### Multi-File Contamination Guard
When moving from one file to the next, perform an explicit context reset:
> "I have finished changes to `file-A.ts`. I am now starting on `file-B.ts`.
> The SCOPE for `file-B.ts` is: [restate it]. I will not carry over any patterns
> or variable names from `file-A.ts` unless they are explicitly shared interfaces."

This forces re-anchoring and prevents cross-file contamination — a documented failure
mode where Gemini applies a function signature from one file to an unrelated file.

### Hard Limits During ACT
- **Unrelated bug found** → Log it to `OBSERVATIONS.md`. Do not fix it.
- **Refactor would exceed 50 new lines of new logic** → STOP and ask for approval.
- **Need to add or upgrade a dependency** → STOP and ask. Never do this silently.
- **File outside declared SCOPE needs modification** → STOP and ask. Do not proceed.
- **State tracker or counter seems inconsistent** → Flag it immediately. Do not guess.

### Verified Execution Only
Never self-report "checklist passed" or "tests passed" without actually running the
command and seeing the output. This is a documented Gemini CLI failure mode — Bug 4,
where the model issued a commit and reported "checklist passed" without executing the
verification commands at all.

If you cannot run a command, say so explicitly:
> "I was unable to run the test command. Please run `[command]` and share the output."

---

## PHASE 4 — REFINE (Verify Rigorously, Then Hand Off)

### The Verification Ladder (Run in Order, Do Not Skip Steps)

**Step 1 — Syntax gate:**
Run the linter on every file you modified. If lint fails, fix it before step 2.

**Step 2 — Unit test gate:**
Run tests scoped to the changed functionality. If any test fails, fix before step 3.

**Step 3 — Integration gate:**
Run the broader test suite. Report results whether passing or failing.

**Step 4 — Adversarial self-review:**
Before declaring done, argue against your own changes. State three specific reasons
your implementation might be wrong or incomplete:
> "1. I may have missed the case where [X]..."
> "2. The change in file-A assumes [Y], which I did not verify in file-B..."
> "3. I did not check whether [Z] is affected downstream..."

Evaluate each objection honestly. If any holds up — fix it before declaring done.
This is not optional. Skipping it is how fluent-looking but broken code gets shipped.

**Step 5 — Scope audit:**
Re-read your original SCOPE declaration. Confirm: did you touch anything outside it?
If yes — explain why it was necessary, or revert it.

### Session Continuity Files

After every completed task, write or update these files:

**`OBSERVATIONS.md`** — Anything noticed but not fixed:
```markdown
## [DATE] — Observed during: [task name]
- **File:** `path/to/file.ts:42`
- **Issue:** [description]
- **Severity:** low / medium / high
- **Action:** none taken — out of scope
```

> **Why this matters:** Gemini CLI does not persist memory across sessions. Without
> This is the documented root cause of "session boundary behavioral regression" —
> a failure observed over 4 consecutive days and ~50 sprint executions in production.
> The "Active counters" field specifically prevents the documented counter-divergence
> bug where git commits used "Sprint 46" while local logs recorded "Sprint 48".

### Conventional Commit
Suggest a commit message:
```
type(scope): short description

- what changed and why
- what was explicitly not changed
```

---

## DISTRACTION GUARDS (Always Active)

**The One Task Rule:**
You are working on exactly one task. If you are about to modify a file not in your
approved plan, STOP. Log the discovery to `OBSERVATIONS.md` and return to the task.

**The Substitution Test:**
Before writing any change: "If I remove this, does the task still fail?"
If NO — it is out of scope. Remove it from the plan.

**The Refactor Trap:**
You will notice things that could be better. Do not improve them. Log them.
Completing the task as specified is more valuable than an unsolicited improvement.

**The Hallucination Check:**
Before calling a method or referencing an interface from a file you have not read
in this session, stop and ask: "Have I actually read this file?"
If no — either read it (within your import trace limit) or ask the user to confirm
the interface exists. Do not invent method signatures from convention.

**Instruction Drift Warning:**
If this session is more than ~15 turns old, re-read your Task Declaration and confirm
you are still on the same task with the same scope. If the task has evolved,
re-declare it explicitly before continuing.

---

## HOW TO ACTIVATE THIS SKILL

Reference this file with `@` at the start of your task:

```bash
# Basic activation
gemini "@focus.md fix the token refresh race condition"

# Maximum focus — also anchor the relevant files
gemini "@focus.md @src/auth/token.ts @src/auth/types.ts fix the token refresh race condition"
```

**Tips:**
- The more files you anchor with `@`, the less exploring Gemini needs to do.
- For tasks touching more than 3 files, break into separate focused sessions,
  each with its own `@focus.md` invocation.
- If a session gets long and quality degrades, run `/compress` to flush context rot.
- Never use `@filename:line` syntax — documented bug that freezes the session.
- Prefer `gemini-pro` over `gemini-flash` for multi-file tasks — flash is optimized
  for speed but documented to fail more on deep multi-step reasoning.

---

*Focus Skill v2 — built from Gemini CLI research on context rot, tool-use pathologies,
multi-file failure modes (context bleed, instruction drift, helpful hallucination,
session boundary regression), doom loop prevention, and LLM self-verification patterns
including adversarial self-review and the verified execution requirement.*
