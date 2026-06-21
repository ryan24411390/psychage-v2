/**
 * Merged "in depth" content for the conditions reference, keyed by slug.
 *
 * Each ICD-11 family is authored in its own file and merged here. The seeder
 * (src/scripts/seedConditionDeep.ts) reads this map and upserts the fuller core fields,
 * deep_sections, and sources into conditions_reference. Add a family file + spread it in
 * below as it is authored.
 */

import type { ConditionDeepMap } from './types';
import { neurodevelopmentalDeep } from './01-neurodevelopmental';

export const conditionDeepContent: ConditionDeepMap = {
    ...neurodevelopmentalDeep,
};

/** Slugs that have authored deep content (for progress tracking / audits). */
export const deepAuthoredSlugs = Object.keys(conditionDeepContent);
