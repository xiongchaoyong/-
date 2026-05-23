#!/usr/bin/env bash
# Stop hook: commit and push (PROGRESS.md is manually updated by Claude during the session)
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

# 2. Update timestamp
sed -i '' "s/^> 最后更新：.*/> 最后更新：${TODAY}/" PROGRESS.md

# 3. Check if there's anything to commit
git add .
if git diff --cached --quiet 2>/dev/null; then
  exit 0
fi

# 4. Commit and push
git commit -m "chore: 自动记录项目进度" 2>/dev/null || true
git push 2>/dev/null || true
