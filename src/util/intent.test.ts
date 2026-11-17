import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { Element, Root } from 'hast';
import { tagIntentLinks } from '../../plugins/rehype-intent-links';
import intentRules from '../intentRules.json';
import {
	docsIntent,
	formatIntent,
	intentForPath,
	type IntentRule,
	linkIntent,
	validateIntent,
} from './intent';

const rules: IntentRule[] = [
	{ prefix: '/', intent: { developer: 0.5 } },
	{ prefix: '/basics', intent: { implementing: 0.8 } },
	{ prefix: '/basics/server-side-verification', intent: { implementing: 1, developer: 0 } },
];

describe('validateIntent', () => {
	it('accepts known tags with weights in range', () => {
		assert.deepEqual(validateIntent({ buying: 1, developer: 0 }), { buying: 1, developer: 0 });
	});

	it('rejects unknown tags', () => {
		assert.throws(() => validateIntent({ 'not-a-tag': 1 }), /Unknown intent tag/);
	});

	it('rejects weights outside 0..1', () => {
		assert.throws(() => validateIntent({ buying: 1.5 }), /between 0 and 1/);
		assert.throws(() => validateIntent({ buying: Number.NaN }), /between 0 and 1/);
	});

	it('accepts every shipped rule', () => {
		for (const rule of intentRules) {
			assert.doesNotThrow(() => validateIntent(rule.intent), rule.prefix);
		}
	});
});

describe('intentForPath', () => {
	it('layers rules broadest first and drops zero weights', () => {
		assert.deepEqual(intentForPath(rules, '/basics/server-side-verification/'), {
			implementing: 1,
		});
	});

	it('matches whole path segments only', () => {
		assert.deepEqual(intentForPath(rules, '/basicsx'), { developer: 0.5 });
	});

	it('ignores the locale prefix', () => {
		assert.deepEqual(intentForPath(rules, '/es/basics/'), intentForPath(rules, '/basics/'));
	});

	it('lets the page override its section', () => {
		assert.deepEqual(intentForPath(rules, '/basics/', { implementing: 0.2 }), {
			developer: 0.5,
			implementing: 0.2,
		});
	});
});

describe('formatIntent', () => {
	it('sorts heaviest first then by name, rounding to 2 places', () => {
		assert.equal(
			formatIntent({ developer: 0.5, buying: 0.5, pricing: 0.987 }),
			'pricing:0.99, buying:0.5, developer:0.5'
		);
	});

	it('is empty for no tags', () => {
		assert.equal(formatIntent({}), '');
	});
});

describe('docsIntent', () => {
	it('tags every page from the shipped rules', () => {
		assert.match(docsIntent('/en/basics/captcha-types/'), /implementing:/);
		assert.notEqual(docsIntent('/'), '');
	});
});

describe('linkIntent', () => {
	it('tags pricing, sales and sign-up links', () => {
		assert.match(linkIntent('https://prosopo.io/pricing/'), /buying:1/);
		assert.match(linkIntent('https://www.prosopo.io/contact'), /contact-sales:1/);
		assert.match(linkIntent('https://portal.prosopo.io/register'), /signup:0.9/);
		assert.match(linkIntent('https://calendly.com/prosopo/call'), /demo-request/);
	});

	it('is empty for other or relative links', () => {
		assert.equal(linkIntent('https://example.com/pricing'), '');
		assert.equal(linkIntent('https://prosopo.io/pricingx'), '');
		assert.equal(linkIntent('/basics/'), '');
	});
});

describe('tagIntentLinks', () => {
	const link = (href: string): Element => ({
		type: 'element',
		tagName: 'a',
		properties: { href },
		children: [],
	});

	it('adds data-intent only to links that say something', () => {
		const pricing = link('https://prosopo.io/pricing');
		const other = link('https://example.com');
		const tree: Root = { type: 'root', children: [pricing, other] };
		tagIntentLinks(tree);
		assert.match(String(pricing.properties.dataIntent), /buying:1/);
		assert.equal(other.properties.dataIntent, undefined);
	});
});
