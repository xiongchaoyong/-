#!/usr/bin/env bash
# Stop hook: record progress, commit, and push
set -euo pipefail

TODAY=$(date +%Y-%m-%d)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$PROJECT_DIR"

# 1. Ensure PROGRESS.md exists
if [ ! -f PROGRESS.md ]; then
  cat > PROGRESS.md <<HEADER
# 项目进度记录

> 最后更新：${TODAY}
> 本项目进度由 Claude Code Stop hook 自动维护

---

## 变更记录

HEADER
fi

# 2. Check for substantive changes
DIFF_STAT=$(git diff --stat 2>/dev/null || true)
UNTRACKED=$(git ls-files --others --exclude-standard 2>/dev/null || true)

if [ -z "$DIFF_STAT" ] && [ -z "$UNTRACKED" ]; then
  # No changes — just update the timestamp
  sed -i '' "s/^> 最后更新：.*/> 最后更新：${TODAY}/" PROGRESS.md
  exit 0
fi

# 3. Generate a one-line summary from changed files
FILES=$(git diff --cached --name-only 2>/dev/null | head -5 | tr '\n' ', ' | sed 's/,$//')
if [ -z "$FILES" ]; then
  FILES=$(git diff --name-only 2>/dev/null | head -5 | tr '\n' ', ' | sed 's/,$//')
fi
if [ -z "$FILES" ]; then
  FILES="untracked files"
fi

# 4. Append to PROGRESS.md (avoid duplicate entries)
NEW_ENTRY="- **${TODAY}**：${FILES}"
if ! grep -qF "${FILES}" PROGRESS.md 2>/dev/null; then
  echo "$NEW_ENTRY" >> PROGRESS.md
fi

# Update timestamp
sed -i '' "s/^> 最后更新：.*/> 最后更新：${TODAY}/" PROGRESS.md

# 5. Commit and push
git add .
if git diff --cached --quiet 2>/dev/null; then
  exit 0  # Nothing to commit
fi

git commit -m "chore: 自动记录项目进度 — ${FILES}" 2>/dev/null || true
git push 2>/dev/null || true
