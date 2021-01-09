'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "358e7a21faf3f8c5da1b6a2b81085517",
"index.html": "dfee7c1d33dfe764a88566e4526cfde5",
"/": "dfee7c1d33dfe764a88566e4526cfde5",
"main.dart.js": "a636b40be9d11679b32a0da9d62e54f7",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "b2b36909564cd9ac584825cf450fbeb7",
"assets/AssetManifest.json": "11403e2858aaa57776ad44d7762924fd",
"assets/NOTICES": "dc3583defb822ce16e785bb4d6a636a5",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/flutter_markdown/assets/logo.png": "67642a0b80f3d50277c44cde8f450e50",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/assets/images/github.png": "48eafe65e3b8976d2f5c6ea3bf1973e6",
"assets/assets/blog/%25E5%2590%25AF%25E5%258A%25A8%25E9%25A1%25B5%25E4%25BC%2598%25E5%258C%2596%25EF%25BC%258Crunloop%25E7%259A%2584%25E4%25B8%2580%25E4%25B8%25AA%25E5%25B0%258F%25E6%258A%2580%25E6%259C%25AF%25E7%2582%25B9.md": "869e7339f29a0f656258285c7163c998",
"assets/assets/blog/%25E6%2596%25B9%25E6%25B3%2595%25E4%25BA%25A4%25E6%258D%25A2%25E5%25AE%259E%25E7%258E%25B0App%25E5%259F%258B%25E7%2582%25B9-%25E5%258A%25A8%25E6%2580%2581%25E5%259F%258B%25E7%2582%25B9.md": "5a159672c4e731b00a9f079483e77fc0",
"assets/assets/blog/%25E6%2588%2591%25E6%2598%25AF%25E8%25BF%2599%25E6%25A0%25B7%25E5%25B0%2581%25E8%25A3%2585view%25E7%259A%2584.md": "d06936bc68b17062766a87ff019db88f",
"assets/assets/blog/iOS%25E8%25B7%25AF%25E7%2594%25B1%25E5%25BC%2595%25E5%2585%25A5%25E5%258F%258A%25E9%2581%2587%25E5%2588%25B0%25E7%259A%2584%25E9%2597%25AE%25E9%25A2%2598.md": "82ce2da1cb0acebb7ee0764cfbbb4a66",
"assets/assets/blog/UITableView%25E5%2588%2597%25E8%25A1%25A8%25E4%25BC%2598%25E5%258C%2596.md": "2c091b0e871035f2999b616e0cd2b32c",
"assets/assets/blog/xcassets%25E7%25AE%2580%25E4%25BB%258B.md": "33e4c51ac89fff9feaf830a720fa2afa",
"assets/assets/blog/CocoaPods%25E6%2580%25BB%25E7%25BB%2593-%25E5%2591%25BD%25E4%25BB%25A4%25EF%25BC%258C%25E4%25BD%25BF%25E7%2594%25A8%25EF%25BC%258C%25E5%2588%259B%25E5%25BB%25BA%25E5%25BA%2593%25EF%25BC%258C%25E5%2588%259B%25E5%25BB%25BA%25E7%25A7%2581%25E6%259C%2589%25E4%25BB%2593%25E5%25BA%2593.md": "19e1f12bf8ea9389316157677ebcabdc",
"assets/assets/blog/%25E4%25BB%25A3%25E7%25A0%2581%25E8%25AF%2584%25E5%25AE%25A1.md": "acc7a5e811c18a7e21072fef644334b3",
"assets/assets/blog/%25E6%25B5%2585%25E6%25B7%25A1iOS%25E5%2588%2597%25E8%25A1%25A8%25E5%2588%2586%25E9%25A1%25B5%25E6%2595%25B0%25E6%258D%25AE%25E7%25AE%25A1%25E7%2590%2586.md": "70624b06c79ce52a10a09cb0460296ee",
"assets/assets/blog/UITableView%25E5%2592%258CUICollectionView%25E5%25A4%259A%25E7%25A7%258D%25E7%25B1%25BB%25E5%259E%258Bcell%25E5%25A4%2584%25E7%2590%2586%25EF%25BC%258C%25E6%259B%25B4%25E5%25A5%25BD%25E5%259C%25B0%25E7%25BB%2584%25E7%25BB%2587%25E4%25BB%25A3%25E7%25A0%2581.md": "135037f60e58d6e5b877ca8576069f88",
"assets/assets/blog/iOS-%25E5%258A%25A8%25E7%2594%25BB.md": "758f404851cba0721fc8cb656f39bc45",
"assets/assets/blog/RxSwift%25E4%25B8%25AD%25E7%259A%2584Subject%25EF%25BC%2588PublishSubject-BehaviorSubject-ReplaySubject-Variable%25EF%25BC%2589.md": "3e280cf77ff871168d0022dadda32d2f",
"assets/assets/blog/URL%25E6%258B%25A6%25E6%2588%25AA%25E8%25BD%25AC%25E6%258D%25A2%25E6%2588%2590%25E6%259C%25AC%25E5%259C%25B0%25E8%25B7%25AF%25E7%2594%25B1%25E6%25A8%25A1%25E5%259D%2597.md": "328a9e4b67d4c563d6399123974ac695",
"assets/assets/blog/catalog.json": "895940357e51dc7f36c635d2b82c99bf",
"assets/assets/blog/MVVM%25E4%25B8%25AD%25E4%25BD%25BF%25E7%2594%25A8RACCommand%25E5%25B0%2581%25E8%25A3%2585%25E7%25BD%2591%25E7%25BB%259C%25E8%25AF%25B7%25E6%25B1%2582.md": "ee248273c9a762e777872129a0464761"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
