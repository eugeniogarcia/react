# Introducción

## Instalacion

```ps
npm install --save workerize

```

```ps
npx serve
```

Podemos ver los resultados en la consola. Para ello abrir las Dev Tools del chrome.

## Ajustes para usar Workerize

[Workerize]("https://github.com/developit/workerize")

Especifica que el script es un modulo - en index.html:

```html
<script type="module" src="main.js"></script>
```

Importamos el módulo:

```js
import workerize from "./node_modules/workerize/dist/workerize.m.js";
```

Podemos crear un worker pasando un string con código o con una funcion.

## Workerize con un String

Lo que hacemos aquí es crear un nuevo thread, y ejecutar en el javascript que pasamos como argumento de workerize. En este caso el javascript esta exponiendo una funcion, así que podemos pasar argumentos cuando hacemos la llamada.

El worker se puede terminar con `terminate()`.

```js
let worker2 = workerize(`
    export function add(a, b) {
        console.log('Mensaje recibido desde un worker:',a,' ',b);
        // simula un retardo
        let start = Date.now();
        while (Date.now()-start < 500);
        return a + b;
    }
`);
```

El worker exporta la función add, así que podemos llamarla. Notese que la función retorna un `Promise`:

```js
(async () => {
    console.log('3 + 9 = ', await worker2.add(3, 9));
    console.log('1 + 2 = ', await worker2.add(1, 2));
})();
```

## Workerize con una funcion

Lo que hacemos aquí es crear un nuevo thread, y ejecutar en un runnable. El código a diferencia de lo que sucede en un thread de java sigue latente hasta que no se haga un `worker3.terminate()`. Esto significa que si hacemos un post de un mensaje, el listener en el worker lo tomara y procesara.

```js
let worker3 = workerize(
    ()=> {
        console.log('Arranca worker 3');
        this.onmessage = (e) => {
            console.log('Valor de entrada', e.data);
            // simula un retardo
            let start = Date.now();
            while (Date.now() - start < 500);
            this.postMessage('Hola main, la respuesta es '+(e.data*e.data));
        }
    });
worker3.onmessage = (e) => {
    console.log('Mensaje recibido desde el worker3:', e.data);
}
```

Podemos enviar un mensaje al thread:

```js
worker3.postMessage(3);
```
