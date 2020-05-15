# Introducción

Hay dos componentes involucrados en la definición del webworker:

- El script encargado de gestionar el registro. `miServiceWorkerHelper` lo he creado a partir del script que se genera automáticamente. `serviceWorker`
- El worker propiamente dicho

## Service Worker

El service worker es un componente de software orientado a eventos. Una vez se registra un worker, se irán disparando una seríe de eventos que podremos utilizar para definir el comportamiento del worker

### Registro

En `miServiceWorkerHelper` se exportan dos métodos, uno para registrar y otro para desregistrar.

Registramos el worker indicando donde poder encontrar el script, y cual es su contexto. El contexto define sobre que peticiones intervendrá el worker. En este caso el contexto que hemos definido es `/api`, de modo que peticiones hechas sobre este subdomicion serán gestionadas por el worker:

```js
navigator.serviceWorker.register(swUrl,{scope:'/api/'})
.then(registration => {
    console.log('Registrando Worker => registrado: ', registration.scope);
```

Una vez registrado, podemos interceptar el evento de actualización, que corresponde al caso en el que el worker se ha actualizado:

```js
registration.onupdatefound = () => {
const installingWorker = registration.installing;
if (installingWorker == null) {
    return;
}
installingWorker.onstatechange = () => {
    if (installingWorker.state === 'installed') {
    console.log('Registrando Worker => instalado');
    if (navigator.serviceWorker.controller) {
        console.log('Registrando Worker => Se han descargado datos que estaran disponibles la proxima vez que se abra la aplicación. https://bit.ly/CRA-PWA');
```

### Instalación

En el folder `public` tenemos el script con el worker, `miserviceworker.js`. Lo hemos indicado en el directorio `public` de modo que será tratado como un asset más de la aplicación, al mismo nivel que `index.html`.

Una vez hemos registrado el worker podemos subscribirnos a sus eventos. El primero, instalación:

```js
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            // Open a cache and cache our files
            return cache.addAll(urlsToCache);
```

En este caso lo que estamos haciendo es usar la api de cache para almancenar en ella las repuestas que obtengamos en las urls indicadas en `urlsToCache`:

```js
var urlsToCache = [
    '/api/food?q=chicken',
    '/api/food?q=hamburger'
];
```

Abrimos, la cache con `caches.open`, y almacenamos las respuestas con `cache.addAll`. __SIEMPRE QUE NECESITEMOS GARDAR VALORES EN LA CACHE, TENDREMOS QUE ANTES ABRIR LA CACHE__.

### Activación

El siguiente evento será la activación del worker. Este evento señalara cuando el worker estara listo para actuar:

```js
//Activación
//self.addEventListener('activate', function (event) {
self.onactivate = function (event) {
    console.log('miserviceworker => El service worker esta activado (listo y funcionando!)');
    console.log('miserviceworker => Tomando el control');
    return self.clients.claim();
}
```

__ES IMPORTANTE DESTACAR__ que debemos forzar a que el worker se active, usando __`self.clients.claim()`__.

### Fetch

Cuando se haga una petición desde la aplicación, a un recurso en el scope del worker, en este caso `/api/`, la petición es interceptada por el worker - que actua como proxy. Veamos nuestra implementación:

```js
self.onfetch = function (event) {
    console.log("miserviceworker => onfetch: ", event.request.url);
    
    event.respondWith((async function () {
        valorEnCache=await caches.match(event.request)
        if (valorEnCache){
            console.log("miserviceworker => fetch encontrado en cache!");
            return valorEnCache;
        }
```

Lo que hacemos es comprobar en la cache si tenemos almacenada la petición, y si la tenemos retornamos el valor desde el cache. En caso de no estar presente en la cache:

```js
        else {
            console.log("miserviceworker => fetch no encontrado en cache!");
            //Sino encontramos nada en la cache, hacemos la petición al servidor
            response=await fetch(event.request)
            if(response){
                //El body de la respuesta solo puede utilizarse una vez, por eso hacemos un clone, de modo que el cliente pueda utilizar la respuesta aunque se haya "leido" para guardarla en la cache
                var cache = await caches.open(CACHE_NAME);
                cache.put(event.request, response.clone());
                return response;
```

Lo que hacemos es hacer la petición, cuando la recibamos la guardamos en la cache, y la retornamos a la aplicación. Notese que tenemos que clonar el stream para guardarlo en la cache, porque el streams solo puede leerse una vez, de modo que si no lo clonasemos, lo que estaríamos retornando nulo.
