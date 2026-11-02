import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { filterAsync } from './filter-async.ts';

describe('filterAsync', () => {
	it('should keep the items the predicate accepts, in their order', async () => {
		const evenNumbers = await filterAsync([1, 2, 3, 4], async (number) => number % 2 === 0);

		assert.deepEqual(evenNumbers, [2, 4]);
	});
});
