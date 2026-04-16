# Navigation Redesign Implementation Plan

> **⚠️ Partially superseded by cleanup 2026-04-16.**
> Sections of this document reference the following removed items and are no longer applicable:
> `ProviderDashboard`, `ProviderProfileEditor`, `ProviderAnalytics`, `ProviderPatients`,
> `ProviderSidebar`, `ProviderDetailAdmin`, `AuditLogPage`, `ReportsPage`, `AdminAnalyticsPage`,
> plus the `/admin/reports` and `/admin/analytics` routes. The provider directory now lives
> under `pages/providers/*` (live, kept). See `CLEANUP_EXECUTION.md` for the active state.

**Status**: Ready for Implementation
**Estimated Effort**: 3-4 days
**Dependencies**: None (can start immediately)

---

## Phase 1: Information Architecture Restructure

### 1.1 New Top-Level Navigation Structure

**Current State (Problematic):**
```
Platform | Resources | Company | Find Care | [Search] | [Auth]
```

**Proposed State:**
```
Learn | Tools | Find Care | [Search] | [Crisis] | [Auth]
```

**Rationale:**
- "Platform" is vague → "Tools" is direct
- "Resources" overlaps with Tools → Merge into "Learn"
- "Company" has low priority → Move to footer only
- "Crisis" gets persistent visibility (mental health requirement)

### 1.2 URL Hierarchy Improvements

#### Current Routes (Inconsistent)
```
/category/:category          ← Orphaned, duplicates /learn
/learn/:categorySlug         ← Primary category route
/learn/article/:id           ← Article detail
/dashboard/profile           ← Patient settings
/provider/profile            ← Provider public profile (confusing!)
/provider/dashboard          ← 404 (bug)
```

#### Proposed Routes (Consistent)
```
# Content
/learn                       → Article hub
/learn/:categorySlug         → Category listing
/learn/:categorySlug/:slug   → Article detail (better hierarchy)

# Tools
/tools                       → Tools hub
/tools/clarity-score         → Assessment tool
/tools/mood-journal          → Mood journal
/tools/sleep-architect       → Sleep tool

# Provider Directory
/providers                   → Directory (rename from /find-care)
/providers/:id               → Provider public profile

# Dashboards
/dashboard                   → Patient dashboard
/dashboard/settings          → Patient account settings (rename from profile)
/dashboard/bookmarks         → Patient bookmarks
/dashboard/history           → Assessment history (rename from assessments)

/provider                    → Provider dashboard
/provider/edit-profile       → Provider profile editor (clarify purpose)
/provider/analytics          → Analytics
/provider/patients           → Patient list

/admin                       → Admin dashboard
/admin/providers             → Provider management
/admin/audit                 → Audit logs
/admin/reports               → Reports
```

#### Migration Strategy
```tsx
// Add redirects for old routes in App.tsx
<Route path="/category/:category" element={<Navigate to="/learn/:category" replace />} />
<Route path="/find-care" element={<Navigate to="/providers" replace />} />
<Route path="/find-care/provider/:id" element={<Navigate to="/providers/:id" replace />} />
<Route path="/dashboard/profile" element={<Navigate to="/dashboard/settings" replace />} />
<Route path="/dashboard/assessments" element={<Navigate to="/dashboard/history" replace />} />
<Route path="/learn/article/:id" element={<Navigate to="/learn/articles/:id" replace />} />
```

### 1.3 Labeling Improvements

| Current Label | New Label | Reason |
|---------------|-----------|--------|
| Platform | Tools | Direct, action-oriented |
| Resources | Learn | Matches URL, clearer purpose |
| Company | (footer only) | Low priority for main nav |
| Find Care | Find Providers | More specific |
| Clarity History | Assessment History | Matches feature name |
| My Bookmarks | Saved | Shorter, modern |
| Profile Settings | Account Settings | Clearer distinction |
| My Profile (provider) | Edit Public Profile | Clarifies it's public-facing |
| Overview | Dashboard | Consistent with URL |

---

## Phase 2: Global Navigation Redesign

### 2.1 Desktop Navigation Structure

#### New Header Component Structure
```
┌──────────────────────────────────────────────────────────────────────┐
│ [Logo]   Learn ▼   Tools ▼   Find Providers   [🔍]  [Crisis]  [Auth] │
└──────────────────────────────────────────────────────────────────────┘
```

#### Learn Mega Menu
```
┌─────────────────────────────────────────────────────────────────────────┐
│ TOPICS                           │ QUICK ACCESS                         │
│ ─────────────────────────────── │ ─────────────────────────────────────│
│ 🧠 Mental Health Conditions     │ → Browse All Articles                 │
│    Anxiety, depression, ADHD... │ → Most Popular                        │
│                                  │ → Recently Added                      │
│ 🌿 Wellness & Lifestyle         │                                       │
│    Sleep, nutrition, exercise   │ ─────────────────────────────────────│
│                                  │ FEATURED                              │
│ 💼 Work & Life                  │ [Article Card Preview]                │
│    Burnout, boundaries, growth  │                                       │
│                                  │                                       │
│ 🔬 Treatment & Therapy          │                                       │
│    Types of therapy, what to    │                                       │
│    expect, finding help         │                                       │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Tools Mega Menu
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ASSESSMENTS                      │ DAILY TOOLS                          │
│ ─────────────────────────────── │ ─────────────────────────────────────│
│ 📊 Clarity Score                │ 📝 Mood Journal                       │
│    Cognitive assessment          │    Track patterns & triggers          │
│    [Take Assessment →]           │                                       │
│                                  │ 😴 Sleep Architect                   │
│                                  │    Optimize your sleep                │
│ ─────────────────────────────── │                                       │
│ YOUR PROGRESS                    │ ─────────────────────────────────────│
│ Last score: 78 (+5)             │ [Login to access your history]        │
│ [View History →]                │                                       │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Implementation: New NavMenu Config
```tsx
// src/config/navigation.ts
export const navigationConfig = {
  learn: {
    sections: [
      {
        title: 'Topics',
        items: [
          {
            id: 'conditions',
            label: 'Mental Health Conditions',
            description: 'Anxiety, depression, ADHD...',
            href: '/learn/conditions',
            icon: 'brain'
          },
          {
            id: 'wellness',
            label: 'Wellness & Lifestyle',
            description: 'Sleep, nutrition, exercise',
            href: '/learn/wellness',
            icon: 'leaf'
          },
          {
            id: 'work',
            label: 'Work & Life',
            description: 'Burnout, boundaries, growth',
            href: '/learn/work-life',
            icon: 'briefcase'
          },
          {
            id: 'treatment',
            label: 'Treatment & Therapy',
            description: 'Types of therapy, finding help',
            href: '/learn/treatment',
            icon: 'heart'
          },
        ]
      }
    ],
    quickActions: [
      { label: 'Browse All Articles', href: '/learn' },
      { label: 'Most Popular', href: '/learn?sort=popular' },
      { label: 'Recently Added', href: '/learn?sort=recent' },
    ]
  },
  tools: {
    sections: [
      {
        title: 'Assessments',
        items: [
          {
            id: 'clarity',
            label: 'Clarity Score',
            description: 'Cognitive assessment',
            href: '/tools/clarity-score',
            icon: 'chart',
            cta: 'Take Assessment'
          }
        ]
      },
      {
        title: 'Daily Tools',
        items: [
          {
            id: 'mood',
            label: 'Mood Journal',
            description: 'Track patterns & triggers',
            href: '/tools/mood-journal',
            icon: 'edit'
          },
          {
            id: 'sleep',
            label: 'Sleep Architect',
            description: 'Optimize your sleep',
            href: '/tools/sleep-architect',
            icon: 'moon'
          }
        ]
      }
    ]
  }
};
```

### 2.2 Mobile Navigation Structure

**Current Problem:** Mobile menu shows 6 links, loses all mega-menu content.

**Solution:** Accordion-based mobile navigation matching desktop capabilities.

#### Mobile Menu Redesign
```
┌─────────────────────────────────┐
│ [Logo]              [X Close]   │
├─────────────────────────────────┤
│                                 │
│ Learn                        ▼  │
│ ┌─────────────────────────────┐ │
│ │ Mental Health Conditions    │ │
│ │ Wellness & Lifestyle        │ │
│ │ Work & Life                 │ │
│ │ Treatment & Therapy         │ │
│ │ ─────────────────────────── │ │
│ │ → Browse All Articles       │ │
│ └─────────────────────────────┘ │
│                                 │
│ Tools                        ▼  │
│ ┌─────────────────────────────┐ │
│ │ Clarity Score               │ │
│ │ Mood Journal                │ │
│ │ Sleep Architect             │ │
│ └─────────────────────────────┘ │
│                                 │
│ Find Providers                → │
│                                 │
│ Crisis Support             🆘  │
│                                 │
├─────────────────────────────────┤
│ [Dashboard]  (if authenticated) │
├─────────────────────────────────┤
│ [Sign In]        [Get Started]  │
└─────────────────────────────────┘
```

#### Implementation: MobileMenu.tsx Rewrite
```tsx
// src/components/layout/MobileMenu.tsx
const mobileMenuSections = [
  {
    name: 'Learn',
    expandable: true,
    items: [
      { name: 'Mental Health Conditions', path: '/learn/conditions' },
      { name: 'Wellness & Lifestyle', path: '/learn/wellness' },
      { name: 'Work & Life', path: '/learn/work-life' },
      { name: 'Treatment & Therapy', path: '/learn/treatment' },
    ],
    footer: { name: 'Browse All Articles', path: '/learn' }
  },
  {
    name: 'Tools',
    expandable: true,
    items: [
      { name: 'Clarity Score', path: '/tools/clarity-score' },
      { name: 'Mood Journal', path: '/tools/mood-journal' },
      { name: 'Sleep Architect', path: '/tools/sleep-architect' },
    ]
  },
  {
    name: 'Find Providers',
    expandable: false,
    path: '/providers'
  },
  {
    name: 'Crisis Support',
    expandable: false,
    path: '/crisis',
    highlight: true,
    icon: 'alert'
  }
];
```

### 2.3 Role-Based Navigation Adjustments

#### Navigation State by Role
```tsx
// src/hooks/useNavigation.ts
export function useNavigation() {
  const { user, isAuthenticated } = useAuth();

  const getDashboardConfig = () => {
    if (!isAuthenticated) return null;

    switch (user?.role) {
      case 'admin':
        return {
          path: '/admin',
          label: 'Admin Dashboard',
          sidebar: adminSidebarItems
        };
      case 'provider':
        return {
          path: '/provider',
          label: 'Provider Dashboard',
          sidebar: providerSidebarItems
        };
      case 'patient':
      default:
        return {
          path: '/dashboard',
          label: 'My Dashboard',
          sidebar: patientSidebarItems
        };
    }
  };

  return { getDashboardConfig };
}
```

#### Sidebar Item Configurations
```tsx
// src/config/sidebars.ts
export const patientSidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: History, label: 'Assessment History', path: '/dashboard/history' },
  { icon: Bookmark, label: 'Saved', path: '/dashboard/bookmarks' },
  { icon: Settings, label: 'Account Settings', path: '/dashboard/settings' },
];

export const providerSidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/provider' },
  { icon: Users, label: 'Patients', path: '/provider/patients' },
  { icon: BarChart3, label: 'Analytics', path: '/provider/analytics' },
  { icon: UserSquare2, label: 'Edit Public Profile', path: '/provider/edit-profile' },
  // REMOVED: Appointments and Settings (no routes exist)
];

export const adminSidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Users, label: 'Providers', path: '/admin/providers' },
  { icon: ShieldAlert, label: 'Audit Logs', path: '/admin/audit' },
  { icon: FileText, label: 'Reports', path: '/admin/reports' },
];
```

### 2.4 Breadcrumb Strategy

#### Route-to-Breadcrumb Mapping
```tsx
// src/config/breadcrumbs.ts
export const breadcrumbConfig: Record<string, BreadcrumbItem[]> = {
  // Learn section
  '/learn': [{ label: 'Learn' }],
  '/learn/:categorySlug': [
    { label: 'Learn', href: '/learn' },
    { label: ':categorySlug' } // Dynamic
  ],
  '/learn/:categorySlug/:slug': [
    { label: 'Learn', href: '/learn' },
    { label: ':categorySlug', href: '/learn/:categorySlug' },
    { label: ':title' } // From article data
  ],

  // Tools section
  '/tools': [{ label: 'Tools' }],
  '/tools/clarity-score': [
    { label: 'Tools', href: '/tools' },
    { label: 'Clarity Score' }
  ],
  '/tools/mood-journal': [
    { label: 'Tools', href: '/tools' },
    { label: 'Mood Journal' }
  ],

  // Dashboard sections
  '/dashboard': [{ label: 'Dashboard' }],
  '/dashboard/settings': [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Account Settings' }
  ],
  '/dashboard/bookmarks': [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Saved' }
  ],
  '/dashboard/history': [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Assessment History' }
  ],

  // Provider dashboard
  '/provider': [{ label: 'Provider Dashboard' }],
  '/provider/patients': [
    { label: 'Provider Dashboard', href: '/provider' },
    { label: 'Patients' }
  ],
  '/provider/analytics': [
    { label: 'Provider Dashboard', href: '/provider' },
    { label: 'Analytics' }
  ],
  '/provider/edit-profile': [
    { label: 'Provider Dashboard', href: '/provider' },
    { label: 'Edit Public Profile' }
  ],

  // Admin dashboard
  '/admin': [{ label: 'Admin Dashboard' }],
  '/admin/providers': [
    { label: 'Admin Dashboard', href: '/admin' },
    { label: 'Providers' }
  ],
  '/admin/providers/:id': [
    { label: 'Admin Dashboard', href: '/admin' },
    { label: 'Providers', href: '/admin/providers' },
    { label: ':name' } // Dynamic from provider data
  ],
};
```

#### Breadcrumb Hook Implementation
```tsx
// src/hooks/useBreadcrumbs.ts
export function useBreadcrumbs() {
  const location = useLocation();
  const params = useParams();

  const getBreadcrumbs = (pageData?: { title?: string; name?: string }) => {
    // Match current path to config
    const pattern = matchRoutePattern(location.pathname);
    const config = breadcrumbConfig[pattern];

    if (!config) return [];

    // Replace dynamic segments
    return config.map(item => ({
      ...item,
      label: replaceDynamicLabel(item.label, params, pageData),
      href: item.href ? replaceDynamicPath(item.href, params) : undefined
    }));
  };

  return { getBreadcrumbs };
}
```

#### Where to Add Breadcrumbs
```tsx
// All dashboard pages should include:
<Breadcrumbs items={getBreadcrumbs()} className="mb-6" />

// Specific files to modify:
// - src/pages/dashboard/UserDashboard.tsx
// - src/pages/dashboard/ProfileSettings.tsx (→ AccountSettings.tsx)
// - src/pages/dashboard/BookmarksPage.tsx
// - src/pages/dashboard/UserAssessmentHistory.tsx
// - src/pages/provider/ProviderDashboard.tsx
// - src/pages/provider/ProviderProfileEditor.tsx
// - src/pages/provider/ProviderAnalytics.tsx
// - src/pages/provider/ProviderPatients.tsx
// - src/pages/admin/AdminDashboard.tsx
// - src/pages/admin/ProviderManagement.tsx
// - src/pages/admin/ProviderDetailAdmin.tsx
// - src/pages/admin/AuditLogPage.tsx
// - src/pages/admin/ReportsPage.tsx
// - src/pages/learn/ArticlePage.tsx
// - src/pages/tools/ToolsLandingPage.tsx
```

---

## Phase 3: User Flow Optimization

### 3.1 Simplified Primary Journeys

#### Journey 1: Article Discovery (Optimized)
```
BEFORE: Home → Hover Platform → Hover Resources → Find topic → Click article
AFTER:  Home → Click Learn → Select topic → Click article

Changes:
1. "Learn" is direct nav link (no hover required)
2. Topic cards on Learn page are prominent
3. Mobile parity: same flow works identically
```

#### Journey 2: Assessment Flow (Optimized)
```
BEFORE: Home → Hover Platform → Clarity Score → Assessment → Results → ???
AFTER:  Home → Click Tools → Clarity Score → Assessment → Results → [Clear CTAs]

Changes on Results Page:
┌──────────────────────────────────────────────────────────────┐
│ Your Clarity Score: 78                                        │
│ ──────────────────────────────────────────────────────────── │
│                                                               │
│ [View Full History]  [Share Results]  [Download PDF]         │
│                                                               │
│ RECOMMENDED NEXT STEPS                                        │
│ ┌─────────────────────────────────────────────────────────┐  │
│ │ 📚 Read: Managing Cognitive Fatigue                     │  │
│ │ 📝 Try: Start a Mood Journal                            │  │
│ │ 🧑‍⚕️ Consider: Talk to a Provider                       │  │
│ └─────────────────────────────────────────────────────────┘  │
│                                                               │
│ [Take Another Assessment]                                     │
└──────────────────────────────────────────────────────────────┘
```

#### Journey 3: Provider Onboarding (Optimized)
```
BEFORE: Home → Company menu → Provider Registration → ??? (no clear path)
AFTER:  Footer "For Providers" → Register → Onboarding flow → Dashboard

Changes:
1. Add "For Providers" section to footer
2. Registration page includes progress indicator
3. Post-registration redirects to provider dashboard
4. Dashboard shows onboarding checklist
```

### 3.2 Dead-End Elimination

#### Current Dead-Ends to Fix

| Page | Problem | Solution |
|------|---------|----------|
| `/provider/appointments` | 404 | Remove link from sidebar |
| `/provider/settings` | 404 | Remove link from sidebar |
| Search (no results) | No guidance | Add "Try these popular searches" |
| 404 page | Generic | Add contextual suggestions based on URL |
| Assessment results | No next action | Add recommended next steps |
| Article end | Abrupt stop | Add related articles + CTA |

#### Implementation: Smart 404 Page
```tsx
// src/components/pages/NotFoundPage.tsx
const NotFoundPage: React.FC = () => {
  const location = useLocation();

  const getSuggestions = () => {
    const path = location.pathname;

    if (path.startsWith('/learn')) {
      return {
        title: "Looking for articles?",
        links: [
          { label: 'Browse All Articles', href: '/learn' },
          { label: 'Mental Health Topics', href: '/learn/conditions' },
        ]
      };
    }

    if (path.startsWith('/tools')) {
      return {
        title: "Looking for a tool?",
        links: [
          { label: 'Take Clarity Assessment', href: '/tools/clarity-score' },
          { label: 'All Tools', href: '/tools' },
        ]
      };
    }

    if (path.startsWith('/provider')) {
      return {
        title: "Provider area",
        links: [
          { label: 'Provider Dashboard', href: '/provider' },
          { label: 'Find a Provider', href: '/providers' },
        ]
      };
    }

    // Default suggestions
    return {
      title: "Here are some helpful links:",
      links: [
        { label: 'Home', href: '/' },
        { label: 'Browse Articles', href: '/learn' },
        { label: 'Mental Health Tools', href: '/tools' },
      ]
    };
  };

  const suggestions = getSuggestions();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>

        <div className="bg-gray-50 rounded-xl p-6 text-left">
          <h3 className="font-semibold mb-4">{suggestions.title}</h3>
          <ul className="space-y-2">
            {suggestions.links.map(link => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="flex items-center gap-2 text-teal-600 hover:underline"
                >
                  <ArrowRight size={14} />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
```

### 3.3 Cross-Linking Improvements

#### Article Page Cross-Links
```tsx
// Add to ArticlePage.tsx after article content
<RelatedContent
  currentArticleId={article.id}
  categorySlug={article.category}
  tags={article.tags}
/>

// RelatedContent component shows:
// - 2-3 related articles from same category
// - 1 article from different category with shared tag
// - 1 relevant tool (if applicable)
```

#### Tool Completion Cross-Links
```tsx
// After completing any tool, show:
<NextSteps
  completedTool="clarity-score"
  score={results.score}
  recommendations={[
    { type: 'article', href: '/learn/conditions/cognitive-fatigue', label: 'Understanding Cognitive Fatigue' },
    { type: 'tool', href: '/tools/mood-journal', label: 'Start Tracking Your Mood' },
    { type: 'action', href: '/providers', label: 'Find a Provider Near You' },
  ]}
/>
```

#### Dashboard Cross-Links
```tsx
// Patient Dashboard should show:
// - Quick access to last article read
// - Continue where you left off (incomplete assessment)
// - Suggested tools based on history

// Provider Dashboard should show:
// - Link to public profile preview
// - Link to provider directory (to see how they appear)
```

---

## Phase 4: Implementation Checklist

### Immediate Fixes (Day 1)

- [ ] **Fix provider dashboard path bug**
  - File: `src/components/layout/Navigation.tsx` line 79
  - Change: `/provider/dashboard` → `/provider`
  - File: `src/components/layout/MobileMenu.tsx` line 37
  - Change: `provider/dashboard` → `provider`

- [ ] **Remove non-existent provider routes**
  - File: `src/pages/provider/ProviderSidebar.tsx`
  - Remove: Lines referencing `/provider/appointments` and `/provider/settings`

- [ ] **Add RoleGuard to patient sub-routes**
  - File: `src/App.tsx` lines 187-201
  - Add: `<RoleGuard allowedRoles={['patient', 'admin']}>` wrapper

### Navigation Config (Day 1-2)

- [ ] Create `src/config/navigation.ts` with menu structure
- [ ] Create `src/config/sidebars.ts` with sidebar items per role
- [ ] Create `src/config/breadcrumbs.ts` with route mappings
- [ ] Create `src/hooks/useNavigation.ts` for role-based nav
- [ ] Create `src/hooks/useBreadcrumbs.ts` for breadcrumb generation

### Component Updates (Day 2-3)

- [ ] Refactor `Navigation.tsx` to use config
- [ ] Rewrite `MobileMenu.tsx` with accordion sections
- [ ] Refactor `NavMenu.tsx` to use config
- [ ] Update `UserSidebar.tsx` with new labels
- [ ] Update `ProviderSidebar.tsx` (remove broken links, new labels)
- [ ] Update `AdminSidebar.tsx` with new labels

### Add Breadcrumbs (Day 3)

- [ ] Add to `UserDashboard.tsx`
- [ ] Add to `ProfileSettings.tsx` (rename to `AccountSettings.tsx`)
- [ ] Add to `BookmarksPage.tsx`
- [ ] Add to `UserAssessmentHistory.tsx`
- [ ] Add to `ProviderDashboard.tsx`
- [ ] Add to `ProviderProfileEditor.tsx`
- [ ] Add to `ProviderAnalytics.tsx`
- [ ] Add to `ProviderPatients.tsx`
- [ ] Add to `AdminDashboard.tsx`
- [ ] Add to `ProviderManagement.tsx`
- [ ] Add to `AuditLogPage.tsx`
- [ ] Add to `ReportsPage.tsx`
- [ ] Add to `ArticlePage.tsx`

### Route Cleanup (Day 3-4)

- [ ] Add redirect routes for old URLs in `App.tsx`
- [ ] Rename `/dashboard/profile` → `/dashboard/settings`
- [ ] Rename `/dashboard/assessments` → `/dashboard/history`
- [ ] Update all internal links to use new paths

### Flow Improvements (Day 4)

- [ ] Update `NotFoundPage.tsx` with contextual suggestions
- [ ] Add `RelatedContent` component to article pages
- [ ] Add `NextSteps` component to tool completion pages
- [ ] Add empty state components where missing

---

## File Change Summary

### New Files to Create
```
src/config/navigation.ts
src/config/sidebars.ts
src/config/breadcrumbs.ts
src/hooks/useNavigation.ts
src/hooks/useBreadcrumbs.ts
src/components/content/RelatedContent.tsx
src/components/content/NextSteps.tsx
```

### Files to Modify
```
src/App.tsx                              # Route changes, redirects, guards
src/components/layout/Navigation.tsx     # Config-based rendering
src/components/layout/MobileMenu.tsx     # Full rewrite with accordions
src/components/layout/NavMenu.tsx        # Config-based rendering
src/components/layout/Footer.tsx         # Add "For Providers" section
src/pages/dashboard/UserSidebar.tsx      # New labels
src/pages/provider/ProviderSidebar.tsx   # Remove broken links
src/pages/admin/AdminSidebar.tsx         # New labels
src/components/pages/NotFoundPage.tsx    # Contextual suggestions
```

### Files to Rename
```
src/pages/dashboard/ProfileSettings.tsx  → AccountSettings.tsx
src/pages/dashboard/UserAssessmentHistory.tsx → AssessmentHistory.tsx
```

---

## Success Metrics

After implementation, verify:

1. **Zero 404s from internal links** - All sidebar/nav links resolve
2. **Mobile parity** - Every desktop nav item accessible on mobile
3. **Breadcrumbs on all dashboard pages** - User always knows location
4. **No dead-ends** - Every page has clear next action
5. **Consistent terminology** - Same labels across all touchpoints
6. **< 3 clicks to any primary action** - From homepage to tool/article/provider

---

## Testing Plan

```bash
# Manual smoke test checklist
1. Desktop: Click every mega-menu item → verify no 404
2. Mobile: Navigate every accordion item → verify no 404
3. Login as patient → verify sidebar links work
4. Login as provider → verify sidebar links work
5. Login as admin → verify sidebar links work
6. Complete assessment → verify next steps appear
7. Read article → verify related content appears
8. Navigate to fake URL → verify helpful 404
9. Check breadcrumbs on 5 random pages → verify accuracy
```
