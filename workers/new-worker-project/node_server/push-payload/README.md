
# Ejecutar

Ejecutamos desde el directorio __`push-payload`__:

```ps
$Env:VAPID_PUBLIC_KEY='BM9buU66zSLmNnuShOZ27l3z1YuVXJOjXjQIY61Wxorr9WthUCEUsqYzUnXAkc1ujMuXGz5_vvFWFVelUSiYhMg'

$Env:VAPID_PRIVATE_KEY='5kpcqQ0Vjr6fNdTUFHAZMHHHb9q4JskCdXKF0GWvg6U'
```

```ps
node ./app
```

o para depurar

```ps
node --inspect .\app.js
```

Arranca el cliente

```ps
ws --hostname mbp.local  --port 5000 --https
```

# Push

With Push the sender of the data is a server to which our APP has sibscribed. When a notification is sent from the server, the APP receives the event with the data, and then can deal with it as required - for example, publising a Notification of the ones seen in the previous section.

The data exchange with the publication server is done by the service worker - outside the UI thread. The technology is still at a very early stage — some working examples use the Google Cloud Messaging platform, but are being rewritten to support VAPID (Voluntary Application Identification), which offers an extra layer of security for your app.

These are the steps that the APP has to follow:

1. Register a service worker. All the interation to subscribe an receive notifications is done in the service worker - so the UI thread is not affected
2. The Service Worker uses the navigator Push Manager to get a Subcription:

```js
navigator.serviceWorker.ready
.then(function(registration) {
  return registration.pushManager.getSubscription()
```

3. The code above returns a `Promise` that when evaluated will gives us the `PushSubscription`, or undefined if we have not subscribed earlier to the service. If there is not a Subscription, we create one:

```js
navigator.serviceWorker.ready
.then(function(registration) {
  // Use the PushManager to get the user's subscription to the push service.
  return registration.pushManager.getSubscription()
  .then(async function(subscription) {
    // If a subscription was found, return it.
    if (subscription) {
      return subscription;
    }
    return registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey
    });
```

4. When we have to create a subscription we use `pushManager.subscribe` available to the Service Worker. Notice that in order to create a subscription we need to set the public key. The public key will be matched in the server by the private key. The server will encrypt all the notifications before pushing them to the APP, and the APP will decrypt them with the public key. A way of getting the public key is to requesting the server for it:

```js
navigator.serviceWorker.ready
.then(function(registration) {
  return registration.pushManager.getSubscription()
  .then(async function(subscription) {
    // If a subscription was found, return it.
    if (subscription) {
      return subscription;
    }

    // Get the server's public key
    const response = await fetch('http://localhost:3000/push/vapidPublicKey');

    const vapidPublicKey = await response.text();
    // Chrome doesn't accept the base64-encoded (string) vapidPublicKey yet
    // urlBase64ToUint8Array() is defined in /tools.js
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

    return registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey
    });
```

5. El siguiete paso que tendría que hacer el work es el de registrarse - usando la subscripcion. De esta manera el servidor sabrá que deseamos recibir notificaciones.

```js
navigator.serviceWorker.ready
.then(function(registration) {
  return registration.pushManager.getSubscription()
  .then(async function(subscription) {
    if (subscription) {
      return subscription;
    }
    const response = await fetch('http://localhost:3000/push/vapidPublicKey');

    const vapidPublicKey = await response.text();
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
    return registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey
    });
  });
}).then(function(subscription) {
  console.log(`La subscripcion es ${subscription}`)
  
  // Send the subscription details to the server using the Fetch API.
  fetch('http://localhost:3000/push/register', {
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      subscription: subscription
    }),
  });
```

__Nota. En este ejemplo es un poco artificial, porque el servidor no guarda la subcripción. De echo en esta demo es la app la que le pide al servidor que nos envie una notificación. La perdirselo, le pasamos la subscripción - porque el servidor no la guardo al registranos__.

6. Finalmente, cuando el servidor publica una notificación el Service Worker la va a recibir con el evento `push`. En este ejemplo usamos el método `showNotification` para crear una notificación desde el Service Worker:

```js
self.addEventListener('push', function(event) {
  const payload = event.data ? event.data.text() : 'no payload';

  // Keep the service worker alive until the notification is created.
  event.waitUntil(
    // Show a notification with title 'ServiceWorker Cookbook' and use the payload
    // as the body.
    self.registration.showNotification('ServiceWorker Cookbook', {
      body: payload,
    })
  );
});
```
