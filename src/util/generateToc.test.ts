import { describe, expect, test } from 'vitest';
import generateToc from './generateToc';
const overview = { depth: 2, slug: 'overview', text: 'Overview', children: [] };
describe('generateToc', () => {
	test('should include a default overview heading', () => {
		expect(generateToc([])).toEqual([overview]);
	});
	test('should pass when heading 2 comes before heading 3', () => {
		const toc = generateToc([
			{
				slug: 'heading 2',
				text: 'heading 2',
				depth: 2,
			},
			{
				slug: 'heading 3',
				text: 'heading 3',
				depth: 3,
			},
		]);
		expect(toc).toEqual([
			overview,
			{
				slug: 'heading 2',
				text: 'heading 2',
				depth: 2,
				children: [
					{
						slug: 'heading 3',
						text: 'heading 3',
						depth: 3,
						children: [],
					},
				],
			},
		]);
	});

	test('should pass when heading 2 comes before heading 2', () => {
		const toc = generateToc([
			{
				slug: 'heading 2',
				text: 'heading 2',
				depth: 2,
			},
			{
				slug: 'heading 3',
				text: 'heading 3',
				depth: 3,
			},
			{
				slug: 'heading 2',
				text: 'heading 2',
				depth: 2,
			},
		]);
		expect(toc).toEqual([
			overview,
			{
				slug: 'heading 2',
				text: 'heading 2',
				depth: 2,
				children: [
					{
						slug: 'heading 3',
						text: 'heading 3',
						depth: 3,
						children: [],
					},
				],
			},
			{
				slug: 'heading 2',
				text: 'heading 2',
				depth: 2,
				children: [],
			},
		]);
	});
});
