# Introducción

## Instalacion

No hay que instalar nada, simplemente creamos el javascript con el worker y la comunicación con los eventos - postmessage -. Una vez estamos, arrancamos el servidor:

```ps
npx serve
```

## Código

- Creamos una pagina web, index.html:

```html
<script src="main.js"></script>
```

- Creamos el script main.js:

```js
console.log("en main.js");
const worker=new Worker('worker.js');

worker.postMessage('Hola worker, como estas?');

worker.onmessage = (e) => {
    console.log('Mensaje recibido desde un worker:',e.data);
}
```

Por un lado hemos creado el worker:

```js
const worker=new Worker('worker.js');
```

Y nos comunicamos con él:

```js
worker.postMessage('Hola worker, como estas?');
```

Podemos recibir mensajes del worker:

```js
worker.onmessage = (e) => {
    console.log('Mensaje recibido desde un worker:',e.data);
}
```

- El worker:

```js
console.log('in worker')

this.onmessage = (e) => {
    console.log('Recibi un evento', e.data);
    this.postMessage('Hola main, como estas');
}
```

Creamos un listener para escuchar mensajes envados al worker/thread, y podemos contestar con un `postMessage`.
