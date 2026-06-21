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
import { psychoticDeep } from './02-psychotic';
import { catatoniaDeep } from './03-catatonia';
import { moodDeep } from './04-mood';
import { anxietyDeep } from './05-anxiety';
import { ocdDeep } from './06-ocd';
import { stressDeep } from './07-stress';
import { dissociativeDeep } from './08-dissociative';
import { eatingDeep } from './09-eating';
import { eliminationDeep } from './10-elimination';

export const conditionDeepContent: ConditionDeepMap = {
    ...neurodevelopmentalDeep,
    ...psychoticDeep,
    ...catatoniaDeep,
    ...moodDeep,
    ...anxietyDeep,
    ...ocdDeep,
    ...stressDeep,
    ...dissociativeDeep,
    ...eatingDeep,
    ...eliminationDeep,
};

/** Slugs that have authored deep content (for progress tracking / audits). */
export const deepAuthoredSlugs = Object.keys(conditionDeepContent);
