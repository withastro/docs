import kleur from 'kleur';
import core from '@actions/core';
import dedent from 'dedent-js';

export const isCi = process.env.CI;

export function debug (message, ...params) {
	console.log(message, ...params);
}

export function warning (message, ...params) {
	if (isCi) {
		core.warning(message, ...params);
	}
	else {
		console.warn(kleur.yellow().bold(`*** WARNING: ${message}`), ...params);
	}
}

export function error (message, ...params) {
	if (isCi) {
		core.error(message, ...params);
	}
	else {
		console.error(kleur.red().bold(`*** ERROR: ${message}`), ...params);
	}
}

/**
 * Dedents the given markdown and replaces single newlines with spaces,
 * while leaving new paragraphs intact.
 */
export function dedentMd (...markdown) {
	return dedent(...markdown).replace(/(\S)\n(?!\n)/g, '$1 ');
}

export default {
	debug,
	warning,
	error,
	dedentMd,
	isCi,
};
