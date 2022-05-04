import fs from 'fs';
import glob from 'fast-glob';
import dedent from 'dedent-js';
import simpleGit from 'simple-git';
import issues from './lib/github-issues.mjs';
import output, { dedentMd } from './lib/output.mjs';

/**
 * Creates or updates a special summary issue on GitHub that provides an overview of
 * the current Astro documentation translation status.
 * 
 * This code is designed to be run on every push to the `main` branch.
 */
class GitHubTranslationStatus {
	constructor ({
		pageSourceDir,
		sourceLanguage,
		targetLanguages,
		githubToken,
		githubRepo,
		githubRefName,
		issueTitle,
	}) {
		this.pageSourceDir = pageSourceDir;
		this.sourceLanguage = sourceLanguage;
		this.targetLanguages = targetLanguages;
		this.githubToken = githubToken;
		this.githubRepo = githubRepo;
		this.githubRefName = githubRefName;
		this.issueTitle = issueTitle;
		this.git = simpleGit();

		if (!this.githubToken) {
			if (output.isCi) {
				output.error('Missing GITHUB_TOKEN. Please add the following lines to the task:\n' +
					'    env:\n' +
					'      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}'
				);
				process.exit(1);
			} else {
				output.warning('You are not running this script from a GitHub workflow. ' +
					'Performing a dry run without actually updating the issue.');
			}
		}
	}

	async update () {
		// Before we start, validate that this is not a shallow clone of the repo
		const isShallowRepo = await this.git.revparse(['--is-shallow-repository']);
		if (isShallowRepo !== 'false') {
			output.error(dedent`This script cannot operate on a shallow clone of the git repository.
				Please add the checkout setting "fetch-depth: 0" to your GitHub workflow:
				- name: Checkout
				  uses: actions/checkout@v3
				  with:
				    fetch-depth: 0
			`);
			process.exit(1);
		}

		// Try to find our summary issue on GitHub and parse its contents
		// to get the previously stored state (if any)
		let { issueNumber, issueBody } = await this.tryGetExistingIssue();
		let state = this.tryGetStatePayloadFromIssueBody(issueBody);

		// If we couldn't find an issue, couldn't get the previously stored state,
		// or cannot validate its contents, start with a fresh state
		if (!state || !state.pages || !state.pages[this.sourceLanguage]) {
			output.warning('Previous state is missing or invalid, starting fresh');
			state = {
				pages: {
					[this.sourceLanguage]: {},
				},
			};
		}

		// Ensure that state.pages contains a full index of relevant markdown pages
		state.pages = await this.updatePageIndex(state.pages);

		// Render a human-friendly summary of the new state
		let intro = dedentMd`
			If you're interested in helping us translate
			[docs.astro.build](https://docs.astro.build/) into one of the languages listed below,
			you've come to the right place! This auto-updating issue always lists all the pages
			that could use your help right now.

			Please note that we're currently limiting translations to a subset of pages
			that we consider stable enough. All other pages are still subject to change and
			should not be translated at this point. We will add more pages to these lists soon.

			Before starting, please read our
			[i18n guide](https://github.com/withastro/docs/tree/main/src/i18n) to learn about
			our translation process and how you can get involved.
		`;
		let humanFriendlySummary = dedent`
			${intro}

			### Translation status by content
			${this.renderTranslationStatusByContent(state)}

			### Translation todos by language
			${this.renderTranslationTodosByLanguage(state)}
		`;
		
		// Build a new issue body with the new human-friendly summary and JSON metadata
		let newIssueBody =
			humanFriendlySummary +
			this.renderAutomatedIssueFooter({
				message: `This is an automated issue. Every commit to main updates its contents.`,
				state,
			});

		if (!this.githubToken) {
			output.debug(`*** New state:\n\n${JSON.stringify(state, true, 2)}\n`);
			output.debug(`*** New human-friendly summary:\n\n${humanFriendlySummary}\n`);
		} else if (!issueNumber) {
			// Create a new issue if we didn't find an existing one
			const newIssue = await issues.create({
				repo: this.githubRepo,
				title: this.issueTitle,
				body: newIssueBody,
				githubToken: this.githubToken,
			});

			issueNumber = newIssue.number;
			output.debug(`Created new issue number: ${issueNumber}`);
		} else if (newIssueBody !== issueBody) {
			// Update the existing issue if its body changed
			await issues.update({
				repo: this.githubRepo,
				issueNumber,
				body: newIssueBody,
				githubToken: this.githubToken,
			});

			output.debug(`Updated issue`);
		}
	}

	async tryGetExistingIssue () {
		const foundIssues = await issues.search({
			repo: this.githubRepo,
			title: this.issueTitle,
			githubToken: this.githubToken,
		});
		let issueNumber = foundIssues &&
			foundIssues.length > 0 &&
			foundIssues[0].number || 0;

		// Get the issue directly to avoid caching issues with the search result
		// (search may return a slightly outdated version of the issue)
		const issue = issueNumber > 0 && await issues.get({
			repo: this.githubRepo,
			issueNumber,
			githubToken: this.githubToken,
		});
		let issueBody = issue && issue.body || '';

		if (issueNumber > 0) {
			output.debug(`Found existing issue #${issueNumber} with title "${issue.title}"`);
		} else {
			output.warning(`Didn't find an issue matching title "${this.issueTitle}", will need to create a new one`);
		}

		return {
			issueNumber,
			issueBody,
		};
	}

	/**
	 * Attempts to extract and parse JSON metadata from the issue body.
	 * 
	 * Returns the parsed JSON on success, or `undefined` otherwise.
	 */
	tryGetStatePayloadFromIssueBody (issueBody) {
		if (!issueBody)
			return;

		const matches = issueBody.match(/\n```json stateData\s([\S\s]*?)\n```/);
		if (!matches) {
			output.warning(`Didn't find state payload in issue body`);
			output.debug(`Issue body: ${JSON.stringify(issueBody)}`);
			return;
		}

		const payload = matches[1].trim();
		try {
			const state = JSON.parse(payload);
			return state;
		} catch (error) {
			output.warning(`Failed to parse JSON payload in issue body: ${error.message}`);
			output.debug(`Issue body: ${JSON.stringify(issueBody)}`);
			output.debug(`Payload: ${JSON.stringify(payload)}`);
			return;
		}
	}

	async updatePageIndex (oldPages) {
		// Initialize a new page index with a stable key order
		const pages = {
			[this.sourceLanguage]: {},
		};
		this.targetLanguages.forEach(lang => pages[lang] = {});

		// Enumerate all markdown pages with supported languages in pageSourceDir,
		// retrieve their page data and update them
		const pagePaths = await glob(`**/*.md`, {
			cwd: this.pageSourceDir,
		});
		const updatedPages = await Promise.all(pagePaths.sort().map(async pagePath => {
			const pathParts = pagePath.split('/');
			if (pathParts.length < 2)
				return;
			const lang = pathParts[0];
			const subpath = pathParts.splice(1).join('/');

			// Ignore pages with languages not contained in our configuration
			if (!pages[lang])
				return;

			// Attempt to get old data for the current page from our index
			const oldPageData = { ...(oldPages[lang] && oldPages[lang][subpath]) };

			// Create or update page data for the page
			return {
				lang,
				subpath,
				pageData: await this.updateSinglePageData({
					pagePath,
					oldPageData
				}),
			};
		}));
		
		// Write the updated pages to the index
		updatedPages.forEach(page => {
			if (!page)
				return;
			const { lang, subpath, pageData } = page;
			pages[lang][subpath] = pageData;
		});

		return pages;
	}

	/**
	 * Processes the markdown page located in the pageSourceDir subpath `pagePath`
	 * and creates a new page data object based on its frontmatter, git history and
	 * old page data.
	 */
	async updateSinglePageData ({ pagePath, oldPageData }) {
		const fullFilePath = `${this.pageSourceDir}/${pagePath}`;
		const latest = (a, b) => (a > b ? a : b);
		const pageData = {};

		// Retrieve git history for the current page
		const gitHistory = await this.getGitHistory(fullFilePath);

		// Detect and store i18nReady flag from frontmatter
		const frontMatterBlock = this.tryGetFrontMatterBlock(fullFilePath);
		const i18nReady = /^\s*i18nReady:\s*true\s*$/m.test(frontMatterBlock);
		if (i18nReady) {
			pageData.i18nReady = true;
			// If the page was i18nReady before, keep the old i18nReadyDate (if any),
			// or use the last commit date as a fallback
			pageData.i18nReadyDate = oldPageData.i18nReady &&
				oldPageData.i18nReadyDate || gitHistory.lastCommitDate;
		}

		// Use the most recent dates (which allows us to manually set future dates
		// if we do not want a translated page to become outdated) and the actual commit messages
		pageData.lastChange = latest(oldPageData.lastChange, gitHistory.lastCommitDate);
		pageData.lastCommitMsg = gitHistory.lastCommitMessage;
		pageData.lastMajorChange = latest(oldPageData.lastMajorChange, gitHistory.lastMajorCommitDate);
		pageData.lastMajorCommitMsg = gitHistory.lastMajorCommitMessage;
		
		return pageData;
	}

	tryGetFrontMatterBlock (filePath) {
		const contents = fs.readFileSync(filePath, 'utf8');
		const matches = contents.match(/^\s*---([\S\s]*?)\n---/);
		if (!matches)
			return '';
		return matches[1];
	}

	async getGitHistory (filePath) {
		const gitLog = await this.git.log({
			file: filePath,
			strictDate: true,
		});

		const lastCommit = gitLog.latest;
		
		// Attempt to find the last "major" commit, ignoring any commits that
		// usually do not require translations to be updated
		const lastMajorCommit = gitLog.all.find(logEntry => {
			return !logEntry.message.match(/(minor|typo|broken link|i18nReady)/i);
		}) || lastCommit;

		return {
			lastCommitMessage: lastCommit.message,
			lastCommitDate: this.toUtcString(lastCommit.date),
			lastMajorCommitMessage: lastMajorCommit.message,
			lastMajorCommitDate: this.toUtcString(lastMajorCommit.date),
		};
	}

	toUtcString (date) {
		return new Date(date).toISOString();
	}

	renderTranslationStatusByContent ({ pages }) {
		const arrContent = this.getTranslationStatusByContent({ pages });
		const lines = [];

		lines.push(`| Content | ${this.targetLanguages.join(' | ')} |`);
		lines.push(`| :--- | ${this.targetLanguages.map(_ => ':---:').join(' | ')} |`);

		arrContent.forEach(content => {
			const cols = [];
			cols.push(`[${content.subpath}](${content.githubUrl})`);
			cols.push(...this.targetLanguages.map(lang => {
				const translation = content.translations[lang];
				if (translation.isMissing)
					return '<span title="Missing">❌</span>';
				if (translation.isOutdated)
					return '<span title="Needs updating">🔄</span>';
				return '<span title="Completed">✔</span>';
			}));
			lines.push(`| ${cols.join(' | ')} |`);
		});

		lines.push(`\n<sup>❌ Missing &nbsp; 🔄 Needs updating &nbsp; ✔ Completed</sup>`);

		return lines.join('\n');
	}

	renderTranslationTodosByLanguage ({ pages }) {
		const arrContent = this.getTranslationStatusByContent({ pages });
		const lines = [];

		this.targetLanguages.forEach(lang => {
			const missing = arrContent.filter(content => content.translations[lang].isMissing);
			const outdated = arrContent.filter(content => content.translations[lang].isOutdated);
			lines.push('<details>');
			lines.push(
				`<summary><strong>` +
				`${lang}: ` +
				`${missing.length} missing, ${outdated.length} needs updating` +
				`</strong></summary>`
			);
			lines.push(``);
			if (missing.length > 0) {
				lines.push(`##### Missing`);
				lines.push(...missing.map(content =>
					`- [${content.subpath}](${content.githubUrl})`
				));
				lines.push(``);
			}
			if (outdated.length > 0) {
				lines.push(`##### Needs updating`);
				lines.push(...outdated.map(content =>
					`- [${content.subpath}](${content.githubUrl}) ` +
					`([outdated translation](${content.translations[lang].githubUrl}), ` +
					`[source change history](${content.translations[lang].sourceHistoryUrl}))`
				));
				lines.push(``);
			}
			lines.push(`</details>`);
			lines.push(``);
		});

		return lines.join('\n');
	}

	getTranslationStatusByContent ({ pages }) {
		const sourcePages = pages[this.sourceLanguage];
		const arrContent = [];

		Object.keys(sourcePages).forEach(subpath => {
			const sourcePage = sourcePages[subpath];
			if (!sourcePage.i18nReady)
				return;
			
			const content = {
				subpath,
				sourcePage,
				githubUrl: this.getPageUrl({ lang: this.sourceLanguage, subpath }),
				translations: {},
			};

			this.targetLanguages.forEach(lang => {
				const i18nPage = pages[lang][subpath];
				content.translations[lang] = {
					page: i18nPage,
					isMissing: !i18nPage,
					isOutdated: i18nPage && sourcePage.lastMajorChange > i18nPage.lastChange,
					githubUrl: this.getPageUrl({ lang, subpath }),
					sourceHistoryUrl: this.getPageUrl({
						lang: 'en',
						subpath,
						type: 'commits',
						query: i18nPage ? `?since=${i18nPage.lastChange}` : '',
					}),
				};
			});

			arrContent.push(content);
		});

		return arrContent;
	}

	getPageUrl ({ type = 'blob', refName = 'main', lang, subpath, query = '' }) {
		const noDotSrcDir = this.pageSourceDir.replace(/^.\//, '');
		return `/${this.githubRepo}/${type}/${refName}` +
			`/${noDotSrcDir}/${lang}/${subpath}${query}`;
	}

	/**
	 * Renders a footer that informs about the automated nature of this issue
	 * and includes our state data.
	 */
	renderAutomatedIssueFooter ({ message, state }) {
		return dedent`

			##
			<h6>
			<i>${message}</i><br/><br/>
			<sub><details><summary><i>(Expand to see internal state data)</i></summary>

			&nbsp;
			${this.renderStatePayloadForIssueBody(state)}
			</details>
			</sub>
			</h6>
		`;
	}

	/**
	 * Converts the given `state` to JSON and wraps it in a fenced code block
	 * with our expected payload marker.
	 */
	renderStatePayloadForIssueBody (state) {
		return '\n```json stateData\n' + JSON.stringify(state, true, 2) + '\n```';
	}
}

const githubTranslationStatus = new GitHubTranslationStatus({
	pageSourceDir: './src/pages',
	sourceLanguage: 'en',
	targetLanguages: ['de', 'es', 'fr', 'pt-BR'],
	githubToken: process.env.GITHUB_TOKEN,
	githubRepo: process.env.GITHUB_REPOSITORY,
	githubRefName: process.env.GITHUB_REF_NAME,
	issueTitle: '[i18n] Translation Status Overview',
});

githubTranslationStatus.update();
