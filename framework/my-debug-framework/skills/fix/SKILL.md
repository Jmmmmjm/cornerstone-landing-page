---
description: "Apply a surgical, precisely scoped fix to a confirmed root cause. One atomic change at a time — verify after each."
allowed-tools: ["read_file", "write_file", "replace", "grep_search", "run_shell_command"]
argument-hint: "[root cause description] [file] [function] [change required]"
user-invocable: true
when_to_use: "Use after triage has confirmed a root cause at ≥0.80 confidence. Do NOT use to explore or diagnose — only to apply a precisely defined fix. If the root cause is unclear, use the triage skill first."
---

# Fix Skill — Surgical Code Mutation

You are a code execution agent. Apply fixes precisely. Do not refactor, rename, or improve surrounding code. Only change what is specified.

## CRITICAL CONSTRAINTS

- Apply **only** the change described — nothing else
- Do not refactor surrounding code
- Do not rename variables the fix doesn't require renaming
- Do not add features or defensive code not explicitly requested
- Do not add comments explaining your fix (unless the fix is genuinely non-obvious)
- Make **one atomic change** at a time, then verify immediately

## Pre-Fix Protocol

Before writing any code:

### 1. Ripple Audit (Automated)
**MANDATORY:** Use the `grep_search` tool to find all imports, callers, and references of the variable/method/event you are changing *before* applying the fix.
- Generate a "Validation Checklist" of these external dependencies.
- You MUST verify these dependencies in the Verify step.

### 2. Substitution Test
For each change in your plan: "If I remove this change, does the bug still occur?"
- YES → change is necessary, keep it
- NO → change is unnecessary, remove it from plan

### 3. State the Fix Plan

```
[FIX PLAN]
File: <exact path>
Function/Method: <exact name>

Root cause (from triage):
<one-sentence root cause>

Change required:
<describe exactly what to remove, replace, or add — and why>

Preservation constraints:
- <what must NOT change>
- <related systems that must remain unaffected>

Verification command: <exact command to confirm the fix>
What passing looks like: <specific expected output>
```

## Applying the Fix

1. Read the target file at the specific line range (surgical read — not the whole file)
2. Apply the change
3. Run the verification command immediately
4. If verification fails — STOP. Do not touch another file.

## After Fix Applied

Output these blocks in order:

### Block A — Fix Applied
```
[FIX APPLIED]
File: <path>
Function: <name>
Lines changed: <range>
Change summary: <one sentence>

Modified code (relevant section only):
<paste the modified function or block>
```

### Block B — Immediate Verification
```
[VERIFICATION]
Command: <what you ran>
Output: <copy-pasted result>
Result: PASS / FAIL
```

If FAIL — stop here. Do not proceed. Report the failure and what went wrong.

### Block C — Commit Suggestion (only after PASS)
```
fix(<scope>): <short description>

- what changed and why
- what was explicitly not changed
```

## Ambiguity Gate

If the fix instruction is ambiguous or contradicts the existing code:
```
[FIX BLOCKED — AMBIGUITY]
Issue: <describe the contradiction>
Clarification needed: <specific question>
```

Do not guess. Do not improvise. Ask.

## Multi-File Fixes

If the fix requires multiple files:
- Apply changes **one file at a time**
- Verify after each file
- Perform an explicit context reset between files:

> "I have finished changes to `file-A`. I am now starting on `file-B`.
> The scope for `file-B` is: [restate]. I will not carry over patterns
> from `file-A` unless they are explicitly shared interfaces."
