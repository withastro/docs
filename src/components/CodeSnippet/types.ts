export type MarkerType = 'mark' | 'ins' | 'del' | undefined;

/** When markers overlap, those with higher indices override lower ones. */
export const MarkerTypeOrder: MarkerType[] = ['mark', 'del', 'ins'];

export type LineMarkingDefinition = {
	markerType: MarkerType;
	lines: number[];
};

export type InlineMarkingDefinition = {
	markerType: MarkerType;
	text?: string;
	regExp?: RegExp;
};

export type MarkedRange = {
	markerType: MarkerType;
	start: number;
	end: number;
};

export type SyntaxToken = {
	tokenType: 'syntax';
	color: string;
	otherStyles: string;
	innerHtml: string;
	text: string;
	textStart: number;
	textEnd: number;
};

export type MarkerToken = {
	tokenType: 'marker';
	markerType: MarkerType;
	closing?: boolean;
};

export type InlineToken = SyntaxToken | MarkerToken;

export type InsertionPoint = {
	tokenIndex: number;
	innerHtmlOffset: number;
};
