/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference path="../node_modules/@astrojs/starlight/virtual.d.ts"/>

declare namespace StarlightApp {
	// Types the UI strings used by remark/rehype plugins
	interface I18n {
		'a11y.sectionLink': string;
	}
}
