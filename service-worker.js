var cacheCounter = 0;
var remoteCounter = 0;
const cacheName = 'allFiles';
const filesToCache = [
  'https://sweetspot.glitch.me/',
  'L.js',
  'gapi.js',
  'a.js',
  'index.html',
  'index.html?launcher=true;homescreen=1',
  'cache-polyfill.js',
  'SVC.js',  
  'jsmediatags.js',
  'updateSTATEfunctions.js',
  'updateVIEWfunctions.js',
  'manifest.json',
  'prefixfree.js',
  'service-worker.js',
  'start.js',
  'style.css',
  'blackShuffle.png',
  'whiteShuffle.png',
  'favicon.png'
];
//------------------------------------------------//
self.addEventListener('install', installCache);
self.addEventListener('fetch', chooseCachedOrRemoteUrl);
//------------------------------------------------//
function installCache(eventObject){
  eventObject.waitUntil( filesAreCached() );
}
function filesAreCached(){
  self.caches
      .open(cacheName) // A STRING DEFINED ABOVE
      .then(cacheAllFiles) // A FUNCTION DEFINED BELOW
  ;
}
function cacheAllFiles(cache){
  if(!('addAll' in cache)){
    console.log('importing "addAll"');
    self.importScripts('cache-polyfill.js');
  }
  cache.addAll(filesToCache)
    .then(() => {
      console.log("\nAll files are cached: " + cache); 
    })
  ; 
}
function chooseCachedOrRemoteUrl(fetchEventObject){
  console.log("choosing remote or cached:");
  console.log(fetchEventObject.request.url);
  fetchEventObject.respondWith(    
      caches.match(fetchEventObject.request)
        .then(function(response){
          console.log('response: ' + response)
          let message = !!response ? "loading CACHED file: " + ++cacheCounter: "loading REMOTE file: " + ++remoteCounter;
          console.log(message) ;
          return (response || fetch(fetchEventObject.request));
        })      
    )
}