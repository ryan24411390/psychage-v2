# Psychage V2 Cleanup Execution Report — 2026-04-16

**Branch:** `cleanup/execute-2026-04-16` (off `main`)
**Archive branch:** `archive/cleanup-2026-04` (pushed to remote, tagged `pre-cleanup-2026-04-16`)
**Audit source:** `cleanup/audit-2026-04-16` @ `59aa5df` (approval marker verified)
**Final HEAD:** see `git log main..HEAD --oneline` (60 commits)
**Build:** ✅ green (exit 0, 17.43s, 5009 modules)
**Typecheck:** ✅ green
**Tests:** ✅ baseline-stable (74 → 68 failures; pre-existing flake unchanged)
**Source modifications:** intentional — see per-layer sections below
**Sacred regressions:** 0

---

## Executive Summary

| Metric | Value |
|---|---:|
| Items processed from audit | 113 (of 149 ARCHIVE+DELETE in audit) |
| Successfully removed | 53 (12 ARCHIVE + 39 DELETE + 2 .sql.skip) + 5 untracked rm + 5 SQL annotations |
| Reverted (broke build/typecheck) | 35 (all L06 — audit madge evidence wrong) |
| Escalated to UNSURE mid-execution | 36 (1 L01 + 35 L06) |
| Skipped (UNSURE deferred from audit) | 33 |
| Deferred to follow-up | 30 L06 audit-UNSURE + 19 L05 admin internals + Sanity scope decision |
| Build state | ✅ green |
| Bundle size | 73M → 73M (Δ 0M, –8 chunks) |
| node_modules removed | ~68M (Three.js, AI SDK trio, Sanity types) |
| Dep count (`dependencies`) | 73 → 62 (–11) |
| Lines deleted | 10,908 |
| Lines added | 260 |
| Files removed | 44 |

## How to Recover an Item

| Item type | Recovery command |
|---|---|
| Any removed file | `git checkout archive/cleanup-2026-04 -- <path>` |
| A specific commit's reverse | `git revert <sha>` |
| Specific dep | `pnpm add <dep>` (its prior version is in `archive/cleanup-2026-04`'s `pnpm-lock.yaml`) |
| Pre-cleanup state | `git checkout pre-cleanup-2026-04-16` (tag) |

---

## Per-Layer Results

### L02 — Environment variables (1 commit)

| Item | Action | Result | Notes |
|---|---|---|---|
| `VITE_APP_NAME`, `VITE_APP_VERSION`, `VITE_DEBUG_MODE` | Removed from `.env.example` + `vite-env.d.ts` | ✅ | No runtime readers anywhere |
| `VITE_CRISIS_DETECTION_ENABLED` | Removed | ✅ | Crisis detection is always-on (sacred); flag was misleading |
| `VITE_MOOD_TRACKING_ENABLED` | Removed | ✅ | Duplicate of `VITE_ENABLE_MOOD_JOURNAL` |
| `VITE_SAFETY_PLAN_ENABLED` | Removed | ✅ | Unused |
| `VITE_NAVIGATOR_ANALYTICS`, `VITE_NAVIGATOR_PREFETCH`, `VITE_PLAUSIBLE_DOMAIN` | Added to `.env.example` | ✅ | Used in code but undeclared |
| `VITE_ENABLE_MEDICATION_TRACKER` | Added to `vite-env.d.ts` | ✅ | Used but type-undeclared |

**Total: 6 dead env vars removed; 3 added; 1 type field added.**

### L01 — npm dependencies (12 commits, 11 deps removed)

| Dep | Action | Notes |
|---|---|---|
| `@anthropic-ai/sdk` | uninstall | 0 importers; LLM uses native `fetch` |
| `@google/genai` | uninstall | 0 importers; Gemini never wired |
| `three`, `@react-three/drei`, `@react-three/fiber`, `maath` | uninstall (4) | Three.js ecosystem unused; CLAUDE.md "3D hero" not present in code |
| `lodash` | uninstall | 0 importers |
| `rehype-highlight` | uninstall | 0 importers; MarkdownRenderer uses `remark-gfm` only |
| `@radix-ui/react-collapsible`, `@radix-ui/react-scroll-area` | uninstall (2) | 0 importers in `src/` |
| `@portabletext/react` | uninstall | 0 importers |
| `@portabletext/types` | uninstall (deferred from L01 to L08) | Sole importer was `sanityArticleService.ts`, removed in L08 first |

**Escalated mid-execution (1):** `openai` — KEEP because `scripts/test-vector-search.ts` (L11 KEEP) imports it. Also imported by `scripts/ingest-sanity.ts` (Sanity-dormant). Decision needed: is `test-vector-search.ts` still used?

**Audit-UNSURE deferred (3):** `@sanity/client`, `@sanity/image-url`, `@portabletext/toolkit` — all gated by `isSanityConfigured()` in KEEP `adminService.ts`. Awaits Sanity scope-out decision.

### L11 — Build scripts + Finder duplicates (11 commits, 11 tracked + 5 untracked)

| Item | Action |
|---|---|
| `vitest.config 2.ts`, `src/tests/setup 2.ts` | Removed (Finder duplicates) |
| `src/data/articles/PROGRESS.md.{bak,bak2,bak3}` | Removed (3 stale backups) |
| `scripts/ingest-from-cms.ts`, `extract-from-claude-chats.ts`, `validate-language.ts`, `convert-html-to-jsx.ts` | Removed (deprecated) |
| `scripts/upload-covers-{direct-mapping,categories-2-5,categories-10-16}.ts` | Removed (3 historical backfills) |
| `scripts/upload-cover-images-to-storage.ts`, `upload-session-031-content-direct.ts` | Removed (gitignored, on disk only) |
| `.rewrite/find-session 2.js`, `.moat/moat-tasks 2.md` | Removed (gitignored Finder duplicates) |

**Total: 16 items.** All gitignored ones removed via `rm` since git can't track them.

### L03 — vite.config.ts (1 commit)

`vendor-three` manualChunk dropped — matched nothing after L01 removed Three.js. Stale comment also cleaned up.

`vendor-sanity` manualChunk **retained** — tied to L01 UNSURE (Sanity scope decision). Will revisit.

### L10 — lib/utils (1 commit)

`src/lib/highlightText 2.ts` removed (Finder duplicate; 0 importers).

`src/lib/sanityClient.ts` retained (audit UNSURE; gated by `isSanityConfigured()`).

### L09 — hooks (2 commits)

| Item | Action | Notes |
|---|---|---|
| `src/hooks/useAsyncData.ts` + its test | Removed | 0 importers; ts-prune-dead |
| `src/hooks/useTopicHubData.ts` | Removed | 0 importers; orphan loader |

### L08 — services (4 commits, +1 dep cleanup)

| Item | Action | Notes |
|---|---|---|
| `src/services/sanityArticleService.ts` | Removed | 0 importers; cascade bypasses |
| `src/services/activityService.ts` | Removed | 0 importers; user_activity table never queried |
| `src/services/categoryIconMapper.tsx` | Removed | 0 importers; marked `@deprecated`; replaced by `getCategoryTheme()` |
| `src/services/waitlistService.ts` | Removed | 0 importers |
| `@portabletext/types` (dep) | Uninstalled | Now safe (sole importer gone) |

### L07 — UI primitives (no commits)

No-op. All 25 primitives are KEEP per audit.

### L06 — Feature components (6 commits, 35 reverts)

**HALTED at §12 threshold (>5 reverts in single layer)**, then resumed under user direction with same tsc guard. Final outcome:

**Successfully removed (6):**

- ARCHIVE: `CategoryCard.tsx`, `TierGuard.tsx`, `AnalyticsChart.tsx`, `ToolsSection.tsx`
- DELETE: `ReviewCard.tsx`, `ProviderQuickMatch.tsx`

**Reverted (35) — see [.exec/REVERTED.md](.exec/REVERTED.md):**

Audit's madge analysis missed importers for 13 ARCHIVE items (admin/article/dashboard components imported by their parent pages) and 22 DELETE items (the entire provider profile/search/shared cluster powers the live `pages/providers/*`). The tsc guard auto-reverted each one before commit landed. **The provider directory is sacred and active, not deprecated.**

**Audit-UNSURE deferred (30):** All audit-flagged UNSURE items in L06.

### L05 — Pages (15 commits)

| Group | Action |
|---|---|
| **Legacy admin v1 orphans (10):** `AdminAnalyticsPage`, `AdminContentPage`, `AdminSettingsPage`, `AuditLogPage`, `UserManagementPage`, `ProviderManagement`, `ReportsPage`, `ReportDetailPage`, `ProviderDetailAdmin`, `AdminUserDetailPage` | Removed |
| **components/pages orphans (2):** `SymptomCheckerPage`, `ProviderOnboarding` | Removed |
| **Provider dashboard v1 (3):** `ProviderDashboard`, `ProviderProfileEditor`, `ProviderPatients` | Removed (with App.tsx coupled commit dropping 4 dead lazy consts + comment) |
| **`ProviderAnalytics`** | Removed (the audit's claimed importers were function-name false matches) |
| **`ProviderSidebar`** | Removed (orphan after the 3 provider pages removed) |

**Successfully removed (17 page files + 1 App.tsx edit).**

**Escalated (11+):** Pages with chain-protected importers — `ProfileSettings`, `UserAssessmentHistory`, `UserSidebar`, `AdminDashboard`, `AdminSidebar`, `ContactPage` (components/pages variant), `ArticleDetail` (components/pages variant), `ProviderProfile` (components/pages variant), `ProviderDirectory`, plus 19 admin internal/onboarding sub-components flagged at directory level.

### L04 — Routes (no commits)

No-op. Audit found all 105 routes KEEP. The 4 dead lazy consts in `App.tsx` (provider dashboard v1) were already removed in L05's coupled commit `c875bd8`.

### L12 — SQL migrations (6 commits)

| Group | Action |
|---|---|
| `20250109000003_full_schema.sql.skip` | Deleted (never ran) |
| `20260326220201_update_category01_articles_session001.sql.skip` | Deleted (never ran) |
| `20260316000003_fix_article_admin_rls.sql` | Annotated as ARCHIVE-NOTE-ONLY |
| `20260316000005_simplify_article_rls.sql` | Annotated |
| `20260316000006_jwt_only_article_rls.sql` | Annotated |
| `20260316000007_auth_user_article_rls.sql` | Annotated |
| `20260316000008_disable_article_rls.sql` | Annotated |

The 5 annotated migrations remain in place (had run on production, can't delete) — each gets a header explaining they're superseded by `20260316000009_disable_remaining_article_rls.sql`.

**Audit-UNSURE deferred (2):** `20260411000004_stripe_tables.sql`, `20260411000006_alter_verifications.sql`.

---

## Reverted Items (audit said remove, build said no)

35 items, all from L06. See [.exec/REVERTED.md](.exec/REVERTED.md) for the full list with importer paths. Common pattern: madge missed admin v2 page imports of admin components, dashboard imports of dashboard widgets, and provider page imports of the entire provider component cluster.

---

## Escalated to UNSURE Mid-Execution

Beyond the 33 audit-UNSURE items already deferred, execution-time discovery added 36 more items needing decision in a follow-up audit. Full details in [.exec/ESCALATED_TO_UNSURE.md](.exec/ESCALATED_TO_UNSURE.md).

| Item | Layer | Reason |
|---|---|---|
| `openai` (npm dep) | L01 | KEEP importer in `scripts/test-vector-search.ts` |
| 13 L06 ARCHIVE candidates | L06 | madge evidence wrong; tsc found admin/dashboard/article importers |
| 22 L06 DELETE candidates | L06 | Provider directory is sacred and live, not deprecated |

---

## UNSURE Items Deferred (from audit)

**33 audit-UNSURE items + 36 execute-time escalations = 69 items requiring decision before next pass.**

The biggest decisions you need to make:

1. **Sanity scope-out** (yes/no) — gates 3 npm deps, 3 env vars, 1 vite manualChunk, 1 lib file, and Sanity blocks in `adminService.ts`.
2. **Dual API layers** (`api/` Vercel serverless vs `src/app/api/` Next.js-style) — pick one canonical pattern.
3. **30 L06 UNSURE components** need fresh tsc-driven importer trace (madge unreliable for this codebase).
4. **`scripts/test-vector-search.ts`** — still in use? If no, drop it + drop `openai`.
5. **3 L05 dashboard pages** with chain-protected ARCHIVE classification (`ProfileSettings`, `UserAssessmentHistory`, `UserSidebar`) — verify whether the chain truly reaches `App.tsx` or is just internal cycle.
6. **`AdminDashboard` v1 vs v2** — v1 is imported by both `AdminApp.tsx` AND v2/Dashboard.tsx. Did v2 finish replacing v1?
7. **`scripts/ingest-sanity.ts`** — couples to Sanity decision.
8. **2 SQL migrations** (Stripe tables + verifications alter) — trace usage.

---

## Bundle Impact

| Measure | Baseline | Final | Delta |
|---|---|---|---|
| `du -sh dist/` | 73M | 73M | 0 |
| Asset chunks | 350 | 342 | –8 |
| `dependencies` count | 73 | 62 | –11 |
| node_modules size (estimated) | — | — | ~–68M |

Dead deps don't ship; their removal is install-time + build-time cleanup. The –8 chunks come from `vendor-three` chunk removal + 3 dead provider lazy chunks + minor consolidation. Notable chunk changes: `vendor-three` (gone), `ProviderDashboard-*.js` (gone), `ProviderProfileEditor-*.js` (gone), `ProviderAnalytics-*.js` (gone), `ProviderPatients-*.js` (gone).

Logs:
- Baseline: [.exec/baseline/build.log](.exec/baseline/build.log), [.exec/baseline/assets.txt](.exec/baseline/assets.txt)
- Final: [.exec/final/build.log](.exec/final/build.log), [.exec/final/assets.txt](.exec/final/assets.txt), [.exec/final/assets-diff.txt](.exec/final/assets-diff.txt)

---

## Validation Logs

| Stage | Result | Log |
|---|---|---|
| Typecheck | exit 0 | [.exec/final/typecheck.log](.exec/final/typecheck.log) |
| Build | exit 0, 17.43s | [.exec/final/build.log](.exec/final/build.log) |
| Tests | 68 fail / 1373 pass (vs baseline 74/1400) | [.exec/final/tests.log](.exec/final/tests.log) |

---

## Branches Created/Modified

| Branch | Status | Notes |
|---|---|---|
| `archive/cleanup-2026-04` | New, pushed to `origin` | Pre-cleanup snapshot from `main` @ `23cfe3c` |
| `cleanup/execute-2026-04-16` | New, this branch | 60 cleanup commits ready for review |
| `cleanup/audit-2026-04-16` | 1 new commit (`59aa5df`) | Audit deliverable + approval marker |
| `pre-cleanup-2026-04-16` | New tag, pushed | Points to `main` @ `23cfe3c` |
| `main` | Untouched | |
| `wip/ui-polish-snapshot-2026-04-16` | Did not exist | Per PRECONDITIONS.md (no WIP at audit start) |

---

## Recommended Next Steps

1. **Review this branch's diff:** `git diff main..cleanup/execute-2026-04-16`
2. **Spot-check the L06 reverts** — confirm none of the 35 escalated items should be removed (they're all imported by live pages, but worth a sanity check on a couple of them, e.g., `ArticleHtmlRenderer`).
3. **Resolve the 8 critical decisions above**, especially Sanity scope-out (largest deferred reduction) and the provider component cluster (now confirmed sacred).
4. **Merge to main:** `git checkout main && git merge --no-ff cleanup/execute-2026-04-16`
5. **No WIP branch to rebase** (didn't exist).
6. **Run prompt 03 (post-refactor fix)** to catch any subtle issues this destructive pass introduced that build/test/typecheck didn't catch.
7. **Consider a re-audit of L06 with tsc-driven importer trace** instead of madge — the false-positive rate (35 escalations of 41 attempted) makes the original L06 audit unreliable for those subdirectories.

---

## Self-Audit

All 10 checks PASS. Full results in [.exec/SELF_AUDIT.md](.exec/SELF_AUDIT.md).
