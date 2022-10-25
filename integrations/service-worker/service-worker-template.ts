// Worker based on https://gist.github.com/JMPerez/8ca8d5ffcc0cc45a8b4e1c279efd8a94

/// <reference lib="webworker" />

// Force typescript to treat this file like a module, which will let us re-type `self`.
export type {};

//Use correct type for `self` inside of a service worker.
declare const self: ServiceWorkerGlobalScope;

// The bare minimum files needed to show an offline page
const astroPriorityFiles: string[] = [
	/* $%_priority_files_%$ */
];

// All other files, including assets AND localised pages
const astroOtherFiles: string[] = [
	/* $%_other_files_%$ */
];

// The cache to store files in
const currentCache = 'main-/* $%_hash_%$ */';

// The page shown when the requested page isn't available.
const offlinePage = (language = 'en') => `/${language}/offline/`;

// The response sent when even the offline pages aren't cached
const lastResortResponse = () =>
	new Response(
		"No matching pages could be found in the cache. Please try again when you're back online."
	);

// The regex to detect if a path is localised
const languagePathRegEx = /^\/([a-zA-Z]{2}(?:-[a-zA-Z]{2})?)\//;

// The amount of time after which to give up when
// fetching a file from the network.
const networkTimeout = 2500;

let activeDownloads = 0;

async function downloadStarted() {
	activeDownloads++;
	if (activeDownloads === 1) {
		// Send download started message to all window clients

		await sendMessageToAllWindows('download started');
	}
}

async function downloadFinished() {
	activeDownloads--;
	if (activeDownloads === 0) {
		// Send download finished message to all window clients

		await sendMessageToAllWindows('download finished');
	}
}

async function sendMessageToAllWindows(name: string, messageExtras?: object) {
	// Send message to all window clients

	const allClients = await self.clients.matchAll();

	for (const client of allClients) {
		client.postMessage({ ...messageExtras, name, from: 'service worker' });
	}
}

function logInfo(...toLog) {
	console.info('%c[Offline worker]', 'color: #7e22ce', ...toLog);
}

function logWarning(...toLog) {
	console.warn('%c[Offline worker]', 'color: #ff5e00', ...toLog);
}

async function clearAllOldCaches() {
	const cacheNames = await caches.keys();

	return await Promise.all(
		cacheNames.map((cacheName) => {
			if (cacheName !== currentCache) {
				logInfo(`Found old cache ${cacheName}. Removing...`);
				return caches.delete(cacheName);
			}
		})
	);
}

async function addPriorityFiles() {
	logInfo('Downloading priority files...');

	try {
		const cache = await caches.open(currentCache);
		downloadStarted();
		await cache.addAll(astroPriorityFiles);
		downloadFinished();

		logInfo('Priority files downloaded.');
	} catch (error) {
		logWarning(`Error downloading priority files: ${error}`);
	}
}

async function addNonPriorityNonLanguageFiles() {
	logInfo(`Downloading non-localised non-priority files...`);

	try {
		const cache = await caches.open(currentCache);

		const filesToAdd = astroOtherFiles.filter((file) => {
			// Don't download files that have a language prefix
			if (languagePathRegEx.test(file)) return false;

			// Download other files
			return true;
		});

		downloadStarted();
		await cache.addAll(filesToAdd);
		downloadFinished();

		logInfo('Non-localised non-priority files downloaded.');
	} catch (error) {
		logWarning(`Error downloading non-localised non-priority files: ${error}`);
	}
}

async function addLanguage(languageKey: string) {
	logInfo(`Downloading ${languageKey} files...`);

	try {
		const cache = await caches.open(currentCache);

		const filesToAdd = astroOtherFiles.filter((file) => {
			// Download files in the selected language
			if (file.startsWith(`/${languageKey}`)) return true;

			// Don't download other files
			return false;
		});

		downloadStarted();
		await cache.addAll(filesToAdd);
		downloadFinished();

		logInfo(`${languageKey} files downloaded.`);
	} catch (error) {
		logWarning(`Error downloading ${languageKey} files: ${error}`);
	}
}

// Fetch the resource from the network
async function fromNetwork(request: Request): Promise<Response | undefined> {
	try {
		// AbortSignal for cancelling the network request after
		// the timeout runs out.
		// Also can't destructure because then calling abort is a function
		// invocation not a method invocation, and that causes issues
		// when the `this` context is lost because of `setTimeout`.
		const controller = new AbortController();

		const timeoutId = setTimeout(controller.abort, networkTimeout);

		const response = await fetch(request, { signal: controller.signal });

		clearTimeout(timeoutId);

		updateCache(request, response.clone());

		return response;
	} catch (error) {
		logWarning(`Failed to get file from network: ${error}`);
	}
}

async function getOfflinePage(request: Request): Promise<Response> {
	const cache = await caches.open(currentCache);

	const url = new URL(request.url);
	const match = url.pathname.match(languagePathRegEx);
	const language = match ? match[1] : 'en';
	logInfo(match, language);

	const languageOfflinePage = await cache.match(offlinePage(language));
	logInfo(languageOfflinePage);
	if (languageOfflinePage) return languageOfflinePage;

	return (await cache.match(offlinePage())) || lastResortResponse();
}

// Fetch the resource from the cache
async function fromCache(request: Request): Promise<Response> {
	const cache = await caches.open(currentCache);

	const matching = await cache.match(request);
	const matchingRes = matching || (await getOfflinePage(request));

	// These headers might be useful for debugging, but not much else.
	matchingRes.headers.append('X-From-SW-Cache', 'true');
	matchingRes.headers.append('X-SW-Cache-name', currentCache);

	if (matchingRes.headers.get('Content-Type')?.startsWith('text/html')) {
		const body = await matchingRes.text();
		// This meta tag can be used by page js to detect that the page was served
		// from the offline cache.
		const bodyWithMetaTag =
			body + `<meta data-from-sw-cache="true" data-sw-cache-name="${currentCache}" />`;

		// Basically a clone of the original response, with a custom body
		return new Response(bodyWithMetaTag, {
			headers: matchingRes.headers,
			status: matchingRes.status,
			statusText: matchingRes.statusText,
		});
	}

	return matchingRes;
}

// Cache the current page to make it available for offline
function updateCache(request: Request, response: Response): Promise<void>;
function updateCache(request: Request): Promise<void>;
async function updateCache(arg1: Request, arg2?: Response) {
	const cache = await caches.open(currentCache);

	try {
		if (arg2 instanceof Request) await cache.put(arg1, arg2);
		else await cache.put(arg1, await fetch(arg1));
	} catch (error) {
		logWarning(`Failed to update cached file: ${error}`);
	}
}

// On install we download the priority files only,
// so that we can start handling requests as soon as possible
self.addEventListener('install', async (event) => {
	logInfo(`Installed.`);

	self.skipWaiting();

	event.waitUntil(addPriorityFiles());
});

// Once the priority files are downloaded and the service worker
// is activated, we can start downloading the non-priority files
// and cleaning up old caches.
self.addEventListener('activate', async (event) => {
	logInfo('Activated.');

	self.clients.claim();

	event.waitUntil(
		addNonPriorityNonLanguageFiles().then(() => sendMessageToAllWindows('offline ready'))
	);

	event.waitUntil(clearAllOldCaches());
});

// General strategy when making a request (eg if online try to fetch it
// from the network with a timeout, if something fails serve from cache).
// Also this function can't be async because that can lead to loads of weird
// issues with the browser 'responding' to the event when `event.respondWith`
// hasn't actually been called.
self.addEventListener('fetch', (event) => {
	const request: Request = event.request;
	const url = new URL(request.url);

	// Only cache GET requests. All other methods (including OPTIONS) should never be cached.
	// Also only cache requests to the same origin. This will avoid caching
	// analytics scripts and so on.
	if (request.method !== 'GET' || url.origin !== location.origin)
		return event.respondWith(fetch(request));

	event.respondWith(
		fromNetwork(request).then((response) => {
			if (!response) return fromCache(request);
			return response;
		})
	);
});

self.addEventListener('message', async (event) => {
	if (typeof event.data !== 'object') return;
	if (!('name' in event.data)) return;

	switch (event.data.name) {
		case 'download language':
			{
				if (!('lang' in event.data)) return;
				if (typeof event.data.lang !== 'string') return;

				const languageKey = event.data.lang as string;
				addLanguage(languageKey);
			}
			break;
		case 'download page':
			{
				if (!('path' in event.data)) return;
				if (typeof event.data.path !== 'string') return;

				const pathToAdd = event.data.path as string;

				logInfo(`Downloading requested page: ${pathToAdd}`);

				try {
					const cache = await caches.open(currentCache);
					downloadStarted();
					await cache.add(pathToAdd);
					downloadFinished();
				} catch (error) {
					logWarning(`Failed to download requested page ${pathToAdd}: ${error}`);
				}
			}
			break;
		default:
			logInfo(`Unknown message from client:`, event.data);
			break;
	}
});
