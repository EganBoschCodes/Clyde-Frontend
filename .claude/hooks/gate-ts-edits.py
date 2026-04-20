#!/usr/bin/env python3
"""PreToolUse hook: block Edit/Write/MultiEdit on TypeScript files until the
write-typescript skill has been invoked in this session.

Pairs with mark-write-typescript.py, which creates the marker file.
"""

import json
import sys
from pathlib import Path


TS_SUFFIXES = (".ts", ".tsx", ".mts", ".cts")

REASON = (
    "Run the /write-typescript skill before editing TypeScript files in this "
    "repo — it loads the TS patterns (typing, React, anti-patterns) we follow "
    "here."
)


def main() -> int:
    try:
        data = json.load(sys.stdin)
    except (ValueError, OSError):
        return 0

    path = (data.get("tool_input") or {}).get("file_path") or ""
    if not path.endswith(TS_SUFFIXES):
        return 0

    session_id = data.get("session_id") or ""
    marker = Path(f"/tmp/claude-write-typescript-{session_id}")
    if marker.exists():
        return 0

    json.dump(
        {
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": REASON,
            }
        },
        sys.stdout,
    )
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
