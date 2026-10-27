import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	ensureShape,
	isList,
	isNumber,
	isOneOf,
	isRecord,
	isString,
	listOf,
	orNull,
	shapeOf,
} from './guards.ts';

describe('shapeOf', () => {
	const isUser = shapeOf<{ id: number; login: string }>({ id: isNumber, login: isString });

	it('should accept an object whose fields pass their guards', () => {
		assert.equal(isUser({ id: 1, login: 'example-user', extra: true }), true);
	});

	it('should refuse an object with a missing or wrong field', () => {
		assert.equal(isUser({ id: 1 }), false);
		assert.equal(isUser({ id: '1', login: 'example-user' }), false);
	});

	it('should refuse a value that is not an object', () => {
		assert.equal(isUser(null), false);
		assert.equal(isUser('example-user'), false);
		assert.equal(isUser([1, 'example-user']), false);
	});
});

describe('listOf', () => {
	it('should accept an array whose items all pass the guard', () => {
		assert.equal(listOf(isString)(['a', 'b']), true);
		assert.equal(listOf(isString)([]), true);
	});

	it('should refuse an array with a wrong item, or a value that is not an array', () => {
		assert.equal(listOf(isString)(['a', 1]), false);
		assert.equal(listOf(isString)({ 0: 'a' }), false);
	});
});

describe('orNull', () => {
	it('should accept null or a value that passes the guard', () => {
		assert.equal(orNull(isString)(null), true);
		assert.equal(orNull(isString)('a'), true);
		assert.equal(orNull(isString)(undefined), false);
	});
});

describe('isOneOf', () => {
	it('should accept only the listed values', () => {
		const isState = isOneOf(['open', 'closed']);

		assert.equal(isState('open'), true);
		assert.equal(isState('merged'), false);
	});
});

describe('isRecord', () => {
	it('should accept objects but not arrays or null', () => {
		assert.equal(isRecord({}), true);
		assert.equal(isRecord([]), false);
		assert.equal(isRecord(null), false);
	});
});

describe('isList', () => {
	it('should accept any array', () => {
		assert.equal(isList([1, 'a']), true);
		assert.equal(isList({ length: 0 }), false);
	});
});

describe('ensureShape', () => {
	it('should return a value accepted by the guard', () => {
		assert.equal(ensureShape('a', isString, 'GET /x'), 'a');
	});

	it('should throw with the request line when the guard refuses the value', () => {
		assert.throws(() => ensureShape(1, isString, 'GET /x'), /Unexpected response from GET \/x\./);
	});
});
