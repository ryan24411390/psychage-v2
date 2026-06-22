import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRight,
    BrainCircuit,
    Compass,
    HeartHandshake,
    Moon,
    PenTool,
    Search,
    Sparkles,
    Users,
    type LucideIcon,
} from 'lucide-react';
import { ArticleRowCard, ArticleRowCardSkeleton } from '@/components/mobile/cards/ArticleRowCard';
import { CategoryCard, CategoryCardSkeleton } from '@/components/mobile/cards/CategoryCard';
import { MobileHomeHero, MobileHomeHeroSkeleton } from '@/components/mobile/screens/MobileHomeHero';
import { getRecentlyReadIds } from '@/components/articles/recentlyRead';
import { useAuth } from '@/context/AuthContext';
import { useCategoryData } from '@/hooks/useCategoryData';
import { useHomepageArticles } from '@/hooks/useHomepageArticles';
import { articleService } from '@/services/articleService';
import { tools } from '@/data/tools';
import { resolveToolkitRef } from '@/lib/toolkitRegistry';
import type { CategoryWithCount } from '@/config/taxonomy';
import type { Article } from '@/types/models';

/**
 * Mobile Home (route `/`). A rich, mobile-native hub that pulls most of the
 * desktop home's value: an always-present welcome band, a curated 16:9 Featured
 * hero, a prominent Browse entry, a Tools preview, a Find Care entry, a fixed
 * set of curated topic collections, and editorial rails (Recommended +
 * Continue Reading).
 *
 * Foundation wraps this screen in the crisis header + bottom nav, so we render
 * only the scroll body and own the `px-4 py-6` padding. Shared cards + skeletons,
 * the homepage/category hooks, the article/recently-read services, the canonical
 * `tools` registry, and the toolkit route resolver are all CONSUMED here, never
 * duplicated.
 */

const CONTINUE_READING_LIMIT = 4;
const EDITORS_PICK_LIMIT = 6;

/**
 * Curated topic collections — a FIXED set (not personalized). Canonical slugs
 * from `src/config/taxonomy.ts`; resolved at render via `useCategoryData().bySlug`
 * so legacy slugs and live article counts come from the single source of truth.
 * Cards degrade calmly when a poster is absent.
 */
const CURATED_COLLECTION_SLUGS = [
    'anxiety-stress',
    'depression-grief',
    'sleep-body-connection',
    'relationships-communication',
    'trauma-healing',
    'emotional-regulation',
] as const;

/** Lucide components for the curated tools' registry `iconName` strings. */
const TOOL_ICONS: Record<string, LucideIcon> = {
    BrainCircuit,
    PenTool,
    Moon,
    HeartHandshake,
};

/**
 * Tools preview — a few key tools + a "See all" entry. Display text comes from
 * the canonical `tools` registry (by `id`); routes from the canonical toolkit
 * resolver (`tool:<slug>`). A preview, not a rebuild of the desktop bento.
 */
const FEATURED_TOOL_CARDS = (
    [
        { id: 1, slug: 'clarity-score' },
        { id: 2, slug: 'mood-journal' },
        { id: 3, slug: 'sleep-architect' },
        { id: 11, slug: 'relationship-health' },
    ] as const
)
    .map((ft) => {
        const tool = tools.find((t) => t.id === ft.id);
        const { href, available } = resolveToolkitRef(`tool:${ft.slug}`);
        if (!tool || !available || !href) return null;
        return {
            id: ft.id,
            name: tool.name,
            description: tool.description,
            href,
            Icon: TOOL_ICONS[tool.iconName] ?? BrainCircuit,
        };
    })
    .filter((t): t is NonNullable<typeof t> => t !== null);

const MobileHome: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Curated hero + category-diversified rail (shared with desktop ContentWorld).
    const { hero, rest, isLoading: articlesLoading } = useHomepageArticles(EDITORS_PICK_LIMIT);
    // Resolve the fixed curated collection slugs (legacy-aware).
    const { bySlug, isLoading: categoriesLoading } = useCategoryData();

    // Separate pool for Continue Reading — resolve recently-read IDs locally.
    const [pool, setPool] = useState<Article[]>([]);
    useEffect(() => {
        let cancelled = false;
        articleService
            .getAll()
            .then((articles) => {
                if (!cancelled) setPool(articles);
            })
            .catch((err) => {
                console.warn('[MobileHome] Failed to fetch articles:', err);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const firstName = user?.display_name?.trim().split(/\s+/)[0];
    const greeting = firstName ? `Welcome back, ${firstName}.` : 'Welcome to Psychage.';

    // Static curated collections — fixed slug list resolved to live categories.
    const collections = useMemo<CategoryWithCount[]>(
        () =>
            CURATED_COLLECTION_SLUGS.map((slug) => bySlug(slug)).filter(
                (c): c is CategoryWithCount => !!c,
            ),
        [bySlug],
    );

    // Continue Reading — resolve recently-read IDs against the pool, newest first.
    const continueReading = useMemo(() => {
        const entries = getRecentlyReadIds();
        if (entries.length === 0 || pool.length === 0) return [];
        const idSet = new Set(entries.map((e) => String(e.id)));
        const orderMap = new Map(entries.map((e, i) => [String(e.id), i]));
        return pool
            .filter((a) => idSet.has(String(a.id)))
            .sort((a, b) => (orderMap.get(String(a.id)) ?? 99) - (orderMap.get(String(b.id)) ?? 99))
            .slice(0, CONTINUE_READING_LIMIT);
    }, [pool]);

    const openHero = () => {
        if (!hero) return;
        const categorySlug = hero.category?.slug;
        navigate(categorySlug ? `/learn/${categorySlug}/${hero.slug}` : '/learn');
    };

    return (
        <div className="px-4 py-6">
            {/* Welcome / intro band — always present, orienting, non-diagnostic */}
            <section>
                <h1 className="font-display text-2xl font-semibold text-text-primary">{greeting}</h1>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    A calm place to understand mental health — clear, evidence-based articles, gentle
                    self-guided tools, and a directory of care. New here? Start by browsing topics or
                    exploring what you&rsquo;re feeling.
                </p>
            </section>

            {/* Featured hero — the primary richness element (16:9 → reader) */}
            {articlesLoading ? (
                <MobileHomeHeroSkeleton className="mt-6" />
            ) : hero ? (
                <MobileHomeHero className="mt-6" article={hero} onClick={openHero} />
            ) : null}

            {/* Primary entry — Browse all topics */}
            <button
                type="button"
                onClick={() => navigate('/learn')}
                className="mt-6 flex min-h-[44px] w-full items-center gap-3 rounded-2xl bg-primary px-4 py-4 text-left text-white transition-colors duration-200 hover:bg-primary-hover active:bg-primary-hover"
            >
                <Compass className="h-6 w-6 shrink-0" aria-hidden />
                <span className="flex min-w-0 flex-1 flex-col">
                    <span className="font-display text-base font-semibold leading-snug">
                        Browse all topics
                    </span>
                    <span className="text-xs text-white/80">Explore the full library</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0" aria-hidden />
            </button>

            {/* Search entry */}
            <button
                type="button"
                onClick={() => navigate('/search')}
                className="mt-3 flex min-h-[44px] w-full items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-left transition-colors duration-200 hover:bg-surface-hover active:bg-surface-hover"
            >
                <Search className="h-5 w-5 shrink-0 text-text-tertiary" aria-hidden />
                <span className="text-sm text-text-tertiary">Search articles…</span>
            </button>

            {/* Symptom Navigator CTA — calm, non-diagnostic, no mascot */}
            <button
                type="button"
                onClick={() => navigate('/tools/symptom-navigator')}
                className="mt-3 flex min-h-[44px] w-full items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-4 text-left transition-colors duration-200 hover:bg-surface-hover active:bg-surface-hover"
            >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                    <Sparkles className="h-5 w-5" aria-hidden />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                    <span className="font-display text-base font-semibold leading-snug text-text-primary">
                        Not sure where to start?
                    </span>
                    <span className="text-xs text-text-secondary">
                        Explore what you&rsquo;re feeling with the Symptom Navigator.
                    </span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-text-tertiary" aria-hidden />
            </button>

            {/* Tools — a preview of a few key tools + an entry to all of them */}
            {FEATURED_TOOL_CARDS.length > 0 && (
                <section className="mt-8">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-xs font-medium uppercase tracking-wide text-text-tertiary">
                            Tools
                        </h2>
                        <button
                            type="button"
                            onClick={() => navigate('/tools')}
                            className="flex items-center gap-1 text-xs font-medium text-teal-600 transition-colors duration-200 hover:text-teal-700 dark:text-teal-400"
                        >
                            See all tools
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {FEATURED_TOOL_CARDS.map((tool) => (
                            <button
                                key={tool.id}
                                type="button"
                                onClick={() => navigate(tool.href)}
                                className="flex min-h-[44px] flex-col gap-2 rounded-xl border border-border bg-surface p-3 text-left transition-colors duration-200 hover:bg-surface-hover active:bg-surface-hover"
                            >
                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                                    <tool.Icon className="h-5 w-5" aria-hidden />
                                </span>
                                <span className="font-display text-sm font-semibold leading-snug text-text-primary">
                                    {tool.name}
                                </span>
                                <span className="text-xs text-text-secondary line-clamp-2">
                                    {tool.description}
                                </span>
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* Find Care entry */}
            <button
                type="button"
                onClick={() => navigate('/providers')}
                className="mt-8 flex min-h-[44px] w-full items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-4 text-left transition-colors duration-200 hover:bg-surface-hover active:bg-surface-hover"
            >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                    <Users className="h-5 w-5" aria-hidden />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                    <span className="font-display text-base font-semibold leading-snug text-text-primary">
                        Find Care
                    </span>
                    <span className="text-xs text-text-secondary">
                        Browse licensed therapists and psychiatrists near you.
                    </span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-text-tertiary" aria-hidden />
            </button>

            {/* Curated topic collections — fixed set, poster-backed category cards */}
            {categoriesLoading ? (
                <section className="mt-8">
                    <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-text-tertiary">
                        Topic collections
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {Array.from({ length: CURATED_COLLECTION_SLUGS.length }).map((_, i) => (
                            <CategoryCardSkeleton key={i} />
                        ))}
                    </div>
                </section>
            ) : collections.length > 0 ? (
                <section className="mt-8">
                    <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-text-tertiary">
                        Topic collections
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {collections.map((category) => (
                            <CategoryCard key={category.slug} category={category} />
                        ))}
                    </div>
                </section>
            ) : null}

            {/* Recommended — category-diversified rail */}
            {articlesLoading ? (
                <section className="mt-8">
                    <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-text-tertiary">
                        Recommended
                    </h2>
                    <div className="flex flex-col gap-1">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <ArticleRowCardSkeleton key={i} />
                        ))}
                    </div>
                </section>
            ) : rest.length > 0 ? (
                <section className="mt-8">
                    <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-text-tertiary">
                        Recommended
                    </h2>
                    <div className="flex flex-col gap-1">
                        {rest.map((article) => (
                            <ArticleRowCard key={article.id} article={article} />
                        ))}
                    </div>
                </section>
            ) : null}

            {/* Continue Reading — personalized, shown only when there's history */}
            {continueReading.length > 0 && (
                <section className="mt-8">
                    <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-text-tertiary">
                        Continue reading
                    </h2>
                    <div className="flex flex-col gap-1">
                        {continueReading.map((article) => (
                            <ArticleRowCard key={article.id} article={article} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default MobileHome;
