#!/usr/bin/env python3
"""Print the local T3 Code thread record and continuation context as JSON."""
from __future__ import annotations

import argparse
import json
import os
import re
import sqlite3
import subprocess
import sys
from pathlib import Path
from typing import Any

THREAD_ID_RE = re.compile(r"^\S+$")


def connect(path: Path) -> sqlite3.Connection:
    return sqlite3.connect(f"file:{path}?mode=ro", uri=True)


def clip(value: Any, limit: int = 4000) -> Any:
    return value if not isinstance(value, str) or len(value) <= limit else value[:limit] + "\n[truncated]"


def text_from_item(raw: str) -> str:
    try:
        item = json.loads(raw)
    except json.JSONDecodeError:
        return ""
    chunks: list[str] = []
    content = item.get("content") if isinstance(item, dict) else None
    if isinstance(content, list):
        for block in content:
            if isinstance(block, dict) and isinstance(block.get("text"), str):
                chunks.append(block["text"])
    if isinstance(item, dict) and isinstance(item.get("text"), str):
        chunks.append(item["text"])
    return "\n".join(chunks).strip()


def git_info(cwd: str | None, expected_branch: str | None = None, expected_head: str | None = None) -> dict[str, Any]:
    result: dict[str, Any] = {"cwd": cwd, "exists": bool(cwd and Path(cwd).is_dir() if cwd else False)}
    if not cwd or not result["exists"]:
        return result
    try:
        result["worktree"] = subprocess.check_output(
            ["git", "-C", cwd, "rev-parse", "--show-toplevel"], text=True, stderr=subprocess.DEVNULL
        ).strip()
        result["current_branch"] = subprocess.check_output(
            ["git", "-C", cwd, "branch", "--show-current"], text=True, stderr=subprocess.DEVNULL
        ).strip() or None
        result["head"] = subprocess.check_output(
            ["git", "-C", cwd, "rev-parse", "HEAD"], text=True, stderr=subprocess.DEVNULL
        ).strip()
        result["recorded_branch"] = expected_branch
        result["recorded_head"] = expected_head
        result["matches_recorded"] = (
            (not expected_branch or result["current_branch"] == expected_branch)
            and (not expected_head or result["head"] == expected_head)
        )
        worktrees = subprocess.check_output(
            ["git", "-C", cwd, "worktree", "list", "--porcelain"], text=True, stderr=subprocess.DEVNULL
        )
        result["matching_worktrees"] = []
        candidate: dict[str, str] = {}
        for line in worktrees.splitlines() + [""]:
            if line.startswith("worktree "):
                candidate = {"path": line[9:]}
            elif line.startswith("HEAD "):
                candidate["head"] = line[5:]
            elif line.startswith("branch "):
                candidate["branch"] = line[7:].removeprefix("refs/heads/")
            elif not line and candidate:
                if ((expected_branch and candidate.get("branch") == expected_branch) or
                        (expected_head and candidate.get("head") == expected_head)):
                    result["matching_worktrees"].append(candidate)
                candidate = {}
    except (OSError, subprocess.CalledProcessError):
        result["git"] = False
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("thread_id", help="T3 Code thread UUID")
    parser.add_argument("--max-messages", type=int, default=40, help="maximum conversation messages to include (default: 40)")
    parser.add_argument("--full", action="store_true", help="include every user/agent message")
    args = parser.parse_args()
    if not THREAD_ID_RE.fullmatch(args.thread_id):
        parser.error("thread_id must be a non-empty thread identifier")

    codex_home = Path(os.environ.get("CODEX_HOME", Path.home() / ".codex"))
    state_path = codex_home / "state_5.sqlite"
    history_path = codex_home / "thread_history_1.sqlite"
    thread: dict[str, Any] | None = None
    if state_path.exists():
        try:
            with connect(state_path) as db:
                row = db.execute("SELECT * FROM threads WHERE id = ?", (args.thread_id,)).fetchone()
                if row:
                    cols = [c[1] for c in db.execute("PRAGMA table_info(threads)")]
                    thread = dict(zip(cols, row))
                    thread.pop("sandbox_policy", None)
                    thread.pop("approval_mode", None)
                    thread.pop("first_user_message", None)
                    for key in ("title", "preview"):
                        if key in thread:
                            thread[key] = clip(thread[key], 1000)
        except sqlite3.Error:
            pass

    goals: list[dict[str, Any]] = []
    goals_path = codex_home / "goals_1.sqlite"
    if goals_path.exists():
        try:
            with connect(goals_path) as db:
                rows = db.execute(
                    "SELECT goal_id, objective, status, token_budget, tokens_used, updated_at_ms "
                    "FROM thread_goals WHERE thread_id = ? ORDER BY updated_at_ms DESC",
                    (args.thread_id,),
                ).fetchall()
                goals = [dict(zip(("goal_id", "objective", "status", "token_budget", "tokens_used", "updated_at_ms"), row)) for row in rows]
                for goal in goals:
                    goal["objective"] = clip(goal["objective"])
        except sqlite3.Error:
            pass

    items: list[dict[str, Any]] = []
    if history_path.exists():
        try:
            with connect(history_path) as db:
                rows = db.execute(
                    "SELECT turn_id, item_id, rollout_ordinal, created_at_ms, item_type, item_json "
                    "FROM thread_items WHERE thread_id = ? ORDER BY rollout_ordinal, created_at_ms",
                    (args.thread_id,),
                ).fetchall()
                for turn_id, item_id, ordinal, created_at, item_type, item_json in rows:
                    text = text_from_item(item_json)
                    if text and item_type in {"userMessage", "agentMessage"}:
                        items.append({"turn_id": turn_id, "item_id": item_id, "ordinal": ordinal, "created_at_ms": created_at, "type": item_type, "text": clip(text, 8000)})
        except sqlite3.Error:
            pass

    if thread is None and not items:
        print(json.dumps({"found": False, "thread_id": args.thread_id}, indent=2))
        return 1

    if thread is None:
        thread = {"id": args.thread_id, "source": "thread_history"}
    cwd = thread.get("cwd")
    result = {
        "found": True,
        "thread": thread,
        "recommended_worktree": git_info(cwd, thread.get("git_branch"), thread.get("git_sha")),
        "goals": goals,
        "conversation": items if args.full else items[-max(args.max_messages, 1):],
        "conversation_message_count": len(items),
        "databases": {"state": str(state_path), "history": str(history_path), "goals": str(goals_path)},
    }
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
