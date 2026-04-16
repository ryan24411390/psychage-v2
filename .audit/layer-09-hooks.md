# Layer L09 — Hooks (23 files in `src/hooks/`)

**Methodology:** Per-hook `rg -l "from '@/hooks/<name>'" src`. Cross-checked against `.audit/raw/ts-prune-dead.txt`.

## DELETE — zero importers

| path | classification | evidence | dependencies | risk | notes |
|---|---|---|---|---|---|
| `src/hooks/useAsyncData.ts` | DELETE | 0 importers. ts-prune marks default export dead. | — | LOW | Generic async utility, never called |
| `src/hooks/useTopicHubData.ts` | DELETE | 0 importers. ts-prune marks export dead. | `articleService` (KEEP) | LOW | Orphan loader superseded by other patterns |

## KEEP — active, verified

| path | classification | evidence | risk | notes |
|---|---|---|---|---|
| `src/hooks/useReducedMotion.ts` | KEEP | **33 importers** | CRITICAL | A11y motion preference — pervasive across app |
| `src/hooks/useAdminNavigate.ts` | KEEP | **22 importers** | CRITICAL | Admin navigation backbone |
| `src/hooks/useProviderPortal.ts` | KEEP | 6 importers | HIGH | Provider portal data layer |
| `src/hooks/useProviderFilters.ts` | KEEP | 6 importers | HIGH | Provider search filter system |
| `src/hooks/useAdminSearch.ts` | KEEP | 5 importers | MEDIUM | Admin search |
| `src/hooks/useTimeOfDay.ts` | KEEP | 3 importers | LOW | Time-based UI logic |
| `src/hooks/useAdminAuth.ts` | KEEP | 2 importers | HIGH | Admin auth guard |
| `src/hooks/useMediaQuery.ts` | KEEP | 2 importers | MEDIUM | Responsive design |
| `src/hooks/useNavPermissions.ts` | KEEP | 2 importers | MEDIUM | Navigation permissions |
| `src/hooks/useNavigation.ts` | KEEP | 2 importers | MEDIUM | Navigation orchestration |
| `src/hooks/useNPIVerification.ts` | KEEP | 2 importers | MEDIUM | Provider NPI verification |
| `src/hooks/useWellnessProgress.ts` | KEEP | 2 importers | MEDIUM | Wellness dashboard |
| `src/hooks/useDebounce.ts` | KEEP | 1 importer (SymptomSelectionScreen — sacred Navigator UI) | LOW | — |
| `src/hooks/useFocusTrap.tsx` | KEEP | 1 importer (CrisisOverlay — sacred) | LOW | A11y for crisis modal |
| `src/hooks/useHomepageArticles.ts` | KEEP | 1 importer | LOW | Homepage articles |
| `src/hooks/useAdminKeyboardShortcuts.ts` | KEEP | 1 importer | MEDIUM | Admin a11y |
| `src/hooks/useBreadcrumbs.ts` | KEEP | 1 importer | LOW | Breadcrumb helper |
| `src/hooks/useProviderSearch.ts` | KEEP | 1 importer | MEDIUM | Provider search |
| `src/hooks/useProviderProfile.ts` | KEEP | 1 importer | MEDIUM | Provider profile |
| `src/hooks/useUrlFilterState.ts` | KEEP | 1 importer | LOW | URL filter state |
| `src/hooks/useGeolocation.ts` | KEEP | 1 importer | LOW | Geolocation API wrapper |

## Summary — L09

- **23 hooks total**
- **DELETE: 2** — `useAsyncData.ts`, `useTopicHubData.ts` (both zero importers, dead exports)
- **KEEP: 21**
- **ARCHIVE / UNSURE: 0**

Sacred preservation: `useReducedMotion` (33 importers), `useFocusTrap` (crisis overlay), `useDebounce` (Navigator) — all KEEP.
