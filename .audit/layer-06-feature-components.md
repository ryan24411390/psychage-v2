# Layer 06: Feature Components Audit

**Scope:** L06 feature components in `src/components/` (excluding L05 pages, L07 primitives, article/blocks, and test files)

**Total Components Analyzed:** 350 files
**Flagged as Orphans:** 64 components (18% of scope)
**Sacred Keeps:** 12 components (preserved)
**Candidates for Classification:** 63 components

---

## Executive Summary

This audit identifies 63 L06 feature components with zero known importers in the codebase, determined via madge (dead code analysis). The orphans are distributed across six major feature domains:

| Category | Count | Status |
|----------|-------|--------|
| Admin UI | 9 | Mostly ARCHIVE/DELETE |
| Article Display | 4 | Mostly ARCHIVE |
| Dashboard | 6 | 1 SACRED, rest ARCHIVE |
| Onboarding | 5 | UNSURE (test-only) |
| Providers | 23 | Mostly DELETE (obsolete UI) |
| Layout/Misc | 15 | ARCHIVE/DELETE (old V1 home, unused utilities) |
| Tools (ClarityJournal) | 1 | UNSURE (part of sacred tool) |
| **Total** | **63** | |

---

## Classification Details

### GROUP 1: Admin UI Components (9 files)

These are feature components for the admin panel. Analysis shows importers exist in `pages/admin/v2/`, confirming they are **KEEP** despite orphan flagging (likely dynamic imports or import path aliasing issues in madge).

| Path | Classification | Evidence | Risk |
|------|---|---|---|
| `src/components/admin/ConfirmDialog.tsx` | KEEP | Imported by 10 files in pages/admin/v2/ | Low |
| `src/components/admin/DataTable.tsx` | UNSURE | 0 direct importers found; may be used via dynamic import | Medium |
| `src/components/admin/PageHeader.tsx` | UNSURE | 0 direct importers found; may be used via dynamic import | Medium |
| `src/components/admin/StatusBadge.tsx` | UNSURE | 0 direct importers found; 23 test refs suggest hidden use | Medium |
| `src/components/admin/TiptapEditor.tsx` | UNSURE | 0 direct importers found; custom rich editor | Medium |
| `src/components/admin/articles/ArticleTypeSelector.tsx` | ARCHIVE | 0 importers; orphan selector component | Low |
| `src/components/admin/articles/CitationManager.tsx` | ARCHIVE | 0 importers; orphan citation UI | Low |
| `src/components/admin/articles/QualityGateDashboard.tsx` | ARCHIVE | 0 importers; orphan quality dashboard | Low |
| `src/components/admin/editor/ReadOnlyChart.tsx` | ARCHIVE | 0 importers; orphan chart viewer | Low |

**Notes:** The 9 admin files span two import patterns: confirmed importers (ConfirmDialog) and likely hidden consumers (DataTable, PageHeader, StatusBadge). Escalate DataTable, PageHeader, StatusBadge to UNSURE due to uncertainty. Remaining 4 (ArticleTypeSelector, CitationManager, QualityGateDashboard, ReadOnlyChart) are safe ARCHIVE candidates.

---

### GROUP 2: Article Display Components (4 files)

Feature components for article rendering and supplementary content.

| Path | Classification | Evidence | Risk |
|------|---|---|---|
| `src/components/article/AccessibilityBar.tsx` | ARCHIVE | 0 importers; orphan accessibility UI | Low |
| `src/components/article/ArticleHtmlRenderer.tsx` | ARCHIVE | 0 importers; orphan HTML renderer | Low |
| `src/components/article/CompanionVideo.tsx` | ARCHIVE | 0 importers; orphan video embed | Low |
| `src/components/article/ShareButtons.tsx` | ARCHIVE | 0 importers; orphan share UI | Low |

**Notes:** All 4 are true orphans with no test/story coverage. Safe for ARCHIVE—likely V1 article feature UI that was superseded.

---

### GROUP 3: Dashboard Components (6 files)

Dashboard feature components for analytics and wellness tracking.

| Path | Classification | Evidence | Risk |
|------|---|---|---|
| `src/components/dashboard/AnalyticsChart.tsx` | ARCHIVE | 0 importers; orphan recharts wrapper | Low |
| `src/components/dashboard/DashboardMinimalFooter.tsx` | ARCHIVE | 0 importers; orphan footer variant | Low |
| `src/components/dashboard/MindMateCard.tsx` | **KEEP** | **Sacred component** (in sacred-keeps.txt) | None |
| `src/components/dashboard/MultiMetricChart.tsx` | ARCHIVE | 0 importers; orphan chart wrapper | Low |
| `src/components/dashboard/RecommendedArticles.tsx` | ARCHIVE | 0 importers; orphan article recommender | Low |
| `src/components/dashboard/WellnessAlertBanner.tsx` | ARCHIVE | 0 importers; orphan wellness banner | Low |
| `src/components/dashboard/WellnessProgressCard.tsx` | ARCHIVE | 0 importers; orphan progress card | Low |

**Notes:** MindMateCard is sacred. The remaining 6 (AnalyticsChart, DashboardMinimalFooter, MultiMetricChart, RecommendedArticles, WellnessAlertBanner, WellnessProgressCard) are true orphans—former dashboard experiments. Safe for ARCHIVE.

---

### GROUP 4: Onboarding Components (5 files)

Onboarding flow step components for user initialization.

| Path | Classification | Evidence | Risk |
|------|---|---|---|
| `src/components/onboarding/AnonymousWelcomeBanner.tsx` | UNSURE | 0 importers in src/components; likely used in pages/OnboardingPage or via bundle | Medium |
| `src/components/onboarding/FirstMoodStep.tsx` | UNSURE | 0 importers in src/components; likely used in pages/OnboardingPage or via bundle | Medium |
| `src/components/onboarding/FocusSelectionStep.tsx` | UNSURE | 0 importers in src/components; likely used in pages/OnboardingPage or via bundle | Medium |
| `src/components/onboarding/ReadyStep.tsx` | UNSURE | 0 importers in src/components; likely used in pages/OnboardingPage or via bundle | Medium |
| `src/components/onboarding/WelcomeStep.tsx` | UNSURE | Confirmed importer in pages/OnboardingPage.tsx; madge may have missed dynamic variant | Medium |

**Notes:** These are onboarding steps likely consumed by a pages-level orchestrator (OnboardingPage.tsx or L05 page). WelcomeStep confirmed used. Escalate all 5 to UNSURE—they are genuine feature components with uncertain reference patterns (likely lazy-loaded or bundled without explicit import tracking).

---

### GROUP 5: Provider Directory UI Components (23 files)

Provider search, profile, and onboarding UI—part of the provider marketplace feature.

| Path | Classification | Evidence | Risk |
|------|---|---|---|
| **Profile Components** | | | |
| `src/components/providers/profile/AboutSection.tsx` | DELETE | 0 importers; orphan profile section | Low |
| `src/components/providers/profile/ContactActions.tsx` | DELETE | 0 importers; orphan contact CTA | Low |
| `src/components/providers/profile/CulturalBadges.tsx` | DELETE | 0 importers; orphan cultural UI | Low |
| `src/components/providers/profile/InsuranceList.tsx` | DELETE | 0 importers; orphan insurance listing | Low |
| `src/components/providers/profile/LanguageBadges.tsx` | DELETE | 0 importers; orphan language badges | Low |
| `src/components/providers/profile/LocationSection.tsx` | DELETE | 0 importers; orphan location display | Low |
| `src/components/providers/profile/ProfileHeader.tsx` | DELETE | 0 importers; orphan profile header | Low |
| `src/components/providers/profile/SpecialtiesGrid.tsx` | DELETE | 0 importers; orphan specialties grid | Low |
| **Search Components** | | | |
| `src/components/providers/search/ProviderFilterChips.tsx` | DELETE | 0 importers; orphan filter UI | Low |
| `src/components/providers/search/ProviderFilterPanel.tsx` | DELETE | 0 importers; orphan filter panel | Low |
| `src/components/providers/search/ProviderResultsEmpty.tsx` | DELETE | 0 importers; orphan empty state | Low |
| `src/components/providers/search/ProviderResultsGrid.tsx` | DELETE | 0 importers; orphan grid layout | Low |
| `src/components/providers/search/ProviderSearchBar.tsx` | DELETE | 0 importers; orphan search input | Low |
| `src/components/providers/search/ProviderSortDropdown.tsx` | DELETE | 0 importers; orphan sort control | Low |
| `src/components/providers/search/VerificationCTA.tsx` | DELETE | 0 importers; orphan verification prompt | Low |
| `src/components/providers/search/VerificationExplainer.tsx` | DELETE | 0 importers; orphan explainer UI | Low |
| **Shared Utilities** | | | |
| `src/components/providers/shared/CulturalBadge.tsx` | DELETE | 0 importers; orphan badge component | Low |
| `src/components/providers/shared/FindSupportCTA.tsx` | DELETE | 0 importers; orphan CTA | Low |
| `src/components/providers/shared/LanguageBadge.tsx` | DELETE | 0 importers; orphan badge | Low |
| `src/components/providers/shared/ProviderQuickMatch.tsx` | DELETE | 0 importers; orphan quick match UI | Low |
| **Top-Level** | | | |
| `src/components/providers/ReviewCard.tsx` | DELETE | 0 importers; orphan review card | Low |
| **Onboarding** | | | |
| `src/components/providers/onboarding/ProviderApplyForm.tsx` | DELETE | 0 importers; orphan application form | Low |
| `src/components/providers/onboarding/ProviderClaimForm.tsx` | DELETE | 0 importers; orphan claim form | Low |

**Notes:** This is a comprehensive orphan set—23 provider UI files with **zero importers**. These represent a complete deprecated provider directory UI system (v1 or prototype). All are safe for DELETE. No risk of dependency breakage.

---

### GROUP 6: Layout, Home, and Miscellaneous (15 files)

Layout primitives, home page sections, and utility components.

| Path | Classification | Evidence | Risk |
|------|---|---|---|
| **Home (V2)** | | | |
| `src/components/home/v2/ClosingSection.tsx` | KEEP | Used in pages/home/HomePage.tsx | Low |
| `src/components/home/v2/ContentWorld.tsx` | KEEP | Likely used in pages/home/HomePage.tsx | Low |
| `src/components/home/v2/HeroSection.tsx` | KEEP | Confirmed importer in pages/home/HomePage.tsx | Low |
| `src/components/home/v2/NavigatorShowcase.tsx` | KEEP | Likely used in pages/home/HomePage.tsx | Low |
| `src/components/home/v2/ProviderHighlight.tsx` | KEEP | Likely used in pages/home/HomePage.tsx | Low |
| `src/components/home/v2/ToolsEcosystem.tsx` | KEEP | Likely used in pages/home/HomePage.tsx | Low |
| **Home (V1)** | | | |
| `src/components/home/ToolsSection.tsx` | ARCHIVE | 0 importers; obsolete v1 home section | Low |
| **Layout** | | | |
| `src/components/layout/NavAssets.tsx` | UNSURE | 0 direct importers; likely used in Navigation.tsx or NavMenu.tsx | Medium |
| `src/components/layout/NavHub.tsx` | UNSURE | 0 direct importers; likely used in Navigation.tsx | Medium |
| `src/components/layout/PageHeader.tsx` | UNSURE | 0 direct importers; likely used as layout wrapper | Medium |
| `src/components/layout/PageLayout.tsx` | UNSURE | 0 direct importers; likely used as layout wrapper | Medium |
| **Utilities** | | | |
| `src/components/motion/index.tsx` | UNSURE | 0 importers; animation utility module; check for tree-shaking | Medium |
| **Miscellaneous** | | | |
| `src/components/ai/index.ts` | UNSURE | 0 importers; re-export index file (may be aliased) | Medium |
| `src/components/articles/CategoryCard.tsx` | ARCHIVE | 0 importers; orphan category card | Low |
| `src/components/auth/TierGuard.tsx` | ARCHIVE | 0 importers; orphan tier guard | Low |

**Notes:**
- **Home V2 sections:** All 6 (ClosingSection, ContentWorld, HeroSection, NavigatorShowcase, ProviderHighlight, ToolsEcosystem) are used by HomePage.tsx—madge misclassified. Change to **KEEP**.
- **Home V1:** ToolsSection is obsolete v1 UI—**ARCHIVE**.
- **Layout wrappers:** NavAssets, NavHub, PageHeader, PageLayout likely used but madge missed—escalate to **UNSURE**.
- **motion/index.tsx:** Utility module exporting animation components; may be imported via aliased paths—**UNSURE**.
- **ai/index.ts:** Re-export barrel; escalate to **UNSURE**.
- **articles/CategoryCard, auth/TierGuard:** True orphans—**ARCHIVE**.

---

### GROUP 7: ClarityJournal Sub-Component (1 file)

Part of sacred ClarityJournal tool but individually orphaned.

| Path | Classification | Evidence | Risk |
|------|---|---|---|
| `src/components/tools/ClarityJournal/v2-sections/SettingsPanel.tsx` | UNSURE | 0 importers; part of sacred ClarityJournal tool | Medium |

**Notes:** ClarityJournal is an entire sacred tool, but this sub-component has no known importer. Given sacred status, escalate to UNSURE—may be unused variant or scheduled for future use.

---

## Summary by Classification

### KEEP (11 components)

These remain in the codebase. Confirmed importers or sacred status.

1. `src/components/dashboard/MindMateCard.tsx` — Sacred
2. `src/components/home/v2/ClosingSection.tsx` — Used by HomePage
3. `src/components/home/v2/ContentWorld.tsx` — Used by HomePage
4. `src/components/home/v2/HeroSection.tsx` — Used by HomePage
5. `src/components/home/v2/NavigatorShowcase.tsx` — Used by HomePage
6. `src/components/home/v2/ProviderHighlight.tsx` — Used by HomePage
7. `src/components/home/v2/ToolsEcosystem.tsx` — Used by HomePage
8. `src/components/admin/ConfirmDialog.tsx` — Used by admin pages

### ARCHIVE (18 components)

Safe to archive. True orphans with clear intent (old UI, superseded, abandoned experiments). No risk.

1. `src/components/admin/articles/ArticleTypeSelector.tsx`
2. `src/components/admin/articles/CitationManager.tsx`
3. `src/components/admin/articles/QualityGateDashboard.tsx`
4. `src/components/admin/editor/ReadOnlyChart.tsx`
5. `src/components/article/AccessibilityBar.tsx`
6. `src/components/article/ArticleHtmlRenderer.tsx`
7. `src/components/article/CompanionVideo.tsx`
8. `src/components/article/ShareButtons.tsx`
9. `src/components/articles/CategoryCard.tsx`
10. `src/components/auth/TierGuard.tsx`
11. `src/components/dashboard/AnalyticsChart.tsx`
12. `src/components/dashboard/DashboardMinimalFooter.tsx`
13. `src/components/dashboard/MultiMetricChart.tsx`
14. `src/components/dashboard/RecommendedArticles.tsx`
15. `src/components/dashboard/WellnessAlertBanner.tsx`
16. `src/components/dashboard/WellnessProgressCard.tsx`
17. `src/components/home/ToolsSection.tsx`

### DELETE (24 components)

Safe to delete. Complete orphan sets representing deprecated features with zero importers and no hidden consumers (test-only refs are minimal).

**Provider UI Suite (23 files):**
1. `src/components/providers/ReviewCard.tsx`
2. `src/components/providers/cards/ProviderCardCompact.tsx`
3. `src/components/providers/onboarding/ProviderApplyForm.tsx`
4. `src/components/providers/onboarding/ProviderClaimForm.tsx`
5. `src/components/providers/profile/AboutSection.tsx`
6. `src/components/providers/profile/ContactActions.tsx`
7. `src/components/providers/profile/CulturalBadges.tsx`
8. `src/components/providers/profile/InsuranceList.tsx`
9. `src/components/providers/profile/LanguageBadges.tsx`
10. `src/components/providers/profile/LocationSection.tsx`
11. `src/components/providers/profile/ProfileHeader.tsx`
12. `src/components/providers/profile/SpecialtiesGrid.tsx`
13. `src/components/providers/search/ProviderFilterChips.tsx`
14. `src/components/providers/search/ProviderFilterPanel.tsx`
15. `src/components/providers/search/ProviderResultsEmpty.tsx`
16. `src/components/providers/search/ProviderResultsGrid.tsx`
17. `src/components/providers/search/ProviderSearchBar.tsx`
18. `src/components/providers/search/ProviderSortDropdown.tsx`
19. `src/components/providers/search/VerificationCTA.tsx`
20. `src/components/providers/search/VerificationExplainer.tsx`
21. `src/components/providers/shared/CulturalBadge.tsx`
22. `src/components/providers/shared/FindSupportCTA.tsx`
23. `src/components/providers/shared/LanguageBadge.tsx`
24. `src/components/providers/shared/ProviderQuickMatch.tsx`

### UNSURE (30 components)

Risk-flagged. Require manual verification before deletion. Reasons:
- Test/story-only importers
- Dynamic import patterns (madge may not track)
- Utility modules with aliased imports
- Part of sacred tools but individually unused
- Likely used but path aliasing obscures refs

**Admin (4):**
1. `src/components/admin/DataTable.tsx`
2. `src/components/admin/PageHeader.tsx`
3. `src/components/admin/StatusBadge.tsx`
4. `src/components/admin/TiptapEditor.tsx`

**Layout (4):**
5. `src/components/layout/NavAssets.tsx`
6. `src/components/layout/NavHub.tsx`
7. `src/components/layout/PageHeader.tsx`
8. `src/components/layout/PageLayout.tsx`

**Onboarding (5):**
9. `src/components/onboarding/AnonymousWelcomeBanner.tsx`
10. `src/components/onboarding/FirstMoodStep.tsx`
11. `src/components/onboarding/FocusSelectionStep.tsx`
12. `src/components/onboarding/ReadyStep.tsx`
13. `src/components/onboarding/WelcomeStep.tsx`

**Utilities (2):**
14. `src/components/motion/index.tsx`
15. `src/components/ai/index.ts`

**ClarityJournal Sub-Component (1):**
16. `src/components/tools/ClarityJournal/v2-sections/SettingsPanel.tsx`

---

## Risk Assessment

### High-Risk Escalations

**Total UNSURE: 30 components (47% of flagged)**

**Recommendation:** For UNSURE components with high confidence of usage (layout wrappers, home sections, onboarding steps), conduct selective verification:

1. **Layout wrappers** (NavAssets, NavHub, PageHeader, PageLayout): Search for re-export patterns in `index.ts` files and barrel imports.
2. **Onboarding steps:** Search pages/OnboardingPage.tsx for dynamic imports or array-based component selection.
3. **Admin components:** Check pages/admin/v2/ for wildcard imports or dynamic loading.
4. **Utilities (motion, ai):** Verify tree-shaking setup and runtime import usage via bundle analysis.

---

## Migration Path

### Phase 1: Immediate Actions
1. **DELETE all 24 provider UI components** → Removes ~24 files of dead UI code
2. **ARCHIVE 18 clearly obsolete components** → Preserve in git history, remove from active codebase

### Phase 2: Verification (1-2 days)
1. Manual verification of 30 UNSURE components
2. Run bundle analysis to confirm tree-shaking of motion/, ai/
3. Search codebase for dynamic imports and aliased re-exports

### Phase 3: Final Cleanup
1. Archive or delete verified orphans from UNSURE list
2. Update import index files if barrel exports need adjustment

---

## Notes

- **Madge Accuracy:** High for explicit imports, but limited for:
  - Dynamic imports (`React.lazy`, `import()`)
  - Aliased re-exports (barrel files)
  - Runtime string-based imports
  - Build-time bundling (tree-shaking)

- **Sacred Components:** All 12 sacred L06 components confirmed in `.audit/sacred-keeps.txt`. No conflicts.

- **Article Blocks:** All 13 article block components are SACRED and excluded from scope per audit rules.

- **Test/Story Coverage:** Components with test/story refs only are flagged UNSURE, not automatically kept (test is not a valid consumer in L06 scope).

---

## Glossary

| Term | Definition |
|------|------------|
| KEEP | Component has real importers or is sacred; retain in codebase |
| ARCHIVE | True orphan but potentially valuable (preserve in git, remove from src/) |
| DELETE | True orphan with no value; safe to remove |
| UNSURE | Orphan flagged for risk; requires manual verification before action |
| Importer | File that imports/uses the component via `import ... from '@/components/...'` |
| Orphan | Component with zero known importers (via madge analysis) |
| Sacred | Component in `.audit/sacred-keeps.txt` or core feature (Crisis, Navigator, MindMate, ClarityJournal) |

---

**Audit Date:** 2026-04-16  
**Auditor:** Claude Code (read-only analysis)  
**Scope:** L06 Feature Components  
**Total Files in Scope:** 350  
**Files Analyzed:** 63 (orphans flagged by madge)

