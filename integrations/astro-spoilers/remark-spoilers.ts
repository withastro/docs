import type { Literal, Root } from 'mdast';
import type { Extension } from 'mdast-util-from-markdown';
import { toHast } from 'mdast-util-to-hast';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { markdownLineEnding } from 'micromark-util-character';
import { codes } from 'micromark-util-symbol/codes';
import { types } from 'micromark-util-symbol/types';
import type { Code, Effects, State, Token, TokenizeContext } from 'micromark-util-types';
import assert from 'node:assert';
import type * as unified from 'unified';
import { SpoilerMarker, SpoilerStages, SpoilerTagname } from './constants';

interface InlineSpoiler extends Literal {
	type: 'inlineSpoiler';
}

declare module 'mdast' {
	interface StaticPhrasingContentMap {
		inlineSpoiler: InlineSpoiler;
	}
}

export default function remarkSpoilers(): unified.Plugin<[], Root> {
	return function attacher() {
		const data = this.data();

		add('micromarkExtensions', spoilerExtension());
		add('fromMarkdownExtensions', spoilerFromMarkdown());

		function add(field: string, value: unknown) {
			const list = (data[field] ? data[field] : (data[field] = [])) as unknown[];
			list.push(value);
		}
	};
}

function spoilerExtension() {
	function previous(code: Code): boolean {
		// If there is a previous code, there will always be a tail.
		return code !== SpoilerMarker || this.events[this.events.length - 1][1].type === types.characterEscape;
	}

	function tokenizeTextSpoilerText(this: TokenizeContext, effects: Effects, ok: State, nok: State) {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;
		let sizeOpen = 0;
		let size: number;
		let token: Token;

		return function start(code: Code): State | void {
			assert(code === SpoilerMarker, 'expected `|`');
			assert(previous.call(self, self.previous), 'expected correct previous');
			effects.enter(SpoilerStages.spoilerText);
			effects.enter(SpoilerStages.spoilerTextSequence);
			return openingSequence(code);
		};

		function openingSequence(code: Code): State | void {
			if (code === SpoilerMarker) {
				effects.consume(code);
				sizeOpen++;
				return openingSequence;
			}

			if (sizeOpen < 2) return nok(code);
			effects.exit(SpoilerStages.spoilerTextSequence);
			return gap(code);
		}

		function gap(code: Code): State | void {
			if (code === codes.eof) return nok(code);

			if (code === SpoilerMarker) {
				token = effects.enter(SpoilerStages.spoilerTextSequence);
				size = 0;
				return closingSequence(code);
			}

			if (markdownLineEnding(code)) {
				effects.enter(types.lineEnding);
				effects.consume(code);
				effects.exit(types.lineEnding);
				return gap;
			}

			effects.enter(SpoilerStages.spoilerTextData);
			return data(code);
		}

		function data(code: Code): State | void {
			if (code === codes.eof || code === SpoilerMarker) {
				effects.exit(SpoilerStages.spoilerTextData);
				return gap(code);
			}

			effects.consume(code);
			return data;
		}

		function closingSequence(code: Code): State | void {
			if (code === SpoilerMarker) {
				effects.consume(code);
				size++;
				return closingSequence;
			}

			if (size === sizeOpen) {
				effects.exit(SpoilerStages.spoilerTextSequence);
				effects.exit(SpoilerStages.spoilerText);
				return ok(code);
			}

			token.type = SpoilerStages.spoilerTextData;
			return data(code);
		}
	}

	return {
		text: {
			[SpoilerMarker]: {
				tokenize: tokenizeTextSpoilerText,
				resolve: function resolveSpoilerText(events) {
					return events;
				},
				previous,
				concrete: false,
			},
		},
	};
}

function spoilerFromMarkdown() {
	const extension: Extension = {
		enter: {
			[SpoilerStages.spoilerText]: function enterSpoilerText(token) {
				this.enter(
					{
						type: 'inlineSpoiler',
						value: '',
						data: { hName: SpoilerTagname, hChildren: [] },
					},
					token
				);
				this.buffer();
			},
		},
		exit: {
			[SpoilerStages.spoilerText]: function exitSpoilerText(token) {
				const data = this.resume();
				const node = this.exit(token) as InlineSpoiler;
				node.value = data;
				const mdast = fromMarkdown(data);
				const hast = toHast(mdast.children[0]);
				// @ts-expect-error: we defined it.
				if (hast) node.data.hChildren.push(...hast.children);
			},
			[SpoilerStages.spoilerTextData]: function exitSpoilerData(token) {
				this.config.enter.data.call(this, token);
				this.config.exit.data.call(this, token);
			},
		},
	};
	return extension;
}
