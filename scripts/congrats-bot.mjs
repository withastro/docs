import { setOutput } from '@actions/core';

const { COMMIT_AUTHOR, COMMIT_ID, COMMIT_MESSAGE } = process.env;
setDiscordMessage(COMMIT_AUTHOR, COMMIT_ID, COMMIT_MESSAGE);

/**
 * @param {string} author The name of the commit author
 * @param {string} id The commit ID
 * @param {string} commitMsg A full commit message
 */
function setDiscordMessage(author, id, commitMsg) {
	const commitMessage = commitMsg
		.split('\n')
		.shift()
		.replaceAll('`', '');
	
	const coAuthors = commitMsg
		.split('\n')
		.slice(2)
		.filter((line) => line.match(/Co-authored-by: (.+) <.+>/))
		.map((line) => line.match(/Co-authored-by: (.+) <.+>/)[1]);

	let coAuthorThanks = '';
	if (coAuthors.length) {
		const names = makeList(coAuthors);
		coAuthorThanks = '\n' + getCoAuthorsMessage(names);
	}

	setOutput(
		'DISCORD_MESSAGE',
		` 🎉**Merged!**🎉  ${author}: [\`${commitMessage}\`](<https://github.com/withastro/docs/commit/${id}>)${coAuthorThanks}`
	);
}

/**
 * Generate a list like `'foo, bar and baz'` from an array
 * like `['foo', 'bar', 'baz']`.
 * @param {string[]} list List of words to format
 */
function makeList(list) {
	if (list.length === 1) return list[0];
	return list.slice(0, -1).join(', ') + ' & ' + list.at(-1);
}

/**
 * Get a randomised fun thank you message for co-authors.
 * @param {string} names Names of co-authors to be thanked
 */
function getCoAuthorsMessage(names) {
	const messages = [
		'_Thanks <names> for helping!_ ✨',
		'_<names> stepped up to lend a hand — thank you!_ 🙌',
		'_<names> with the assist!_ 💪',
		'_Couldn’t have done this without <names>!_ 💜',
		'_Made even better by <names>!_ 🚀',
		'_And the team effort award goes to… <names>!_ 🏆',
		'_Featuring contributions by <names>!_ 🌟'
	];
	const chosenMessage = messages[Math.floor(Math.random() * messages.length)];
	return chosenMessage.replace('<names>', names);
}
