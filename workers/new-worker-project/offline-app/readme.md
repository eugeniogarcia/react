# What is a Progressive Web App (PWA)

PWAs are web apps developed using a number of specific technologies and standard patterns to allow them __to take advantage of both web and native app features__. For example, web apps are more discoverable than native apps; it's a lot easier and faster to visit a website than to install an application, and you can also share web apps by sending a link.

On the other hand, __native apps are better integrated with the operating system and therefore offer a more seamless experience for the users__. You can install a native app so that it works offline, and users love tapping their icons to easily access their favorite apps, rather than navigating to it using a browser.

__PWAs give us the ability to create web apps that can enjoy these same advantages__.

## What makes an app a PWA?

An app could be considered a PWA when it meets certain requirements, or implements a set of given features: __works offline, is installable, is easy to synchronize, can send push notifications, etc__.

In addition, __there are tools to measure how complete (as a percentage) a web app is, such as Lighthouse__. By implementing various technological advantages, we can make an app more progressive, thus ending up with a higher Lighthouse score. But this is only a rough indicator.

There are some key principles a web app should try to observe to be identified as a PWA. It should be:

- __Discoverable__, so the __contents can be found through search engines__.

- __Installable__, so it __can be available on the device's home screen or app launcher__.

- __Linkable__, so __you can share it by sending a URL__.

- __Network independent__, so it __works offline or with a poor network connection__.

- Progressively enhanced, so it's still usable on a basic level on older browsers, but fully-functional on the latest ones. This is achieved using a combination of technologies: __Service Workers to control page requests__ (for example storing them offline), the __Cache API__ for storing responses to network requests offline (very useful for storing site assets), and __client-side data storage technologies__ such as Web Storage and IndexedDB to store application data offline

- __Re-engageable__, so it's able to __send notifications__ whenever there's new content available.

- __Responsively__ designed, so it's __usable on any device with a screen and a browser — mobile phones, tablets, laptops, TVs, refrigerators, etc__.

- __Secure__, so the connections between the user, the app, and your server are secured against any third parties trying to get access to sensitive data.

Offering these features and making use of all the advantages offered by web applications can create a compelling, highly flexible offering for your users and customers.

## Architecture of an app

There are two main, different approaches to rendering a website — on the server or on the client. They both have their advantages and disadvantages, and you can mix the two approaches to some degree.

- __Server-side rendering (SSR)__ means a website is rendered on the server, so it offers quicker first load, but navigating between pages requires downloading new HTML content. It works great across browsers, but it suffers in terms of time navigating between pages and therefore general perceived performance — loading a page requires a new round trip to the server.

- __Client-side rendering (CSR)__ allows the website to be updated in the browser almost instantly when navigating to different pages, but requires more of an initial download hit and extra rendering on the client at the beginning. The website is slower on an initial visit, but can be faster to navigate.

Mixing SSR with CSR can lead to the best results — you can render a website on the server, cache its contents, and then update the rendering on the client-side as and when needed. The first page load is quick because of the SSR, and the navigation between pages is smooth because the client can re-render the page with only the parts that have changed.

PWAs can be built using any approach you like, but some will work better than the others. The most popular approach is __the "app shell" concept__, which mixes SSR and CSR in exactly the way described above, and in addition follows the "offline first" methodology which we will explain in detail in upcoming articles and use in our example application. There is also a new approach involving the Streams API, which we'll mention briefly.

### App shell

The App shell concept is concerned with __loading a minimal user interface as soon as possible and then caching it so it is available offline for subsequent visits__ before then loading all the contents of the app. That way, the next time someone visits the app from the device, the UI loads from the cache immediately and any new content is requested from the server (if it isn't available in the cache already).

This structure is fast, and also feels fast as the user sees "something" instantly, instead of a loading spinner or a blank page. It also allows the website to be accessible offline if the network connection is not available.

We can control what is requested from the server and what is retrieved from the cache with a service worker, which will be explained in detail in the next article — for now let's focus on the structure itself.

### Different concept: streams

An entirely different approach to server or client-side rendering can be achieved with the Streams API. With a little help from service workers, streams can greatly improve the way we parse content.

The app shell model requires all the resources to be available before the website can start rendering. It's different with HTML, as the browser is actually streaming the data already and you can see when the elements are loaded and rendered on the website. To have the JavaScript "operational", however, it has to be downloaded in its entirety.

The Streams API allows developers to have direct access to data streaming from the server — if you want to perform an operation on the data (for example, adding a filter to a video), you no longer need to wait for all of it to be downloaded and converted to a blob (or whatever) — you can start right away. __It provides fine-grained control — the stream can be started, chained with another stream, cancelled, checked for errors, and more__.

## Service workers explained

__Service Workers are a virtual proxy between the browser and the network__. They finally fix issues that front-end developers have struggled with for years — most notably how to properly cache the assets of a website and make them available when the user's device is offline.

__They run on a separate thread from the main JavaScript code__ of our page, __and don't have any access to the DOM structure__. This introduces a different approach from traditional web programming — the API is non-blocking, and can send and receive communication between different contexts. You are able to give a Service Worker something to work on, and receive the result whenever it is ready using a Promise-based approach.

__They can do a lot more than "just" offering offline capabilities, including handling notifications, performing heavy calculations on a separate thread, etc__. Service workers are quite powerful as __they can take control over network requests, modify them, serve custom responses retrieved from the cache__, or synthesize responses completely.

### Security

Because they are so powerful, __Service Workers can only be executed in secure contexts (meaning HTTPS)__.

## Sample App

### CSS (style.css)

The CSS is also as plain as possible: it uses @font-face to load and use a custom font, and it applies some simple styling of the HTML elements. The overall approach is to have the design look good on both mobile (with a responsive web design approach) and desktop devices.

### The main app JavaScript (app.js)

The app.js file does a few things we will look into closely in the next articles. First of all it generates the content based on this template:

First of all it generates the content based on this template. It replaces parts of the string with the actual values retrieved from the data. the `replace` method relies on the use of a regular expression. In the regular expressions we use we rely on the `g` qualifier to retrieve all the instances that match the pattern at once - as opposed to just returning the first occurence:

```js
const template = `<article>
  <img src='data/img/placeholder.png' data-src='data/img/SLUG.jpg' alt='NAME'>
  <h3>#POS. NAME</h3>
  <ul>
  <li><span>Author:</span> <strong>AUTHOR</strong></li>
  <li><span>Twitter:</span> <a href='https://twitter.com/TWITTER'>@TWITTER</a></li>
  <li><span>Website:</span> <a href='http://WEBSITE/'>WEBSITE</a></li>
  <li><span>GitHub:</span> <a href='https://GITHUB'>GITHUB</a></li>
  <li><span>More:</span> <a href='http://js13kgames.com/entries/SLUG'>js13kgames.com/entries/SLUG</a></li>
  </ul>
</article>`;
let content = '';
for (let i = 0; i < games.length; i++) {
  let entry = template.replace(/POS/g, (i + 1))
    .replace(/SLUG/g, games[i].slug)
    .replace(/NAME/g, games[i].name)
    .replace(/AUTHOR/g, games[i].author)
    .replace(/TWITTER/g, games[i].twitter)
    .replace(/WEBSITE/g, games[i].website)
    .replace(/GITHUB/g, games[i].github);
  entry = entry.replace('<a href=\'http:///\'></a>', '-');
  content += entry;
}
document.getElementById('content').innerHTML = content;
```

It __registers a service worker__:

```js
if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/pwa-examples/js13kpwa/sw.js');
};
```

The next code block requests permission for __notifications__ when a button is clicked:

```js
const button = document.getElementById('notifications');
button.addEventListener('click', () => {
  Notification.requestPermission().then((result) => {
    if (result === 'granted') {
      randomNotification();
    }
  });
});
```

The last block creates notifications that display a randomly-selected item from the games list:

```js
function randomNotification() {
  const randomItem = Math.floor(Math.random() * games.length);
  const notifTitle = games[randomItem].name;
  const notifBody = `Created by ${games[randomItem].author}.`;
  const notifImg = `data/img/${games[randomItem].slug}.jpg`;
  const options = {
    body: notifBody,
    icon: notifImg,
  };

  new Notification(notifTitle, options);
  setTimeout(randomNotification, 30000);
}
```

### The service worker

The last file we will quickly look at is the service worker: sw.js — it first imports data from the games.js file (importScripts is part of the worker, and allows to load, import, other javascript files):

```js
self.importScripts('data/games.js');
```

Next, it creates a list of all the files to be cached, both from the app shell and the content:

```js
const cacheName = 'js13kPWA-v1';
const appShellFiles = [
  '/pwa-examples/js13kpwa/',
  '/pwa-examples/js13kpwa/index.html',
  '/pwa-examples/js13kpwa/app.js',
  '/pwa-examples/js13kpwa/style.css',
  '/pwa-examples/js13kpwa/fonts/graduate.eot',
  '/pwa-examples/js13kpwa/fonts/graduate.ttf',
  '/pwa-examples/js13kpwa/fonts/graduate.woff',
  '/pwa-examples/js13kpwa/favicon.ico',
  '/pwa-examples/js13kpwa/img/js13kgames.png',
  '/pwa-examples/js13kpwa/img/bg.png',
  '/pwa-examples/js13kpwa/icons/icon-32.png',
  '/pwa-examples/js13kpwa/icons/icon-64.png',
  '/pwa-examples/js13kpwa/icons/icon-96.png',
  '/pwa-examples/js13kpwa/icons/icon-128.png',
  '/pwa-examples/js13kpwa/icons/icon-168.png',
  '/pwa-examples/js13kpwa/icons/icon-192.png',
  '/pwa-examples/js13kpwa/icons/icon-256.png',
  '/pwa-examples/js13kpwa/icons/icon-512.png',
];
const gamesImages = [];
for (let i = 0; i < games.length; i++) {
  gamesImages.push(`data/img/${games[i].slug}.jpg`);
}
const contentToCache = appShellFiles.concat(gamesImages); //Une los dos arrays en uno
```

The next block __installs the service worker, which then actually caches all the files__ contained in the above list:

```js
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName); //abrimos la cache para guardar el resultado
    console.log('[Service Worker] Caching all: app shell and content');
    await cache.addAll(contentToCache); //Añade todo el contenido que debemos cachear en la cache.
  })());
});
```

Last of all, the service worker fetches content from the cache if it is available there, providing offline functionality:

```js
self.addEventListener('fetch', (e) => {
  e.respondWith((async () => {
    const r = await caches.match(e.request); //Comprueba si la petición esta en la cache
    console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
    if (r) return r; //Si la petición estaba en la cache, retorna el valor de la cache
    const response = await fetch(e.request); //... en caso contrario hace el fetch
    const cache = await caches.open(cacheName); //abrimos la cache para guardar el resultado
    console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
    cache.put(e.request, response.clone()); //Guarda en la cache el resultado. Hay que clonar el stream, porque una vez leido no se puede leer otra vez
    return response;
  })());
});
```

#### Lifecycle of a Service Worker

##### Registration

A service worker is basically a JavaScript file. One thing that differentiate a service worker file from a normal JavaScript file, is that __a service worker runs in the background, off the browser’s main UI thread__. Before we can start using service worker, we must register it as a background process. This is the first phase of the lifecycle. Since service workers are not yet supported in all browsers, we must first check to make sure the browser supports service workers. Below is a code we can use to register a service worker:

```js
if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./pwa-examples/js13kpwa/sw.js');
};
```

First, we check if the browser supports service workers, that is, if the navigator object has a serviceWorker property. Only when it’s supported would we register the service worker. The `register()` method takes the path to the service worker script and returns a promise.

At the point of registering a service worker, _we can also define the scope of the service worker_. The scope of a service worker determines the pages that the service worker can control. By default, the scope is defined by the location of the service worker script. In addition to accepting the path to the service worker script, the register() method can also accept an optional object, where we can define the scope of the service worker. Here, we define the scope of the service worker to /blog/, which will limit the service worker to only the blog directory.

```js
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {
        scope: '/blog/'
    })
    .then(function (registration) {
        console.log('Service worker registered!');
    })
    .catch(function (err) {
        console.log('Registration failed!');
    })
}
```

##### Installation

The fact that a service worker has been successfully registered doesn’t mean it has been installed. That’s where the installation phase of the lifecycle comes into play. __Upon successful registration of the service worker, the script is downloaded and then the browser will attempt to install the service worker__. The service worker __will only be installed in either of these cases__:

- The service worker hasn’t been registered before
- The service worker script changes (even if it’s by one byte).

__Once a service worker has been installed, an install event is fired__. We can listen for this event and perform some application0-specific tasks. For example, we could cache our application’s static assets at this point:

```js
// Installing Service Worker
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    console.log('[Service Worker] Caching all: app shell and content');
    await cache.addAll(contentToCache);
  })());
});
```

caches is a special CacheStorage object available in the scope of the given Service Worker to enable saving data — saving to web storage won't work, because web storage is synchronous. With Service Workers, we use the Cache API instead.

If the installation was successful, the service worker enters an installed state (though not yet active), during which it waits to take control of the page from the current service worker. It then moves on to the next phase in the lifecycle, which is the activation phase.

##### Activation

A service worker is not immediately activated upon installation. __A service worker will only be active (that is, be activated) in any of these cases__:

- If there is no service worker currently active
- If the self.skipWaiting() is called in the install event handler of the service worker script
- If the user refreshes the page

An example of using the skipWaiting() method to activate a service worker can look like below:

```js
self.addEventListener('install', function (event) {
    self.skipWaiting();

    event.waitUntil(
           // static assets caching
      );
});
```

An activate event is fired upon a service worker being active. Like the install event, we could also listen for the activate event and perform some application specific tasks. __There is also an activate event, which is used in the same way as install__. This event __is usually used to delete any files that are no longer necessary__ and clean up after the app in general. We don't need to do that in our app, so we'll skip it.

```js
self.addEventListener('activate', (e) => { //Cuando se activa el worker
  e.waitUntil(caches.keys().then((keyList) => { //Recupera todas las keys de la cache
    return Promise.all(keyList.map((key) => { //Con cada key...
      if (key === cacheName) { return; } //...comprobamos si es la key que usamos ahora, y sino es...
      return caches.delete(key); //...la borramos
    }))
  }));
});
```

##### Fetch

Responding to fetches. We also have a __fetch event__ at our disposal, which fires every time an HTTP request is fired off from our app. This is very useful, as it __allows us to intercept requests and respond to them with custom responses__. Here is a simple usage example:

```js
self.addEventListener('fetch', (e) => {
  e.respondWith((async () => {
    const r = await caches.match(e.request); //Comprueba si la petición esta en la cache
    console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
    if (r) return r; //Si la petición estaba en la cache, retorna el valor de la cache
    const response = await fetch(e.request); //... en caso contrario hace el fetch
    const cache = await caches.open(cacheName); //abrimos la cache para guardar el resultado
    console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
    cache.put(e.request, response.clone()); //Guarda en la cache el resultado. Hay que clonar el stream, porque una vez leido no se puede leer otra vez
    return response;
  })());
});
```

##### Idle

If the service worker after being active, does not receive any of the functional events mentioned above, it goes into an idle state. After being idle for some time, the service worker goes into a terminated state. This does not mean the service worker has been uninstalled or unregistered. In fact, the service worker will become idle again as soon as it begins to receive the fuctional events.

##### Updates

There is still one point to cover: how do you __upgrade a Service Worker when a new version of the app containing new assets is available?__ The version number in the cache name is key to this:

```js
var cacheName = 'js13kPWA-v1';
```

__A new service worker is installed in the background__, and __the previous one (v1) works correctly up until there are no pages using it__ — the new Service Worker is then activated and takes over management of the page from the old one.

- Clearing the cache. Remember the activate event we skipped? It can be used to clear out the old cache we don't need anymore:

```js
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keyList) => {
    return Promise.all(keyList.map((key) => {
      if (key === cacheName) { return; }
      return caches.delete(key);
    }))
  }));
});
```

##### Ejemplo

Veamos con un ejemplo lo que iría sucediendo:

|evento|Accion|Comentario|
|------|------|------|
|Primera vez|Registro -> Instala -> Activa|En el momento que se hace el registro, en paralelo se lanza la instalación, esto es, la descarga del worker, y su instalación. Una vez instalado se dispara el evento Instal. Como no hay ningún otro worker activo, se lanza la activación inmediatamente. Una vez activado se lanza el evento Activate|
|Segunda Vez|Registro|No se instala ni se activa, porque no ha habido cambios en el worker, y lo teníamos activado de la primera ejecución|
|Se cambia el worker|N/A||
|Tercera vez|Registro -> Instala|En el momento que se hace el registro, como se ha cambiado el worker, se lanza una petición para descargar la nueva versión del worker. Se dispara el evento Install una vez se ha intalado. Como hay una versión activa del worker, esta se mantiene en ejeución, y __no se activa la nueva versión__. La nueva version se activara si hacemos un refresh de la página, o si cerramos la página, la próxima vez que se abra. En las developer tools podemos ver las dos versiones del Worker|
|Cuarta vez|Registro -> Activación|La versión que estaba pendiente de activar, se activa. Se lanza el evento Activate|

### Placeholder image

When you include <img> elements in your HTML, then every referenced image will be fetched and downloaded during initial website access. It's not unusual to have megabytes of image data to download before announcing the site is ready, but this again creates a bad perception of performance. We don't need all of the images in the best possible quality at the very beginning of viewing the site.

Instead of having all the screenshots of games referenced in <img> element src attributes, which will force the browser to download them automatically, we can do it selectively via JavaScript. __The js13kPWA app uses a placeholder image instead__, which is small and lightweight - we have choosen a `png`, while the final paths to target images are stored in data-src attributes:

```html
const template = `<article>
  <img src='data/img/placeholder.png' data-src='data/img/SLUG.jpg' alt='NAME'>
```

We define the following helper to swap the place-holder image by the real one:

```js
const loadImages = (image) => { //lambda que procesa una imagen
  image.setAttribute('src', image.getAttribute('data-src')); //cambia el valor del atrobuto src con el valor del atributo data-src
  image.onload = () => { //cuando la imagen se ha cargado podemos borrar el atributo data-src
    image.removeAttribute('data-src');
  };
};
```

### Intersection Observer API

To apply the helper, we can do:

```js
  imagesToLoad.forEach((img) => {
    loadImages(img);
  });
```

But if the browser supports the `Intersection Observer API` api, we should rather use this api. __The Intersection Observer API provides a way to asynchronously observe changes in the intersection of a target element with an ancestor element or with a top-level document's viewport__.

Historically, detecting visibility of an element, or the relative visibility of two elements in relation to each other, has been a difficult task for which solutions have been unreliable and prone to causing the browser and the sites the user is accessing to become sluggish. As the web has matured, the need for this kind of information has grown. Intersection information is needed for many reasons, such as:

- Lazy-loading of images or other content as a page is scrolled.

- Implementing "infinite scrolling" web sites, where more and more content is loaded and rendered as you scroll, so that the user doesn't have to flip through pages.

- Reporting of visibility of advertisements in order to calculate ad revenues.

- Deciding whether or not to perform tasks or animation processes based on whether or not the user will see the result.

Implementing intersection detection in the past involved event handlers and loops calling methods like Element.getBoundingClientRect() to build up the needed information for every element affected. _Since all this code runs on the main thread, even one of these can cause performance problems_. When a site is loaded with these tests, things can get downright ugly.

Consider a web page that uses infinite scrolling. It uses a vendor-provided library to manage the advertisements placed periodically throughout the page, has animated graphics here and there, and uses a custom library that draws notification boxes and the like. Each of these has its own intersection detection routines, all running on the main thread. The author of the web site may not even realize this is happening, since they may know very little about the inner workings of the two libraries they are using. As the user scrolls the page, these intersection detection routines are firing constantly during the scroll handling code, resulting in an experience that leaves the user frustrated with the browser, the web site, and their computer.

__The Intersection Observer API lets code register a callback function that is executed whenever an element they wish to monitor enters or exits another element (or the viewport), or when the amount by which the two intersect changes by a requested amount__. This way, sites no longer need to do anything on the main thread to watch for this kind of element intersection, and the browser is free to optimize the management of intersections as it sees fit.

One thing the Intersection Observer API can't tell you: the exact number of pixels that overlap or specifically which ones they are; however, it covers the much more common use case of "If they intersect by somewhere around N%, I need to do something."

#### Intersection observer concepts and usage

The Intersection Observer API allows you to configure a callback that is called when either of these circumstances occur:

- A __target element intersects either the device's viewport or a specified element__. That specified element is called the root element or root for the purposes of the Intersection Observer API.

- The first time the observer is initially asked to watch a target element.

Typically, you'll want to watch for intersection changes with regard to the target element's closest scrollable ancestor, or, if the target element isn't a descendant of a scrollable element, the device's viewport. To watch for intersection relative to the device's viewport, specify null for root option. Keep reading for a more detailed explanation about intersection observer options.

__Whether you're using the viewport or some other element as the root, the API works the same way, executing a callback function you provide whenever the visibility of the target element changes so that it crosses desired amounts of intersection with the root__.

The degree of intersection between the target element and its root is the __intersection ratio__. This is a representation of the percentage of the target element which is visible as a value between 0.0 and 1.0.

Create the intersection observer by calling its constructor and passing it a callback function to be run whenever a threshold is crossed in one direction or the other:

```js
let options = {
  root: document.querySelector('#scrollArea'),
  rootMargin: '0px',
  threshold: 1.0
}

let observer = new IntersectionObserver(callback, options);
```

A threshold of 1.0 means that when 100% of the target is visible within the element specified by the root option, the callback is invoked.

The options object passed into the IntersectionObserver() constructor let you control the circumstances under which the observer's callback is invoked. It has the following fields:

- root. The element that is used as the viewport for checking visibility of the target. __Must be the ancestor of the target__. _Defaults to the browser viewport if not specified or if null_.

- rootMargin. __Margin around the root__. Can have values similar to the CSS margin property, e.g. "10px 20px 30px 40px" (top, right, bottom, left). The values can be percentages. This set of values serves to grow or shrink each side of the root element's bounding box before computing intersections. _Defaults to all zeros_.

- threshold. Either a single number or an array of numbers which indicate at what percentage of the target's visibility the observer's callback should be executed. If you only want to detect when visibility passes the 50% mark, you can use a value of 0.5. _If you want the callback to run every time visibility passes another 25%, you would specify the array [0, 0.25, 0.5, 0.75, 1]_. _The default is 0 (meaning as soon as even one pixel is visible, the callback will be run)_. A value of 1.0 means that the threshold isn't considered passed until every pixel is visible.

Once you have created the observer, you need to give it a target element to watch:

```js
let target = document.querySelector('#listItem');
observer.observe(target);
```

```js
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((items) => {//Definimos el callback y la opciones de observabilidad. En este caso no hemos especificado ninguna opción de observavilidad, así que se disparará el callback en cuanto alguno de los items observados "aparezca en el viewport"
    items.forEach((item) => {
      if (item.isIntersecting) {
        loadImages(item.target);
        observer.unobserve(item.target); //dejamos de observar este item
      }
    });
  });
  imagesToLoad.forEach((img) => {
    observer.observe(img);  //Indicamos que queremos observar cada una de las imagenes
  });
} else {
  imagesToLoad.forEach((img) => {
    loadImages(img);
  });
}
```

Las imagenes que no se ven en la pantalla no disparan el callback. Esto hace que cada imagen se descargue en el momento en que se empieza a ver - y mientras tanto, mostramos el place-holder

## How to make PWAs installable

We can allow users to __install the web app on mobile and desktop browsers__ that support doing so. The installed web app can then be launched by users just as if it were any native app. This article explains how to achieve this using the web app's manifest.

These technologies allow the app to be launched directly from the device's home screen, rather than the user having to open the browser and then navigate to the site by using a bookmark or typing the URL. Your web app can sit next to native applications as first class citizens. This makes the web app easier to access; additionally, you can specify that the app be launched in fullscreen or standalone mode, thus removing the default browser user interface that would otherwise be present, creating an even more seamless and native-like feel.

### Requirements

To make the web site installable, it needs the following things in place:

- __A web manifest__, with the correct fields filled in

- The web site to be served from a __secure (HTTPS) domain__

- An __icon__ to represent the app on the device

- A __service worker registered__, to allow the app to work offline (this is required only by Chrome for Android currently)

### The manifest file

The key element is a web manifest file, which lists all the information about the website in a JSON format.

It usually resides in the root folder of a web app. It contains useful information, such as the app's title, paths to different-sized icons that can be used to represent the app on an OS (such as an icon on the home screen, an entry in the Start menu, or an icon on the desktop), and a background color to use in loading or splash screens. This information is needed for the browser to present the web app properly during the installation process, as well as within the device's app-launching interface, such as the home screen of a mobile device.

The js13kpwa.webmanifest file of the js13kPWA web app is included in the <head> block of the index.html file using the following line of code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="utf-8">
 <title>js13kGames A-Frame entries</title>
 <meta name="description" content="A list of A-Frame entries submitted to the js13kGames 2017 competition, used as an example for the MDN articles about Progressive Web Apps.">
 <meta name="author" content="end3r">
 <meta name="theme-color" content="#B12A34">
 <meta name="viewport" content="width=device-width, initial-scale=1">
 <meta property="og:image" content="icons/icon-512.png">
 <link rel="shortcut icon" href="favicon.ico">
 <link rel="stylesheet" href="style.css">
 <link rel="manifest" href="js13kpwa.webmanifest">

...
```

The display property indicates how the app is displayed; can be fullscreen, standalone, minimal-ui, or browser.

### Add to home screen

"Add to home screen" (or a2hs for short) is a feature implemented by mobile browsers that takes the information found in an app's web manifest and uses them to represent the app on the device's home screen with an icon and name. This only works if the app meets all the necessary requirements, as described above.

When the user visits the PWA with a supporting mobile browser, it should display a notification (such as a banner or dialog box) indicating that it's possible to install the app as a PWA.

## Notifications. Two APIs, one goal

The __Push API__ and __Notifications API__ are two separate APIs, but they work well together when you want to provide engaging functionality in your app.__Push is used to deliver new content from the server to the app without any client-side intervention__, and its operation is __handled by the app's service worker__. __Notifications can be used by the service worker to show new information to the user__, or at least alert them when something has been updated.

They work outside of the browser window, just like service workers, so updates can be pushed and notifications can be shown when the app's page is out of focus or even closed.

### Notifications

Let's start with notifications — they can work without push, but are very useful when combined with them. Let's look at them in isolation to begin with. The notification is a short of alert that is handled by the ooss.

The navigator has to support Notifications:

```js
if (!("Notification" in window)) {
  alert("This browser does not support desktop notification");
  return;
}
```

__To show a notification, we have to request permission to do so first__. Instead of showing the notification immediately though, best practice dictates that we should show the popup when the user requests it by clicking on a button:

```js
const button = document.getElementById('notifications');
button.addEventListener('click', () => {
  Notification.requestPermission().then((result) => {
    if (result === 'granted') {
      randomNotification();
    }
  });
})
```

We can check whether permissions are or not granted by doing this:

```js
if (Notification.permission === "granted") {
```

__When the user confirms to receive notifications, the app can then show them__. The result of the user action can be default, granted or denied. The default option is chosen when the user won't make a choice, and the other two are set when the user clicks yes or no respectively.

### Push notifications

Push is more complicated than notifications — we need to subscribe to a server that will then send the data back to the app. __The app's Service Worker will receive data from the push server__, which can then be shown using the notifications system, or another mechanism if desired.

To be able to receive push messages, you have to have a service worker. __Inside the service worker, a push service subscription mechanism is created__.

```js
registration.pushManager.getSubscription().then( /* ... */ );
```

Once the user is subscribed, they can receive push notifications from the server.

From the server-side, the whole process has to be encrypted with public and private keys for security reasons — allowing everyone to send push messages unsecured using your app would be a terrible idea. See the Web Push data encryption test page for detailed information about securing the server. The server stores all the information received when the user subscribed, so the messages can be sent later on when needed.

To receive push messages, we can listen to the push event in the Service Worker file:

```js
self.addEventListener('push', (e) => { /* ... */ });
```

The data can be retrieved and then shown as a notification to the user immediately. This, for example, can be used to remind the user about something, or let them know about new content being available in the app.




## Como ejecutar la aplicación - en un servidor https

vamos a usar `local-web-server` para ejecutar el servidor que aloje la aplicación. Esta utilidad permite tambien exponer un host como __https__ usando un certificado que se incluye con la herramienta, y que certifica `localhost` y `mbp.local`. Incluimos `mbp.local` en nuestro archivo hosts y lanzamos:

```ps
ws --hostname mbp.local  --port 5000 --https
```

Como la CA no es reconocida por nuestro navegador, vemos el certificado, y lo grabamos como __PKCS__. A continuación lo importamos como _Trusted Root CA_.

Lanzamos el comando `ws` desde el directorio padre de _js13kpwa_, de modo que la aplicación podrá encontrarse en `https://mbp.local:5000/js13kpwa/`.

## Working with React Service Workers in Development Environment

If you explore the function `register()` in the file serviceWorker.js, you would notice that by default, it works only in production mode `(process.env.NODE_ENV === 'production'` is set as one of the conditions). There are two workarounds to it.

You can remove this condition from the function register() to enable it in development mode. However, this could potentially lead to some caching issues. A cleaner way of enabling service workers is to create a production version of your React app, and then serve it.

Para crear una app que incluya el soporte a trabajo offline, usamos esta plantilla:

```ps
create-react-app offline-app --template cra-template-pwa
```

This will give you two files you can move into your project, __serviceWorkerRegistration.js__ and __service-worker.js__.

### index.js

Now we actually need to register our service worker on launch. In your app index file, import the service worker.

```js
import { register as registerServiceWorker } from './serviceWorkerRegistration';
```

we then replace this:

```js
serviceWorkerRegistration.unregister();
```

with this:

```js
registerServiceWorker();
```

Service workers will only register/run in a production build, unless specifically enabled (see create-react-app documentation in the extras section below). This is because hot-reloading and service worker caching don't mix very well! This means you won't see the service worker running in Dev tools > Application > Service Workers.
