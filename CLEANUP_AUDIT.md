# Psychage V2 Cleanup Audit — 2026-04-16

<!-- APPROVED FOR EXECUTION: 2026-04-16 by Ryan -->

**Branch:** `cleanup/audit-2026-04-16`
**Auditor:** Claude (Opus 4.6, read-only discovery pass)
**Baseline build:** ✅ PASS (pnpm run build, exit 0, 5009 modules, 73MB dist, 19.37s)
**Post-audit build:** ✅ PASS (identical to baseline)
**Source modifications:** ✅ NONE (`git diff main..HEAD -- 'src/**'` is empty)

---

## Executive Summary

| Metric | Value |
|---|---:|
| Layers classified | 12 of 12 |
| Total items with individual classifications | 588 |
| KEEP | 439 (75%) |
| ARCHIVE | 47 (8%) |
| DELETE | 69 (12%) |
| UNSURE | 33 (6%) |
| Build state vs baseline | identical (exit 0) |
| Sacred items verified | all Section 4 items confirmed KEEP; 3rd confidence-cap site found |
| Node_modules bundle reduction (est.) | **~75MB unpacked** on DELETE path (largest wins: `three` 37M, `openai` 13M, `@google/genai` 11M, `@sanity/client` 5M, `@anthropic-ai/sdk` 4.9M, `lodash` 4.9M) |
| Dep tree reduction | 14 deps DELETE (12.5% of 112) + 3 UNSURE-probably-DELETE |
| Gzipped bundle impact (estimated) | Three.js ecosystem alone ~180KB gzip; AI SDK trio + Sanity cluster adds ~30-50KB |

Notes: "Items" counts exclude batch-classified article content (~355 TSX files in `src/data/articles/` are KEEP as a class, not enumerated), `src/components/article/blocks/` sacred files, and most SQL migrations (L12 uses group-level classification). See Appendix.

---

## Top 10 Highest-Impact Recommendations

Ranked by (bundle savings × confidence).

| # | Target | Classification | Evidence | Impact |
|---:|---|---|---|---|
| 1 | `three` + `@react-three/drei` + `@react-three/fiber` + `maath` | DELETE (all 4 deps, + `vendor-three` chunk) | Zero imports of any Three.js package. No `Hero3D`-type component. CLAUDE.md claim of 3D hero is stale. | ~40MB node_modules, ~180KB gzipped bundle savings |
| 2 | `@google/genai` + `@anthropic-ai/sdk` + `openai` (SDK deps) | DELETE (3 deps) | `src/lib/ai/llm.ts` uses native `fetch` against `api.anthropic.com` and `api.openai.com`. SDKs never imported. Zero Gemini refs anywhere. | ~29MB node_modules, cleaner AI contract |
| 3 | Provider UI suite orphan components (23 files) | DELETE | L06 orphan cluster — legacy provider directory UI (search, profile, onboarding) all have 0 importers. Superseded by current `/providers/*` and `/portal/*` pages. | Cleans out 23-component dead zone |
| 4 | `sanityArticleService.ts` + Sanity dep cluster (`@portabletext/react`, `@portabletext/types`) | DELETE | Zero importers; content cascade already skips it (Supabase → TSX). Partner deps drop with it. | Clarifies "Sanity is dormant" story |
| 5 | Legacy Admin v1 pages (11 files in L05 ARCHIVE) | ARCHIVE | All 11 replaced by admin v2 equivalents. Not referenced from AdminApp.tsx. | Removes 11 dead page files |
| 6 | `lodash` (0 importers) + `rehype-highlight` (0 importers) | DELETE (2 deps) | Verified zero usage across src/api/scripts/configs. | ~5MB node_modules |
| 7 | 6 dead feature-flag env vars (`VITE_APP_NAME`, `VITE_APP_VERSION`, `VITE_DEBUG_MODE`, `VITE_CRISIS_DETECTION_ENABLED`, `VITE_MOOD_TRACKING_ENABLED`, `VITE_SAFETY_PLAN_ENABLED`) | DELETE | No runtime readers. First three are type-only in `vite-env.d.ts`; last three have zero refs. `VITE_CRISIS_DETECTION_ENABLED` is misleading — crisis detection is always-on and correctly cannot be disabled. | Reduces env surface, aligns docs to reality |
| 8 | Finder duplicates + backups (7 files): `src/lib/highlightText 2.ts`, `src/tests/setup 2.ts`, `vitest.config 2.ts`, `.rewrite/find-session 2.js`, `.moat/moat-tasks 2.md`, `src/data/articles/PROGRESS.md.bak`, + `clarity-score/*.2.*` in subproject | DELETE | macOS Finder artifacts with space in filename (`* 2.ext`). No imports. | Removes 7 dead files |
| 9 | L05 duplicate page files (5) + 3 orphan pages | ARCHIVE / DELETE per L05 | Parallel `HomePageV2` + `HomePage` etc. — consolidate on the live version | Removes 8 obsolete page files |
| 10 | `@radix-ui/react-collapsible` + `@radix-ui/react-scroll-area` (2 unused primitive deps) | DELETE | Zero importers. | ~280KB node_modules |

---

## Critical Open Questions for Ryan

These decisions must be made **before** the execute prompt runs.

1. **Sanity scope-out — all or nothing?**
   - 3 UNSURE deps (`@sanity/client`, `@sanity/image-url`, `@portabletext/toolkit`) depend on a single decision: rip out Sanity entirely or keep the gated fallback path. The dep is imported by `adminService.ts` (KEEP) but only inside `if (!isSanityConfigured())` branches. If you approve full removal, these 3 deps + `src/lib/sanityClient.ts` + `VITE_SANITY_*` (3 env vars) + `vendor-sanity` manual chunk + `api/ai/embed.ts` Sanity plaintext conversion + `scripts/ingest-sanity.ts` all go DELETE together. Recommended: **approve full removal** — aligns with the "Supabase is sole source of truth" memory.

2. **`@vercel/node` serverless functions in `api/` — are they live or dormant?**
   - 6 files under `api/` import `@vercel/node`. If Vercel serverless routes are still active in production (e.g., `/api/ai/chat`, `/api/ai/embed`, `/api/geo-detect`), KEEP. If the frontend now hits a separate deployed backend via `VITE_API_URL` and these `api/*.ts` files are legacy, flag for ARCHIVE. **Verify by checking Vercel deployment config + real traffic.**

3. **`src/app/api/*` Next-style routes vs `api/` Vercel serverless** — dual API layers**
   - There are TWO API architectures: `src/app/api/` (Next.js-style route handlers — per prompt context, "reference impl for separate service") AND `api/*.ts` (Vercel serverless functions). If they're both live, that's redundant. If one is dead, classify accordingly. **Need deployment truth.**

4. **Confidence cap 3rd site — confirmed at `src/lib/navigator/utils.ts:26`**
   - Pre-flight thought only 2 existed. Final audit confirmed 3 per prompt's sacred requirement. No action needed — just noting that the prompt's claim was correct.

5. **Stripe tables migration (`20260411000004_stripe_tables.sql`)** — planned or shipped?
   - Migration exists but no Stripe client code in `src/`. If Stripe is future-work, the migration represents unused schema. Keep (migrations are append-only) but flag for feature-completion review.

6. **L06 UNSURE items (18 components, 30 total incl. other layers)** — verify before removing
   - Explore agent flagged 30 components as UNSURE due to madge limitations (dynamic imports, barrel re-exports, aliased paths). A focused second pass in the execute phase should manually verify each. Do not DELETE these on the first cleanup pass.

7. **`lib/ai/llm.ts` raw-fetch pattern vs SDKs** — is the raw-fetch intentional?
   - Current code hits Anthropic/OpenAI REST APIs via native `fetch`. The SDKs are installed but unused. If the intent was to eventually adopt the SDKs, keep them. If the intent is to stay SDK-less (simpler, no runtime deps), DELETE.

8. **Article rewrite system is sacred — but does it still have open sessions?**
   - `article-rewrite-manifest.json` says 260 sessions exist. `.rewrite/locks/` contains in-progress state. Before any execute-phase cleanup, confirm no active `/rewrite` agents are running.

---

## Risk Register — MED/HIGH Risk ARCHIVE / DELETE Items

| path | classification | risk | reason | mitigation |
|---|---|---|---|---|
| `@sanity/client` | UNSURE (MED) | Imported by KEEP `adminService.ts` | gated by `isSanityConfigured()` — code path is dead when env vars absent but still compiles | If execute plan removes: also strip `isSanityConfigured()` blocks from `adminService.ts` |
| `@sanity/image-url` | UNSURE (MED) | Imported by `sanityClient.ts` → `adminService.ts` | Same chain | Goes with above decision |
| `@portabletext/toolkit` | UNSURE (MED) | Used in `api/ai/embed.ts` + `scripts/ingest-sanity.ts` | If Sanity is fully dormant, these flows are dead | Verify `api/ai/embed.ts` is deployed before classifying |
| 11 Legacy Admin V1 pages (per L05) | ARCHIVE | MED | Replaced by v2 — verify no redirects/deeplinks expect v1 paths | Check redirects in `AdminApp.tsx` |
| 5 Provider dashboard V1 pages (per L05) | ARCHIVE | MED | Replaced by Portal v2 | Same |
| 23 Provider UI components (per L06) | DELETE | LOW-MED | Full deprecated set — all 0 importers | Double-check with grep for `provider` page imports |
| `activityService.ts`, `waitlistService.ts`, `categoryIconMapper.tsx` | DELETE | LOW | 0 importers, 0 dead-export consumers | — |
| Article RLS migration iterations (5 files, L12) | ARCHIVE-NOTE-ONLY | LOW | Cannot delete (shipped). Add `-- SUPERSEDED BY <latest>` comment headers | Not a deletion — annotation only |
| `src/hooks/useAsyncData.ts`, `useTopicHubData.ts` | DELETE | LOW | 0 importers | — |

---

## Layer Reports

Each layer report is a standalone file. This section summarizes counts; see individual files for full tables.

### L01 — npm-deps (`./.audit/layer-01-npm-deps.md`)

112 deps total. **DELETE 14**, **UNSURE 3**, **KEEP 95**. Biggest hits: Three.js ecosystem, AI SDK trio, Sanity dead deps, 2 unused Radix primitives, `lodash`, `rehype-highlight`. Missing: `dotenv` (used but not declared — add).

### L02 — env-vars (`./.audit/layer-02-env-vars.md`)

30 declared env vars. **DELETE 6** (no runtime readers), **UNSURE 3** (Sanity trio, gated on L01 decision), **KEEP 21**. All 6 Navigator tier flags verified active via string-key lookup in `featureFlags.ts`. 3 env vars are used but not declared in `.env.example` — add them (`VITE_NAVIGATOR_ANALYTICS`, `VITE_NAVIGATOR_PREFETCH`, `VITE_PLAUSIBLE_DOMAIN`).

### L03 — vite-config (`./.audit/layer-03-vite-config.md`)

`vite.config.ts` is lean. **DELETE 2**: `vendor-three` manualChunk (with L01 Three.js), `vendor-sanity` manualChunk (with L01 Sanity UNSURE). All other entries KEEP.

### L04 — routes (`./.audit/layer-04-routes.md`)

113 route declarations across `App.tsx` (74) and `AdminApp.tsx` (31). **100% KEEP** — all reachable, no orphans. 7 legacy-URL redirects preserved correctly with `replace=true`. 5 feature-flagged routes documented.

### L05 — pages (`./.audit/layer-05-pages.md`)

~133 page files. **KEEP 60**, **ARCHIVE 43** (11 legacy admin v1, 5 legacy provider dashboard v1, 5 duplicate components, 3 orphan pages), **DELETE 0**, **UNSURE 1**. Strong cleanup opportunity from v1→v2 migrations.

### L06 — feature-components (`./.audit/layer-06-feature-components.md`)

~350 feature components. Orphans flagged: 63. **DELETE 24** (provider UI suite + 1 misc), **ARCHIVE 18** (old UI, superseded features), **UNSURE 30** (madge limitations — verify before removing), **KEEP 11 explicit + rest by sacred/parent-directory rule**. 12 sacred components verified preserved.

### L07 — ui-primitives (`./.audit/layer-07-ui-primitives.md`)

25 primitives + 10 test files. **All KEEP**. Zero cleanup opportunities at this layer — every primitive has at least one live importer (some via relative imports rather than `@/components/ui/` path).

### L08 — services (`./.audit/layer-08-services.md`)

33 services. **DELETE 4**: `sanityArticleService.ts`, `activityService.ts`, `categoryIconMapper.tsx`, `waitlistService.ts`. **KEEP 29**. Cleanup opportunities within KEEP: 8 dead method exports in `articleAdminService.ts`; Sanity code blocks in `adminService.ts` ripout (pending L01 decision).

### L09 — hooks (`./.audit/layer-09-hooks.md`)

23 hooks. **DELETE 2**: `useAsyncData.ts`, `useTopicHubData.ts`. **KEEP 21**. Biggest hooks: `useReducedMotion` (33 importers), `useAdminNavigate` (22 importers).

### L10 — lib-utils (`./.audit/layer-10-lib-utils.md`)

47 utility/type files (excluding sacred `lib/navigator/`, `lib/article-framework/`, `lib/providers/`, `lib/ai/`, `lib/crisis*`). **DELETE 1**: `src/lib/highlightText 2.ts` (Finder duplicate). **UNSURE 1**: `src/lib/sanityClient.ts` (gated by L01). **KEEP 44 + 1**.

### L11 — build-and-scripts (`./.audit/layer-11-build-and-scripts.md`)

70+ items. **DELETE 15** (duplicates, deprecated scripts, stale backups, obsolete Storybook stories for DELETE components). **UNSURE 7**. **KEEP 33 explicit** (active configs, CI, sacred slash commands). Safe cleanup effort.

### L12 — sql-migrations (`./.audit/layer-12-sql-migrations.md`)

226 migration files (224 `.sql` + 2 `.sql.skip`). **DELETE 2** (both `.sql.skip` — never applied). **ARCHIVE-NOTE-ONLY 5** (article RLS iterations — add SUPERSEDED comment headers, do not move). **KEEP 217**. **UNSURE 2** (Stripe tables migration without Stripe client code; `verifications` alter).

---

## Sacred Items Verified

All Section 4 items from the prompt confirmed present in the repo and tagged KEEP:

- [x] `src/lib/navigator/` — 13 files including scoring.ts + all sub-files
- [x] Confidence cap of 0.75 enforced at **3 sites**: `scoring.ts:7`, `scoring.ts:42`, `utils.ts:26` — all KEEP
- [x] `src/context/NavigatorContext.tsx` + companion files
- [x] Navigator tests (`src/tests/navigator/`)
- [x] `src/lib/article-framework/` — 9 files (types, constants, quality-gate, readability, content-architecture, CONTENT_GUIDELINES.md, index, citation-mapper, content-standards-data)
- [x] All 13 PEAF block components in `src/components/article/blocks/` — ArticleCallout, StatCard, ArticleChart, ComparisonTable, ArticleAccordion, ArticleTabs, QuoteBlock, HighlightBox, ProgressSteps, BeforeAfter, MythVsFactBlock, RelatedToolsBlock, DiagramBlock
- [x] MindMate 3-layer safety system — `src/components/ai/MindMate.tsx` + `src/lib/navigator/safety.ts` (has_crisis, has_urgent, RedFlagLevel, crisisResources) — all KEEP
- [x] Provider directory: `search_providers_v2` RPC, `src/lib/providers/`, provider services — all KEEP
- [x] Auth + RLS: `AuthContext`, `AuthContextDefinition.ts`, admin_roles RLS — all KEEP
- [x] Crisis resources: 433 TS + 350 TSX files reference "crisis"; none classified DELETE
- [x] The 6 React contexts: Auth, Theme, Bookmark, Navigator, Toast, ProviderLookups — all in `src/context/` (singular, not `contexts/`), all KEEP
- [x] Live tools (6): ClarityScore, ClarityJournal, MoodJournal + MoodWizard, SleepArchitect, RelationshipHealthCheck, MedicationTracker — all routes + components KEEP
- [x] Article rewrite system: `article-rewrite-manifest.json`, `.rewrite/locks/`, `.rewrite/file-locks/`, `.rewrite/find-session.cjs`, `.claude/commands/rewrite.md`, `.claude/commands/rewrite-finalize.md` — all KEEP
- [x] Article TSX content files in `src/data/articles/` (~355 files) — batch KEEP as Supabase → TSX cascade fallback

Phase 4 Check #1 returned 0 violations after sacred-keeps.txt refinement.

---

## Methodology Notes

### Tools used

| Tool | Version / Source | Outcome | Notes |
|---|---|---|---|
| `pnpm` | 10.25.0 (per package.json) | Used for build + workspace | Repo uses pnpm, not npm (prompt said npm — I substituted) |
| `knip` | latest via `npx --yes` | ⚠️ **High false-positive rate** | Flagged 67 deps incl. `supabase`, `framer-motion`, `lucide-react` (all clearly KEEP with 94/233/378 importers). Treated knip output as a candidate list only, never as source of truth |
| `depcheck` | latest via `npx` | ✅ trustworthy for 11 unused deps + 9 unused devDeps + 1 missing (`dotenv`) | Still has false positives for config-level deps (`autoprefixer`, `postcss` flagged unused) |
| `ts-prune` | latest via `npx` | ✅ 924 truly dead exports | Filtered "(used in module)" noise |
| `madge` | latest via `npx` | ✅ 319 orphan modules, 14 circular chains | Orphans include many intentional (stories, tests) — hand-verified |
| `rg` (ripgrep) | system | ✅ primary verification tool | Used for per-dep importer counts, env var cross-refs, sacred-path enumeration |

### Fallbacks and limitations

- **Knip output unusable:** knip.json contained 67 unused deps, but manual `rg` verification showed most had hundreds of importers. Cause likely misconfigured entry points (no knip config file in repo). Fallback: manual bash loop counting importers for every dep in package.json (`.audit/raw/dep-importers.tsv`).
- **Madge orphans are over-inclusive:** test/story files and lazy-loaded components show as orphans. L06 explicitly re-verified each with dynamic-imports grep.
- **Dynamic imports not fully traced:** 127 `import(...)` calls in `dynamic-imports.txt`. Most are obvious (lazy route loading), but a few may be string-based (e.g., `import(${path})`). Those drove UNSURE classifications in L06.
- **Storybook stories only spot-checked:** L11 classified story files but did not individually verify each against its component.
- **SQL migration impact not executed:** migrations are classified by filename + metadata. No migration was actually run or reverted.
- **Storybook `*.stories.tsx` for sacred components kept:** any story referring to a DELETE component → story is DELETE too (noted in L11).

### Classification mode

"Balanced" per prompt instructions — flag (a) provably dead code AND (b) clearly out-of-scope-for-launch features. Not aggressive bundle-shrinking.

### Strict dep-integrity rule applied

Every ARCHIVE/DELETE candidate's importer graph was walked. If any importer was KEEP, the candidate was escalated to UNSURE. Example: `@sanity/client` has 1 importer (`sanityClient.ts`) which has 1 importer (`adminService.ts` — KEEP) → escalated UNSURE, documented as Critical Open Question #1.

---

## Appendix: Items Not Individually Audited

The following categories were batch-classified rather than enumerated per file, producing the ~1,544-item "gap" in Phase 4 Check #5:

1. **Article TSX content files** (~355 files under `src/data/articles/category-XX/*.tsx`) — classified as **KEEP as a class** in sacred-keeps.txt. Individual files were not enumerated because (a) they're all part of the Supabase→TSX fallback cascade and (b) per the prompt, "Never flag for ARCHIVE/DELETE without explicit per-file evidence the content is also in Supabase AND the cascade has been reverified." Article rewrite manifest (`article-rewrite-manifest.json`) tracks individual article state.
2. **Test files** (`*.test.ts`, `*.test.tsx`) — classified with parent component. A test for a DELETE component is DELETE; a test for a KEEP component is KEEP. Not enumerated.
3. **Sub-components of DELETE directories** — e.g., if a whole provider UI subdirectory is DELETE, its internal sub-files are DELETE by inheritance (documented at directory level).
4. **Article seed SQL migrations** (140 files) — grouped in L12 summary; not enumerated per file because they're all part of the current seeded dataset.
5. **Sacred block components** — 13 PEAF blocks + index + shared utilities — classified KEEP as a block (literally) in L06.
6. **Content architecture types** in `src/lib/article-framework/` — sacred, not flagged.
7. **Types-only files** in `src/types/` — covered in L10 via directory-level analysis.
8. **Clarity Score subproject** (`/clarity-score/` — separate Next.js app) — has 3 Finder-duplicate files flagged DELETE, but the subproject itself is out of scope for the main-app audit. Noted in L11.
9. **Claude worktrees** (`.claude/worktrees/nervous-yonath/`) — contains a stale snapshot of the repo with its own duplicates. Out of audit scope.
10. **Storybook `*.stories.tsx` files** — L11 classified live ones KEEP and DELETE-pair ones DELETE without individually listing each story.

**Verification of the gap:** `grep -r -l "KEEP" .audit/layer-*.md | xargs wc -l` returns ~2,000 lines; actual explicit data-row classifications are 588. The difference is summary prose, group-level statements, and sacred-list reliance.

---

*End of audit. 12 layer reports in `.audit/layer-01-*.md` through `.audit/layer-12-*.md`. Raw signals in `.audit/raw/`. Self-audit in `.audit/SELF_AUDIT.md`. Preconditions in `.audit/PRECONDITIONS.md`.*
