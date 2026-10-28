import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import * as shape from './shape.ts';

const userShape = shape.object({ id: shape.number, login: shape.string });

describe('object', () => {
	it('should return a copy with only the fields of the shape', () => {
		const user = { id: 1, login: 'example-user', node_id: 'U_1' };

		const parsed = userShape(user, '');

		assert.deepEqual(parsed, { id: 1, login: 'example-user' });
		assert.notEqual(parsed, user);
	});

	it('should copy nested objects with only their fields', () => {
		const pullRequestShape = shape.object({ user: userShape });

		const parsed = pullRequestShape({ user: { id: 1, login: 'example-user', extra: true } }, '');

		assert.deepEqual(parsed, { user: { id: 1, login: 'example-user' } });
	});

	it('should name a missing or wrong field', () => {
		assert.throws(
			() => userShape({ id: 1 }, ''),
			/^Error: `login` should be a string, got undefined\.$/
		);
		assert.throws(
			() => userShape({ id: '1', login: 'example-user' }, ''),
			/`id` should be a number, got string/
		);
	});

	it('should name a nested field with its path', () => {
		const pullRequestShape = shape.object({ head: shape.object({ repo: userShape }) });

		assert.throws(
			() => pullRequestShape({ head: { repo: { id: 1, login: 2 } } }, ''),
			/`head\.repo\.login` should be a string, got number/
		);
	});

	it('should refuse a value that is not an object', () => {
		assert.throws(() => userShape(null, ''), /the body should be an object, got null/);
		assert.throws(() => userShape([1, 'example-user'], ''), /should be an object, got an array/);
	});
});

describe('list', () => {
	it('should parse each item', () => {
		const parsed = shape.list(userShape)([{ id: 1, login: 'a', extra: true }], '');

		assert.deepEqual(parsed, [{ id: 1, login: 'a' }]);
	});

	it('should name the item that does not match', () => {
		assert.throws(
			() => shape.list(shape.string)(['a', 1], 'labels'),
			/`labels\[1\]` should be a string, got number/
		);
	});

	it('should refuse a value that is not a list', () => {
		assert.throws(() => shape.list(shape.string)({ 0: 'a' }, ''), /should be a list, got object/);
	});
});

describe('nullable', () => {
	it('should accept null or a value of the shape', () => {
		assert.equal(shape.nullable(shape.string)(null, ''), null);
		assert.equal(shape.nullable(shape.string)('a', ''), 'a');
		assert.throws(
			() => shape.nullable(shape.string)(undefined, 'body'),
			/`body` should be a string/
		);
	});
});

describe('oneOf', () => {
	it('should accept only the listed values', () => {
		const stateShape = shape.oneOf(['open', 'closed']);

		assert.equal(stateShape('open', ''), 'open');
		assert.throws(() => stateShape('merged', 'state'), /`state` should be one of open, closed/);
	});
});

describe('boolean', () => {
	it('should accept only a boolean', () => {
		assert.equal(shape.boolean(false, ''), false);
		assert.throws(() => shape.boolean('false', 'draft'), /`draft` should be a boolean/);
	});
});

describe('unknown', () => {
	it('should accept any value', () => {
		assert.deepEqual(shape.list(shape.unknown)([1, 'a', null], ''), [1, 'a', null]);
	});
});

describe('isRecord', () => {
	it('should accept objects but not arrays or null', () => {
		assert.equal(shape.isRecord({}), true);
		assert.equal(shape.isRecord([]), false);
		assert.equal(shape.isRecord(null), false);
	});
});

describe('parseResponse', () => {
	it('should return the parsed value', () => {
		assert.deepEqual(shape.parseResponse({ id: 1, login: 'a', extra: 1 }, userShape, 'GET /x'), {
			id: 1,
			login: 'a',
		});
	});

	it('should throw with the request line and the field', () => {
		assert.throws(
			() => shape.parseResponse({ id: 1 }, userShape, 'GET /x'),
			/^Error: Unexpected response from GET \/x: `login` should be a string, got undefined\.$/
		);
	});
});
