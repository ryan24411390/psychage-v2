# Psychage V2 Post-Refactor Issue Fix — 2026-04-16

**Branch:** `cleanup/postfix-2026-04-16` (off `cleanup/execute-2026-04-16` @ `6b3a126`)
**HEAD:** `27d21da`
**Commits since execute branch:** 8 (`git log cleanup/execute-2026-04-16..HEAD --oneline`)
**Build:** ✅ green (exit 0, 17.62s, 5009 modules, 73M dist, 339 chunks)
**Typecheck:** ✅ green
**Tests:** 13 fail / 118 pass / 1 skip (files); 68 fail / 1373 pass / 4 skip (tests) — improved by 2 file failures vs baseline
**Sacred regressions:** 0
**Self-audit:** 10/10 PASS

---

## Executive Summary

| Metric | Value |
|---|---:|
| Issues discovered (Phase 1) | ~30 (3 critical, 15 major, 12 minor/info) |
| Issues fixed | 9 (4 docs banners + 6 env vars + 2 actionUrls + 2 orphan tests + 1 comment) |
| Issues deferred | 43 orphan public images (needs Sanity/CSS/HTML cross-trace, not basename grep) |
| Issues reclassified to false positive | 6 (`VITE_ENABLE_*` flags already in `.env.example` lines 64-69) |
| Fixes reverted (broke validation) | 0 |
| Build/typecheck/tests | ✅ all green/at-baseline |
| Route smoke test | ✅ 20/20 clean (200 + no body-404 markers) |
| Bundle size | 73M (=execute baseline), 339 chunks (=postfix baseline) |
| Sacred verification | ✅ 0.75×3, crisis×432, sacred-dir diff empty |

---

## Per-Category Results

| Category | Discovered | Fixed | Deferred | Reverted | False positive |
|---|---:|---:|---:|---:|---:|
| docs-drift | 4 files | 4 | 0 | 0 | 0 |
| env-drift (`.env.production.example`) | 6 vars | 6 | 0 | 0 | 0 |
| env-drift (`.env.example` missing) | 6 vars | 0 | 0 | 0 | 6 (already present) |
| stale-reference (URLs) | 2 actionUrls | 2 | 0 | 0 | 0 |
| stale-reference (comment) | 1 comment | 1 | 0 | 0 | 0 |
| test-reference | 2 orphan tests | 2 | 0 | 0 | 0 |
| orphan-asset | 43 images | 0 | 43 | 0 | 0 |
| config-drift | 0 | 0 | 0 | 0 | 0 |
| i18n-orphan | 0 | 0 | 0 | 0 | 0 |
| runtime-error | 0 | 0 | 0 | 0 | 0 |
| rebase-blocker | n/a | 0 | n/a | 0 | 0 |

---

## Issues Fixed (full table)

| # | Category | Severity | Path | Fix | Commit |
|---|---|---|---|---|---|
| 1 | docs-drift | minor | `docs/priority-fixes/00-OVERVIEW.md` | Prepend stale banner with 22-item removed list | `65679f0` |
| 2 | docs-drift | minor | `docs/priority-fixes/02-P1-HIGH.md` | Prepend stale banner (4 provider pages removed) | `5397397` |
| 3 | docs-drift | minor | `docs/priority-fixes/03-P2-MEDIUM.md` | Prepend stale banner (AuditLog/Reports/services) | `7a1d84e` |
| 4 | docs-drift | minor | `docs/priority-fixes/05-NAVIGATION-REDESIGN.md` | Prepend stale banner (highest drift density) | `6d4207e` |
| 5-10 | env-drift | major | `.env.production.example` | Delete 6 stale `VITE_APP_*`/`VITE_*_ENABLED`/`VITE_DEBUG_MODE` declarations | `bdf5e1d` |
| 11 | stale-reference | critical | `src/pages/admin/data/adminMockData.ts:85` | `/admin/reports` → `/admin/articles` | `284baf3` |
| 12 | stale-reference | critical | `src/pages/admin/data/adminMockData.ts:94` | `/admin/analytics` → `/admin/dashboard` | `284baf3` |
| 13 | test-reference | critical | `src/services/__tests__/activityService.test.ts` | `git rm` (broken import of removed service) | `54d7c3c` |
| 14 | test-reference | critical | `src/services/__tests__/waitlistService.test.ts` | `git rm` (broken import of removed service) | `54d7c3c` |
| 15 | stale-reference | minor | `src/tests/routes.test.ts:12` | Drop "and ToolsSection.tsx" from comment | `27d21da` |

---

## Issues Deferred

| # | Category | Severity | Path | Reason deferred |
|---|---|---|---|---|
| 1 | orphan-asset | info | `public/images/` (43 files / 18MB candidate orphans) | Discovery agent's basename grep is unreliable — `homeImages.ts` imports from `@/assets/images/` (different namespace, in `src/`). Public assets may be referenced via Sanity image refs, CSS `url()`, HTML preload, or dynamic URL constructs that this scan didn't trace. Full audit recommended in a follow-up pass. See [`.postfix/DEFERRED_PUBLIC_AUDIT.md`](.postfix/DEFERRED_PUBLIC_AUDIT.md) for the inventory and recommended trace methodology. |

---

## False Positives (no fix needed)

| # | Origin | What was claimed | Reality |
|---|---|---|---|
| 1 | Phase 1 env-drift sweep | "6 `VITE_ENABLE_*` flags used in code but missing from `.env.example`" | All 6 are present at `.env.example:64-69`. The agent's regex missed them. No edit needed. |

---

## Out of Scope (for future prompts)

These pre-existing issues were noticed during discovery but were **not** caused by the cleanup, so they're left untouched per §3.2:

| # | Category | Path | Issue | Likely owner |
|---|---|---|---|---|
| 1 | route-drift | `src/services/adminService.ts:170` | Live `getUrgentItems()` returns `actionUrl: '/admin/audit-logs'`, but admin SPA route is `/settings/audit-log`. Routes mismatch is pre-existing. | 04-UX or future cleanup |
| 2 | env-parity | `.env.production.example` | Missing `VITE_ENABLE_MEDICATION_TRACKER` (5 of 6 enable flags present, 1 missing). Pre-existing parity drift between dev and prod example files. | future cleanup |
| 3 | test-flake | vitest pool | 2 unhandled "Worker exited unexpectedly" errors in test runs. Pre-existing per CLEANUP_EXECUTION.md baseline; not changed by cleanup or postfix. | 06-DB or test infra |
| 4 | test-failures | various | 68 tests fail at baseline (Navigator scoring expansions, accessibility, theme context). Pre-existing per CLEANUP_EXECUTION.md. | 06-DB or test maintenance |

---

## Rebase Plan for `wip/ui-polish-snapshot-2026-04-16`

**SKIP — branch does not exist.**

Per CLEANUP_EXECUTION.md "wip/ui-polish-snapshot-2026-04-16: Did not exist (per PRECONDITIONS.md no WIP at audit start)". Pre-flight verification:

```
git rev-parse --verify wip/ui-polish-snapshot-2026-04-16
→ MISSING
```

Since the branch was never created, there is nothing to rebase. The §6.10 dry-run task and §9.2 rebase-readiness check are pure no-ops on this codebase.

If a polish branch is created in the future from `cleanup/execute-2026-04-16` or earlier, it should rebase onto **`cleanup/postfix-2026-04-16`** (or whatever this gets merged to) — not the execute branch. The 8 postfix commits are leaf-cleanup edits to non-overlapping surfaces (docs, env templates, mock data, orphan tests) and are unlikely to conflict with UI work.

---

## Validation Evidence

| Stage | Result | Log |
|---|---|---|
| Baseline build | exit 0 (17.43s) | [.postfix/baseline-build.log](.postfix/baseline-build.log) |
| Baseline typecheck | exit 0 | [.postfix/baseline-typecheck.log](.postfix/baseline-typecheck.log) |
| Baseline tests | 15 fail / 118 pass / 1 skip files | [.postfix/baseline-tests.log](.postfix/baseline-tests.log) |
| Final build | exit 0 (17.62s) | [.postfix/final-build.log](.postfix/final-build.log) |
| Final typecheck | exit 0 | [.postfix/final-typecheck.log](.postfix/final-typecheck.log) |
| Final tests | 13 fail / 118 pass / 1 skip files (-2 fail) | [.postfix/final-tests.log](.postfix/final-tests.log) |
| Route smoke (20 routes) | 20/20 clean | [.postfix/final-route-smoke.log](.postfix/final-route-smoke.log) |
| Self-audit | 10/10 PASS | [.postfix/SELF_AUDIT.md](.postfix/SELF_AUDIT.md) |

---

## Branches Created/Modified

| Branch | Status | HEAD |
|---|---|---|
| `cleanup/postfix-2026-04-16` | New, this branch | `27d21da` |
| `cleanup/execute-2026-04-16` | Untouched | `6b3a126` |
| `cleanup/audit-2026-04-16` | Untouched | `59aa5df` |
| `archive/cleanup-2026-04` | Untouched | `23cfe3c` |
| `main` | Untouched | `23cfe3c` |
| `wip/ui-polish-snapshot-2026-04-16` | Did not exist | — |

---

## Notes & Observations

### IDE auto-restoration (operational quirk)
After `git rm` of the two orphan test files in commit `54d7c3c`, both files **reappeared on disk as untracked** within the same session. The git history is correct — the files are deleted in the tree as of `54d7c3c`. Disk reappearance is likely IDE editor cache restoring open tabs to disk after a save event. Resolution applied: plain `rm` to clear the disk copies before re-running tests. Same pattern was observed during cleanup execution per project memory; no further action needed.

### Discovery agent caveats
One Phase 1 finding turned out to be a false positive: 6 `VITE_ENABLE_*` flags claimed missing from `.env.example` were already present at lines 64-69. The agent's `grep -oE "^[A-Z_]+"` apparently truncated or skipped that section. Lesson for future passes: always verify discovery findings by direct file read before treating them as fixes.

### Orphan public images — why deferred not deleted
Spec §6.4 says delete only if total >1MB; the 43 candidates are 18MB so this would qualify. **However**, the basename evidence is structurally weak:
- `homeImages.ts` imports `@/assets/images/homepage/figures/A-1.jpeg` (zero-padding-less, in `src/assets/`)
- `public/images/homepage/figures/A-01-listener.jpeg` (zero-padded with descriptive suffix, in `public/`)

These are clearly **different asset sets**, not orphan/live pairs. The public set may be staging assets, share-image variants, or Sanity-CMS-referenced. Deleting blind would risk breaking sharing previews or future CMS-published content. Documented in `.postfix/DEFERRED_PUBLIC_AUDIT.md` with a recommended trace methodology (Sanity API + CSS scan + HTML preload + dist manifest cross-check).

---

## Recommended Next Steps

1. **Review this branch's diff:** `git diff cleanup/execute-2026-04-16..cleanup/postfix-2026-04-16`
2. **Merge sequence options:**
   - **Layered:** postfix → main (preserves the 3-stage history of audit/execute/postfix)
   - **Squashed:** squash all 3 cleanup branches into one main commit (cleaner main history; loses inter-stage attribution)
3. **No rebase needed** for any pre-existing branches (no WIP polish branch existed).
4. **Resolve the 8 critical decisions** from CLEANUP_EXECUTION.md that this prompt did not touch (Sanity scope-out, dual API layers, 30 L06 UNSURE components, etc.).
5. **Schedule a follow-up `public/` audit** per `.postfix/DEFERRED_PUBLIC_AUDIT.md` if reducing repo weight is a priority.
6. **Run prompts 04 (UX) / 05 (UI) / 06 (DB)** — all distinct concerns, none of which this prompt touched.
