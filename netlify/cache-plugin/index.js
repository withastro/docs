const paths = ['node_modules/.astro', 'node_modules/.astro-og-canvas'];

// Based on work by Jake Jarvis
// https://github.com/jakejarvis/netlify-plugin-cache/blob/master/index.js

// MIT License

// Copyright (c) 2020 Jake Jarvis

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

module.exports = {
	// Try to restore cache before build begins, if it exists
	onPreBuild: async ({ utils }) => {
		if (await utils.cache.restore(paths)) {
			const files = await utils.cache.list(paths);
			console.log(`Successfully restored: ${paths.join(', ')} ... ${files.length} files in total.`);
		} else {
			console.log(`A cache of '${paths.join(', ')}' doesn't exist (yet).`);
		}
	},

	// Only save/update cache if build was successful
	onSuccess: async ({ utils }) => {
		if (await utils.cache.save(paths)) {
			const files = await utils.cache.list(paths);
			console.log(`Successfully cached: ${paths.join(', ')} ... ${files.length} files in total.`);

			// Show success & more detail in deploy summary
			utils.status.show({
				title: `${files.length} files cached`,
				summary: 'These will be restored on the next build! ⚡',
				text: `${paths.join(', ')}`,
			});
		} else {
			// This probably happened because the default `paths` is set, so provide instructions to fix
			console.log(`Attempted to cache: ${paths.join(', ')} ... but failed. :(`);
		}
	},
};
