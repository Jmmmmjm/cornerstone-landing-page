# My Debug Framework

A fully autonomous debugging framework that runs the complete pipeline: **scope → reproduce → CoVe analysis → surgical fix → adversarial verify → loop on failure**. Designed for use with any LLM CLI (Gemini CLI, Claude Code, etc.) on any tech stack.

## Quick Start (Gemini CLI)

```bash
# Full pipeline — give it a bug and it fixes it end-to-end
gemini "Read my-debug-framework/skills/orchestrator/SKILL.md and follow those instructions. Bug: <describe the bug>"

# Just triage — find root cause without fixing
gemini "Read my-debug-framework/skills/triage/SKILL.md and follow those instructions. Bug: <describe the bug>"

# Just verify — check if a recent change is correct
gemini "Read my-debug-framework/skills/verify/SKILL.md and follow those instructions. Task: <what was implemented> Files: <what changed>"
```

## Structure

```
my-debug-framework/
├── README.md
├── skills/
│   ├── orchestrator/
│   │   └── SKILL.md           # ★ MASTER — complete end-to-end pipeline
│   ├── triage/
│   │   └── SKILL.md           # CoVe root cause analysis with confidence gating
│   ├── fix/
│   │   └── SKILL.md           # Surgical code mutation with ripple audit
│   ├── verify/
│   │   └── SKILL.md           # Adversarial verification (try to break it)
│   ├── debug/
│   │   └── SKILL.md           # Log file analysis & diagnosis
│   └── stuck/
│       └── SKILL.md           # Process-level hang/freeze diagnosis
├── agents/
│   └── verification-agent.md  # Full verification agent definition
└── docs/
    └── architecture.md        # Skill system architecture reference
```

## The Pipeline

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  REPRODUCE   │────▶│  CoVe TRIAGE │────▶│ SURGICAL FIX │────▶│   VERIFY     │
│  (Phase 1)   │     │  (Phase 2)   │     │  (Phase 3)   │     │  (Phase 4)   │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                           │                                          │
                     confidence                                  VERDICT:
                      < 0.80?                                     FAIL?
                           │                                          │
                           ▼                                          ▼
                     ┌──────────┐                              ┌──────────────┐
                     │ Read more│                              │  PHASE 5     │
                     │ evidence │                              │ Re-CoVe loop │
                     └──────────┘                              │ (max 3x)    │
                                                               └──────────────┘
```

## Skills

### `/orchestrator` — The Master Skill ★
**Use this for end-to-end debugging.** Runs the complete pipeline autonomously. Includes task declaration, scope locking, doom loop guards, and failure recovery. Sources:
- CoVe reasoning loop from `analyst.md`
- O.P.A.V. workflow from `claude_desktop_agentic_skill.md`
- Focus discipline from `focus.md` (task declaration, substitution test, distraction guards)
- Atomic execution from `focus.md` (one change at a time, verify after each)
- Adversarial self-review from `focus.md` Phase 4
- Failure recovery loop from `triage.md` (revert on regression, re-CoVe, max 3 attempts)

### `/triage` — CoVe Root Cause Analysis
Standalone root cause finder. 4-stage Chain of Verification: Baseline → Verification Questions → Independent Answers → Refined Root Cause. Confidence gating prevents premature fixes.

### `/fix` — Surgical Code Mutation
Applies precisely scoped fixes. Includes ripple audit, substitution test, one-file-at-a-time atomic execution with context resets between files. Based on `claude_desktop_agentic_skill.md` Phase A and `triage.md` Fix Executor.

### `/verify` — Adversarial Verification
Tries to **break** the implementation. Every PASS requires a command block with copy-pasted output — code reading is not evidence. Based on Claude Code's `verificationAgent.ts`.

### `/debug` — Log Analysis
General-purpose log file diagnosis. Greps for errors/warnings, identifies patterns, reports findings.

### `/stuck` — Process Diagnosis
Diagnoses frozen/slow processes. Cross-platform (Linux/macOS/Windows). Diagnostic only — never kills processes.

## Key Patterns Merged

| Pattern | Source | Used In |
|---|---|---|
| CoVe 4-stage reasoning loop | `analyst.md` | orchestrator, triage |
| Confidence gating (≥0.80 / 0.60–0.79 / <0.60) | `analyst.md` | orchestrator, triage |
| Task declaration + scope locking | `focus.md` | orchestrator |
| Substitution test | `focus.md` | orchestrator, fix |
| Doom loop guard | `focus.md` | orchestrator |
| Atomic execution (one change → verify) | `focus.md` | orchestrator, fix |
| Adversarial self-review | `focus.md` | orchestrator, verify |
| Context reset between files | `focus.md` | fix |
| O.P.A.V. (Observe→Plan→Act→Verify) | `claude_desktop_agentic_skill.md` | orchestrator |
| Ripple audit | `claude_desktop_agentic_skill.md` | fix |
| Surgical reads (offset/line-range) | `claude_desktop_agentic_skill.md` | all skills |
| Fix executor + verification checklist | `triage.md` | fix |
| Failure path (revert → re-analyze) | `triage.md` | orchestrator |
| Adversarial verification (try to break it) | Claude Code `verificationAgent.ts` | verify, orchestrator |
| Rationalization rejection list | Claude Code `verificationAgent.ts` | orchestrator, triage, verify |
| Session state tracking | `analyst.md` | orchestrator, triage |
