import type keys from '../content/nav/en';

type NavKey = keyof typeof keys;

/**
 * Type helper for creating a dictionary of translations of sidebar labels.
 *
 * @example
 * // src/content/nav/fr.ts
 * import { navDictionary } from '../../util/navDictionary';
 *
 * export default navDictionary({
 * 	start: 'Démarrer',
 * 	// ...
 * });
 */
export const navDictionary = (dict: Partial<Record<NavKey, string>>) => dict;
