import chroma from 'chroma-js';
import { escape, unescape } from 'html-escaper';
import { ensureTextContrast } from './color-contrast';
import { InlineMarkingDefinition, InlineToken, InsertionPoint, MarkedRange as MarkedRange, MarkerToken, MarkerType, MarkerTypeOrder } from './types';

export class ShikiLine {
	readonly tokens: InlineToken[];
	readonly textLine: string;

	private beforeClassValue: string;
	private classes: Set<string>;
	private afterClassValue: string;
	private afterTokens: string;

	constructor(highlightedCodeLine: string) {
		const lineRegExp = /^(<span class=")(line.*?)(".*?>)(.*)(<\/span>)$/;
		const lineMatches = highlightedCodeLine.match(lineRegExp);
		if (!lineMatches) throw new Error(`Shiki-highlighted code line HTML did not match expected format. HTML code:\n${highlightedCodeLine}`);

		this.beforeClassValue = lineMatches[1];
		this.classes = new Set(lineMatches[2].split(' '));
		this.afterClassValue = lineMatches[3];
		const tokensHtml = lineMatches[4];
		this.afterTokens = lineMatches[5];

		// Split line into inline tokens
		const tokenRegExp = /<span style="color: (#[0-9A-Fa-f]+)">(.*?)<\/span>/g;
		const tokenMatches = tokensHtml.matchAll(tokenRegExp);
		this.tokens = [];
		this.textLine = '';
		for (const tokenMatch of tokenMatches) {
			const [, color, innerHtml] = tokenMatch;
			const text = unescape(innerHtml);
			this.tokens.push({
				tokenType: 'syntax',
				color,
				innerHtml,
				text,
				textStart: this.textLine.length,
				textEnd: this.textLine.length + text.length,
			});
			this.textLine += text;
		}
	}

	applyInlineMarkings(inlineMarkings: InlineMarkingDefinition[]) {
		const markedRanges: MarkedRange[] = [];

		// Go through all definitions, find matches for their regular expressions in textLine,
		// and fill markedRanges with their capture groups or entire matches
		inlineMarkings.forEach((inlineMarking) => {
			const matches = this.textLine.matchAll(inlineMarking.regExp);
			for (const match of matches) {
				// Read the start and end ranges from the `indices` property,
				// which is made available through the RegExp flag `d`
				// (and unfortunately not recognized by TypeScript)
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				let groupIndices = (match as any).indices as ([start: number, end: number] | null)[];
				// If accessing the group indices is unsupported, use the full match as fallback
				if (!groupIndices || !groupIndices.length) {
					const fullMatchIndex = match.index as number;
					groupIndices = [[fullMatchIndex, fullMatchIndex + match[0].length]];
				}
				// If there are multiple non-null indices, remove the first one
				// as it is the full match and we only want to mark capture groups
				groupIndices = groupIndices.filter((range) => range);
				if (groupIndices.length > 1) {
					groupIndices.shift();
				}
				// Create marked ranges from all remaining group indices
				groupIndices.forEach((range) => {
					if (!range) return;
					markedRanges.push({
						markerType: inlineMarking.markerType,
						start: range[0],
						end: range[1],
					});
				});
			}
		});

		if (!markedRanges.length) return;

		// Flatten marked ranges to prevent any overlaps
		const flattenedRanges = this.flattenMarkedRanges(markedRanges);

		// Build an array of marker elements to insert
		const markerElements = flattenedRanges.map((range) => ({
			markerType: range.markerType,
			opening: this.textPositionToTokenPosition(range.start),
			closing: this.textPositionToTokenPosition(range.end),
		}));

		// Mutate inline tokens in reverse direction (from end to start),
		// inserting opening and closing marker tokens at the determined positions,
		// optionally splitting syntax tokens if they only match partially
		markerElements.reverse().forEach((markerElement) => {
			const markerToken: MarkerToken = {
				tokenType: 'marker',
				markerType: markerElement.markerType,
			};

			this.insertMarkerTokenAtPosition(markerElement.closing, { ...markerToken, closing: true });
			this.insertMarkerTokenAtPosition(markerElement.opening, markerToken);
		});
	}

	ensureTokenColorContrast() {
		// Ensure proper color contrast of syntax tokens inside marked ranges
		// (note that only the lightness of the background color is used)
		const backgroundColor = chroma('#2e336b');
		const isLineMarked = this.getLineMarkerType() !== undefined;
		let inInlineMarker = false;
		this.tokens.forEach((token) => {
			if (token.tokenType === 'marker') {
				inInlineMarker = !token.closing;
				return;
			}
			if (inInlineMarker || isLineMarked) {
				const tokenColor = chroma(token.color);
				const fixedTokenColor = ensureTextContrast(tokenColor, backgroundColor);
				token.color = fixedTokenColor.hex();
			}
		});
	}

	renderToHtml() {
		const tokensHtml = this.tokens
			.map((token) => {
				if (token.tokenType === 'marker') return `<${token.closing ? '/' : ''}${token.markerType}>`;
				return `<span style="color:${token.color}">${token.innerHtml}</span>`;
			})
			.join('');
		const classValue = [...this.classes].join(' ');

		return `${this.beforeClassValue}${classValue}${this.afterClassValue}${tokensHtml}${this.afterTokens}`;
	}

	getLineMarkerType(): MarkerType {
		return MarkerTypeOrder.find((markerType) => markerType && this.classes.has(markerType.toString()));
	}

	setLineMarkerType(newType: MarkerType) {
		// Remove all existing marker type classes (if any)
		MarkerTypeOrder.forEach((markerType) => markerType && this.classes.delete(markerType.toString()));

		if (newType === undefined) return;
		this.classes.add(newType.toString());
	}

	private textPositionToTokenPosition(textPosition: number): InsertionPoint {
		for (const [tokenIndex, token] of this.tokens.entries()) {
			if (token.tokenType !== 'syntax') continue;

			if (textPosition === token.textStart) {
				return {
					tokenIndex,
					innerHtmlOffset: 0,
				};
			}

			// The text position is inside the current token
			if (textPosition > token.textStart && textPosition < token.textEnd) {
				// To determine the correct position in tokensHtml based on textPosition,
				// we need to take position shifts due to HTML entity escaping into account,
				// so we insert a special character ('\n') at textPosition, escape the string,
				// and finally determine the new special character position
				const innerHtmlOffset = escape(
					token.text.slice(0, textPosition - token.textStart) +
						// Insert our special character at textPosition
						'\n' +
						token.text.slice(textPosition - token.textStart)
				).indexOf('\n');

				return {
					tokenIndex,
					innerHtmlOffset,
				};
			}
		}

		// If we arrive here, the position is after the last token
		return {
			tokenIndex: this.tokens.length,
			innerHtmlOffset: 0,
		};
	}

	private insertMarkerTokenAtPosition(position: InsertionPoint, markerToken: MarkerToken) {
		// Insert the new token inside the given token by splitting it
		if (position.innerHtmlOffset > 0) {
			const insideToken = this.tokens[position.tokenIndex];
			if (insideToken.tokenType !== 'syntax') throw new Error(`Cannot insert a marker token inside a token of type "${insideToken.tokenType}"!`);

			const newInnerHtmlBeforeMarker = insideToken.innerHtml.slice(0, position.innerHtmlOffset);
			const tokenAfterMarker = {
				...insideToken,
				innerHtml: insideToken.innerHtml.slice(position.innerHtmlOffset),
			};
			insideToken.innerHtml = newInnerHtmlBeforeMarker;
			const newTokens: InlineToken[] = [markerToken];
			// Only add the inside token if it still has contents after splitting
			if (tokenAfterMarker.innerHtml.length)
				newTokens.push(tokenAfterMarker);
			this.tokens.splice(position.tokenIndex + 1, 0, ...newTokens);
			return;
		}

		// Insert the new token before the given token
		this.tokens.splice(position.tokenIndex, 0, markerToken);
	}

	private flattenMarkedRanges(markedRanges: MarkedRange[]): MarkedRange[] {
		const flattenedRanges: MarkedRange[] = [];
		const sortedRanges = [...markedRanges].sort((a, b) => a.start - b.start);
		const posInRange = (pos: number): { idx: number; range?: MarkedRange } => {
			for (let idx = 0; idx < flattenedRanges.length; idx++) {
				const range = flattenedRanges[idx];
				if (pos < range.end)
					return {
						idx,
						range: pos >= range.start ? range : undefined,
					};
			}
			// After the last element
			return {
				idx: flattenedRanges.length,
			};
		};

		MarkerTypeOrder.forEach((markerType) => {
			sortedRanges
				.filter((range) => range.markerType === markerType)
				.forEach((rangeToAdd) => {
					// Clone range to avoid overriding values of the original object
					rangeToAdd = { ...rangeToAdd };

					// Get insertion position for the start and end of rangeToAdd
					const posStart = posInRange(rangeToAdd.start);
					const posEnd = posInRange(rangeToAdd.end);

					const newElements: MarkedRange[] = [rangeToAdd];

					// rangeToAdd starts inside an existing range and their start points differ
					if (posStart.range && rangeToAdd.start !== posStart.range.start) {
						if (posStart.range.markerType === rangeToAdd.markerType) {
							rangeToAdd.start = posStart.range.start;
						} else {
							newElements.unshift({
								...posStart.range,
								end: rangeToAdd.start,
							});
						}
					}

					// rangeToAdd ends inside an existing range and their end points differ
					if (posEnd.range && rangeToAdd.end !== posEnd.range.end) {
						if (posEnd.range.markerType === rangeToAdd.markerType) {
							rangeToAdd.end = posEnd.range.end;
						} else {
							newElements.push({
								...posEnd.range,
								start: rangeToAdd.end,
							});
						}
					}

					flattenedRanges.splice(posStart.idx, posEnd.idx - posStart.idx + 1, ...newElements);
				});
		});

		return flattenedRanges;
	}
}
