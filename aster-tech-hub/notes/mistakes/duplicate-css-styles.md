# Mistake #2: Duplicate CSS Styles

**Date:** 2024
**Severity:** 🟡 MEDIUM

---

## The Problem

`globals.css` mein same styles do baar likhe gaye the (duplicate code).

---

## Where Duplicates Exist

### Body Styles Duplicate

**Location 1 (around line 19):**
```css
body {
  background-color: #0a0a0f;
  color: #e4e1e9;
}
```

**Location 2 (around line 87-90):**
```css
body {
  background-color: #0A0A0F;
  color: #E4E1E9;
}
```

### Issues with duplicates:

1. **Confusion** - Kaunsa use hoga, kaunsa ignore?
2. **Maintenance nightmare** - Ek jagah change kiya, doosre mein nahi
3. **Code bloat** - Unnecessary file size
4. **Inconsistency** - Uppercase/lowercase different hai (#0a0a0f vs #0A0A0F)

---

## Why This Happened

Copy-paste errors from HTML templates jo separately likhe gaye the.

---

## The Fix

Keep only ONE body declaration, preferably at the top of the file.

---

## Key Takeaway

> **Lesson:** CSS cleanup important hai. Kabhi bhi copy-paste se pehle duplicates check karo.

---

## Prevention Tips

1. **Search before paste** - `Ctrl+F` se check karo ki same class/file mein pehle se toh nahi hai
2. **Use IDE extensions** - ESLint/CSS linting to automatically catch duplicates
3. **Organize CSS** - Sections mein divide karo with comments
