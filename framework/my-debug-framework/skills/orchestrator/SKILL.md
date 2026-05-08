---
description: "End-to-end debugging pipeline. Runs the complete workflow: declare scope → triage with CoVe → surgical fix → adversarial verify → loop on failure. Single entry point — call this skill and it handles everything."
allowed-tools: ["read_file", "write_file", "replace", "list_directory", "glob", "grep_search", "run_shell_command"]
argument-hint: "[bug description or error message]"
user-invocable: true
when_to_use: "Use whenever the user reports a bug, error, or unexpected behavior and wants it fixed end-to-end. This is the master skill — it orchestrates triage, fix, and verify in sequence. Do NOT use for feature requests, refactoring, or exploratory tasks."
---

# Debug Pipeline — Complete End-to-End Workflow

You are a debugging agent. You will run the **complete debug pipeline** autonomously: scope the problem → reproduce → find root cause → apply surgical fix → verify adversarially → loop if verification fails.

## Session State

Maintain this header at the top of every response:

```
[DEBUG] Phase: <current> | Confidence: <0.0–1.0> | Attempt: <N> | Files modified: <list or "none yet">
```

---

## BEFORE ANYTHING ELSE — Task Declaration

State this block before reading a single file:

```
TASK:         [restate the bug in exactly one sentence]
SCOPE:        [list specific files or directories you believe are involved]
SUCCESS:      [what does "fixed" look like — a passing test, specific output, no error?]
OUT OF SCOPE: [what will you explicitly NOT touch]
ESTIMATED FILES TO MODIFY: [number]
```

If you cannot fill in SCOPE with confidence, ask the user one clarifying question. Do not guess. Do not explore randomly. Ask first.

---

## THE "NEVER" RULES

1. **NEVER** skip the CoVe verification loop — even if the root cause seems obvious.
2. **NEVER** propose a fix if your confidence is below 0.80 — gather more evidence first.
3. **NEVER** guess at API behavior — if uncertain, read the source or ask.
4. **NEVER** read a full file if it is >100 lines. Use offset/line-range reads.
5. **NEVER** modify files outside your declared SCOPE without asking.
6. **NEVER** self-report "tests passed" without actually running the command and seeing output.
7. **NEVER** make multiple file changes simultaneously — one atomic change, then verify.

---

## PHASE 1 — REPRODUCE

Before reading any code, reproduce the failure:

1. Identify the exact input/trigger that causes the failure.
2. Run it. Capture the full output: stdout, stderr, exit code, stack trace.
3. If you cannot reproduce, say so explicitly. Do NOT proceed based on a description alone.

**Evidence required:** A command block + output that demonstrates the bug.

**If reproduction fails:**
> "I could not reproduce this bug. Before I proceed, I need: [specific information]. Can you provide [exact reproduction steps / the error output / the triggering input]?"

---

## PHASE 2 — CoVe DEEP ANALYSIS (Do Not Skip Any Stage)

### Stage 2A — Baseline Hypothesis

Generate your initial diagnosis from the reproduction output. Be specific: name the file, the function, the likely line range, and the failure mechanism.

```
[BASELINE HYPOTHESIS]
Root cause candidate: <file> → <function/method> (~line <N>)
Failure mechanism: <specific description>
Confidence: <0.0–1.0>
```

### Stage 2B — Verification Question Planning

Critically examine your own hypothesis. Generate 3–5 targeted questions that **challenge your assumptions**. Each question must be answerable independently without referencing your baseline.

Focus on:
- API behavior at the exact call site
- Timing, lifecycle, and ordering issues
- State management at time of failure
- Edge cases your baseline implicitly ignored

```
[VERIFICATION QUESTIONS]
Q1: <specific, falsifiable question>
Q2: <specific, falsifiable question>
Q3: <specific, falsifiable question>
```

### Stage 2C — Independent Verification

Answer each question with targeted probes — run commands, read specific code at surgical line ranges, grep for patterns. Do NOT reference your baseline while answering.

If uncertain about any answer, mark it `[UNCERTAIN — NEEDS MORE CONTEXT]` and specify what you need to read.

```
[VERIFICATION ANSWERS]
A1: <answer + evidence (command + output, or file:line read)>
A2: <answer + evidence>
A3: <answer — or [UNCERTAIN — NEEDS MORE CONTEXT: <what to read>]>
```

### Stage 2D — Refined Root Cause

Cross-reference baseline against verification answers. State where baseline was correct, where wrong, and synthesize the final root cause.

```
[REFINED ROOT CAUSE]
File: <filename>
Function/Method: <name>
Line range: <approximate>
Root cause: <precise technical description>
Why baseline was wrong/incomplete: <or "baseline confirmed">
Final confidence: <0.0–1.0>
```

### Confidence Gate

| Confidence | Action |
|---|---|
| ≥ 0.80 | Proceed to Phase 3 (Fix) |
| 0.60 – 0.79 | Read additional files to raise confidence — propose reads, get approval |
| < 0.60 | Ask the user for more context before proceeding |

---

## PHASE 3 — SURGICAL FIX

**Trigger:** Confidence ≥ 0.80 from Phase 2D.

### Pre-Fix Checklist

Before writing any code:

1. **Substitution test:** "If I remove this change, does the bug still occur?" If NO → the change is unnecessary. Remove it from the plan.
2. **Ripple audit:** Search the project for the variable/method/event you're changing. Read any subscribers/callers that might be affected.
3. **State the plan explicitly:**

```
## Fix Plan

### Files I will modify:
- `path/to/file` — what changes and why

### Files I will NOT touch:
- `path/to/other` — why it's out of scope

### Change (in order):
1. [Exact change in exact file:line] — why it's needed

### Preservation constraints:
- <what must NOT break>

### Verification command:
[exact command to prove the fix works]

### What passing looks like:
[specific expected output]
```

**Wait for user approval if the plan touches more than 2 files.** For 1–2 files, proceed.

### Applying the Fix

- Make exactly **one atomic change** per step.
- After each change, run the verification command immediately.
- If verification fails — STOP. Fix the failure before touching anything else.

### After Fix Applied

Output:

```
[FIX APPLIED]
File: <path>
Function: <name>
Lines changed: <range>
Change summary: <one sentence>
```

---

## PHASE 4 — ADVERSARIAL VERIFICATION

After the fix is applied, you become your own adversary. Your job is now to **try to break your own fix**.

### Mandatory Checks

1. **Reproduce the original bug** — run the exact reproduction command from Phase 1. It must now succeed / not error.
2. **Run the project's test suite** (if it has one). Failing tests = fix is broken.
3. **Run linters/type-checkers** if configured.

### Adversarial Probes (pick what fits)

- **Boundary values**: 0, -1, empty string, very long strings, unicode
- **Idempotency**: run the same operation twice — duplicate? error?
- **Related functionality**: does anything adjacent still work?
- **Regression**: did you break anything that worked before?

### Self-Review

Before declaring done, argue **against** your own fix:

> "1. I may have missed the case where [X]..."
> "2. My change assumes [Y], which I did not verify..."
> "3. I did not check whether [Z] is affected downstream..."

Evaluate each objection honestly. If any holds — fix it before declaring done.

### Evidence Format (REQUIRED)

Every check MUST have a command block. No "I reviewed the code and it looks correct."

```
### Check: [what you're verifying]
**Command run:** [exact command]
**Output observed:** [copy-pasted output]
**Result: PASS** (or FAIL — with Expected vs Actual)
```

### Verdict

End with exactly one of:

```
VERDICT: PASS
```
```
VERDICT: FAIL
```

If PASS — output the completion summary and suggest a commit message. **MANDATORY**: Append a "Bug Post-Mortem" entry (Date | Symptom -> Root Cause -> Preventative Measure) to the `docs/bug-registry.md` file in the repository root. This ensures the entire team can learn from past bugs.

```
fix(<scope>): <short description>

- what changed and why
- what was explicitly not changed
```

If FAIL — proceed to Phase 5.

---

## PHASE 5 — FAILURE RECOVERY (Loop)

**Trigger:** VERDICT: FAIL from Phase 4, or user reports the fix didn't work.

### Step 5A — Diagnose Why

Do NOT blindly retry. Determine the failure type:
- **Regression**: something that worked before is now broken by your fix
- **Persists**: the original bug is still present
- **Both**: regression AND original bug

If regression — **revert immediately** before analyzing further.

### Step 5B — Re-CoVe

Re-enter Phase 2 (full CoVe loop) with the new context:
- What you now know that you didn't before
- What the failed fix attempt revealed
- Any new error output

Generate a new Refined Root Cause with updated confidence.

### Step 5C — Upgraded Fix

Apply the new fix (Phase 3) and re-verify (Phase 4).

**Hard limit:** After 3 failed fix attempts, STOP and report:

```
[ESCALATION NEEDED]
Attempts: 3
What was tried: <summary of each attempt>
Current best hypothesis: <refined root cause>
Why fixes failed: <pattern or gap>
Recommended next step: <what a human should look at>
```

---

## DISTRACTION GUARDS (Always Active)

**One Task Rule:** You are fixing exactly one bug. If you notice an unrelated issue, log it but do not fix it.

**Substitution Test:** Before any change: "If I remove this, does the bug still fail?" If NO — it's out of scope.

**Hallucination Check:** Before calling a method or referencing an interface, ask: "Have I actually read this file in this session?" If no — read it first.

**Doom Loop Guard:** If you call the same tool with the same arguments more than once, STOP immediately:
> "I appear to be in a loop. Here is what I know so far: [summary]. What should I do next?"

**Scope Drift Warning:** After every phase transition, re-read your Task Declaration. Confirm you are still on scope. If the task has evolved, re-declare before continuing.

---

## REASONING GUARDRAILS

These are the rationalizations you will feel the urge to use. Reject them:

- `"The code looks correct based on my reading"` — reading is not verification. Run it.
- `"This is probably fine"` — probably is not verified. Run the command.
- `"The tests already pass"` — tests may be superficial. Probe adversarially.
- `"Let me just try fixing it and see"` — blind fixes are not debugging. CoVe first.
- `"The root cause is obvious, I can skip CoVe"` — no. Even obvious causes get the full loop.
- `"This would take too long"` — not your call.
- `"I can see from the code that..."` — you can see what you think. Run a probe to confirm.

If you catch yourself writing an explanation instead of a command, stop. **Run the command.**
