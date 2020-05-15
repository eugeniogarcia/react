var CACHE_NAME="comida";
var urlsToCache = [
    '/api/food?q=chicken',
    '/api/food?q=hamburger'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            // Open a cache and cache our files
            return cache.addAll(urlsToCache);
        })
    );
});

//Activación
//self.addEventListener('activate', function (event) {
self.onactivate = function (event) {
    console.log('miserviceworker => El service worker esta activado (listo y funcionando!)');
    console.log('miserviceworker => Tomando el control');
    return self.clients.claim();
}

//Fetch
//self.addEventListener('fetch', function (event) {
self.onfetch = function (event) {
    console.log("miserviceworker => onfetch: ", event.request.url);
    
    event.respondWith((async function () {
        valorEnCache=await caches.match(event.request)
        if (valorEnCache){
            console.log("miserviceworker => fetch encontrado en cache!");
            return valorEnCache;
        } 
        else {
            console.log("miserviceworker => fetch no encontrado en cache!");
            //Sino encontramos nada en la cache, hacemos la petición al servidor
            response=await fetch(event.request)
            if(response){
                //El body de la respuesta solo puede utilizarse una vez, por eso hacemos un clone, de modo que el cliente pueda utilizar la respuesta aunque se haya "leido" para guardarla en la cache
                var cache = await caches.open(CACHE_NAME);
                cache.put(event.request, response.clone());
                return response;
            }
            else{
                console.log("Error en la busqueda: ",err);
            }
        }
    })());
}