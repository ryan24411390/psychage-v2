# Layer L07 — UI Primitives (`src/components/ui/`)

**Methodology:** Enumerated 25 primitive components (+ 10 test files). First pass counted importers via `rg -l "from '@/components/ui/<name>'" src`. Second pass (for 0-importer results) re-ran with relative path and bare-name patterns — all zero results turned out to be imported via different path styles.

Data sources: `.audit/raw/ui-primitives.txt`, `.audit/raw/ui-primitive-importers.tsv`.

## All primitives — KEEP

| path | classification | evidence | risk | notes |
|---|---|---|---|---|
| `src/components/ui/Button.tsx` | KEEP | 85 importers — pervasive | CRITICAL | — |
| `src/components/ui/Card.tsx` | KEEP | 19 importers | HIGH | — |
| `src/components/ui/Breadcrumbs.tsx` | KEEP | 17 importers | HIGH | — |
| `src/components/ui/Input.tsx` | KEEP | 15 importers | HIGH | — |
| `src/components/ui/InteractiveCard.tsx` | KEEP | 12 importers | HIGH | — |
| `src/components/ui/Badge.tsx` | KEEP | 9 importers | HIGH | — |
| `src/components/ui/Typography.tsx` | KEEP | 9 importers | HIGH | — |
| `src/components/ui/Label.tsx` | KEEP | 7 importers | MEDIUM | — |
| `src/components/ui/Alert.tsx` | KEEP | 4 importers | MEDIUM | — |
| `src/components/ui/Skeletons.tsx` | KEEP | 2 importers | MEDIUM | — |
| `src/components/ui/LogoIcon.tsx` | KEEP | 2 importers | MEDIUM | — |
| `src/components/ui/FeedbackWidget.tsx` | KEEP | 1 importer | LOW | — |
| `src/components/ui/Logo.tsx` | KEEP | 1 importer | LOW | — |
| `src/components/ui/Modal.tsx` | KEEP | 1 importer | MEDIUM | Test file confirms component is tested |
| `src/components/ui/NotificationPrompt.tsx` | KEEP | 1 importer | LOW | — |
| `src/components/ui/Pagination.tsx` | KEEP | 1 importer | LOW | — |
| `src/components/ui/ConfirmDialog.tsx` | KEEP | Imported by Navigator screens (`EnhancedProgressBar`, `DurationSeverityScreen`, `ResultsScreen`) — sacred | HIGH | A11y-test present (confirm-dialog.a11y.test.tsx) |
| `src/components/ui/CookieConsent.tsx` | KEEP | Imported by `App.tsx` and `privacyService.ts` | HIGH | Cookie compliance |
| `src/components/ui/EmptyState.tsx` | KEEP | 5 importers (admin + dashboard pages) | MEDIUM | — |
| `src/components/ui/HighlightedText.tsx` | KEEP | Imported by Navigator `SymptomToggle.tsx` — sacred | LOW | — |
| `src/components/ui/LanguageSwitcher.tsx` | KEEP | Imported by `MobileMenu.tsx`, `Navigation.tsx` | MEDIUM | i18n UI |
| `src/components/ui/PageTransition.tsx` | KEEP | Used extensively in `App.tsx` route definitions | HIGH | Wraps every route element |
| `src/components/ui/ScrollManager.tsx` | KEEP | Used in `App.tsx` | MEDIUM | Scroll behavior |
| `src/components/ui/SkipLink.tsx` | KEEP | Used in `App.tsx` | HIGH | A11y — keyboard skip nav |
| `src/components/ui/ThemeToggle.tsx` | KEEP | Imported by `MobileMenu.tsx`, `Navigation.tsx` | HIGH | Dark mode toggle (recent commit 23cfe3c) |

## Test files in `src/components/ui/__tests__/`

All 10 test files correspond to live primitives — KEEP as a group.

## Summary — L07

- **25 primitives total**, **10 test files** — all **KEEP**
- **DELETE: 0**
- **ARCHIVE: 0**
- **UNSURE: 0**

UI primitives layer is clean — every primitive has at least one live importer. No cleanup opportunities at this layer.
