#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
git push -u origin HEAD:test/unit-tests-cover-all-features --force
gh pr create --base master --head test/unit-tests-cover-all-features \
  --title "test: 补齐 Jest 单元测试覆盖现有弹幕功能" \
  --body-file scripts/pr-body.md
