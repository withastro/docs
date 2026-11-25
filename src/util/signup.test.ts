import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { linkIntent } from './intent';
import { showsSiteKeyCta, signupEventClasses, signupHref, signupSource } from './signup';

describe('showsSiteKeyCta', () => {
	it('is shown on integration pages in every locale', () => {
		for (const path of [
			'/en/basics/',
			'/en/basics/client-side-rendering/',
			'/de/framework-integrations/react-integration/',
			'/en/wordpress-plugin/contact-form-7/',
			'/en/basics/demo-keys/',
			'/en/integrations/qualtrics/',
		]) {
			assert.equal(showsSiteKeyCta(path), true, path);
		}
	});

	it('is not shown on reference and portal pages', () => {
		for (const path of [
			'/en/basics/faq/',
			'/en/advanced/api/',
			'/en/portal/sites/',
			'/en/welcome/',
		]) {
			assert.equal(showsSiteKeyCta(path), false, path);
		}
	});
});

describe('signupSource', () => {
	it('attributes WordPress plugin pages separately', () => {
		assert.equal(signupSource('/en/wordpress-plugin/'), 'docs-wordpress');
		assert.equal(signupSource('/fr/wordpress-plugin/elementor-pro/'), 'docs-wordpress');
	});

	it('attributes every other page to docs', () => {
		assert.equal(signupSource('/en/basics/client-side-rendering/'), 'docs');
	});
});

describe('signupHref', () => {
	it('carries the source, page and placement', () => {
		const url = new URL(signupHref('/de/basics/client-side-rendering/', 'inline'));
		assert.equal(`${url.origin}${url.pathname}`, 'https://prosopo.io/register/');
		assert.equal(url.searchParams.get('source'), 'docs');
		assert.equal(url.searchParams.get('cta'), 'docs-inline-basics-client-side-rendering');
	});

	it('sends WordPress readers with source=docs-wordpress', () => {
		const url = new URL(signupHref('/en/wordpress-plugin/divi/', 'sidebar'));
		assert.equal(url.searchParams.get('source'), 'docs-wordpress');
		assert.equal(url.searchParams.get('cta'), 'docs-sidebar-wordpress-plugin-divi');
	});

	it('never carries UTM tags, which would replace the visit source', () => {
		const url = new URL(signupHref('/en/basics/demo-keys/', 'production'));
		assert.deepEqual(
			[...url.searchParams.keys()].filter((key: string): boolean => key.startsWith('utm_')),
			[]
		);
	});

	it('is tagged as a signup link', () => {
		assert.match(linkIntent(signupHref('/en/basics/', 'inline')), /^signup:1$/);
	});
});

describe('signupEventClasses', () => {
	it('names one Plausible event and records the placement as a property', () => {
		assert.equal(
			signupEventClasses('production'),
			'plausible-event-name=Docs+Get+Site+Key plausible-event-placement=production'
		);
	});
});
