---
description: "Diagnose frozen, stuck, or very slow processes on this machine. Diagnostic only — does not kill or signal processes."
allowed-tools: ["run_shell_command", "read_file", "grep_search"]
argument-hint: "[pid or symptom description]"
user-invocable: true
when_to_use: "Use when the user reports a process appears frozen, pegged at high CPU, or unresponsive. Do NOT use for code bugs — use the orchestrator or triage skill instead."
---

# Stuck Skill — Process-Level Diagnosis

The user thinks a process on this machine is frozen, stuck, or very slow. Investigate and report.

## What to Look For

- **High CPU (≥90%) sustained** — likely an infinite loop. Sample twice, 1–2s apart, to confirm it's not a transient spike.
- **Process state `D` (uninterruptible sleep)** — often an I/O hang.
- **Process state `T` (stopped)** — user probably hit Ctrl+Z by accident.
- **Process state `Z` (zombie)** — parent isn't reaping.
- **Very high RSS (≥4GB)** — possible memory leak.
- **Stuck child process** — a hung subprocess can freeze the parent.

## Investigation Steps

1. **List processes:**
   - Linux/macOS: `ps -axo pid=,pcpu=,rss=,etime=,state=,comm=,command=`
   - Windows: `tasklist /v` or `Get-Process | Sort-Object CPU -Descending | Select-Object -First 20`

2. **For suspicious processes:**
   - Child processes: `pgrep -lP <pid>` (Linux/macOS) or check parent PID
   - If high CPU: sample again after 1–2s to confirm sustained
   - If child looks hung: note its full command line

3. **Check logs** if you can find them — the last few hundred lines often show what it was doing before hanging.

## Report

```
[PROCESS DIAGNOSIS]
Target: <process name / PID>
Status: <stuck / slow / healthy>

Observations:
- CPU: <percentage> (sustained: yes/no)
- RSS: <amount>
- State: <state code + meaning>
- Uptime: <duration>
- Children: <child processes>

Diagnosis: <what's likely wrong>
Recommendation: <what the user should do — but do NOT kill processes yourself>
```

**Do not kill or signal any processes** — this is diagnostic only.
