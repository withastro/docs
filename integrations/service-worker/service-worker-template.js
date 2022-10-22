const astroRoutes = [
	/* $%_routes_%$ */
];

const offlinePage = '/offline/';

const cacheFiles = [...astroRoutes, offlinePage];

const CURRENT_CACHE = 'main-' + '/* $%_hash_%$ */';

// Worker based on https://gist.github.com/JMPerez/8ca8d5ffcc0cc45a8b4e1c279efd8a94

// on activation we clean up the previously registered service workers
self.addEventListener('activate', (evt) =>
	evt.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheName !== CURRENT_CACHE) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	)
);

// on install we download the routes we want to cache for offline
self.addEventListener('install', (evt) =>
	evt.waitUntil(
		caches.open(CURRENT_CACHE).then((cache) => {
			return cache.addAll(cacheFiles);
		})
	)
);

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
	caches
		.open(CURRENT_CACHE)
		.then((cache) => cache.match(request).then((matching) => matching || cache.match(offlinePage)));

// cache the current page to make it available for offline
const update = (request) =>
	caches
		.open(CURRENT_CACHE)
		.then((cache) => fetch(request).then((response) => cache.put(request, response)));

// general strategy when making a request (eg if online try to fetch it
// from the network with a timeout, if something fails serve from cache)
self.addEventListener('fetch', (evt) => {
	evt.respondWith(fromNetwork(evt.request, 10000).catch(() => fromCache(evt.request)));
	evt.waitUntil(update(evt.request));
});
