---
description: "Inject diagnostic probes to extract ground-truth state before proposing a fix."
allowed-tools: ["read_file", "write_file", "replace", "run_shell_command"]
argument-hint: "[target file] [variable/state to probe]"
user-invocable: true
when_to_use: "Use when the root cause is not 100% clear after reading 2 files. Inject temporary console logs/traces to verify variable values at runtime before proposing a fix."
---

# Instrument Skill — Active Probing

**Goal:** Inject diagnostic "probes" to extract ground-truth state at runtime. Stop guessing what a variable contains and force the system to tell you.

## THE "NEVER" RULES
1. **NEVER** leave probes in the codebase. Always clean up immediately after capturing the output.
2. **NEVER** instrument production/database modifying code without extreme care.

## Workflow

1. **Identify the Path:** Based on triage, find the exact file and line where the state is ambiguous.
2. **Inject Probes:** Use the `replace` tool to add temporary, uniquely-labeled logging.
   - For JavaScript/TypeScript: `console.log('DEBUG_PROBE_A', { variable }); console.trace();`
   - For Python: `print(f'DEBUG_PROBE_A: {variable}')`
3. **Execute & Capture:** Run the reproduction script or trigger the UI. Capture only the lines matching `DEBUG_PROBE`.
4. **Cleanup:** Immediately revert the file changes to remove the probes.
5. **Report:** Feed the extracted state back into the CoVe Triage loop.

## Output Format

```
[INSTRUMENTATION COMPLETED]
File Probed: <file path>
Line: <approximate line>

Ground Truth Extracted:
<copy-paste the exact output from the probe>

Cleanup Status: <Confirm probes were removed>
```