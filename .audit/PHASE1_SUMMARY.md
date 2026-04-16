# Phase 1 — Baseline Inventory Summary

Collected 2026-04-16 on branch `cleanup/audit-2026-04-16`.

## Raw signals

| Signal | Count | File |
|---|---:|---|
| TS/TSX files in `src/` | 1,306 | `raw/all-source-files.txt` |
| `src/` sub-directories | 237 | `raw/all-dirs.txt` |
| npm dependencies (runtime) | 73 | `raw/package.json.snapshot` |
| npm devDependencies | 39 | `raw/package.json.snapshot` |
| **npm deps total** | **112** | — |
| Route declarations (`Route path=`) | 113 | `raw/routes.txt` |
| Lazy-loaded imports | 108 | `raw/lazy-imports.txt` |
| Dynamic imports (`import(...)`) | 127 | `raw/dynamic-imports.txt` |
| Unique env vars used (`import.meta.env.*`) | 22 | `raw/env-vars-used.txt` |
| Madge orphan modules | 319 | `raw/orphans.txt` |
| Madge circular chains | 14 | `raw/circular.txt` |
| ts-prune dead exports | 924 | `raw/ts-prune-dead.txt` |
| SQL migrations (.sql) | 224 | `raw/migrations.txt` |
| SQL migrations (.sql.skip) | 2 | `raw/migrations.txt` |
| Finder-duplicated files in `src/` | 2 | `raw/finder-duplicates.txt` |
| Backup/dupe files repo-wide | 17 | `raw/backup-duplicates.txt` |

## Tool status

| Tool | Result | Notes |
|---|---|---|
| `pnpm run build` | ✅ exit 0, 19.37s, 5009 modules, 73MB dist | Baseline — must remain green |
| `knip --reporter json` | ⚠️ false positives | Flagged 67 deps incl. supabase/framer-motion/lucide-react (all clearly used). Output kept for cross-reference only, not as source of truth. |
| `depcheck` | ✅ 11 unused deps + 9 unused devDeps + 1 missing (`dotenv`) | More trustworthy than knip but also has config-level false positives (`autoprefixer`, `postcss`) |
| `ts-prune` | ✅ 924 dead exports | Module-internal "(used in module)" lines filtered out |
| `madge --orphans` | ✅ 319 orphans | Many orphans are story files + test files — will cross-check per layer |
| `madge --circular` | 14 cycles exist | Noted for L10/L11; not blocking cleanup |

## Key signals flagged for Phase 3

- **Sanity dormancy confirmed**: `@portabletext/react` appears in depcheck unused list; `sanityArticleService.ts` has 0 importers. L08 DELETE candidate.
- **Finder duplicates**: `src/lib/highlightText 2.ts`, `src/tests/setup 2.ts` — macOS artifacts, DELETE candidates (L10/L11).
- **Repo-root duplicates**: `vitest.config 2.ts`, `src/data/articles/PROGRESS.md.bak` — DELETE candidates (L11).
- **Worktree duplicates**: `.claude/worktrees/nervous-yonath/` contains stale copies — out of audit scope but noted.
- **Missing dep declaration**: `dotenv` used but not in package.json — note for fix (not classification).
- **Heavy tooling output**: knip's high false-positive rate requires manual `rg "from '<dep>'"` verification for each dep in L01.

## Classifications NOT to start from tooling alone

- Every L01 dep must be manually verified with `rg "from ['\"]<name>['\"]"`.
- Every orphan must be checked against dynamic-imports.txt before ARCHIVE/DELETE.
- Sacred-keeps.txt takes precedence over every signal (Phase 2).

No classifications have been made yet. Phase 2 (sacred tagging) is next.
