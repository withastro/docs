/** A function telling whether a value is of type `T`. */
export type Guard<T> = (value: unknown) => value is T;

/**
 * The guards for each field of `T`. A guard for an optional field must accept `undefined`.
 *
 * @template T - The object type the guards check.
 */
type FieldGuards<T> = { [K in keyof T]-?: Guard<T[K]> };

/** Tells whether a value is a string. */
export function isString(value: unknown): value is string {
	return typeof value === 'string';
}

/** Tells whether a value is a number. */
export function isNumber(value: unknown): value is number {
	return typeof value === 'number';
}

/** Tells whether a value is a boolean. */
export function isBoolean(value: unknown): value is boolean {
	return typeof value === 'boolean';
}

/** Tells whether a value is an object that is not an array, whatever its fields. */
export function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Tells whether a value is an array, whatever its items. */
export function isList(value: unknown): value is unknown[] {
	return Array.isArray(value);
}

/**
 * Creates a guard accepting only the given values.
 *
 * @param {readonly T[]} values - The accepted values.
 * @returns {Guard<T>} The guard.
 */
export function isOneOf<const T extends string>(values: readonly T[]): Guard<T> {
	return (value): value is T => values.some((accepted) => accepted === value);
}

/**
 * Creates a guard accepting `null` or a value accepted by `guard`.
 *
 * @param {Guard<T>} guard - The guard for the value when it is not `null`.
 * @returns {Guard<T | null>} The guard.
 */
export function orNull<T>(guard: Guard<T>): Guard<T | null> {
	return (value): value is T | null => value === null || guard(value);
}

/**
 * Creates a guard accepting an array whose items are all accepted by `guard`.
 *
 * @param {Guard<T>} guard - The guard for each item.
 * @returns {Guard<T[]>} The guard.
 */
export function listOf<T>(guard: Guard<T>): Guard<T[]> {
	return (value): value is T[] => Array.isArray(value) && value.every(guard);
}

/**
 * Creates a guard accepting an object whose fields are accepted by their guards.
 *
 * Fields of the value that have no guard are left unchecked.
 *
 * @param {FieldGuards<T>} fieldGuards - A guard for each field of `T`.
 * @returns {Guard<T>} The guard.
 * @example
 * ```ts
 * const isUser = shapeOf<{ login: string; name: string | null }>({
 * 	login: isString,
 * 	name: orNull(isString),
 * });
 * ```
 */
export function shapeOf<T extends object>(fieldGuards: FieldGuards<T>): Guard<T> {
	const guards: [string, Guard<unknown>][] = Object.entries(fieldGuards);
	return (value): value is T =>
		isRecord(value) && guards.every(([key, guard]) => guard(value[key]));
}

/**
 * Checks that a response has the expected shape.
 *
 * @param {unknown} value - The parsed body of the response.
 * @param {Guard<T>} guard - The guard for the expected shape.
 * @param {string} requestLine - The method and the endpoint of the request, for the error.
 * @returns {T} The value, typed.
 * @throws {Error} When the guard refuses the value.
 */
export function ensureShape<T>(value: unknown, guard: Guard<T>, requestLine: string): T {
	if (!guard(value)) throw new Error(`Unexpected response from ${requestLine}.`);
	return value;
}
