import { codes } from 'micromark-util-symbol/codes';

export const SpoilerTagname = 'AutoImportedSpoiler';
export const SpoilerMarker = codes.verticalBar;
export enum SpoilerStages {
	spoilerText = 'spoilerText',
	spoilerTextSequence = 'spoilerTextSequence',
	spoilerTextData = 'spoilerTextData',
}
