---
description: Triage an ambiguous bug or failure by applying Chain of Verification (CoVe) reasoning to identify the true root cause before any fix is attempted.
allowed-tools: ["view_file", "grep_search", "list_dir", "run_command", "read_url_content"]
argument-hint: "[bug description, error message, or structured triage package]"
user-invocable: true
when_to_use: "Use when a bug report is unclear, when you don't know where the failure is, when a previous fix attempt failed, or when you receive a structured triage package from another agent. Do NOT jump to fixes — gather evidence first, apply CoVe reasoning, then propose a targeted remedy only at sufficient confidence."
---

# Triage Skill — CoVe-Enhanced Root Cause Analysis

Perform structured triage on a bug or failure before attempting any fix. The goal is an accurate, evidence-backed root cause with a confidence score — not a solution.

## Session State

At the top of each response during an active triage session, maintain a one-line status header:

```
[TRIAGE] Phase: <current phase> | Confidence: <score> | Back-channels: <N> | Fallback: <active/inactive>
```

## Core Principle

**Do not propose a fix until you have a confirmed root cause at ≥0.80 confidence.** If an approach fails, diagnose *why* before switching tactics. Read the error, check your assumptions, try a focused probe. Don't retry the identical action blindly, but don't abandon a viable approach after a single failure either.

### THE "NEVER" RULES
1. **NEVER** suggest a fix if your CoVe confidence is below 0.80 — escalate to back-channel first.
2. **NEVER** skip the CoVe verification loop — even if the root cause seems obvious.
3. **NEVER** guess at API behavior — if uncertain, flag it and generate a back-channel query.
4. **NEVER** treat a triage package as ground truth — confidence scores from other agents are signals, not facts.
5. **NEVER** read files unless you have a specific hypothesis to confirm or falsify.

---

## Phase 1 — Ingestion & Reproduce

Before reading any code, ingest the report and reproduce the failure.

**If you receive a structured triage package**, parse and validate all fields. Flag any field that is missing or malformed before proceeding. Acknowledge the top culprit file and its confidence score. Flag any suspect with confidence < 0.6 as "low confidence — may need back-channel."

**For any bug report:**

1. Identify the exact input/trigger that causes the failure.
2. Run it. Capture the full output: stdout, stderr, exit code, stack trace.
3. If you cannot reproduce it, say so explicitly. Do not proceed to Phase 2 based on a description alone.

**Evidence required:** A command block + output that demonstrates the bug.

**Output format:**
```
[TRIAGE RECEIVED]
✓ Report parsed (all fields present / missing: <list>)
Top culprit: <filename> (<confidence_score or "unknown">)
Low-confidence suspects: <list or "none">
Reproduction: <succeeded with command + output / failed — reason>
CoVe plan: <one sentence>
Proceeding to deep analysis...
```

---

## Phase 2 — CoVe Deep Analysis

This is the core of your work. Execute a strict four-stage Chain of Verification loop. Do not compress or skip stages.

### Stage 2A — Baseline Hypothesis

Generate your initial, best-effort diagnosis of the root cause based solely on the reproduction output and report context. Be specific: name the file, the function, the likely line range, and the failure mechanism.

```
[BASELINE HYPOTHESIS]
Root cause candidate: <file> → <function/method> (~line <N>)
Failure mechanism: <specific description>
Confidence: <0.0–1.0>
```

### Stage 2B — Verification Question Planning

Critically examine your own baseline hypothesis. Generate 3–5 targeted verification questions that **challenge your assumptions**. Each question must be answerable independently, without referencing your baseline answer.

Focus questions on:
- API behavior at the exact call site
- Timing, lifecycle, and ordering issues
- Authority/ownership model (if applicable)
- State management at time of failure
- Edge cases your baseline answer implicitly ignored

```
[VERIFICATION QUESTIONS]
Q1: <specific, falsifiable question>
Q2: <specific, falsifiable question>
Q3: <specific, falsifiable question>
Q4 (optional): ...
Q5 (optional): ...
```

### Stage 2C — Independent Verification

Answer each question from Stage 2B independently. Do NOT reference your baseline hypothesis while answering. Use targeted probes — run commands, read specific code, grep for patterns.

If you are uncertain about a specific behavior, do not guess — mark it `[UNCERTAIN — BACK-CHANNEL NEEDED]`.

```
[VERIFICATION ANSWERS]
A1: <answer + evidence (command run + output)>
A2: <answer + evidence>
A3: <answer — or [UNCERTAIN — BACK-CHANNEL NEEDED]>
...
```

### Stage 2D — Refined Root Cause

Cross-reference your baseline hypothesis against your verification answers. Explicitly state where the baseline was correct, where it was wrong, and synthesize the final root cause. Assign a final confidence score.

```
[REFINED ROOT CAUSE]
File: <filename>
Function/Method: <name>
Line range: <approximate>
Root cause: <precise technical description>
Why baseline was wrong/incomplete: <or "baseline confirmed">
Final confidence: <0.0–1.0>
```

---

## Phase 3 — Back-Channel Query (Conditional)

**Trigger:** Any `[UNCERTAIN — BACK-CHANNEL NEEDED]` flag from Stage 2C, OR final confidence < 0.80.

Generate a self-contained query block that can be sent to another agent, teammate, or tool for additional context retrieval. The block must work cold — no prior context assumed.

```
[BACK-CHANNEL QUERY]
─────────────────────────────────────────
Context retrieval request for a debugging pipeline.
A downstream analysis needs the following specific information from the codebase.
Do NOT attempt to fix anything. Only retrieve and return the requested context.

Bug context: <one-sentence summary>

Please retrieve the following:
1. <Specific function/method/variable in specific file>
2. <Specific system ordering or dependency>
3. <Specific API usage pattern at a named call site>

Return format: For each item, provide the file path, the relevant code block (±10 lines), and a one-sentence explanation.
─────────────────────────────────────────
```

**After receiving back-channel response:** Re-enter Phase 2D with the new context and recalculate the refined root cause and confidence score.

---

## Phase 4 — Fix Proposal

**Trigger:** Final confidence ≥ 0.80 from Phase 2D (or after back-channel resolution).

Generate a surgical, unambiguous fix proposal:

```
[FIX PROPOSAL]
─────────────────────────────────────────
File: <exact file path>
Function/Method: <exact name>

ROOT CAUSE:
<precise root cause from Phase 2D>

CHANGE REQUIRED:
<Describe the exact change — what to remove, what to replace, and why>

PRESERVATION CONSTRAINTS:
- <What must NOT be changed>
- <Related systems that must remain unaffected>

VERIFICATION: After applying the fix, run: <specific command to confirm the fix>
─────────────────────────────────────────
```

Do NOT include a fix proposal if confidence is still below 0.80. Write `"Root cause unconfirmed — additional probes needed: <list>"` instead.

---

## Phase 5 — Fallback (When Fix Fails)

**Trigger:** User reports the fix didn't work, or a previous fix attempt has failed.

### Step 5A — Surgical Read Proposal

Before reading additional code, propose the minimal file list needed for deeper inspection. Present it for approval.

```
[FALLBACK INITIATED]
Previous fix did not resolve the issue. I need to read the following files directly.

Proposed reads:
1. <file path> — reason: <why this file>
2. <file path> — reason: <why this file>
3. <file path> — reason: <why this file> (if needed)

HARD CONSTRAINTS:
✗ No file writes or edits
✗ Read-only, targeted line ranges only
✗ No scope expansion without returning to this step

Approve? (yes / adjust the list)
```

### Step 5B — Surgical Read + Re-CoVe

Upon approval, read only the approved files at surgical line ranges. Then re-run the full CoVe loop (Phases 2A–2D) with the newly acquired context. Generate an upgraded fix proposal:

```
[UPGRADED FIX PROPOSAL v2]
```

---

## Confidence Gate Summary

| Confidence | Action |
|---|---|
| ≥ 0.80 | Proceed to Fix Proposal (Phase 4) |
| 0.60 – 0.79 | Generate Back-Channel Query (Phase 3) first |
| < 0.60 | Generate Back-Channel Query AND flag that fallback may be needed |

---

## Reasoning Guardrails — Recognize Your Own Rationalizations

You will feel the urge to skip CoVe stages or jump to fixes. These are the exact excuses to reject:

- `"I can see from the code that..."` — looking is not verification. Run a probe.
- `"It's probably X"` — probably is not triage. Confirm or falsify with evidence.
- `"Let me just try fixing Y and see"` — blind fixes are not triage. Localize first.
- `"The error is clear"` — then reproduce it and paste the output.
- `"The code looks correct based on my reading"` — reading is not verification. Run it.
- `"This is probably fine"` — probably is not verified. Run it.
- `"The root cause is obvious, I can skip CoVe"` — no. Even obvious causes get the full loop. That's the contract.

If you catch yourself writing an explanation instead of a command, stop. **Run the command.**

---

## Output Format — Bug Report (Phase 2D Complete)

```
### Bug Report

**Symptom**: [one sentence — what the user sees]

**Root cause**: [one sentence — the actual defect]

**Evidence**:
  Reproduction command: <exact command>
  Reproduction output: <copy-pasted output>
  File: <file:line>
  Baseline hypothesis: <original guess>
  Verification questions that challenged it: <list>
  Hypothesis confirmed/falsified by: <probe command + output>

**Confidence**: <0.0–1.0>

**Scope**: [regression | known behavior | unknown — justify]

**Blast radius**: [what else may be affected]

**Proposed fix**: [only if confidence ≥ 0.80 — single surgical change]
```
