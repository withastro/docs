// Worker based on https://gist.github.com/JMPerez/8ca8d5ffcc0cc45a8b4e1c279efd8a94

const astroPriorityFiles = [
	/* $%_priority_files_%$ */
];
const astroOtherFiles = [
	/* $%_other_files_%$ */
];

const offlinePage = '/offline';

const CURRENT_CACHE = 'main-/* $%_hash_%$ */';

function logInfo(...toLog) {
	console.info('%c[Offline worker]', 'color: #ff5e00', ...toLog);
}

function clearAllOldCaches() {
	return caches.keys().then((cacheNames) => {
		return Promise.all(
			cacheNames.map((cacheName) => {
				if (cacheName !== CURRENT_CACHE) {
					logInfo(`Found old cache ${cacheName}. Removing...`);
					return caches.delete(cacheName);
				}
			})
		);
	});
}

// on activation we clean up the previously registered service workers
self.addEventListener('activate', (evt) => {
	logInfo(`Installing...`);

	evt.waitUntil(clearAllOldCaches());
});

async function addFiles() {
	caches.open(CURRENT_CACHE).then(async (cache) => {
		// The addAll method doesn't take the list order into account,
		// so we need to call it separately to be able to prioritise certain files
		await cache.addAll(astroPriorityFiles);
		logInfo('Priority files downloaded');

		await cache.addAll(astroOtherFiles);
		logInfo(`All assets downloaded. Ready to work offline.`);
	});
}

// on install we download the routes we want to cache for offline
self.addEventListener('install', async (evt) => {
	logInfo(`Installed. Downloading assets...`);

	await evt.waitUntil(addFiles());

	clearAllOldCaches();
});

// fetch the resource from the network
const fromNetwork = (request, timeout) =>
	new Promise((fulfill, reject) => {
		const timeoutId = setTimeout(reject, timeout);
		fetch(request).then((response) => {
			clearTimeout(timeoutId);
			fulfill(response);
			update(request);
		}, reject);
	});

// fetch the resource from the browser cache
const fromCache = (request) =>
	caches.open(CURRENT_CACHE).then((cache) =>
		cache.match(request).then(async (matching) => {
			const matchingRes = matching || (await cache.match(offlinePage));

			// If both the requested page & the offline page aren't cached, just don't
			// respond to the request and let the browser show it's offline UI
			if (!matchingRes) return;

			const modifiedRes = new Response(
				(await matchingRes.text()) +
					`<meta data-from-sw-cache="true" data-cache-name="${CURRENT_CACHE}" />`
			);
			return modifiedRes;
		})
	);

// cache the current page to make it available for offline
const update = (request) =>
	caches
		.open(CURRENT_CACHE)
		.then((cache) => fetch(request).then((response) => cache.put(request, response)));

// general strategy when making a request (eg if online try to fetch it
// from the network with a timeout, if something fails serve from cache)
self.addEventListener('fetch', (evt) => {
	evt.respondWith(fromNetwork(evt.request, 3000).catch(() => fromCache(evt.request)));
	evt.waitUntil(update(evt.request));
});
