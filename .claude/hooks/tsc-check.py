#!/usr/bin/env python3
"""PostToolUse hook: run `tsc --noEmit` after a TypeScript edit and feed any
errors back.

Runs tsc on the whole project (cheap — the project is small) and injects a
summary of any errors into the model context via
`hookSpecificOutput.additionalContext`.

Silently no-ops if tsc isn't available yet (e.g. before `bun install`).
"""

import json
import os
import re
import subprocess
import sys
from pathlib import Path


TS_SUFFIXES = (".ts", ".tsx", ".mts", ".cts")
MAX_ERRORS_REPORTED = 20

# tsc --noEmit --pretty false output:
#   src/app/page.tsx(12,5): error TS2345: message here.
ERROR_RE = re.compile(
    r"^(?P<file>[^(]+)\((?P<line>\d+),(?P<col>\d+)\): error (?P<code>TS\d+): (?P<msg>.*)$"
)


def pick_tsc() -> list[str] | None:
    # Prefer `bun x tsc` — works whether or not Node is installed, and uses the
    # project-local typescript if present. The Node-shebang tsc at
    # node_modules/.bin/tsc fails when Node isn't on PATH.
    for bun in (Path.home() / ".bun" / "bin" / "bun", Path("/usr/local/bin/bun")):
        if bun.exists():
            return [str(bun), "x", "tsc"]
    return None


def main() -> int:
    try:
        data = json.load(sys.stdin)
    except (ValueError, OSError):
        return 0

    tool_input = data.get("tool_input") or {}
    path = tool_input.get("file_path") or ""
    if not path.endswith(TS_SUFFIXES):
        return 0

    project_dir = os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()
    if not (Path(project_dir) / "tsconfig.json").exists():
        return 0

    cmd = pick_tsc()
    if cmd is None:
        return 0

    env = os.environ.copy()
    bun_bin = str(Path.home() / ".bun" / "bin")
    env["PATH"] = f"{bun_bin}:{env.get('PATH', '')}"

    try:
        result = subprocess.run(
            cmd + ["--noEmit", "--pretty", "false"],
            cwd=project_dir,
            env=env,
            capture_output=True,
            text=True,
            timeout=90,
        )
    except (FileNotFoundError, subprocess.TimeoutExpired):
        return 0

    errors: list[tuple[str, int, int, str, str]] = []
    for line in (result.stdout + "\n" + result.stderr).splitlines():
        m = ERROR_RE.match(line.strip())
        if not m:
            continue
        file_path = m.group("file").strip()
        rel = os.path.relpath(
            os.path.join(project_dir, file_path) if not os.path.isabs(file_path) else file_path,
            project_dir,
        )
        errors.append((rel, int(m.group("line")), int(m.group("col")), m.group("code"), m.group("msg")))

    if not errors:
        return 0

    lines = [f"{f}:{ln}:{col} {msg} ({code})" for f, ln, col, code, msg in errors[:MAX_ERRORS_REPORTED]]
    extra = ""
    if len(errors) > MAX_ERRORS_REPORTED:
        extra = f"\n...and {len(errors) - MAX_ERRORS_REPORTED} more"

    context = (
        f"tsc found {len(errors)} type error(s) after your edit:\n"
        + "\n".join(lines)
        + extra
    )

    json.dump(
        {
            "hookSpecificOutput": {
                "hookEventName": "PostToolUse",
                "additionalContext": context,
            }
        },
        sys.stdout,
    )
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
