import fs from 'node:fs/promises'
import type { CollectionEntry } from 'astro:content'

async function generateQuestions(slug: CollectionEntry<'docs'>['slug']) {
  // TODO: implement check for existing questions
  // TODO: implement transform step for answer to normalize the format
  const href = `https://docs.astro.build/${slug}/`
  const body = await fs.readFile(`src/content/docs/${slug}.mdx`, 'utf-8')

	const prompt = `What are some questions that the following Astro Docs page answers? Include a link to the specific section that answers the question, and use only the anchor link slug as the link text. Do not use the word "ANSWER" for the answer, just start with the answer directly. In the last line of your response include a keyword that could be used as a search term on other sites, in the format "Keyword: KEYWORD" ${href}`;

	const res = await fetch(`https://api.kapa.ai/query/v1?query=${encodeURI(prompt)}`, {
		headers: {
			'X-API-TOKEN': process.env.KAPA_API_KEY!,
		},
	});
  const { answer }: { answer: string } = await res.json()

  // For debugging
  console.log(answer)

  const searchTerm = answer.trim().split('\n').at(-1)?.toLowerCase().split('keyword: ')[1]

  await fs.writeFile(`src/content/docs/${slug}.mdx`, `${body}

## Common questions

### Questions answered on this page

${answer.trim().split('\nKeyword: ')[0]}

### Community question and answers

Find people asking and answering questions about ${searchTerm} in Astro:

import CommunityLinks from '~/components/CommunityLinks.astro'

<CommunityLinks
  query="${searchTerm}"
  stackOverflow="Search for questions about ${searchTerm} on StackOverflow"
  reddit="Search for questions about ${searchTerm} on Reddit"
  discord="Visit our Discord <code>#support</code> channel"
/>
`, 'utf-8')
}

await generateQuestions('en/guides/content-collections');
