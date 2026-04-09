---
description: "Read and diagnose log files, error outputs, or debug traces to find patterns, errors, and warnings."
allowed-tools: ["read_file", "grep_search", "glob", "run_shell_command"]
argument-hint: "[log file path or issue description]"
user-invocable: true
when_to_use: "Use when the user has a log file, debug output, or error trace they want analyzed. Also use when a process is producing unexpected output and the user wants to understand what's happening from the logs."
---

# Debug Skill — Log Analysis & Diagnosis

Analyze log files, error outputs, and debug traces to identify errors, warnings, and failure patterns.

## Instructions

1. **Identify the log source.** Ask the user for the log file path if not provided. Use `glob` to find log files if the user gives a directory.

2. **Tail efficiently.** Do NOT read entire log files — they can be massive. Grep for `[ERROR]`, `[WARN]`, `FAIL`, `Exception`, `Traceback`, `FATAL` first to find the interesting regions, then read those regions surgically.

3. **Pattern recognition.** Look for:
   - Repeated errors (same message appearing N times)
   - Escalation patterns (warning → error → fatal)
   - Timing correlations (errors clustering at specific timestamps)
   - Stack traces (read the full trace, not just the top frame)

4. **Report findings** in plain language:

```
[LOG ANALYSIS]
Source: <log file path>
Size: <file size>
Time range: <first timestamp — last timestamp>

Errors found: <count>
Warnings found: <count>

Critical issues:
1. <error message> — occurred <N> times, first at <timestamp>
   Stack trace points to: <file:line>
   Likely cause: <one sentence>

2. <next error>...

Patterns:
- <any escalation, clustering, or correlation patterns>

Suggested next steps:
- <what to investigate or fix first>
```

5. **If no log file exists,** help the user enable logging:
   - Suggest the standard logging setup for their stack
   - Ask them to reproduce the issue with logging enabled
   - Offer to re-analyze once logs are available
