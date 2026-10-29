/**
 * A function that checks an unknown value against `T`, and returns a copy that
 * keeps only the fields `T` declares.
 *
 * `path` locates the value in the response (e.g. `head.repo`), so an error can
 * name the field.
 *
 * @template T - The type the shape reads.
 */
export type Shape<T> = (value: unknown, path: string) => T;

/**
 * Gets the type a shape reads.
 *
 * @template S - The shape.
 * @example
 * ```ts
 * const userShape = shape.object({ login: shape.string });
 * type User = shape.Infer<typeof userShape>; // { login: string }
 * ```
 */
export type Infer<S> = S extends Shape<infer T> ? T : never;

type FieldShapes = Record<string, Shape<unknown>>;

/**
 * Flattens an object type to list its fields instead of the alias.
 *
 * @template T - The object type to show.
 */
type Simplify<T> = { [K in keyof T]: T[K] } & {};

type ObjectOf<F extends FieldShapes> = Simplify<{ [K in keyof F]: Infer<F[K]> }>;

/** Tells whether a value is an object whatever its fields. */
export function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Reads a string. */
export const string: Shape<string> = (value, path) =>
	typeof value === 'string' ? value : fail(path, 'a string', value);

/** Reads a number. */
export const number: Shape<number> = (value, path) =>
	typeof value === 'number' ? value : fail(path, 'a number', value);

/** Reads a boolean. */
export const boolean: Shape<boolean> = (value, path) =>
	typeof value === 'boolean' ? value : fail(path, 'a boolean', value);

/** Reads any value, unchecked, for a response the caller doesn't read. */
export const unknown: Shape<unknown> = (value) => value;

/**
 * Creates a shape that accepts only the given values.
 *
 * @param {readonly T[]} values - The accepted values.
 * @returns {Shape<T>} A shape reading one of `values`.
 */
export function oneOf<const T extends string>(values: readonly T[]): Shape<T> {
	return (value, path) => {
		const match = values.find((accepted) => accepted === value);
		return match ?? fail(path, `one of ${values.join(', ')}`, value);
	};
}

/**
 * Creates a shape that accepts `null`, or a value of another shape.
 *
 * @param {Shape<T>} valueShape - The shape of the value when it is not `null`.
 * @returns {Shape<T | null>} A shape reading `null` or a value of `valueShape`.
 */
export function nullable<T>(valueShape: Shape<T>): Shape<T | null> {
	return (value, path) => (value === null ? null : valueShape(value, path));
}

/**
 * Creates a shape that reads a list, item by item.
 *
 * @param {Shape<T>} itemShape - The shape of each item.
 * @returns {Shape<T[]>} A shape reading a list of `itemShape` values.
 */
export function list<T>(itemShape: Shape<T>): Shape<T[]> {
	return (value, path) => {
		if (!Array.isArray(value)) return fail(path, 'a list', value);
		return value.map((item, index) => itemShape(item, `${path}[${index}]`));
	};
}

/**
 * Creates a shape that reads an object, field by field.
 *
 * The copy has only the fields of `fieldShapes`, so a response keeps none of
 * the fields a script does not read. A doc comment on a field shape also shows
 * on that field of the inferred type.
 *
 * @param {F} fieldShapes - The shape of each field.
 * @returns {Shape<ObjectOf<F>>} A shape reading an object with these fields.
 * @example
 * ```ts
 * const userShape = shape.object({
 * 	login: shape.string,
 * 	name: shape.nullable(shape.string),
 * });
 * ```
 */
export function object<F extends FieldShapes>(fieldShapes: F): Shape<ObjectOf<F>> {
	const entries = Object.entries(fieldShapes);
	return (value, path) => {
		if (!isRecord(value)) return fail(path, 'an object', value);
		const copy: Record<string, unknown> = {};
		for (const [key, fieldShape] of entries) {
			copy[key] = fieldShape(value[key], path ? `${path}.${key}` : key);
		}
		// The loop sets every key of `fieldShapes`, which TypeScript cannot follow.
		return copy as ObjectOf<F>;
	};
}

/**
 * Reads a response body with a shape.
 *
 * @param {unknown} body - The parsed JSON body of the response.
 * @param {Shape<T>} bodyShape - The expected shape of the body.
 * @param {string} requestLine - The method and the endpoint of the request, for the error.
 * @returns {T} A copy of the body with only the fields of the shape.
 * @throws {Error} When the body does not match, naming the request and the field.
 */
export function parseResponse<T>(body: unknown, bodyShape: Shape<T>, requestLine: string): T {
	try {
		return bodyShape(body, '');
	} catch (error) {
		const reason = error instanceof Error ? error.message : String(error);
		throw new Error(`Unexpected response from ${requestLine}: ${reason}`, { cause: error });
	}
}

function fail(path: string, expected: string, value: unknown): never {
	const subject = path ? `\`${path}\`` : 'the body';
	throw new Error(`${subject} should be ${expected}, got ${describeType(value)}.`);
}

function describeType(value: unknown) {
	if (value === null) return 'null';
	if (Array.isArray(value)) return 'an array';
	return typeof value;
}
