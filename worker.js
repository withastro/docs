/* global URL, Response */
export default {
	async fetch(request, env) {
		const response = await env.ASSETS.fetch(request);

		if (response.status === 404) {
			const url = new URL(request.url);
			const firstSegment = url.pathname.split('/')[1];
			if (firstSegment) {
				const localizedNotFound = await env.ASSETS.fetch(
					new URL(`/${firstSegment}/404/index.html`, url.origin)
				);
				if (localizedNotFound.status === 200) {
					return new Response(localizedNotFound.body, {
						status: 404,
						headers: localizedNotFound.headers,
					});
				}
			}
		}

		return response;
	},
};
