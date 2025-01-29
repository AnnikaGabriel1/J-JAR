// Set a name for the current cache
var cacheName = 'sequencer_v12'; 

// Default files to always cache

var cacheFiles = [
	'./',
	'/manifest.json',
   '/index.html',
   '/favicon.ico',
   '/modules/lib.js',
   '/data/load-data.html',
   '/data/save-data.html',
   '/modules/db.js',
   '/modules/install.js',
   '/modules/loadData.js',
   '/modules/saveData.js',
   '/modules/idb-src.min.js',
   '/modules/main.js',
   '/modules/rec.js',
   '/js/app.js',
   '/js/sound-map.js',
   '/css/fonts.css',
   '/css/item-styles.css',
   '/css/stylesheet.css',
   '/images/icons/icon-512x512.png',
   '/logo/logo_color.svg',
   '/logo/Logo_Schwarz.svg',
	'/audio/alien_1.mp3',
	'/audio/whisk_1.mp3',
	'/audio/bass_1.mp3',
	'/audio/bass-bounce_1.mp3',
	'/audio/bass-guitar_1.mp3',
	'/audio/bells-electric_1.mp3',
	'/audio/call_1.mp3',
	'/audio/clap_1.mp3',
	'/audio/cowbell_1.mp3',
	'/audio/drift_1.mp3',
	'/audio/e-piano_1.mp3',
	'/audio/elephant-bass_1.mp3',
	'/audio/error_1.mp3',
	'/audio/fox_1.mp3',
	'/audio/ghost_1.mp3',
	'/audio/glass_1.mp3',
	'/audio/mosquito_1.mp3',
	'/audio/night_1.mp3',
	'/audio/night-lounge_1.mp3',
	'/audio/slurp_1.mp3',
	'/audio/snake_1.mp3',
	'/audio/spotlight_1.mp3',
	'/audio/steeldrum_1.mp3',
	'/audio/taxi_1.mp3',
	'/audio/tennis_1.mp3',
	'/audio/tom_1.mp3'

];




self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Installed');

    // e.waitUntil Delays the event until the Promise is resolved
    e.waitUntil(

    	// Open the cache
	    caches.open(cacheName).then(function(cache) {

	    	// Add all the default files to the cache
			console.log('[ServiceWorker] Caching cacheFiles');
			return cache.addAll(cacheFiles);
	    })
	); // end e.waitUntil
});


self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activated');

    e.waitUntil(

    	// Get all the cache keys (cacheName)
		caches.keys().then(function(cacheNames) {
			return Promise.all(cacheNames.map(function(thisCacheName) {

				// If a cached item is saved under a previous cacheName
				if (thisCacheName !== cacheName) {

					// Delete that cached file
					console.log('[ServiceWorker] Removing Cached Files from Cache - ', thisCacheName);
					return caches.delete(thisCacheName);
				}
			}));
		})
	); // end e.waitUntil

});


self.addEventListener('fetch', function(e) {
	console.log('[ServiceWorker] Fetch', e.request.url);

	// e.respondWidth Responds to the fetch event
	e.respondWith(

		// Check in cache for the request being made
		caches.match(e.request)


			.then(function(response) {

				// If the request is in the cache
				if ( response ) {
					console.log("[ServiceWorker] Found in Cache", e.request.url, response);
					// Return the cached version
					return response;
				}

				// If the request is NOT in the cache, fetch and cache

				var requestClone = e.request.clone();
				return fetch(requestClone)
					.then(function(response) {

						if ( !response ) {
							console.log("[ServiceWorker] No response from fetch ")
							return response;
						}

						var responseClone = response.clone();

						//  Open the cache
						caches.open(cacheName).then(function(cache) {

							// Put the fetched response in the cache
							cache.put(e.request, responseClone);
							console.log('[ServiceWorker] New Data Cached', e.request.url);

							// Return the response
							return response;
			
				        }); // end caches.open

					})
					.catch(function(err) {
						console.log('[ServiceWorker] Error Fetching & Caching New Data', err);
					});


			}) // end caches.match(e.request)
	); // end e.respondWith
});
