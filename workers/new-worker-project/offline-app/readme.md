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

#### Registering the Service Worker

In the app.js file:

```js
if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./pwa-examples/js13kpwa/sw.js');
};
```

#### Lifecycle of a Service Worker

- Installation. __When registration is complete, the sw.js file is automatically downloaded__, then __installed__, and finally __activated__.

The service worker does not install until the code inside waitUntil is executed. It returns a promise — this approach is needed because installing may take some time, so we have to wait for it to finish.

caches is a special CacheStorage object available in the scope of the given Service Worker to enable saving data — saving to web storage won't work, because web storage is synchronous. With Service Workers, we use the Cache API instead.

- Activation. __There is also an activate event__, which is used in the same way as install. This __event is usually used to delete any files that are no longer necessary__ and clean up after the app in general. We don't need to do that in our app, so we'll skip it.

- Responding to fetches. We also have a __fetch event__ at our disposal, which fires every time an HTTP request is fired off from our app. This is very useful, as it __allows us to intercept requests and respond to them with custom responses__. Here is a simple usage example:

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

- Updates. There is still one point to cover: how do you __upgrade a Service Worker when a new version of the app containing new assets is available?__ The version number in the cache name is key to this:

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

## How to make PWAs installable

We can allow users to __install the web app on mobile and desktop browsers__ that support doing so. The installed web app can then be launched by users just as if it were any native app. This article explains how to achieve this using the web app's manifest.

These technologies allow the app to be launched directly from the device's home screen, rather than the user having to open the browser and then navigate to the site by using a bookmark or typing the URL. Your web app can sit next to native applications as first class citizens. This makes the web app easier to access; additionally, you can specify that the app be launched in fullscreen or standalone mode, thus removing the default browser user interface that would otherwise be present, creating an even more seamless and native-like feel.

### Requirements

To make the web site installable, it needs the following things in place:

- A web manifest, with the correct fields filled in
- The web site to be served from a secure (HTTPS) domain
- An icon to represent the app on the device
- A service worker registered, to allow the app to work offline (this is required only by Chrome for Android currently)

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

## Two APIs, one goal

The __Push API__ and __Notifications API__ are two separate APIs, but they work well together when you want to provide engaging functionality in your app.__Push is used to deliver new content from the server to the app without any client-side intervention__, and its operation is __handled by the app's service worker__. __Notifications can be used by the service worker to show new information to the user__, or at least alert them when something has been updated.

They work outside of the browser window, just like service workers, so updates can be pushed and notifications can be shown when the app's page is out of focus or even closed.

### Notifications

Let's start with notifications — they can work without push, but are very useful when combined with them. Let's look at them in isolation to begin with.

#### Request permission

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

__When the user confirms to receive notifications, the app can then show them__. The result of the user action can be default, granted or denied. The default option is chosen when the user won't make a choice, and the other two are set when the user clicks yes or no respectively.











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
