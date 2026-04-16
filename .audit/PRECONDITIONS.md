# Pre-flight Discrepancies vs Prompt (2026-04-16)

Branch: `cleanup/audit-2026-04-16` (from `main`)
Start time: 2026-04-16

## Discrepancies found in pre-flight, approved by user

| # | Prompt claim | Reality | Resolution |
|---|---|---|---|
| 1 | 40+ uncommitted UI polish files | `git status --porcelain` → 0 lines; working tree is clean | **Skipped Phase 0.2** (wip/ui-polish-snapshot-2026-04-16 branch NOT created). No WIP to snapshot. |
| 2 | Confidence cap `0.75` appears ≥3× in `src/lib/navigator/` | ~~Only 2 hits~~ **3 hits confirmed after Phase 2 recheck**: `scoring.ts:7`, `scoring.ts:42`, `utils.ts:26`. Pre-flight search was too narrow. | Self-audit check #2 passes as written. No relaxation needed. |
| 3 | Commands use `npm` | Repo is **pnpm** (pnpm-lock.yaml, `pnpm run verify:routes` inside build script) | Substitute `pnpm` throughout. Build = `pnpm run build`. |
| 4 | `src/contexts/NavigatorContext*` | Path is `src/context/` (singular) | Adjust sacred-keeps glob: `src/context/*Context*.{ts,tsx}`. |
| 5 | ~208 SQL migrations | **224** files in `supabase/migrations/` | Use actual count; L12 scope unchanged. |
| 6 | Sanity fully dormant | `sanityArticleService.ts` exists with 0 importers; `sanitySyncService` does NOT exist; `vendor-sanity` manualChunk still in `vite.config.ts` L89; `VITE_SANITY_*` still referenced 6× | Per-file classification with evidence. |

## Dep-integrity rule (Phase 4 Check #4): STRICT single-importer

Any ARCHIVE/DELETE item with even one KEEP importer → escalate to UNSURE with note.

## Actions actually taken in Phase 0

- [x] `git status --porcelain | wc -l` → 0 (clean)
- [x] `git branch --show-current` → was `main`
- [ ] Phase 0.2 (WIP snapshot) — **SKIPPED** (no uncommitted files)
- [x] `git checkout -b cleanup/audit-2026-04-16`
- [x] `mkdir -p .audit/raw`
- [ ] Baseline build — next step
