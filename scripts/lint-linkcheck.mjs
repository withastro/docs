import path from 'path';
import fs from 'fs';
import kleur from 'kleur';
import htmlparser2 from 'htmlparser2';
import core from '@actions/core';

/**
 * Contains all link checking logic.
 */
class BrokenLinkChecker {
	constructor ({ baseUrl, buildOutputDir, pageSourceDir }) {
		this.baseUrl = baseUrl;
		this.buildOutputDir = buildOutputDir;
		this.pageSourceDir = pageSourceDir;
	}

	/**
	 * Checks all pages referenced by the sitemap for broken links
	 * and outputs the result to the console.
	 */
	run () {
		// Get the pathnames of all content pages from the sitemap contained in the build output
		const pagePathnames = this.getPagePathnamesFromSitemap();

		// Parse all pages referenced by the sitemap and build an index of their contents
		const pages = this.parsePages(pagePathnames);

		// Find all broken links
		const brokenLinks = this.findBrokenLinks(pages);

		// Output the result to the console
		this.outputResult(brokenLinks);

		if (brokenLinks.length > 0) {
			// If we're being run by a GitHub CI workflow, try to output annotations
			// that show the locations of the broken links in the source files
			if (process.env.CI) {
				this.outputSourceFileAnnotations(brokenLinks);
			}

			// Let our caller know that we found errors
			process.exitCode = 1;
		}
	}

	/**
	 * Reads the `sitemap.xml` from the build output and extracts all unique pathnames.
	 */
	getPagePathnamesFromSitemap () {
		const sitemapFilePath = path.join(this.buildOutputDir, 'sitemap.xml');
		const sitemap = fs.readFileSync(sitemapFilePath, 'utf8');
		const sitemapRegex = new RegExp(`<loc>${this.baseUrl}(/.*?)</loc>`, 'ig');
		const uniquePagePaths = [...new Set(Array.from(
			sitemap.matchAll(sitemapRegex),
			m => m[1]
		))];

		return uniquePagePaths;
	}

	/**
	 * Parses multiple HTML pages based on their pathnames and builds an index of their contents.
	 */
	parsePages (pathnames) {
		const pages = {};
		pathnames.forEach(pathname => {
			pages[pathname] = this.parsePage(pathname);
		});

		return pages;
	}

	/**
	 * Parses an HTML page based on its pathname and builds an index of its contents.
	 */
	parsePage (pathname) {
		const href = this.pathnameToHref(pathname);
		const htmlFilePath = this.pathnameToHtmlFilePath(pathname);

		if (!fs.existsSync(htmlFilePath)) {
			throw new Error('Failed to find HTML file referenced by sitemap: ' + htmlFilePath);
		}

		const dom = htmlparser2.parseDocument(fs.readFileSync(htmlFilePath));
		const anchors = htmlparser2.DomUtils
			.getElementsByTagName('a', dom, true);
		
		// Build a list of unique link hrefs on the page
		const linkHrefs = [...new Set(anchors
			.map(el => el.attribs.href)
		)];

		// Build a list of hashes provided by the page (mostly used as scroll targets)
		const anchorNames = anchors
			.map(el => el.attribs.name)
			.filter(name => name !== undefined);
		const ids = htmlparser2.DomUtils
			.getElements({ id: id => id !== undefined }, dom, true)
			.map(el => el.attribs.id);
		const hashes = [...anchorNames, ...ids]
			.map(name => `#${name}`);
		
		return {
			pathname,
			href,
			htmlFilePath,
			linkHrefs,
			hashes,
		};
	}

	/**
	 * Goes through all pre-parsed and indexed pages, checks their links,
	 * and returns an array containing all broken links (if any).
	 */
	findBrokenLinks (pages) {
		var brokenLinks = [];

		Object.values(pages).forEach(page => {
			// Go through all link hrefs on the page
			page.linkHrefs.forEach(linkHref => {
				const url = new URL(linkHref, page.href);

				// Ignore external URLs
				if (!url.href.startsWith(this.baseUrl))
					return;
				
				var linkPathname = url.pathname;
				if (!linkPathname.endsWith('/')) {
					linkPathname += '/';
				}
				const linkedPage = pages[linkPathname];
				const isMissingPage = !linkedPage;

				const decodedHash = url.hash && decodeURIComponent(url.hash);
				const isMissingHash = (
					!isMissingPage &&
					(decodedHash && !linkedPage.hashes.includes(decodedHash))
				);

				if (isMissingPage || isMissingHash) {
					brokenLinks.push({
						page,
						href: url.href,
						unresolvedHref: linkHref,
						isMissingPage,
						isMissingHash,
					});
				}
			});
		});
		
		return brokenLinks;
	}

	/**
	 * Outputs the result of the broken link check to the console.
	 */
	outputResult (brokenLinks) {
		const totalBroken = brokenLinks.length;

		if (totalBroken > 0) {
			const brokenHashCount = brokenLinks.filter(brokenLink => brokenLink.isMissingHash).length;
			const brokenPageCount = totalBroken - brokenHashCount;
			const prefixPage = kleur.gray(`[${kleur.red().bold('404')}]`);
			const prefixHash = kleur.gray(`[${kleur.yellow().bold(' # ')}]`);

			var lastPage;
			brokenLinks.forEach(brokenLink => {
				if (lastPage !== brokenLink.page) {
					console.log(`\n${brokenLink.page.pathname}`);
					lastPage = brokenLink.page;
				}
				console.log(`  ${brokenLink.isMissingHash ? prefixHash : prefixPage} ${brokenLink.href}`);
			});
			console.log();

			const summary = [
				`*** Found ${totalBroken} broken ${totalBroken === 1 ? 'link' : 'links'} in total:`,
				`  ${prefixPage} ${brokenPageCount} broken page ${brokenPageCount === 1 ? 'link' : 'links'}`,
				`  ${prefixHash} ${brokenHashCount} broken fragment ${brokenHashCount === 1 ? 'link' : 'links'}`,
			];
			console.log(kleur.white().bold(summary.join('\n')));
		} else {
			console.log(kleur.green().bold('*** Found no broken links. Great job!'));
		}		
		console.log();
	}

	outputSourceFileAnnotations (brokenLinks) {
		// Always output a summary first because GitHub only displays the first 10 annotations
		const totalBroken = brokenLinks.length;
		core.error(`Found ${totalBroken} broken ${totalBroken === 1 ? 'link' : 'links'} in build output`);
		
		// Collect all unique pathnames that had broken links
		const pathnames = [...new Set(brokenLinks.map(brokenLink => brokenLink.page.pathname))];

		// Go through the collected pathnames
		pathnames.forEach(pathname => {
			// Try to find the Markdown source file for the current pathname
			const sourceFilePath = this.tryFindSourceFileForPathname(pathname)
				.replace(/\\/g, '/');

			// If we could not find the source file, we can't create annotations for it
			if (!sourceFilePath)
				return;
			
			// Load the source file
			const sourceFileContents = fs.readFileSync(sourceFilePath, 'utf8');
			const lines = sourceFileContents.split(/\r?\n/);

			// Try to locate all broken links in the source file and output error annotations
			// including line and column numbers
			const brokenLinksOnCurrentPage = brokenLinks
				.filter(brokenLink => brokenLink.page.pathname === pathname);
			lines.forEach((line, idx) => {
				const lineNumber = idx + 1;
				brokenLinksOnCurrentPage.forEach(brokenLink => {
					const startColumn = this.indexOfHref(line, brokenLink.unresolvedHref);
					if (startColumn === -1)
						return;
					
					const message = `Broken ${brokenLink.isMissingHash ? 'fragment' : 'page'} ` +
						`link in ${sourceFilePath}, line ${lineNumber}: ${brokenLink.href}`;
					core.error(message, {
						file: sourceFilePath,
						startLine: lineNumber,
						startColumn,
						endColumn: startColumn + brokenLink.unresolvedHref.length
					});
				});
			});
		});
	}

	pathnameToHref (pathname) {
		const url = new URL(pathname, this.baseUrl);
		return url.href;
	}

	pathnameToHtmlFilePath (pathname) {
		return path.join(this.buildOutputDir, pathname, 'index.html');
	}

	/**
	 * Attempts to find a Markdown source file for the given `pathname`.
	 * 
	 * Example: Given a pathname of `/en/some-page` or `/en/some-page/`,
	 * searches for the source file in the following locations
	 * and returns the first matching path:
	 * - `${this.pageSourceDir}/en/some-page.md`
	 * - `${this.pageSourceDir}/en/some-page/index.md`
	 * 
	 * If no existing file is found, returns `undefined`.
	 */
	tryFindSourceFileForPathname (pathname) {
		const possibleSourceFilePaths = [
			path.join(this.pageSourceDir, pathname, '.') + '.md',
			path.join(this.pageSourceDir, pathname, 'index.md'),
		];
		return possibleSourceFilePaths.find(possiblePath => fs.existsSync(possiblePath));
	}

	/**
	 * Attempts to find the given link `href` inside `input` and returns its index on a match.
	 * 
	 * Prevents false positive partial matches (like an href of `/en/install` matching
	 * an input containing `/en/install/auto`) by requiring the characters surrounding a match
	 * not to be a part of URLs in Markdown.
	 */
	indexOfHref (input, href) {
		let i = input.indexOf(href);
		while (i !== -1) {
			// Get the characters surrounding the current match (if any)
			let charBefore = input.substring(i - 1, i);
			let charAfter = input.substr(i + href.length, 1);
			// If both characters are not a part of URLs in Markdown,
			// we have a proper (non-partial) match, so return the index
			if ((charBefore + charAfter).match(/^[\s"'()[\],.]*$/))
				return i;
			// Otherwise, keep searching for other matches
			i = input.indexOf(href, i + 1);
		}
		return -1; 
	}
}

// Use our class to check for broken links
const brokenLinkChecker = new BrokenLinkChecker({
	baseUrl: 'https://docs.astro.build',
	buildOutputDir: './dist',
	pageSourceDir: './src/pages',
});

brokenLinkChecker.run();
