import type { AstroIntegration } from 'astro';
import { fileURLToPath } from 'node:url';

const BRAND = '/*____ASTRO_COMPONENT_TIMER____*/';
const DATA_STORE_KEY = '__ASTRO_COMPONENT_TIMINGS_STORE__';
globalThis[DATA_STORE_KEY] ??= {};

declare global {
	var __ASTRO_COMPONENT_TIMINGS_STORE__: Record<string, number[]>;
}

export function astroComponentTimer() {
	return {
		name: 'astro-component-timer',
		hooks: {
			'astro:config:setup'({ updateConfig, config, command }) {
				const srcDir = fileURLToPath(config.srcDir);
				const localId = (id: string) => {
					const srcRelative = id.replace(srcDir, './');
					const nmIndex = srcRelative.lastIndexOf('/node_modules/');
					return nmIndex !== -1 ? srcRelative.slice(nmIndex + 14) : srcRelative;
				};
				updateConfig({
					vite: {
						plugins: [
							{
								name: 'vite-plugin-astro-component-timer',
								shouldTransformCachedModule({ id }) {
									if (id.endsWith('.astro')) {
										true;
									}
								},
								transform(src, id) {
									// if (!id.includes('/node_modules/')) console.log('ID:', id);
									if (!id.endsWith('.astro')) {
										return;
									}
									if (src.includes(BRAND)) {
										console.log('ALREADY BRANDED:', id);
										return;
									}

									let newCode = `${BRAND}${src}`;

									// Start timer at beginning of `$$createComponent()` function.
									const createComponentFnOpen = newCode.match(/(?<=\$\$createComponent\([^{]+)({)/);
									if (!createComponentFnOpen || !createComponentFnOpen.index) {
										console.log('MISSING CREATE COMPONENT IN', id);
										return;
									}
									const mainLabel = JSON.stringify(localId(id));
									newCode =
										newCode.slice(0, createComponentFnOpen.index + 1) +
										`const __t_render_start__ = performance.now();` +
										newCode.slice(createComponentFnOpen.index + 1);

									// End timer after `$$render` function runs.
									const renderMatch = newCode.match(/return (?<renderCall>\$\$render`.+`;)\n/s);
									if (!renderMatch || !renderMatch.index || !renderMatch.groups?.renderCall) {
										console.log('MISSING RENDER CALL IN', localId(id));
										return;
									}
									newCode =
										newCode.slice(0, renderMatch.index) +
										`
                  const astroComponentTimerRenderResult = ${renderMatch.groups.renderCall}
                  const __dur = performance.now() - __t_render_start__;
                  globalThis[${JSON.stringify(DATA_STORE_KEY)}][${mainLabel}] ??= [];
                  globalThis[${JSON.stringify(DATA_STORE_KEY)}][${mainLabel}].push(__dur);${
										command === 'dev' ? `console.log(__dur.toFixed(4) + 'ms', ${mainLabel});` : ''
									}
                  return astroComponentTimerRenderResult;
                  ` +
										newCode.slice(renderMatch.index + renderMatch[0].length);

									return { code: newCode };
								},
							},
						],
					},
				});
			},
			'astro:build:done'() {
				const timings = Object.entries(globalThis[DATA_STORE_KEY])
					.map(([name, timings]) => {
						timings.sort();
						const totalTime = timings.reduce((cur, val) => cur + val, 0);
						return [
							name,
							{
								avg: totalTime / timings.length,
								min: timings[0],
								median:
									timings.length % 2
										? timings[Math.floor(timings.length / 2)]
										: (timings[timings.length / 2 - 1] + timings[timings.length / 2]) / 2,
								max: timings.at(-1)!,
								stdev: Math.sqrt(
									timings
										.map((t) => Math.pow(t - totalTime / timings.length, 2))
										.reduce((cur, val) => cur + val, 0) / timings.length
								),
								total: totalTime,
								count: timings.length,
							},
						] as const;
					})
					.sort(([, a], [, b]) => b.avg - a.avg)
					.map(
						([name, { avg, min, median, max, stdev, count, total }]) =>
							[
								name,
								{
									count,
									'min (ms)': ms(min),
									'median (ms)': ms(median),
									'max (ms)': ms(max),
									'mean (ms)': ms(avg),
									σ: ms(stdev),
									'total (ms)': ms(total),
								},
							] as const
					);

				console.log('\nComponent render timings (25 slowest):');
				console.table(Object.fromEntries(timings.slice(0, 25)));
				console.log('');
			},
		},
	} satisfies AstroIntegration;
}

function ms(val: number) {
	return Math.round(val * 1000) / 1000;
}
