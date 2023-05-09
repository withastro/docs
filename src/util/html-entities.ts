import { unescape as unEsc } from 'html-escaper';
export { escape } from 'html-escaper';

/** Unescape HTML while catering for `&#x3C;` (`<`) and `'&#x26;'` (`&`), which the Astro compiler outputs. */
export function unescape(str: string) {
	return unEsc(str).replaceAll('&#x3C;', '<').replaceAll('&#x26;', '&');
}
