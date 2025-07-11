import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { toReqRes, toFetchResponse } from 'fetch-to-node';
import z from 'astro/zod';
import type { Config } from '@netlify/edge-functions';

const apiKey = Netlify.env.get('KAPA_API_KEY');
const projectId = Netlify.env.get('KAPA_PROJECT_ID');
const integrationId = Netlify.env.get('KAPA_INTEGRATION_ID');

if (!apiKey || !projectId || !integrationId) {
	throw new Error(
		'Missing required environment variables: KAPA_API_KEY, KAPA_PROJECT_ID, or KAPA_INTEGRATION_ID'
	);
}

interface QuestionResponse {
	answer: string;
	relevant_sources: Array<{
		source_url: string;
		title: string;
		contains_internal_data: boolean;
	}>;
}

interface SearchResponse {
	search_results: Array<{
		title: string;
		source_url: string;
		content: string;
		source_type: string;
	}>;
}

function getServer(): McpServer {
	const server = new McpServer(
		{
			name: 'Astro Docs server',
			version: '1.0.0',
		},
		{
			capabilities: {
				logging: {},
			},
		}
	);
	server.tool(
		'ask_astro_question',
		'Ask a technical question about Astro',
		{ query: z.string().describe('The question to ask about Astro') },
		async ({ query }) => {
			if (!query) {
				throw new Error('Query is required');
			}
			const result = await sendKapaRequest<QuestionResponse>('chat', query);
			if ('error' in result) {
				return formatResponse(result);
			}
			return formatResponse({
				answer: result.answer,
				relevant_sources: result.relevant_sources.map(({ source_url, title }) => ({
					source_url,
					title,
				})),
			});
		}
	);

	server.tool(
		'search_astro_docs',
		'Search official Astro docs',
		{ query: z.string().describe('Search query') },
		async ({ query }) => {
			if (!query) {
				throw new Error('Query is required');
			}
			const result = await sendKapaRequest<SearchResponse>('search', query);
			return formatResponse(result);
		}
	);
	return server;
}

async function sendKapaRequest<T = unknown>(
	action: string,
	query: string
): Promise<T | { error: string }> {
	const url = `https://api.kapa.ai/query/v1/projects/${projectId}/${action}/`;

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-API-KEY': apiKey!,
		},
		body: JSON.stringify({
			query,
			integration_id: integrationId,
		}),
	});
	if (!response.ok) {
		const errorText = await response.text();
		console.error(`Kapa API error: ${errorText}`);
		return {
			error: 'Error: Unable to fetch data from API. Please try again later.',
		};
	}
	return await response.json();
}

function formatResponse(data: unknown): {
	content: Array<{ type: 'text'; text: string }>;
} {
	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(data, null, 2),
			},
		],
	};
}

// Netlify Edge Function Handler
export default async function handler(req: Request) {
	try {
		const { req: nodeReq, res: nodeRes } = toReqRes(req);
		const server = getServer();
		const transport = new StreamableHTTPServerTransport({
			sessionIdGenerator: undefined, // Stateless mode
		});
		await server.connect(transport);

		// Parse request body as JSON
		const body = await req.json();

		// Handle the request through the transport
		await transport.handleRequest(nodeReq, nodeRes, body);

		// Handle response closing
		nodeRes.on('close', () => {
			transport.close();
			server.close();
		});

		// Convert Node.js ServerResponse back to Web API Response
		return toFetchResponse(nodeRes);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error('Error in MCP server:', errorMessage);
		return Response.json(formatResponse({ error: errorMessage }), {
			status: 500,
		});
	}
}

export const config: Config = {
	path: '/mcp',
	method: 'POST',
};
