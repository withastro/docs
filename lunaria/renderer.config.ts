import { TitleParagraph } from './components';
import { defineRendererConfig } from '@lunariajs/core';

export default defineRendererConfig({
	slots: {
		afterTitle: TitleParagraph,
	},
});
