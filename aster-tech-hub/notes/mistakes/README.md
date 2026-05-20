# Mistakes & Learnings

This folder contains documentation of mistakes made during development and the lessons learned from them.

---

## Purpose

**Main goal:** Learn from mistakes so we don't repeat them!

---

## List of Mistakes Documented

| # | Mistake | Severity | Status |
|---|---------|----------|--------|
| 1 | Tailwind Version Mismatch | 🔴 HIGH | Documented |
| 2 | Duplicate CSS Styles | 🟡 MEDIUM | Documented |

---

## How to Use This Folder

1. **Before starting new work** - Check this folder to avoid known mistakes
2. **When stuck** - Search if similar issue already documented
3. **After fixing a bug** - Add it here so others can learn

---

## Adding New Mistakes

When you make a mistake:

1. Create new file: `mistakes/mistake-name.md`
2. Use this template:

```markdown
# Mistake #X: Title

**Date:** YYYY-MM-DD
**Severity:** 🔴 HIGH / 🟡 MEDIUM / 🟢 LOW

---

## What Happened

(explain the mistake)

## Why It Happened

(root cause analysis)

## The Fix

(how to fix it)

## Key Takeaway

> **Lesson:** (one sentence lesson)
```

---

## Severity Levels

| Level | Meaning | Action |
|-------|---------|--------|
| 🔴 HIGH | Project won't work at all | Fix immediately |
| 🟡 MEDIUM | Features broken or degraded | Fix soon |
| 🟢 LOW | Minor issue, cosmetic | Fix when convenient |

---

## Common Mistakes to Watch Out For

1. **Version Mismatches** - Always check dependencies
2. **Copy-Paste Errors** - Always review after pasting
3. **Missing Imports** - Check IDE warnings
4. **Typos** - Use spell-check, IDE autocomplete
5. **Path Errors** - Use @/* alias consistently
